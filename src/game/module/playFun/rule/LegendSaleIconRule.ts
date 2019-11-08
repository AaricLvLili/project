class LegendSaleIconRule extends RuleIconBase {
	public constructor(t) {
		super(t);
		this.firstTap = true
		this.updateMessage = [
			MessageDef.LEGEND_UPDATE_SALE
		];
	}

	checkShowIcon() {
		return false;//LegendModel.ins().IsOpenSale()
	}

	checkShowRedPoint() {
		return 0
	}

	getEffName (e) {
		return this.DefEffe(e)
	}

	tapExecute() {
		this.firstTap = false
		ViewManager.ins().open(LegendSalePanel)
	}
}
window["LegendSaleIconRule"]=LegendSaleIconRule