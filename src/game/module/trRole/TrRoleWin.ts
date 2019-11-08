class TrRoleWin extends BaseEuiPanel implements ICommonWindow {

	public static LAYER_LEVEL = LayerManager.UI_Main

	private commonWindowBg: CommonWindowBg

	public mActorData: Sproto.sc_show_other_actor_request
	public mRoleData: Role[] = []

	initUI() {
		super.initUI();
		this.skinName = "MainWinSkin";
		this.commonWindowBg.AddChildStack(new TrRoleInfoPanel(this))
		this.commonWindowBg.AddChildStack(new TrRoleWingPanel(this))
	//	this.commonWindowBg.AddChildStack(new TrSpecialRingWin(this))
	//	this.commonWindowBg.AddChildStack(new TrSkillUpPanel(this))
	}
	
	open(...args: any[]) {
		this.mActorData = GameLogic.ins().GetShowOtherActor(args[0])
		if (this.mActorData == null) {
			ViewManager.ins().close(this)
			return
		}
		this.mRoleData = []
		for (let data of this.mActorData.roleList) {
			let role = new Role
			role.parser(data)
			this.mRoleData.push(role)
		}
		this.commonWindowBg["roleSelect"]["mRoleData"] = this.mRoleData as any
		this.commonWindowBg.OnAdded(this)
		// if(this.mActorData.actorData.zhuan==0){
        //  this.commonWindowBg["nameIcon"].text = this.mActorData.actorData.level+"级"+this.mActorData.actorData.name
		// }else{
		//  this.commonWindowBg["nameIcon"].text =this.mActorData.actorData.zhuan+"转"+this.mActorData.actorData.level+"级"+this.mActorData.actorData.name	
		// }		
	}
    
	close() {
		this.commonWindowBg.OnRemoved()
	}

	OnOpenIndex() {
		return true
	}

}
window["TrRoleWin"]=TrRoleWin