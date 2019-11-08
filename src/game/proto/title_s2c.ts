// Generated by sprotodump. DO NOT EDIT!

namespace Sproto { 
	export class sc_title_add_request extends Sproto.SprotoTypeBase {
		
		public titleid: number; // tag 0
		public titleEndTime: number; // tag 1
		public constructor(buffer: Uint8Array = null) {
			super(2, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.titleid = this.de.ri ();
					break;
				case 1:
					this.titleEndTime = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.titleid != undefined) {
				this.se.wi (this.titleid, 0);
			}

			if (this.titleEndTime != undefined) {
				this.se.wi (this.titleEndTime, 1);
			}

			return this.se.Close ();
		}
	}


	export class sc_title_del_request extends Sproto.SprotoTypeBase {
		
		public titleid: number; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.titleid = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.titleid != undefined) {
				this.se.wi (this.titleid, 0);
			}

			return this.se.Close ();
		}
	}


	export class sc_title_list_request extends Sproto.SprotoTypeBase {
		
		public titles: title_data[]; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.titles = this.de.roa(title_data);
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.titles != undefined) {
				this.se.woa (this.titles, 0);
			}

			return this.se.Close ();
		}
	}


	export class sc_title_set_request extends Sproto.SprotoTypeBase {
		
		public rolehandle: number; // tag 0
		public titleid: number; // tag 1
		public constructor(buffer: Uint8Array = null) {
			super(2, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.rolehandle = this.de.ri ();
					break;
				case 1:
					this.titleid = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.rolehandle != undefined) {
				this.se.wi (this.rolehandle, 0);
			}

			if (this.titleid != undefined) {
				this.se.wi (this.titleid, 1);
			}

			return this.se.Close ();
		}
	}


}
