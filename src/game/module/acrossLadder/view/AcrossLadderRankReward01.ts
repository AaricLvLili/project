class AcrossLadderRankReward01 extends BaseView implements ICommonWindowTitle {
	public constructor() {
		super();
		this.skinName = "AcrossLadderRankRewardSkin01"
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100880;
	}
	public m_Scroller: eui.Scroller;
	private list: eui.List;
	public m_Lan1: eui.Label;

	open() {
		this.list.itemRenderer = AcrossLadderRankRewardItem01;
		var configs = GlobalConfig.ins("KuafuJingJiDayAwardConfig");
		var tempArr: Array<Object> = [];
		for (var key in configs) {
			tempArr.push(configs[key]);
		}
		var len = tempArr.length;
		this.list.dataProvider = new eui.ArrayCollection(tempArr);
	}

	close() {

	}

	public release() {
		this.m_Scroller.stopAnimation();
	}

	UpdateContent(): void { }
}
window["AcrossLadderRankReward01"] = AcrossLadderRankReward01