class UIView1_1 extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_USER_INFO
	public static STATE_GUANQIA = "guanqia"

	// timer = 0;
	itemary = [];
	index = 0;
	timerEnd = 60;

	// power;
	//vipLabel: eui.BitmapLabel;
	//private vipRedPoint: eui.Image;
	//private vipBtn: eui.Group;

	//powLabel: eui.BitmapLabel;

	bossTimer: eui.Label
	guildfb_time: eui.Image
	guildfb_timenum: eui.Image
	timeshenyu: eui.Label
	private imgSmallMap: eui.Image

	timeID: number;

	//mapName0;
	mapName;
	goldTxt;
	group1;

	expTxt;

	public m_MapStateGroup: eui.Group;
	public m_RedPoint: eui.Image;

	public m_Group1: eui.Group;
	public m_ItemBase1: ItemBase;
	public m_Cont1: eui.Label;
	public m_ArtifactTipsAnim: ArtifactTipsAnim;

	public constructor() {
		super();
		//this.imgMask.visible =false
	}

	public initUI() {
		super.initUI();
		this.skinName = "MainTop2PanelSkin";
		this.touchEnabled = false;
		if (Main.isLiuhai) {
			this.m_MapStateGroup.top = 120;
		}
		if (this.bossTimer) {
			this.bossTimer.visible = false;
			this.guildfb_time.visible = false;
			this.guildfb_timenum.visible = false;
			this.timeshenyu.visible = false;
		}
		//this.vipBtn.visible = StartGetUserInfo.isOne == false;//针对单机屏蔽；
		this.m_MapStateGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickMap, this);//特殊处理会卡引导
		this.m_Group1.touchChildren = true;
	};

	public initData() {
		// if (this.timeID)
		// 	return;
		// this.timeID = egret.setTimeout(this.setData, this, 100);
	};
	public setData() {
		egret.clearTimeout(this.timeID);
		this.timeID = 0;
		var model = SubRoles.ins().getSubRoleByIndex(0);
		this.changeExpBtn();
		// this.expChange()
		//this.powLabel.text = GameLogic.ins().actorModel.power.toString()
	};
	public open(...param: any[]) {

		super.open(param);
		//this.vipBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		// MessageCenter.addListener(GameLogic.ins().postSubRoleChange, this.initData, this);
		// MessageCenter.ins().addListener(MessageDef.POWER_CHANGE, this.initData, this)
		MessageCenter.ins().addListener(MessageDef.GUANQIA_CHANGE, this.checkQuanQiaGuide, this);
		MessageCenter.addListener(UserFb.ins().postGuanKaIdChange, this.upDataGuanqia, this);
		MessageCenter.addListener(UserFb.ins().postWaveChange, this.upDataGuanqia, this);
		MessageCenter.addListener(GameLogic.ins().postEnterMap, this.upDataGuanqia, this);
		GameGlobal.MessageCenter.addListener(MessageDef.UPDATA_VIP_EXP, this.changeExpBtn, this);
		GameGlobal.MessageCenter.addListener(MessageDef.UPDATA_VIP_AWARDS, this.showVipRedPoint, this);
		MessageCenter.addListener(GuildFB.ins().postGuildFBBossInfo, this.upDataBossInfo, this);
		MessageCenter.addListener(GuildFB.ins().postGuildFBBossTimerEndInfo, this.guildFBTimer, this);
		this.observe(UserFb.ins().postZhangJieAwardChange, this.upDataGuanqia);
		this.observe(MessageDef.GUANQIA_CHANGE, this.upDataGuanqia);
		this.observe(GuanQiaEvt.GUANQIA_UPDATE_MSG, this.upDataGuanqia);


		this.initData();
		this.upDataGuanqia();
		this.showVipRedPoint()

	};
	public close(...param: any[]) {
		super.close(param);
		//this.vipBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		MessageCenter.ins().removeAll(this);
	};

	public showVipRedPoint() {
		//this.vipRedPoint.visible = UserVip.ins().CheckRedPoint();
	}

	public changeExpBtn() {
		//this.vipLabel.text = `${UserVip.ins().lv}`
	};

	//公会副本倒计时刷怪
	public upDataBossInfo() {
		this.index = 0;
		this.mapName.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100390, [(GuildFB.ins().bossGKNum - 1)]);
		this.bossTimer.visible = true;
		this.bossTimer.text = "" + (3 - this.index);
		this.guildfb_time.visible = true;
		this.guildfb_timenum.visible = true;
		this.timeshenyu.visible = false
		TimerManager.ins().remove(this.guildTimer, this);
		TimerManager.ins().doTimer(1000, 3, this.setBagData, this);
	};
	public setBagData() {
		this.index++;
		this.bossTimer.text = "" + (3 - this.index);
		if (this.index == 3) {
			this.bossTimer.visible = false;
			this.guildfb_time.visible = false;
			this.guildfb_timenum.visible = false;
			TimerManager.ins().remove(this.setBagData, this);
		}
	};
	//公会副本每关的时间
	public guildFBTimer() {
		TimerManager.ins().remove(this.guildTimer, this);
		this.mapName.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100390, [(GuildFB.ins().bossGKNum)])
		this.rewardUpdate();
		if (this._UpdateGuildTimer()) {
			TimerManager.ins().doTimer(1000, 60, this.guildTimer, this);
		}
	};
	/*奖励显示*/
	public rewardUpdate() {
		var reward = [];
		this.itemary.forEach(function (element) {
			if (element.parent) {
				element.parent.removeChild(element);
				element = null;
			}
		});
		this.itemary = [];
		for (var k in GlobalConfig.ins("guildfbAwardConfig")) {
			if (GuildFB.ins().bossGKNum == GlobalConfig.ins("guildfbAwardConfig")[k].id) {
				reward = GlobalConfig.ins("guildfbAwardConfig")[k].waveShowAward;
			}
		}
		for (var i = 0; i < reward.length; i++) {
			var item = new ItemBase();
			item.scaleX = 0.6;
			item.scaleY = 0.6;
			this.group1.addChild(item);
			this.itemary.push(item);

			item.data = reward[i];
			item.isShowName(false);
		}
	};

	private _UpdateGuildTimer() {
		this.timerEnd = GuildFB.ins().bossTimerEnd - GameServer.serverTime
		if (this.timerEnd > 0) {
			this.timeshenyu.visible = true;
			this.timeshenyu.textFlow = (new egret.HtmlTextParser).parser(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101369, [this.timerEnd]));
			return true
		} else {
			this.timeshenyu.visible = false
		}
		return false
	}
	public guildTimer() {
		if (!this._UpdateGuildTimer()) {
			TimerManager.ins().remove(this.guildTimer, this);
		}
	};
	private chaptersConfig: any;
	public upDataGuanqia() {
		// console.log("GameMap.fubenID => " + GameMap.fubenID)
		this.bossTimer.visible = false;
		this.guildfb_time.visible = false;
		this.guildfb_timenum.visible = false;
		this.timeshenyu.visible = false;
		TimerManager.ins().remove(this.guildTimer, this);
		this.m_RedPoint.visible = false;
		if (GameMap.fubenID) {
			this.currentState = "fb";
			if (GlobalConfig.guildfbconfig.fbId == GameMap.fubenID) {
				this.currentState = "guildfb";
				//this.mapName0.text = "第" + (GuildFB.ins().bossGKNum - 1) + "波";
				let fbName = GameMap.fbName || GlobalConfig.jifengTiaoyueLg.st101376;
				this.mapName.text = fbName + (GuildFB.ins().bossGKNum - 1)
				this.goldTxt.text = '';
				this.guildFBTimer();
			} else {
				this.mapName.text = GameMap.fbName;
				this.goldTxt.text = GameMap.fbDesc;
			}
		} else {
			this.currentState = UIView1_1.STATE_GUANQIA;
			this.m_RedPoint.visible = GuanQiaModel.getInstance.checkAllRedPoint();
			egret.setTimeout(function () {
				var gqID = UserFb.ins().guanqiaID;
				if (gqID < 0)
					return;
				if (this.chaptersConfig == null)
					this.chaptersConfig = GlobalConfig.ins("ChaptersConfig");

				var config = this.chaptersConfig[gqID];
				if (config) {
					this.mapName.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101377, [config.mapsubid + "-" + config.turn]);
				} else {
					// WarnWin.show("内存优化只保留500关数据,没有配置信息,需要重新登录加载\n当前关卡数：" + UserFb.ins().guanqiaID, function () {
					// 	window.location.reload();
					// }, this, null, null, "sure");
					// return;
				}
				if (config && this.goldTxt) {
					//this.mapName.text =UserFb.ins().Desc+" "+ config.cid ;
					this.goldTxt.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101378, [config.goldEff]);
					let chaptersRewardConfig = GlobalConfig.ins("ChaptersRewardConfig")[config.mapid];
					if (chaptersRewardConfig) {
						this.expTxt.text = chaptersRewardConfig.name;
					}
				}
				else {
					Main.errorBack("UIView1_1.upDataGuanqia ChaptersConfig配置ID不存在= " + gqID);
				}
				// this.imgSmallMap.source = ResDataPath.GetMapPreviewPath(GameMap.getFileName())
			}, this, 100)
		}
		this.m_Group1.visible = false;
		this.m_ArtifactTipsAnim.visible = false;
		if (GameMap.IsTiaoZhan()) {
			let id = UserFb2.ins().fbChallengeId
			let cof1 = GlobalConfig.ins("FbChallengeStageAwardConfig")[UserFb2.ins().commonLv2];
			if (cof1) {
				if (!cof1.disPlayType) {
					let taskAward = cof1.taskAward[0]
					this.m_ItemBase1.data = { type: taskAward.type, id: taskAward.id, count: taskAward.count, isShowName: 1 }
					this.m_Cont1.text = cof1.fbNum + GlobalConfig.jifengTiaoyueLg.st102101;
					this.m_Cont1.textColor = Color.White;
					this.m_Group1.visible = true;
				} else {
					this.m_ArtifactTipsAnim.visible = true;
					this.m_ArtifactTipsAnim.setData(cof1.effUi);
					this.m_ArtifactTipsAnim.m_RAndNameLab.text = cof1.fbNum + GlobalConfig.jifengTiaoyueLg.st102101;
				}
			} else {
				this.m_Group1.visible = false;
				this.m_ArtifactTipsAnim.visible = false;
			}
		}
	};
	private checkQuanQiaGuide() {
		let checkPlay: boolean = GuanQiaModel.getInstance.checkIsCanGoNextLayer();
		if (checkPlay) {
			let dialogueSetConfig = GuanQiaModel.getInstance.setGuideConfig();
			if (dialogueSetConfig) {
				Setting.currStep = 0;
				Setting.currPart = dialogueSetConfig.groupId;
				egret.setTimeout(function () {
					GuideUtils.ins().show(this.m_MapStateGroup, dialogueSetConfig.groupId, 0)
				}, this, 100)
			}
		}
	}

	private onClickMap() {
		GuideUtils.ins().next(this.m_MapStateGroup);
		ViewManager.ins().open(GuanQiaMapWin);
	}

	public onClick(e) {
		ViewManager.ins().open(VipWin);
	};
}
window["UIView1_1"] = UIView1_1