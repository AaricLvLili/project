// Generated by sprotodump. DO NOT EDIT!

namespace Sproto { 
	export class luckypackage_row extends Sproto.SprotoTypeBase {
		
		public id: number; // tag 0
		public time: number; // tag 1
		public num: number; // tag 2
		public constructor(buffer: Uint8Array = null) {
			super(3, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.id = this.de.ri ();
					break;
				case 1:
					this.time = this.de.ri ();
					break;
				case 2:
					this.num = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.id != undefined) {
				this.se.wi (this.id, 0);
			}

			if (this.time != undefined) {
				this.se.wi (this.time, 1);
			}

			if (this.num != undefined) {
				this.se.wi (this.num, 2);
			}

			return this.se.Close ();
		}
	}


	export class sc_luckypackage_active_res_request extends Sproto.SprotoTypeBase {
		
		public id: number; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.id = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.id != undefined) {
				this.se.wi (this.id, 0);
			}

			return this.se.Close ();
		}
	}


	export class sc_luckypackage_res_request extends Sproto.SprotoTypeBase {
		
		public datas: luckypackage_row[]; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.datas = this.de.roa(luckypackage_row);
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.datas != undefined) {
				this.se.woa (this.datas, 0);
			}

			return this.se.Close ();
		}
	}


}

