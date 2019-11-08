class FBChallengePanel extends BaseView implements ICommonWindowTitle {
	public constructor() {
		super();
		this.skinName = "ChallengeFbSkin";
	}

	movieLayer: eui.Group
	movieLayerFlag: eui.Image
	movieLayerRedPoint: eui.Image
	challengeBtn
	passAllTip

	tipImage
	attrRewardID

	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st100362;
	private simpleRankPanel: SimpleRankPanel
	private getway: eui.Image;

	public m_Lan: eui.Label;
	public m_LvLab: eui.Label;
	public m_ItemBase1: ItemBase;
	public m_ItemBase2: ItemBase;
	public m_Cont1: eui.Label;
	public m_Cont2: eui.Label;
	public m_List: eui.List;
	public m_Group1: eui.Group;
	public m_Group2: eui.Group;
	public m_NextGroup: eui.Group;
	public m_NextLvLab: eui.BitmapLabel;
	public m_NowGroup: eui.Group;
	public m_NowLvLab: eui.BitmapLabel;
	public m_TipsLab: eui.Label;

	public m_SQBtn: eui.Button;
	public m_EffGroup2: eui.Group;
	public m_EffGroup1: eui.Group;
	private effMc1: MovieClip;
	private effMc2: MovieClip;
	childrenCreated() {
		this.simpleRankPanel.rankType = RankDataType.TYPE_COPY
		this.passAllTip.text = GlobalConfig.jifengTiaoyueLg.st100366;
		this.challengeBtn.label = GlobalConfig.jifengTiaoyueLg.st100376;
		// this.m_Lan.text = GlobalConfig.languageConfig.st102100;
	};
	open() {
		this.challengeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.challenge, this);
		this.AddClick(this.movieLayer, this._OnClick)
		this.AddClick(this.m_Group1, this.getRewad1)
		this.AddClick(this.m_Group2, this.getRewad2)
		this.AddClick(this.m_SQBtn, this.onClickSQ);
		this.observe(MessageDef.CHALLENGE_UPDATE_INFO, this.UpdateContent)
		this.simpleRankPanel.open()
		this.updateData();
	};
	close() {
		if (this.effMc2) {
			DisplayUtils.dispose(this.effMc2);
			this.effMc2 = null;
		}
		if (this.effMc1) {
			DisplayUtils.dispose(this.effMc1);
			this.effMc1 = null;
		}
		this.challengeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.challenge, this);
		this.simpleRankPanel.close()
		MessageCenter.ins().removeAll(this);
	};

	private _OnClick(e: egret.TouchEvent): void {
		switch (e.target) {
			case this.movieLayer:
				let config = GlobalConfig.fbChallengeConfig[UserFb2.ins().mPreLevel];
				if (config) {
					ViewManager.ins().open(GetRewardPanel, GlobalConfig.jifengTiaoyueLg.st100367, GlobalConfig.jifengTiaoyueLg.st100368 + UserFb2.ins().mPreLevel + GlobalConfig.jifengTiaoyueLg.st100369, RewardData.ToRewardDatas(config.dayAward), () => {
						if (!UserFb2.ins().mPreStatus) {
							UserFb2.ins().SendChallengeReward()
							this.playEffect(this["mc1"], false);
						}
					}, !UserFb2.ins().mPreStatus)
				}

				break
		}
	}

	private getRewad1() {
		GuideUtils.ins().next(this.m_Group1);
		if (UserFb2.ins().fbChallengeId >= UserFb2.ins().commonLv) {
			UserFb2.ins().sendGetRewad(1, UserFb2.ins().commonLv);
		} else {
			UserTips.ins().showTips(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st102100, [UserFb2.ins().commonLv]));
		}
	}
	private getRewad2() {
		if (UserFb2.ins().fbChallengeId >= UserFb2.ins().tagerLv) {
			UserFb2.ins().sendGetRewad(2, UserFb2.ins().tagerLv);
		} else {
			UserTips.ins().showTips(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st102100, [UserFb2.ins().tagerLv]));
		}
	}


	openRankWin() {
		if (Rank.ins().rankModel[RankDataType.TYPE_COPY] && Rank.ins().rankModel[RankDataType.TYPE_COPY].getDataList().length > 0) {
			ViewManager.ins().open(FbAndLevelsRankWin, RankDataType.TYPE_COPY);
		}
		else {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100370);
		}
	};


	updateData() {

		let fbid = CommonUtils.getObjectLength(GlobalConfig.fbChallengeConfig)
		if (UserFb2.ins().fbChallengeId >= fbid) {
			this.passAllTip.visible = true
			this.challengeBtn.visible = false
		} else {
			fbid = UserFb2.ins().fbChallengeId
			this.passAllTip.visible = false
			this.challengeBtn.visible = true
		}
		// fbid = Math.floor(fbid / 3) * 3
		// let i = 1
		// for (let item of this.m_Items) {
		// 	item.Update(fbid + i++)
		// }

		let id = UserFb2.ins().fbChallengeId
		var config = GlobalConfig.fbChallengeConfig[id + 1];
		this.m_NextGroup.visible = true;
		this.m_LvLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100386, [id + 1]) + GlobalConfig.jifengTiaoyueLg.st101386;
		this.m_NowLvLab.text = (id + 1) + "";
		this.m_NextLvLab.text = (id + 2) + "";
		this.m_TipsLab.visible = true;
		if (!config) {
			config = GlobalConfig.fbChallengeConfig[id];
			this.m_NextGroup.visible = false;
			this.m_LvLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100386, [id]) + GlobalConfig.jifengTiaoyueLg.st101386;
			this.m_NowLvLab.text = id + "";
			this.m_TipsLab.visible = false;
		}
		let str = ""
		if (config.zsLv) {
			str += StringUtils.addColor(config.zsLv + GlobalConfig.jifengTiaoyueLg.st100067, GameGlobal.actorModel.zsLv >= config.zsLv ? Color.Green : Color.Red)
		}
		if (config.lv) {
			if (str.length > 0) {
				str += GlobalConfig.jifengTiaoyueLg.st100374
			}
			str += StringUtils.addColor(config.lv + GlobalConfig.jifengTiaoyueLg.st100093, GameGlobal.actorModel.level >= config.lv ? Color.Green : Color.Red)
		}
		this.m_TipsLab.textFlow = TextFlowMaker.generateTextFlow(GlobalConfig.jifengTiaoyueLg.st100375 + str)
		this.m_List.dataProvider = new eui.ArrayCollection(config.firstAward);
		if (this.effMc1) {
			this.effMc1.visible = false;
		}
		let cof1 = GlobalConfig.ins("FbChallengeStageAwardConfig")[UserFb2.ins().commonLv];
		if (cof1) {
			let taskAward = cof1.taskAward[0]
			this.m_ItemBase1.data = { type: taskAward.type, id: taskAward.id, count: taskAward.count, isShowName: 1 }
			this.m_ItemBase1.IsShowRedPoint(false);
			this.m_Cont1.text = cof1.fbNum + GlobalConfig.jifengTiaoyueLg.st102101;
			this.m_Cont1.textColor = Color.White;
			this.m_Group1.visible = true;
			this.m_Group1.touchChildren = true;
			if (id + 1 > UserFb2.ins().commonLv) {
				this.m_ItemBase1.IsShowRedPoint(true);
				this.m_Cont1.text = GlobalConfig.jifengTiaoyueLg.st101344;
				this.m_Cont1.textColor = Color.White;
				this.m_Group1.touchChildren = false;
				this.effMc1 = ViewManager.ins().createEff(this.effMc1, this.m_EffGroup1, "quaeff5", -1)
				this.effMc1.visible = true;
			}
		} else {
			this.m_Group1.visible = false;
		}
		if (this.effMc2) {
			this.effMc2.visible = false;
		}
		let cof2 = GlobalConfig.ins("FbChallengeTaskAwardConfig")[UserFb2.ins().tagerLv];
		if (cof2) {
			let taskAward = cof2.taskAward[0]
			this.m_ItemBase2.data = { type: taskAward.type, id: taskAward.id, count: taskAward.count, isShowName: 1 }
			this.m_Cont2.text = cof2.fbNum + GlobalConfig.jifengTiaoyueLg.st102101;
			this.m_Group2.visible = true;
			this.m_Group2.touchChildren = true;
			this.m_ItemBase2.IsShowRedPoint(false);
			if (id + 1 > UserFb2.ins().tagerLv) {
				this.m_ItemBase2.IsShowRedPoint(true);
				this.m_Cont2.text = GlobalConfig.jifengTiaoyueLg.st101344;
				this.m_Cont2.textColor = Color.White;
				this.m_Group2.touchChildren = false;
				this.effMc2 = ViewManager.ins().createEff(this.effMc2, this.m_EffGroup2, "quaeff5", -1)
				this.effMc2.visible = true;
			}
		} else {
			this.m_Group2.visible = false;
		}
		this.checkGuide();
	}

	challenge() {
		let config = GlobalConfig.fbChallengeConfig[UserFb2.ins().fbChallengeId + 1];
		if (config) {
			if (!Checker.Level(config.zsLv, config.lv)) {
				return
			}
			UserFb2.ins().sendChallenge();
			ViewManager.ins().close(FbWin);
		}
	}
	mc1: MovieClip
	playEffect(e: MovieClip, isplay: boolean) {
		isplay ? (e.loadUrl(ResDataPath.GetUIEffePath("eff_task_box"), !0, 100), this.movieLayer.addChild(e)) : e.parent && DisplayUtils.dispose(e);
	}
	UpdateContent(): void {
		if (this.mc1 == null)
			this.mc1 = new MovieClip;
		this.mc1.x = -10;//this.movieLayer.x;
		this.mc1.y = -10;//this.movieLayer.y;
		let config = GlobalConfig.fbChallengeConfig[UserFb2.ins().mPreLevel];
		if (config) {
			this.movieLayer.visible = true
			this.movieLayerRedPoint.visible = !UserFb2.ins().mPreStatus;
			this.playEffect(this.mc1, !UserFb2.ins().mPreStatus);
		} else {
			this.movieLayer.visible = false
		}
		this.getway.visible = UserFb2.ins().mPreStatus;
		this.updateData();
	}

	public static openCheck() {
		return Deblocking.Check(DeblockingType.TYPE_04)
	}

	private onClickSQ() {
		GuideUtils.ins().next(this.m_SQBtn);
		if (Deblocking.Check(DeblockingType.TYPE_15)) {
			ViewManager.ins().open(ArtifactMainWin);
		}
	}

	private checkGuide() {
		if (UserFb2.ins().fbChallengeId == GuideArtifact.Artifact) {
			GuideUtils.ins().show(this.m_Group1, 68, 1);
		}
	}

	public checkGuide2() {
		if (UserFb2.ins().fbChallengeId == GuideArtifact.Artifact) {
			GuideUtils.ins().show(this.m_SQBtn, 68, 3);
		}
	}
}

