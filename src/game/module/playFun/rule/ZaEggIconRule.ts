class ZaEggIconRule extends RuleIconBase{
	public constructor(t) {
		super(t)
		this.firstTap = true
		this.updateMessage = [
			MessageDef.OPEN_SERVER
		]
	}

	checkShowIcon () {
		let config = GlobalConfig.ins("SmashEggsConfig").opentime;
		return (GameServer.serverOpenDay >= config[0] && GameServer.serverOpenDay <= config[1])
	}
	
	getEffName (e) {
		return this.DefEffe(e)
	}
	
	tapExecute () {
		ViewManager.ins().open(ActivityWin)
		// this.firstTap = false
	}
}
window["ZaEggIconRule"]=ZaEggIconRule