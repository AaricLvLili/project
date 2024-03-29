// Generated by sprotodump. DO NOT EDIT!

namespace Sproto { 
	export class find_assets_data extends Sproto.SprotoTypeBase {
		
		public type: number; // tag 0
		public size: number; // tag 1
		public datas: reward_data[]; // tag 2
		public state: number; // tag 3
		public constructor(buffer: Uint8Array = null) {
			super(4, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.type = this.de.ri ();
					break;
				case 1:
					this.size = this.de.ri ();
					break;
				case 2:
					this.datas = this.de.roa(reward_data);
					break;
				case 3:
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

			if (this.type != undefined) {
				this.se.wi (this.type, 0);
			}

			if (this.size != undefined) {
				this.se.wi (this.size, 1);
			}

			if (this.datas != undefined) {
				this.se.woa (this.datas, 2);
			}

			if (this.state != undefined) {
				this.se.wi (this.state, 3);
			}

			return this.se.Close ();
		}
	}


	export class sc_find_assets_init_info_request extends Sproto.SprotoTypeBase {
		
		public datas: find_assets_data[]; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.datas = this.de.roa(find_assets_data);
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

