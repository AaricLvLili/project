class RoleWin extends BaseEuiPanel implements ICommonWindow {
	roleInfoPanel: RoleInfoPanel
	zsPanel: ZsPanel;
	wingPanel: WingPanel;
	closeBtn0: eui.Button;
	private commonWindowBg: CommonWindowBg
	canChangeWingEquips: any[];
	canChangeEquips: any[];

	private mountMainPanel: MountMainPanel;
	public constructor() {
		super()
		this.skinName = "MainWinSkin"
		this.layerLevel = VIEW_LAYER_LEVEL.TOP;
	}

	initUI() {
		super.initUI();
		this.roleInfoPanel = new RoleInfoPanel(this)
		this.roleInfoPanel.name = GlobalConfig.jifengTiaoyueLg.st100100;
		this.commonWindowBg.AddChildStack(this.roleInfoPanel)

		this.mountMainPanel = new MountMainPanel();
		this.mountMainPanel.name = GlobalConfig.jifengTiaoyueLg.st100669;
		this.commonWindowBg.AddChildStack(this.mountMainPanel);

		this.wingPanel = new WingPanel
		this.wingPanel.name = GlobalConfig.jifengTiaoyueLg.st100339;
		this.commonWindowBg.AddChildStack(this.wingPanel)

		this.zsPanel = new ZsPanel
		this.zsPanel.name = GlobalConfig.jifengTiaoyueLg.st100465;
		this.commonWindowBg.AddChildStack(this.zsPanel)
		this.closeBtn0 = this.commonWindowBg.returnBtn
	};
	destoryView() {
		super.destoryView();
	};
	open(...args: any[]) {
		// this.addWinEvent();
		UserBag.ins().sendGetDanyaoMsg();
		MountSproto.ins().sendGetMountInitMsg();
		var openIndex = args[0]
		var roleId = args[1]
		var checkOpen = this.OnOpenIndex(openIndex)
		this.commonWindowBg.OnAdded(this, checkOpen ? openIndex : 0, roleId ? roleId : 0)
		this.observe(MessageDef.ROLE_HINT, this.updateRedPoint);
		this.observe(UserZs.ins().postZsData, this.updateRedPoint)
		this.observe(GameLogic.ins().postLevelChange, this.updateRedPoint)
		this.observe(Wing.ins().postActivate, this.updateRedPoint)
		this.observe(MountEvt.MOUNT_DATAUPDATE_MSG, this.updateRedPoint);
		MessageCenter.addListener(Wing.ins().postWingUpgrade, this.updateRedPoint, this);
		MessageCenter.addListener(Wing.ins().postBoost, this.updateRedPoint, this);
		this.updateRedPoint()
	}
	close() {
		var bottomView = <UIView2>ViewManager.ins().getView(UIView2)
		if (bottomView != null) {
			bottomView.closeNav(UIView2.NAV_ROLE)
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.GUIDE_ADDEQUIP_END);
		this.commonWindowBg.OnRemoved()
	};


	checkIsOpen(e) {

	};
	private jingMaiCommonConfig: any;
	public OnOpenIndex(selectedIndex: number): boolean {

		if (selectedIndex == 1) {
			return Deblocking.Check(DeblockingType.TYPE_63)
		} else if (selectedIndex == 2) {
			return Deblocking.Check(DeblockingType.TYPE_35)
		} else if (selectedIndex == 3) {
			return Deblocking.Check(DeblockingType.TYPE_90)
		}
		return true
	}

	updateRedPoint() {
		var zsIsOpens = UserZs.ins().canOpenZSWin() && !UserZs.ins().isMaxLv() && (UserZs.ins().canGetRedPoint() || UserZs.ins().canUpgrade());
		let wingOpens = Wing.ins().mRedPoint.IsRed()
		var equipIsOpens = this.canEquip();

		this.commonWindowBg.ShowTalRedPoint(0, this.and(equipIsOpens))
		this.commonWindowBg.ShowTalRedPoint(1, MountModel.getInstance.checkAllRedPoint())
		this.commonWindowBg.ShowTalRedPoint(2, wingOpens)
		this.commonWindowBg.ShowTalRedPoint(3, zsIsOpens);

		let pageIndex = this.commonWindowBg.GetSelectedIndex()
		if (pageIndex == 0) {
			var len = SubRoles.ins().subRolesLen;
			for (var i = 0; i < len; i++) {
				var isOpen = false;
				if (equipIsOpens[i]) {
					isOpen = true;
				}
				this.commonWindowBg.showRedPoint(i, isOpen || LegendModel.ins().IsRedPointByRole(i));
			}
		}
	};
	and(list) {
		for (var k in list) {
			if (list[k] == true)
				return true;
		}
		return false;
	};

	canEquip() {
		var isOpens = [false, false, false];
		if (this.canChangeEquips) {
			var len = SubRoles.ins().subRolesLen;
			for (var i = 0; i < len; i++) {
				var data = this.canChangeEquips[i];
				for (var k in data) {
					if (data[k]) {
						isOpens[i] = true;
						break;
					}
				}

				//橙装红点判断
				if (isOpens[i] == false) {
					isOpens[i] = UserEquip.ins().CheckOrangeRedPointByRoleIndex(i);
				}
			}
		}
		return isOpens;
	};

	public OnBackClick(clickType: number): number {
		GuideUtils.ins().next(this.closeBtn0);
		return 0
	}

}

ViewManager.ins().reg(RoleWin, LayerManager.UI_Main);
window["RoleWin"] = RoleWin