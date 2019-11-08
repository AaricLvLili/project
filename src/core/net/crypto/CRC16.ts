class CRC16 {
	public constructor() {
	}

	public static update (bytes, offset?: number, length?: number) {
        if (offset === void 0) { offset = 0; }
        if (length === void 0) { length = 0; }
        var c = 0;
        var index = 0;
        if (length == 0) {
            length = bytes.length;
        }
        bytes.position = offset;
        for (var i = offset; i < length; ++i) {
            index = (CRC16.CRCBitReflect(bytes.readByte(), 8) & 0xFF) ^ ((c >> 8) & 0xFFFFFF);
            index &= 0xFF;
            c = CRC16.CRCTable[index] ^ ((c << 8) & 0xFFFFFF00);
        }
        return (CRC16.CRCBitReflect(c, 16) ^ 0) & 0xFFFF;
    };
    public static makeCRCTable () {
        var c = 0;
        var crcTable = new Array(256);
        for (var i = 0; i < 256; ++i) {
            c = (i << 8) & 0xFFFFFF00;
            for (var j = 0; j < 8; ++j) {
                c = (c & 0x8000) ? ((c << 1) & 0xFFFFFFFE) ^ CRC16.POLYNOMIAL : ((c << 1) & 0xFFFFFFFE);
            }
            crcTable[i] = c;
        }
        return crcTable;
    };
    public static CRCBitReflect (input, bitCount) {
        var out = 0;
        var x = 0;
        bitCount--;
        for (var i = 0; i <= bitCount; ++i) {
            x = bitCount - i;
            if (input & 1) {
                out |= (1 << x) & CRC16.DropBits[x];
            }
            input = (input >> 1) & 0x7FFFFFFF;
        }
        return out;
    };
    public static POLYNOMIAL = 0x1021; // CRC16校验方式的多项式
    public static CRCTable = CRC16.makeCRCTable();
    // 反转数据的比特位, 反转后MSB为1.
    // 反转前: 1110100011101110 0010100111100000
    // 反转后: 1111001010001110 1110001011100000
    public static DropBits = [
        0xFFFFFFFF, 0xFFFFFFFE, 0xFFFFFFFC, 0xFFFFFFF8,
        0xFFFFFFF0, 0xFFFFFFE0, 0xFFFFFFC0, 0xFFFFFF80,
        0xFFFFFF00, 0xFFFFFE00, 0xFFFFFC00, 0xFFFFF800,
        0xFFFFF000, 0xFFFFE000, 0xFFFFC000, 0xFFFF8000
    ];
}
window["CRC16"]=CRC16