class TrRoleWingPanel extends BaseView implements ICommonWindowTitle, ICommonWindowRoleSelect {

	private wingCommonConfig: any;
	private m_Context: TrRoleWin
	windowTitleIconName: string = ""
	public roleShowPanel: RoleShowPanel;
	public m_img: eui.Image;
	windowCommonBg = "pic_bj_20_png";
	public constructor(context: TrRoleWin) {
		super()
		this.m_Context = context

		this.name = GlobalConfig.jifengTiaoyueLg.st100339;
		this.skinName = "TrRoleWingSkin"

		this.windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st100339;
		this.warnLabel.text = GlobalConfig.jifengTiaoyueLg.st100342;
	}

	private GetRoleData(): Role {
		return this.m_Context.mRoleData[this.m_RoleSelectPanel.curRole]
	}

	private powerLabel: PowerLabel

	starList: StarList

	_wingsData: WingsData

	expBar: eui.ProgressBar

	attrLabel: AttrLabel

	warnLabel

	wingImg
	wingName

	_totalPower

	private get curRole(): number {
		return this.m_RoleSelectPanel.getCurRole()
	}


	open() {
	};
	close() {
	};

    /**
     * 未激活
     */
	notOpenStatus() {
		this.starList.visible = false;
		this.expBar.visible = false;
		this.attrLabel.visible = false;
		this.powerLabel.visible = false
		this.warnLabel.visible = true;
		this.warnLabel.text = GlobalConfig.jifengTiaoyueLg.st100340;
	};
    /**
     * 已激活
     */
	openStatusOpen() {
		this.warnLabel.visible = false;
		this.starList.visible = true;
		this.expBar.visible = true;
		this.attrLabel.visible = true;
		this.powerLabel.visible = true;
	};

	setWingData() {
		this._wingsData = this.GetRoleData().wingsData
		let role = this.GetRoleData()
		let subRole = role.GetSubRoleData()
		this.roleShowPanel.creatAnim(subRole);
		//this.wingImg.source = GlobalConfig.wingLevelConfig[this._wingsData.lv].appearance + "_png";
		this.wingImg.touchEnabled = false;
		if (this._wingsData.openStatus) {
			this.openStatusOpen();
			this.wingName.text = "" + GlobalConfig.wingLevelConfig[this._wingsData.lv].name;
			this.m_img.visible = true;
		}
		else {
			this.notOpenStatus();
			this.wingName.text = "";
			this.m_img.visible = false;
			return;
		}

		this.updateAtt();
		this.isShowUpGradeBtn();

	};

	public showLVbnt: boolean = true;  //判断升级按钮的点击 

	updateAtt() {
		if (this.wingCommonConfig == null)
			this.wingCommonConfig = GlobalConfig.ins("WingCommonConfig");

		var config = GlobalConfig.wingLevelConfig[this._wingsData.lv];
		var starConfig = GlobalConfig.wingStarConfig[this._wingsData.star];

		this.attrLabel.SetCurAttrByAddType(config, starConfig)
		this._totalPower = UserBag.getAttrPower(AttributeData.AttrAddition(config.attr, starConfig.attr));
		var power = 0;
		var len = this._wingsData.equipsLen;
		for (var i = 0; i < len; i++) {
			var equip = this._wingsData.getEquipByIndex(i);
			if (equip.itemConfig)
				power += ItemConfig.calculateBagItemScore(equip);
		}
		this._totalPower = this._totalPower + power;
		this.powerLabel.text = this._totalPower
		if (this._wingsData.lv < this.wingCommonConfig.lvMax) {
			var nextLvConfig = void 0;
			var nextStarConfig = void 0;

			if (this._wingsData.star > 0 && this._wingsData.star % 10 == 0 && this.showLVbnt) {    //如果星星等于10星
				nextLvConfig = GlobalConfig.wingLevelConfig[this._wingsData.lv + 1];   //显示下一级
				nextStarConfig = starConfig;
				this.showLVbnt = false;
			}
			else {
				if (this._wingsData.star % 10 == 0 && !this.showLVbnt) {       // 判断0星
					nextLvConfig = config;
					nextStarConfig = GlobalConfig.wingStarConfig[this._wingsData.star + 1];
				} else {                                                  // 1-9星
					nextLvConfig = config;
					nextStarConfig = GlobalConfig.wingStarConfig[this._wingsData.star + 1];
					this.showLVbnt = true;
				}
			}
			this.attrLabel.SetNextAttrByAddType(nextLvConfig, nextStarConfig)
		}
	};

	isShowUpGradeBtn() {

		if (this.wingCommonConfig == null)
			this.wingCommonConfig = GlobalConfig.ins("WingCommonConfig");

		if (this._wingsData.lv >= this.wingCommonConfig.lvMax) {
			this.notOpenStatus();
			this.powerLabel.visible = true;
			this.warnLabel.visible = true;
			this.warnLabel.x = 153;
			this.warnLabel.y = 492;
			this.warnLabel.text = GlobalConfig.jifengTiaoyueLg.st100341;

			this.attrLabel.visible = true;

			return;
		}
		var config = GlobalConfig.wingLevelConfig[this._wingsData.lv];

		var num = this._wingsData.star / 10 - config.level;
		var starNum;
		var bLevelUp = false;
		if (this._wingsData.star > 0 && Math.floor(this._wingsData.star / 10) - this._wingsData.lv > 0 && this._wingsData.lv < this.wingCommonConfig.lvMax && num) {
			starNum = 10;
			bLevelUp = true;
		}
		else {
			starNum = this._wingsData.star % 10;
		}

		this.starList.starNum = starNum;
	};

	public UpdateContent(): void {
		this.setWingData();
	}


	m_RoleSelectPanel: RoleSelectPanel
}
window["TrRoleWingPanel"] = TrRoleWingPanel