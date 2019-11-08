namespace Sproto {
	export abstract class SprotoTypeBase {

		protected se: SprotoTypeSerialize;
		protected de: SprotoTypeDeserialize;

		public constructor(max_field_count: number, buffer: Uint8Array = null) {
			this.se = new SprotoTypeSerialize(max_field_count);
			if (buffer != null) {
				this.de = SprotoTypeDeserialize.CreateByArray(buffer);
				this.Decode();
			} else {
				this.de = SprotoTypeDeserialize.Create();
			}
		}

		public InitReader(reader: SprotoTypeReader) {
			this.Clear();
			this.de.InitReader(reader);
			this.Decode();
			return this.de.Size();
		}

		public InitArray(buffer: Uint8Array, offset: number = 0) {
			this.Clear();
			this.de.InitArray(buffer, offset);
			this.Decode();
			return this.de.Size();
		}

		public abstract EncodeStream(stream: SprotoStream): number;
		protected abstract Decode(): void;

		public Encode(): Uint8Array {
			let stream: SprotoStream = new SprotoStream();
			this.EncodeStream(stream);
			let len = stream.Position;

			let buffer = new Uint8Array(len);
			stream.Seek(0, SeekOrigin.Begin);
			stream.Read(buffer, 0, len);

			return buffer;
		}

		public Clear(): void {
			this.de.Clear();
		}
	}
}