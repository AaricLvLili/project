class KfBossItem extends eui.ItemRenderer {
	public constructor() {
		super();
	}

	config
	public bg: eui.Image;
	public timeTxt: eui.Label;
	public head: eui.Image;
	public nameTxt: eui.Label;
	public bar: eui.ProgressBar;
	public item: ItemBase;
	public chanceTxt: eui.Label;

	public infoTxt: eui.Label;
	public list: eui.List;
	public challengeBtn: eui.Button;
	public infoTxt0: eui.Image;

	public barGroup: eui.Group;
	public pigBar: eui.ProgressBar;
	public pigDec: eui.Label;
	public m_ElementImg: eui.Image;


	protected childrenCreated(): void {
		this.list.itemRenderer = ItemBase
	}

	public static SetRewardData(item: ItemBase, label: eui.Label, config) {
		let rewardData = config.winnerReward[0]
		item.data = RewardData.ToRewardData(rewardData)
		item.validateNow();
		if (rewardData.rate == 100) {
			label.text = GlobalConfig.jifengTiaoyueLg.st100480;
		} else {
			label.text = GlobalConfig.jifengTiaoyueLg.st100481;
		}
		item.showLegendEffe();
	}

	private monstersConfig: any;
	dataChanged() {

		if (this.monstersConfig == null)
			this.monstersConfig = GlobalConfig.monstersConfig;

		var model = this.data;

		var config1 = GlobalConfig.kuafuBossConfig[model.id];
		var config = this.config = config1[0];
		KfBossItem.SetRewardData(this.item, this.chanceTxt, config)

		this.validateNow();
		this.list.dataProvider = new eui.ArrayCollection(config.desc);
		var isDie = model.isDie;
		this.infoTxt.touchEnabled = true;
		this.infoTxt.addEventListener(egret.TextEvent.LINK, this.onLink, this);
		this.infoTxt0.touchEnabled = true;
		this.infoTxt0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.infoTxtKill, this);

		this.infoTxt.textFlow = (new egret.HtmlTextParser()).parser(GlobalConfig.jifengTiaoyueLg.st100484 + "：<u><a href=\"event:2\">" + model.people + "人</a></u>" + (model.challengeing ? "<font color=\"#008f22\">" + GlobalConfig.jifengTiaoyueLg.st100485 + "</font>" : ""))//+ "\n\n掉落：");
		this.infoTxt.visible = !isDie;
		this.infoTxt0.visible = false;//跨服boss击杀记录暂时屏蔽
		this.bar.value = model.hp;
		var bossConfig = this.monstersConfig[config.bossId];

		//maxKillScore大于0是金猪
		if (model.maxKillScore > 0) {
			this.barGroup.visible = true;
			this.pigBar.maximum = model.maxKillScore;
			this.pigBar.value = model.killScore;
			this.timeTxt.visible = false;
		}
		else {
			this.barGroup.visible = false;
			this.timeTxt.visible = isDie;
		}

		if (this.timeTxt.visible) {
			this.updateTime();
			TimerManager.ins().doTimer(100, 0, this.updateTime, this);
		}

		this.challengeBtn.visible = !isDie;
		this.challengeBtn.name = "kfBoss";
		if (this.challengeBtn.visible) {
			var cdTime = (UserBoss.ins().cdTime - egret.getTimer()) / 1000;
			if (model.challengeing && cdTime > 0) {
				this.challengeBtn.enabled = false;
				this.challengeBtn.touchEnabled = false;
			}
			else {
				this.challengeBtn.label = GlobalConfig.jifengTiaoyueLg.st100046;
				this.challengeBtn.enabled = true;
				this.challengeBtn.touchEnabled = true;

			}
		}
		this.bar.visible = true;

		if (bossConfig) {
			this.head.source = ResDataPath.getBossHeadImage(bossConfig.head);//bossConfig.head + "_png";
			this.nameTxt.text = "" + bossConfig.name;
			this.pigDec.text = GlobalConfig.jifengTiaoyueLg.st100503 + bossConfig.name;
			this.m_ElementImg.source = ResDataPath.GetElementImgName(bossConfig.elementType);
		}

	};

	updateTime() {
		var model = this.data;
		var time = model.reliveTime - egret.getTimer();
		this.timeTxt.text = DateUtils.getFormatBySecond(Math.floor(time / 1000), 1) + GlobalConfig.jifengTiaoyueLg.st100494;
		if (time <= 0) {
			UserBoss.ins().sendBossList();
			TimerManager.ins().remove(this.updateTime, this);
		}
	};

	infoTxtKill(e) {
		ViewManager.ins().open(WildBossRecordWin, this.data.id);
	}

	onLink(e) {
		var model = this.data;
		switch (e.text) {
			case "1":
				ViewManager.ins().open(WildBossRecordWin, model.id);
				break;
			case "2":
				ViewManager.ins().open(WildBossJoinWin, model.id);
				break;
		}
	};
}

window["KfBossItem"] = KfBossItem