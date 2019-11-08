// Generated by sprotodump. DO NOT EDIT!

namespace Sproto { 
	export class cs_dress_activate_request extends Sproto.SprotoTypeBase {
		
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


	export class cs_dress_activate_response extends Sproto.SprotoTypeBase {
		
		public timeInfo: dress_time_info; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.timeInfo = this.de.ro(dress_time_info);
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.timeInfo != undefined) {
				this.se.wo (this.timeInfo, 0);
			}

			return this.se.Close ();
		}
	}


	export class cs_dress_continue_request extends Sproto.SprotoTypeBase {
		
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


	export class cs_dress_continue_response extends Sproto.SprotoTypeBase {
		
		public timeInfo: dress_time_info; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.timeInfo = this.de.ro(dress_time_info);
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.timeInfo != undefined) {
				this.se.wo (this.timeInfo, 0);
			}

			return this.se.Close ();
		}
	}


	export class cs_dress_dress_request extends Sproto.SprotoTypeBase {
		
		public roleIndex: number; // tag 0
		public id: number; // tag 1
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

			if (this.roleIndex != undefined) {
				this.se.wi (this.roleIndex, 0);
			}

			if (this.id != undefined) {
				this.se.wi (this.id, 1);
			}

			return this.se.Close ();
		}
	}


	export class cs_dress_dress_response extends Sproto.SprotoTypeBase {
		
		public roleIndex: number; // tag 0
		public posIndex: number; // tag 1
		public dressId: number; // tag 2
		public constructor(buffer: Uint8Array = null) {
			super(3, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.roleIndex = this.de.ri ();
					break;
				case 1:
					this.posIndex = this.de.ri ();
					break;
				case 2:
					this.dressId = this.de.ri ();
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

			if (this.posIndex != undefined) {
				this.se.wi (this.posIndex, 1);
			}

			if (this.dressId != undefined) {
				this.se.wi (this.dressId, 2);
			}

			return this.se.Close ();
		}
	}


	export class cs_dress_get_info_response extends Sproto.SprotoTypeBase {
		
		public timeInfo: dress_time_info[]; // tag 0
		public posInfo: dress_pos_info[]; // tag 1
		public constructor(buffer: Uint8Array = null) {
			super(2, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.timeInfo = this.de.roa(dress_time_info);
					break;
				case 1:
					this.posInfo = this.de.roa(dress_pos_info);
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.timeInfo != undefined) {
				this.se.woa (this.timeInfo, 0);
			}

			if (this.posInfo != undefined) {
				this.se.woa (this.posInfo, 1);
			}

			return this.se.Close ();
		}
	}


	export class cs_dress_undress_request extends Sproto.SprotoTypeBase {
		
		public roleIndex: number; // tag 0
		public id: number; // tag 1
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

			if (this.roleIndex != undefined) {
				this.se.wi (this.roleIndex, 0);
			}

			if (this.id != undefined) {
				this.se.wi (this.id, 1);
			}

			return this.se.Close ();
		}
	}


	export class cs_dress_undress_response extends Sproto.SprotoTypeBase {
		
		public roleIndex: number; // tag 0
		public posIndex: number; // tag 1
		public dressId: number; // tag 2
		public constructor(buffer: Uint8Array = null) {
			super(3, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.roleIndex = this.de.ri ();
					break;
				case 1:
					this.posIndex = this.de.ri ();
					break;
				case 2:
					this.dressId = this.de.ri ();
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

			if (this.posIndex != undefined) {
				this.se.wi (this.posIndex, 1);
			}

			if (this.dressId != undefined) {
				this.se.wi (this.dressId, 2);
			}

			return this.se.Close ();
		}
	}


	export class cs_dress_upgrade_request extends Sproto.SprotoTypeBase {
		
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


	export class cs_dress_upgrade_response extends Sproto.SprotoTypeBase {
		
		public timeInfo: dress_time_info; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.timeInfo = this.de.ro(dress_time_info);
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.timeInfo != undefined) {
				this.se.wo (this.timeInfo, 0);
			}

			return this.se.Close ();
		}
	}


	export class dress_pos_info extends Sproto.SprotoTypeBase {
		
		public posArray: number[]; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.posArray = this.de.ria ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.posArray != undefined) {
				this.se.wia (this.posArray, 0);
			}

			return this.se.Close ();
		}
	}


}

