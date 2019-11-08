class RankIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.updateMessage = [Rank.postPraiseData, Rank.postAllPraiseData]
	}
	checkShowIcon() {
		return StartGetUserInfo.isOne == false;
	}
	checkShowRedPoint () {
		return Rank.ins().canPraiseInAll();
	}

	tapExecute  () {
		Rank.ins().OpenRankPanel(RankDataType.TYPE_POWER);
	}
}
window["RankIconRule"]=RankIconRule