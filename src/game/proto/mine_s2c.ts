// Generated by sprotodump. DO NOT EDIT!

namespace Sproto { 
	export class mine_map_info extends Sproto.SprotoTypeBase {
		
		public dbid: number; // tag 0
		public actorName: string; // tag 1
		public guildName: string; // tag 2
		public mineType: number; // tag 3
		public overTime: number; // tag 4
		public fightPow: number; // tag 5
		public robStatus: boolean; // tag 6
		public berobotcount: number; // tag 7
		public mainEle: number; // tag 8
		public job: number; // tag 9
		public sex: number; // tag 10
		public constructor(buffer: Uint8Array = null) {
			super(11, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.dbid = this.de.ri ();
					break;
				case 1:
					this.actorName = this.de.rs ();
					break;
				case 2:
					this.guildName = this.de.rs ();
					break;
				case 3:
					this.mineType = this.de.ri ();
					break;
				case 4:
					this.overTime = this.de.ri ();
					break;
				case 5:
					this.fightPow = this.de.ri ();
					break;
				case 6:
					this.robStatus = this.de.rb ();
					break;
				case 7:
					this.berobotcount = this.de.ri ();
					break;
				case 8:
					this.mainEle = this.de.ri ();
					break;
				case 9:
					this.job = this.de.ri ();
					break;
				case 10:
					this.sex = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.dbid != undefined) {
				this.se.wi (this.dbid, 0);
			}

			if (this.actorName != undefined) {
				this.se.ws (this.actorName, 1);
			}

			if (this.guildName != undefined) {
				this.se.ws (this.guildName, 2);
			}

			if (this.mineType != undefined) {
				this.se.wi (this.mineType, 3);
			}

			if (this.overTime != undefined) {
				this.se.wi (this.overTime, 4);
			}

			if (this.fightPow != undefined) {
				this.se.wi (this.fightPow, 5);
			}

			if (this.robStatus != undefined) {
				this.se.wb (this.robStatus, 6);
			}

			if (this.berobotcount != undefined) {
				this.se.wi (this.berobotcount, 7);
			}

			if (this.mainEle != undefined) {
				this.se.wi (this.mainEle, 8);
			}

			if (this.job != undefined) {
				this.se.wi (this.job, 9);
			}

			if (this.sex != undefined) {
				this.se.wi (this.sex, 10);
			}

			return this.se.Close ();
		}
	}


	export class mine_record_info extends Sproto.SprotoTypeBase {
		
		public robIndex: number; // tag 0
		public mineType: number; // tag 1
		public roberId: number; // tag 2
		public roberName: string; // tag 3
		public robTime: number; // tag 4
		public robResult: boolean; // tag 5
		public type: number; // tag 6
		public isRevenge: boolean; // tag 7
		public fightPow: number; // tag 8
		public constructor(buffer: Uint8Array = null) {
			super(9, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.robIndex = this.de.ri ();
					break;
				case 1:
					this.mineType = this.de.ri ();
					break;
				case 2:
					this.roberId = this.de.ri ();
					break;
				case 3:
					this.roberName = this.de.rs ();
					break;
				case 4:
					this.robTime = this.de.ri ();
					break;
				case 5:
					this.robResult = this.de.rb ();
					break;
				case 6:
					this.type = this.de.ri ();
					break;
				case 7:
					this.isRevenge = this.de.rb ();
					break;
				case 8:
					this.fightPow = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.robIndex != undefined) {
				this.se.wi (this.robIndex, 0);
			}

			if (this.mineType != undefined) {
				this.se.wi (this.mineType, 1);
			}

			if (this.roberId != undefined) {
				this.se.wi (this.roberId, 2);
			}

			if (this.roberName != undefined) {
				this.se.ws (this.roberName, 3);
			}

			if (this.robTime != undefined) {
				this.se.wi (this.robTime, 4);
			}

			if (this.robResult != undefined) {
				this.se.wb (this.robResult, 5);
			}

			if (this.type != undefined) {
				this.se.wi (this.type, 6);
			}

			if (this.isRevenge != undefined) {
				this.se.wb (this.isRevenge, 7);
			}

			if (this.fightPow != undefined) {
				this.se.wi (this.fightPow, 8);
			}

			return this.se.Close ();
		}
	}


	export class robInfo extends Sproto.SprotoTypeBase {
		
		public name: string; // tag 0
		public win: boolean; // tag 1
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
					this.win = this.de.rb ();
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

			if (this.win != undefined) {
				this.se.wb (this.win, 1);
			}

