class NewRoleWin extends BaseEuiPanel implements ICommonWindow, ICommonWindowTitle {

	public constructor() {
		super()
		this.skinName = "OpenRoleSkin"
		this.layerLevel = VIEW_LAYER_LEVEL.TOP
	}

	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st100728;
	private roleBody = ["body103", "body203", "body303"];
	private roleWeapon = ["weapon112", "weapon212", "weapon312"];
	public static ICON_JOB_LIST(){
		let list = [
		["comp_192_92_01_png", GlobalConfig.jifengTiaoyueLg.st100111],
		["comp_192_92_02_png", GlobalConfig.jifengTiaoyueLg.st100112],
		["comp_192_92_03_png", GlobalConfig.jifengTiaoyueLg.st100113]];
		return list;
	}

	private commonWindowBg: CommonWindowBg = null;
	private roleShowPanel: RoleShowPanel = null;
	private roleGroup: eui.Group = null;
	private m_SelectJob: number = 0
	private tips: eui.Group = null;
	private lockTips: eui.Label;
	private lockDesc: eui.Label;
	private openBtn: eui.Button = null;
	private curIdx: number
	private roleDressCfg: any
	private m_RoleGroup: {
		select: eui.Image,
		icon: eui.Image,
		jobName: eui.Image,
		activation: eui.Image,
		txtName: eui.Label,
		imgBg: eui.Image,
	}[] = []


