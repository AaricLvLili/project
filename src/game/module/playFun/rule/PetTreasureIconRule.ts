class PetTreasureIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.firstTap = true
		this.updateMessage = [
		]
	}

	checkShowIcon() {
		return Deblocking.Check(DeblockingType.TYPE_82, true);
	}
	checkShowRedPoint() {
		return false;
	}

	getEffName(e) {
		return this.DefEffe(e)
	}

	tapExecute() {
		this.firstTap = false
		ViewManager.ins().open(PetTreasureWin);
	}
}
window["PetTreasureIconRule"] = PetTreasureIconRule