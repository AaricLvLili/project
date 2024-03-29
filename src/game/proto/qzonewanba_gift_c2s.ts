// Generated by sprotodump. DO NOT EDIT!

namespace Sproto { 
	export class cs_get_qzonewanba_gift_request extends Sproto.SprotoTypeBase {
		
		public giftid: number; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.giftid = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.giftid != undefined) {
				this.se.wi (this.giftid, 0);
			}

			return this.se.Close ();
		}
	}


	export class cs_get_qzonewanba_gift_response extends Sproto.SprotoTypeBase {
		
		public ret: number; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.ret = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.ret != undefined) {
				this.se.wi (this.ret, 0);
			}

			return this.se.Close ();
		}
	}


	export class cs_get_qzonewanba_vipgift_request extends Sproto.SprotoTypeBase {
		
		public giftid: number; // tag 0
		public appid: string; // tag 1
		public openid: string; // tag 2
		public openkey: string; // tag 3
		public pf: string; // tag 4
		public zoneid: string; // tag 5
		public constructor(buffer: Uint8Array = null) {
			super(6, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.giftid = this.de.ri ();
					break;
				case 1:
					this.appid = this.de.rs ();
					break;
				case 2:
					this.openid = this.de.rs ();
					break;
				case 3:
					this.openkey = this.de.rs ();
					break;
				case 4:
					this.pf = this.de.rs ();
					break;
				case 5:
					this.zoneid = this.de.rs ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.giftid != undefined) {
				this.se.wi (this.giftid, 0);
			}

			if (this.appid != undefined) {
				this.se.ws (this.appid, 1);
			}

			if (this.openid != undefined) {
				this.se.ws (this.openid, 2);
			}

			if (this.openkey != undefined) {
				this.se.ws (this.openkey, 3);
			}

			if (this.pf != undefined) {
				this.se.ws (this.pf, 4);
			}

			if (this.zoneid != undefined) {
				this.se.ws (this.zoneid, 5);
			}

			return this.se.Close ();
		}
	}


	export class cs_get_qzonewanba_vipgift_response extends Sproto.SprotoTypeBase {
		
		public ret: number; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.ret = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.ret != undefined) {
				this.se.wi (this.ret, 0);
			}

			return this.se.Close ();
		}
	}


	export class cs_get_qzonewanba_vipprivilege_request extends Sproto.SprotoTypeBase {
		
		public giftid: number; // tag 0
		public appid: string; // tag 1
		public openid: string; // tag 2
		public openkey: string; // tag 3
		public pf: string; // tag 4
		public zoneid: string; // tag 5
		public constructor(buffer: Uint8Array = null) {
			super(6, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.giftid = this.de.ri ();
					break;
				case 1:
					this.appid = this.de.rs ();
					break;
				case 2:
					this.openid = this.de.rs ();
					break;
				case 3:
					this.openkey = this.de.rs ();
					break;
				case 4:
					this.pf = this.de.rs ();
					break;
				case 5:
					this.zoneid = this.de.rs ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.giftid != undefined) {
				this.se.wi (this.giftid, 0);
			}

			if (this.appid != undefined) {
				this.se.ws (this.appid, 1);
			}

			if (this.openid != undefined) {
				this.se.ws (this.openid, 2);
			}

			if (this.openkey != undefined) {
				this.se.ws (this.openkey, 3);
			}

			if (this.pf != undefined) {
				this.se.ws (this.pf, 4);
			}

			if (this.zoneid != undefined) {
				this.se.ws (this.zoneid, 5);
			}

			return this.se.Close ();
		}
	}


	export class cs_get_qzonewanba_vipprivilege_response extends Sproto.SprotoTypeBase {
		
		public ret: number; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.ret = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.ret != undefined) {
				this.se.wi (this.ret, 0);
			}

			return this.se.Close ();
		}
	}


	export class cs_get_qzonewanba_vipprivilege_stat_request extends Sproto.SprotoTypeBase {
		
		public appid: string; // tag 0
		public openid: string; // tag 1
		public openkey: string; // tag 2
		public pf: string; // tag 3
		public zoneid: string; // tag 4
		public constructor(buffer: Uint8Array = null) {
			super(5, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.appid = this.de.rs ();
					break;
				case 1:
					this.openid = this.de.rs ();
					break;
				case 2:
					this.openkey = this.de.rs ();
					break;
				case 3:
					this.pf = this.de.rs ();
					break;
				case 4:
					this.zoneid = this.de.rs ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.appid != undefined) {
				this.se.ws (this.appid, 0);
			}

			if (this.openid != undefined) {
				this.se.ws (this.openid, 1);
			}

			if (this.openkey != undefined) {
				this.se.ws (this.openkey, 2);
			}

			if (this.pf != undefined) {
				this.se.ws (this.pf, 3);
			}

			if (this.zoneid != undefined) {
				this.se.ws (this.zoneid, 4);
			}

			return this.se.Close ();
		}
	}


	export class cs_get_qzonewanba_vipprivilege_stat_response extends Sproto.SprotoTypeBase {
		
		public state: number; // tag 0
		public level: number; // tag 1
		public is_vip: number; // tag 2
		public constructor(buffer: Uint8Array = null) {
			super(3, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.state = this.de.ri ();
					break;
				case 1:
					this.level = this.de.ri ();
					break;
				case 2:
					this.is_vip = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.state != undefined) {
				this.se.wi (this.state, 0);
			}

			if (this.level != undefined) {
				this.se.wi (this.level, 1);
			}

			if (this.is_vip != undefined) {
				this.se.wi (this.is_vip, 2);
			}

			return this.se.Close ();
		}
	}


	export class cs_update_qzonewanba_token_request extends Sproto.SprotoTypeBase {
		
		public appid: string; // tag 0
		public openid: string; // tag 1
		public openkey: string; // tag 2
		public pf: string; // tag 3
		public zoneid: string; // tag 4
		public qua: string; // tag 5
		public constructor(buffer: Uint8Array = null) {
			super(6, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.appid = this.de.rs ();
					break;
				case 1:
					this.openid = this.de.rs ();
					break;
				case 2:
					this.openkey = this.de.rs ();
					break;
				case 3:
					this.pf = this.de.rs ();
					break;
				case 4:
					this.zoneid = this.de.rs ();
					break;
				case 5:
					this.qua = this.de.rs ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.appid != undefined) {
				this.se.ws (this.appid, 0);
			}

			if (this.openid != undefined) {
				this.se.ws (this.openid, 1);
			}

			if (this.openkey != undefined) {
				this.se.ws (this.openkey, 2);
			}

			if (this.pf != undefined) {
				this.se.ws (this.pf, 3);
			}

			if (this.zoneid != undefined) {
				this.se.ws (this.zoneid, 4);
			}

			if (this.qua != undefined) {
				this.se.ws (this.qua, 5);
			}

			return this.se.Close ();
		}
	}


	export class cs_update_qzonewanba_token_response extends Sproto.SprotoTypeBase {
		
		public ret: string; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.ret = this.de.rs ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.ret != undefined) {
				this.se.ws (this.ret, 0);
			}

			return this.se.Close ();
		}
	}


}

