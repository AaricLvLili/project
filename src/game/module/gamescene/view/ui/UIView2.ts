class UIView2 extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_NAVIGATION;

	public constructor() {
		super();
	}

	public bagBtn: eui.RadioButton;

	cityBtn: eui.RadioButton;
	forgeBtn: eui.RadioButton;
	battleBtn: eui.RadioButton;
	roleBtn: eui.RadioButton;
	petBtn: eui.RadioButton;
	navBtn: Array<eui.RadioButton>;
	navBind: Array<string>;

	taskItemImg: eui.Image;
	rebirthTips: eui.Group
	private funcOpenConfig: any;
	private expConfig: any;

	private guildfb_time: eui.Image;
	private guildfb_timenum: eui.Image;
	private timeshenyu: eui.Label;
	private bossTimer: eui.BitmapLabel;

	private index = 0;
	private timerEnd = 60;
	public sq_count_bg0: eui.Image;
	public m_Lan1: eui.Label;

	public initUI() {
		super.initUI();
		this.skinName = "MainBottomPanelSkin"
		this.touchEnabled = false
		this.navBtn = [this.cityBtn, this.roleBtn, this.battleBtn, this.forgeBtn, this.bagBtn, this.petBtn];
		this.navBind = [egret.getQualifiedClassName(MainCityView), egret.getQualifiedClassName(RoleWin), egret.getQualifiedClassName(PlayFunView), egret.getQualifiedClassName(ForgeWin), egret.getQualifiedClassName(BagWin), egret.getQualifiedClassName(PetWin)];

		this.taskItemImg = new eui.Image;
		this.taskItemImg.x = 50;
		this.taskItemImg.y = 500;
		this.taskItemImg.visible = false;
		this.addChild(this.taskItemImg);

		this.rebirthTips.visible = false
		this.bossTimer.visible = false;
		this.guildfb_time.visible = false;
		this.guildfb_timenum.visible = false;
		this.timeshenyu.visible = false;
		//默认是战斗
		this.battleBtn.selected = true
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101375;
	};
	public open(...param: any[]) {

		super.open(param);
		this.timeshenyu.y = 135;
		this.timeshenyu0.y = -389;
		this.sq_count_bg.y = 124;
		this.sq_count_bg0.visible = false;

		for (var i = 0; i < this.navBtn.length; i++) {
			this.navBtn[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		}
		MessageCenter.addListener(TaskTraceIconRule.postParabolicItem, this.runItem, this);
		MessageCenter.ins().addListener(GadEvent.GAD_GUIDEENDBATTLE_MSG, this.checkGadEndGuide, this);
		MessageCenter.ins().addListener(MessageDef.GUIDE_SKILLBATTLE_END, this.checkSkillEndGuide, this);

		MessageCenter.ins().addListener(MessageDef.EXP_CHANGE, this.updataExp, this);
		this.observe(PetEvt.PET_TREASUREGUIDE_END, this.checkPetTrEndGuide);
		this.observe(MessageDef.PUBLIC_BOSS_REBIRTHT_TIPS, this.publicBossRebirthtBubble)
		this.observe(UserTask.postUpdteTaskTrace, this.checkTaskGuide);
		this.observe(PetEvt.PET_DATAUPDATE_MSG, this.checkTaskGuide);
		MessageCenter.addListener(UserFb.ins().postGuanKaIdChange, this.checkGuide, this);
		this.checkGuide();
		this.addRedPointTime();
	};

	private addRedPointTime() {
		this.removeTime();
		TimerManager.ins().doTimer(10000, 0, this.redTimeToRefresh, this);
	}

	private removeTime() {
		TimerManager.ins().remove(this.redTimeToRefresh, this);
	}
	private updataExp() {
		if (this.expConfig == null)
			this.expConfig = GlobalConfig.ins("ExpConfig");
		MessageCenter.ins().removeListener(MessageDef.EXP_CHANGE, this.updataExp, this);
	}
	private guildTimer() {
		if (!this._UpdateGuildTimer()) {
			TimerManager.ins().remove(this.guildTimer, this);
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
	/*+++神器副本倒计时刷怪***/
	public shenQiFBTimer() {
		this.timeshenyu.y = -135;
		this.timeshenyu0.y = -49;
		this.sq_count_bg.y = -144;
		TimerManager.ins().remove(this.shenQiFBTimer, this);
		if (this.sQFBTimer()) {
			TimerManager.ins().doTimer(1000, 60, this.shenQiFBTimer, this);
		}
	}
	public sQFBTimer() {
		this.shenQiFBTime0 -= 1;
		if (this.shenQiFBTime0 >= 0) {
			this.timeshenyu.visible = true;
			this.sq_count_bg0.visible = true;
			this.timeshenyu.textFlow = (new egret.HtmlTextParser).parser(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101370, [this.boShu1, this.boShu]));
			this.timeshenyu0.visible = true;
			this.sq_count_bg.visible = true;
			this.buff.visible = true;
			var str = this.timeStr(this.shenQiFBTime0);
			this.timeshenyu0.textFlow = (new egret.HtmlTextParser).parser(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101371, [str]));
			return true;
		} else {
			this.timeshenyu.visible = false;
			this.timeshenyu0.visible = false;
			this.sq_count_bg.visible = false;
			this.buff.visible = false;
			this.sq_count_bg0.visible = false;
		}
		return false;
	}
	timeStr(num: number) {
		var string;
		if (num >= 3600) { string = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101372, [num / 3600]); return string; }
		var child = Math.floor(num / 60);
		if (child < 10) { string = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101373, [child]) }
		else { string = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101373, [child]) }
		child = num - child * 60;
		if (child < 10) { string += LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101374, ['0' + child]) }
		else { string += LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101374, [child]) }

		return string;
	}
	clearFB() {	//清理界面
		TimerManager.ins().removeAll(this);
		this.timeshenyu.visible = false;
		this.timeshenyu0.visible = false;
		this.bossTimer.visible = false;
		this.guildfb_time.visible = false;
		this.guildfb_timenum.visible = false;
		this.buff.visible = false;
		this.sq_count_bg.visible = false;
		this.sq_count_bg0.visible = false;
		this.timeshenyu.y = 135;
		this.timeshenyu0.y = -389;
		this.sq_count_bg.y = 124;
	}
	public shenQiFBTime0 = 0;//剩余时间倒计时
	timeshenyu0;//剩余时间id
	boShu = 0;//总波次
	boShu1 = 0;//当前波次
	buff //buff
	sq_count_bg: eui.Image;
	/*---神器副本倒计时刷怪**/
	//公会副本倒计时刷怪
	public upDataBossInfo() {
		this.index = 0;

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
	private guildFBTimer() {
		TimerManager.ins().remove(this.guildTimer, this);
		if (this._UpdateGuildTimer()) {
			TimerManager.ins().doTimer(1000, 60, this.guildTimer, this);
		}
	};

	public close(...param: any[]) {
		super.close(param);
		for (var i = 0; i < this.navBtn.length; i++) {
			this.navBtn[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		}
		this.removeObserve()
	};
	public guideUpgrade() {
		GuideUtils.ins().show(this.roleBtn, 1, 0);
	};

	public and(list) {
		for (var k in list) {
			if (list[k] == true)
				return true;
		}
		return false;
	};

	/**红点定时刷新计算*/
	private redTimeToRefresh(): void {
		this.roleBtn["redPoint"].visible = UserRole.ins().showNavBtnRedPoint();
		this.forgeBtn["redPoint"].visible = UserForge.ins().seekForgeItem();
		this.cityBtn["redPoint"].visible = this._updateCityBtnRedPoint();
		// this.bagBtn["redPoint"].visible = this._updateCityBtnRedPoint();
		let petModel = PetModel.getInstance;
		if (petModel.checkAllPetRedPoint()) {
			this.petBtn["redPoint"].visible = true;
		} else {
			this.petBtn["redPoint"].visible = false;
		}
	}

	private _updateCityBtnRedPoint(): boolean {
		if (Deblocking.IsRedDotArtifactBtn()) {
			return true;
		}
		if (Deblocking.IsRedDotBossBtn()) {
			return true
		}
		if (Deblocking.IsRedDotGuildBtn()) {
			return true
		}
		if (Deblocking.IsRedDotLadderBtn()) {
			return true
		}
		if (Deblocking.IsRedDotGadrBtn()) {
			return true
		}
		if (Deblocking.IsRedDotFubenBtn()) {
			return true
		}
		return false
	}

	public onClick(e: egret.TouchEvent) {
		if (e.currentTarget == this.roleBtn) {
			GuideUtils.ins().next(this.roleBtn);
		} else if (e.currentTarget == this.petBtn) {
			GuideUtils.ins().next(this.petBtn);
		} else if (e.currentTarget == this.cityBtn) {
			GuideUtils.ins().next(this.cityBtn);
		} else if (e.currentTarget == this.battleBtn) {
			GuideUtils.ins().next(this.battleBtn);
		}
		var index = this.navBtn.indexOf(e.currentTarget);
		this.navBtn[index][`redPoint`].visible = false;
		this.showSelectView(index, true)
	};
	public showSelectView(index: number, isClick: boolean = false): void {
		if (!this._checkPanelCanOpen(index)) {//不可以打开，返回选择上一个界面
			this.navBtn[this.m_OldSelectIndex].selected = true;
			return;
		}

		if (this.m_OldSelectIndex == index && index != UIView2.NAV_BATTLE) {//点击相同按钮则关闭界面
			if (UIView2.NAV_BATTLE != index) {
				this.closeWindow(index);
			}
			return
		}

		for (var i = 0; i < this.navBtn.length; i++) {
			if (index != i) {
				this.closeWindow(i);
			}
		}

		this.navBtn[index].selected = true;
		if (this.navBtn[index].selected) {
			//如果打开不成功，则返回按钮选择状态

			var window: BaseEuiView = this.openWindow(index)
			if (window == null) {
				this.navBtn[index].selected = false
			} else if (window && !window.isShow()) {//暂时不要这个条件，跟下面隐藏图标有冲突
				this.navBtn[index].selected = false;

			} else {
				this.m_OldSelectIndex = index
				if (index == UIView2.NAV_BATTLE) {
					if (UserFb.ins().CheckFb()) {
						ViewManager.ins().open(PlayFunView);
					} else {
						ViewManager.ins().close(PlayFunView);
					}
					//	window.visible = UserFb.ins().CheckFb()//副本战斗中隐藏图标界面
					if ((!GameMap.IsNoramlLevel() && !GameMap.IsGuanQiaBoss()) || isClick) {
						//关闭上层界面
						ViewManager.ins().closePartPanel();
					}
				}
			}
		} else {
			// this.m_OldSelectIndex = -1
			this.closeWindow(index);
		}

	}
	private m_OldSelectIndex: number = 2
	private _checkPanelCanOpen(idx: number): boolean {
		switch (idx) {
			case UIView2.NAV_PET:
				return Deblocking.Check(DeblockingType.TYPE_60)
			default:
				return true
		}
	}

	/**此函数用来兼容 navBind的在修改过程中的不同类型 */
	public openWindow(index): BaseEuiView {
		if (this.navBind[index]) {
			return ViewManager.ins().open(this.navBind[index]);
		}
		return null;
	};
	/**此函数用来兼容 navBind的在修改过程中的不同类型 */
	public closeWindow(index) {
		if (this.navBind[index]) {
			ViewManager.ins().close(this.navBind[index]);
		}
	};

    /**
     * 设置某个导航栏到关闭状态
     * @param index UIView2中的静态值
     * */
	public closeNav(index) {
		this.navBtn[index].selected = false;
		for (let i = 0, len = this.navBtn.length; i < len; i++) {
			if (this.navBtn[i].selected == true) return
		}
		if (index != UIView2.NAV_BATTLE) {
			this.navBtn[UIView2.NAV_BATTLE].selected = true;
			this.m_OldSelectIndex = UIView2.NAV_BATTLE
		}
	};

    /**
     * 神功升级特效
     */
	public lilianUpgradeSuccess(soureArr) {
		var self = this;
		var _loop_1 = function (i) {
			var img = new eui.Image();
			img.source = soureArr[i];
			img.x = 261 + i * 63;
			img.y = 200;
			self.addChild(img);
			img.visible = false;
			var tween = egret.Tween.get(img);
			tween.wait(130 * i).to({ visible: true }, 1).to({ x: 326, y: 730 }, 900).call(function () {
				egret.Tween.removeTweens(img);
				self.removeChild(img);
			});
		};
		for (var i = 0; i < 3; i++) {
			_loop_1(i);
		}
	};

    /**
     * 抛物 - 任务奖励道具
     */
	public runItem(data) {
		// var data = UserTask.ins().taskTrace;
		var awardList = UserTask.ins().getAchieveConfById(data.id).awardList;
		this.runStrat(awardList, 0);
	};
    /**
     * 移动道具
     * @param awardList
     * @param index
     */
	public runStrat(awardList, index) {
		var str = "";
		if (awardList[index].type == 0) {
			switch (awardList[index].id) {
				case MoneyConst.exp:
					str = "";
					break;
				case MoneyConst.gold:
					str = "icgoods117_png";
					break;
				case MoneyConst.yuanbao:
					str = "icgoods121_png";
			}
		}
		else {
			str = "" + awardList[index].id;
		}
		if (str != "" && str.indexOf("_png") == -1)
			str += "_png";
		this.taskItemImg.visible = true;
		this.taskItemImg.source = str;
		var t = egret.Tween.get(this);
		t.to({ factor: 1 }, 800).call(() => {
			egret.Tween.removeTweens(this.taskItemImg);
			this.taskItemImg.visible = false;
			if (awardList.length > (++index)) {
				this.runStrat(awardList, index);
			}
		}, this);
	};
	get factor() {
		return 0;
	}
	set factor(value) {
		this.taskItemImg.x = (1 - value) * (1 - value) * 50 + 2 * value * (1 - value) * 180 + value * value * 270;
		this.taskItemImg.y = (1 - value) * (1 - value) * 500 + 2 * value * (1 - value) * 400 + value * value * 730;
	}

	/**全民boss刷新气泡提示*/
	private publicBossRebirthtBubble() {
		this.rebirthTips.visible = true;
		this.rebirthTips.alpha = 1;
		var t = egret.Tween.get(this.rebirthTips);
		t.wait(3000).to({ "alpha": 0 }, 1500).call(() => {
			this.rebirthTips.visible = false;
			egret.Tween.removeTweens(this.rebirthTips);
		});
	}

	/**主城导航按钮 */
	public static NAV_CITY = 0;
	/**锻造导航按钮 */
	public static NAV_BAG = 3;
	/**战斗导航按钮 */
	public static NAV_BATTLE = 2;
	/**角色导航按钮 */
	public static NAV_ROLE = 1;
	/**背包 */
	public static NAV_MYBAG = 4;
	/**宠物 */
	public static NAV_PET = 5;

	public static CloseNav(type: number): void {
		var uiview2 = <UIView2>ViewManager.ins().getView(UIView2);
		if (uiview2) {
			uiview2.closeNav(type);
		}
	}

	private _playRedDotAni(): void {
		for (let i = 0, len = this.navBtn.length; i < len; i++) {
			let item = this.navBtn[i]["redPoint"] as eui.Image
			if (!item) continue
			egret.Tween.removeTweens(item)
			if (item.visible == true) {
				item.scaleX = item.scaleY = .8
				egret.Tween.get(item, { loop: true })
					.to({ scaleX: 1, scaleY: 1 }, 2500)
					.to({ scaleX: .8, scaleY: .8 }, 2500)
			}
		}
	}
	private _stopRedDotAni(): void {
		for (let i = 0, len = this.navBtn.length; i < len; i++) {
			let item = this.navBtn[i]["redPoint"] as eui.Image
			egret.Tween.removeTweens(item)
			item.scaleX = item.scaleY = 1
		}
	}

	private checkGuide() {
		if (UserFb.ins().guanqiaID == GuideQuanQiaType.PET) {
			Setting.currStep = 0;
			Setting.currPart = 14;
			GuideUtils.ins().show(this.cityBtn, 14, 0);
		} 
		// else if (UserFb.ins().guanqiaID == GuideQuanQiaType.SKILL) {
		// 	Setting.currStep = 0;
		// 	Setting.currPart = 18;
		// 	GuideUtils.ins().show(this.roleBtn, 18, 0);
		// } else if (UserFb.ins().guanqiaID == GuideQuanQiaType.SKILL1) {
		// 	Setting.currStep = 0;
		// 	Setting.currPart = 23;
		// 	GuideUtils.ins().show(this.roleBtn, 23, 0);
		// }
		//  else if (UserFb.ins().guanqiaID == GuideQuanQiaType.SKILL2) {
		// 	Setting.currStep = 0;
		// 	Setting.currPart = 25;
		// 	GuideUtils.ins().show(this.roleBtn, 25, 0);
		// }
		else if (UserFb.ins().guanqiaID == GuideQuanQiaType.GAD) {
			Setting.currStep = 0;
			Setting.currPart = 20;
			GuideUtils.ins().show(this.cityBtn, 20, 0);
		}
	}

	public checkArGuide() {
		if (UserFb2.ins().fbChallengeId == GuideArtifact.Artifact) {
			GuideUtils.ins().show(this.battleBtn, 68, 6);
		}
	}

	private checkPetTrEndGuide() {
		if (Setting.currPart == 14 && Setting.currStep == 4) {
			GuideUtils.ins().show(this.petBtn, 14, 4);
		}
	}

	private checkGadEndGuide() {
		if (Setting.currPart == 20 && Setting.currStep == 12) {
			GuideUtils.ins().show(this.battleBtn, 20, 12);
		}
	}

	private checkSkillEndGuide() {
		if (Setting.currPart == 19 && Setting.currStep == 2) {
			GuideUtils.ins().show(this.battleBtn, 19, 2);
		} else
			if (Setting.currPart == 24 && Setting.currStep == 2) {
				GuideUtils.ins().show(this.battleBtn, 24, 2);
			} else
				if (Setting.currPart == 26 && Setting.currStep == 2) {
					GuideUtils.ins().show(this.battleBtn, 26, 2);
				}
	}

	private checkTaskGuide() {
		var data = UserTask.ins().taskTrace;
		if (data) {
			switch (data.id) {
				case GuideMissionType.PETSTAR:
					if (PetModel.getInstance.checkGuideStar() && !GuideUtils.ins().isShow()) {
						Setting.currPart = 27;
						Setting.currStep = 0;
						GuideUtils.ins().show(this.petBtn, 27, 0);
					}
					break;
			}
		}
	}
}

window["UIView2"] = UIView2