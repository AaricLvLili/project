// Generated by sprotodump. DO NOT EDIT!

namespace Sproto { 
	export class sc_treasure_add_record_request extends Sproto.SprotoTypeBase {
		
		public treasureRecord: treasure_record; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.treasureRecord = this.de.ro(treasure_record);
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.treasureRecord != undefined) {
				this.se.wo (this.treasureRecord, 0);
			}

			return this.se.Close ();
		}
	}


	export class sc_treasure_base_info_request extends Sproto.SprotoTypeBase {
		
		public todayHuntCount: number; // tag 0
		public rewardbin: number; // tag 1
		public constructor(buffer: Uint8Array = null) {
			super(2, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.todayHuntCount = this.de.ri ();
					break;
				case 1:
					this.rewardbin = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.todayHuntCount != undefined) {
				this.se.wi (this.todayHuntCount, 0);
			}

			if (this.rewardbin != undefined) {
				this.se.wi (this.rewardbin, 1);
			}

			return this.se.Close ();
		}
	}


	export class sc_treasure_boss_list_request extends Sproto.SprotoTypeBase {
		
		public bosslist: treasure_bossinfo[]; // tag 0
		public huntMin: number; // tag 1
		public huntMax: number; // tag 2
		public constructor(buffer: Uint8Array = null) {
			super(3, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.bosslist = this.de.roa(treasure_bossinfo);
					break;
				case 1:
					this.huntMin = this.de.ri ();
					break;
				case 2:
					this.huntMax = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.bosslist != undefined) {
				this.se.woa (this.bosslist, 0);
			}

			if (this.huntMin != undefined) {
				this.se.wi (this.huntMin, 1);
			}

			if (this.huntMax != undefined) {
				this.se.wi (this.huntMax, 2);
			}

			return this.se.Close ();
		}
	}


	export class sc_treasure_hunt_result_request extends Sproto.SprotoTypeBase {
		
		public type: number; // tag 0
		public items: treasure_item[]; // tag 1
		public constructor(buffer: Uint8Array = null) {
			super(2, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.type = this.de.ri ();
					break;
				case 1:
					this.items = this.de.roa(treasure_item);
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

			if (this.items != undefined) {
				this.se.woa (this.items, 1);
			}

			return this.se.Close ();
		}
	}


	export class sc_treasure_record_datas_request extends Sproto.SprotoTypeBase {
		
		public treasureRecord: treasure_record[]; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.treasureRecord = this.de.roa(treasure_record);
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.treasureRecord != undefined) {
				this.se.woa (this.treasureRecord, 0);
			}

			return this.se.Close ();
		}
	}


	export class treasure_bossinfo extends Sproto.SprotoTypeBase {
		
		public handle: number; // tag 0
		public id: number; // tag 1
		public hp: number; // tag 2
		public people: number; // tag 3
		public constructor(buffer: Uint8Array = null) {
			super(4, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.handle = this.de.ri ();
					break;
				case 1:
					this.id = this.de.ri ();
					break;
				case 2:
					this.hp = this.de.ri ();
					break;
				case 3:
					this.people = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.handle != undefined) {
				this.se.wi (this.handle, 0);
			}

			if (this.id != undefined) {
				this.se.wi (this.id, 1);
			}

			if (this.hp != undefined) {
				this.se.wi (this.hp, 2);
			}

			if (this.people != undefined) {
				this.se.wi (this.people, 3);
			}

			return this.se.Close ();
		}
	}


	export class treasure_item extends Sproto.SprotoTypeBase {
		
		public id: number; // tag 0
		public count: number; // tag 1
		public constructor(buffer: Uint8Array = null) {
			super(2, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.id = this.de.ri ();
					break;
				case 1:
					this.count = this.de.ri ();
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

			if (this.count != undefined) {
				this.se.wi (this.count, 1);
			}

			return this.se.Close ();
		}
	}


	export class treasure_record extends Sproto.SprotoTypeBase {
		
		public name: string; // tag 0
		public itemid: number; // tag 1
		public constructor(buffer: Uint8Array = null) {
			super(2, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.name = this.de.rs ();
					break;
				case 1:
					this.itemid = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.name != undefined) {
				this.se.ws (this.name, 0);
			}

			if (this.itemid != undefined) {
				this.se.wi (this.itemid, 1);
			}

			return this.se.Close ();
		}
	}


}

