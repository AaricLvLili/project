class FbBtnIconRule extends RuleIconBase {
	public constructor(t) {
		super(t);
		this.updateMessage = [
			MessageDef.FB_COUNT_UPDATE,
			MessageDef.CHALLENGE_UPDATE_INFO,
			MessageDef.TRYROAD_DATAS
		];
	}


	checkShowIcon() {
		return true;
	};
	checkShowRedPoint() {
		// if (GameLogic.ins().actorModel.level < 10)
		// 	return 0;
		// return UserFb.ins().getCount() || UserFb2.ins().IsRed() || MiJingModel.getInstance.checkRedPoint() || DrillModel.ins().isRed();
		return Deblocking.IsRedDotFubenBtn()
	};
	tapExecute() {
		ViewManager.ins().open(FbWin);
	};
}
window["FbBtnIconRule"]=FbBtnIconRule