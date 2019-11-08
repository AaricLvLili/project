class PetSkillIconItem extends eui.ItemRenderer {
	public constructor() {
		super();
	}

	public m_MianGroup: eui.Group;
	public m_Bg: eui.Image;
	public m_Shuo: eui.Image;
	public m_Icon: eui.Image;
	public m_LvLab: eui.Label;
	public m_MainSkill: eui.Label;



	public createChildren() {
		super.createChildren();
		this.addEvent();
	}

	private addEvent() {
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}

	public dataChanged() {
		super.dataChanged();
		let skillId = this.data.id;
		let skillData = GlobalConfig.ins("SkillsConfig")[skillId];
		this.m_Bg.source = ResDataPath.GetItemQualityName(0);
		if (skillData) {
			this.m_Icon.source = skillData.icon + "_png";
			let num = 0;
			if (this.data.type != 1) {
				switch (skillData.displayLevel) {
					case 0:
						num = 0;
						break;
					case 1:
					case 2:
						num = 1;
						break;
					case 3:
					case 4:
						num = 2;
						break;
					case 5:
					case 6:
						num = 3;
						break;
					case 7:
					case 8:
						num = 4;
						break;
					default:
						num = 5;
						break;
				}
			}
			this.m_Bg.source = ResDataPath.GetItemQualityName(num);
		}

		if (this.data.type == 1) {
			this.m_LvLab.visible = true;
			this.m_MainSkill.visible = true;
			let skillstr = skillId.toString();
			let skillLvStr = skillstr.slice(skillstr.length - 3, skillstr.length);
			let skillLv = parseInt(skillLvStr);
			this.m_LvLab.text = "Lv." + skillLv;
		}
		else {
			this.m_LvLab.visible = false;
			this.m_MainSkill.visible = false;
		}
	}
	private onClick(evt: egret.TouchEvent) {
		let skillId = this.data.id;
		let point = new egret.Point(evt.stageX, evt.stageY);
		let data = { skillId: skillId, point: point, type: this.data.type }
		ViewManager.ins().open(PetSkillTips, data);
	}
}
window["PetSkillIconItem"] = PetSkillIconItem