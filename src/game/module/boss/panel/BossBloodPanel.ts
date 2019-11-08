interface IBossBloodPanel {
	OnRefreshTargetInfo()
	OnSeeReward()
	OnClearCD()
	DoOpen()
	OnAddEvent()
	OnRemoveEvent()
	OnAutoClearCD()
	ClearData()
	OnClearRole?(): boolean
}

class BossBloodPanel extends BaseEuiView {
	dropDown
	myTxt
	hudun
	hudunbloodBar: eui.ProgressBar;
	nameTxt
	head
	lvTxt

	cd: eui.Group

	seeRewardBtn
	autoClear
	clearRole: eui.CheckBox
	clearSelect: boolean

	clearBtn
	see: eui.Group

	public bloodBar: BossBloodBar;


	remainM
	timeLable
	huDunDesc: eui.Label;
	m_RoleHeadList: eui.List;
	roleHeaddata: eui.ArrayCollection;

	private _playerList: Array<any> = [];
	private hpInfoGroup: eui.Group;
	/** 遮罩*/
	public rectMac: eui.Rect;
	public m_ElementImg: eui.Image;


	// private targetNow : BossTargetInfo

	private get m_BossBloodPanel(): IBossBloodPanel {
		if (GameMap.IsPublicBoss() || GameMap.IsHomeBoss() || GameMap.IsSyBoss() || GameMap.IsKfBoss() || GameMap.IsXbBoss()) {
			return this.m_BossBloodPanel2
		} else if (ZsBoss.ins().isZsBossFb(GameMap.fubenID) || GameMap.IsWorldBoss()) {
			return this.m_BossBloodPanel1
		} else if (GameMap.fbType == UserFb.FB_TYPE_GUILD_BOSS) {
			return this.m_BossBloodPanel3
		}
		return this.m_BossBloodPanelNull
	}
	private m_BossBloodPanel1: IBossBloodPanel
	private m_BossBloodPanel2
	private m_BossBloodPanel3: IBossBloodPanel
	private m_BossBloodPanelNull: IBossBloodPanel

	initUI() {
		super.initUI()
		this.skinName = "BossBloodSkin";
		// this.dropDown.setEnabled(false);
		this.huDunDesc.text = GlobalConfig.jifengTiaoyueLg.st101382;
		this.clearRole.label = GlobalConfig.jifengTiaoyueLg.st101383;
		this.autoClear.label = GlobalConfig.jifengTiaoyueLg.st101384;
		this.clearBtn.label = GlobalConfig.jifengTiaoyueLg.st101385;
		this.seeRewardBtn.label = GlobalConfig.jifengTiaoyueLg.st101386;
		this.myTxt.text = "";
		this.rectMac.visible = this.hudun.visible = false;
		this.m_RoleHeadList.itemRenderer = BossBloodRoleItem;
		this.roleHeaddata = new eui.ArrayCollection([]);
		this.m_RoleHeadList.dataProvider = this.roleHeaddata;
		// this.m_RoleHeadList.visible = false;

		this.m_BossBloodPanel1 = new BossBloodPanelType1(this)
		this.m_BossBloodPanel2 = new BossBloodPanelType2(this)
		this.m_BossBloodPanel3 = new BossBloodPanelType3(this)
		this.m_BossBloodPanelNull = new BossBloodPanelTypeNull(this)
		if (Main.isLiuhai) {
			this.hpInfoGroup.top = 116;
			this.hudun.top = 200
		}

	};

	private monstersConfig: any;

