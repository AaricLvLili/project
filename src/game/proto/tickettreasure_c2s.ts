// Generated by sprotodump. DO NOT EDIT!

namespace Sproto { 
	export class cs_ticket_treasure_hunt_request extends Sproto.SprotoTypeBase {
		
		public type: number; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.type = this.de.ri ();
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

			return this.se.Close ();
		}
	}


	export class cs_ticket_treasure_record_request extends Sproto.SprotoTypeBase {
		
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


	export class cs_ticket_treasure_reward_request extends Sproto.SprotoTypeBase {
		
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


}

