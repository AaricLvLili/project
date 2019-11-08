class TheGunSkillItem extends eui.ItemRenderer {
	public constructor() {
		super();
	}
	public m_MianGroup: eui.Group;
	public m_Bg: eui.Image;
	public m_Icon: eui.Image;
	public m_Cont: eui.Label;
	public m_SelectImg: eui.Image;
	public m_RedPoint: eui.Image;
	public m_Mask: eui.Rect;
	public dataChanged() {
		super.dataChanged();
		let skillLv = this.data;
		let theGunModel = TheGunModel.getInstance;
		this.m_RedPoint.visible = false;
		this.m_Mask.visible = false;
		if (skillLv <= 0) {
			let skillSoltData: { slot: number, lv: number, skillId: number } = theGunModel.skillSoltDic.get(this.itemIndex + 1);
			this.m_Cont.text = skillSoltData.lv + GlobalConfig.jifengTiaoyueLg.st100674;//"阶解锁";
			this.m_Icon.source = skillSoltData.skillId + "_png";
			this.m_Mask.visible = true;
		} else {
			let skillSoltData: { slot: number, lv: number, skillId: number } = theGunModel.skillSoltDic.get(this.itemIndex + 1);
			this.m_Icon.source = skillSoltData.skillId + "_png";
			this.m_Cont.text = skillLv + GlobalConfig.jifengTiaoyueLg.st100093;//"级";
			let isCanUp = theGunModel.checkSkillUp(skillSoltData.skillId, skillLv);
			if (isCanUp) {
				this.m_RedPoint.visible = true;
			}
		}
		if (theGunModel.skillSelect == this.itemIndex) {
			this.m_SelectImg.visible = true;
		} else {
			this.m_SelectImg.visible = false;
		}
	}

}
window["TheGunSkillItem"] = TheGunSkillItem