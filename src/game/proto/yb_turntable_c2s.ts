// Generated by sprotodump. DO NOT EDIT!

namespace Sproto { 
	export class cs_yb_roll_start_request extends Sproto.SprotoTypeBase {
		
		public activityId: number; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.activityId = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.activityId != undefined) {
				this.se.wi (this.activityId, 0);
			}

			return this.se.Close ();
		}
	}


	export class cs_yb_turntable_info_request extends Sproto.SprotoTypeBase {
		
		public activityId: number; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.activityId = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.activityId != undefined) {
				this.se.wi (this.activityId, 0);
			}

			return this.se.Close ();
		}
	}


}
