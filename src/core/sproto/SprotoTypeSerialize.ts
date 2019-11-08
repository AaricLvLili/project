namespace Sproto {
	export class SprotoTypeSerialize {
		static readonly sizeof_uint64 = 8;
		static readonly sizeof_uint32 = 4;

		private m_HeaderIdx: number;
		private m_HeaderSz: number;
		private m_HeaderCap = SprotoTypeSize.SIZEOF_HEADER;

		private m_DataView: DataView

		private m_Data: SprotoStream;
		private m_DataIdx: number;

		private m_Lasttag: number = -1;
		private m_Index: number = 0;

		public constructor(max_field_count: number) {
			this.m_HeaderSz = SprotoTypeSize.SIZEOF_HEADER + max_field_count * SprotoTypeSize.SIZEOF_FIELD;
			this.m_DataView = new DataView(new ArrayBuffer(8))
		}

		private _SetHeaderFn(fn: number): void {
			this.m_Data.Set(this.m_HeaderIdx - 2, fn & 0xff)
			this.m_Data.Set(this.m_HeaderIdx - 1, (fn >> 8) & 0xff)
		}

		private _WriteHeaderRecord(record: number): void {
			this.m_Data.Set(this.m_HeaderIdx + this.m_HeaderCap - 2, record & 0xff)
			this.m_Data.Set(this.m_HeaderIdx + this.m_HeaderCap - 1, (record >> 8) & 0xff)

			this.m_HeaderCap += 2
			this.m_Index++;
		}

		private _WriteUint32ToUint64Sign(is_negative: boolean): void {
			let v = is_negative ? 0xff : 0

			this.m_Data.WriteByte(v)
			this.m_Data.WriteByte(v)
			this.m_Data.WriteByte(v)
			this.m_Data.WriteByte(v)
		}

		private _WriteTag(tag: number, value: number): void {
			let stag = tag - this.m_Lasttag - 1;
			if (stag > 0) {
				stag = (stag - 1) * 2 + 1;
				if (stag > 0xffff)
					SprotoTypeSize.error("tag is too big.");

				this._WriteHeaderRecord(stag);
			}

			this._WriteHeaderRecord(value);
			this.m_Lasttag = tag;
		}

		private _WriteInt32(v: number): void {
			// this.m_Data.WriteByte((v & 0xff));
			// this.m_Data.WriteByte(((v >> 8) & 0xff));
			// this.m_Data.WriteByte(((v >> 16) & 0xff));
			// this.m_Data.WriteByte(((v >> 24) & 0xff));
			this.m_DataView.setInt32(0, v)
			this.m_Data.WriteByte(this.m_DataView.getUint8(3))
			this.m_Data.WriteByte(this.m_DataView.getUint8(2))
			this.m_Data.WriteByte(this.m_DataView.getUint8(1))
			this.m_Data.WriteByte(this.m_DataView.getUint8(0))
		}

		private _WriteUint64(v: number): void {
			// this.m_DataView.setFloat64(0, v)
			// this.m_Data.WriteByte(this.m_DataView.getUint8(7))
			// this.m_Data.WriteByte(this.m_DataView.getUint8(6))
			// this.m_Data.WriteByte(this.m_DataView.getUint8(5))
			// this.m_Data.WriteByte(this.m_DataView.getUint8(4))
			// this.m_Data.WriteByte(this.m_DataView.getUint8(3))
			// this.m_Data.WriteByte(this.m_DataView.getUint8(2))
			// this.m_Data.WriteByte(this.m_DataView.getUint8(1))
			// this.m_Data.WriteByte(this.m_DataView.getUint8(0))

			// this.m_Data.WriteByte(v & 0xff);
			// this.m_Data.WriteByte((v >> 8) & 0xff);
			// this.m_Data.WriteByte((v >> 16) & 0xff);
			// this.m_Data.WriteByte((v >> 24) & 0xff);
			// this.m_Data.WriteByte((v >> 32) & 0xff);
			// this.m_Data.WriteByte((v >> 40) & 0xff);
			// this.m_Data.WriteByte((v >> 48) & 0xff);
			// this.m_Data.WriteByte((v >> 56) & 0xff);


			this.m_Data.WriteByte(v & 0xff);
			this.m_Data.WriteByte((v / Math.pow(2, 8)) & 0xff);
			this.m_Data.WriteByte((v / Math.pow(2, 16)) & 0xff);
			this.m_Data.WriteByte((v / Math.pow(2, 24)) & 0xff);
			this.m_Data.WriteByte((v / Math.pow(2, 32)) & 0xff);
			this.m_Data.WriteByte((v / Math.pow(2, 40)) & 0xff);
			this.m_Data.WriteByte((v / Math.pow(2, 48)) & 0xff);
			this.m_Data.WriteByte((v / Math.pow(2, 56)) & 0xff);

		}

		private _FillSize(sz: number): void {
			if (sz < 0)
				SprotoTypeSize.error("fill invaild size.");

			this._WriteInt32(sz);
		}

		private _EncodeInteger(v: number): number {
			this._FillSize(4);

			this._WriteInt32(v);
			return SprotoTypeSize.SIZEOF_LENGTH + 4
		}

		private _EncodeUint64(v: number): number {
			this._FillSize(SprotoTypeSerialize.sizeof_uint64);

			this._WriteUint64(v);
			return SprotoTypeSize.SIZEOF_LENGTH + SprotoTypeSerialize.sizeof_uint64;
		}

		private _EncodeString(str: string): number {
			let sArray: Uint8Array = BitUtil.encodeUTF8(str);
			this._FillSize(sArray.length);
			this.m_Data.Write(sArray, 0, sArray.length);

			return SprotoTypeSize.SIZEOF_LENGTH + sArray.length;
		}

		private _EncodeStruct(obj: SprotoTypeBase): number {
			let szPos = this.m_Data.Position;

			this.m_Data.Seek(SprotoTypeSize.SIZEOF_LENGTH, SeekOrigin.Current);
			let len = obj.EncodeStream(this.m_Data);
			let curPos = this.m_Data.Position;

			this.m_Data.Seek(szPos, SeekOrigin.Begin);
			this._FillSize(len);
			this.m_Data.Seek(curPos, SeekOrigin.Begin);

			return SprotoTypeSize.SIZEOF_LENGTH + len;
		}

		private _Clear(): void {
			this.m_Index = 0;
			this.m_HeaderIdx = 2;
			this.m_Lasttag = -1;
			this.m_Data = null;
			this.m_HeaderCap = SprotoTypeSize.SIZEOF_HEADER;
		}

		public wi(integer: number, tag: number): void {
            this.m_DataView.setInt32(0, integer)
			let sz = this.m_DataView.getInt32(0) == integer ? SprotoTypeSerialize.sizeof_uint32 : SprotoTypeSerialize.sizeof_uint64
			// let vh = integer >> 31;
			// let vh = this.m_DataView.getInt32(0);
			// let sz = (vh == 0 || vh == -1) ? (SprotoTypeSerialize.sizeof_uint32) : (SprotoTypeSerialize.sizeof_uint64);
			let value = 0;

			if (sz == SprotoTypeSerialize.sizeof_uint32) {
				let v = integer;
				if (v == 0 || v == 1) {
					value = ((v + 1) * 2);
					sz = 2;
				} else {
					sz = this._EncodeInteger(v);
				}
				// if (v < 0x7fff) {
				// 	value = ((v + 1) * 2);
				// 	sz = 2;
				// } else {
					// sz = this._EncodeInteger(v);
				// }

			} else if (sz == SprotoTypeSerialize.sizeof_uint64) {
				let v = integer;
				sz = this._EncodeUint64(v);

			} else {
				SprotoTypeSize.error("invaild integer size.");
			}

			this._WriteTag(tag, value);
		}

		public wia(integer_list: number[], tag: number): void {
			if (integer_list == null || integer_list.length <= 0)
				return;

			let sz_pos = this.m_Data.Position;
			this.m_Data.Seek(sz_pos + SprotoTypeSize.SIZEOF_LENGTH, SeekOrigin.Begin);

			let begin_pos = this.m_Data.Position;
			let intlen = SprotoTypeSerialize.sizeof_uint32;
			this.m_Data.Seek(begin_pos + 1, SeekOrigin.Begin);

			for (let index = 0; index < integer_list.length; index++) {
				let v = integer_list[index];
				// let vh = v >> 31;
				let integer = v
				this.m_DataView.setInt32(0, integer)
				let sz = this.m_DataView.getInt32(0) == integer? (SprotoTypeSerialize.sizeof_uint32) : (SprotoTypeSerialize.sizeof_uint64);
				// let sz = (vh == 0 || vh == -1) ? (SprotoTypeSerialize.sizeof_uint32) : (SprotoTypeSerialize.sizeof_uint64);

				if (sz == SprotoTypeSerialize.sizeof_uint32) {
					this._WriteInt32(v);
					if (intlen == SprotoTypeSerialize.sizeof_uint64) {
						let is_negative = ((v & 0x80000000) == 0) ? (false) : (true);
						this._WriteUint32ToUint64Sign(is_negative);
					}

				} else if (sz == SprotoTypeSerialize.sizeof_uint64) {
					if (intlen == SprotoTypeSerialize.sizeof_uint32) {
						this.m_Data.Seek(begin_pos + 1, SeekOrigin.Begin);
						for (let i = 0; i < index; i++) {
							let value = (integer_list[i]);
							this._WriteUint64(value);
						}
						intlen = SprotoTypeSerialize.sizeof_uint64;
					}
					this._WriteUint64(v);

				} else {
					SprotoTypeSize.error("invalid integer size(" + sz + ")");
				}
			}

			let cur_pos = this.m_Data.Position;
			this.m_Data.Seek(begin_pos, SeekOrigin.Begin);
			this.m_Data.WriteByte(intlen);

			let size = (cur_pos - begin_pos);
			this.m_Data.Seek(sz_pos, SeekOrigin.Begin);
			this._FillSize(size);

			this.m_Data.Seek(cur_pos, SeekOrigin.Begin);
			this._WriteTag(tag, 0);
		}


		public wb(b: boolean, tag: number): void {
			let v = (b) ? (1) : (0);
			this.wi(v, tag);
		}

		public wba(b_list: boolean[], tag: number): void {
			if (b_list == null || b_list.length <= 0)
				return;

			this._FillSize(b_list.length);
			for (let i = 0; i < b_list.length; i++) {
				let v = ((b_list[i]) ? (1) : (0));
				this.m_Data.WriteByte(v);
			}

			this._WriteTag(tag, 0);
		}


		public ws(str: string, tag: number): void {
			this._EncodeString(str);
			this._WriteTag(tag, 0);
		}

		public wsa(str_list: string[], tag: number): void {
			if (str_list == null || str_list.length <= 0)
				return;
			let sz = 0;
			for (let v in str_list) {
				sz += SprotoTypeSize.SIZEOF_LENGTH + BitUtil.UTF8ByteCount(v);
			}
			this._FillSize(sz);

			for (let v in str_list) {
				this._EncodeString(v);
			}

			this._WriteTag(tag, 0);
		}


		public wo(obj: SprotoTypeBase, tag: number): void {
			this._EncodeStruct(obj);
			this._WriteTag(tag, 0);
		}

		private WriteSet(func: Function, tag: number): void {
			let sz_pos = this.m_Data.Position;
			this.m_Data.Seek(SprotoTypeSize.SIZEOF_LENGTH, SeekOrigin.Current);

			func();

			let cur_pos = this.m_Data.Position;
			let sz = (cur_pos - sz_pos - SprotoTypeSize.SIZEOF_LENGTH);
			this.m_Data.Seek(sz_pos, SeekOrigin.Begin);
			this._FillSize(sz);

			this.m_Data.Seek(cur_pos, SeekOrigin.Begin);

			this._WriteTag(tag, 0);
		}


		public woa(obj_list: SprotoTypeBase[], tag: number): void {
			if (obj_list == null || obj_list.length <= 0)
				return;

			let func = () => {
				for (let v of obj_list) {
					this._EncodeStruct(v);
				}
			};

			this.WriteSet(func, tag);
		}

		public wod(map: any, tag: number): void {
			if (map == null || map.length <= 0)
				return;

			let func = () => {
				for (var pair of map) {
					this._EncodeStruct(map[pair]);
				}
			};

			this.WriteSet(func, tag);
		}

		public Open(stream: SprotoStream): void {
			this._Clear();

			this.m_Data = stream;
			this.m_HeaderIdx = stream.Position + this.m_HeaderCap;
			this.m_DataIdx = this.m_Data.Seek(this.m_HeaderSz, SeekOrigin.Current);
		}


		public Close(): number {
			this._SetHeaderFn(this.m_Index);

			let up_count = this.m_HeaderSz - this.m_HeaderCap;
			this.m_Data.MoveUp(this.m_DataIdx, up_count);

			let count = this.m_Data.Position - this.m_HeaderIdx + SprotoTypeSize.SIZEOF_HEADER;

			this._Clear();

			return count;
		}
	}
}