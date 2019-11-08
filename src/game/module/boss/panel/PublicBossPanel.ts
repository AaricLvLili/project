class PublicBossPanel extends BaseView implements ICommonWindowTitle {
	public constructor() {
		super()
		this.skinName = "PublicBossPanelSkin";
	}
	private m_Scroller: eui.Scroller;
	list: eui.List
	setting
	listData: eui.ArrayCollection;
	challengeCountTxt
	private lefttimeTF: eui.Label

	private itemAotoEnterList;
	private publicBossBaseConfig: any;
	private isfirst: boolean = true;


	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;
	public m_Lan3: eui.Label;

	protected childrenCreated() {
		this.list.itemRenderer = BossItem;
		this.listData = new eui.ArrayCollection();
		this.list.dataProvider = this.listData;

		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100476;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st100477;
		this.m_Lan3.text = GlobalConfig.jifengTiaoyueLg.st100478;
		this.setting.text = GlobalConfig.jifengTiaoyueLg.st100479;
	};
	open() {
		this.observe(MessageDef.PUBLIC_BOSS_LIST_DATA, this.setData)
		this.AddClick(this.setting, this.onLink);
		this.initData();
		this._UpdateTime()
		TimerManager.ins().doTimer(1000, 0, this._UpdateTime, this)
	};
	close() {
		TimerManager.ins().remove(this._UpdateTime, this)
	};
	private destroyList(): void {
		var len = this.list.numChildren;
		for (var i = 0; i < len; i++) {
			let child = this.list.getChildAt(i);
			if (child instanceof BossItem) {
				child.destroy();
			}

		}
	}

	public release() {
		this.close();
		this.destroyList();
		this.removeObserve();
		this.m_Scroller.stopAnimation();
		this.dataRemoveTick();
	}

	private _UpdateTime() {
		if (this.publicBossBaseConfig == null)
			this.publicBossBaseConfig = GlobalConfig.ins("PublicBossBaseConfig");
		if (UserBoss.ins().challengeCount >= this.publicBossBaseConfig.maxCount) {
			this.lefttimeTF.text = GlobalConfig.jifengTiaoyueLg.st100474;
		} else {
			this.lefttimeTF.text = GlobalConfig.jifengTiaoyueLg.st100475 + `：(${GameServer.GetSurplusTime(UserBoss.ins().restoreTime)})`
		}
	}
	private initData() {
		// egret.setTimeout(function () {
		// if (this.listData && this.listData.source.length <= 0) {
		this.setData();
		// }
		// }, this, 500);
	}

	setData() {
		if (this.publicBossBaseConfig == null)
			this.publicBossBaseConfig = GlobalConfig.ins("PublicBossBaseConfig");

		this.challengeCountTxt.text = UserBoss.ins().challengeCount + "/" + this.publicBossBaseConfig.maxCount;
		var bossInfos = UserBoss.ins().bossInfo.slice();
		let len = bossInfos.length;
		for (let i = 0; i < len; i++) {
			bossInfos[i].selectAutoFight = UserBoss.ins().getAutoFightByIndex(bossInfos[i].id - 1);
		}

		bossInfos.sort(this.compareFn);

		this.destroyList();
		// for(let j=0;j<len;j++)
		// {

		// }
		this.dataRemoveTick();
		// if (this.isfirst) {
		this.listData.removeAll();
		// this.isfirst = false;
		// this.dataAddTick(bossInfos.length);
		// } else {
		this.listData.replaceAll(bossInfos);
		// }
	};
	private dataAddTick(cont: number) {
		this.dataRemoveTick();
		TimerManager.ins().doTimer(50, cont, this.updateDataList, this);
	}
	private dataRemoveTick() {
		TimerManager.ins().remove(this.updateDataList, this);
	}
	private cont: number = 0;
	private updateDataList() {
		// egret.log(egret.getTimer());
		// if (this.listData && this.listData) {
		// 	this.cont++;
		// 	let data: any[] = this.lsListData.splice(0, 1);
		// 	this.listData.addItem(data[0]);
		// }
		this.initData();
	}
	compareFn(a, b) {
		// 1.优先显示已解锁且未死亡的BOSS，排序从高到低
		// 2.次优先显示已解锁且已死亡的，排序从高到低
		// 3.再显示未解锁的BOSS，排序从低到高

		var configA = GlobalConfig.publicBossConfig[a.id][0];
		var configB = GlobalConfig.publicBossConfig[b.id][0];

		let aLevel = configA.level
		let aZsLevel = configA.zsLevel
		let aValue = aZsLevel * 1000 + aLevel

		let bLevel = configB.level
		let bZsLevel = configB.zsLevel
		let bValue = bZsLevel * 1000 + bLevel

		if (a.selectAutoFight && !b.selectAutoFight)
			return -1;
		if (!a.selectAutoFight && b.selectAutoFight)
			return 1;
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
	onLink() {
		ViewManager.ins().open(PubBossRemindWin);
	};


	windowTitleIconName?: string = GlobalConfig.jifengTiaoyueLg.st100463 + "BOSS";

	UpdateContent(): void {

	}
}

window["PublicBossPanel"] = PublicBossPanel