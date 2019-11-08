class ZhuanZhiEquipWin extends BaseEuiPanel implements ICommonWindow {
	public constructor() {
		super();
		this.skinName = "ZhuanZhiEquipWinSkin";
	}

	private commonWindowBg: CommonWindowBg;
	private equipBG: eui.Group;
	private zhuanZhiPanel: ZhuanZhiPanel;
	private zhuanZhiEquipMainPanel: ZhuanZhiEquipMainPanel;
	private zhuanZhiEquipUpLevelPanel: ZhuanZhiEquipUpLevelPanel;
	private zhuanZhiEquipUpStarPanel: ZhuanZhiEquipUpStarPanel;

	initUI() {
		if (!this.zhuanZhiPanel) {
			this.zhuanZhiPanel = new ZhuanZhiPanel();
			this.zhuanZhiPanel.name = GlobalConfig.jifengTiaoyueLg.st100649;//"转职";
			this.commonWindowBg.AddChildStack(this.zhuanZhiPanel);
		}

		if (!this.zhuanZhiEquipMainPanel) {
			this.zhuanZhiEquipMainPanel = new ZhuanZhiEquipMainPanel();
			this.zhuanZhiEquipMainPanel.name = GlobalConfig.jifengTiaoyueLg.st100652;//"里装";
			this.commonWindowBg.AddChildStack(this.zhuanZhiEquipMainPanel);
		}

		if (!this.zhuanZhiEquipUpLevelPanel) {
			this.zhuanZhiEquipUpLevelPanel = new ZhuanZhiEquipUpLevelPanel();
			this.zhuanZhiEquipUpLevelPanel.name = GlobalConfig.jifengTiaoyueLg.st100208;//升级
			this.commonWindowBg.AddChildStack(this.zhuanZhiEquipUpLevelPanel);
		}

		if (!this.zhuanZhiEquipUpStarPanel) {
			this.zhuanZhiEquipUpStarPanel = new ZhuanZhiEquipUpStarPanel();
			this.zhuanZhiEquipUpStarPanel.name = GlobalConfig.jifengTiaoyueLg.st101107;//"升星";
			this.commonWindowBg.AddChildStack(this.zhuanZhiEquipUpStarPanel);
		}
	};

	destoryView() {
		super.destoryView()
	};

	public open(...param: any[]) {
		let selectIndex = param[0] || 0;
		let roleIndex = param[1] || 0;
		this.commonWindowBg.OnAdded(this, selectIndex, roleIndex);
		this.equipBG.visible = selectIndex && selectIndex > 0;
		this.observe(MessageDef.CHANGE_EQUIP, this.refushRed);
		this.observe(MessageDef.ITEM_COUNT_CHANGE, this.refushRed);
		this.refushRed();
	};

	public close() {
		this.commonWindowBg.OnRemoved()
	}

	public static openCheck(param) {
		var index = param[0] == undefined ? 0 : param[0];
		if (index == 0) {
			return Deblocking.Check(DeblockingType.TYPE_30)
		} else {
			return Deblocking.Check(DeblockingType.TYPE_31)
		}
	};

	OnBackClick(clickType: number): number {
		return 0
	}

	OnOpenIndex(openIndex: number): boolean {
		this.equipBG.visible = openIndex && openIndex > 0;
		return true
	}

	UpdateContent(): void {

	}

	/**更新红点提示 */
	refushRed() {
		this.commonWindowBg.CheckTabRedPoint();
	}
}
ViewManager.ins().reg(ZhuanZhiEquipWin, LayerManager.UI_Main);

window["ZhuanZhiEquipWin"] = ZhuanZhiEquipWin