			return this.se.Close ();
		}
	}


	export class sc_double_mining_notice_request extends Sproto.SprotoTypeBase {
		
		public doubleTime: boolean; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.doubleTime = this.de.rb ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.doubleTime != undefined) {
				this.se.wb (this.doubleTime, 0);
			}

			return this.se.Close ();
		}
	}


	export class sc_mine_berob_record_request extends Sproto.SprotoTypeBase {
		
		public mineRecordList: mine_record_info[]; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.mineRecordList = this.de.roa(mine_record_info);
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.mineRecordList != undefined) {
				this.se.woa (this.mineRecordList, 0);
			}

			return this.se.Close ();
		}
	}


	export class sc_mine_info_request extends Sproto.SprotoTypeBase {
		
		public exploitCnt: number; // tag 0
		public robCnt: number; // tag 1
		public exploitType: number; // tag 2
		public exploitOverTime: number; // tag 3
		public refreshType: number; // tag 4
		public refreshCnt: number; // tag 5
		public exploitStatus: number; // tag 6
		public beRobInfos: robInfo[]; // tag 7
		public stealCnt: number; // tag 8
		public isDoublereward: boolean; // tag 9
		public constructor(buffer: Uint8Array = null) {
			super(10, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.exploitCnt = this.de.ri ();
					break;
				case 1:
					this.robCnt = this.de.ri ();
					break;
				case 2:
					this.exploitType = this.de.ri ();
					break;
				case 3:
					this.exploitOverTime = this.de.ri ();
					break;
				case 4:
					this.refreshType = this.de.ri ();
					break;
				case 5:
					this.refreshCnt = this.de.ri ();
					break;
				case 6:
					this.exploitStatus = this.de.ri ();
					break;
				case 7:
					this.beRobInfos = this.de.roa(robInfo);
					break;
				case 8:
					this.stealCnt = this.de.ri ();
					break;
				case 9:
					this.isDoublereward = this.de.rb ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.exploitCnt != undefined) {
				this.se.wi (this.exploitCnt, 0);
			}

			if (this.robCnt != undefined) {
				this.se.wi (this.robCnt, 1);
			}

			if (this.exploitType != undefined) {
				this.se.wi (this.exploitType, 2);
			}

			if (this.exploitOverTime != undefined) {
				this.se.wi (this.exploitOverTime, 3);
			}

			if (this.refreshType != undefined) {
				this.se.wi (this.refreshType, 4);
			}

			if (this.refreshCnt != undefined) {
				this.se.wi (this.refreshCnt, 5);
			}

			if (this.exploitStatus != undefined) {
				this.se.wi (this.exploitStatus, 6);
			}

			if (this.beRobInfos != undefined) {
				this.se.woa (this.beRobInfos, 7);
			}

			if (this.stealCnt != undefined) {
				this.se.wi (this.stealCnt, 8);
			}

			if (this.isDoublereward != undefined) {
				this.se.wb (this.isDoublereward, 9);
			}

			return this.se.Close ();
		}
	}


	export class sc_mine_map_info_request extends Sproto.SprotoTypeBase {
		
		public mineMapNum: number; // tag 0
		public curIndex: number; // tag 1
		public mapMineList: mine_map_info[]; // tag 4
		public constructor(buffer: Uint8Array = null) {
			super(4, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.mineMapNum = this.de.ri ();
					break;
				case 1:
					this.curIndex = this.de.ri ();
					break;
				case 4:
					this.mapMineList = this.de.roa(mine_map_info);
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.mineMapNum != undefined) {
				this.se.wi (this.mineMapNum, 0);
			}

			if (this.curIndex != undefined) {
				this.se.wi (this.curIndex, 1);
			}

			if (this.mapMineList != undefined) {
				this.se.woa (this.mapMineList, 4);
			}

			return this.se.Close ();
		}
	}


	export class sc_mine_refresh_result_request extends Sproto.SprotoTypeBase {
		
		public result: boolean; // tag 0
		public mineType: number; // tag 1
		public refreshNum: number; // tag 2
		public costNum: number; // tag 3
		public constructor(buffer: Uint8Array = null) {
			super(4, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.result = this.de.rb ();
					break;
				case 1:
					this.mineType = this.de.ri ();
					break;
				case 2:
					this.refreshNum = this.de.ri ();
					break;
				case 3:
					this.costNum = this.de.ri ();
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
				this.se.wb (this.result, 0);
			}

			if (this.mineType != undefined) {
				this.se.wi (this.mineType, 1);
			}

			if (this.refreshNum != undefined) {
				this.se.wi (this.refreshNum, 2);
			}

			if (this.costNum != undefined) {
				this.se.wi (this.costNum, 3);
			}

			return this.se.Close ();
		}
	}


	export class sc_steal_mine_fight_notice_request extends Sproto.SprotoTypeBase {
		
		public countdown: number; // tag 0
		public constructor(buffer: Uint8Array = null) {
			super(1, buffer);
		}

		protected Decode (): void {
			let tag = -1;
			while (-1 != (tag = this.de.rt())) {
				switch (tag) {
				case 0:
					this.countdown = this.de.ri ();
					break;
				default:
					this.de.ReadUnknowData ();
					break;
				}
			}
		}

		public EncodeStream (stream: Sproto.SprotoStream): number {
			this.se.Open (stream);

			if (this.countdown != undefined) {
				this.se.wi (this.countdown, 0);
			}

			return this.se.Close ();
		}
	}


}

