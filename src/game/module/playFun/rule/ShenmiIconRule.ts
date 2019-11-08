class ShenmiIconRule extends RuleIconBase {

	private funcOpenConfig: any;
	public constructor(t) {
		super(t)
		this.firstTap = true;
		this.updateMessage = [
			MessageDef.LEVEL_CHANGE,
			MessageDef.SHOP_MEADAL_OPEN_STATE
		]
	}

	checkShowIcon() {
		if (this.funcOpenConfig == null)
			this.funcOpenConfig = GlobalConfig.ins("FuncOpenConfig");

		if (GameLogic.ins().actorModel.level < this.funcOpenConfig[14].conditionnum || !Shop.ins().openState) {
			return false;
		}
		/**需求屏蔽 */
		return false
	}

	checkShowRedPoint() { }

	getEffName(e) {
		return this.DefEffe(e)
	}

	tapExecute() {
		this.firstTap = false
		ViewManager.ins().open(ShopWin);
	}
}
window["ShenmiIconRule"] = ShenmiIconRule