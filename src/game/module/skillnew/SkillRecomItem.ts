class SkillRecomItem extends eui.ItemRenderer {
	public constructor() {
		super();
	}

	public m_MainScroller: eui.Scroller;
	public m_MainList: eui.List;
	public m_UserBtn: eui.Button;

	public m_TitleLab: eui.Label;

	private listData: eui.ArrayCollection;

	public m_List: eui.List;
	private listData2: eui.ArrayCollection;

	public createChildren() {
		super.createChildren();
		this.m_MainList.itemRenderer = SkillRecomIconItem;
		this.listData = new eui.ArrayCollection();
		this.m_MainList.dataProvider = this.listData;

		this.m_List.itemRenderer = SkillRecomIconItem;
		this.listData2 = new eui.ArrayCollection();
		this.m_List.dataProvider = this.listData2;
		this.addEvent();
		this.m_UserBtn.label = GlobalConfig.jifengTiaoyueLg.st100272;
	}

	private addEvent() {
		this.m_UserBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}


	public dataChanged() {
		super.dataChanged();
		let data: { job: number, index: number, curRole: number } = this.data;
		let skillsBuildingConfig = GlobalConfig.ins("SkillsBuildingConfig")[data.job][data.index - 1];
		if (skillsBuildingConfig) {
			let skillIndex: { job: number, curRole: number, index: number, jobLv: number }[] = [];
			for (var i = 0; i < skillsBuildingConfig.skillId.length; i++) {
				let newdata = { job: data.job, curRole: data.curRole, index: skillsBuildingConfig.skillId[i], jobLv: data.index - 1 };
				skillIndex.push(newdata);
			}
			let lastIndex = skillIndex.pop();
			this.listData.replaceAll(skillIndex);
			this.listData2.replaceAll([lastIndex]);
			this.m_TitleLab.text = skillsBuildingConfig.roleName
		}
	}

	private onClick() {
		let data: { job: number, index: number, curRole: number } = this.data;
		let numChild = this.m_MainList.numChildren;
		let skillIndex = [];
		let isTips: boolean = false;
		for (var i = 0; i < numChild; i++) {
			let child = this.m_MainList.getChildAt(i);
			if (child instanceof SkillRecomIconItem) {
				if (child.isCanUse == true) {
					skillIndex.push(child.index);
				} else {
					skillIndex.push(-1);
					isTips = true;
				}
			}
		}
		let child2 = this.m_List.getChildAt(0);
		if (child2 instanceof SkillRecomIconItem) {
			if (child2.isCanUse == true) {
				skillIndex.push(child2.index);
			} else {
				skillIndex.push(-1);
				isTips = true;
			}
		}
		if (isTips) {
			WarnWin.show(GlobalConfig.jifengTiaoyueLg.st100271, function () {
				UserSkill.ins().sendSkillSetFight(data.curRole, skillIndex);
				ViewManager.ins().close(SkillRecomWin);
			}, this);
		} else {
			UserSkill.ins().sendSkillSetFight(data.curRole, skillIndex);
			ViewManager.ins().close(SkillRecomWin);
		}

	}

}
window["SkillRecomItem"]=SkillRecomItem