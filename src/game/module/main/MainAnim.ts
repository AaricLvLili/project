class MainAnim extends eui.Component {
	public constructor() {
		super();
		this.skinName = "MainGetAnimSkin";
		this.m_ItemBase.visible = false;
	}

	public m_Bg: eui.Image;
	public m_EffGroup: eui.Group;
	public m_AnimGroup: eui.Group;
	public m_NameBg: eui.Image;
	public m_RAndNameLab: eui.Label;
	private m_NewEff;
	private charRole: CharRole;
	private m_Eff;
	public m_ItemBase: ItemBase;
	public setData(resAnimType: ResAnimType, roleId: number, str: string, name: string) {
		this.playNewEff();
		this.m_RAndNameLab.visible = true;
		if (name) {
			this.m_RAndNameLab.text = name;
		}
		switch (resAnimType) {
			case ResAnimType.TYPE1:
				this.playEff(str, resAnimType);
				break;
			case ResAnimType.TYPE2:
			case ResAnimType.TYPE3:
				this.playEff(str + "_3" + EntityAction.STAND, resAnimType);
				break;
			case ResAnimType.TYPE4:
				this.initRoleData(roleId);
				// this.m_RAndNameLab.visible = false;
				break;
		}

	}

	private initRoleData(roleId: number) {
		let role: Role = SubRoles.ins().getSubRoleByIndex(roleId);
		if (role) {
			var infoModel = new Role();
			infoModel.bianShen = role.bianShen;
			infoModel.configID = role.configID;
			let zhuangbeiData = [];
			for (var i = 0; i < role.zhuangbei.length; i++) {
				zhuangbeiData.push(role.zhuangbei[i]);
			}
			infoModel.zhuangbei = zhuangbeiData;
			let equipsData = [];
			for (var i = 0; i < role.equipsData.length; i++) {
				let equipData = new EquipsData();
				equipData.item.configID = role.equipsData[i].item.configID;
				equipsData.push(equipData);
			}
			infoModel.equipsData = equipsData;
			let wingsData = new WingsData();
			wingsData.lv = role.wingsData.lv;
			wingsData.showLv = role.wingsData.showLv;
			wingsData.openStatus = role.wingsData.openStatus;
			infoModel.wingsData = wingsData;
			infoModel.sex = role.sex;
			infoModel.job = role.job;
			infoModel.mountsLevel = role.mountsLevel;
			infoModel.mountsShowLv = role.mountsShowLv;
			infoModel.zhuanzhiLv = role.zhuanzhiLv;
			if (!this.charRole) {
				this.charRole = ObjectPool.ins().pop("CharRole");
				egret.setTimeout(function () {
					if (this.charRole && !this.charRole._body.visible) {
						this.charRole._body.visible = true;
					}
				}, this, 200);
			}
			this.charRole.infoModel = infoModel;
			this.charRole.updateModel();
			this.charRole.dir = 3;
			this.charRole.playAction(EntityAction.STAND);
			this.m_AnimGroup.addChild(this.charRole);
			this.charRole.x = this.m_AnimGroup.width / 2;
			this.charRole.y = this.m_AnimGroup.height / 2;
			this.charRole.hideHpComp();
			this.charRole._body.alpha = 1;
			this.charRole._body.visible = true;
			if (this.charRole._titleMc) {
				this.charRole._titleMc.visible = false;
			}
		}
	}

	private clearRole() {
		if (this.charRole) {
			if (this.charRole._titleMc) {
				this.charRole._titleMc.visible = true;
			}
			this.charRole.scaleX = 1;
			this.charRole.scaleY = 1;
			this.charRole.hideHpComp(true);
			DisplayUtils.dispose(this.charRole);
			this.charRole._infoModel = null;
			this.charRole = null;
		}
	}


	public release() {
		this.clearRole();
		DisplayUtils.dispose(this.m_NewEff);
		this.m_NewEff = null;
		DisplayUtils.dispose(this.m_Eff);
		this.m_Eff = null;
	}
	private playEff(name: string, type: ResAnimType) {
		this.m_Eff = ViewManager.ins().createEff(this.m_Eff, this.m_AnimGroup, name, -1, type)
	}
	public playNewEff() {
		this.m_NewEff = ViewManager.ins().createEff(this.m_NewEff, this.m_EffGroup, "eff_ui_activation", -1);
	}
}
window["MainAnim"] = MainAnim