// class FBChallengePanelItem {

// 	private m_Item: {
// 		pass: eui.Image
// 		m_ItemList: eui.List;
// 		level: eui.Label,
// 		challengeLevel: eui.Label,
// 		curImg: eui.Image
// 		groupEff: eui.Group
// 		m_ElementImg: eui.Image;
// 		m_Lan1: eui.Label,
// 	}

// 	private bossImage: MovieClip

// 	public constructor(item: eui.Component) {
// 		this.m_Item = <any>item

// 		this.bossImage = new MovieClip

// 		this.bossImage.scaleX = -0.8
// 		this.bossImage.scaleY = 0.8
// 		this.bossImage.x = this.m_Item.groupEff.width / 2
// 		this.bossImage.y = this.m_Item.groupEff.height / 2
// 		this.m_Item.groupEff.addChild(this.bossImage)
// 		this.m_Item.m_ItemList.itemRenderer = ItemBase;
// 		this.m_Item.m_Lan1.text = GlobalConfig.languageConfig.st100377
// 	}
// 	private monstersConfig: any;
// 	public Update(fbId: number): void {

// 		var config = GlobalConfig.fbChallengeConfig[fbId];
// 		if (config == null) {
// 			UserTips.ins().showTips(GlobalConfig.languageConfig.st100371);
// 			return;
// 		}
// 		if (this.monstersConfig == null)
// 			this.monstersConfig = GlobalConfig.monstersConfig;
// 		// if (0 == UserFb2.ins().fbChallengeId || UserFb2.ins().fbChallengeId > fbId) {
// 		// if (UserFb2.ins().fbChallengeId >= fbId) {
// 		// 	this.m_Item.pass.visible = true;
// 		// } else {
// 		// 	this.m_Item.pass.visible = false;
// 		// }
// 		let finishID = UserFb2.ins().fbChallengeId
// 		// this.m_Item.curImg.visible = UserFb2.ins().fbChallengeId + 1 == fbId
// 		this.m_Item.curImg.source = finishID + 1 >= fbId ? `propIcon_153_png` : `comp_64_64_10_png`
// 		this.m_Item.pass.visible = finishID >= fbId
// 		if (config.firstAward == null) {
// 			Main.errorBack("fbId:" + fbId + " zsLv:" + config.zsLv + GlobalConfig.languageConfig.st100372);
// 			console.log("fbId:" + fbId + " zsLv:" + config.zsLv + GlobalConfig.languageConfig.st100372);
// 		}
// 		else {
// 			this.m_Item.m_ItemList.dataProvider = new eui.ArrayCollection(config.firstAward);
// 		}

