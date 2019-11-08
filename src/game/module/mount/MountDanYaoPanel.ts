class MountDanYaoPanel extends BaseView implements ICommonWindowTitle, ICommonWindowRoleSelect {
	windowTitleIconName?: string;
	m_RoleSelectPanel: RoleSelectPanel
	public constructor() {
		super()
		this.skinName = "MountDanYaoPanelSkin";
	}

	public m_AttrGroup: eui.Group;
	public m_Scroller: eui.Scroller;
	public m_List: eui.List;
	private m_ListData: eui.ArrayCollection;
	private languageTxt: eui.Label;

	public createChildren() {
		super.createChildren();
		this.m_List.itemRenderer = MountDanYaoItem;
		this.m_ListData = new eui.ArrayCollection();
		this.m_List.dataProvider = this.m_ListData;
		this.languageTxt.text = GlobalConfig.jifengTiaoyueLg.st100682;
	}
	open(...param: any[]) {
		this.m_RoleSelectPanel.y = 130;
		this.addViewEvent();
		this.setData();
	}
	close() {
		this.m_RoleSelectPanel.y = 158;
		this.release();
	}
	public release() {
		this.removeViewEvent();
	}
	private addViewEvent() {
		this.observe(MountEvt.MOUNT_DATAUPDATE_MSG, this.setData);
		this.observe(MountEvt.MOUNT_DANYAO_MSG, this.setData);
	}
	private removeViewEvent() {
	}
	private setData() {
		let mountModel = MountModel.getInstance;
		let curRole = this.m_RoleSelectPanel.getCurRole();
		var role = SubRoles.ins().getSubRoleByIndex(curRole);
		mountModel.nowDanYaoSelectRoleData = role;
		let itemList: ItemData[] = UserBag.ins().getAllItemListBuyType(0, 11);
		let newItemList = [];
		let mountsShuXingDanjcConfig = GlobalConfig.ins("mountsShuXingDanjcConfig");
		for (let key in mountsShuXingDanjcConfig) {
			let configData = mountsShuXingDanjcConfig[key];
			let itmeData = new ItemData;
			let isHave: boolean = false;
			for (var i = 0; i < itemList.length; i++) {
				if (itemList[i].configID == configData.id) {
					itmeData.count = itemList[i].count;
					itmeData.configID = itemList[i].configID;
					isHave = true;
					break;
				}
			}
			if (isHave != true) {
				itmeData.configID = configData.id;
				itmeData.count = 0;
			}
			newItemList.push(itmeData);
		}
		if (newItemList) {
			this.m_ListData.removeAll();
			this.m_ListData.replaceAll(newItemList);
			this.m_ListData.refresh();
		}
		let mountData = mountModel.mountDic.get(role.roleID);
		if (mountData) {
			AttributeData.setAttrGroup(mountData.attr, this.m_AttrGroup);
		}

	}
	private onClickClose() {
		ViewManager.ins().close(this);
	}
	UpdateContent(): void {
		this.setData();
	}
}

window["MountDanYaoPanel"] = MountDanYaoPanel