class ZsBossIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.updateMessage = [
			MessageDef.ZS_BOSS_OPEN
		]
	}

	checkShowIcon() {
		return ZsBoss.ins().acIsOpen;
	}

	getEffName(e) {
		this.effX = 145
		this.effY = 41
		return "eff_main_icon03"
	}

	tapExecute() {
		// if(GameServer.serverOpenDay < 4)
		// {
		// 	UserTips.ErrorTip("开服第4天开启转生BOSS");
		// 	return;
		// }
		// ViewManager.ins().open(BossWin,3);
		if (Deblocking.Check(DeblockingType.TYPE_21))
			ViewManager.ins().open(BossWin, 3);
	}
}
window["ZsBossIconRule"] = ZsBossIconRule