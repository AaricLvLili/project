class DoubleMiningIconRule extends RuleIconBase{
	public constructor(t) {
		super(t)
		this.updateMessage = [
			MessageDef.DOUBLE_MINING_NOTICE
		]
	}

	checkShowIcon () {
		return MineModel.ins().isDoubleMining;
	}
	
	getEffName (e) {
		this.effX = 145
		this.effY = 41
		return "eff_main_icon03"
	}
	
	tapExecute() {
		if(Deblocking.Check(DeblockingType.TYPE_08))
			ViewManager.ins().open(LadderWin,2);
	}
}
window["DoubleMiningIconRule"]=DoubleMiningIconRule