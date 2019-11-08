class ZhuanZhiPanel extends BaseView implements eui.UIComponent, ICommonWindowTitle, ICommonWindowRoleSelect {
	public constructor() {
		super();
		this.skinName = "ZhuanZhiPanelSkin";
	}

	m_RoleSelectPanel: RoleSelectPanel;
	public viewStack: eui.ViewStack;
	private panelList = [];
	public tabBar: eui.TabBar;
	private m_OldIndex: number

	protected childrenCreated(): void {
		super.childrenCreated();
	}

	public open(...param: any[]) {

		this.addItemTapEvent(this, this.onTouchTab, this.tabBar)
		this.panelList = [];
		this.viewStack.removeChildren();
		this.panelList.push(new ZhuanZhiJmPanel(this.m_RoleSelectPanel));
		this.panelList.push(new ZhuanZhiTfPanel(this.m_RoleSelectPanel));
		for (var i = 0; i < this.panelList.length; i++) {
			this.viewStack.addChild(this.panelList[i]);
			this.panelList[i].open();
		}
		this.tabBar.selectedIndex = 0;
		this.viewStack.selectedIndex = 0;
	}

	private onTouchTab(evt) {
		let panel: any = this.panelList[this.tabBar.selectedIndex];
		if (panel == undefined) {
			this.tabBar.selectedIndex = this.m_OldIndex
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100653);//"敬请期待"
			return
		}

		if (this.tabBar.selectedIndex == 1) {
			if (!ZhuanZhiModel.ins().isOpenZhuanZhiTf()) {
				this.tabBar.selectedIndex = this.m_OldIndex;
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101860);//"角色转职2转开放"
				return
			}
		}

		this.m_OldIndex = this.tabBar.selectedIndex;
		this.viewStack.selectedIndex = this.tabBar.selectedIndex;
		if (panel) panel.UpdateContent();
	}

	public close() {
		this.removeEvents();
		this.removeObserve()
		this.viewStack.removeChildren();
		for (var i = 0; i < this.panelList.length; i++)
			this.panelList[i].close();
	}

	public static openCheck() {
		return Deblocking.Check(DeblockingType.TYPE_30);
	};

	private tabDatas1 = [{ name: "", img: "zz_01_png" }, { name: "", img: "zz_02_png" }, { name: "", img: "zz_03_png" }];//经脉 天赋 敬请期待
	private tabDatas2 = [{ name: "", img: "zz_11_png" }, { name: "", img: "zz_12_png" }, { name: "", img: "zz_13_png" }];
	private tabDatas3 = [{ name: "", img: "zz_21_png" }, { name: "", img: "zz_22_png" }, { name: "", img: "zz_23_png" }];

	UpdateContent(): void {
		var role = SubRoles.ins().getSubRoleByIndex(this.m_RoleSelectPanel.getCurRole());
		if (role.job == JobConst.ZhanShi)
			this.tabBar.dataProvider = new eui.ArrayCollection(this.tabDatas1);
		else if (role.job == JobConst.FaShi)
			this.tabBar.dataProvider = new eui.ArrayCollection(this.tabDatas2);
		else if (role.job == JobConst.DaoShi)
			this.tabBar.dataProvider = new eui.ArrayCollection(this.tabDatas3);

		let panel: any = this.panelList[this.tabBar.selectedIndex];
		if (panel) panel.UpdateContent();
	}

	public CheckRedPoint() {
		return ZhuanZhiModel.ins().zhuanZhiIsRed();
	}
}
window["ZhuanZhiPanel"] = ZhuanZhiPanel