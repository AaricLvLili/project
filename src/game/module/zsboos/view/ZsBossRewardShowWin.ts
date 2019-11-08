class ZsBossRewardShowWin extends BaseEuiPanel implements ICommonWindow {
	public constructor() {
		super();
		this.skinName = "ZSBossRewardSkin";
		this.itemList1.itemRenderer = ItemBase;
		this.itemList2.itemRenderer = ItemBase;
		this.itemList3.itemRenderer = ItemBase;
		this.itemList4.itemRenderer = ItemBase;
	}

	tab
	bossName
	ranklabel1
	ranklabel2
	ranklabel3
	ranklabel4
	ranklabel5
	ranklabel6
	itemList1
	itemList2
	itemList3
	itemList4
	itemList5
	itemList6
	isZsBoss: boolean
	// closeBtn
	// closeBtn0

	private commonWindowBg: CommonWindowBg

	open(...param: any[]) {
		// this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		// this.closeBtn0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.isZsBoss = param[0];
		this.AddClick(this.tab, this.selectIndexChange);
		this.commonWindowBg.OnAdded(this)
		this.tab.dataProvider = new eui.ArrayCollection(ZsBoss.ins().getBarList(this.isZsBoss));
		this.selectIndexChange(null);
	};
	close() {
		this.commonWindowBg.OnRemoved()
		// this.closeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		// this.closeBtn0.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
	};

	private monstersConfig: any;

	selectIndexChange(e) {
		var cruIndex = this.tab.selectedIndex;

		if (this.monstersConfig == null)
			this.monstersConfig = GlobalConfig.monstersConfig;

		var config = this.isZsBoss ? GlobalConfig.ins("OtherBoss1Config")[cruIndex + 1] : GlobalConfig.ins("WorldBossConfig")[cruIndex + 1];
		this.bossName.text = this.monstersConfig[config.bossId].name + "(" + config.llimit + "-" + config.hlimit + GlobalConfig.jifengTiaoyueLg.st100067 + ")";
		this.ranklabel1.text = config.rankname[0];
		this.ranklabel2.text = config.rankname[1];
		this.ranklabel3.text = config.rankname[2];
		this.ranklabel4.text = config.rankname[3];
		this.ranklabel5.text = config.rankname[4];
		this.ranklabel6.text = config.rankname[5];
		this.itemList1.dataProvider = new eui.ArrayCollection(config.rank1);
		this.itemList2.dataProvider = new eui.ArrayCollection(config.rank2);
		this.itemList3.dataProvider = new eui.ArrayCollection(config.rank3);
		this.itemList4.dataProvider = new eui.ArrayCollection(config.rank4);
		this.itemList5.data = config.killReward;
		this.itemList6.data = config.shield[0].reward;

		this.setEff(this.itemList1);
		this.setEff(this.itemList2);
		this.setEff(this.itemList3);
		this.setEff(this.itemList4);
	};

	setEff(list) {
		list.validateNow()
		for (let i = 0; i < list.numChildren; ++i) {
			let item = list.getChildAt(i) as ItemBase
			if (item) {
				item.showItemEffect()
			}
		}
	}

	OnBackClick(clickType: number): number {
		return 0
	}

	OnOpenIndex(openIndex: number): boolean {
		return true
	}
}

ViewManager.ins().reg(ZsBossRewardShowWin, LayerManager.UI_Main);

window["ZsBossRewardShowWin"] = ZsBossRewardShowWin