class ZhuZaiEquipWin extends BaseEuiPanel implements ICommonWindow {

    public static LAYER_LEVEL = LayerManager.UI_Main;

	private commonWindowBg: CommonWindowBg

    // 留给子类使用
	private itemTab: eui.Component

	private mItemTab: ZhuzaiEquipItemTab

	private growPanel: ZhuZaiEquipGrowPanel
	private fenjiePanel:ZhuZaiFenjiePanel

	public constructor() {
		super()
		this.skinName = "ZhuzaiEquipPanelSkin"
	}

	initUI  () {
		super.initUI()
		
		this.mItemTab = new ZhuzaiEquipItemTab(this.itemTab)
		this.growPanel = new ZhuZaiEquipGrowPanel();
		this.growPanel.m_ItemTab = this.mItemTab;
		this.growPanel.name = GlobalConfig.jifengTiaoyueLg.st100208;
		this.commonWindowBg.AddChildStack(this.growPanel);

		this.fenjiePanel = new ZhuZaiFenjiePanel();
		this.fenjiePanel.name = GlobalConfig.jifengTiaoyueLg.st100209;
		this.commonWindowBg.AddChildStack(this.fenjiePanel);
	}

	open(...param: any[]) {
		this.mItemTab.Open()
		this.commonWindowBg.OnAdded(this, param ? param[0] : 0, param[1] ? param[1] : 0)
		this.mItemTab.SetSelectIndex(param[2] ? param[2] : 0)

		this.observe(MessageDef.ZHUZAI_DATA_UPDATE, this.updateRedPoint)
		this.observe(MessageDef.ZHUZAI_UP_RESULT, this.playEff)
		this.observe(MessageDef.ITEM_COUNT_CHANGE, this.updateRedPoint)
	    this.updateRedPoint();
	}

	close() {
		this.mItemTab.Close()
		this.commonWindowBg.OnRemoved()
	}

	updateRedPoint () {
		this.commonWindowBg.ShowTalRedPoint(0, GameGlobal.zhuZaiModel.canAllLevelup() || GameGlobal.zhuZaiModel.canAllAdvance())
		this.commonWindowBg.ShowTalRedPoint(1, GameGlobal.zhuZaiModel.canFengjie())
	}

	playEff (e) {
		var t = new MovieClip()
		// t.scaleX = t.scaleY = 1, t.rotation = 0, t.x = 360, t.y = 200, t.loadFile(RES_DIR_EFF + (e ? "eff_success" : "eff_fail"), !0, 1, function() {
		// 	ObjectPool.push(t)
		// }), this.addChild(t)
		var ename = e ? "eff_success" : "eff_fail";
		t.scaleX = t.scaleY = 1, t.rotation = 0, t.x = 235, t.y = 160, t.loadUrl(ResDataPath.GetUIEffePath(ename), !0, 1,()=> {
			// ObjectPool.push(t)
			DisplayUtils.dispose(t);
			t = null;
		}), this.addChild(t)
	}

	OnBackClick(clickType: number): number {
		return 0
	}

	OnOpenIndex(openIndex: number): boolean {
		this.itemTab.visible = openIndex != 1
		return true
	}
}
window["ZhuZaiEquipWin"]=ZhuZaiEquipWin