class ZhuanZhiJmAttrWin extends BaseEuiPanel {

	private _lastX = 0;
	private curRole
	private job: eui.Label;
	private leftBtn: eui.Button;
	private rightBtn: eui.Button;
	private closeBtn: eui.Button;
	private attrGroup: eui.Group;
	private attr: eui.Label;
	private skillList: eui.List;
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;

	public constructor() {
		super()
	}

	initUI() {
		super.initUI()
		this.skinName = "ZhuanZhiJmAttrWinSkin";
		this.skillList.itemRenderer = ZhuanZhiJmSkillItem;
		this.m_Lan1.text=GlobalConfig.jifengTiaoyueLg.st101840;
		this.m_Lan2.text=GlobalConfig.jifengTiaoyueLg.st100095;
		this.closeBtn.label=GlobalConfig.jifengTiaoyueLg.st101841;
	};
	open(...param: any[]) {
		this.curRole = param[0];
		this.setRoleAttr(this.curRole);
		this.AddClick(this.leftBtn, this.onTouch);
		this.AddClick(this.rightBtn, this.onTouch);
		this.AddClick(this.closeBtn, this.tapFun);

		this.observe(ZhuanZhiModel.ins().postZhuanZhiJmSkill, this.updateSkillList);
		ZhuanZhiModel.ins().sendZhuanZhiJmSkill(this.curRole);
	};

	close() {
		super.close();
		this.removeEvents();
		this.removeObserve();
	}

	private tapFun(e: egret.TouchEvent): void {
		ViewManager.ins().close(ZhuanZhiJmAttrWin);
	}

	moveAttr(num) {
		var t = egret.Tween.get(this.attrGroup);
		var toNum;
		if (num > 0)
			toNum = 0;
		else
			toNum = 242;
		t.to({ "x": this.attrGroup.x + num, "alpha": 0 }, 200).to({ "x": toNum }, 200).to({ "x": 214, "alpha": 1 }, 200).call(() => {
			egret.Tween.removeTweens(this.attrGroup)
		});
	};

	onTouch(e) {
		switch (e.currentTarget) {
			case this.leftBtn:
				this.setRoleAttr(--this.curRole);
				this.moveAttr(200);
				break;
			case this.rightBtn:
				this.setRoleAttr(++this.curRole);
				this.moveAttr(-200);
				break;
		}
		ZhuanZhiModel.ins().sendZhuanZhiJmSkill(this.curRole);
	};

	attrJob = ["", "attr_zs", "attr_fs", "attr_ds"];
	setRoleAttr(roleId: number): void {
		var role = SubRoles.ins().getSubRoleByIndex(roleId);
		var name = [GlobalConfig.jifengTiaoyueLg.st100111, GlobalConfig.jifengTiaoyueLg.st100112, GlobalConfig.jifengTiaoyueLg.st100113];
		this.job.text = name[role.job - 1];

		var attrStr: string = this.attrJob[role.job];
		var stagesConfig = GlobalConfig.meridianStageConfig[role.zhuanZhiJm.stage]
		var lvConfig = GlobalConfig.meridianLevelConfig[role.zhuanZhiJm.level]
		this.attr.text = AttributeData.getAttStr(AttributeData.AttrAddition(stagesConfig[attrStr], lvConfig[attrStr]), 1)
		this.setBtn();
	};

	private updateSkillList(datas): void {
		this.skillList.dataProvider = new eui.ArrayCollection(datas);
	}

	setBtn() {
		var len = SubRoles.ins().subRolesLen;
		if (len == 1) {
			this.leftBtn.visible = false;
			this.rightBtn.visible = false;
		}
		else if (len > 1) {
			if (this.curRole == 0) {
				this.leftBtn.visible = false;
				this.rightBtn.visible = true;
			}
			else if (this.curRole == 1) {
				this.leftBtn.visible = true;
				if (len < 3)
					this.rightBtn.visible = false;
				else
					this.rightBtn.visible = true;
			}
			else if (this.curRole == 2) {
				this.leftBtn.visible = true;
				this.rightBtn.visible = false;
			}
		}
	};
}
ViewManager.ins().reg(ZhuanZhiJmAttrWin, LayerManager.UI_Popup);

class ZhuanZhiJmSkillItem extends eui.ItemRenderer {
	public constructor() {
		super();
		this.skinName = "ZhuanZhiJmSkillItemSkin";
	}
	private icon: eui.Image;
	private title: eui.Label;
	private desc: eui.Label;
	protected dataChanged(): void {
		let skillsConfig = GlobalConfig.skillsConfig[this.data];
		this.icon.source = `${skillsConfig.icon}_png`;
		this.title.text = `${skillsConfig.skinName} LV.${skillsConfig.displayLevel}`;
		this.desc.text = skillsConfig.desc;
	}
}
window["ZhuanZhiJmAttrWin"] = ZhuanZhiJmAttrWin
window["ZhuanZhiJmSkillItem"] = ZhuanZhiJmSkillItem