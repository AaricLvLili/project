class WorldBossIconRule extends RuleIconBase{
	public constructor(t) {
		super(t)
		this.updateMessage = [
			MessageDef.WORLD_BOSS_OPEN
		]
	}

	checkShowIcon () {
		return ZsBoss.ins().wAcIsOpen;
	}
	
	getEffName (e) {
		this.effX = 145
		this.effY = 41
		return "eff_main_icon03"
	}
	
	tapExecute() {
		if(Deblocking.Check(DeblockingType.TYPE_23))
			ViewManager.ins().open(WorldBossWin);
	}
}
window["WorldBossIconRule"]=WorldBossIconRule