// Generated by sprotodump. DO NOT EDIT!

namespace Sproto { 
	export class sc_zs_data_request extends Sproto.SprotoTypeBase {
		
		public lv: number; // tag 0
		public exp: number; // tag 1
		public expupCount: number; // tag 2
		public normalupCount: number; // tag 3
		public highupCount: number; // tag 4
		public constructor(buffer: Uint8Array = null) {
			super(5, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.lv = this.de.ri ();
					break;
				case 1:
					this.exp = this.de.ri ();
					break;
				case 2:
					this.expupCount = this.de.ri ();
					break;
				case 3:
					this.normalupCount = this.de.ri ();
					break;
				case 4:
					this.highupCount = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.lv != undefined) {
				this.se.wi (this.lv, 0);
			}

			if (this.exp != undefined) {
				this.se.wi (this.exp, 1);
			}

			if (this.expupCount != undefined) {
				this.se.wi (this.expupCount, 2);
			}

			if (this.normalupCount != undefined) {
				this.se.wi (this.normalupCount, 3);
			}

			if (this.highupCount != undefined) {
				this.se.wi (this.highupCount, 4);
			}

			return this.se.Close ();
		}
	}


}

