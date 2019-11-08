class PublicBossInfo {
	id: number;
	hp: number;
	people: number;
	reliveTime: number;
	challengeing: boolean;
	// challengeCD: number = 0;

	selectAutoFight

	parser(bytes: Sproto.public_boss_info) {
		this.id = bytes.id
		this.hp = bytes.hp
		this.people = bytes.people
		this.reliveTime = 1e3 * bytes.reliveTime + egret.getTimer()
		this.challengeing = bytes.challengeing
		// this.challengeCD = bytes.challengeCD
	};
	get isDie() {
		return (this.reliveTime - egret.getTimer()) / 1000 > 0;
	}
	get openChallenge()
	{
		var config = GlobalConfig.publicBossConfig[this.id][0];
		if (config.zsLevel > 0) {
			return UserZs.ins().lv >= config.zsLevel;
		}
		else {
			return GameLogic.ins().actorModel.level >= config.level;
		}
	}
	get canChallenge() {
		var config = GlobalConfig.publicBossConfig[this.id][0];
		if (config.zsLevel > 0) {
			return !this.isDie && UserZs.ins().lv >= config.zsLevel;
		}
		else {
			return !this.isDie && GameLogic.ins().actorModel.level >= config.level;
		}
	}
	get levelLimit() {
		var config = GlobalConfig.publicBossConfig[this.id];
		return config.level
	}
	get zsLevel() {
		var config = GlobalConfig.publicBossConfig[this.id];
		return config.zsLevel
	}
	get bossConfig() {
		return GlobalConfig.publicBossConfig[this.id];
	}
}
window["PublicBossInfo"]=PublicBossInfo