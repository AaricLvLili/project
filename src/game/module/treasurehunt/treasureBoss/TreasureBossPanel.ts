class TreasureBossPanel extends BaseView implements ICommonWindowTitle {

	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st100041;
	private bossImage: MovieClip
	private bar: eui.ProgressBar;
	private dec: eui.Label;

	private scroller: eui.Scroller;
	private tab: eui.TabBar;

	private stateGroup: eui.Group;
	private group: eui.List;
	private battleBtn: eui.Button;
	private noRef: eui.Label;
	public bossGroup: eui.Group;
	public m_Lan1: eui.Label;


	public constructor() {
		super();
		this.name = GlobalConfig.jifengTiaoyueLg.st100041;
		this.skinName = "TreasureBossPanelSkin";

	}

	protected childrenCreated() {
		this.tab.itemRenderer = TreasureBossTab;
		this.group.itemRenderer = ItemBase;
		this.bar.slideDuration = 0;
		this.bossImage = new MovieClip;
		this.bossImage.scaleX = -1;
		this.bossImage.x = this.bossGroup.width / 2;
		this.bossImage.y = this.bossGroup.height / 2;
		this.bossGroup.addChild(this.bossImage);
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100045;
		this.battleBtn.label = GlobalConfig.jifengTiaoyueLg.st100046;
		this.noRef.text = GlobalConfig.jifengTiaoyueLg.st100048;
	}

	public open() {
		this.addItemTapEvent(this, this.onTouchTab, this.tab)
		this.AddClick(this.battleBtn, this.onClick);
		MessageCenter.addListener(TreasureBoss.postTreasureBossList, this.listRefush, this);
		this.tab.selectedIndex = 0;
		TreasureBoss.ins().sendTreasureBossList();
	}

	public close() {
		this.removeObserve()
	}

	private onTouchTab(evt) {
		this.updateBossInfo();
	}

	private listRefush(datas): void {
		this.bar.maximum = datas[2];
		this.bar.value = datas[1];
		this.dec.textFlow = TextFlowMaker.generateTextFlow(GlobalConfig.jifengTiaoyueLg.st100042 + StringUtils.addColor(GlobalConfig.jifengTiaoyueLg.st100043, Color.Green)
			+ LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100044, [datas[2]]));

		if (datas[0].length > 0) {
			this.tab.dataProvider = new eui.ArrayCollection(datas[0]);
			this.tab.selectedIndex = 0;
			this.updateBossInfo();
			this.stateGroup.visible = true;
			this.noRef.visible = false;
		}
		else {
			this.tab.dataProvider = new eui.ArrayCollection([0]);
			this.stateGroup.visible = false;
			this.noRef.visible = true;
		}
	}

	private updateBossInfo() {
		var bossInfo: Sproto.treasure_bossinfo = this.tab.selectedItem;
		var treasureHuntBossConfig = GlobalConfig.ins("TreasureHuntBossConfig");
		var config;
		for (var k in treasureHuntBossConfig) {
			let arr = treasureHuntBossConfig[k];
			for (var i = 0; i < arr.length; i++) {
				if (bossInfo.id == arr[i].keyId) {
					config = arr[i];
					break;
				}
			}
		}

		if (config) {
			var boss = GlobalConfig.monstersConfig[config.bossId];
			this.bossImage.loadUrl(ResDataPath.GetMonsterBodyPath(boss.avatar + "_3s"), true, -1);
			this.group.dataProvider = new eui.ArrayCollection(RewardData.ToRewardDatas(config.rewards));
		}
	}

	private onClick(evt: egret.TouchEvent): void {
		TreasureBoss.ins().enterTreasureRaid(this.tab.selectedItem.handle);
		ViewManager.ins().close(TreasureHuntWin);
	}

	UpdateContent() {

	}
}
window["TreasureBossPanel"] = TreasureBossPanel