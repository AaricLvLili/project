class StoryRoleTips extends eui.Component {
	public constructor() {
		super();
		this.skinName = "StoryRoleTipsSkin";
	}
	public m_RoleImg: eui.Image;
	public m_Tips: eui.Label;
	public createChildren() {
		super.createChildren();
	}
}

window["StoryRoleTips"] = StoryRoleTips