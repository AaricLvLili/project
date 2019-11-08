class GuildWarInfoPanel extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_HUD

	////////////////////////////////////////////////////////////////////////////////////////////////////
	// GuildWarUiSkin.exml
	////////////////////////////////////////////////////////////////////////////////////////////////////
	private guildName: eui.Label
	private playNext: eui.Button
	private flagTime: eui.Label
	private guildName1: eui.Label
	private flagStatu: eui.Group
	private refush: eui.Button
	private btn: eui.ToggleButton
	private list1: eui.List
	private bar1: eui.Scroller
	private monHead: eui.Image
	private roleName: eui.Label
	private mon: eui.Group
	private attList: eui.Group
	// private help: eui.Button
	private point: eui.Label
	private gongxun: eui.Group
	private list2: eui.List
	private weixie: eui.Group
	private weixieIcon2: eui.Image
	private palaceFlag: eui.Button
	private flagGroup: eui.Group
	private times: eui.Label
	private timeDesc: eui.Label
	private bloodBar: eui.ProgressBar
	private hudun: eui.ProgressBar
	private hudun1: eui.Group
	private flag: eui.Group
	private taskTraceName0: eui.Label
	private taskTraceAwards0: eui.Label
	private taskTraceBtn: eui.Group
	private tipGroup: eui.Group
	private guildPoint: eui.Label
	private ownPoint: eui.Label
	private comNum: eui.Label
	//private guid2: eui.Label
	private scene: eui.Label
	private seeMyGuild: eui.Label
	private guid: eui.Group
	private descImg: eui.Label
	private sceneBar: eui.ProgressBar
	private scene1: eui.Image
	private scene2: eui.Image
	private scene3: eui.Image
	private scene4: eui.Image
	private ruleDesc: eui.Group
	private lastTime: eui.Label
	private seeRank: eui.Label
	private imgDataBg: eui.Label;
	////////////////////////////////////////////////////////////////////////////////////////////////////

	clickEffc: MovieClip
	// nextEff: MovieClip
	pointEff: MovieClip
	private guildBattleConst: any;
	private languageTxt: eui.Label;
	private languageTxt0: eui.Label;
	private languageTxt1: eui.Label;
	public m_EffGroup: eui.Group;

	public constructor() {
		super()
	}

	initUI() {
		this.skinName = "GuildWarUiSkin"

		this.pointEff = new MovieClip
		this.pointEff.x = 136;
		this.pointEff.y = 44;
		this.pointEff.touchEnabled = false;
		this.taskTraceBtn.addChild(this.pointEff)

		this.list1.itemRenderer = GuildWarMemberHeadRender
		this.list2.itemRenderer = GuildWarMemberHeadRender
		this.sceneBar.maximum = 300
		this.sceneBar.labelFunction = function () {
			return ""
		}

		this.bloodBar.labelFunction = function () {
			if (GuildWar.ins().GetFlagStatu() == GuildWarFlagState.GATHER) {
				return GlobalConfig.jifengTiaoyueLg.st101544 + "：" + DateUtils.GetFormatSecond(GuildWar.ins().GetFlagSurplusTime(), 5)
			}
			return ""
		}

		UIHelper.SetLinkStyleLabel(this.seeRank, GlobalConfig.jifengTiaoyueLg.st100497)
		UIHelper.SetLinkStyleLabel(this.seeMyGuild, GlobalConfig.jifengTiaoyueLg.st101568)

		this.hudun.labelFunction = function () {
			return Math.ceil(GuildWar.ins().GetHudunRate()) + "%"
		}
		this.refush.label = GlobalConfig.jifengTiaoyueLg.st100065;
		this.roleName.text = GlobalConfig.jifengTiaoyueLg.st101569;
		this.times.text = GlobalConfig.jifengTiaoyueLg.st101570;
		this.languageTxt.text = GlobalConfig.jifengTiaoyueLg.st101571;
		this.languageTxt0.text = GlobalConfig.jifengTiaoyueLg.st101572;
		this.languageTxt1.text = GlobalConfig.jifengTiaoyueLg.st101574;
		this.palaceFlag.label = GlobalConfig.jifengTiaoyueLg.st101573;
		this.playNext.label = GlobalConfig.jifengTiaoyueLg.st101545;
	}

	private initEff() {
		if (!this.clickEffc) {
			this.clickEffc = new MovieClip();
			this.clickEffc.loadUrl(ResDataPath.GetUIEffePath("tapCircle"), !0, 1)
			this.clickEffc.x = this.m_EffGroup.width / 2 - 1;
			this.clickEffc.y = this.m_EffGroup.height / 2 - 2;
			this.m_EffGroup.addChild(this.clickEffc);
			this.clickEffc.addEventListener(egret.Event.COMPLETE, this.efComplete, this);
		}
	}
	private efComplete() {
		this.clickEffc.visible = false;
	}

	open() {
		this.initEff();
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.playNext.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		// App.MessageCenter.addListener(MessagerEvent.FUBEN_CHANGE, this.refushShowInfo, this)
		this.seeRank.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		// App.MessageCenter.addListener(MessagerEvent.GUILDWAR_CITYOWN_CHANGE, this.cityOwnChange, this)
		this.seeMyGuild.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.observe(MessageDef.GUILDWAR_ACTOR_UPDATE, this.refushPoint)
		this.observe(MessageDef.GUILD_WAR_UPDATE_ENEMIES, this.refushWeixieList)
		this.observe(MessageDef.GUILD_WAR_UPDATE_TARGETS, this.refushcanPlayList)
		this.observe(MessageDef.GUILD_WAR_DOORSTATU_CHANGE, this.doorStatuChange)
		this.observe(MessageDef.GUILDWAR_HUDUN_INFO, this.refushFlagStatu)
		this.observe(MessageDef.GUILDWAR_UPDATE_BASE_INFO, this.rankListChange)
		this.observe(MessageDef.GUILDWAR_FLAG_NOTICE, this._DoUpdateFlag)

		// GameGlobal.MessageCenter.addListener(MessageDef.MINI_CHAT_PANEL_STATE, this._UpdateChatPanelState, this)

		this.list1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.listTap, this)
		this.list2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.listTap, this)
		this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.palaceFlag.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		// this.help.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.mon.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		//this.guid2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.taskTraceBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.monHead.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)

		this.ruleDesc.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)

		this.refushShowInfo()
		this.refushPoint()
		this.cityOwnChange()
		this.refushWeixieList()
		this.refushcanPlayList()
		this.rankListChange()
		this.doorStatuChange()
		this.refushFlagStatu()
		this.refushGuildNum()

		// this._UpdateChatPanelState()
	}


	close() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.playNext.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		// App.MessageCenter.removeListener(MessagerEvent.FUBEN_CHANGE, this.refushShowInfo, this)
		// App.MessageCenter.removeListener(MessagerEvent.GUILDWAR_POINT_UPDATE, this.refushPoint, this)
		// App.MessageCenter.removeListener(MessagerEvent.GUILDWAR_POINT_REWARD_CHANGE, this.refushPointReward, this)
		this.seeRank.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.seeMyGuild.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		// App.MessageCenter.removeListener(MessagerEvent.GUILDWAR_WEIXIE_CHANGE, this.refushWeixieList, this)
		// App.MessageCenter.removeListener(MessagerEvent.GUILDWAR_CANPLAY_CHANGE, this.refushcanPlayList, this)
		// App.MessageCenter.removeListener(MessagerEvent.GUILDWAR_CITYOWN_CHANGE, this.cityOwnChange, this)
		this.list1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.listTap, this)
		this.list2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.listTap, this)
		this.btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.mon.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		// this.help.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		//this.guid2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.taskTraceBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.palaceFlag.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		// App.MessageCenter.removeListener(MessagerEvent.GUILDWAR_FLAGSTATU, this.refushFlagStatu, this)
		// App.MessageCenter.removeListener(MessagerEvent.GUILDWAR_RANKLIST_CHANGE, this.rankListChange, this)
		this.ruleDesc.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		// App.MessageCenter.removeListener(MessagerEvent.GUILDWAR_DOORSTATU_CHANGE, this.doorStatuChange, this)

		ViewManager.ins().isShow(GuileWarReliveWin) && ViewManager.ins().close(GuileWarReliveWin)
		TimerManager.ins().removeAll(this)
		if (this.clickEffc) {
			this.clickEffc.removeEventListener(egret.Event.COMPLETE, this.efComplete, this);
			DisplayUtils.dispose(this.clickEffc)
			this.clickEffc = null;
		}
		DisplayUtils.removeFromParent(this.pointEff)
		this.clearRendererItem()
		this.mask = null
	}

	// private _UpdateChatPanelState() {
	// 	PlayFunView.UpdateChatPanelState(this.taskTraceBtn)
	// 	PlayFunView.UpdateChatPanelState(this.tipGroup)
	// }

	static BTN_IMG(index) {
		let list = [
			GlobalConfig.jifengTiaoyueLg.st101545,//进入城内
			GlobalConfig.jifengTiaoyueLg.st101545,//进入城内
			GlobalConfig.jifengTiaoyueLg.st101546,//进入前殿
			GlobalConfig.jifengTiaoyueLg.st101547,//进入皇宫
			GlobalConfig.jifengTiaoyueLg.st101548,//返回前殿
		];
		return list[index];
	}

	static TIPS_TXT(id) {
		let list = {
			28001: GlobalConfig.jifengTiaoyueLg.st101549,//"攻破城门，进攻皇城",
			28002: GlobalConfig.jifengTiaoyueLg.st101550,//"击杀敌人获得积分和奖励",
			28003: GlobalConfig.jifengTiaoyueLg.st101551,//"阻止试图进入皇宫的敌人",
			28004: GlobalConfig.jifengTiaoyueLg.st101552,//"收集皇宫旗帜，一举致胜",
		}
		return list[id];
	}

	refushShowInfo() {
		var e = this;
		this.gongxun.visible = GuildWar.ins().checkinAppoint(2)
		this.imgDataBg.height = this.gongxun.visible ? 88 : 68;
		this.mon.visible = GuildWar.ins().checkinAppoint(2)
		// this.bar1.y = this.mon.visible ? 112 : 30
		// this.bar1.height = this.mon.visible ? 340 : (340 + 112 - 30)
		this.attList.visible = GuildWar.ins().checkinAppoint(2, !0)
		this.weixie.visible = GuildWar.ins().checkinAppoint(2, !0)
		this.flagGroup.visible = GuildWar.ins().checkinAppoint(4)
		this.flag.visible = GuildWar.ins().checkinAppoint(4)
		this.scene.text = GuildWar.ins().getNextMapName(0)
		this.guid.visible = GuildWar.ins().checkinAppoint(2) && GuildWar.ins().getIntoNextMapGongxun() > GuildWar.ins().GetGongxun()
		//this.descImg.source = "tips" + GameMap.fubenID;
		this.descImg.text = GuildWarInfoPanel.TIPS_TXT(GameMap.fubenID);
		var t = GuildWar.ins().getMapLevelInfo();
		this.playNext.label = GuildWarInfoPanel.BTN_IMG(t.id) || GuildWarInfoPanel.BTN_IMG(1)
		this.sceneBar.value = 100 * (t.id - 1)
		this.scene1.source = (t.id >= 1 ? "comp_42_44_01_png" : "comp_42_44_07_png")
		this.scene2.source = (t.id >= 2 ? "comp_42_44_04_png" : "comp_42_44_03_png")
		this.scene3.source = (t.id >= 3 ? "comp_42_44_02_png" : "comp_42_44_08_png")
		this.scene4.source = (t.id >= 4 ? "comp_42_44_05_png" : "comp_42_44_06_png")
		this.lastTime.text = DateUtils.getFormatBySecond(GuildWar.ins().GetSurplusTime(), 9)

		this._UpdateGuildWarTime()
		TimerManager.ins().remove(this._UpdateGuildWarTime, this)
		TimerManager.ins().doTimer(1000, GuildWar.ins().GetSurplusTime(), this._UpdateGuildWarTime, this)
	}

	private _UpdateGuildWarTime() {
		this.lastTime.text = DateUtils.getFormatBySecond(GuildWar.ins().GetSurplusTime(), DateUtils.TIME_FORMAT_5)
	}

	refushGuildNum() {
		this.comNum.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101553, [GuildWar.ins().GetGuildNum()]);//"场景同帮：" + GuildWar.ins().GetGuildNum() + "人"
	}

	refushPoint() {
		this.ownPoint.text = GlobalConfig.jifengTiaoyueLg.st100060 + GuildWar.ins().GetMyPoint()
		let str: string = GuildWar.ins().GetGongxun() + "/" + GuildWar.ins().getIntoNextMapGongxun();
		// this.point.text = GuildWar.ins().GetGongxun() + "/" + GuildWar.ins().getIntoNextMapGongxun()
		//this.point.textFlow = <Array<egret.ITextElement>>[{ text: "战功: ", style: { "textColor": 0xbf7d00 } }, { text: str, style: { "textColor": 0x008f22 } }]
		this.point.text = str + "";
		this.refushPointReward()
		this.doorStatuChange()
	}

	refushPointReward() {
		var configData = GuildWar.ins().getMyPointReward();
		if (configData) {
			this.taskTraceName0.y = 17;
			var str = GlobalConfig.jifengTiaoyueLg.st101554 + "：" + GuildWar.ins().GetMyPoint() + "/" + configData.integral;
			str += GuildWar.ins().CanReward()
				? "<font color = '#008f22'>(" + GlobalConfig.jifengTiaoyueLg.st101555 + ")</fomt>"
				: ""
			this.taskTraceName0.textFlow = (new egret.HtmlTextParser).parser(str);
			var i = configData.award[0];
			if (0 == i.type) var n = i.count + MoneyManger.MoneyConstToName(i.id);
			else n = GlobalConfig.itemConfig[i.id].name;
			this.taskTraceAwards0.text = GlobalConfig.jifengTiaoyueLg.st101556 + ":" + n
			this.taskTraceAwards0.visible = !0

		} else {
			this.taskTraceName0.y = 25
			this.taskTraceName0.text = GlobalConfig.jifengTiaoyueLg.st101557;//"已获得所有积分奖励"
			this.taskTraceAwards0.visible = !1
			DisplayUtils.removeFromParent(this.pointEff)
		}
	}

	cityOwnChange() {
		this.guildName.text = "" == GuildWar.ins().GetCityOwn() ? GlobalConfig.jifengTiaoyueLg.st101034 : GuildWar.ins().GetCityOwn()
	}

	refushWeixieList(e = false) {
		let list = GuildWar.ins().weixieList || []
		this.list2.dataProvider = new eui.ArrayCollection(list)
		this.weixieIcon2.visible = list.length > 0
		e && (this.list1.dataProvider = new eui.ArrayCollection(GuildWar.ins().canPlayList))
	}

	refushcanPlayList() {
		this.refushGuildNum()
		this.list1.dataProvider = new eui.ArrayCollection(GuildWar.ins().canPlayList)
	}

	doorStatuChange() {
		let state = (GuildWar.ins().IsDoorDie() && GuildWar.ins().checkinAppoint(1) || GuildWar.ins().getIntoNextMapGongxun() <= GuildWar.ins().GetGongxun() && GuildWar.ins().checkinAppoint(2))
		// UIHelper.SetBtnNormalEffe(this.playNext, state)
		//UIHelper.SetBtnEffe(this.playNext, "eff_btn_orange", state, 1, 1, 80, 25)
		UIHelper.SetBtnNormalEffe(this.playNext, state)
	}

	rankListChange() {
		this.guildPoint.text = GlobalConfig.jifengTiaoyueLg.st101558 + "：" + GuildWar.ins().GetGuildPoint();

		let datas = GuildWar.ins().GetFrontRank()
		for (let i = 0; i < 3; ++i) {
			let data = datas[i]
			if (data) {
				this["rankInfo" + (i + 1)].text = (i + 1) + " " + data.guildName + " " + data.integral
			} else {
				this["rankInfo" + (i + 1)].text = (i + 1) + " " + GlobalConfig.jifengTiaoyueLg.st100378 + " " + "0"
			}
		}
	}

	refushFlagStatu() {
		TimerManager.ins().remove(this.runTime, this)
		this.hudun1.visible = !1
		if (GuildWarFlagState.NONE == GuildWar.ins().GetFlagStatu()) {
			this.clearTimeBar()
			this.runTime()
			TimerManager.ins().doTimer(1e3, GuildWar.ins().GetFlagStartSurplusTime(), this.runTime, this)
		} else {
			if (GuildWarFlagState.CAN_GATHER == GuildWar.ins().GetFlagStatu()) {
				this.clearTimeBar()
				this.timeDesc.text = GlobalConfig.jifengTiaoyueLg.st101559;//"当前皇旗可采集"
			} else {
				this.runTime();
				if (this.guildBattleConst == null) {
					if (GuildWar.ins().guildWarStartType == 1)
						this.guildBattleConst = GlobalConfig.ins("GuildBattleConst1");
					else if (GuildWar.ins().guildWarStartType == 2)
						this.guildBattleConst = GlobalConfig.ins("GuildBattleConst2");
					else
						this.guildBattleConst = GlobalConfig.ins("GuildBattleConst");
				}
				this.bloodBar.maximum = this.guildBattleConst.gatherTime;
				// TimerManager.ins().doTimer(1e3, GuildWar.ins().endTime, this.runTime, this)
				TimerManager.ins().doTimer(1e3, GuildWar.ins().GetFlagSurplusTime(), this.runTime, this)
				this.hudun1.visible = true
			}
		}
		// this.flagStatu.visible = GuildWarFlagState.GATHER == GuildWar.ins().GetFlagStatu() && !this.flagGroup.visible
		// if (this.flagStatu.visible) {
		// 	var e = egret.Tween.get(this.flagStatu);
		// 	this.flagStatu.x = 488
		// 	e.to({
		// 		x: 105
		// 	}, 500).call(function () { }, this)
		// }
	}

	// private m_PreFlagName = null

	private _DoUpdateFlag() {
		if (this.flagGroup.visible) {
			this.flagStatu.visible = false
			return
		}
		let flagNotice = GuildWar.ins().mFlagNotice
		if (flagNotice == null || flagNotice.holderName == "" || flagNotice.holderName == null) {
			this.flagStatu.visible = false
			return
		}
		this.flagStatu.visible = true
		// if (this.m_PreFlagName != flagNotice.holderGuild) {
		// 	var e = egret.Tween.get(this.flagStatu);
		// 	this.flagStatu.x = 390
		// 	e.to({ x: 105 }, 500).call(()=>{
		// 		egret.Tween.removeTweens(this.flagStatu);
		// 	});

		// }
		// this.m_PreFlagName = flagNotice.holderGuild
		this._UpdateFlagTimeLabel(flagNotice.holderGuild, flagNotice.holderName, Math.max(flagNotice.overTime - GameServer.serverTime, 0))
	}

	clearTimeBar() {
		this.bloodBar.maximum = 1
		this.bloodBar.value = 1
	}

	// hudunChange(cur, max) {
	// 	this.hudun.maximum = max
	// 	this.hudun.value = cur
	// 	this.hudun.labelFunction = function () {
	// 		return Math.ceil(100 * cur / max) + "%"
	// 	}
	// }

	runTime() {
		if (GuildWar.ins().GetFlagStatu() == GuildWarFlagState.NONE) {
			this.timeDesc.text = DateUtils.format_5(GuildWar.ins().GetFlagStartSurplusTime()) + GlobalConfig.jifengTiaoyueLg.st101560;//"秒后可采集"
		} else if (GuildWar.ins().GetFlagStatu() == GuildWarFlagState.GATHER) {
			this.timeDesc.text = GuildWar.ins().GetFlagName() + ` ${GlobalConfig.jifengTiaoyueLg.st101561}.....`;
			this.bloodBar.value = GuildWar.ins().GetFlagSurplusTime()
			// var e = "<font color = '#FFB82A'>" + GuildWar.ins().GetFlagName() + "</font>采集皇旗中（<font color = '#00FF00'>" + DateUtils.GetFormatSecond(GuildWar.ins().GetFlagSurplusTime(), 5) + "</font>）";
			// this.flagTime.textFlow = (new egret.HtmlTextParser).parser(e)
			// this.guildName1.text = "公会：" + GuildWar.ins().GetFlagGuild()
			// this._UpdateFlagTimeLabel( GuildWar.ins().GetFlagGuild(),  GuildWar.ins().GetFlagName(), GuildWar.ins().GetFlagSurplusTime() )
		} else {
			TimerManager.ins().remove(this.runTime, this)
		}
		this.hudun.maximum = 100
		this.hudun.value = GuildWar.ins().GetHudunRate()
	}

	private _UpdateFlagTimeLabel(guildName: string, name: string, time: number) {
		var e = "<font color = '#FFB82A'>" + name + "</font>" + GlobalConfig.jifengTiaoyueLg.st101562 + "（<font color = '#00FF00'>" + DateUtils.GetFormatSecond(time, 5) + "</font>）";
		this.flagTime.textFlow = (new egret.HtmlTextParser).parser(e)
		this.guildName1.text = GlobalConfig.jifengTiaoyueLg.st100850 + guildName
	}

	onTap(e) {
		switch (e.currentTarget) {
			case this.playNext:
				// if ("" != GuildWar.ins().GetKillName()) {
				// 	UserTips.ErrorTip("复活状态，不能切换地图");
				// 	return
				// }
				if (GuildWar.ins().getIntoNextMapGongxun() > GuildWar.ins().GetGongxun()) {
					UserTips.ErrorTip(GlobalConfig.jifengTiaoyueLg.st101563);//"战功不满足条件，不能进入下一层"
					return
				}
				if (!GuildWar.ins().IsDoorDie()) {
					UserTips.ErrorTip(GlobalConfig.jifengTiaoyueLg.st101564);//击破城门后可进入下一关
					return
				}
				ViewManager.ins().open(GuileWarReliveWin, 1)
				break;
			case this.seeRank:
				if (GuildWar.ins().kFisWatStart)
					ViewManager.ins().open(KFseeRankBgWin);
				else
					ViewManager.ins().open(GuildWarRewardPanel);
				break;
			case this.seeMyGuild:
				ViewManager.ins().open(GuildWarMemWin);
				break;
			case this.btn:
				"down" == this.btn.currentState ? this.list1.dataProvider = new eui.ArrayCollection([]) : this.refushcanPlayList();
				break;
			case this.palaceFlag:
				GuildWarFlagState.NONE != GuildWar.ins().GetFlagStatu() ? GuildWar.ins().SendGetFlag() : UserTips.ErrorTip(GlobalConfig.jifengTiaoyueLg.st101565);
				break;
			case this.mon:
				if (this.clickEffc) {
					this.clickEffc.visible = true;
					this.clickEffc.loadUrl(ResDataPath.GetUIEffePath("tapCircle"), !0, 1)
				}
				GuildWar.ins().SendAttackMonster()
				this.guid.visible = false
				break;
			// case this.help:
			// 	ViewManager.ins().open(ZsBossRuleSpeak, 7);
			// 	break;
			case this.ruleDesc:
				ViewManager.ins().open(GuildWarRulesWin);
				break;
			case this.taskTraceBtn:
				if (GuildWar.ins().CanReward()) {
					GuildWar.ins().SendPointGuildWar()
				}
				break;
			// case this.guid2:
			// 	break
			// ViewManager.in
			// App.ViewManager.open(ViewConst.GuildwarTipsPanel)
		}
	}
	listTap(e) {
		if (e.target.parent instanceof GuildWarMemberHeadRender) {
			var parent = e.target.parent;
			if (parent.showEffect(), !GuildWar.ins().CanClick()) return;
			let data = parent.data as Sproto.gdwar_targeter

			if (GuildWar.ins().GetFlagAcId() == GameGlobal.actorModel.actorID) {
				WarnWin.show(GlobalConfig.jifengTiaoyueLg.st101566, function () {
					GuildWar.ins().SendAttackPlayer(data.actorId)
					EntityManager.ins().showHideSomeOne(data.actorId)
				}, this);
				return
			}
			GuildWar.ins().SendAttackPlayer(data.actorId)
			this.guid.visible = false
			if (GuildWar.ins().GetAttHandle() != data.actorId) {
				EntityManager.ins().showHideSomeOne(data.actorId)
			}
		}
	}

	clearRendererItem() {
		for (var e = this.list1.numChildren, t = 0; e > t; t++) {
			var i = this.list1.getChildAt(t) as GuildWarMemberHeadRender
			i.clearEffect()
		}
		e = this.list2.numChildren;
		for (var t = 0; e > t; t++) {
			var i = this.list2.getChildAt(t) as GuildWarMemberHeadRender
			i.clearEffect()
		}
	}
}

window["GuildWarInfoPanel"] = GuildWarInfoPanel