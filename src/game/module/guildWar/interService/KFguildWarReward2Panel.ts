/**跨服战奖励第二轮主view*/
class KFguildWarReward2Panel extends BaseView implements ICommonWindowTitle {

	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st101064;
	public viewStack: eui.ViewStack;
	public guildReward: KFguildWarGuildRewardPanel;
	public ownReward: KFguildWarOwnRewardPanel;

	public constructor() {
		super()
		this.name = GlobalConfig.jifengTiaoyueLg.st101059;
		this.skinName = "KFguildWarReward2Skin";
		this.guildReward = new KFguildWarGuildRewardPanel();
		this.ownReward = new KFguildWarOwnRewardPanel();
	}

	public open(...param: any[]) {
		this.viewStack.removeChildren();
		this.viewStack.addChild(this.guildReward);
		this.viewStack.addChild(this.ownReward);
		this.updateViewSelected();
	}

	public close() {
		this.viewStack.removeChildren();
	}

	public updateViewSelected(): void {
		this.viewStack.selectedIndex = KFguildWarRewardBgWin.rewardIndex;
		let view: any = this.viewStack.getElementAt(KFguildWarRewardBgWin.rewardIndex);
		view.open(2);
	}

	public UpdateContent(): void {

	}
}
window["KFguildWarReward2Panel"] = KFguildWarReward2Panel