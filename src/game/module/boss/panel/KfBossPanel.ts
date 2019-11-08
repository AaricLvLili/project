class KfBossPanel extends BaseView implements ICommonWindowTitle {
	public constructor() {
		super()
		this.skinName = "KfBossPanelSkin";
	}
	private m_Scroller: eui.Scroller;

	public list: eui.List
	private listData: eui.ArrayCollection;

	protected childrenCreated() {
		this.list.itemRenderer = KfBossItem;
		this.listData = new eui.ArrayCollection();
		this.list.dataProvider = this.listData;

	};
	open() {
		this.observe(MessageDef.KF_BOSS_LIST_DATA, this.setData)
		UserBoss.ins().sendGetKfBossList();
		this.setData();
	};

	close() {
		this.removeObserve()
	};

	public release() {
		this.close();
		this.removeObserve();
		this.m_Scroller.stopAnimation();
	}

	setData() {

		var bossInfos = UserBoss.ins().kFbossInfo.slice();
		bossInfos.sort(this.compareFn);
		this.listData.replaceAll(bossInfos);
	};

	compareFn(a, b) {
		// 1.优先显示已解锁且未死亡的BOSS，排序从高到低
		// 2.次优先显示已解锁且已死亡的，排序从高到低
		// 3.再显示未解锁的BOSS，排序从低到高

		var configA = GlobalConfig.kuafuBossConfig[a.id][0];
		var configB = GlobalConfig.kuafuBossConfig[b.id][0];

		let aLevel = configA.level
		let aZsLevel = configA.zsLevel
		let aValue = aZsLevel * 1000 + aLevel

		let bLevel = configB.level
		let bZsLevel = configB.zsLevel
		let bValue = bZsLevel * 1000 + bLevel

		if (a.openChallenge && !b.openChallenge)
			return -1;
		else if (!a.openChallenge && b.openChallenge)
			return 1;
		else if (a.openChallenge && b.openChallenge) {
			if (a.isDie && !b.isDie)
				return 1;
			else if (!a.isDie && b.isDie)
				return -1;
			else if (!a.isDie && !b.isDie)
				return aValue < bValue ? 1 : -1;
			else
				return aValue < bValue ? -1 : 1;
		} else {
			return aValue < bValue ? -1 : 1;
		}
	};

	windowTitleIconName?: string = GlobalConfig.jifengTiaoyueLg.st100466 + "BOSS";
	UpdateContent(): void {

	}
}

window["KfBossPanel"] = KfBossPanel