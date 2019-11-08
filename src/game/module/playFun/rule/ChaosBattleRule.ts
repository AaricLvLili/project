class ChaosBattleRule extends RuleIconBase {
	public constructor(t) {
		super(t)

		this.lab = t.getChildByName("lab")
	}
	private lab: eui.Label
	checkShowIcon() {
		let isShow = ChaosBattleModel.getInstance.checkRedPoint()
		return isShow;
	}


	public onTimer() {
		this.lab.text = DateUtils.GetFormatSecond(ChaosBattleModel.getInstance.endTime - GameServer.serverTime, DateUtils.TIME_FORMAT_1)
	}

	checkShowRedPoint() {
		return false;
	}

	getEffName(e) {
		return this.firstTap || e ? this.DefEffe(e) : void 0
	}

	tapExecute() {
		ViewManager.ins().open(LadderWin, 3);
	}
}
window["ChaosBattleRule"] = ChaosBattleRule