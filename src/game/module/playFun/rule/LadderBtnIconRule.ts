class LadderBtnIconRule extends RuleIconBase {

	private tianTiConstConfig:any;
	public constructor(t) {
		super(t);
		this.updateMessage = [
			Ladder.ins().postTadderChange,
			MessageDef.ENCOUNTER_DATA_CHANGE,
			MessageDef.MINE_STATU_CHANGE,
			MessageDef.DARTCAR_STATU_CHANGE,
			MessageDef.ACROSSLADDER_HISTORY_RANK
		];
		TenKillSproto.ins().sendGetTenKillMsg();
	}

	checkShowIcon() {
		return true;
	};
	checkShowRedPoint() {
		// if(!Deblocking.Check(DeblockingType.TYPE_07,true))
		// 	return 0;
		// return Encounter.CheckRedPoint() || Ladder.ins().checkRedShow() 
		// || MineModel.ins().mRedPoint.IsRed() || DartCarModel.ins().carRedPoint.IsRed() || AcrossLadderCenter.ins().rankRewardRedPoint()||TenKillModel.getInstance.checkRedPoint();
		return Deblocking.IsRedDotLadderBtn()
	};
	getEffName(redPointNum) {
		return "";
	};
	tapExecute() {
		if(Deblocking.Check(DeblockingType.TYPE_07))
			ViewManager.ins().open(LadderWin);
	};
}
window["LadderBtnIconRule"]=LadderBtnIconRule