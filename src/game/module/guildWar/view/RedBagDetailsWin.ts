class RedBagDetailsWin extends BaseEuiPanel {

	public static LAYER_LEVEL = LayerManager.UI_Popup

	////////////////////////////////////////////////////////////////////////////////////////////////////
	// RedBagDetailsSkin.exml
	////////////////////////////////////////////////////////////////////////////////////////////////////
	// private commonDialog: CommonDialog
	private num: eui.Label
	private list: eui.List
	private closeBtn: eui.Button
	private bg: eui.Component
	////////////////////////////////////////////////////////////////////////////////////////////////////

	effect: MovieClip
	public m_Lan1: eui.Label;

	public constructor() {
		super()
		this.skinName = "RedBagDetailsSkin"
		this.list.itemRenderer = RedBagRenderer;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101862;
	}

	private initMc() {
		if (!this.effect) {
			this.effect = new MovieClip
			this.effect.x = 244
			this.effect.y = 300
		}
	}

	open(...e: any[]) {
		// this.commonDialog.OnAdded(this)
		this.initMc();
		this.num.text = GuildReward.ins().robYbNum + ""
		this.list.dataProvider = new eui.ArrayCollection(GuildReward.ins().rebList)
		e[0] && (this.effect.loadUrl(ResDataPath.GetUIEffePath("yanhuaeff"), !0, 1), this.addChild(this.effect))

		this.AddClick(this.closeBtn, this._OnClick)
		this.AddClick(this.bg, this._OnClick)
	}

	close() {
		// this.commonDialog.OnRemoved()
		DisplayUtils.dispose(this.effect);
		this.effect = null;
	}

	_OnClick() {
		ViewManager.ins().close(this)
	}
}
window["RedBagDetailsWin"] = RedBagDetailsWin