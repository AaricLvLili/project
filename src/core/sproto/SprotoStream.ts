namespace Sproto {
	export class SprotoStream {

		private size: number;
		private pos: number;
		private buffer: Uint8Array;

		public constructor() {
			this.size = 128;
			this.pos = 0;
			this.buffer = new Uint8Array(this.size);
		}

		public get Position(): number {
			return this.pos;
		}

		public get Buffer(): Uint8Array {
			return this.buffer;
		}

		private _Expand(sz = 0): void {
			if (this.size - this.pos < sz) {
				var bak_sz = this.size;
				while (this.size - this.pos < sz) {
					this.size = this.size * 2;
				}

				if (this.size >= SprotoTypeSize.ENCODE_MAX_SIZE) {
					SprotoTypeSize.error("object is too large (>" + SprotoTypeSize.ENCODE_MAX_SIZE + ")");
				}

				var new_buffer: Uint8Array = new Uint8Array(this.size);
				for (var i = 0; i < bak_sz; i++) {
					new_buffer[i] = this.buffer[i];
				}
				this.buffer = new_buffer;
			}
		}

		public WriteByte(v: number): void {
			this._Expand(1);
			this.buffer[this.pos++] = v;
		}

		public Write(data: Uint8Array, offset: number, count: number): void {
			this._Expand(count);
			for (var i = 0; i < count; i++) {
				this.buffer[this.pos++] = data[offset + i];
			}
		}

		public Seek(offset: number, loc: SeekOrigin): number {
			switch (loc) {
				case SeekOrigin.Begin:
					this.pos = offset;
					break;
				case SeekOrigin.Current:
					this.pos += offset;
					break;
				case SeekOrigin.End:
					this.pos = this.size + offset;
					break;
			}

			this._Expand();
			return this.pos;
		}

		public Read(buffer: Uint8Array, offset: number, count: number): void {
			for (var i = 0; i < count; i++) {
				buffer[offset + i] = this.buffer[this.pos++];
			}
		}

		public MoveUp(position: number, up_count: number): void {
			if (up_count <= 0)
				return;

			var count = this.pos - position;
			for (var i = 0; i < count; i++) {
				this.buffer[position - up_count + i] = this.buffer[position + i];
			}
			this.pos -= up_count;
		}

		public Get(i: number): number {
			if (i < 0 || i >= this.size) {
				egret.error("invalid idx:" + i + "@get");
			}
			return this.buffer[i];
		}

		public Set(i: number, value: number): void {
			if (i < 0 || i >= this.size) {
				egret.error("invalid idx:" + i + "@set");
			}
			this.buffer[i] = value;
		}
	}
}