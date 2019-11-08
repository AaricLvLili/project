namespace Sproto {
	export class SprotoTypeReader {

		private buffer: Uint8Array;
		private begin: number;
		private pos: number;
		private size: number;

		public static Create(): SprotoTypeReader {
			return new SprotoTypeReader();
		}

		public static CreateByArg(buffer: Uint8Array, offset: number, size: number): SprotoTypeReader {
			let data = new SprotoTypeReader();
			data.Init(buffer, offset, size);
			return data
		}

		private constructor() {

		}

		public get Buffer(): Uint8Array {
			return this.buffer;
		}

		public get Position(): number {
			return this.pos - this.begin;
		}

		public get Offset(): number {
			return this.pos;
		}

		public get Length(): number {
			return this.size - this.begin;
		}

		public Init(buffer: Uint8Array, offset: number, size: number): void {
			this.begin = offset;
			this.pos = offset;
			this.buffer = buffer;
			this.size = offset + size;
			this.check();
		}

		private check(): void {
			if (this.pos > this.size || this.begin > this.pos) {
				SprotoTypeSize.error("invalid pos.");
			}
		}

		public ReadByte(): number {
			this.check();
			return this.buffer[this.pos++];
		}

		public Seek(offset: number): void {
			this.pos = this.begin + offset;
			this.check();
		}

		public Read(data: Uint8Array, offset: number, size: number): void {
			var cur_pos = this.pos;
			this.pos += size;
			this.check();

			for (var i = cur_pos; i < this.pos; i++) {
				data[offset + i - cur_pos] = this.buffer[i];
			}
		}
	}
}