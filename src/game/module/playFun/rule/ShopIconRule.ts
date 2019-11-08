class ShopIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.updateMessage = []
	}
	checkShowRedPoint() {
		return false
	}

	tapExecute() {
		if (Deblocking.Check(DeblockingType.TYPE_14))
			ViewManager.ins().open(ShopWin);
	}
}
window["ShopIconRule"]=ShopIconRule