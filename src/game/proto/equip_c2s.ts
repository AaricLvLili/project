// Generated by sprotodump. DO NOT EDIT!

namespace Sproto { 
	export class cs_equip_autosmelt_req_request extends Sproto.SprotoTypeBase {
		
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


	export class cs_equip_mix_request extends Sproto.SprotoTypeBase {
		
		public roleID: number; // tag 0
		public configID: number; // tag 1
		public pos: number; // tag 2
		public constructor(buffer: Uint8Array = null) {
			super(3, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.roleID = this.de.ri ();
					break;
				case 1:
					this.configID = this.de.ri ();
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

			if (this.roleID != undefined) {
				this.se.wi (this.roleID, 0);
			}

			if (this.configID != undefined) {
				this.se.wi (this.configID, 1);
			}

			if (this.pos != undefined) {
				this.se.wi (this.pos, 2);
			}

			return this.se.Close ();
		}
	}


	export class cs_equip_resolve_request extends Sproto.SprotoTypeBase {
		
		public itemId: number; // tag 0
		public num: number; // tag 1
		public pos: number; // tag 2
		public constructor(buffer: Uint8Array = null) {
			super(3, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.itemId = this.de.ri ();
					break;
				case 1:
					this.num = this.de.ri ();
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

			if (this.itemId != undefined) {
				this.se.wi (this.itemId, 0);
			}

			if (this.num != undefined) {
				this.se.wi (this.num, 1);
			}

			if (this.pos != undefined) {
				this.se.wi (this.pos, 2);
			}

			return this.se.Close ();
		}
	}


	export class cs_equip_smelt_request extends Sproto.SprotoTypeBase {
		
		public type: number; // tag 0
		public itemHandle: number[]; // tag 1
		public auto: boolean; // tag 2
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
					this.itemHandle = this.de.ria ();
					break;
				case 2:
					this.auto = this.de.rb ();
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

			if (this.itemHandle != undefined) {
				this.se.wia (this.itemHandle, 1);
			}

			if (this.auto != undefined) {
				this.se.wb (this.auto, 2);
			}

			return this.se.Close ();
		}
	}


	export class cs_equip_upgrade_request extends Sproto.SprotoTypeBase {
		
		public roleID: number; // tag 0
		public pos: number; // tag 1
		public isgodequip: boolean; // tag 2
		public constructor(buffer: Uint8Array = null) {
			super(3, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.roleID = this.de.ri ();
					break;
				case 1:
					this.pos = this.de.ri ();
					break;
				case 2:
					this.isgodequip = this.de.rb ();
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

			if (this.pos != undefined) {
				this.se.wi (this.pos, 1);
			}

			if (this.isgodequip != undefined) {
				this.se.wb (this.isgodequip, 2);
			}

			return this.se.Close ();
		}
	}


	export class cs_equip_wear_request extends Sproto.SprotoTypeBase {
		
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


}
