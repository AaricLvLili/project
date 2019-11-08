// Generated by sprotodump. DO NOT EDIT!

namespace Sproto { 
	export class sc_vip_update_data_request extends Sproto.SprotoTypeBase {
		
		public lv: number; // tag 0
		public exp: number; // tag 1
		public state: number; // tag 2
		public constructor(buffer: Uint8Array = null) {
			super(3, buffer);
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
					this.state = this.de.ri ();
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

			if (this.state != undefined) {
				this.se.wi (this.state, 2);
			}

			return this.se.Close ();
		}
	}


	export class sc_vip_update_exp_request extends Sproto.SprotoTypeBase {
		
		public lv: number; // tag 0
		public exp: number; // tag 1
		public constructor(buffer: Uint8Array = null) {
			super(2, buffer);
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

			return this.se.Close ();
		}
	}


	export class sc_vip_update_state_request extends Sproto.SprotoTypeBase {
		
		public state: number; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.state = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.state != undefined) {
				this.se.wi (this.state, 0);
			}

			return this.se.Close ();
		}
	}


}

