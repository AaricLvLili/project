namespace Sproto {
	export enum SeekOrigin {
		Begin,
		Current,
		End,
	}

	export class SByteArray {

		private m_Data: DataView;

		private m_Position: number;
		private write_position: number;

		public constructor() {
			this.m_Data = new DataView(new ArrayBuffer(0));
		}

		public get Position(): number {
			return this.m_Position;
		}

		public set Position(value: number) {
			this.m_Position = value;
			this.write_position = value > this.write_position ? value : this.write_position;
		}

		public get Buffer(): ArrayBuffer {
			return this.m_Data.buffer;
		}

		public set Buffer(value: ArrayBuffer) {
			this.m_Data = new DataView(value);
		}

		public get Length(): number {
			return this.write_position;
		}

		public set Length(value: number) {
			this.write_position = value;
			let tmp: Uint8Array = new Uint8Array(new ArrayBuffer(value));
			let byteLength: number = this.m_Data.buffer.byteLength;
			if (byteLength > value) {
				this.m_Position = value;
			}
			let length: number = Math.min(byteLength, value);
			tmp.set(new Uint8Array(this.m_Data.buffer, 0, length));
			this.Buffer = tmp.buffer;
		}

		public get mBytesAvailable(): number {
			return this.m_Data.byteLength - this.m_Position;
		}

		public Seek(pos: number, seekOrigin: SeekOrigin) {
			switch (seekOrigin) {
				case SeekOrigin.Begin:
					this.Position = pos;
					break;

				case SeekOrigin.Current:
					this.Position += pos;
					break;

				case SeekOrigin.End:
					this.Position = this.Length + pos;
					break;
			}
		}

		public WriteByte(value: number): void {
			this.ValidateBuffer(1);
			this.m_Data.setInt8(this.Position++, value);
		}

		private ValidateBuffer(len: number, needReplace: boolean = false): void {
			this.write_position = len > this.write_position ? len : this.write_position;
			len += this.m_Position;
			if (this.m_Data.byteLength < len || needReplace) {
				let tmp: Uint8Array = new Uint8Array(new ArrayBuffer(len));
				let length = Math.min(this.m_Data.buffer.byteLength, len);
				tmp.set(new Uint8Array(this.m_Data.buffer, 0, length));
				this.Buffer = tmp.buffer;
			}
		}

		public WriteBytes(bytes: Uint8Array, offset: number = 0, length: number = 0): void {
			let writeLength: number;
			if (offset < 0) {
				return;
			}
			if (length < 0) {
				return;
			} else if (length == 0) {
				writeLength = bytes.length - offset;
			} else {
				writeLength = Math.min(bytes.length - offset, length);
			}
			if (writeLength > 0) {
				this.ValidateBuffer(writeLength);

				let tmp_data = new DataView(bytes.buffer);
				let length = writeLength;
				let BYTES_OF_UINT32 = 4;
				for (; length > BYTES_OF_UINT32; length -= BYTES_OF_UINT32) {
					this.m_Data.setUint32(this.m_Position, tmp_data.getUint32(offset));
					this.Position += BYTES_OF_UINT32;
					offset += BYTES_OF_UINT32;
				}
				for (; length > 0; length--) {
					this.m_Data.setUint8(this.Position++, tmp_data.getUint8(offset++));
				}
			}
		}

		public ReadBytes(bytes: Uint8Array, offset: number = 0, length: number = 0): void {
			if (length == 0) {
				length = this.mBytesAvailable;
			} else if (!this.Validate(length)) {
				return null;
			}
			for (let i = 0; i < length; i++) {
				bytes[i + offset] = this.m_Data.getUint8(this.Position++);
			}
		}

		public Validate(len: number): boolean {
			if (this.m_Data.byteLength > 0 && this.m_Position + len <= this.m_Data.byteLength) {
				return true;
			} else {
				egret.$error(1025);
			}
		}
	}
}