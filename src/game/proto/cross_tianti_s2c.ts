// Generated by sprotodump. DO NOT EDIT!

namespace Sproto { 
	export class award_history_info extends Sproto.SprotoTypeBase {
		
		public cfgIndex: number; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.cfgIndex = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.cfgIndex != undefined) {
				this.se.wi (this.cfgIndex, 0);
			}

			return this.se.Close ();
		}
	}


	export class roles_display_info extends Sproto.SprotoTypeBase {
		
		public level: number; // tag 0
		public power: number; // tag 1
		public weaponId: number; // tag 2
		public clothesId: number; // tag 3
		public wingOpenState: number; // tag 4
		public wingLevel: number; // tag 5
		public zhuansheng_lv: number; // tag 6
		public rank: number; // tag 7
		public job: number; // tag 8
		public sex: number; // tag 9
		public name: string; // tag 10
		public combatState: number; // tag 11
		public dbid: number; // tag 12
		public mainEle: number; // tag 13
		public constructor(buffer: Uint8Array = null) {
			super(14, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.level = this.de.ri ();
					break;
				case 1:
					this.power = this.de.ri ();
					break;
				case 2:
					this.weaponId = this.de.ri ();
					break;
				case 3:
					this.clothesId = this.de.ri ();
					break;
				case 4:
					this.wingOpenState = this.de.ri ();
					break;
				case 5:
					this.wingLevel = this.de.ri ();
					break;
				case 6:
					this.zhuansheng_lv = this.de.ri ();
					break;
				case 7:
					this.rank = this.de.ri ();
					break;
				case 8:
					this.job = this.de.ri ();
					break;
				case 9:
					this.sex = this.de.ri ();
					break;
				case 10:
					this.name = this.de.rs ();
					break;
				case 11:
					this.combatState = this.de.ri ();
					break;
				case 12:
					this.dbid = this.de.ri ();
					break;
				case 13:
					this.mainEle = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.level != undefined) {
				this.se.wi (this.level, 0);
			}

			if (this.power != undefined) {
				this.se.wi (this.power, 1);
			}

			if (this.weaponId != undefined) {
				this.se.wi (this.weaponId, 2);
			}

			if (this.clothesId != undefined) {
				this.se.wi (this.clothesId, 3);
			}

			if (this.wingOpenState != undefined) {
				this.se.wi (this.wingOpenState, 4);
			}

			if (this.wingLevel != undefined) {
				this.se.wi (this.wingLevel, 5);
			}

			if (this.zhuansheng_lv != undefined) {
				this.se.wi (this.zhuansheng_lv, 6);
			}

			if (this.rank != undefined) {
				this.se.wi (this.rank, 7);
			}

			if (this.job != undefined) {
				this.se.wi (this.job, 8);
			}

			if (this.sex != undefined) {
				this.se.wi (this.sex, 9);
			}

			if (this.name != undefined) {
				this.se.ws (this.name, 10);
			}

			if (this.combatState != undefined) {
				this.se.wi (this.combatState, 11);
			}

			if (this.dbid != undefined) {
				this.se.wi (this.dbid, 12);
			}

			if (this.mainEle != undefined) {
				this.se.wi (this.mainEle, 13);
			}

			return this.se.Close ();
		}
	}


	export class sc_cross_buy_combat_num_request extends Sproto.SprotoTypeBase {
		
		public code: number; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.code = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.code != undefined) {
				this.se.wi (this.code, 0);
			}

			return this.se.Close ();
		}
	}


	export class sc_cross_combat_result_request extends Sproto.SprotoTypeBase {
		
		public isWin: boolean; // tag 0
		public rewardData: reward_data[]; // tag 1
		public nowRank: number; // tag 2
		public lastRank: number; // tag 3
		public rankChange: number; // tag 4
		public constructor(buffer: Uint8Array = null) {
			super(5, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.isWin = this.de.rb ();
					break;
				case 1:
					this.rewardData = this.de.roa(reward_data);
					break;
				case 2:
					this.nowRank = this.de.ri ();
					break;
				case 3:
					this.lastRank = this.de.ri ();
					break;
				case 4:
					this.rankChange = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.isWin != undefined) {
				this.se.wb (this.isWin, 0);
			}

			if (this.rewardData != undefined) {
				this.se.woa (this.rewardData, 1);
			}

			if (this.nowRank != undefined) {
				this.se.wi (this.nowRank, 2);
			}

			if (this.lastRank != undefined) {
				this.se.wi (this.lastRank, 3);
			}

			if (this.rankChange != undefined) {
				this.se.wi (this.rankChange, 4);
			}

			return this.se.Close ();
		}
	}


	export class sc_cross_gain_tianti_history_award_request extends Sproto.SprotoTypeBase {
		
		public code: number; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.code = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.code != undefined) {
				this.se.wi (this.code, 0);
			}

			return this.se.Close ();
		}
	}


	export class sc_cross_get_combat_record_request extends Sproto.SprotoTypeBase {
		
		public combatRecord: tianti_combat_record[]; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.combatRecord = this.de.roa(tianti_combat_record);
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.combatRecord != undefined) {
				this.se.woa (this.combatRecord, 0);
			}

			return this.se.Close ();
		}
	}


	export class sc_cross_get_self_info_request extends Sproto.SprotoTypeBase {
		
		public rank: number; // tag 0
		public job: number; // tag 1
		public sex: number; // tag 2
		public power: number; // tag 3
		public winNum: number; // tag 4
		public lossNum: number; // tag 5
		public times: number; // tag 6
		public dailyBuyNum: number; // tag 7
		public mainEle: number; // tag 8
		public constructor(buffer: Uint8Array = null) {
			super(9, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.rank = this.de.ri ();
					break;
				case 1:
					this.job = this.de.ri ();
					break;
				case 2:
					this.sex = this.de.ri ();
					break;
				case 3:
					this.power = this.de.ri ();
					break;
				case 4:
					this.winNum = this.de.ri ();
					break;
				case 5:
					this.lossNum = this.de.ri ();
					break;
				case 6:
					this.times = this.de.ri ();
					break;
				case 7:
					this.dailyBuyNum = this.de.ri ();
					break;
				case 8:
					this.mainEle = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.rank != undefined) {
				this.se.wi (this.rank, 0);
			}

			if (this.job != undefined) {
				this.se.wi (this.job, 1);
			}

			if (this.sex != undefined) {
				this.se.wi (this.sex, 2);
			}

			if (this.power != undefined) {
				this.se.wi (this.power, 3);
			}

			if (this.winNum != undefined) {
				this.se.wi (this.winNum, 4);
			}

			if (this.lossNum != undefined) {
				this.se.wi (this.lossNum, 5);
			}

			if (this.times != undefined) {
				this.se.wi (this.times, 6);
			}

			if (this.dailyBuyNum != undefined) {
				this.se.wi (this.dailyBuyNum, 7);
			}

			if (this.mainEle != undefined) {
				this.se.wi (this.mainEle, 8);
			}

			return this.se.Close ();
		}
	}


	export class sc_cross_get_tianti_history_rank_request extends Sproto.SprotoTypeBase {
		
		public selfRank: number; // tag 0
		public award_history_info: award_history_info[]; // tag 1
		public constructor(buffer: Uint8Array = null) {
			super(2, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.selfRank = this.de.ri ();
					break;
				case 1:
					this.award_history_info = this.de.roa(award_history_info);
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.selfRank != undefined) {
				this.se.wi (this.selfRank, 0);
			}

			if (this.award_history_info != undefined) {
				this.se.woa (this.award_history_info, 1);
			}

			return this.se.Close ();
		}
	}


	export class sc_cross_get_tianti_rank_info_request extends Sproto.SprotoTypeBase {
		
		public rankInfo: tianti_rank_info[]; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.rankInfo = this.de.roa(tianti_rank_info);
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.rankInfo != undefined) {
				this.se.woa (this.rankInfo, 0);
			}

			return this.se.Close ();
		}
	}


	export class sc_cross_start_combat_request extends Sproto.SprotoTypeBase {
		
		public combatState: number; // tag 0
		public targetdbid: number; // tag 1
		public constructor(buffer: Uint8Array = null) {
			super(2, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.combatState = this.de.ri ();
					break;
				case 1:
					this.targetdbid = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.combatState != undefined) {
				this.se.wi (this.combatState, 0);
			}

			if (this.targetdbid != undefined) {
				this.se.wi (this.targetdbid, 1);
			}

			return this.se.Close ();
		}
	}


	export class sc_get_cross_tianti_list_request extends Sproto.SprotoTypeBase {
		
		public roles: roles_display_info[]; // tag 4
		public constructor(buffer: Uint8Array = null) {
			super(2, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 4:
					this.roles = this.de.roa(roles_display_info);
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.roles != undefined) {
				this.se.woa (this.roles, 4);
			}

			return this.se.Close ();
		}
	}


	export class tianti_combat_record extends Sproto.SprotoTypeBase {
		
		public name: string; // tag 0
		public level: number; // tag 1
		public zhuansheng_lv: number; // tag 2
		public selfRankChangeNum: number; // tag 3
		public rankChange: number; // tag 4
		public isWin: boolean; // tag 5
		public isCombat: boolean; // tag 6
		public revengeDbid: number; // tag 7
		public recordTime: number; // tag 8
		public constructor(buffer: Uint8Array = null) {
			super(9, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.name = this.de.rs ();
					break;
				case 1:
					this.level = this.de.ri ();
					break;
				case 2:
					this.zhuansheng_lv = this.de.ri ();
					break;
				case 3:
					this.selfRankChangeNum = this.de.ri ();
					break;
				case 4:
					this.rankChange = this.de.ri ();
					break;
				case 5:
					this.isWin = this.de.rb ();
					break;
				case 6:
					this.isCombat = this.de.rb ();
					break;
				case 7:
					this.revengeDbid = this.de.ri ();
					break;
				case 8:
					this.recordTime = this.de.ri ();
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

			if (this.level != undefined) {
				this.se.wi (this.level, 1);
			}

			if (this.zhuansheng_lv != undefined) {
				this.se.wi (this.zhuansheng_lv, 2);
			}

			if (this.selfRankChangeNum != undefined) {
				this.se.wi (this.selfRankChangeNum, 3);
			}

			if (this.rankChange != undefined) {
				this.se.wi (this.rankChange, 4);
			}

			if (this.isWin != undefined) {
				this.se.wb (this.isWin, 5);
			}

			if (this.isCombat != undefined) {
				this.se.wb (this.isCombat, 6);
			}

			if (this.revengeDbid != undefined) {
				this.se.wi (this.revengeDbid, 7);
			}

			if (this.recordTime != undefined) {
				this.se.wi (this.recordTime, 8);
			}

			return this.se.Close ();
		}
	}


	export class tianti_rank_info extends Sproto.SprotoTypeBase {
		
		public name: string; // tag 0
		public level: number; // tag 1
		public zhuansheng_lv: number; // tag 2
		public rank: number; // tag 3
		public serverid: number; // tag 4
		public power: number; // tag 5
		public constructor(buffer: Uint8Array = null) {
			super(6, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.name = this.de.rs ();
					break;
				case 1:
					this.level = this.de.ri ();
					break;
				case 2:
					this.zhuansheng_lv = this.de.ri ();
					break;
				case 3:
					this.rank = this.de.ri ();
					break;
				case 4:
					this.serverid = this.de.ri ();
					break;
				case 5:
					this.power = this.de.ri ();
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

			if (this.level != undefined) {
				this.se.wi (this.level, 1);
			}

			if (this.zhuansheng_lv != undefined) {
				this.se.wi (this.zhuansheng_lv, 2);
			}

			if (this.rank != undefined) {
				this.se.wi (this.rank, 3);
			}

			if (this.serverid != undefined) {
				this.se.wi (this.serverid, 4);
			}

			if (this.power != undefined) {
				this.se.wi (this.power, 5);
			}

			return this.se.Close ();
		}
	}


}

