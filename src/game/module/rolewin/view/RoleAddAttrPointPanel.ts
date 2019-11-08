class RoleAddAttrPointPanel extends BaseView implements ICommonWindowTitle, ICommonWindowRoleSelect {
	m_RoleSelectPanel: RoleSelectPanel;

	private lvlTxt: eui.Label;
	private addPointTxt: eui.Label;
	private vipPointTxt: eui.Label;
	private surplusPointTxt: eui.Label;
	private dec: eui.Label;
	private vipDec: eui.Label;
	private totalPower: PowerLabel;
	private resetBtn: eui.Button;
	public recommendBtn: eui.Button;
	private confirmBtn: eui.Button;

	public addItem0: RoleAddAttrPointItem;
	public addItem1: RoleAddAttrPointItem;
	public addItem2: RoleAddAttrPointItem;
	public addItem3: RoleAddAttrPointItem;

	private languageTxt: eui.Label;
	private languageTxt0: eui.Label;

	public constructor() {
		super();
		this.skinName = "RoleAddAttrPointPanelSkin";
	}

	protected childrenCreated() {
		super.childrenCreated();
		this.languageTxt.text = GlobalConfig.jifengTiaoyueLg.st100608 + "：";
		this.languageTxt0.text = GlobalConfig.jifengTiaoyueLg.st100609 + "：";
		this.confirmBtn.label = GlobalConfig.jifengTiaoyueLg.st100040;
		this.resetBtn.label = GlobalConfig.jifengTiaoyueLg.st100610;
	}

	public open() {
		this.observe(MessageDef.ROLE_ADD_ATTR_POINT_INFO, this.UpdateContent);
		this.AddClick(this.confirmBtn, this.onClick);
		this.AddClick(this.resetBtn, this.onClick);
		this.AddClick(this.recommendBtn, this.onClick);
		RoleAddAttrPointModel.ins().cs_zs_point_req();
	}

	public close() {
		this.removeEvents();
		this.removeObserve();
	}

	private onClick(evt: egret.TouchEvent) {
		switch (evt.currentTarget) {
			case this.confirmBtn:
				let count = this.getAddPointNumList().count;
				if (count > 0) {
					let list = this.getAddPointNumList().list;
					RoleAddAttrPointModel.ins().cs_add_zs_point(this.m_RoleSelectPanel.getCurRole(), list);
				}
				else {
					UserTips.ErrorTip(GlobalConfig.jifengTiaoyueLg.st100598);
				}
				break;
			case this.resetBtn:
				let addCount = RoleAddAttrPointModel.ins().getAddPointCount(this.m_RoleSelectPanel.getCurRole());
				if (addCount > 0) {
					let yb = GlobalConfig.ins("ZhuanShengConfig").resetCost.count;
					WarnWin.show(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100600, [yb]), function () {
						RoleAddAttrPointModel.ins().cs_zs_point_clear(this.m_RoleSelectPanel.getCurRole());
					}, this)
				}
				else
					UserTips.ErrorTip(GlobalConfig.jifengTiaoyueLg.st100599);
				break;
			case this.recommendBtn:
				if (this.recommendBtn.label == GlobalConfig.jifengTiaoyueLg.st100601) {
					let list = this.recommendAddPoint();
					if (list) {
						this.recommendBtn.label = GlobalConfig.jifengTiaoyueLg.st100602;
						for (var i = 0; i < 4; i++) {
							this["addItem" + i].numLabel.text = list[i];
							this["addItem" + i].setData();
						}
					}
					else {
						UserTips.ErrorTip(GlobalConfig.jifengTiaoyueLg.st100603);
					}
				}
				else {
					this.recommendBtn.label = GlobalConfig.jifengTiaoyueLg.st100601;
					for (var i = 0; i < 4; i++) {
						this["addItem" + i].release();
						this["addItem" + i].setData();
					}
				}
				break;
		}
	}

	UpdateContent(): void {
		var addPointList = RoleAddAttrPointModel.ins().addPointList;
		if (addPointList.length <= 0)
			return;

		let lv = GameLogic.ins().actorModel.level;
		let zs = UserZs.ins() ? UserZs.ins().lv : 0;
		this.lvlTxt.textFlow = TextFlowMaker.generateTextFlow(GlobalConfig.jifengTiaoyueLg.st100604 + "："
			+ StringUtils.addColor((zs ? zs + GlobalConfig.jifengTiaoyueLg.st100067 : "") + lv + GlobalConfig.jifengTiaoyueLg.st100093, Color.Green));
		this.addPointTxt.text = RoleAddAttrPointModel.ins().getAddPointCount(this.m_RoleSelectPanel.getCurRole()) + "";

		let vipValuePoint = GlobalConfig.ins("ZhuanShengConfig").vipValuePoint
		this.vipPointTxt.visible = UserVip.ins().lv >= vipValuePoint[0];
		this.vipPointTxt.text = `VIP${vipValuePoint[0]},${GlobalConfig.jifengTiaoyueLg.st100607} +${vipValuePoint[1] * lv}`;
		this.vipDec.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100605, [vipValuePoint[0], vipValuePoint[1]]);

		let roleAddAttrPointData: RoleAddAttrPointData = addPointList[this.m_RoleSelectPanel.getCurRole()];
		if (roleAddAttrPointData) {
			this.surplusPointTxt.text = roleAddAttrPointData.point + "";
			let zhuanShengConfig = GlobalConfig.ins("ZhuanShengConfig");
			let valuePoint = zhuanShengConfig.valuePoint;
			let curRole = this.m_RoleSelectPanel.getCurRole();
			var subRole = SubRoles.ins().getSubRoleByIndex(curRole);
			let zzlevel = ZhuanZhiModel.ins().getZhuanZhiLevel(curRole);
			for (var i = 0; i < zzlevel; i++) {
				valuePoint += zhuanShengConfig.zzAddPoint[i];
			}
			this.dec.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100606, [valuePoint]);
			this.totalPower.text = roleAddAttrPointData.power + "";

			this.recommendBtn.label = GlobalConfig.jifengTiaoyueLg.st100601;
			var subRole = SubRoles.ins().getSubRoleByIndex(this.m_RoleSelectPanel.getCurRole());
			for (var i = 0; i < 4; i++) {
				let config = RoleAddAttrPointModel.ins().getAddAttrPointConfig(subRole.job, i);
				let data = addPointList[this.m_RoleSelectPanel.getCurRole()];
				this["addItem" + i].release();
				this["addItem" + i].setData(config, data);
			}
			this.updataRoleRed();
		}
	}

	private getAddPointNumList() {
		let list = [];
		let count = 0;
		for (var i = 0; i < 4; i++) {
			let num = this["addItem" + i].num;
			list.push(num);
			count = count + num;
		}
		return { list, count };
	}

	private recommendAddPoint() {
		var roleAddAttrPointData: RoleAddAttrPointData = RoleAddAttrPointModel.ins().addPointList[this.m_RoleSelectPanel.getCurRole()];
		var count = roleAddAttrPointData.point
		if (count <= 0) return null;
		var list = [0, 0, 0, 0];
		while (count > 0) {
			for (let i = 0; i < 4; i++) {
				if (count > 0) {
					list[i] = list[i] + 1;
					count--;
				}
			}
		}
		return list
	}


	/**获取每个角色红点*/
	private updataRoleRed() {
		for (let i = 0; i < SubRoles.ins().subRolesLen; ++i) {
			let isRed = PlayFun.ins().getFuncRedById(DeblockingType.TYPE_81, i);
			this.m_RoleSelectPanel.showRedPoint(i, isRed);
		}
	}

}
window["RoleAddAttrPointPanel"] = RoleAddAttrPointPanel