	initUI() {
		super.initUI()
		for (var len = SubRoles.ins().subRolesLen, i = 0; len > i; i++) {
			var role = SubRoles.ins().getSubRoleByIndex(i);
		}
		this.m_RoleGroup = this.roleGroup.$children as any
		if (StartGetUserInfo.isOne) {
			this.tips.visible = false;
		}
		if (this.roleDressCfg == null) this.roleDressCfg = GlobalConfig.ins("roleAppearanceConfig")
		var config1 = GlobalConfig.ins("NewRoleConfig")[1];
		var config2 = GlobalConfig.ins("NewRoleConfig")[2];
		// this.lockDesc.text = `等级达到${config1.zsLevel}转解锁第1个伙伴与第1个出战宠物
		// 等级达到${config2.zsLevel}转解锁第2个伙伴与第2个出战宠物
		// VIP${config1.vip}提前解锁第1个伙伴与第1个出战宠物
		// VIP${config2.vip}提前解锁第2个伙伴与第2个出战宠物`;
		this.lockDesc.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100729, [config1.zsLevel, config2.zsLevel, config1.vip, config2.vip]);
		this.openBtn.label = GlobalConfig.jifengTiaoyueLg.st100391;
	};

	setNeedTxt() {
		var roleLen = SubRoles.ins().subRolesLen
		if (roleLen >= 2) {
			var config2 = GlobalConfig.ins("NewRoleConfig")[2];
			this.lockTips.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100730, [config2.zsLevel, config2.vip]);
		} else {
			var config1 = GlobalConfig.ins("NewRoleConfig")[1];
			this.lockTips.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100730, [config1.zsLevel, config1.vip]);
		}
	};

	open() {
		this.commonWindowBg.OnAdded(this)
		this.addTouchEvent(this, this.onTap, this.openBtn)

		for (let item of this.m_RoleGroup) {
			this.AddClick(item as any, this._ItemClick)
		}

		this.setNeedTxt();

		let jobDict = this._GetJobDict()
		this.m_SelectJob = 0
		for (let i = JobConst.ZhanShi; i <= JobConst.DaoShi; ++i) {
			if (!jobDict[i]) {
				this.m_SelectJob = i * 2 - 1
				break
			}
		}

		this._SetSelect(this.m_SelectJob - 1)
		this.curIdx = this.m_SelectJob - 1
	};
	close() {
		this.commonWindowBg.OnRemoved();// this.commonWindowBg.OnRemoved() 星辰版本	
		this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.roleShowPanel.release();
	};

	private _ItemClick(e: egret.TouchEvent) {
		let index = this.m_RoleGroup.indexOf(e.currentTarget)
		if (index == -1) {
			return
		}
		if (index == this.curIdx) return
		this.curIdx = index
		this._SetSelect(index)
	}

	private _GetJobDict() {
		let jobDict = {}
		for (let i = 0; i < SubRoles.ins().subRolesLen; ++i) {
			jobDict[SubRoles.ins().getSubRoleByIndex(i).job] = true
		}
		return jobDict
	}

	private _SetSelect(index: number) {

		let jobDict = this._GetJobDict()
		let job = Math.floor(index / 2) + 1
		if (jobDict[job]) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100731)
			return
		}
		this.m_SelectJob = index + 1
		this.UpdateContent()

		// this.roleShowPanel.SetBody(this.roleBody[job - 1], index % 2)
		// this.roleShowPanel.SetWeapon(this.roleWeapon[job - 1])
		this.roleShowPanel.release();
		this.onupdateView(job, index % 2, this.roleDressCfg[job].bodyAppearance, this.roleDressCfg[job].weaponAppearance, this.roleDressCfg[job].mountsAppearance)
	}
	private onupdateView(job, sex, bodyId, weaponId, mountId) {
		// console.log(job, sex, bodyId, weaponId, mountId)
		let role = SubRoles.ins().getSubRoleByIndex(0);
		if (bodyId > 0 || weaponId > 0) {
			role.legendDress = null
		}

		this.roleShowPanel.creatAnim(role);
		this.roleShowPanel.setCharSexJob(sex, job, bodyId, weaponId, mountId)

	}
	// private iconImgOver = [
	// 	"",
	// 	"comp_192_92_03_png",
	// 	"comp_192_92_03_png",
	// 	"comp_192_92_02_png",
	// 	"comp_192_92_02_png",
	// 	"comp_192_92_01_png",
	// 	"comp_192_92_01_png"
	// ];

	UpdateContent() {

		let jobDict = this._GetJobDict()
		var list = NewRoleWin.ICON_JOB_LIST();
		for (let i = 0; i < this.m_RoleGroup.length; ++i) {
			let job = Math.floor(i / 2) + 1
			let item = this.m_RoleGroup[i]
			let have = jobDict[job]
			// item.icon.source = NewRoleWin.ICON_LIST[job - 1][have ? 1 : 0] 
			item.jobName.source = list[job - 1][0]
			// let aa = item.jobName.source
			//item.jobName.visible = (i + 1) != this.m_SelectJob
			// let bb = item.jobName.visible
			item.select.visible = (i + 1) == this.m_SelectJob
			// item.select.source = this.iconImgOver[this.m_SelectJob];
			item.activation.visible = (have != null);
			item.txtName.text = list[job - 1][1]
			item.imgBg.source = i % 2 == 1 ? `comp_192_92_003_png` : `comp_192_92_002_png`
		}
	}

	onTap(e) {
		switch (e.target) {
			case this.openBtn:

				let canOpen = false
				var roleLen = SubRoles.ins().subRolesLen
				var e = GlobalConfig.ins("NewRoleConfig")[roleLen]
				if (null != e) {
					var i, s = "";
					e.zsLevel ? (s = e.zsLevel + GlobalConfig.jifengTiaoyueLg.st100067, canOpen = UserZs.ins().lv >= e.zsLevel, i = canOpen ? 65280 : 16711680, s = '<font color="#' + i.toString(16) + '">' + s + "</font>") : (s = e.level + GlobalConfig.jifengTiaoyueLg.st100093, canOpen = GameLogic.ins().actorModel.level >= e.level, i = canOpen ? 65280 : 16711680, s = '<font color="#' + i.toString(16) + '">' + s + "</font>"),
						e.vip && (canOpen = canOpen || UserVip.ins().lv >= e.vip, i = canOpen ? 65280 : 16711680, s += ' ' + GlobalConfig.jifengTiaoyueLg.st100732 + ' <font color="#' + i.toString(16) + '">VIP' + e.vip + "</font>")
				}

				if (!canOpen && this.m_SelectJob >= 1 && this.m_SelectJob <= 6) {
					UserTips.ins().showTips("|C:0xf87372&T:" + GlobalConfig.jifengTiaoyueLg.st100733 + "|");

					return;
				}
				// GameLogic.ins().sendNewRole(this.job + 1, this.m_Sex[this.job]);
				GameLogic.ins().sendNewRole(Math.ceil(this.m_SelectJob / 2), (this.m_SelectJob - 1) % 2);
				//创建之后关闭界面
				ViewManager.ins().close(this);
				break;
		}
	};

	OnBackClick(clickType: number): number {
		return 0
	}
	OnOpenIndex(openIndex: number): boolean {
		return true
	}
}

ViewManager.ins().reg(NewRoleWin, LayerManager.UI_Main);

class IOpenRoleItem extends eui.Group {
	roleShowPanel: RoleShowPanel
	job: eui.Image
	openedImg: eui.Image
}

window["NewRoleWin"] = NewRoleWin
window["IOpenRoleItem"] = IOpenRoleItem