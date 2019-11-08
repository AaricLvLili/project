class PlayFunView extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_HUD;

	private static ICON_EXPJADE = "cy_yu_png"
	public static ICON_ZS_BOSS = "cy_zhuan_png"
	public static ICON_MINE = "cy_kuang_png"
	public static ICON_DARTCAR = "cy_biao_png"
	public static readonly ICON_GUILD_BOSS = "cy_bang_png"
	public static readonly ICON_GUILD_RED_GUILD = "cy_hongbao_png"
	public static readonly ICON_ONHOOK = "cy_gua_png";
	public static readonly ICON_TEAM = "cy_team_png";

	touchEnabled = false;
	ruleList: RuleIconBase[] = [];
	ruleEff: { [key: number]: MovieClip } = {};

	private tipGroup: eui.DataGroup
	private tipGroupList: eui.ArrayCollection;

	public guanqiaBtn: eui.Button;
	public autoPkBoss: eui.ToggleButton;

	public taskBtn: eui.Button;//日常
	private mailBtn: eui.Button;

	private activityBtn: eui.Button;
	/**公会战*/
	private guildWar: eui.Button;
	/**转生BOSS*/
	private zsboss: eui.Button;
	/**双倍挖矿*/
	private sbwakuang: eui.Button;
	/**双倍运镖*/
	private sbDartCar: eui.Button;
	/**世界BOSS*/
	private worldBoss: eui.Button;
	public ringIcon: eui.Group;
	private actWIcon: eui.Button;
	/**合服活动*/
	private hfhdIcon: eui.Button;
	/**天降豪礼*/
	private tjhlIcon: eui.Button;
	/**转职任务*/
	public zhuanZhiTask: eui.Group;
	private btnYbTurntable: eui.Button
	/** 今日目标*/
	private dayTarget: eui.Group;
	/**一元有礼 */
	public oneMoneyBtn: eui.Button;
	/** 分享*/
	private shareBtn: eui.Button;//分享
	/**勇者 */
	public heroBattle: eui.Button;
	public omGifBagBtn: eui.Button;
	public warOrderBtn: eui.Button;

	public taskTraceBtn: eui.Group;
	private taskTraceName: eui.Label;
	private taskTraceAwards: eui.Label;
	private gold01: eui.Image;
	private pkRobTipGroup: eui.Group
	private pkRobTipLabel: eui.Label
	public shopBtn: eui.Button;
	public m_BagMainBtn: eui.Button;
	public CDkey: eui.Button;
	public monthCard: eui.Button;
	private willBossPrompt: eui.Image;
	/**幸运礼包 */
	private m_LuckIcon: eui.Group;
	private groupIcon: eui.Group;


	private groupBagTips: eui.Group;
	private bagTips: eui.Label;
	private isExitUsedItem: boolean;
	private isItemCountChange: boolean;
	private groupRight: eui.Group

	public m_GoNextLayerGroup: eui.Group;
	public m_GoNextLayerLab: eui.Label;
	private growUpBtn: eui.Group//传世之路

	private dayBuy302: eui.Button//每日直购

	public groupTopKF: eui.Group;
	public firstRechargeBtn: eui.Button;
	public m_StrongBtn: eui.Button;

	private NoticeBubbleConfig: any;
	/**剧情引导用的一个组 */
	public m_JQGuideGroup: eui.Group;

	public m_SCAnim: SCAnim;

	public m_PKBtn: eui.Button;
	public m_BossBtn: eui.Button;
	public m_FbBtn: eui.Button;

	public m_IconControl: eui.Image;
	public isIconOpen: boolean = true;
	public groupLeftGroup: eui.Group;
	public m_BelowGroup: eui.Group;
	public m_ChaosBattleBtn: eui.Group;
	public m_IconControlRedPoint: eui.Image;
	public CouponTreBtn: eui.Button;

	public constructor() {
		super();
	}
	destoryView() {
	};
	public createChildren() {
		super.createChildren();
		this.playSound();
	}
	initUI() {
		super.initUI()
		this.skinName = "MainPlayFunViewSkin";
		this.m_SCAnim.release();
		if (Main.isLiuhai) {
			this.groupIcon.top = 40
			this.navigateToBtn.y += 40;
			this.navigateToPanel.y += 40;
		}
		this.m_IconControlRedPoint.visible = false;
		this.guanqiaBtn["guangqiabar"].value = 0;
		RuleIconBase.thisUpdate = this.updateRuleAndSort;
		RuleIconBase.thisObj = this;
		this.m_GoNextLayerGroup.visible = false;
		this.isExitUsedItem = false;
		this.isItemCountChange = false;
		this.ruleList[this.m_PKBtn.hashCode] = new LadderBtnIconRule(this.m_PKBtn);
		this.ruleList[this.m_BossBtn.hashCode] = new BossIconRule(this.m_BossBtn);
		this.ruleList[this.m_FbBtn.hashCode] = new FbBtnIconRule(this.m_FbBtn);
		this.ruleList[this.m_StrongBtn.hashCode] = new StrongIconRule(this.m_StrongBtn);
		this.ruleList[this.guanqiaBtn.hashCode] = new GuangqiaIconRule(this.guanqiaBtn);

		this.ruleList[this.taskTraceBtn.hashCode] = new TaskTraceIconRule(this.taskTraceBtn);
		this.ruleList[this.activityBtn.hashCode] = new ActivityIconRule(this.activityBtn)
		this.ruleList[this.actWIcon.hashCode] = new ActivityWIconRule(this.actWIcon)
		this.ruleList[this.hfhdIcon.hashCode] = new ActivityHfhdIconRule(this.hfhdIcon)
		this.ruleList[this.tjhlIcon.hashCode] = new ActivityTjhlIconRule(this.tjhlIcon)
		this.ruleList[this.firstRechargeBtn.hashCode] = new FirstRechargeIconRule(this.firstRechargeBtn)
		this.ruleList[this.btnYbTurntable.hashCode] = new YbTurntableIconRule(this.btnYbTurntable)
		this.ruleList[this.guildWar.hashCode] = new GuildWarIconRule(this.guildWar)
		this.ruleList[this.ringIcon.hashCode] = new RingIconRule(this.ringIcon)
		this.ruleList[this.monthCard.hashCode] = new MonthCardIconRule(this.monthCard)
		this.ruleList[this.dayTarget.hashCode] = new DayTargetIconRult(this.dayTarget);
		this.ruleList[this.zsboss.hashCode] = new ZsBossIconRule(this.zsboss);
		this.ruleList[this.sbwakuang.hashCode] = new DoubleMiningIconRule(this.sbwakuang);
		this.ruleList[this.sbDartCar.hashCode] = new DoubleDartCarIconRule(this.sbDartCar);
		this.ruleList[this.worldBoss.hashCode] = new WorldBossIconRule(this.worldBoss);
		this.ruleList[this.zhuanZhiTask.hashCode] = new ZhuanZhiTaskIconRule(this.zhuanZhiTask);

		this.ruleList[this.m_LuckIcon.hashCode] = new LuckIconRule(this.m_LuckIcon);
		this.ruleList[this.shareBtn.hashCode] = new ShareIconRule(this.shareBtn);

		this.ruleList[this.taskBtn.hashCode] = new DaliyTaskIconRule(this.taskBtn);
		this.ruleList[this.growUpBtn.hashCode] = new GrowUpRoadconRule(this.growUpBtn);
		this.ruleList[this.oneMoneyBtn.hashCode] = new ActivityOneMoneyRule(this.oneMoneyBtn)
		this.ruleList[this.dayBuy302.hashCode] = new DayBuy302IconRule(this.dayBuy302)
		this.ruleList[this.heroBattle.hashCode] = new ActivityHearoBattleRule(this.heroBattle)
		this.ruleList[this.omGifBagBtn.hashCode] = new OmGifBagRule(this.omGifBagBtn)
		this.ruleList[this.m_ChaosBattleBtn.hashCode] = new ChaosBattleRule(this.m_ChaosBattleBtn)
		this.ruleList[this.warOrderBtn.hashCode] = new WarOrderRule(this.warOrderBtn)
		this.ruleList[this.CouponTreBtn.hashCode] = new CouponTreIconRule(this.CouponTreBtn)
		for (var key in this.ruleList) {
			let ruleIcon = this.ruleList[key]
			if (ruleIcon && ruleIcon.parentGpuop) {
				ruleIcon.layerCount = ruleIcon.parentGpuop.getChildIndex(ruleIcon.tar)
			}
		}
		this.tipGroup.itemRenderer = PlayFunTipBtn
		this.tipGroupList = new eui.ArrayCollection();
		this.tipGroup.dataProvider = this.tipGroupList;
		if (StartGetUserInfo.isOne) {
			if (this.shouchongTIP.stage) {
				DisplayUtils.removeFromParent(this.shouchongTIP);
			}
			if (this.huobanTip.stage) {
				DisplayUtils.removeFromParent(this.huobanTip);
			}
		}

		this.navigateToInit();
	};

	openShouchong() {
		if (UserFb.ins().CheckFb() && !GuideUtils.ins().isShow()) {
			if (!WxSdk.ins().isHidePay())
				ViewManager.ins().open(Recharge1GetWin)
			PlayFun.ins().sendAutoOpen();
		}
	}
	public get _ruleList() {
		return this.ruleList
	}

	open() {
		this.addChangeEvent(this, this.onChange, this.autoPkBoss)
		this.addTouchEvent(this, this.onTap, this.guanqiaBtn)
		this.addTouchEvent(this, this.onTap, this.activityBtn)
		this.addTouchEvent(this, this.onTap, this.dayTarget);
		this.addTouchEvent(this, this.onTap, this.heroBattle);
		this.addTouchEvent(this, this.onTap, this.m_ChaosBattleBtn);
		this.addTouchEvent(this, this.onTap, this.ringIcon)
		this.addTouchEvent(this, this.onTap, this.zhuanZhiTask);
		this.addTouchEvent(this, this.onTap, this.oneMoneyBtn);

		this.AddClick(this.navigateToBtn, this.onTap);
		this.AddClick(this.willBossPrompt, this.onTap);
		this.AddClick(this.m_GoNextLayerGroup, this.onClickGoNextLayer)
		this.AddClick(this.groupIcon, this._onTouchIcon)

		this.AddClick(this.m_IconControl, this.onClcikIconControl);
		this.observe(MessageDef.BAG_ITEM_COUNT_CHANGE, this.showforgeBtnRedPoint)
		this.observe(MessageDef.BAG_WILL_FULL, this.setBagTips); //背包是否即将满
		this.observe(MessageDef.BAG_HAS_ITEM_CAN_USE, this.setIsExitUsedItem); //背包是否即将满
		this.observe(MessageDef.ITEM_COUNT_CHANGE, this.updateTaskPoint)
		this.observe(MessageDef.ACTOR_PRESTIGE_UPDATE, this.updateTaskPoint);
		this.observe(MessageDef.RAID_KILL_MONSTER_COUNT, this.upDataGuanqia);
		this.observe(GameLogic.ins().postLevelChange, this.levelChange);
		this.observe(UserTask.postUpdteTaskTrace, this.changeTaskTrace);
		this.observe(MessageDef.ENCOUNTER_PLAYER_ROB, this.UpdateEncounterRobState)
		this.observe(MessageDef.ZS_BOSS_OPEN, this._UpdateZsBossTip)
		this.observe(MessageDef.MINE_STATU_CHANGE, this._UpdateTipGroup)
		this.observe(MessageDef.DARTCAR_STATU_CHANGE, this._UpdateTipGroup)
		this.observe(ZsBoss.ins().postBossList, this._UpdateTipGroup);
		this.observe(MessageDef.GUILD_BOSS_OPEN_INFO, this._UpdateTipGroup);
		this.observe(MessageDef.GUILDWAR_REDBAGINFO_CHANGE, this._UpdateTipGroup);
		this.observe(MessageDef.AUTO_OPENSHOUCHONG_COMPLET, this.openShouchong);
		this.observe(MessageDef.GUANQIA_CHANGE, this.checkQuanQiaCanGoNext);
		this.observe(MessageDef.GUIDE_ADDEQUIP_END, this.checkLastAddEquipGuide);
		this.observe(UserFb.ins().postGuanKaIdChange, this.evtChangeGuanQia);
		this.observe(MessageDef.LUCKGIFTBAG_DATA_UPDATE, this.startUpdateRule);
		this.observe(MessageDef.PUBLIC_BOSS_REBIRTHT_TIPS, this.publicBossRebirthtTips)
		this.observe(MessageDef.ACTIVITY_IS_AWARDS, this.startUpdateRule);
		this.observe(MessageDef.REDPOINT_NAVIGATE_UPDATE, this.navigateToUpdate)
		this.observe(TeamFbEvt.TEAMFB_UPDATE_DATA, this._UpdateTipGroup);
		this.observe(MessageDef.AUTO_OPENSHOUCHONGANIM_COMPLET, this.openAnim);
		this.observe(OmgGifBagEvt.OMGGIFBAG_UPDATE, this.startUpdateRule);
		this.observe(ChaosBattleEvt.CHAOSBATTLE_DATAUPDATE_MSG, this.startUpdateRule);
		this.observe(WarOrderEvt.WARORDEREVT_DATAUPDATE_MSG, this.startUpdateRule)
		this.upDataGuanqia();
		this.changeTaskTrace();
		this.updateTaskPoint();

		this.addRuleEvent();
		this.startUpdateRule()
		this.upDataWillBoss();
		this.UpdateEncounterRobState()

		this.changeGuanQia();
		if (FuncOpenModel.SAVE_DATA_FALG) {
			var timeoutValue1 = egret.setTimeout(() => {
				egret.clearTimeout(timeoutValue1);
				if (!FuncOpenModel.SAVE_DATA_FALG) {
					return
				}
				if (ViewManager.ins().isShow(PlayFunView)) {
					FuncOpenModel.SAVE_DATA_FALG = false
					ViewManager.ins().open(ChargeFirstWin)
				}
			}, this, 500)
		}
		this.isopenTime(0);

		if (PlayFun.ins().autoOpenShouChong == 1) {
			if (!WxSdk.ins().isHidePay())
				ViewManager.ins().open(Recharge1GetWin)
			PlayFun.ins().sendAutoOpen();
		}

		//关闭BOSS界面
		let viewBoss = <PlayFunView>ViewManager.ins().getView(BossBloodPanel)
		if (viewBoss) ViewManager.ins().close(BossBloodPanel)
		this.publicBossRebirthtTips();
		this.addTime();
	};

	private addTime() {
		this.removeRuleTime();
		TimerManager.ins().doTimer(1000, 0, this.upDateRuleTime, this);
	}
	private removeRuleTime() {
		TimerManager.ins().remove(this.upDateRuleTime, this);
	}


	//---------气泡
	xunbaoTip  //寻宝
	xunbaoTipLabel
	shenqiTip  //神器
	shenqiLabel
	huobanTip  //伙伴
	huobanTipsLabel
	shouchongTIP  //首充
	shouchongTIPLabel
	t_num = [0, 0, 0, 0]   //执行次数
	private isopen = false; //是否开启

	private isopenTime(n) {
		GameGlobal.rolesModel.length < 2 ? this.isopen = true : (
			Recharge.ins().getFirstRechargeState() ? this.isopen = true : this.isopen = false
		)
		if (this.isopen) {
			if (n == 0) {
				for (let i = 0; i < 4; i++) {
					this.creatqipao(i + 1)
				}
			} else {
				this.creatqipao(n)
			}
		}
	}

	creatqipao(i) {
		if (this.NoticeBubbleConfig == null)
			this.NoticeBubbleConfig = GlobalConfig.ins("NoticeBubbleConfig");
		let qipaoConfig = this.NoticeBubbleConfig;
		switch (i) {
			case 1:
				//if (this.treasureHuntBtn.parent != null) {
				// if (this.t_num[i - 1] == 0) {
				// 	this.t_num[i - 1]++
				// 	this.creatTime(qipaoConfig[i].time, 1, this.xunbaoTipfun, this);
				// } else {
				// 	this.creatTime(qipaoConfig[i].rate, 1, this.xunbaoTipfun, this);
				// }
				//}
				break;
			case 4:
				// if (Recharge.ins().getFirstRechargeState()) {
				// 	if (this.t_num[i - 1] == 0) {
				// 		this.t_num[i - 1]++
				// 		this.creatTime(qipaoConfig[i].time, 1, this.shenqiTipfun, this);
				// 	} else {
				// 		this.creatTime(qipaoConfig[i].rate, 1, this.shenqiTipfun, this);
				// 	}
				// }
				break;
			case 3:
				// if ( GameGlobal.rolesModel.length < 2) {
				// 	if (this.t_num[i - 1] == 0) {
				// 		this.t_num[i - 1]++
				// 		this.creatTime(qipaoConfig[i].time, 1, this.huobanTipfun, this);
				// 	} else {
				// 		this.creatTime(qipaoConfig[i].rate, 1, this.huobanTipfun, this);
				// 	}
				// }
				break;
			case 2:
				if (Recharge.ins().getFirstRechargeState()) {//Recharge.ins().ToDayRechargeState() == 1
					if (this.t_num[i - 1] == 0) {
						this.t_num[i - 1]++
						this.creatTime(qipaoConfig[i].time, 1, this.shouchongTIPfun, this);
					} else {
						this.creatTime(qipaoConfig[i].rate, 1, this.shouchongTIPfun, this);
					}
				}
				break;
		}
	}
	private creatTime(time, tnum, fun, tar) {
		TimerManager.ins().doTimer(time * 500, tnum, fun, tar);
	}
	private xunbaoTipfun() {
		this.xunbaoTip.visible = true;
		if (this.NoticeBubbleConfig == null)
			this.NoticeBubbleConfig = GlobalConfig.ins("NoticeBubbleConfig");
		this.xunbaoTipLabel.text = this.NoticeBubbleConfig[1].content
		this.creatTime(this.NoticeBubbleConfig[1].lasttime, 1, this.closexunbaoTipfun, this)
		this.isopenTime(1)
	}
	private shenqiTipfun() {
		if (this.NoticeBubbleConfig == null)
			this.NoticeBubbleConfig = GlobalConfig.ins("NoticeBubbleConfig");
		this.shenqiTip.visible = true;
		this.shenqiLabel.text = this.NoticeBubbleConfig[4].content
		this.creatTime(this.NoticeBubbleConfig[4].lasttime, 1, this.closeshenqiTipfun, this)
		this.isopenTime(4)
	}
	private huobanTipfun() {
		if (this.NoticeBubbleConfig == null)
			this.NoticeBubbleConfig = GlobalConfig.ins("NoticeBubbleConfig");
		this.huobanTip.visible = true;
		this.creatTime(this.NoticeBubbleConfig[3].lasttime, 1, this.closehuobanTipfun, this)
		this.isopenTime(3)
	}
	private shouchongTIPfun() {
		if (this.NoticeBubbleConfig == null)
			this.NoticeBubbleConfig = GlobalConfig.ins("NoticeBubbleConfig");
		this.shouchongTIP.visible = !WxSdk.ins().isHidePay()
		this.shouchongTIPLabel.text = this.NoticeBubbleConfig[2].content
		let pos: egret.Point = this.firstRechargeBtn.localToGlobal()
		this.shouchongTIP.y = pos.y + 10;
		this.creatTime(this.NoticeBubbleConfig[2].lasttime, 1, this.closeshouchongTIPfun, this)
		this.isopenTime(2)
	}
	private closexunbaoTipfun() {
		this.xunbaoTip.visible = false
	}
	private closeshenqiTipfun() {
		this.shenqiTip.visible = false
	}
	private closehuobanTipfun() {
		this.huobanTip.visible = false
	}
	private closeshouchongTIPfun() {
		this.shouchongTIP.visible = false
	}

	private closeTipIndex() {   //关闭所有气泡提示
		this.xunbaoTip.visible = false
		this.shenqiTip.visible = false
		this.huobanTip.visible = false
		this.shouchongTIP.visible = false
	}
	//--------气泡
	close() {
		this.closeTipIndex()
		this.removeObserve()
		this.removeEvents()
		this.removeRuleEvent();
		this._ClearEncounterRobStateTimer()
		TimerManager.ins().removeAll(this)
		this.removeRuleTime();
		for (var key in this.ruleEff) {
			DisplayUtils.dispose(this.ruleEff[key]);
			this.ruleEff[key] = null;
		}
		this.ruleEff = {};
		this.guanqiaBtn["guangqiabar"].mask = null
		this.guanqiaBtn["guangqiabar"].visible = false
		this._checkFinger(this.taskTraceBtn, false)
		this._curGuanqiaID = null;
		this.isShowRebirthtTips(false);
	};
	private _onTouchIcon(e: egret.TouchEvent) {
		if (this.ruleList[e.target.hashCode]) {
			this.ruleList[e.target.hashCode].tapExecute();
		}
	}
	private _ClearEncounterRobStateTimer() {
		this.pkRobTipGroup.visible = false
		Encounter.ins().mPlayerRobInfo = null
		TimerManager.ins().remove(this._ClearEncounterRobStateTimer, this)
	}

	private UpdateEncounterRobState() {
		this.pkRobTipGroup.visible = false
		let info = Encounter.ins().mPlayerRobInfo
		if (!info) {
			return
		}
		this.pkRobTipGroup.visible = true
		TimerManager.ins().remove(this._ClearEncounterRobStateTimer, this)
		TimerManager.ins().doTimer(5000, 1, this._ClearEncounterRobStateTimer, this)
		let cfg = GlobalConfig.itemConfig[info.itemId || 600001]
		this.pkRobTipLabel.textFlow = (new egret.HtmlTextParser).parser(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101415, [info.name, ItemBase.QUALITY_COLOR_STR[cfg.quality], cfg.name]))
	}

	addRuleEvent() {
		var rule;
		for (var i in this.ruleList) {
			rule = this.ruleList[i];
			if (rule.updateMessage) {
				rule.addEvent();
			}
		}
	};
	removeRuleEvent() {
		for (var _i = 0, _a = this.ruleList; _i < _a.length; _i++) {
			var rule = _a[_i];
			if (rule && rule.updateMessage) {
				for (var j = 0; j < rule.updateMessage.length; j++) {
					rule.removeEvent();
				}
			}
		}
	};
	private sortBtnList() {
		let value = 0;
		for (let i = 0, len = this.groupRight.numChildren; i < len; i++) {
			let item = this.groupRight.getChildAt(i) as eui.Button
			if (item.visible == true) {
				item.bottom = value
				value += 63
			}
		}
		this._sortGroupBtn()
	}
	private _sortGroupBtn(): void {
		let value = 0;
		for (let i = 0, len = this.groupTopKF.numChildren; i < len; i++) {
			let item = this.groupTopKF.getChildAt(i) as eui.Button
			if (item.visible == true) {
				item.left = value
				value += 58
			}
		}
	}

	startUpdateRule() {

		for (var i in this.ruleList) {
			this.updateRule(this.ruleList[i]);
		}
		//排序按钮
		this.sortBtnList();
		this.upDataWillBoss();
	};
	private time: number = 10;
	private upDateRuleTime() {
		this.time++;
		if (this.time >= 10) {
			this.time = 0;
			this.startUpdateRule();
		}
		for (var i in this.ruleList) {
			this.ruleList[i].onTimer();
		}
	}

	updateRuleAndSort(rule: RuleIconBase) {
		this.updateRule(rule);
		// //排序按钮
		this.sortBtnList();

	};

	updateRule(rule: RuleIconBase) {
		if (rule == null || rule.tar == null) return;
		var tar = rule.tar;
		var isShow = rule.checkShowIcon();
		var effName;
		var mc;
		var count;
		var icon: string = tar.icon;
		if (rule instanceof GrowUpRoadconRule) {
			if (isShow == true) {
				this.groupTopKF.left = 94
				this.groupTopKF.layout["requestedColumnCount"] = 4;
			} else {
				this.groupTopKF.left = 5
				this.groupTopKF.layout["requestedColumnCount"] = 5;
			}
		}
		if (isShow) {
			// 显示图标
			if (tar != this.guanqiaBtn && GuideUtils.ins().isShow() == false) {
				rule.parentGpuop.addChildAt(tar, rule.layerCount)
				tar.visible = true;
			}
			if (tar instanceof eui.Group && tar.name == "luckIcon") {
				let numChilid = tar.numChildren
				for (var i = 0; i < numChilid; i++) {
					let child = tar.getChildAt(i);
					if (child.name == "redPoint") {
						child.visible = rule.checkShowRedPoint();
					}
				}
			}
			if (tar['redPoint']) {
				if (icon == "ui_zjm_icon_fl")
					count = this.fuliRedPoint();
				else
					count = rule.checkShowRedPoint();
				UIHelper.ShowRedPoint(tar, count)
				if (tar['count']) {
					tar['count'].text = count ? count : "";
				}
			}
			if (GameGlobal.actorModel.level >= 3) {
				effName = rule.getEffName(count);
				if (effName) {
					if (!this.ruleEff[tar.hashCode] || !this.ruleEff[tar.hashCode].parent) {
						mc = this.getEff(tar.hashCode, effName);
						mc.x = rule.effX;
						mc.y = rule.effY;
						let scale = (tar == this.guanqiaBtn || tar == this.taskTraceBtn) ? 1.1 : .69;
						mc.scaleX = mc.scaleY = scale
						// let index = (tar != this.funcOpenGroup && tar != this.guanqiaBtn && tar != this.m_LuckIcon) ? 1 : 2;
						let index = (tar != this.guanqiaBtn && tar != this.m_LuckIcon) ? 1 : 2;
						tar.addChildAt(mc, index);
					}
					else {
						this.ruleEff[tar.hashCode].play(-1);
					}
				}
				else {
					DisplayUtils.removeFromParent(this.ruleEff[tar.hashCode]);
				}
			}
		}
		else {
			rule.DestoryMc()
			DisplayUtils.removeFromParent(tar);
			DisplayUtils.removeFromParent(this.ruleEff[tar.hashCode]);
		}
	};

	getEff(value, effName) {
		if (this.ruleEff[value])
			return this.ruleEff[value];
		this.ruleEff[value] = this.ruleEff[value] || new MovieClip();
		this.ruleEff[value].touchEnabled = false
		if (effName) {
			if (GameGlobal.actorModel.level >= 3) {
				this.ruleEff[value].loadUrl(ResDataPath.GetUIEffePath(effName), true, -1);
			}
		}
		return this.ruleEff[value];
	};
	/**
	 * 显示关卡引导
	 * @returns void
	 */
	showGuanQiaGuide() {
		if (!ViewManager.ins().isShow(PlayFunView)) return;
		if (LayerManager.UI_Main_2.numChildren > 0) {
			return
		}
		// 前4个关卡 + 可以打 + 没打过
		if (UserFb.ins().guanqiaID <= 1 && UserFb.ins().isShowBossPK()
			&& !UserFb.ins().bossIsChallenged && !GuideUtils.ins().isShow()) {
			var w = ViewManager.ins().getView(GuanQiaWin);
			if (!w || (w && w.isShow() == false)) {
				Setting.currPart = 1;
				Setting.currStep = 0;
				if (!WelcomeWin.isOpen) {
					GuideUtils.ins().show(this.guanqiaBtn, 1, 0);
				}
			}
		}
	};

	public ShowGuanqiaAuto() {
		if (!ViewManager.ins().isShow(PlayFunView)) return;
		if (LayerManager.UI_Main_2.numChildren > 0) {
			return false
		}
		if (GameMap.IsNoramlLevel() && UserFb.ins().guanqiaID == GuideQuanQiaType.OnHook && this.autoPkBoss.selected == false) {
			Setting.currPart = 9;
			Setting.currStep = 0;
			GuideUtils.ins().show(this.autoPkBoss, 9, 0);
		}
	}

	onChange(e) {
		if (UserFb.ins().guanqiaID < GuideQuanQiaType.OnHook) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101920);
			this.autoPkBoss.selected = false;
		}
		else if (this.autoPkBoss.selected) {
			if (UserBag.ins().getSurplusCount() < UserBag.BAG_ENOUGH) {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101919);
				this.autoPkBoss.selected = false;
			}
		}
		GuideUtils.ins().next(this.autoPkBoss);
	};
	levelChange() {
		this._UpdateTipGroup()
	};

	private _GetContentIndex(item, list: any[]): number {
		for (let i = list.length - 1; i >= 0; --i) {
			if (item == list[i]) {
				return i
			}
		}
		return -1
	}

	onTap(e) {
		this.closeTipIndex();
		if (this.ruleList[e.currentTarget.hashCode]) {
			this.ruleList[e.currentTarget.hashCode].tapExecute();
			return;
		}
		switch (e.currentTarget) {
			case this.willBossPrompt:
				if (Encounter.ins().refreshCd > 0)
					UserTips.InfoTip(GlobalConfig.jifengTiaoyueLg.st101416);
				else
					if (Encounter.ins().zyKeyId > 0)
						ViewManager.ins().open(WildBossWin);
				break;
			case this.navigateToBtn:
				var tempScale;
				var tempEase;
				var tempV;
				if (this.navigateToPanel.scaleX == 1) {
					tempScale = 0;
					tempEase = egret.Ease.backIn
					tempV = function () { this.navigateToPanel.visible = false }
				} else {
					tempScale = 1;
					tempEase = egret.Ease.backOut
					this.navigateToPanel.visible = true;
					tempV = function () { }
				}
				//创建 Tween 对象
				egret.Tween.get(this.navigateToPanel, {
					loop: false
				}).to({ scaleX: tempScale }, 300, tempEase).call(tempV, this)
				break;
		}
	};

	updateTaskPoint() {
		UIHelper.ShowRedPoint(this.taskBtn, UserTask.ins().CheckAllVitalityReward()
			|| PrestigeModel.CheckRedPoint());
		this._UpdateTipGroup()
	};
	/**设置红点显示 */
	private fuliRedPoint() {
		return MoneyTreeModel.ins().isHaveReward() || FindAssetsModel.ins().HasFindAssets() || DayLoginIconRule.ShowRedPoint() || ActivityModel.ins().checkMonthSingRedPoint()
	}

	private m_TaskXPos = null
	changeTaskTrace() {
		var data = UserTask.ins().taskTrace;
		if (data) {
			this.taskTraceBtn.visible = true
			var config = UserTask.ins().getAchieveConfById(data.id);
			if (config) {
				this.taskTraceAwards.text = "" + config.desc;
				switch (data.state) {
					case 0:
						this.taskTraceName.textFlow = TextFlowMaker.generateTextFlow(config.name + "|C:0x00ff00&T:(" + data.value + "/" + config.target + ")|");
						break;
					case 1:
						this.taskTraceName.textFlow = TextFlowMaker.generateTextFlow(config.name + GlobalConfig.jifengTiaoyueLg.st101417);
						break;
				}
			}
			if (!this.m_TaskXPos) {
				this.m_TaskXPos = this.taskTraceName.x
			}
			var t = egret.Tween.get(this.taskTraceAwards);
			t.to({ "x": this.m_TaskXPos + 100, "alpha": 0 }, 200).to({ "x": 0 }, 200).to({ "x": this.m_TaskXPos, "alpha": 1 }, 200).call(() => {
				egret.Tween.removeTweens(this.taskTraceAwards);
			});
			var t1 = egret.Tween.get(this.taskTraceName);
			t1.to({ "x": this.m_TaskXPos + 100, "alpha": 0 }, 200).to({ "x": 0 }, 200).to({ "x": this.m_TaskXPos, "alpha": 1 }, 200).call(() => {
				egret.Tween.removeTweens(this.taskTraceName);
			});
		} else {
			this.taskTraceBtn.visible = false
		}
		if (data) {
			//**策划没找到地方配在转生表了 */
			let missionsId = GlobalConfig.ins("UniversalConfig").taskId;
			if (!missionsId) {
				missionsId = 0;
			}
			this._checkFinger(this.taskTraceBtn, this._isNotGuide() && data.id < missionsId && data.id != 100001)//105关前显示
		} else {
			this._checkFinger(this.taskTraceBtn, false)
		}
	};
	public _checkFinger(comp: eui.Button | eui.Group, isShow: boolean) {
		if (isShow) {
			if (!this._tweenObj[comp.hashCode]) {
				let img = comp.getChildByName("finger")
				if (!img) {
					img = new eui.Image("comp_67_71_1_png")
					img.name = `finger`
					comp.addChild(img)
					img.x = 75
					img.y = 18
				}
				egret.Tween.removeTweens(img);
				this._tweenObj[comp.hashCode] = egret.Tween.get(img, { loop: true }).to({ x: 88, y: 30 }, 200).to({ x: 75, y: 18 }, 200);
			}
		} else {
			let img = comp.getChildByName("finger")
			if (img) {
				egret.Tween.removeTweens(img);
				DisplayUtils.removeFromParent(img)
			}
			delete this._tweenObj[comp.hashCode]
		}
	}
	private _tweenObj: { [key: number]: any } = {}
	private chaptersConfig: any;


	/**
	 * @param curNum 当前波数
	 * @param totalNum 总波数
	 * @param times 倍数 
	 * return 当前亮第几颗星
	 */
	private _getCurStarIdx(curNum, totalNum, times): number {
		let idx: number

		if (curNum == 0) {
			idx = 0
		} else {
			if (totalNum < 3) {
				return curNum
			}
			let pubNum = totalNum / times
			if (curNum % times == 0) {
				idx = curNum / times
			} else {
				idx = Math.ceil(curNum / times)
			}
		}
		return idx
	}
	//波数等于2显示两颗星
	private _curGuanqiaID: number
	private _curIdx: number
	private _need: number


	upDataGuanqia() {
		var gqID = UserFb.ins().guanqiaID;
		if (gqID > 0) {
			if (this.chaptersConfig == null)
				this.chaptersConfig = GlobalConfig.ins("ChaptersConfig");

			if (this.chaptersConfig[gqID]) {
				let totalNum = this.chaptersConfig[gqID].bossNeedWave
				let curNum = UserFb.ins().killMonsterCount
				// let rad = Math.min(UserFb.ins().killMonsterCount, this.chaptersConfig[gqID].bossNeedWave) / this.chaptersConfig[gqID].bossNeedWave
				if (curNum >= totalNum) {
					TimerManager.ins().doNext(this.showGuanQiaGuide(), this);
					if (this._curGuanqiaID != gqID) {
						this._curGuanqiaID = gqID
					}
				}
			}
			else {
				Main.errorBack("关卡：" + gqID + "  数据为null");
			}
		}
	};

	/**是否在引导 */
	private _isNotGuide(): boolean {
		let view = this.getChildByName("GuideViewWeek")
		return view == null && GuideUtils.ins().isShow() == false
	}
	public upDataWillBoss(): void {
		if (Encounter.ins().refreshCd <= 0 && Encounter.ins().zyKeyId > 0 && Deblocking.Check(DeblockingType.TYPE_79, true)) {
			this.willBossPrompt.visible = true;
		} else {
			this.willBossPrompt.visible = false;
		}
	};


	private publicBossBaseConfig: any;
	private rebirthPanel: PublicBossRebirthPanel;
	/**全民boss重生提示弹窗*/
	public publicBossRebirthtTips(): void {
		if (PlayFun.ins().index <= 0) return;
		if (PlayFun.ins().noTips) return;

		if (this.rebirthPanel == null) {
			this.rebirthPanel = new PublicBossRebirthPanel(() => {
				UserBoss.ins().sendChallenge(PlayFun.ins().index);
				this.removeRebirthtTips();
			}, () => {
				this.removeRebirthtTips();
			});
			this.rebirthPanel.x = 320;
			this.rebirthPanel.y = 280;
			this.addChild(this.rebirthPanel);
		}
		this.isShowRebirthtTips(true);
		this.rebirthPanel.updata();
	}

	private isShowRebirthtTips(isShow) {
		if (this.rebirthPanel)
			this.rebirthPanel.visible = isShow;
	}

	private removeRebirthtTips(): void {
		PlayFun.ins().index = 0;
		if (this.rebirthPanel) {
			this.rebirthPanel.release();
			DisplayUtils.removeFromParent(this.rebirthPanel);
			this.rebirthPanel = null;
		}
	}

	private m_TipList: { id: number, icon: string, time: number }[] = []

	private m_UpTip = null

	private _UpdateZsBossTip(): void {
		if (ZsBoss.ins().acIsOpen == this.m_UpTip) {
			return
		}
		this.m_UpTip = ZsBoss.ins().acIsOpen
		ZsBoss.ins().sendGetBossList()
		this._UpdateTipGroup()
	}

	private jingyanyuCommonConfig: any;
	private _UpdateTipGroup(): void {
		if (this.jingyanyuCommonConfig == null)
			this.jingyanyuCommonConfig = GlobalConfig.ins("JingyanyuCommonConfig");

		this.m_TipList.length = 0
		let id = this.jingyanyuCommonConfig.fullItemID;

		if (TeamFbModel.getInstance.isInRoom) {
			this.m_TipList.push({ id: -6, icon: PlayFunView.ICON_TEAM, time: 0 })
			this.tipGroupList.removeAll();
			this.tipGroupList.replaceAll(this.m_TipList)
			this.tipGroupList.refresh();
			return
		}
		//经验玉
		if (UserBag.ins().getBagItemById(id) && GameGlobal.actorModel.level < 200 && GameGlobal.actorModel.level >= this.jingyanyuCommonConfig.openLevel && ExpjadeModel.HasUseCount() > 0) {
			this.m_TipList.push({ id: id, icon: PlayFunView.ICON_EXPJADE, time: 0 })
			this.tipGroupList.removeAll();
			this.tipGroupList.replaceAll(this.m_TipList)
			this.tipGroupList.refresh();
			return
		}

		//公会红包
		if (GuildReward.ins().IsRedPointRedBag()) {
			this.m_TipList.push({ id: -4, icon: PlayFunView.ICON_GUILD_RED_GUILD, time: 0 })
			this.tipGroupList.removeAll();
			this.tipGroupList.replaceAll(this.m_TipList)
			this.tipGroupList.refresh();
			return
		}

		// 有可以攻击的转生boss
		if (ZsBoss.ins().IsRedPoint()) {
			this.m_TipList.push({ id: -1, icon: PlayFunView.ICON_ZS_BOSS, time: 0 })
			this.tipGroupList.removeAll();
			this.tipGroupList.replaceAll(this.m_TipList)
			this.tipGroupList.refresh();
			return
		}

		//挖矿
		if (MineModel.ins().HasMine()) {
			let mtime = MineModel.ins().endTime - GameServer.serverTime;
			this.m_TipList.push({ id: -2, icon: PlayFunView.ICON_MINE, time: mtime })
		}

		//运镖
		if (DartCarModel.ins().HasDartCar()) {
			let dtime = DartCarModel.ins().endTime - GameServer.serverTime;
			this.m_TipList.push({ id: -2, icon: PlayFunView.ICON_DARTCAR, time: dtime })
		}

		//公会boss
		if (GuildBoss.ins().IsOpen()) {
			let gtime = GuildBoss.ins().GetSurplusTime();
			this.m_TipList.push({ id: -3, icon: PlayFunView.ICON_GUILD_BOSS, time: gtime })
		}

		this.m_TipList.sort(this.sortFun);
		// if (OnHookModel.ins().isOnHook()) {
		// 	let gtime = OnHookModel.ins().onhookInfo.joinTime;
		// 	this.m_TipList.push({ id: -3, icon: PlayFunView.ICON_ONHOOK, time: gtime })
		// }


		this.tipGroupList.removeAll();
		this.tipGroupList.replaceAll(this.m_TipList.length > 0 ? [this.m_TipList[0]] : [])
		this.tipGroupList.refresh();
	}

	private sortFun(aItem, bItem) {
		if (aItem.time < bItem.time)
			return -1;
		if (aItem.time > bItem.time)
			return 1;
		return 0;
	}

	public _UpdateChatPanelState() {
		PlayFunView.UpdateChatPanelState(this.taskTraceBtn)
		PlayFunView.UpdateChatPanelState(this.tipGroup)
	}

	public static UpdateChatPanelState(comp: egret.DisplayObjectContainer) {
		let state = MiniChatPanel.IsShowChat()
		comp.y = state ? 531 : 530;
	}
	public setBagTips(result) {
		this.groupBagTips.visible = result;
	};
	public setIsExitUsedItem(result) {
		this.isExitUsedItem = result;
		this.bagTips.text = (UserBag.ins().getSurplusCount() > 0) ? GlobalConfig.jifengTiaoyueLg.st101421 : GlobalConfig.jifengTiaoyueLg.st101422;
		this.setRedPiont();


	};
	public setRedPiont() {
		let view = ViewManager.ins().getView(UIView2);
		if (view instanceof UIView2) {
			if (this.isExitUsedItem || this.isItemCountChange) {
				// this.m_BagMainBtn["redPoint"].visible = true;
				view.bagBtn["redPoint"].visible = true
			}
			else {
				// this.m_BagMainBtn["redPoint"].visible = false;
				view.bagBtn["redPoint"].visible = false
			}
		}
	};
	public showforgeBtnRedPoint(b) {
		this.isItemCountChange = b;
		this.setRedPiont();
	};

	private checkQuanQiaCanGoNext() {
		let guanQiaModel = GuanQiaModel.getInstance;
		if (guanQiaModel.checkIsCanGoNextLayer()) {
			this.m_GoNextLayerGroup.visible = true;
			this.autoPkBoss.visible = false;
			let nextGuanQiaId = UserFb.ins().guanqiaID + 1;
			let nextChaptersConfig = GlobalConfig.ins("ChaptersConfig")[nextGuanQiaId];
			if (nextChaptersConfig) {
				let chaptersRewardConfig = GlobalConfig.ins("ChaptersRewardConfig")[nextChaptersConfig.mapid];
				if (chaptersRewardConfig) {
					this.m_GoNextLayerLab.text = chaptersRewardConfig.name;
				}
			}
		} else {
			this.m_GoNextLayerGroup.visible = false;
			this.autoPkBoss.visible = true;
		}
	}

	private onClickGoNextLayer() {
		ViewManager.ins().open(GuanQiaMapWin);
	}
	public guideUpgrade() {
		Setting.currPart = 1;
		Setting.currStep = 2;
		GuideUtils.ins().show(this.taskTraceBtn, 1, 2);
		this.taskTraceBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickGuide, this);
	};

	private onClickGuide() {
		GuideUtils.ins().next(this.taskTraceBtn);
		let taskBtn = this.ruleList[this.taskTraceBtn.hashCode];
		taskBtn.tapExecute();
		this.taskTraceBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickGuide, this);
	}

	public checkLastAddEquipGuide() {
		if (Setting.currPart == 1 && Setting.currStep == 5) {
			GuideUtils.ins().show(this.taskTraceBtn, 1, 5);
			this.taskTraceBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickGuide, this);
		}
	}
	private static isPlayGuide21: boolean = false;

	private evtChangeGuanQia() {
		this.changeGuanQia();
		if (GameMap.fbType == 0) {
			let guanQiaModel = GuanQiaModel.getInstance;
			if (guanQiaModel.guideConfig && guanQiaModel.guideConfig.groupId == 10) {
				// GuideUtils.ins().show(this.m_JQGuideGroup, guanQiaModel.guideConfig.groupId, 4);//屏蔽了原来剧情
			} else if (guanQiaModel.guideConfig) {
				GuideUtils.ins().show(this.m_JQGuideGroup, guanQiaModel.guideConfig.groupId, 2);
			}
		}
	}
	private changeGuanQia() {
		let guanQiaModel = GuanQiaModel.getInstance;
		let lastConfig = guanQiaModel.getLastJQGuideConfig();
		if (lastConfig) {
			if (lastConfig.param == UserFb.ins().guanqiaID) {
				Setting.currPart = lastConfig.groupId;
				Setting.currStep = 0;
				GuideUtils.ins().show(this.m_JQGuideGroup, lastConfig.groupId, 0);
			}
		}
	}
	private openAnim() {
		let num = 5 - this.groupLeftGroup.numChildren
		this.m_SCAnim.bottom = 334 - (68 * num);
		this.m_SCAnim.setData();
	}
	private playSound() {
		SoundUtils.getInstance().setBGMValume(1);
		egret.lifecycle.onResume = () => {
			let isPlay = SoundSetPanel.getSoundLocalData("soundBg");
			SoundUtils.getInstance().setMusicEnable(isPlay);
			if (isPlay) {
				SoundUtils.getInstance().setMusicEnable(true);
				if (GameMap.IsNoramlLevel()) {
					if (ViewManager.ins().isShow(MainCityView)) {
						SoundUtils.getInstance().playSound(GlobalConfig.soundConfig[3].id, -1)
					} else {
						SoundUtils.getInstance().playSound(GlobalConfig.soundConfig[1].id, -1);
					}
				}
				else {
					SoundUtils.getInstance().playSound(GlobalConfig.soundConfig[2].id, -1);
				}
			}
			let isPlay2 = SoundSetPanel.getSoundLocalData("skillSoundEff");
			if (isPlay2) {
				SoundUtils.getInstance().setEffectEnable(true);
			}
		}
		egret.lifecycle.onPause = () => {
			SoundUtils.getInstance().stopAllSound();
			SoundUtils.getInstance().setMusicEnable(false);
			SoundUtils.getInstance().setEffectEnable(false);
		}
	}

	navigateToPanel: eui.Group
	navigateToBtn: eui.Image
	navigateToGroup: eui.Group
	navigateConfig: any
	navigateItemList: Array<navigateToWxItem> = [];
	private navigateToInit() {
		if (!SdkMgr.isWxGame()) return;
		this.navigateToBtn.visible = WxSdk.ins().showNavigateTo;
		this.navigateToPanel.visible = false;

		this.navigateConfig = GlobalConfig.ins("RecommendConfig");//广告推荐表
		for (var temp in this.navigateConfig) {
			let tempItem = new navigateToWxItem();
			tempItem.init(this.navigateConfig[temp]);
			this.navigateToGroup.addChild(tempItem);
			this.navigateItemList.push(tempItem);
		}
		this.navigateToUpdate();
	}

	private navigateToUpdate() {
		var len = this.navigateItemList.length;
		var tempRedList = PlayFun.ins().getRedNavigetList();//跳转从来没有点过，如果是游戏启动,后端不传这个协议过来;如果是传null，说明是凌晨更新
		for (let i = 0; i < len; i++) {
			var temp = this.navigateItemList[i]
			if (!tempRedList || tempRedList.length == 0)
				temp.updateState(true);
			else if (-1 < tempRedList.indexOf(temp.getData().index)) {
				temp.updateState(false);
			}
		}
	}

	private onClcikIconControl() {
		if (this.isIconOpen) {
			this.changeIcon(this.growUpBtn, 0);
			this.changeIcon(this.groupRight, 0)
			this.changeIcon(this.groupLeftGroup, 0)
			this.changeIcon(this.groupTopKF, 0)
			this.changeIcon(this.m_BelowGroup, 0);
			this.changeImg(this.m_IconControl, -45)
			this.m_IconControlRedPoint.visible = true;
		} else {
			this.changeIcon(this.growUpBtn, 1);
			this.changeIcon(this.groupRight, 1)
			this.changeIcon(this.groupLeftGroup, 1)
			this.changeIcon(this.groupTopKF, 1)
			this.changeIcon(this.m_BelowGroup, 1);
			this.changeImg(this.m_IconControl, 0)
			this.m_IconControlRedPoint.visible = false;
		}
		this.isIconOpen = !this.isIconOpen
	}
	private changeImg(obj: eui.Image, num: number) {
		if (obj) {
			egret.Tween.removeTweens(obj)
			egret.Tween.get(obj).to({ rotation: num }, 150);
		}
	}
	private changeIcon(obj: any, num: number) {
		if (obj) {
			if (num == 1) {
				obj.touchEnabled = true;
				obj.touchChildren = true;
			} else {
				obj.touchEnabled = false;
				obj.touchChildren = false;
			}
			egret.Tween.removeTweens(obj)
			egret.Tween.get(obj).to({ scaleX: num, scaleY: num }, 150, egret.Ease.circIn)
		}
	}
}

