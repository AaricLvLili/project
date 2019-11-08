// Generated by sprotodump. DO NOT EDIT!

namespace Sproto { 
	export class cs_shapeshift_send_comcard_request extends Sproto.SprotoTypeBase {
		
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


	export class cs_shapeshift_send_info_request extends Sproto.SprotoTypeBase {
		
		public roleid: number; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.roleid = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.roleid != undefined) {
				this.se.wi (this.roleid, 0);
			}

			return this.se.Close ();
		}
	}


	export class cs_shapeshift_send_join_request extends Sproto.SprotoTypeBase {
		
		public roleid: number; // tag 0
		public id: number; // tag 1
		public state: number; // tag 2
		public constructor(buffer: Uint8Array = null) {
			super(3, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.roleid = this.de.ri ();
					break;
				case 1:
					this.id = this.de.ri ();
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

			if (this.roleid != undefined) {
				this.se.wi (this.roleid, 0);
			}

			if (this.id != undefined) {
				this.se.wi (this.id, 1);
			}

			if (this.state != undefined) {
				this.se.wi (this.state, 2);
			}

			return this.se.Close ();
		}
	}


	export class cs_shapeshift_send_upgrade_request extends Sproto.SprotoTypeBase {
		
		public roleid: number; // tag 0
		public id: number; // tag 1
		public pos: number; // tag 2
		public constructor(buffer: Uint8Array = null) {
			super(3, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.roleid = this.de.ri ();
					break;
				case 1:
					this.id = this.de.ri ();
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

			if (this.roleid != undefined) {
				this.se.wi (this.roleid, 0);
			}

			if (this.id != undefined) {
				this.se.wi (this.id, 1);
			}

			if (this.pos != undefined) {
				this.se.wi (this.pos, 2);
			}

			return this.se.Close ();
		}
	}


	export class cs_tendraw_send_draw_request extends Sproto.SprotoTypeBase {
		
		public drawType: number; // tag 0
		public cnt: number; // tag 1
		public constructor(buffer: Uint8Array = null) {
			super(2, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.drawType = this.de.ri ();
					break;
				case 1:
					this.cnt = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.drawType != undefined) {
				this.se.wi (this.drawType, 0);
			}

			if (this.cnt != undefined) {
				this.se.wi (this.cnt, 1);
			}

			return this.se.Close ();
		}
	}


	export class cs_tendraw_send_info_request extends Sproto.SprotoTypeBase {
		
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


}

