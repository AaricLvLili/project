// Generated by sprotodump. DO NOT EDIT!

namespace Sproto { 
	export class cs_legend_dress_request extends Sproto.SprotoTypeBase {
		
		public roleIndex: number; // tag 0
		public legendDress: number; // tag 1
		public constructor(buffer: Uint8Array = null) {
			super(2, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.roleIndex = this.de.ri ();
					break;
				case 1:
					this.legendDress = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.roleIndex != undefined) {
				this.se.wi (this.roleIndex, 0);
			}

			if (this.legendDress != undefined) {
				this.se.wi (this.legendDress, 1);
			}

			return this.se.Close ();
		}
	}


}
