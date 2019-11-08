class ZsBossPanel extends BaseView implements ICommonWindowTitle {
	public constructor() {
		super()
		this.skinName = "ZSBossPanelSkin";
	}

	private monstersConfig: any;
	private otherBoss1Config: any;
	private m_index: number;
	private centerBossImage: MovieClip
	zsbossCenterView

	enterGame
	zsBossOpenTimeLable
	public m_ElementImg: eui.Image;
	public m_AnimGroup: eui.Group;


	protected childrenCreated(): void {
		this.enterGame.label = GlobalConfig.jifengTiaoyueLg.st100501;
		this.zsbossCenterView.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100502;
	}

	open() {
		this.childrenCreated()
		this.AddClick(this.zsbossCenterView.rank, this.onTouch)
		this.AddClick(this.enterGame, this.onTouch);
		MessageCenter.addListener(ZsBoss.ins().postBossList, this.refushBtn, this);

		this.initData();
		this.refushBtn();

		if (ZsBoss.ins().bossId > 0) {
			this.m_index = ZsBoss.ins().bossId;
		}
		else {
			this.m_index = ZsBoss.ins().nextBossId;
		}
		this.refreshCenter(this.otherBoss1Config[this.m_index]);
	};

	close() {
		// this.zsbossCenterView.rank.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		// this.seeReward.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		// this.enterGame.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		// this.clearBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		// ObjectPool.push(this.centerBossImage)
	};

	public release() {
		this.close();
		this.removeObserve();
		DisplayUtils.dispose(this.centerBossImage);
		this.centerBossImage = null;
	}
	private initMc() {
		if (!this.centerBossImage) {
			this.centerBossImage = new MovieClip,
				this.centerBossImage.scaleX = -1,
				this.centerBossImage.scaleY = 1,
				this.centerBossImage.touchEnabled = !1;
			this.m_AnimGroup.addChild(this.centerBossImage);
		}
	}

	initData() {
		if (this.monstersConfig == null)
			this.monstersConfig = GlobalConfig.monstersConfig;

		if (this.otherBoss1Config == null)
			this.otherBoss1Config = GlobalConfig.ins("OtherBoss1Config");
	};

	refreshCenter(config: any) {
		if (config == null) {
			Main.errorBack(GlobalConfig.jifengTiaoyueLg.st100499);
			return;
		}

		// this.seeReward.textFlow = new egret.HtmlTextParser().parser("<font color = '#23C42A'><u>查看奖励</u></fomt>");

		var playIn = ZsBoss.ins().acIsOpen ? GlobalConfig.jifengTiaoyueLg.st100497 : GlobalConfig.jifengTiaoyueLg.st100498;

		this.zsbossCenterView.rank.textFlow = new egret.HtmlTextParser().parser("<font color = '#23C42A'><u>" + playIn + "</u></fomt>")

		this.zsbossCenterView.bossName.text = this.monstersConfig[config.bossId].name + "(" + config.llimit + "-" + config.hlimit + GlobalConfig.jifengTiaoyueLg.st100067 + ")";
		this.zsbossCenterView.rewardList.itemRenderer = ItemBase
		this.zsbossCenterView.rewardList.dataProvider = new eui.ArrayCollection(config.showReward)

		this.zsbossCenterView.rewardList.validateNow();
		for (let i = 0; i < this.zsbossCenterView.rewardList.numChildren; ++i) {
			let item = this.zsbossCenterView.rewardList.getChildAt(i) as ItemBase
			if (item && item instanceof ItemBase) {
				item.showItemEffect()
			}
		}

		this.zsBossOpenTimeLable.text = this.otherBoss1Config[this.m_index].openTiem;
		this.initMc();
		this.centerBossImage.loadUrl(ResDataPath.GetMonsterBodyPath(this.monstersConfig[config.bossId].avatar + "_3s"), true, -1);
		this.m_ElementImg.source = ResDataPath.GetElementImgName(this.monstersConfig.elementType);
	}

	refushBtn() {
		var model = ZsBoss.ins();
		if (model.acIsOpen) {
			this.zsbossCenterView.sign.textFlow = new egret.HtmlTextParser().parser("<font color = '#27e327'>" + GlobalConfig.jifengTiaoyueLg.st100500 + "</fomt>")
		} else {
			this.zsbossCenterView.sign.textFlow = new egret.HtmlTextParser().parser("<font color = '#ffcc00'>" + GlobalConfig.jifengTiaoyueLg.st100279 + "</fomt>")
		}
		// this.zsbossCenterView.bossBg.visible = false
	};

	onTouch(e) {
		let target = e.target
		if (target == this.zsbossCenterView.rank) {
			this.openRankWin(this.m_index);
		}

		switch (e.target) {
			case this.enterGame:
				if (!ZsBoss.ins().acIsOpen) {
					UserTips.ins().showTips(ZsBoss.ins().promptList[5]);
					return
				}
				ZsBoss.ins().sendRequstChallenge();
				break;
		}
	};
	openRankWin(index) {
		ViewManager.ins().open(ZsBossRankWin, index);
	}

	windowTitleIconName?: string = GlobalConfig.jifengTiaoyueLg.st100465 + "BOSS";
	UpdateContent(): void {

	}
}
window["ZsBossPanel"] = ZsBossPanel