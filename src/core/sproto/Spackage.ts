namespace Sproto {
	export class Spackage extends SprotoTypeBase {

		public type: number;
		public session: number;

		public constructor() {
			super(2)
		}

		protected Decode(): void {
			let tag = -1;
			while ((tag = this.de.rt()) != -1) {
				switch (tag) {
					case 0: this.type = this.de.ri(); break;
					case 1: this.session = this.de.ri(); break;
					default: this.de.ReadUnknowData(); break;
				}
			}
		}

		public EncodeStream(stream: SprotoStream): number {
			this.se.Open(stream);
			if (this.type != undefined) {
				this.se.wi(this.type, 0);
			}
			if (this.session != undefined) {
				this.se.wi(this.session, 1);
			}
			return this.se.Close();
		}
	}
}