	open() {
		this.myTxt.text = "";
		if (!UserBoss.ins().monsterID)
			return;
		if (this.monstersConfig == null)
			this.monstersConfig = GlobalConfig.monstersConfig;

		this.hudunbloodBar.maximum = 100;

		var config = this.monstersConfig[UserBoss.ins().monsterID];
		this.nameTxt.text = config.name;
		this.head.source = ResDataPath.getBossHeadImage(config.head);//config.head + "_png";
		this.lvTxt.text = "Lv." + config.level + "";
		this.m_ElementImg.source = ResDataPath.GetElementImgName(config.elementType);

		//玩家头像列表，用与点击挑战

		var dataArr = UserBoss.ins().rank;
		var len = dataArr.length;
		if (len) {
			if (len > 10) {
				len = 10;
			}
			var showArr = dataArr.slice(1, len);
			this.dropDown.setData(new eui.ArrayCollection(showArr));
			this.dropDown.setLabel(dataArr[0].name);
		}
		else {
			this.dropDown.setData(new eui.ArrayCollection([]));
			this.dropDown.setLabel('');
		}
		len = dataArr.length;
		var id = GameLogic.ins().actorModel.actorID;
		for (var i = 0; i < len; i++) {
			if (dataArr[i].id == id) {
				this.myTxt.text = GlobalConfig.jifengTiaoyueLg.st101380 + CommonUtils.overLength(dataArr[i].value);
				break;
			}
		}

		this.playerListUpdatte(this._playerList);

		this.AddEvent()
		this.m_BossBloodPanel.DoOpen()
		this.refushTargetInfo();
		this.guildFBInfo(config);
	}

	/** 刷新右边的攻击列表*/
	public playerListUpdatte(arr: Array<any>): void {
		this._playerList = arr;
		var char: CharRole;
		var temp: Array<CharRole> = EntityManager.ins().getRolesList();
		var temp1;
		var tempInfo: any;
		var value: number = 0;
		var total: number = 0;
		var list: Array<any> = [];
		for (var o of arr) {
			if (o.roleName == GameLogic.ins().actorModel.name) {
				continue;
			}
			tempInfo = {};
			tempInfo.job = o.job;
			tempInfo.sex = o.sex;
			tempInfo.id = o.id;
			tempInfo.name = o.roleName;
			tempInfo.hurtValue = o.hurtValue;
			value = total = 0;
			for (var i: number = 0; i < temp.length; i++) {
				temp1 = temp[i];
				if (temp1[0].infoModel.name == o.roleName) {
					for (var k: number = 0; k < temp1.length; k++) {
						char = temp1[k];
						value += char.infoModel.getAtt(AttributeType.atHp);
						total += char.infoModel.getAtt(AttributeType.atMaxHp);
					}
					break;
				}
			}
			tempInfo.value = value;
			tempInfo.total = total;
			tempInfo.isDeath = value > 0 ? 1 : 0; //是否死亡 ,1是存在，0是死亡
			list.push(tempInfo);
		}

		list.sort(this.compare("hurtValue"));
		list.sort(this.compare("isDeath"));
		this.roleHeaddata.replaceAll(list);
	}

	/** 排序*/
	private compare(prop) {
		return function (obj1, obj2) {
			var val1 = obj1[prop];
			var val2 = obj2[prop];
			if (val2 < val1) { //从大到小排序
				return -1;
			} else if (val2 > val1) {
				return 1;
			} else {
				return 0;
			}
		}
	}

	public updateRoleHeadList() {

	}

	private m_AddEvent = false

