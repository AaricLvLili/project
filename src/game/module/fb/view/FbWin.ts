class FbWin extends BaseEuiPanel implements ICommonWindow {


	// closeBtn
	// closeBtn0
	// tab
	// viewStack

	// redPoint0
	// redPoint1

	private commonWindowBg: CommonWindowBg


	public dailyFbPanel: DailyFbPanel;
	public fbChallengePanel: FBChallengePanel;

	private petClimbTowerPanel: PetClimbTowerPanel
	private mountClimbTowerPanel: MountClimbTowerPanel
	private drillPanel: DrillPanel;

	private teamFbPanel: TeamFbPanel;
	public constructor() {
		super()
		this.layerLevel = VIEW_LAYER_LEVEL.TOP
	}

	initUI() {
		super.initUI()
		this.skinName = "MainWinSkin";
		this.dailyFbPanel = new DailyFbPanel();
		this.dailyFbPanel.name = GlobalConfig.jifengTiaoyueLg.st100361;
		this.commonWindowBg.AddChildStack(this.dailyFbPanel);

		this.fbChallengePanel = new FBChallengePanel();
		this.fbChallengePanel.name = GlobalConfig.jifengTiaoyueLg.st100362;
		this.commonWindowBg.AddChildStack(this.fbChallengePanel);

		this.teamFbPanel = new TeamFbPanel();
		this.commonWindowBg.AddChildStack(this.teamFbPanel)

		this.petClimbTowerPanel = new PetClimbTowerPanel();
		this.petClimbTowerPanel.name = GlobalConfig.jifengTiaoyueLg.st100364;
		this.commonWindowBg.AddChildStack(this.petClimbTowerPanel);

		this.mountClimbTowerPanel = new MountClimbTowerPanel();
		this.mountClimbTowerPanel.name = GlobalConfig.jifengTiaoyueLg.st100365;
		this.commonWindowBg.AddChildStack(this.mountClimbTowerPanel);

		this.drillPanel = new DrillPanel();
		this.drillPanel.name = GlobalConfig.jifengTiaoyueLg.st100363;
		this.commonWindowBg.AddChildStack(this.drillPanel)

	};
	static openCheck(param) {
		var index = param[0] == undefined ? 0 : param[0];
		if (index == 0) {
			return Deblocking.Check(DeblockingType.TYPE_03)
		} else if (index == 1) {
			return Deblocking.Check(DeblockingType.TYPE_04)
		} else if (index == 2) {
			return Deblocking.Check(DeblockingType.TYPE_83)
		} else if (index == 3) {
			return Deblocking.Check(DeblockingType.TYPE_73)
		} else if (index == 4) {
			return Deblocking.Check(DeblockingType.TYPE_74)
		} else if (index == 5) {
			return Deblocking.Check(DeblockingType.TYPE_25)
		}
		return true;
	};
	open(...param: any[]) {
		var index = param[0] == undefined ? 0 : param[0];
		this.commonWindowBg.OnAdded(this, index)
		this.observe(MessageDef.CHALLENGE_UPDATE_INFO, this.updateRedPoint)
		this.observe(MessageDef.TRYROAD_DATAS, this.updateRedPoint);
		this.updateRedPoint();
	};
	updateRedPoint() {
		this.commonWindowBg.ShowTalRedPoint(0, UserFb.ins().hasCount());
		this.commonWindowBg.ShowTalRedPoint(1, UserFb2.ins().IsRed());
		this.commonWindowBg.ShowTalRedPoint(5, DrillModel.ins().isRed());
		if (Deblocking.Check(DeblockingType.TYPE_48, true)) {
			// this.commonWindowBg.ShowTalRedPoint(3, MiJingModel.getInstance.checkRedPoint())
		}
		this.commonWindowBg.ShowTalRedPoint(2, TeamFbModel.getInstance.isShowRedPoint());
	};
	close() {
		this.commonWindowBg.OnRemoved()
		this.removeObserve()
		// this.miJingPanel.release();
		this.petClimbTowerPanel.release();
		this.mountClimbTowerPanel.release();
	};

	OnBackClick(clickType: number): number {
		return 0
	}

	OnOpenIndex?(openIndex: number): boolean {
		if (openIndex == 1) {
			return Deblocking.Check(DeblockingType.TYPE_04)
		}
		else if (openIndex == 2) {
			return Deblocking.Check(DeblockingType.TYPE_83);
		} else if (openIndex == 3) {
			return Deblocking.Check(DeblockingType.TYPE_73)
		} else if (openIndex == 4) {
			return Deblocking.Check(DeblockingType.TYPE_74)
		} else if (openIndex == 5) {
			return Deblocking.Check(DeblockingType.TYPE_25)
		}
		return true
	}

}

ViewManager.ins().reg(FbWin, LayerManager.UI_Main);
window["FbWin"] = FbWin