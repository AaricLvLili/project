// Generated by sprotodump. DO NOT EDIT!

namespace Sproto { 
	export class notice_records extends Sproto.SprotoTypeBase {
		
		public type: number; // tag 0
		public str: string; // tag 1
		public time: number; // tag 2
		public constructor(buffer: Uint8Array = null) {
			super(3, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.type = this.de.ri ();
					break;
				case 1:
					this.str = this.de.rs ();
					break;
				case 2:
					this.time = this.de.ri ();
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

			if (this.str != undefined) {
				this.se.ws (this.str, 1);
			}

			if (this.time != undefined) {
				this.se.wi (this.time, 2);
			}

			return this.se.Close ();
		}
	}


	export class sc_notice_request extends Sproto.SprotoTypeBase {
		
		public type: number; // tag 0
		public str: string; // tag 1
		public isNew: number; // tag 2
		public time: number; // tag 3
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
					this.str = this.de.rs ();
					break;
				case 2:
					this.isNew = this.de.ri ();
					break;
				case 3:
					this.time = this.de.ri ();
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

			if (this.str != undefined) {
				this.se.ws (this.str, 1);
			}

			if (this.isNew != undefined) {
				this.se.wi (this.isNew, 2);
			}

			if (this.time != undefined) {
				this.se.wi (this.time, 3);
			}

			return this.se.Close ();
		}
	}


	export class sc_notice_records_request extends Sproto.SprotoTypeBase {
		
		public records: notice_records[]; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.records = this.de.roa(notice_records);
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.records != undefined) {
				this.se.woa (this.records, 0);
			}

			return this.se.Close ();
		}
	}


}

