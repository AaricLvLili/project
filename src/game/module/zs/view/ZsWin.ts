class ZsWin extends BaseEuiPanel implements ICommonWindow {
	public constructor() {
		super();
		this.skinName = "MainWinSkin";
		this.layerLevel = VIEW_LAYER_LEVEL.TOP;
	}

	private commonWindowBg: CommonWindowBg
	private skillMainPanel: SkillMainPanel;//技能
	private fuwenPanel: FuwenPanel;//符文
	private neiGongPanel: NeiGongPanel;//内功
	private jingMai: JingMaiPanel//元神
	private prestige: PrestigeWin;
	initUI() {
		super.initUI()
		this.skillMainPanel = new SkillMainPanel();
		this.skillMainPanel.name = GlobalConfig.jifengTiaoyueLg.st100246;
		this.commonWindowBg.AddChildStack(this.skillMainPanel);

		this.fuwenPanel = new FuwenPanel();
		this.fuwenPanel.name = GlobalConfig.jifengTiaoyueLg.st100247;
		this.commonWindowBg.AddChildStack(this.fuwenPanel);

		this.neiGongPanel = new NeiGongPanel();
		this.neiGongPanel.name = GlobalConfig.jifengTiaoyueLg.st100248;
		this.commonWindowBg.AddChildStack(this.neiGongPanel);

		this.jingMai = new JingMaiPanel();
		this.jingMai.name = GlobalConfig.jifengTiaoyueLg.st100249;
		this.commonWindowBg.AddChildStack(this.jingMai);

		let prestige = new PrestigeWin
		this.prestige = prestige;
		this.commonWindowBg.AddChildStack(prestige)
	};
	destoryView() {
		super.destoryView()
		// this.mijiPanel.destructor();
	};
	open(...param: any[]) {
		this.commonWindowBg.OnAdded(this, param ? param[0] : 0, param ? param[1] : 0)
		this.observe(UserZs.ins().postZsData, this.updateRedPoint);
		this.observe(GameLogic.ins().postLevelChange, this.updateRedPoint);
		this.observe(GameLogic.ins().postGoldChange, this.updateRedPoint);
		this.observe(MessageDef.ITEM_COUNT_CHANGE, this.updateRedPoint);
		this.observe(MessageDef.GUIDE_SKILL_END, this.checkSkillGuide);
		this.observe(MessageDef.PRESTIGE_RESULT, this.updateRedPoint);
		this.updateRedPoint();
	};
	close() {
		//UIView2.CloseNav(UIView2.NAV_SKILL)
		this.prestige.release();
		this.commonWindowBg.OnRemoved()
		this.skillMainPanel.release();
	}

	updateRedPoint() {
		this.commonWindowBg.ShowTalRedPoint(0, UserSkill.ins().checkAllSkillRedPoint())
		this.commonWindowBg.ShowTalRedPoint(1, FuwenModel.ins().CalculationFuwenRedPoint())
		this.commonWindowBg.ShowTalRedPoint(2, NeiGongControl.ins().checkRed())
		this.commonWindowBg.ShowTalRedPoint(3, UserJingMai.ins().IsRed())
		this.commonWindowBg.ShowTalRedPoint(4, PrestigeModel.CheckRedPoint())
	}


	private and(list: boolean[]): boolean {
		for (let val of list) {
			if (val) {
				return true
			}
		}
		return false
	}

	onTap(e) {
		ViewManager.ins().close(this);
	};
	public static openCheck() {
		return true;
	};

	OnBackClick(clickType: number): number {
		return 0
	}
	private jingMaiCommonConfig: any;
	OnOpenIndex(openIndex: number): boolean {
		var flag: boolean = true;
		if (openIndex == 0) {
			return Deblocking.Check(DeblockingType.TYPE_61)
		} else if (openIndex == 1) {
			flag = Deblocking.Check(DeblockingType.TYPE_07);
		}
		else if (openIndex == 2) {
			flag = Deblocking.Check(DeblockingType.TYPE_47)
		} else if (openIndex == 3) {
			flag = Deblocking.Check(DeblockingType.TYPE_77)
		}
		else
			if (openIndex == 4) {
				return Deblocking.Check(DeblockingType.TYPE_89)
			}
		return flag;
	}

	private checkSkillGuide() {
		if (Setting.currStep == 1 && Setting.currPart == 19) {
			this.commonWindowBg.returnBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.guideEnd, this);
			GuideUtils.ins().show(this.commonWindowBg.returnBtn, 19, 1);
		} else
			if (Setting.currStep == 1 && Setting.currPart == 24) {
				this.commonWindowBg.returnBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.guideEnd, this);
				GuideUtils.ins().show(this.commonWindowBg.returnBtn, 24, 1);
			} else
				if (Setting.currStep == 1 && Setting.currPart == 26) {
					this.commonWindowBg.returnBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.guideEnd, this);
					GuideUtils.ins().show(this.commonWindowBg.returnBtn, 26, 1);
				}
	}

	private guideEnd() {
		GuideUtils.ins().next(this.commonWindowBg.returnBtn);
		this.commonWindowBg.returnBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.guideEnd, this);
		MessageCenter.ins().dispatch(MessageDef.GUIDE_SKILLBATTLE_END);
	}


}
ViewManager.ins().reg(ZsWin, LayerManager.UI_Main);
window["ZsWin"] = ZsWin