	private AddEvent() {
		if (this.m_AddEvent) {
			return
		}
		this.m_AddEvent = true
		this.m_BossBloodPanel.OnAddEvent()

		this.m_RoleHeadList.addEventListener(egret.TouchEvent.TOUCH_END, this.onHeadClick, this);

		this.seeRewardBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.autoClear.addEventListener(egret.Event.CHANGE, this.autoChange, this);
		this.clearRole.addEventListener(egret.Event.CHANGE, this.autoClearChange, this);
		this.clearBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);

	}


	private onHeadClick(e) {
		if (e.target.parent instanceof BossBloodRoleItem) {
			var parent = e.target.parent;
			if (parent.showEffect(), !UserBoss.ins().CanClick()) return;
			UserBoss.ins().sendPlayerBattle(parent.id);
		}

	}

	clearRendererItem() {
		for (var e = this.m_RoleHeadList.numChildren, t = 0; e > t; t++) {
			var i = this.m_RoleHeadList.getChildAt(t) as BossBloodRoleItem;
			i.clearEffect();
		}
	}

	close() {
		this.m_AddEvent = false

		this.m_BossBloodPanel.OnRemoveEvent()

		this.removeEvents()
		this.removeObserve()

		ViewManager.ins().close(PublicBossAttack)
		this.clearRendererItem();
		this.mask = null
	};

	ClearData() {
		if (this.m_BossBloodPanel1) {
			this.m_BossBloodPanel1.ClearData()
		}
		if (this.m_BossBloodPanel2) {
			this.m_BossBloodPanel2.ClearData()
		}
		if (this.m_BossBloodPanel3) {
			this.m_BossBloodPanel3.ClearData()
		}
		if (this.m_BossBloodPanelNull) {
			this.m_BossBloodPanelNull.ClearData()
		}
	}

	//  判断公会副本
	guildFBInfo(config) {
		var charm = EntityManager.ins().getEntityByHandle(UserBoss.ins().bossHandler);
		var monstermodel = charm ? charm.infoModel : null;
		if (Main.isLiuhai) {
			this.hpInfoGroup.top = 116;
		} else {
			this.hpInfoGroup.top = 76;
		}
		if (GameMap.fubenID && GlobalConfig.guildfbconfig.fbId == GameMap.fubenID) {
			this.myTxt.visible = false;
			this.dropDown.visible = false;
			if (Main.isLiuhai) {
				this.hpInfoGroup.top = 135;
			} else {
				this.hpInfoGroup.top = 95;
			}
			if (monstermodel) {
				this.bloodBar.changeMaxBarNum = GlobalConfig.monstersConfig[monstermodel.configID].hpCount
				this.bloodBar.changeMaximum = monstermodel.getAtt(AttributeType.atMaxHp);
				this.bloodBar.changeValue = monstermodel.getAtt(AttributeType.atHp);
			}
			else {
				this.bloodBar.changeMaxBarNum = config.hpCount;
				this.bloodBar.changeMaximum = config.hp;
				this.bloodBar.changeValue = UserBoss.ins().hp;
			}
		}
		else if (GameMap.IsPublicBoss() || GameMap.IsHomeBoss() || GameMap.IsSyBoss() || GameMap.IsKfBoss() || GameMap.IsXbBoss()) {
			this.myTxt.visible = true;
			this.dropDown.visible = true;
			if (monstermodel) {
				this.bloodBar.changeMaxBarNum = GlobalConfig.monstersConfig[monstermodel.configID].hpCount
			}
			this.bloodBar.changeMaximum = Number(UserBoss.ins().tempMaxHp);//config.hp;
			this.bloodBar.changeValue = Number(UserBoss.ins().tempHp);//UserBoss.ins().hp;
		}
		else {
			this.myTxt.visible = true;
			this.dropDown.visible = true;
			if (monstermodel) {
				this.bloodBar.changeMaxBarNum = GlobalConfig.monstersConfig[monstermodel.configID].hpCount
			}
			this.bloodBar.changeMaximum = config.hp;
			this.bloodBar.changeValue = UserBoss.ins().hp;
		}
	};

	//刷新boss目标信息
	refushTargetInfo() {
		this.m_BossBloodPanel.OnRefreshTargetInfo()
	}

	autoClearChange(e) {
		if (ZsBoss.ins().canChange) {
			ZsBoss.ins().clearOther = this.clearRole.selected;
			this.clearSelect = this.clearRole.selected;
			EntityManager.ins().hideOtherEntity(this.clearSelect);
		}
		else {
			this.clearRole.selected = this.clearSelect;
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101381);
		}
	}

	autoChange(e) {
		this.m_BossBloodPanel.OnAutoClearCD()
	};

	onTap(e) {
		switch (e.target) {
			case this.seeRewardBtn:
				this.m_BossBloodPanel.OnSeeReward()
				break;
			case this.clearBtn:
				this.m_BossBloodPanel.OnClearCD()

				break;
		}
	};
}

ViewManager.ins().reg(BossBloodPanel, LayerManager.UI_HUD);

window["BossBloodPanel"] = BossBloodPanel