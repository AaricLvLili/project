// Generated by sprotodump. DO NOT EDIT!

namespace Sproto { 
	export class offline_data extends Sproto.SprotoTypeBase {
		
		public type: number; // tag 0
		public exp: number; // tag 1
		public gold: number; // tag 2
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
					this.exp = this.de.ri ();
					break;
				case 2:
					this.gold = this.de.ri ();
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

			if (this.exp != undefined) {
				this.se.wi (this.exp, 1);
			}

			if (this.gold != undefined) {
				this.se.wi (this.gold, 2);
			}

			return this.se.Close ();
		}
	}


	export class raid_data extends Sproto.SprotoTypeBase {
		
		public fbId: number; // tag 0
		public useCount: number; // tag 1
		public vipBuyCount: number; // tag 2
		public vipHoldCount: number; // tag 3
		public constructor(buffer: Uint8Array = null) {
			super(4, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.fbId = this.de.ri ();
					break;
				case 1:
					this.useCount = this.de.ri ();
					break;
				case 2:
					this.vipBuyCount = this.de.ri ();
					break;
				case 3:
					this.vipHoldCount = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.fbId != undefined) {
				this.se.wi (this.fbId, 0);
			}

			if (this.useCount != undefined) {
				this.se.wi (this.useCount, 1);
			}

			if (this.vipBuyCount != undefined) {
				this.se.wi (this.vipBuyCount, 2);
			}

			if (this.vipHoldCount != undefined) {
				this.se.wi (this.vipHoldCount, 3);
			}

			return this.se.Close ();
		}
	}


	export class sc_offline_apply_res_request extends Sproto.SprotoTypeBase {
		
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


	export class sc_radi_artifact_cnt_request extends Sproto.SprotoTypeBase {
		
		public result: number; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.result = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.result != undefined) {
				this.se.wi (this.result, 0);
			}

			return this.se.Close ();
		}
	}


	export class sc_radi_artifact_morra_request extends Sproto.SprotoTypeBase {
		
		public result: number; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.result = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.result != undefined) {
				this.se.wi (this.result, 0);
			}

			return this.se.Close ();
		}
	}


	export class sc_radi_artifact_rewoard_relute_request extends Sproto.SprotoTypeBase {
		
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


	export class sc_raid_artifact_buy_res_request extends Sproto.SprotoTypeBase {
		
		public times: number; // tag 0
		public bought: number; // tag 1
		public constructor(buffer: Uint8Array = null) {
			super(2, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.times = this.de.ri ();
					break;
				case 1:
					this.bought = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.times != undefined) {
				this.se.wi (this.times, 0);
			}

			if (this.bought != undefined) {
				this.se.wi (this.bought, 1);
			}

			return this.se.Close ();
		}
	}


	export class sc_raid_artifact_cnt_request extends Sproto.SprotoTypeBase {
		
		public joincnt: number; // tag 0
		public result: number; // tag 1
		public bought: number; // tag 2
		public constructor(buffer: Uint8Array = null) {
			super(3, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.joincnt = this.de.ri ();
					break;
				case 1:
					this.result = this.de.ri ();
					break;
				case 2:
					this.bought = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.joincnt != undefined) {
				this.se.wi (this.joincnt, 0);
			}

			if (this.result != undefined) {
				this.se.wi (this.result, 1);
			}

			if (this.bought != undefined) {
				this.se.wi (this.bought, 2);
			}

			return this.se.Close ();
		}
	}


	export class sc_raid_artifact_kill_cnt_request extends Sproto.SprotoTypeBase {
		
		public cnt: number; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
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

			if (this.cnt != undefined) {
				this.se.wi (this.cnt, 0);
			}

			return this.se.Close ();
		}
	}


	export class sc_raid_boss_box_num_request extends Sproto.SprotoTypeBase {
		
		public bossCallNum: number; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.bossCallNum = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.bossCallNum != undefined) {
				this.se.wi (this.bossCallNum, 0);
			}

			return this.se.Close ();
		}
	}


	export class sc_raid_chapter_boss_result_request extends Sproto.SprotoTypeBase {
		
		public result: number; // tag 0
		public rewards: reward_data[]; // tag 1
		public constructor(buffer: Uint8Array = null) {
			super(2, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.result = this.de.ri ();
					break;
				case 1:
					this.rewards = this.de.roa(reward_data);
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.result != undefined) {
				this.se.wi (this.result, 0);
			}

			if (this.rewards != undefined) {
				this.se.woa (this.rewards, 1);
			}

			return this.se.Close ();
		}
	}


	export class sc_raid_chapter_init_info_request extends Sproto.SprotoTypeBase {
		
		public guanqiaID: number; // tag 0
		public wave: number; // tag 1
		public monsterCount: number; // tag 2
		public monsterID: number; // tag 3
		public needWave: number; // tag 4
		public bossID: number; // tag 5
		public desc: string; // tag 6
		public refMonsterPos: position[]; // tag 7
		public bossReward: reward_data[]; // tag 8
		public refEncounterPos: position[]; // tag 9
		public killMonsterCount: number; // tag 10
		public nextMap: boolean; // tag 11
		public constructor(buffer: Uint8Array = null) {
			super(12, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.guanqiaID = this.de.ri ();
					break;
				case 1:
					this.wave = this.de.ri ();
					break;
				case 2:
					this.monsterCount = this.de.ri ();
					break;
				case 3:
					this.monsterID = this.de.ri ();
					break;
				case 4:
					this.needWave = this.de.ri ();
					break;
				case 5:
					this.bossID = this.de.ri ();
					break;
				case 6:
					this.desc = this.de.rs ();
					break;
				case 7:
					this.refMonsterPos = this.de.roa(position);
					break;
				case 8:
					this.bossReward = this.de.roa(reward_data);
					break;
				case 9:
					this.refEncounterPos = this.de.roa(position);
					break;
				case 10:
					this.killMonsterCount = this.de.ri ();
					break;
				case 11:
					this.nextMap = this.de.rb ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.guanqiaID != undefined) {
				this.se.wi (this.guanqiaID, 0);
			}

			if (this.wave != undefined) {
				this.se.wi (this.wave, 1);
			}

			if (this.monsterCount != undefined) {
				this.se.wi (this.monsterCount, 2);
			}

			if (this.monsterID != undefined) {
				this.se.wi (this.monsterID, 3);
			}

			if (this.needWave != undefined) {
				this.se.wi (this.needWave, 4);
			}

			if (this.bossID != undefined) {
				this.se.wi (this.bossID, 5);
			}

			if (this.desc != undefined) {
				this.se.ws (this.desc, 6);
			}

			if (this.refMonsterPos != undefined) {
				this.se.woa (this.refMonsterPos, 7);
			}

			if (this.bossReward != undefined) {
				this.se.woa (this.bossReward, 8);
			}

			if (this.refEncounterPos != undefined) {
				this.se.woa (this.refEncounterPos, 9);
			}

			if (this.killMonsterCount != undefined) {
				this.se.wi (this.killMonsterCount, 10);
			}

			if (this.nextMap != undefined) {
				this.se.wb (this.nextMap, 11);
			}

			return this.se.Close ();
		}
	}


	export class sc_raid_chapter_offline_reward_request extends Sproto.SprotoTypeBase {
		
		public offlineTime: number; // tag 0
		public exp: number; // tag 1
		public money: number; // tag 2
		public equipNum1: number; // tag 3
		public equipNum2: number; // tag 4
		public offlineData: offline_data[]; // tag 5
		public constructor(buffer: Uint8Array = null) {
			super(6, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.offlineTime = this.de.ri ();
					break;
				case 1:
					this.exp = this.de.ri ();
					break;
				case 2:
					this.money = this.de.ri ();
					break;
				case 3:
					this.equipNum1 = this.de.ri ();
					break;
				case 4:
					this.equipNum2 = this.de.ri ();
					break;
				case 5:
					this.offlineData = this.de.roa(offline_data);
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.offlineTime != undefined) {
				this.se.wi (this.offlineTime, 0);
			}

			if (this.exp != undefined) {
				this.se.wi (this.exp, 1);
			}

			if (this.money != undefined) {
				this.se.wi (this.money, 2);
			}

			if (this.equipNum1 != undefined) {
				this.se.wi (this.equipNum1, 3);
			}

			if (this.equipNum2 != undefined) {
				this.se.wi (this.equipNum2, 4);
			}

			if (this.offlineData != undefined) {
				this.se.woa (this.offlineData, 5);
			}

			return this.se.Close ();
		}
	}


	export class sc_raid_chapter_reward_request extends Sproto.SprotoTypeBase {
		
		public result: number[]; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.result = this.de.ria ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.result != undefined) {
				this.se.wia (this.result, 0);
			}

			return this.se.Close ();
		}
	}


	export class sc_raid_chapter_wave_data_request extends Sproto.SprotoTypeBase {
		
		public wave: number; // tag 0
		public count: number; // tag 1
		public rewards: wave_drop_data[]; // tag 2
		public constructor(buffer: Uint8Array = null) {
			super(3, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.wave = this.de.ri ();
					break;
				case 1:
					this.count = this.de.ri ();
					break;
				case 2:
					this.rewards = this.de.roa(wave_drop_data);
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.wave != undefined) {
				this.se.wi (this.wave, 0);
			}

			if (this.count != undefined) {
				this.se.wi (this.count, 1);
			}

			if (this.rewards != undefined) {
				this.se.woa (this.rewards, 2);
			}

			return this.se.Close ();
		}
	}


	export class sc_raid_chapter_world_reward_request extends Sproto.SprotoTypeBase {
		
		public isReceive: number[]; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.isReceive = this.de.ria ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.isReceive != undefined) {
				this.se.wia (this.isReceive, 0);
			}

			return this.se.Close ();
		}
	}


	export class sc_raid_guardian_res_request extends Sproto.SprotoTypeBase {
		
		public tili: number; // tag 0
		public time: number; // tag 1
		public info: number; // tag 2
		public bought: number; // tag 3
		public constructor(buffer: Uint8Array = null) {
			super(4, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.tili = this.de.ri ();
					break;
				case 1:
					this.time = this.de.ri ();
					break;
				case 2:
					this.info = this.de.ri ();
					break;
				case 3:
					this.bought = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.tili != undefined) {
				this.se.wi (this.tili, 0);
			}

			if (this.time != undefined) {
				this.se.wi (this.time, 1);
			}

			if (this.info != undefined) {
				this.se.wi (this.info, 2);
			}

			if (this.bought != undefined) {
				this.se.wi (this.bought, 3);
			}

			return this.se.Close ();
		}
	}


	export class sc_raid_info_init_request extends Sproto.SprotoTypeBase {
		
		public raidModel: raid_data[]; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.raidModel = this.de.roa(raid_data);
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.raidModel != undefined) {
				this.se.woa (this.raidModel, 0);
			}

			return this.se.Close ();
		}
	}


	export class sc_raid_reborn_cd_request extends Sproto.SprotoTypeBase {
		
		public cdtime: number; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.cdtime = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.cdtime != undefined) {
				this.se.wi (this.cdtime, 0);
			}

			return this.se.Close ();
		}
	}


	export class sc_raid_role_all_die_request extends Sproto.SprotoTypeBase {
		
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


	export class sc_raid_time_request extends Sproto.SprotoTypeBase {
		
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


	export class sc_raid_update_info_request extends Sproto.SprotoTypeBase {
		
		public raidData: raid_data; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.raidData = this.de.ro(raid_data);
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.raidData != undefined) {
				this.se.wo (this.raidData, 0);
			}

			return this.se.Close ();
		}
	}


	export class wave_drop_data extends Sproto.SprotoTypeBase {
		
		public index: number; // tag 0
		public drops: reward_data[]; // tag 1
		public constructor(buffer: Uint8Array = null) {
			super(2, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.index = this.de.ri ();
					break;
				case 1:
					this.drops = this.de.roa(reward_data);
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.index != undefined) {
				this.se.wi (this.index, 0);
			}

			if (this.drops != undefined) {
				this.se.woa (this.drops, 1);
			}

			return this.se.Close ();
		}
	}


}

