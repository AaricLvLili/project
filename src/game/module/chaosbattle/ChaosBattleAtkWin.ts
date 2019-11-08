class ChaosBattleAtkWin extends BaseEuiView {
	public constructor() {
		super()
		this.skinName = "ChaosBattleAtkWinSkin";
	}
	public m_HpGroup: eui.Group;
	public m_BloodBar: BossBloodBar;
	public m_Head: eui.Image;
	public m_ElementImg: eui.Image;
	public myTxt: eui.Label;
	public lvTxt: eui.Label;
	public nameTxt: eui.Label;
	public m_Lan: eui.Label;
	public m_Time: eui.Label;
	public m_DeadTime: eui.Label;
	public m_GoNextBtn: eui.Button;
	public m_KillPointLab: eui.Label;
	public m_FirstTop: eui.Button;
	public m_TopKillBoss: eui.Button;
	public m_PointBtn: eui.Button;
	public m_RankBtn: eui.Button;
	public m_RoleHeadList: eui.List;
	public m_AtkRoleHeadList: eui.List;
	public m_Lan1: eui.Label;
	public m_DeRoleHeadList: eui.List;
	public m_Lan2: eui.Label;
	public m_Lan0: eui.Label;
	public m_AtkGroup: eui.Group;

	private roleHeadData: eui.ArrayCollection;
	private atkRoleHeadData: eui.ArrayCollection;
	private defRoleHeadData: eui.ArrayCollection;
	public m_Scroller: eui.Scroller;
	public m_NowAtkGroup: eui.Group;
	public m_DefGroup: eui.Group;

	public m_PointGroup: eui.Group;
	public m_PointNum: eui.Label;
	public m_BattlePointGroup: eui.Group;

	private atkTager: number = 0;
	public m_RedPoint: eui.Image;
	public m_TopTimeGroup: eui.Group;
	public m_TopBtnGroup: eui.Group;

	public createChildren() {
		super.createChildren();
		this.m_Lan0.text = GlobalConfig.jifengTiaoyueLg.st102046;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st102047;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st102048;

		this.m_RoleHeadList.itemRenderer = ChaosBattleAtkHead;
		this.roleHeadData = new eui.ArrayCollection();
		this.m_RoleHeadList.dataProvider = this.roleHeadData;

		this.m_AtkRoleHeadList.itemRenderer = ChaosBattleAtkHead;
		this.atkRoleHeadData = new eui.ArrayCollection();
		this.m_AtkRoleHeadList.dataProvider = this.atkRoleHeadData;

		this.m_DeRoleHeadList.itemRenderer = ChaosBattleAtkHead;
		this.defRoleHeadData = new eui.ArrayCollection();
		this.m_DeRoleHeadList.dataProvider = this.defRoleHeadData;
		if (Main.isLiuhai) {
			this.m_TopTimeGroup.top += 50;
			this.m_TopBtnGroup.top += 50;
			this.m_HpGroup.top += 50;
		}
	}
	initUI() {
		super.initUI();
	}
	open(...param: any[]) {
		this.addViewEvent();
		this.setData();
		this.addTick();
	}
	close() {
		this.release();
		this.removeTick();
		ChaosBattleModel.getInstance.release();
	}
	public release() {
		this.removeViewEvent();
		let childNum = this.m_RoleHeadList.numChildren;
		for (var i = 0; i < childNum; i++) {
			let child = this.m_RoleHeadList[i];
			if (child && child instanceof ChaosBattleAtkHead) {
				child.release();
			}
		}
		childNum = this.m_AtkRoleHeadList.numChildren;
		for (var i = 0; i < childNum; i++) {
			let child = this.m_AtkRoleHeadList[i];
			if (child && child instanceof ChaosBattleAtkHead) {
				child.release();
			}
		}
		childNum = this.m_DeRoleHeadList.numChildren;
		for (var i = 0; i < childNum; i++) {
			let child = this.m_DeRoleHeadList[i];
			if (child && child instanceof ChaosBattleAtkHead) {
				child.release();
			}
		}
	}
	private addViewEvent() {
		this.AddClick(this.m_FirstTop, this.onClickTop);
		this.AddClick(this.m_TopKillBoss, this.onClickTop);
		this.AddClick(this.m_PointGroup, this.onClickPoint);
		this.AddClick(this.m_RankBtn, this.onClickRank);
		this.observe(ChaosBattleEvt.CHAOSBATTLE_DATAUPDATE_BATTLEPOINT, this.setBattlePoint);
		this.observe(ChaosBattleEvt.CHAOSBATTLE_DATAUPDATE_POINT, this.setPoint);
		this.observe(ChaosBattleEvt.CHAOSBATTLE_DATAUPDATE_ROLE, this.setRoleData);
		this.observe(ChaosBattleEvt.CHAOSBATTLE_DATAUPDATE_MSG, this.setData);
		this.AddClick(this.m_GoNextBtn, this.onClickGoNext);
		this.observe(MessageDef.TENKILL_BLOOD_UPDATE, this.setRoleData);
		this.observe(MessageDef.UPDATE_BOSS_HP, this.setRoleData);
		this.observe(MessageDef.CREATE_CHARO_MSG, this.setRoleData);
	}
	private removeViewEvent() {
	}
	private setData() {
		let chaosBattleModel = ChaosBattleModel.getInstance;
		this.m_Lan.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st102044, [Ladder.ins().getZhongwenNumber(chaosBattleModel.nowLayer)]);
		this.setRoleData();
		this.setPoint();
		this.setBattlePoint();
	}
	private setRoleData() {
		let chaosBattleModel = ChaosBattleModel.getInstance;
		let chaosBattleTagers: ChaosBattleTagerData[] = chaosBattleModel.roleDic.values;
		let chaosBattleTager: ChaosBattleTagerData[] = [];
		for (var i = 0; i < chaosBattleTagers.length; i++) {
			let tager = chaosBattleTagers[i];
			if (tager.hp > 0) {
				chaosBattleTager.push(tager);
			}
		}
		this.m_HpGroup.visible = false;
		if (chaosBattleTager.length > 0) {
			this.m_AtkGroup.visible = true;
			let sortChaosBattleTager = chaosBattleTager.sort(this.sorData);
			this.roleHeadData.replaceAll(sortChaosBattleTager);
		} else {
			this.m_AtkGroup.visible = false;
			this.roleHeadData.replaceAll([]);
			this.m_Scroller.stopAnimation();
			this.m_Scroller.viewport.scrollH = 0
		}
		if (!chaosBattleModel.atkTager || !chaosBattleModel.roleDic.get(chaosBattleModel.atkTager)) {
			this.m_NowAtkGroup.visible = false;
			this.atkRoleHeadData.replaceAll([]);
		} else {
			this.m_HpGroup.visible = true;
			this.m_NowAtkGroup.visible = true;
			let atkChaosBattleTager: ChaosBattleTagerData = chaosBattleModel.roleDic.get(chaosBattleModel.atkTager);
			if (atkChaosBattleTager) {
				if (this.atkTager != chaosBattleModel.atkTager) {
					this.atkTager = chaosBattleModel.atkTager;
					this.atkRoleHeadData.replaceAll([atkChaosBattleTager]);
					this.m_Head.source = atkChaosBattleTager.head
					this.m_BloodBar.changeMaxBarNum = atkChaosBattleTager.maxBarNum;
					this.m_BloodBar.changeValue = atkChaosBattleTager.hp;
					this.m_BloodBar.changeMaximum = atkChaosBattleTager.maxHp;
					this.lvTxt.text = atkChaosBattleTager.lv + GlobalConfig.jifengTiaoyueLg.st100093 + atkChaosBattleTager.zslv + GlobalConfig.jifengTiaoyueLg.st100067;
					this.nameTxt.text = atkChaosBattleTager.name;
					this.m_ElementImg.source = ResDataPath.GetElementImgName(atkChaosBattleTager.elementType);
					this.myTxt.text = atkChaosBattleTager.atkBossVale;
				} else {
					if (atkChaosBattleTager.hp > this.m_BloodBar.getMaxHp()) {
						this.m_BloodBar.changeMaximum = atkChaosBattleTager.maxHp;
					}
					this.m_BloodBar.changeValue = atkChaosBattleTager.hp;
					this.atkRoleHeadData.replaceAll([atkChaosBattleTager]);
				}
			}
		}
		if (chaosBattleModel.deAtkTager.length <= 0) {
			this.defRoleHeadData.replaceAll([]);
			this.m_DefGroup.visible = false;
		} else {
			this.m_DefGroup.visible = true;
			let needNum = Math.min(chaosBattleModel.deAtkTager.length, 3);
			let defRoleHeadData = []
			for (var i = 0; i < needNum; i++) {
				let data: ChaosBattleTagerData = chaosBattleModel.roleDic.get(chaosBattleModel.deAtkTager[i]);
				if (data) {
					defRoleHeadData.push(data);
				}
			}
			if (defRoleHeadData.length <= 0) {
				this.m_DefGroup.visible = false;
			}
			this.defRoleHeadData.replaceAll(defRoleHeadData);
		}
	}
	/**关联排序 */
	private sorData(item1: { weight: number }, item2: { weight: number }): number {
		return item1.weight - item2.weight;
	}

	public setPoint() {
		this.m_PointGroup.visible = false;
		this.m_RedPoint.visible = false;
		let chaosBattleModel = ChaosBattleModel.getInstance;
		if (chaosBattleModel.nowPointId > 0) {
			let competitionPersonalAward = GlobalConfig.ins("CompetitionPersonalAward")[chaosBattleModel.nowPointId];
			if (competitionPersonalAward) {
				this.m_PointGroup.visible = true;
				if (chaosBattleModel.point >= competitionPersonalAward.integral) {
					// this.m_PointNum.textFlow = <Array<egret.ITextElement>>[
					// 	{ text: GlobalConfig.languageConfig.st101037 },
					// 	{ text: chaosBattleModel.point, style: { "textColor": Color.Green } },
					// 	{ text: "/" + competitionPersonalAward.integral }
					// ]
					if (chaosBattleModel.pointList[chaosBattleModel.nowPointId - 1] == 1) {
						this.m_RedPoint.visible = true;
					}
				}
				this.m_PointNum.text = GlobalConfig.jifengTiaoyueLg.st101037 + chaosBattleModel.point + "/" + competitionPersonalAward.integral;

			}
		}
	}

	public setBattlePoint() {
		let chaosBattleModel = ChaosBattleModel.getInstance;
		if (!GlobalConfig.ins("CompetitionLevel")[chaosBattleModel.nowLayer + 1]) {
			this.m_BattlePointGroup.visible = false;
			return;
		}
		this.m_BattlePointGroup.visible = true;
		let competitionLevel = GlobalConfig.ins("CompetitionLevel")[chaosBattleModel.nowLayer];
		if (competitionLevel) {
			this.m_KillPointLab.text = GlobalConfig.jifengTiaoyueLg.st102050 + chaosBattleModel.battlePoint + "/" + competitionLevel.feats;
		}

	}

	public onClickPoint() {
		ViewManager.ins().open(ChaosBattlePointWin);
	}

	public addTick() {
		this.removeTick();
		TimerManager.ins().doTimer(1000, 0, this.playTime, this);
	}
	public removeTick() {
		TimerManager.ins().remove(this.playTime, this);
	}

	private playTime() {
		let chaosBattleModel = ChaosBattleModel.getInstance;
		let endTime = chaosBattleModel.endTime - GameServer.serverTime;
		let time = DateUtils.GetFormatSecond(endTime, DateUtils.TIME_FORMAT_1);
		this.m_Time.text = GlobalConfig.jifengTiaoyueLg.st101579 + "：" + time;
		let chaosBattleAwardWin = ViewManager.ins().getView(ChaosBattleAwardWin);
		if (chaosBattleAwardWin instanceof ChaosBattleAwardWin) {
			chaosBattleAwardWin.playTime();
		}
		let deathTime = chaosBattleModel.deathTime - GameServer.serverTime;
		if (deathTime > 0) {
			this.m_DeadTime.visible = true;
			this.m_DeadTime.text = GlobalConfig.jifengTiaoyueLg.st102045 + DateUtils.getFormatBySecond(deathTime, DateUtils.TIME_FORMAT_5, 1);
		} else {
			if (chaosBattleModel.isDead == true) {
				chaosBattleModel.isDead = false;
				ChaosBattleSproto.ins().sendRevive(2);
			}
			ViewManager.ins().close(ChaosBattleDeadWin);
			this.m_DeadTime.visible = false;
		}
	}

	private onClickTop(e: egret.TouchEvent) {
		let type = 2;
		switch (e.currentTarget) {
			case this.m_FirstTop:
				type = 1;
				break;
			default:
				break;
		}
		ViewManager.ins().open(ChaosBattleAwardWin, type);
	}

	private onClickRank() {
		ViewManager.ins().open(ChaosBattleRankWin);
	}

	private onClickGoNext() {
		let chaosBattleModel = ChaosBattleModel.getInstance;
		let competitionLevel = GlobalConfig.ins("CompetitionLevel")[chaosBattleModel.nowLayer];
		if (competitionLevel) {
			if (chaosBattleModel.battlePoint >= competitionLevel.feats) {
				ChaosBattleSproto.ins().sendChaosBattleAtkMsg();
			} else {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st102051);
			}
		}

	}
}
ViewManager.ins().reg(ChaosBattleAtkWin, LayerManager.UI_HUD);
window["ChaosBattleAtkWin"] = ChaosBattleAtkWin