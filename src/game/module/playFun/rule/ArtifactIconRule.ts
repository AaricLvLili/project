class ArtifactIconRule extends RuleIconBase {

	public constructor(t) {
		super(t)
		this.firstTap = true
		this.updateMessage = [
			MessageDef.ITEM_COUNT_CHANGE,
			MessageDef.LEVEL_CHANGE
		]
	}

	checkShowIcon() {
		return true;
	}

	checkShowRedPoint() {
		return Deblocking.IsRedDotArtifactBtn();
	}

	getEffName(e) {
		// return this.DefEffe(e)
	}

	tapExecute() {
		if (Deblocking.Check(DeblockingType.TYPE_15)) {
			ViewManager.ins().open(ArtifactMainWin)
			this.firstTap = false
			this.update()
		}
	}
}
window["ArtifactIconRule"] = ArtifactIconRule