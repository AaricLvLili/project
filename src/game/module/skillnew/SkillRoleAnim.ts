class SkillRoleAnim extends eui.Component {
	public constructor() {
		super();
	}
	public m_Bg: eui.Image;
	public m_AnimGroup: eui.Group;
	public m_JobLab: eui.Label;
	public m_JobImg: eui.Image;
	private charRole: CharRole;
	public m_JobGroup: eui.Group;
	public m_PlaySkillEffGroup: eui.Group;

	public setData(roleId: number, zzlv: number, job: number, isPlay: boolean = false) {
		this.initRoleData(roleId, zzlv);
		let transferAppearanceConfig = GlobalConfig.ins("TransferAppearanceConfig")[job][zzlv];
		this.m_JobLab.text = transferAppearanceConfig.targetJob;
		this.m_JobImg.source = "zsjob_" + job + "_" + zzlv + "_png";
		this.addTime();
		if (transferAppearanceConfig.skillEff && isPlay) {
			let config = GlobalConfig.ins("SkillsConfig")[transferAppearanceConfig.skillEff];
			GameLogic.ins().playSkillEff(config, this.charRole, this.m_PlaySkillEffGroup, this.m_PlaySkillEffGroup);
		}
	}

	private initRoleData(roleId: number, zzlv: number) {
		let role: Role = SubRoles.ins().getSubRoleByIndex(roleId);
		if (role) {
			var infoModel = new Role();
			infoModel.configID = role.configID;
			let zhuangbeiData = [];
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
			wingsData.openStatus = false;
			infoModel.wingsData = wingsData;
			infoModel.sex = role.sex;
			infoModel.job = role.job;
			infoModel.mountsLevel = role.mountsLevel;
			infoModel.mountsShowLv = role.mountsShowLv;
			if (!this.charRole) {
				this.charRole = ObjectPool.ins().pop("CharRole");
			}
			this.charRole.infoModel = infoModel;
			this.charRole.infoModel.zhuanzhiLv = zzlv;
			this.charRole.updateModel();
			this.charRole.dir = 3;
			this.charRole.playAction(EntityAction.ATTACK);
			if (this.charRole._state == EntityAction.ATTACK) {
				this.charRole._body.removeEventListener(egret.Event.COMPLETE, this.onChangeState, this);
				this.charRole._body.addEventListener(egret.Event.COMPLETE, this.onChangeState, this);
			}
			this.m_AnimGroup.addChild(this.charRole);
			this.charRole.x = this.m_AnimGroup.width / 2;
			this.charRole.y = this.m_AnimGroup.height / 2;
			this.charRole.scaleX = 1;
			this.charRole.scaleY = 1;
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
			if (this.charRole._body) {
				this.charRole._body.removeEventListener(egret.Event.COMPLETE, this.onChangeState, this);
			}
			this.charRole.scaleX = 1;
			this.charRole.scaleY = 1;
			this.charRole.hideHpComp(true);
			DisplayUtils.dispose(this.charRole);
			this.charRole._infoModel = null;
			this.charRole = null;
		}
	}
	private onChangeState() {
		this.charRole._body.removeEventListener(egret.Event.COMPLETE, this.onChangeState, this);
		this.charRole.playAction(EntityAction.STAND);
	}

	public hideJob() {
		this.m_JobGroup.visible = false;
	}
	public addTime() {
		TimerManager.ins().removeAll(this);
		TimerManager.ins().doTimer(500, 10, function () {
			if (this.charRole && this.charRole._body && this.charRole._body.visible == false) {
				this.charRole._body.visible = true;
				this.charRole.playAction(EntityAction.STAND);
			}
		}, this)
	}

	public release() {
		TimerManager.ins().removeAll(this);
		this.clearRole();
	}
}
window["SkillRoleAnim"] = SkillRoleAnim