// 		this.m_Item.level.text = GlobalConfig.languageConfig.st100373 + fbId + GlobalConfig.languageConfig.st100369
// 		let str = ""
// 		if (config.zsLv) {
// 			str += StringUtils.addColor(config.zsLv + GlobalConfig.languageConfig.st100067, GameGlobal.actorModel.zsLv >= config.zsLv ? Color.Green : Color.Red)
// 		}
// 		if (config.lv) {
// 			if (str.length > 0) {
// 				str += GlobalConfig.languageConfig.st100374
// 			}
// 			str += StringUtils.addColor(config.lv + GlobalConfig.languageConfig.st100093, GameGlobal.actorModel.level >= config.lv ? Color.Green : Color.Red)
// 		}
// 		this.m_Item.challengeLevel.textFlow = TextFlowMaker.generateTextFlow(GlobalConfig.languageConfig.st100375 + str)

// 		var s = this.monstersConfig[config.monsterId];
// 		this.bossImage.loadUrl(ResDataPath.GetMonsterBodyPath(s.avatar + "_3s"), true, -1)
// 		this.m_Item.m_ElementImg.source = ResDataPath.GetElementImgName(s.elementType);
// 	}
// }
window["FBChallengePanel"] = FBChallengePanel
// window["FBChallengePanelItem"] = FBChallengePanelItem