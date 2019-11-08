class TreasureIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.firstTap = true
		this.updateMessage = [
			UserBag.postHuntStore,
			MessageDef.CHECK_HAVE_CAN
		]
	}

	checkShowIcon() {
		this.tar.icon =  "fun_xb_png";
		if (GameGlobal.actorModel.level < 10) {
			return false
		}
		return true;
	}
	checkShowRedPoint() {
		// if (GameLogic.ins().actorModel.level < 10) {
		// 	return false
		// }
		return (UserBag.ins().getHuntGoodsBySort().length > 0 || LegendModel.ins().IsRedItem()) ? 1 : 0
	}

	getEffName (e) {
		return this.DefEffe(e)
	}

	tapExecute() {
			this.firstTap = false
			ViewManager.ins().open(TreasureHuntWin);
	}
}
window["TreasureIconRule"]=TreasureIconRule