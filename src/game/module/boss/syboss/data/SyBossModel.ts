class SyBossModel {
	private static s_instance: SyBossModel;
	public static get getInstance(): SyBossModel {
		if (!SyBossModel.s_instance) {
			SyBossModel.s_instance = new SyBossModel();
		}
		return SyBossModel.s_instance;
	}
	public constructor() {
		this.syBossDic = new Dictionary<SyBossData>();
	}

	public selectBossIndex: number = 0;

	public syBossDic: Dictionary<SyBossData>;

	public syBossRemind: number = 0;

	public isSendGetData: boolean = false;
	public setDic(boosInfos: Sproto.public_boss_info[]) {
		this.syBossDic.clear();
		for (var i = 0; i < boosInfos.length; i++) {
			let syBossData = new SyBossData();
			syBossData.challengeing = boosInfos[i].challengeing;
			syBossData.hp = boosInfos[i].hp;
			syBossData.id = boosInfos[i].id;
			syBossData.people = boosInfos[i].people;
			syBossData.reliveTime = boosInfos[i].reliveTime + GameServer.serverTime;
			if (boosInfos[i].escapeTime) {
				syBossData.runTime = boosInfos[i].escapeTime + GameServer.serverTime;
			} else {
				syBossData.runTime = 0 + GameServer.serverTime;
			}
			syBossData.ownerNmae = boosInfos[i].ownerNmae;
			this.syBossDic.set(syBossData.id, syBossData)
		}
	}

	public checkIsRemind(id: number) {
		let re = this.syBossRemind & 1 << id;
		if (re > 0) {
			return true;
		}
		return false;
	}

	public checkAllRedPoint() {
		let config = GlobalConfig.ins("PaidBossConfig");
		for (let key in config) {
			let isShow: boolean = this.checkRedPoint(parseInt(key));
			if (isShow) {
				return true;
			}
		}
		return false;
	}

	public checkRedPoint(id: number): boolean {
		if (this.checkIsRemind(id)) {
			let syBossData = this.syBossDic.get(id);
			if (syBossData) {
				let paidBossConfig = GlobalConfig.ins("PaidBossConfig")[id][0];
				if (paidBossConfig.zsLevel > 0) {
					let playerzs = UserZs.ins() ? UserZs.ins().lv : 0;
					if (playerzs < paidBossConfig.zsLevel) {
						return false;
					}
				} else {
					let playerlv = GameLogic.ins().actorModel.level;
					if (playerlv >= paidBossConfig.level) {
						return false;
					}
				}
				if (syBossData.isBossDead) {
					return false;
				}
				let haveNum = UserBag.ins().getBagGoodsCountById(0, paidBossConfig.ticket.id);
				if (haveNum >= paidBossConfig.ticket.count) {
					return true;
				}
				let yb: number = GameLogic.ins().actorModel.yb;
				if (yb >= paidBossConfig.cost.count) {
					return true;
				}
			}
		}
		return false;
	}
}
window["SyBossModel"] = SyBossModel