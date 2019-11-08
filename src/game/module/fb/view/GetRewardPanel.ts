class GetRewardPanel extends BaseEuiPanel {

    public static LAYER_LEVEL = LayerManager.UI_Popup

	private sure: eui.Button
	private desc: eui.Label
	private getway: eui.Image
	private group: eui.List
	// private m_Items: ItemBase[]

	private m_Rewards: any[] = []
	private m_Des: string
	private m_Callback: Function
	private m_CanReward: boolean
	//public titleLabel:eui.Label;
	public dialogCloseBtn:eui.Button;

	public constructor() {
		super()
		this.skinName = "ChapterRewardPanelSkin"
		this.group.itemRenderer = ItemBase
		this.sure.label=GlobalConfig.jifengTiaoyueLg.st100004;
	}

	open(...param: any[]) {

		//this.titleLabel.text = param[0]
		this.m_bg.init(`GetRewardPanel`,param[0])
		this.m_Des = param[1]
		this.m_Rewards = param[2]
		this.m_Callback = param[3]
		this.m_CanReward = param[4] == null ? true : param[4]

		// this.m_Items = this.group.$children as ItemBase[]
		// this.group.removeChildren()

        this.addTouchEvent(this, this.OnClick, this.sure)
		this.AddClick(this.dialogCloseBtn , this._OnClick);

		this.UpdateContent()
	}

	protected CanReward(): boolean {
		return this.m_CanReward
	}

	protected SetDes(str: string): void {
		this.m_Des = str
		this.desc.text = str
	}

	protected SetReward(rewards): void {
		this.m_Rewards = rewards || []
		this.group.dataProvider = new eui.ArrayCollection(this.m_Rewards)
		// let itemList = this.m_Items

		// for (let i = 0; i < rewards.length; ++i) {
		// 	let item = itemList[i]
		// 	if (item) {
		// 		item.data = rewards[i]
		// 		this.group.addChild(item)
		// 	}
		// }
	}

	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}
	
	close() {
		this.removeEvents()
		this.removeObserve()
	}

	private UpdateContent() {
		let isReward = this.CanReward()

		this.sure.enabled = isReward
		this.getway.visible = !isReward

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
			UserTips.ins().showTips(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101030,[count]))
		}
	}
}
window["GetRewardPanel"]=GetRewardPanel