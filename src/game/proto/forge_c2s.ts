// Generated by sprotodump. DO NOT EDIT!

namespace Sproto { 
	export class cs_forge_back_upgrade_goods_request extends Sproto.SprotoTypeBase {
		
		public num: number; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.num = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.num != undefined) {
				this.se.wi (this.num, 0);
			}

			return this.se.Close ();
		}
	}


	export class cs_forge_bless_boost_req_request extends Sproto.SprotoTypeBase {
		
		public roleId: number; // tag 0
		public pos: number; // tag 1
		public isAuto: boolean; // tag 2
		public constructor(buffer: Uint8Array = null) {
			super(3, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.roleId = this.de.ri ();
					break;
				case 1:
					this.pos = this.de.ri ();
					break;
				case 2:
					this.isAuto = this.de.rb ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.roleId != undefined) {
				this.se.wi (this.roleId, 0);
			}

			if (this.pos != undefined) {
				this.se.wi (this.pos, 1);
			}

			if (this.isAuto != undefined) {
				this.se.wb (this.isAuto, 2);
			}

			return this.se.Close ();
		}
	}


	export class cs_forge_bless_ronglu_success_request extends Sproto.SprotoTypeBase {
		
		public handles: number[]; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.handles = this.de.ria ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.handles != undefined) {
				this.se.wia (this.handles, 0);
			}

			return this.se.Close ();
		}
	}


	export class cs_forge_bless_smelt_req_request extends Sproto.SprotoTypeBase {
		
		public handler: number; // tag 0
		public num: number; // tag 1
		public constructor(buffer: Uint8Array = null) {
			super(2, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.handler = this.de.ri ();
					break;
				case 1:
					this.num = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.handler != undefined) {
				this.se.wi (this.handler, 0);
			}

			if (this.num != undefined) {
				this.se.wi (this.num, 1);
			}

			return this.se.Close ();
		}
	}


	export class cs_forge_bless_upgrade_req_request extends Sproto.SprotoTypeBase {
		
		public roleId: number; // tag 0
		public pos: number; // tag 1
		public constructor(buffer: Uint8Array = null) {
			super(2, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.roleId = this.de.ri ();
					break;
				case 1:
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

			if (this.roleId != undefined) {
				this.se.wi (this.roleId, 0);
			}

			if (this.pos != undefined) {
				this.se.wi (this.pos, 1);
			}

			return this.se.Close ();
		}
	}


	export class cs_forge_onekey_request extends Sproto.SprotoTypeBase {
		
		public roleId: number; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.roleId = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.roleId != undefined) {
				this.se.wi (this.roleId, 0);
			}

			return this.se.Close ();
		}
	}


	export class cs_forge_upgrade_bless_request extends Sproto.SprotoTypeBase {
		
		public roleId: number; // tag 0
		public pos: number; // tag 1
		public constructor(buffer: Uint8Array = null) {
			super(2, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.roleId = this.de.ri ();
					break;
				case 1:
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

			if (this.roleId != undefined) {
				this.se.wi (this.roleId, 0);
			}

			if (this.pos != undefined) {
				this.se.wi (this.pos, 1);
			}

			return this.se.Close ();
		}
	}


	export class cs_forge_upgrade_grade_request extends Sproto.SprotoTypeBase {
		
		public roleId: number; // tag 0
		public pos: number; // tag 1
		public canUseYuanbao: boolean; // tag 2
		public constructor(buffer: Uint8Array = null) {
			super(3, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.roleId = this.de.ri ();
					break;
				case 1:
					this.pos = this.de.ri ();
					break;
				case 2:
					this.canUseYuanbao = this.de.rb ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.roleId != undefined) {
				this.se.wi (this.roleId, 0);
			}

			if (this.pos != undefined) {
				this.se.wi (this.pos, 1);
			}

			if (this.canUseYuanbao != undefined) {
				this.se.wb (this.canUseYuanbao, 2);
			}

			return this.se.Close ();
		}
	}


}

