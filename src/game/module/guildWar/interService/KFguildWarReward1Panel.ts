/**跨服战奖励第一轮主view*/
class KFguildWarReward1Panel extends BaseView implements ICommonWindowTitle {

	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st101064;
	private viewStack: eui.ViewStack;
	public guildReward: KFguildWarGuildRewardPanel;
	public ownReward: KFguildWarOwnRewardPanel;

	public constructor() {
		super()
		this.name = GlobalConfig.jifengTiaoyueLg.st101061;
		this.skinName = "KFguildWarReward1Skin";
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
		view.open(1);
	}

	public UpdateContent(): void {

	}
}
window["KFguildWarReward1Panel"] = KFguildWarReward1Panel