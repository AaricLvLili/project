// Generated by sprotodump. DO NOT EDIT!

namespace Sproto { 
	export class cs_one_gift_buy_test_request extends Sproto.SprotoTypeBase {
		
		public index: number; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.index = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.index != undefined) {
				this.se.wi (this.index, 0);
			}

			return this.se.Close ();
		}
	}


	export class cs_one_gift_rewards_request extends Sproto.SprotoTypeBase {
		
		public index: number; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.index = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.index != undefined) {
				this.se.wi (this.index, 0);
			}

			return this.se.Close ();
		}
	}


}

