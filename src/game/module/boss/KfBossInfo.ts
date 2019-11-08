class KfBossInfo {
	id: number;
	hp: number;
	people: number;
	reliveTime: number;
	challengeing: boolean;
	killScore:number;//封印值
	maxKillScore:number;//最大封印值

	selectAutoFight

	parser(bytes) {
		this.id = bytes.id
		this.hp = bytes.hp
		this.people = bytes.people
		this.reliveTime = 1e3 * bytes.reliveTime + egret.getTimer()
		this.challengeing = bytes.challengeing
		this.killScore = bytes.killScore;
		this.maxKillScore = bytes.maxKillScore;
		// this.challengeCD = bytes.challengeCD
	};
	get isDie() {
		// return (this.reliveTime - egret.getTimer()) / 1000 > 0;
		return this.hp <= 0
	}
	get openChallenge()
	{
		var config = GlobalConfig.kuafuBossConfig[this.id][0];
		if (config.zsLevel > 0) {
			return UserZs.ins().lv >= config.zsLevel;
		}
		else {
			return GameLogic.ins().actorModel.level >= config.level;
		}
	}
	get canChallenge() {
		var config = GlobalConfig.kuafuBossConfig[this.id][0];
		if (config.zsLevel > 0) {
			return !this.isDie && UserZs.ins().lv >= config.zsLevel;
		}
		else {
			return !this.isDie && GameLogic.ins().actorModel.level >= config.level;
		}
	}
	get levelLimit() {
		var config = GlobalConfig.kuafuBossConfig[this.id];
		return config.level
	}
	get zsLevel() {
		var config = GlobalConfig.kuafuBossConfig[this.id];
		return config.zsLevel
	}
	get bossConfig() {
		return GlobalConfig.kuafuBossConfig[this.id];
	}
}
window["KfBossInfo"]=KfBossInfo