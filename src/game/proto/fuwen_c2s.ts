// Generated by sprotodump. DO NOT EDIT!

namespace Sproto { 
	export class cs_fuwen_equipup_request extends Sproto.SprotoTypeBase {
		
		public itemHandle: number; // tag 0
		public roleID: number; // tag 1
		public pos: number; // tag 2
		public constructor(buffer: Uint8Array = null) {
			super(3, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.itemHandle = this.de.ri ();
					break;
				case 1:
					this.roleID = this.de.ri ();
					break;
				case 2:
					this.pos = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.itemHandle != undefined) {
				this.se.wi (this.itemHandle, 0);
			}

			if (this.roleID != undefined) {
				this.se.wi (this.roleID, 1);
			}

			if (this.pos != undefined) {
				this.se.wi (this.pos, 2);
			}

			return this.se.Close ();
		}
	}


	export class cs_fuwen_open_request extends Sproto.SprotoTypeBase {
		
		public roleID: number; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.roleID = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.roleID != undefined) {
				this.se.wi (this.roleID, 0);
			}

			return this.se.Close ();
		}
	}


}

