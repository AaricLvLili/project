class MountAnim extends eui.Component {
	public constructor() {
		super();
		this.skinName = "MountAnimSkin";
	}

	public m_Bg: eui.Image;
	public m_RAndNameLab: eui.Label;
	public m_AnimGroup: eui.Group;
	public m_LvLab: eui.Label;
	public m_EffGroup: eui.Group;
	public totalPower: PowerLabel;
	public m_NameBg: eui.Image;

	public m_NameGroup: eui.Group;
	public m_MontAnimGroup: eui.Group;
	private m_Eff: MovieClip;

	public m_Lv: number;

	private charRole: CharRole;

	public m_NowLv: number;

	public m_ElementImg: eui.Image;

	public setMountData(mountData: MountData) {
		let mountModel: MountModel = MountModel.getInstance;
		let mountsLevelConfig = GlobalConfig.ins("MountsLevelConfig")[mountData.level];
		if (mountsLevelConfig) {
			this.m_RAndNameLab.text = mountsLevelConfig.name;
			// mountModel.setStar(this.m_StarGroup, mountData.star);
			this.m_LvLab.text = mountData.level + "";
			this.m_Lv = mountData.level;
			this.m_NowLv = mountData.level;
			this.playEff(mountsLevelConfig.appearance + "_3" + EntityAction.STAND);
			this.totalPower.visible = true;
			this.initRoleData(mountModel.nowSelectRoldData.roleID);
			let power = mountModel.getAllPower(mountData);
			this.totalPower.text = power + "";
		}
	}

	public shPower(isShow: boolean = false) {
		if (isShow) {
			this.totalPower.visible = true;
		} else {
			this.totalPower.visible = false;
		}
	}

	private playEff(name: string) {
		this.m_Eff = ViewManager.ins().createEff(this.m_Eff, this.m_MontAnimGroup, name, -1, ResAnimType.TYPE3);
	}

	private initRoleData(roleId: number) {
		let role: Role = SubRoles.ins().getSubRoleByIndex(roleId);
		if (role) {
			var infoModel = new Role();
			infoModel.bianShen = role.bianShen;
			infoModel.configID = role.configID;
			let zhuangbeiData = [];
			// for (var i = 0; i < role.zhuangbei.length; i++) {
			// 	zhuangbeiData.push(role.zhuangbei[i]);
			// }
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
			this.m_ElementImg.source = ResDataPath.GetElementImgName(infoModel.attrElementMianType);
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
		DisplayUtils.dispose(this.m_Eff);
		this.m_Eff = null;
		DisplayUtils.dispose(this.m_NewEff);
		this.m_NewEff = null;

	}

	public changeAnimLv(lv: number) {
		let mountModel: MountModel = MountModel.getInstance;
		let mountsLevelConfig = GlobalConfig.ins("MountsLevelConfig")[lv];
		if (mountsLevelConfig) {
			this.m_RAndNameLab.text = mountsLevelConfig.name;
			this.m_LvLab.text = lv + "";
			this.m_Lv = lv;
			this.totalPower.visible = false;
			this.playEff(mountsLevelConfig.appearance + "_3" + EntityAction.STAND);
			this.m_Eff.gotoAndPlay(1, -1);
			this.charRole._body.gotoAndPlay(1, -1);
		}
	}
	private m_NewEff: MovieClip;
	public playNewEff() {
		this.m_NewEff = ViewManager.ins().createEff(this.m_NewEff, this.m_EffGroup, "eff_ui_activation", -1);
	}
}
window["MountAnim"] = MountAnim