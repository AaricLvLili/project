// Generated by sprotodump. DO NOT EDIT!

namespace Sproto { 
	export class cs_zs_get_exp_request extends Sproto.SprotoTypeBase {
		
		public type: number; // tag 0
		public itemid: number; // tag 1
		public constructor(buffer: Uint8Array = null) {
			super(2, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.type = this.de.ri ();
					break;
				case 1:
					this.itemid = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.type != undefined) {
				this.se.wi (this.type, 0);
			}

			if (this.itemid != undefined) {
				this.se.wi (this.itemid, 1);
			}

			return this.se.Close ();
		}
	}


	export class cs_zs_uplevel_request extends Sproto.SprotoTypeBase {
		
		public constructor(buffer: Uint8Array = null) {
			super(0, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			return this.se.Close ();
		}
	}


}

