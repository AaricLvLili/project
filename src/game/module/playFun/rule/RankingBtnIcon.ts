class RankingBtnIcon extends RuleIconBase {
	public constructor(t) {
		super(t)

		this.updateMessage = [
			 Rank.postPraiseResult,
			 GameLogic.ins().postLevelChange
		];
	}

	checkShowIcon() {
		return true;
	};
	tapExecute() {
		ViewManager.ins().open(RankingWin);
	};
}
window["RankingBtnIcon"]=RankingBtnIcon