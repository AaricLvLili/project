// Generated by sprotodump. DO NOT EDIT!

namespace Sproto { 
	export class cs_skill_break_request extends Sproto.SprotoTypeBase {
		
		public roleID: number; // tag 0
		public skillID: number; // tag 1
		public constructor(buffer: Uint8Array = null) {
			super(2, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.roleID = this.de.ri ();
					break;
				case 1:
					this.skillID = this.de.ri ();
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

			if (this.skillID != undefined) {
				this.se.wi (this.skillID, 1);
			}

			return this.se.Close ();
		}
	}


	export class cs_skill_setfight_req_request extends Sproto.SprotoTypeBase {
		
		public roleID: number; // tag 0
		public skillID: number[]; // tag 1
		public constructor(buffer: Uint8Array = null) {
			super(2, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.roleID = this.de.ri ();
					break;
				case 1:
					this.skillID = this.de.ria ();
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

			if (this.skillID != undefined) {
				this.se.wia (this.skillID, 1);
			}

			return this.se.Close ();
		}
	}


	export class cs_skill_upgrade_request extends Sproto.SprotoTypeBase {
		
		public roleID: number; // tag 0
		public skillID: number; // tag 1
		public constructor(buffer: Uint8Array = null) {
			super(2, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.roleID = this.de.ri ();
					break;
				case 1:
					this.skillID = this.de.ri ();
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

			if (this.skillID != undefined) {
				this.se.wi (this.skillID, 1);
			}

			return this.se.Close ();
		}
	}


	export class cs_skill_upgrade_all_request extends Sproto.SprotoTypeBase {
		
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


	export class cs_use_skill_request extends Sproto.SprotoTypeBase {
		
		public suorceHandle: number; // tag 0
		public targetHandle: number; // tag 1
		public skillID: number; // tag 2
		public constructor(buffer: Uint8Array = null) {
			super(3, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.suorceHandle = this.de.ri ();
					break;
				case 1:
					this.targetHandle = this.de.ri ();
					break;
				case 2:
					this.skillID = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.suorceHandle != undefined) {
				this.se.wi (this.suorceHandle, 0);
			}

			if (this.targetHandle != undefined) {
				this.se.wi (this.targetHandle, 1);
			}

			if (this.skillID != undefined) {
				this.se.wi (this.skillID, 2);
			}

			return this.se.Close ();
		}
	}


}
