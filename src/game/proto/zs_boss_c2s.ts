// Generated by sprotodump. DO NOT EDIT!

namespace Sproto { 
	export class cs_zs_boss_rank_request extends Sproto.SprotoTypeBase {
		
		public bossId: number; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.bossId = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.bossId != undefined) {
				this.se.wi (this.bossId, 0);
			}

			return this.se.Close ();
		}
	}


}