class PlayFunTipBtn extends eui.ItemRenderer {
	private icon: eui.Image
	private time: eui.Label
	private jingyanyuCommonConfig: any;

	protected childrenCreated() {
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)

		GameGlobal.MessageCenter.addListener(MessageDef.MINE_UPDATE_TIME, this._UpdatTimer, this)
	}

	private _OnClick() {
		let data: { id: number, icon: string } = this.data;
		if (this.jingyanyuCommonConfig == null)
			this.jingyanyuCommonConfig = GlobalConfig.ins("JingyanyuCommonConfig");

		if (data.id == this.jingyanyuCommonConfig.fullItemID) {
			ViewManager.ins().open(ExpjadePanel)
		} else if (data.icon == PlayFunView.ICON_ZS_BOSS) {
			ViewManager.ins().open(BossWin, 3)
		} else if (data.icon == PlayFunView.ICON_MINE) {
			if (Deblocking.Check(DeblockingType.TYPE_08)) {
				ViewManager.ins().open(LadderWin, 2)
			}
		} else if (data.icon == PlayFunView.ICON_GUILD_BOSS) {
			if (GuildBoss.ins().IsOpen()) {
				ViewManager.ins().open(GuildBossReadyPanel)
			} else {
				ViewManager.ins().open(GuildBossCallPanel)
			}
		} else if (data.icon == PlayFunView.ICON_GUILD_RED_GUILD) {
			var index: number = 0;
			if ((GuildReward.ins().getRedBagType > 0)) {
				KFguildWarMainPanel.m_IsShowRedBag = true;
				GuildWarMainPanel.m_IsShowRedBag = false;
				index = 1;
			}
			else {
				KFguildWarMainPanel.m_IsShowRedBag = false;
				GuildWarMainPanel.m_IsShowRedBag = true;
				index = 0;
			}
			ViewManager.ins().open(GuildWarMainBgWin, index);
		} else if (data.icon == PlayFunView.ICON_DARTCAR) {
			ViewManager.ins().open(LadderWin, 1)
		} else if (data.icon == PlayFunView.ICON_TEAM) {
			ViewManager.ins().open(FbWin, 2);
		}
	}

	private _UpdatTimer() {
		let data: { id: number, icon: string } = this.data
		if (data.icon == PlayFunView.ICON_MINE) {
			if (MineModel.ins().exploitStatus == MineExploitType.FINISH) {
				this.time.visible = false
			} else {
				this.time.visible = MineModel.ins().HasMine() && MineModel.ins().endTime > GameServer.serverTime
				this.time.text = DateUtils.GetFormatSecond(Math.max(MineModel.ins().endTime - GameServer.serverTime, 0), 5)
			}
		} else if (data.icon == PlayFunView.ICON_GUILD_BOSS) {
			this.time.visible = GuildBoss.ins().GetSurplusTime() > 0
			this.time.text = DateUtils.GetFormatSecond(GuildBoss.ins().GetSurplusTime(), 5)
		} else if (data.icon == PlayFunView.ICON_DARTCAR) {
			if (DartCarModel.ins().exploitStatus == DartExsploitType.FINISH) {
				this.time.visible = false
			} else {
				this.time.visible = DartCarModel.ins().HasDartCar() && DartCarModel.ins().endTime > GameServer.serverTime
				this.time.text = DateUtils.GetFormatSecond(Math.max(DartCarModel.ins().endTime - GameServer.serverTime, 0), 5)
			}
		} else if (data.icon == PlayFunView.ICON_ONHOOK) {
			this.time.visible = true;
		}
	}

	public dataChanged() {
		let data: { id: number, icon: string } = this.data
		this.icon.source = data.icon
		if (data.icon == PlayFunView.ICON_MINE && MineModel.ins().HasMine() || data.icon == PlayFunView.ICON_GUILD_BOSS && GuildBoss.ins().IsOpen()) {
			this.time.visible = true
		}
		else if (data.icon == PlayFunView.ICON_DARTCAR && DartCarModel.ins().HasDartCar()) {
			this.time.visible = true
		}
		else {
			this.time.visible = false
		}
		this.time.text = ""
	}



}
window["PlayFunView"] = PlayFunView
window["PlayFunTipBtn"] = PlayFunTipBtn