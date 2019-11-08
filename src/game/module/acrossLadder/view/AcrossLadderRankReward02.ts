class AcrossLadderRankReward02 extends BaseView implements ICommonWindowTitle {
	public constructor() {
		super();
		this.skinName = "AcrossLadderRankRewardSkin02";
	}
	private list: eui.List;
	public m_Scroller: eui.Scroller;

	open() {
		this.list.itemRenderer = AcrossLadderRankRewardItem02;
		this.list.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.observe(MessageDef.ACROSSLADDER_HISTORY_RANK, this.UpdateContent);
		AcrossLadderCenter.ins().reqAcrossLadderHistoryRank();
	}

	private sort(a: any, b: any) {
		if (a.state == -2 && b.state == -2) {
			if (a.data.paixuId > b.data.paixuId)
				return -1;
			else
				return 1;
		}
		else if (a.state == -2 || b.state == -2) {
			if (a.state == -2)
				return -1;
			else if (b.state == -2)
				return 1;
		}
		else if ((a.state == -1 && b.state == -1) || ((a.state < b.state) && a.state >= 0)) {
			if (a.data.paixuId > b.data.paixuId)
				return -1;
			else
				return 1;
		}
		else if (a.state >= 0 && b.state >= 0) {
			if (a.data.paixuId > b.data.paixuId)
				return -1;
			else
				return 1;
		}
		return a.data.paixuId - b.data.paixuId;
	}

	close() {
		this.removeObserve();
		this.list.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
	}

	public release() {
		this.close();
		this.m_Scroller.stopAnimation();
	}

	private onTap(e: egret.TouchEvent): void {
		var targetName: string = e.target.name;
		var index: number = targetName.indexOf("m_btn");
		if (index != -1) {
			var id: number = Number(targetName.substr(5, targetName.length));
			AcrossLadderCenter.ins().reqAcrossLadderHistoryReward(id);
		}
	}

	UpdateContent(): void {
		var configs = GlobalConfig.ins("KuafuJingJiBestRankAwardConfig");
		var tempArr: Array<Object> = [];
		var flag: number = 0;
		var currentRank: number = AcrossLadderPanelData.ins().rank;
		var rewardCfgIdxArr: Array<string> = AcrossLadderPanelData.ins().rewardCfgIdxArr;
		var id: number = 0;
		for (var key in configs) {
			id = Number(key);
			flag = rewardCfgIdxArr.indexOf(key);
			if (flag == -1) {//没有被完成或者没有领取
				if (currentRank <= id)
					flag = -2;
			}
			tempArr.push({ data: configs[key], state: flag, selfRank: currentRank });
		}
		tempArr.sort(this.sort);

		this.list.dataProvider = new eui.ArrayCollection(tempArr);
	}

	public CheckRedPoint() {
		return AcrossLadderCenter.ins().rankRewardRedPoint();
	}
}
window["AcrossLadderRankReward02"]=AcrossLadderRankReward02