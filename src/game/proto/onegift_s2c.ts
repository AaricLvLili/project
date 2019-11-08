// Generated by sprotodump. DO NOT EDIT!

namespace Sproto { 
	export class gift_base extends Sproto.SprotoTypeBase {
		
		public index: number; // tag 0
		public num: number; // tag 1
		public statu: number; // tag 2
		public constructor(buffer: Uint8Array = null) {
			super(3, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.index = this.de.ri ();
					break;
				case 1:
					this.num = this.de.ri ();
					break;
				case 2:
					this.statu = this.de.ri ();
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

			if (this.num != undefined) {
				this.se.wi (this.num, 1);
			}

			if (this.statu != undefined) {
				this.se.wi (this.statu, 2);
			}

			return this.se.Close ();
		}
	}


	export class sc_one_gift_request extends Sproto.SprotoTypeBase {
		
		public list: gift_base[]; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.list = this.de.roa(gift_base);
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.list != undefined) {
				this.se.woa (this.list, 0);
			}

			return this.se.Close ();
		}
	}


}

