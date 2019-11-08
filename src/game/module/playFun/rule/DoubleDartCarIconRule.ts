
class DoubleDartCarIconRule extends RuleIconBase{
	public constructor(t) {
		super(t)
		this.updateMessage = [
			MessageDef.DOUBLE_DARTCAR_NOTICE
		]
	}

	checkShowIcon () {
		return DartCarModel.ins().isDoubleDartCar;
	}
	
	getEffName (e) {
		this.effX = 145
		this.effY = 41
		return "eff_main_icon03"
	}
	
	tapExecute() {
		if(Deblocking.Check(DeblockingType.TYPE_27))
			ViewManager.ins().open(LadderWin,1);
	}
}
window["DoubleDartCarIconRule"]=DoubleDartCarIconRule