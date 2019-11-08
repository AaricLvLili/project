class RingPanelIconRule extends RuleIconBase {
	public constructor(t) {
		super(t)
		this.updateMessage = [
			MessageDef.ITEM_COUNT_CHANGE,
			MessageDef.LEVEL_CHANGE,
			MessageDef.RING_BOSS_UPDATE,
			MessageDef.RING_BUFF_UPDATE
		]
	}

	checkShowIcon () {
		return SpecialRing.IsDeblocking()
	}
	
	checkShowRedPoint () {
		return ( SpecialRing.ins().IsRedPoint() || RingSoulModel.ins().hasRedPoint() || RingSoulModel.ins().hasRedRing()) ? 1 : 0
	}
	
	getEffName (e) {
		// return this.DefEffe(e)
	}
	
	tapExecute () {
		ViewManager.ins().open(RingMainWin)
		this.update()
	}
}
window["RingPanelIconRule"]=RingPanelIconRule