class SkillIconItem extends eui.ItemRenderer {
	public constructor() {
		super();
		this.skinName = "SkillIconSkin";
	}
	public m_MianGroup: eui.Group;
	public m_Bg: eui.Image;
	public m_Icon: eui.Image;
	public m_LvLab: eui.Label;
	public m_MainSkill: eui.Group;
	public m_Mask: eui.Rect;
	public m_Shuo: eui.Label;
	public static img: SkillMoveImg;

	public isCanUse: boolean = false;

	public isGuideUser: boolean = false;
	public m_RedPoint: eui.Image;
	public m_TipsImg: eui.Image;
	public createChildren() {
		super.createChildren();
		this.m_Mask.visible = false;
		this.m_Shuo.visible = false;
		this.addEvent();
	}

	private addEvent() {
		this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onClickBegin, this, true, 10);
		this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onClickOut, this, true, 15);
		this.addEventListener(egret.TouchEvent.TOUCH_END, this.onClickEnd, this, true, 20);
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}

	public dataChanged() {
		super.dataChanged();
		this.m_LvLab.visible = false;
		this.m_MainSkill.visible = false;
		this.isCanUse = false;
		let data: { skillId: number, job: number, curRole: number, index: number } = this.data;
		if (data.skillId >= 0) {
			let skillsConfig = GlobalConfig.ins("SkillsConfig")[data.skillId];
			if (skillsConfig) {
				this.m_Icon.source = skillsConfig.icon + "_png";
				if (skillsConfig.skillType == SkillType.TYPE1) {
					this.m_MainSkill.visible = true;
					this.m_TipsImg.source = "comp_26_26_4_png";
				} else if (skillsConfig.skillType == SkillType.TYPE4) {
					this.m_MainSkill.visible = true;
					this.m_TipsImg.source = "comp_26_26_3_png";
				}
			}
			this.m_LvLab.visible = true;
			// let str: string = data.skillId + "";
			// let strLv: string = str.slice(str.length - 3, str.length);
			// let skillLv = parseInt(strLv);
			let skillLv = UserSkill.ins().getskillLv(data.curRole, data.index);
			if (skillLv == UserSkill.ins().maxLv) {
				this.m_LvLab.text = "MAX";
			} else {
				this.m_LvLab.text = "Lv." + skillLv + "/" + UserSkill.ins().maxLv;
			}
			this.isCanUse = true;
		} else {
			this.m_Icon.source = "";
		}
		if ((!data.skillId || data.skillId < 0) && UserSkill.ins().checkAddSkillRedPoint(data.curRole)) {
			this.m_RedPoint.visible = true;
		} else {
			this.m_RedPoint.visible = false;
		}
	}
	private onClickBegin(evt: egret.TouchEvent) {
		this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onClickMove, this);
		if (this.isCanUse == true) {
			this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onClickMove, this);
			if (!SkillIconItem.img) {
				SkillIconItem.img = new SkillMoveImg();
				SkillIconItem.img.width = 60;
				SkillIconItem.img.height = 60;
				SkillIconItem.img.anchorOffsetX = SkillIconItem.img.width / 2;
				SkillIconItem.img.anchorOffsetY = SkillIconItem.img.height / 2;
				SkillIconItem.img.touchEnabled = false;
			}
			let data: { skillId: number, job: number, curRole: number, index: number } = this.data;
			let imgData = { job: data.job, level: null, curRole: data.curRole, index: data.index }
			SkillIconItem.img.setData(imgData);
			this.stage.addChild(SkillIconItem.img);
			let x = evt.stageX;
			let y = evt.stageY;
			SkillIconItem.img.x = x;
			SkillIconItem.img.y = y;
		}
	}

	private onClickEnd() {

		let data: { job: number, level: number, curRole: number, index: number };
		if (SkillJobIconItem.img && SkillJobIconItem.img.data) {
			data = SkillJobIconItem.img.data;
		}
		if (SkillIconItem.img && SkillIconItem.img.data) {
			data = SkillIconItem.img.data;
			SkillIconItem.img.release();
		}
		if (data != null) {
			if (data.index == this.data.index) {
				return;
			}
			var subRole = SubRoles.ins().getSubRoleByIndex(data.curRole);
			let skillIndex = subRole.skillsDataIndex;
			let newIndexs = [];
			for (var i = 0; i < 7; i++) {
				let newIndex = -1;
				if (skillIndex[i]) {
					newIndex = skillIndex[i];
				}
				if (newIndex == data.index) {
					newIndex = -1;
				}
				newIndexs.push(newIndex);
			}
			let gridIndex = this.itemIndex;
			newIndexs[gridIndex] = data.index;

			let resultList = UserSkill.ins().cutListHaveModMainSkill(newIndexs, data.curRole, data.index);
			UserSkill.ins().sendSkillSetFight(data.curRole, resultList);
			if (this.isGuideUser == true) {
				if (this.parent) {
					GameGlobal.MessageCenter.dispatch(MessageDef.GUIDE_SKILL_END);
				}
			}
		}
		if (this.stage) {
			this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onClickMove, this);
		}
	}

	private onClickMove(evt: egret.TouchEvent) {
		let x = evt.stageX;
		let y = evt.stageY;
		if (SkillIconItem.img) {
			SkillIconItem.img.x = x;
			SkillIconItem.img.y = y;
		}
	}

	private onClickOut(evt: egret.TouchEvent) {
		let data: { job: number, level: number, curRole: number, index: number };
		if (SkillIconItem.img) {
			data = SkillIconItem.img.data
			SkillIconItem.img.release();
		}
		if (data != null) {
			var subRole = SubRoles.ins().getSubRoleByIndex(data.curRole);
			let skillIndex = subRole.skillsDataIndex;
			let newIndexs = [];
			for (var i = 0; i < 7; i++) {
				let newIndex = -1;
				if (skillIndex[i]) {
					newIndex = skillIndex[i];
				}
				if (newIndex == data.index) {
					newIndex = -1;
				}
				newIndexs.push(newIndex);
			}
			UserSkill.ins().sendSkillSetFight(data.curRole, newIndexs);
		}
		this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onClickMove, this);
	}

	private onClick() {
		let nowdata: { skillId: number, job: number, curRole: number, index: number } = this.data;
		if (nowdata.index <= 0) {
			return;
		}
		var subRole = SubRoles.ins().getSubRoleByIndex(nowdata.curRole);
		let skillIndex = subRole.skillsDataIndex;
		let index = skillIndex[this.itemIndex];
		let data = { job: nowdata.job, curRole: nowdata.curRole, index: index };
		ViewManager.ins().open(SkillShowWin, data);
	}

}
window["SkillIconItem"] = SkillIconItem