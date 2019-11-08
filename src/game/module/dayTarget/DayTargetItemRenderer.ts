/** 子级item*/
class DayTargetItemRenderer extends eui.ItemRenderer {
	public constructor() {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE, this.uiCompHandler, this);
		this.skinName = "DayTargetItem";
		this.awardBtn.label = GlobalConfig.jifengTiaoyueLg.st101076;
	}

	private uiCompHandler(e: eui.UIEvent): void {
		this.removeEventListener(eui.UIEvent.COMPLETE, this.uiCompHandler, this);
		this.addEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.removeStage, this);
		this.list.itemRenderer = ItemBase;
		this.awardBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTap, this);
	}

	private touchTap(e: egret.TouchEvent): void {
		ActivityModel.ins().sendReward(DayTargetPanel.curActId, 0);
	}

	private removeStage(e: egret.TouchEvent): void {
		this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.removeStage, this);
		this.awardBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTap, this);
	}

	public desc: eui.Label;
	public awardBtn: eui.Button;
	public list: eui.List;
	public noTf: eui.Label;

	protected dataChanged(): void {
		super.dataChanged();
		this.data;
		this.list.dataProvider = new eui.ArrayCollection(this.data.rewards);
		switch (DayTargetPanel.curActId) {
			case 1001://羽翼
				this.desc.text = GlobalConfig.jifengTiaoyueLg.st101339 + this.data.value;
				break;
		}

		var s: string = StringUtils.addColor("(" + GameGlobal.activityModel.myDabiaoInfo + "/" + this.data.value + ")", GameGlobal.activityModel.myDabiaoInfo >= this.data.value ? Color.Green : Color.Red);
		this.desc.textFlow = TextFlowMaker.generateTextFlow(this.data.desc + this.data.value + s);

		//NotReached = 0, // 未达成CanGet = 1,		// 可以领取Gotten = 2,		// 已经领取Undo = 3不能完成
		if (this.data.state == RewardState.NotReached) {
			this.awardBtn.visible = false;
			this.noTf.text = GlobalConfig.jifengTiaoyueLg.st100680;
		} else if (this.data.state == RewardState.CanGet) {
			this.awardBtn.visible = true;
			this.noTf.text = "";
		} else if (this.data.state == RewardState.Gotten) {
			this.awardBtn.visible = false;
			this.noTf.text = GlobalConfig.jifengTiaoyueLg.st101340;
		}
		else if (this.data.state == RewardState.Undo) {
			this.awardBtn.visible = false;
			this.noTf.text = GlobalConfig.jifengTiaoyueLg.st100680;
		}


	}

}
window["DayTargetItemRenderer"] = DayTargetItemRenderer