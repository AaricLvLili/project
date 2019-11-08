class GetReward2Panel extends BaseEuiPanel {

	public static LAYER_LEVEL = LayerManager.UI_Popup
	private commonDialog: CommonDialog
	private sure: eui.Button
	private desc: eui.Label
	private getway: eui.Image
	private group: eui.List
	// private m_Items: ItemBase[]

	private m_Rewards: any[] = []
	private m_Des: string
	private m_Callback: Function
	private state: RewardState;
	public titleLabel: eui.Label;
	//public dialogCloseBtn: eui.Button;

	public m_bg: CommonPopBg;


	public constructor() {
		super()
		this.skinName = "ChapterRewardPanelSkin"
		this.group.itemRenderer = ItemBase
		this.sure.label = GlobalConfig.jifengTiaoyueLg.st100004;
	}

	open(...param: any[]) {

		//this.m_bg.txtTitle.text = param[0]
		this.m_Des = param[1]
		this.m_Rewards = param[2]
		this.m_Callback = param[3]
		this.state = param[4] == null ? RewardState.CanGet : param[4]

		this.addTouchEvent(this, this.OnClick, this.sure)
		//this.AddClick(this.dialogCloseBtn, this._OnClick);
		//this.AddClick(this.m_bg.closeTopBtn, this._OnClick);
		this.m_bg.init("GetReward2Panel", param[0])
		this.UpdateContent()
	}

	protected SetDes(str: string): void {
		this.m_Des = str
		this.desc.text = str
	}

	protected SetReward(rewards): void {
		this.m_Rewards = rewards || []
		this.group.dataProvider = new eui.ArrayCollection(this.m_Rewards)
	}

	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}

	close() {
		this.removeEvents()
		this.removeObserve()
	}

	private UpdateContent() {
		if (this.state == RewardState.NotReached) {
			this.sure.enabled = false;
			this.getway.visible = false;
		}
		else if (this.state == RewardState.CanGet) {
			this.sure.enabled = true;
			this.getway.visible = false;
		}
		else if (this.state == RewardState.Gotten) {
			this.sure.enabled = false;
			this.getway.visible = false
				;
		}
		else {
			this.sure.enabled = true;
			this.getway.visible = false;
		}

		if (this.m_Rewards) {
			this.SetReward(this.m_Rewards)
		}
		if (this.m_Des) {
			this.SetDes(this.m_Des)
		}
	}

	private OnClick() {
		var rewards = this.m_Rewards
		var count = 0

		for (var i = 0; i < rewards.length; i++)
			1 == rewards[i].type && rewards[i].id < 2e5 && count++;

		if (UserBag.ins().getSurplusCount() >= count) {
			if (this.m_Callback && !this.m_Callback()) {
				ViewManager.ins().close(this)
			}
			this.m_Callback = null
		} else {
			UserTips.ins().showTips("|C:0xf87372&T:背包少于" + count + "格，请清理背包|")
		}
	}
}
window["GetReward2Panel"] = GetReward2Panel