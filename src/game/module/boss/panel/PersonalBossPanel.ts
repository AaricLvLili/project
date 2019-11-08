class PersonalBossPanel extends BaseView implements ICommonWindowTitle {
	public constructor() {
		super()
		this.skinName = "PersonalBossPanelSkin";
	}
	private m_Scroller: eui.Scroller;
	private list: eui.List;
	private arrData: eui.ArrayCollection

	protected childrenCreated() {
		this.list.itemRenderer = BossItem;
		this.arrData = new eui.ArrayCollection();
		this.list.dataProvider = this.arrData;
	};
	open() {
		this.observe(MessageDef.FB_COUNT_UPDATE, this.setOneData)
		this.setOneData();
	};
	setOneData() {
		let tempArrData = DailyFubenConfig.getPersonalBossFbIds().sort(this.sortFun);
		if (tempArrData && this.arrData) {
			this.arrData.removeAll()
			this.arrData.replaceAll(tempArrData)
			this.arrData.refresh();
		}
	};
	close() {
		TimerManager.ins().remove(this.setOneData, this);
	};
	public release(): void {
		this.close();
		this.removeObserve();
		this.m_Scroller.stopAnimation();
	}
	sortFun(configA, configB) {
		var mode1: FbModel = UserFb.ins().getFbDataById(configA.id);
		var mode2: FbModel = UserFb.ins().getFbDataById(configB.id);
		if (!mode1 || !mode2) {
			return;
		}
		var count1 = mode1.getCount();
		var count2 = mode2.getCount();
		if (count1 > count2)
			return -1;
		if (count1 < count2)
			return 1;
		// if (config1.zsLevel < config2.zsLevel)
		// 	return -1;
		// if (config1.zsLevel > config2.zsLevel)
		// 	return 1;
		// if (config1.levelLimit < config2.levelLimit)
		// 	return -1;
		// if (config1.levelLimit > config2.levelLimit)
		// 	return 1;

		let aLevel = configA.levelLimit
		let aZsLevel = configA.zsLevel
		let aValue = aZsLevel * 1000 + aLevel

		let bLevel = configB.levelLimit
		let bZsLevel = configB.zsLevel
		let bValue = bZsLevel * 1000 + bLevel

		let level = GameGlobal.actorModel.level
		let zsLevel = GameGlobal.zsModel.lv
		let value = zsLevel * 1000 + level

		if (count1 == 0) {
			return aValue - bValue
		}

		if (value >= aValue && value >= bValue) {
			return bValue - aValue
		}
		if (value >= aValue) {
			return -1
		}
		if (value >= bValue) {
			return 1
		}
		return aValue - bValue

		// if (configA.zsLevel < configB.zsLevel)
		// 	return 1;
		// if (configA.zsLevel > configB.zsLevel)
		// 	return -1;
		// if (configA.levelLimit < configB.levelLimit)
		// 	return 1;
		// if (configA.levelLimit > configB.levelLimit)
		// 	return -1;
		// return 0;
	};

	windowTitleIconName?: string = GlobalConfig.jifengTiaoyueLg.st100464 + "BOSS";

	UpdateContent(): void {

	}
}
window["PersonalBossPanel"] = PersonalBossPanel