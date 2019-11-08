/**
 * 数据加密解密处理类
 *
 */
class Encrypt {
    public constructor() {
    }
    public static encode(inBuff, offset?: number, length?: number) {
        if (offset === void 0) { offset = 0; }
        if (length === void 0) { length = 0; }
        if (offset >= inBuff.length)
            return 0;
        var end = length ? offset + length : inBuff.length;
        if (end > inBuff.length)
            end = inBuff.length;
        inBuff.position = offset;
        for (var i = offset; i < end; ++i) {
            var byte = inBuff.readByte();
            byte ^= Encrypt.sKeyBuff[i % 4];
            inBuff.position--;
            inBuff.writeByte(byte);
        }
        return end - offset;
    };
    public static decode(inBuff, offset?: number, length?: number) {
        if (offset === void 0) { offset = 0; }
        if (length === void 0) { length = 0; }
        // 当前的加密算法和解密算法是一样的，反向操作
        return Encrypt.encode(inBuff, offset, length);
    };
    public static getCRC16(bytes, length?: number) {
        if (length === void 0) { length = 0; }
        return CRC16.update(bytes, 0, length);
    };
    public static getCRC16ByPos(bytes, offset?: number, length?: number) {
        if (offset === void 0) { offset = 0; }
        if (length === void 0) { length = 0; }
        return CRC16.update(bytes, offset, length);
    };
    public static getCheckKey() {
        var bytes = new egret.ByteArray();
        bytes.endian = egret.Endian.LITTLE_ENDIAN;
        bytes.writeUnsignedInt(Encrypt.sKey);
        var ck = CRC16.update(bytes);
        return ck;
    };
    public static getSelfSalt() {
        return Encrypt.sSelfSalt;
    };
    public static getTargetSalt() {
        return Encrypt.sTargetSalt;
    };
    public static setTargetSalt(value) {
        Encrypt.sTargetSalt = value;
        Encrypt.makeKey();
    };
    public static makeSalt() {
        var d = new Date();
        return Math.random() * d.getTime();
    };
    public static makeKey() {
        Encrypt.sKey = (Encrypt.sSelfSalt ^ Encrypt.sTargetSalt) + 8254;
        for (var i = 0; i < 4; ++i) {
            Encrypt.sKeyBuff[i] = (Encrypt.sKey & (0xFF << (i << 3))) >> (i << 3);
        }
    };
    public static sSelfSalt = Encrypt.makeSalt();
    public static sKeyBuff = new Array(4);
    private static sKey;
    private static sTargetSalt;
}
window["Encrypt"]=Encrypt