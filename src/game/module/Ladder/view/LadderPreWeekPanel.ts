class LadderPreWeekPanel extends BaseView implements ICommonWindowTitle {

	scroller0: eui.Scroller
	list3: eui.List

	scroller1: eui.Scroller
	list4: eui.List

	winNum
	public getReward:eui.Button;

	private levelIcon: LadderLevelIcon

	private rankTab: eui.TabBar
	public m_Lan1: eui.Label;
	private dataTabList: eui.ArrayCollection;
	public constructor() {
		super()
		this.skinName = "LadderPreWeekPanelSkin";
	}

	childrenCreated() {
		this.list3.itemRenderer = LastWeekRankItemRenderer;
		this.list4.itemRenderer = LastWeekRankItemRenderer;

		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100815;
		this.getReward.label = GlobalConfig.jifengTiaoyueLg.st100004;
		this.dataTabList = new eui.ArrayCollection();
		this.rankTab.dataProvider = this.dataTabList;

		let data = [{ name: GlobalConfig.jifengTiaoyueLg.st100813 }, { name: GlobalConfig.jifengTiaoyueLg.st100814 }]
		this.dataTabList.replaceAll(data);
	}
	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st100810
	open() {
		this.getReward.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.rankTab.selectedIndex = 0
		this.rankTab.addEventListener(eui.ItemTapEvent.ITEM_TAP, this._ItemClick, this)
		this._ItemClick()

		this.observe(MessageDef.LADDER_UPWEEK_RANK_UPDATE, this.UpdateContent)
		Ladder.ins().sendGetRankInfo()
	}

	close() {
		this.getReward.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.rankTab.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this._ItemClick, this)
	}

	private _ItemClick() {
		let index = this.rankTab.selectedIndex
		this.scroller0.visible = index == 0
		this.scroller1.visible = index == 1
	}

	onTap(e) {
		switch (e.currentTarget) {
			case this.getReward:
				this.getReward.visible = false;
				Ladder.ins().isCanReward = false;
				Ladder.ins().sendGetWeekReward();
				// this.refushredPoint();
				break;
		}
	};

	UpdateContent() {
		var data = Ladder.ins().upRankList;
		if (data.length > 5) {
			data = data.slice(0, 5);
		}
		this.list3.dataProvider = new eui.ArrayCollection(data);
		this.list4.dataProvider = new eui.ArrayCollection(Ladder.ins().configList);
		this.winNum.text = GlobalConfig.jifengTiaoyueLg.st100800 + Ladder.ins().upWin + GlobalConfig.jifengTiaoyueLg.st100812;
		this.getReward.visible = Ladder.ins().isCanReward;
		if (Ladder.ins().playUpTime) {
			this.levelIcon.SetRank(Ladder.ins().upLevel, Ladder.ins().upId)
		} else {
			this.levelIcon.SetRank(1, 5)
		}
	};
}
window["LadderPreWeekPanel"] = LadderPreWeekPanel