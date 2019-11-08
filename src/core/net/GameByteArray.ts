class GameByteArray extends egret.ByteArray {

	endian: string = egret.Endian.LITTLE_ENDIAN;

	public constructor() {
		super();
	}

	public readString(): string {
		var s = this.readUTF();
		this.position++;
		return s;
	};
	// 对于协议中要读取8字节Int64的字段，分两种情况：如果不需要加减等运算的字段，比如handle，
	// 用readDouble函数读取，如果是需要运算的数字类型，比如金币等，用readNumber读取
	// 返回uint64类型的readInt64以后不要使用了,已经使用的地方慢慢修改过来
	public readNumber(): number {
		var i64 = new uint64(this);
		var str = i64.toString();
		return +str;
	};
	// 对应readnumer
	public writeNumber(val) {
		var i64 = uint64.stringToUint64(val.toString());
		this.writeInt64(i64);
	};
	public writeInt64(bigInt) {
		this.writeUnsignedInt(bigInt._lowUint);
		this.writeUnsignedInt(bigInt._highUint);
	};
	public writeString(value: string) {
		this.writeUTF(value);
		this.writeByte(0);
	};
	public writeCmd(id: number, subId: number) {
		this.writeByte(id);
		this.writeByte(subId);
	};
}
window["GameByteArray"]=GameByteArray