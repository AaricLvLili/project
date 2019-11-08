class LegendSalePanel extends BaseEuiPanel implements ICommonWindow, ICommonWindowTitle {

    public static LAYER_LEVEL = LayerManager.UI_Main

	private commonWindowBg: CommonWindowBg
	private roleShowPanel: RoleShowPanel
	private rankLabel: eui.Label
	private powerImg: eui.Label
	private dataGroup: eui.DataGroup
	private y_price: PriceIcon
	private price: PriceIcon
	private buyBtn: eui.Button
	private timeLabel: eui.Label

	private m_Stage: number = 1
	windowTitleIconName: string = "L永恒神装R";
	public constructor() {
		super()
		this.skinName = "LegendSalePanelSkin";
		this.dataGroup.itemRenderer = ItemBaseEffe;
	}

	public open() {
		this.commonWindowBg.OnAdded(this)
		this.AddClick(this.commonWindowBg.closeBtn, this._OnClickClose)
		this.observe(MessageDef.LEGEND_UPDATE_SALE, this._DoUpdate)
		this.AddClick(this.buyBtn, this._OnClick)
		TimerManager.ins().doTimer(1000, 0, this._UpdateTimeLabel, this)
		this.UpdateContent()
	}

	public close() {
		this.commonWindowBg.OnRemoved()
		TimerManager.ins().doTimer(1000, 0, this._UpdateTimeLabel, this)
	}

	private _OnClickClose() {
		ViewManager.ins().close(this)
	}

	private _OnClick() {
		if (LegendModel.ins().IsOpenSale()) {
			if (Checker.Money(MoneyConst.yuanbao, LegendModel.ins().GetSaleConfig().price)) {
				LegendModel.ins().SendBuyLegendSale()
			}
		}
	}

	private _DoUpdate(): void {
		this.buyBtn.visible = LegendModel.ins().IsOpenSale()
	}

	UpdateContent(): void {
		
		this.buyBtn.visible = false
		let config = LegendModel.ins().GetSaleConfig()

		let configData = config ? config : GlobalConfig.ins("LegendSuitSoldConfig")[1]
		this.m_Stage = configData.legendLv
		this.dataGroup.dataProvider = new eui.ArrayCollection(RewardData.ToRewardDatas(config.reward))
		this.dataGroup.validateNow()
		// for (let i = 0; i < this.dataGroup.numChildren; ++i) {
		// 	(this.dataGroup.getChildAt(i) as ItemBase).isShowName(false)
		// }
		this.y_price.price = config.yuanjia
		this.price.price = config.price
		// this.powerImg.text = `${this.m_Stage}`
		this.rankLabel.text = `${this.m_Stage}阶永恒神装`
		LegendShowPanel.SetRoleShowPanel(this.roleShowPanel, this.m_Stage, 0)

		this._UpdateTimeLabel()
	}

	private _UpdateTimeLabel() {
		this.timeLabel.visible = LegendModel.ins().IsOpenSale()
		this.buyBtn.visible = LegendModel.ins().IsOpenSale()
		this.timeLabel.text = "剩余时间：" + DateUtils.format_12(LegendModel.ins().GetSaleSurplusTime() * 1000, 4)
	}
}
window["LegendSalePanel"]=LegendSalePanel