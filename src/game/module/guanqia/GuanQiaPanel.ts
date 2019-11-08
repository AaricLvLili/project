class GuanQiaPanel extends BaseView implements ICommonWindowTitle {

	reward: ItemBase[]
	bossImage: MovieClip

	guideHand = null
	guideFrame = null

	awardItemEff: MovieClip
	private chaptersRewardConfig: any;
	private m_RankType: any;
	private monstersConfig: any;
	private chaptersConfig: any;
	public info: eui.Group;
	public bar: eui.ProgressBar;
	public mapNameTxt: eui.Label;
	public itemGroup: eui.Group;
	public item0: BaseComponent;
	public item1: BaseComponent;
	public item2: BaseComponent;
	public needWave: eui.Label;
	public groupBoss: eui.Group;
	public getReward: eui.Button;
	public challengeBtn: eui.Button;
	public rank_label: eui.Label;
	public m_RankList: eui.List;
	private rankListData: eui.ArrayCollection;
	public m_MapGroup: eui.Group;
	public m_MapNameLab: eui.Label;
	public m_MapLvLab: eui.Label;
	public m_MapRedPoint: eui.Image;
	public m_LittleMapImg: eui.Image;
	windowCommonBg = "pic_bj_20_png"
	private languageTxt: eui.Label;
	private languageTxt0: eui.Label;
	private languageTxt1: eui.Label;

	public constructor() {
		super();
		this.skinName = "GuanQiaPanelSkin";
	}

	protected childrenCreated(): void {
		this.m_RankType = RankDataType.TYPE_PASS;
		this.reward = [];
		for (var t = 0; 5 > t; t++) {
			this.reward[t] = this["item" + t];
		}

		this.challengeBtn.visible = false;
		this.bar.value = 0;

		UIHelper.SetLinkStyleLabel(this.rank_label, GlobalConfig.jifengTiaoyueLg.st100091);
		this.m_RankList.itemRenderer = GuanQiaPanelRankItem;
		this.rankListData = new eui.ArrayCollection();
		this.m_RankList.dataProvider = this.rankListData;
		this.languageTxt.text = GlobalConfig.jifengTiaoyueLg.st100747;
		this.languageTxt0.text = GlobalConfig.jifengTiaoyueLg.st100748;
		this.languageTxt1.text = GlobalConfig.jifengTiaoyueLg.st100380;
		this.challengeBtn.label = GlobalConfig.jifengTiaoyueLg.st100749;
	};

	private initMc() {
		if (!this.bossImage) {
			this.bossImage = new MovieClip();
			this.bossImage.scaleX = -1;
			this.bossImage.scaleY = 1;
			this.bossImage.x = this.groupBoss.width / 2;
			this.bossImage.y = this.groupBoss.height / 2;
			this.bossImage.touchEnabled = !1;
		}
	}

	private initMcEff() {
		if (!this.awardItemEff) {
			this.awardItemEff = new MovieClip
			this.awardItemEff.x = 205
			this.awardItemEff.y = 221;
		}
	}
	open() {
		this.addTouchEvent(this, this.onTouchTap, this.challengeBtn)
		this.addTouchEvent(this, this.onTouchTap, this.getReward)
		this.addTouchEvent(this, this.onClickMap, this.m_MapGroup);

		this.observe(GameLogic.ins().postEnterMap, this.upDataGuanqia)
		this.observe(UserFb.ins().postZhangJieAwardChange, this.upDataGuanqia)
		this.observe(Rank.postRankingData, this.upDataRank);
		this.observe(MessageDef.RAID_KILL_MONSTER_COUNT, this.upDateBattle);

		this.addTouchEvent(this, this.openRankWin, this.rank_label);
		Rank.ins().sendGetRankingData(this.m_RankType)
	}
	close() {
		DisplayUtils.dispose(this.bossImage);
		this.bossImage = null;
	};
	private openRankWin(): void {
		if (!this.m_RankType) {
			return
		}
		let rankModel = Rank.ins().rankModel[this.m_RankType]
		if (rankModel && rankModel.getDataList.length > 0) {
			if (GameGlobal.actorModel.level < 60)
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100379);
			else
				ViewManager.ins().open(FbAndLevelsRankWin, this.m_RankType);
		} else {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100370);
		}

	}


	public release() {
		this.close();
	}

	private upDateBattle() {
		if (this.challengeBtn.visible == true) {
			return;
		}
		this.UpdateContent();
	}
	onTouchTap(e) {
		switch (e.currentTarget) {
			case this.challengeBtn:
				GuideUtils.ins().next(this.challengeBtn);
				if (UserBag.ins().getSurplusCount() < UserBag.BAG_ENOUGH) {
					BagFullTipsPanel.Open()
				} else {
					GameLogic.ins().startPkBoss()
					ViewManager.ins().closePartPanel();
				}
				break;
			case this.getReward:
				let guanqiaID = UserFb.ins().guanqiaID;
				let chaptersConfig = GlobalConfig.ins("ChaptersConfig")[guanqiaID];
				ViewManager.ins().open(GuanQiaTipsWin, chaptersConfig.mapid);
				break;
		}
	};
	upDataGuanqia() {
		this.UpdateContent();
	};
	UpdateContent() {
		if (this.chaptersRewardConfig == null)
			this.chaptersRewardConfig = GlobalConfig.ins("ChaptersRewardConfig");
		if (this.monstersConfig == null)
			this.monstersConfig = GlobalConfig.monstersConfig;
		var guanqiaID = UserFb.ins().guanqiaID;
		var bossReward = UserFb.ins().bossReward

		// let isReward = false;

		if (this.chaptersConfig == null)
			this.chaptersConfig = GlobalConfig.ins("ChaptersConfig");
		let chaptersConfig1 = this.chaptersConfig[guanqiaID]
		let chaptersRewardConfig = this.chaptersRewardConfig[chaptersConfig1.mapid];
		if (chaptersRewardConfig) {
			this.bar.maximum = chaptersRewardConfig.needLevel;
			this.bar.value = guanqiaID;
			// isReward = this.bar.value >= this.bar.maximum;
			this.m_MapNameLab.text = chaptersRewardConfig.name;
			this.m_LittleMapImg.source = chaptersRewardConfig.mapUi + "_png"
		}

		// UIHelper.ShowRedPoint(this.getReward, isReward)
		if (chaptersConfig1) {
			var boss = this.monstersConfig[UserFb.ins().bossID];
			this.mapNameTxt.text = boss.name + " 【" + chaptersConfig1.cid + GlobalConfig.jifengTiaoyueLg.st100369 + "】 ";
			this.m_MapLvLab.text = "【" + chaptersConfig1.mapsubid + "-" + chaptersConfig1.turn + "】";
		}
		var item;
		for (var i = 0; i < this.reward.length; i++) {
			item = this.reward[i];
			if (bossReward[i]) {
				item.data = bossReward[i];
			}
			else {
				DisplayUtils.removeFromParent(item);
			}
		}


		this.initMc()
		this.bossImage.loadUrl(ResDataPath.GetMonsterBodyPath(boss.avatar + "_3s"), true, -1);
		this.groupBoss.addChildAt(this.bossImage, 5);
		this.updateChallenge();
		//挑战引导
		this.showChallengeGuide();
		let isCanGet: boolean = GuanQiaModel.getInstance.checkAllRedPoint();
		if (isCanGet) {
			this.m_MapRedPoint.visible = true;
		} else {
			this.m_MapRedPoint.visible = false;
		}
	};
	updateChallenge() {
		this.challengeBtn.visible = UserFb.ins().isShowBossPK();
		this.needWave.visible = !this.challengeBtn.visible;
		this.needWave.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100745, [UserFb.ins().getNeedWave()]);//"再击杀" + UserFb.ins().getNeedWave() + "只怪物可挑战";
		if (UserFb.ins().guanqiaID >= UserFb.ins().maxLen) {
			this.challengeBtn.visible = false;
			this.needWave.visible = true;
			this.needWave.text = GlobalConfig.jifengTiaoyueLg.st100746;//"恭喜通关所有关卡";
		}
	};
    /**
     * 显示挑战引导
     * @returns void
     */
	showChallengeGuide() {
		//前4个关卡 + 可以打 + 没打过
		if (UserFb.ins().guanqiaID <= 1
			&& UserFb.ins().isShowBossPK()
			&& !UserFb.ins().bossIsChallenged
			&& !GuideUtils.ins().isShow()) {
			// Setting.currPart = 1;
			// Setting.currStep = 4;
			GuideUtils.ins().show(this.challengeBtn, 1, 1);
		}
	};

	private upDataRank() {
		var rankModel = Rank.ins().rankModel[this.m_RankType];
		this.rankListData.replaceAll(rankModel.getDataList());
	}

	private onClickMap() {
		ViewManager.ins().open(GuanQiaMapWin)
	}
}

window["GuanQiaPanel"] = GuanQiaPanel