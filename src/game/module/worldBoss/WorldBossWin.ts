class WorldBossWin extends BaseEuiPanel implements ICommonWindow {

	private commonWindowBg: CommonWindowBg;
	private monstersConfig: any;
	private worldBossConfig: any;

	private m_index: number;
	private centerBossImage: MovieClip
	private wbossCenterView;
	private enterGame: eui.Button;
	private wBossOpenTimeLable: eui.Label;
	private seeReward: eui.Label;

	public constructor() {
		super();
		this.skinName = "WorldBossWinSkin";
		this.seeReward.text = GlobalConfig.jifengTiaoyueLg.st101318;
		this.enterGame.label = GlobalConfig.jifengTiaoyueLg.st100501;
	}

	protected childrenCreated(): void {
		UIHelper.SetLinkStyleLabel(this.seeReward);
	}

	private initMc() {
		if (!this.centerBossImage) {
			this.centerBossImage = new MovieClip,
				this.centerBossImage.scaleX = -1,
				this.centerBossImage.scaleY = 1,
				this.centerBossImage.x = 240,
				this.centerBossImage.y = 380,
				this.centerBossImage.touchEnabled = !1;
			this.addChild(this.centerBossImage);
		}
	}

	open() {
		this.commonWindowBg.OnAdded(this);
		this.wbossCenterView.rank.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this)
		this.seeReward.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		this.enterGame.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);

		this.initData();
		this.refushBtn();

		if (ZsBoss.ins().wBossId > 0) {
			this.m_index = ZsBoss.ins().wBossId;
		}
		else {
			this.m_index = ZsBoss.ins().wNextBossId;
		}
		this.refreshCenter(this.worldBossConfig[this.m_index]);
	};

	close() {
		this.commonWindowBg.OnRemoved();
		this.wbossCenterView.rank.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		this.seeReward.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		this.enterGame.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
	};

	initData() {
		if (this.monstersConfig == null)
			this.monstersConfig = GlobalConfig.monstersConfig;

		if (this.worldBossConfig == null)
			this.worldBossConfig = GlobalConfig.ins("WorldBossConfig");
	};

	refreshCenter(config: any) {
		if (config == null) {
			Main.errorBack("世界BOSS数据错误");
			return;
		}

		var playIn = ZsBoss.ins().wAcIsOpen ? GlobalConfig.jifengTiaoyueLg.st100497 : GlobalConfig.jifengTiaoyueLg.st100498;
		this.wbossCenterView.rank.textFlow = new egret.HtmlTextParser().parser("<font color = '#23C42A'><u>" + playIn + "</u></fomt>")

		this.wbossCenterView.bossName.text = this.monstersConfig[config.bossId].name + "(" + config.llimit + "-" + config.hlimit + "转)";
		this.wbossCenterView.rewardList.itemRenderer = ItemBase
		this.wbossCenterView.rewardList.dataProvider = new eui.ArrayCollection(config.showReward)

		this.wBossOpenTimeLable.text = this.worldBossConfig[this.m_index].openTiem;
		this.initMc();
		this.centerBossImage.loadUrl(ResDataPath.GetMonsterBodyPath(this.monstersConfig[config.bossId].avatar + "_3s"), true, -1);
	}

	refushBtn() {
		var model = ZsBoss.ins();
		if (model.wAcIsOpen) {
			this.wbossCenterView.sign.textFlow = new egret.HtmlTextParser().parser("<font color = '#27e327'>" + GlobalConfig.jifengTiaoyueLg.st100500 + "</fomt>")
		} else {
			this.wbossCenterView.sign.textFlow = new egret.HtmlTextParser().parser("<font color = '#ffcc00'>" + GlobalConfig.jifengTiaoyueLg.st100279 + "</fomt>")
		}
		this.wbossCenterView.bossBg.visible = false
	};

	onTouch(e) {
		let target = e.target
		if (target == this.wbossCenterView.rank) {
			this.openRankWin(this.m_index);
		}

		switch (e.target) {
			case this.seeReward:
				ViewManager.ins().open(ZsBossRewardShowWin, false);
				break;
			case this.enterGame:
				if (!ZsBoss.ins().wAcIsOpen) {
					UserTips.ins().showTips(ZsBoss.ins().wPromptList[5]);
					return
				}
				ZsBoss.ins().worldBossChallengeReq();
				break;
		}
	};

	openRankWin(index) {
		ViewManager.ins().open(ZsBossRankWin, index);
	}

}
ViewManager.ins().reg(WorldBossWin, LayerManager.UI_Main);
window["WorldBossWin"] = WorldBossWin