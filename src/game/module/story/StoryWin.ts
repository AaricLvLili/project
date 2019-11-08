class StoryWin extends eui.Component {
	public constructor() {
		super()
		this.skinName = "StoryWinSkin";
	}
	public m_MainGroup: eui.Group;
	public m_Item1: StoryTalkItem;
	public m_Item2: StoryTalkItem;
	public m_Item3: StoryTalkItem;
	public m_TouchGroup:eui.Group;

	public createChildren() {
		super.createChildren();
	}
	public release() {
		this.removeViewEvent();
	}
	private addViewEvent() {
	}
	private removeViewEvent() {
	}
	public setData(dialogueConfig: any, type: number) {
		if (type <= 1) {
			this.m_Item1.setData(dialogueConfig);
		} else {
			this.m_Item2.setData(dialogueConfig);
		}
	}

	public initPoint() {
		this.m_MainGroup.y = 563;
	}
}
ViewManager.ins().reg(PetStarWin, LayerManager.UI_Popup);
window["StoryWin"] = StoryWin