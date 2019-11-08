class BossIconRule extends RuleIconBase {

	// private publicBossBaseConfig: any;
	public constructor(f) {
		super(f)

		this.updateMessage = [
			MessageDef.PUBLIC_BOSS_LIST_DATA,
			MessageDef.KF_BOSS_LIST_DATA,
			MessageDef.FB_COUNT_UPDATE,
		]
	}

	checkShowRedPoint() {
		return UserBoss.ins().isCanChalleng() || DailyFubenConfig.isCanChallenge() || ZsBoss.ins().IsRedPoint() || UserBoss.ins().isCanChallengKf() || HomeBossModel.getInstance.checkAllRedPoint() || SyBossModel.getInstance.checkAllRedPoint()
		// if (!Deblocking.Check(DeblockingType.TYPE_06, true)) {
		// 	return false
		// }
		// if (this.publicBossBaseConfig == null)
		// 	this.publicBossBaseConfig = GlobalConfig.ins("PublicBossBaseConfig");
		// var e = this.publicBossBaseConfig.openCheck;
		// if (UserFb.ins().guanqiaID < e) {
		// 	return 0
		// } else if (DailyFubenConfig.isCanChallenge() || UserBoss.ins().isCanChalleng() || UserBoss.ins().isCanChallengKf()
		// 	|| HomeBossModel.getInstance.checkAllRedPoint() || SyBossModel.getInstance.checkAllRedPoint()) {
		// 	return 1
		// }
		// return 0
	}

	tapExecute() {
		if (!Deblocking.Check(DeblockingType.TYPE_06)) {
			return
		}
		ViewManager.ins().open(BossWin)
		UserBoss.ins().postBossData(false)
	}
}
window["BossIconRule"] = BossIconRule