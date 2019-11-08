class SkillRecomWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "SkillRecomWinSkin";
	}

	public m_Scroller: eui.Scroller;
	public m_List: eui.List;

	private listData: eui.ArrayCollection;

	private curRole: number;

	public createChildren() {
		super.createChildren();
		this.m_List.itemRenderer = SkillRecomItem;
		this.listData = new eui.ArrayCollection();
		this.m_List.dataProvider = this.listData;
		this.m_bg.init(`SkillRecomWin`, GlobalConfig.jifengTiaoyueLg.st100270);

	}
	initUI() {
		super.initUI();
	}
	open(...param: any[]) {
		this.curRole = param[0];
		this.addViewEvent();
		this.setData();
	}
	close() {
		this.release();
	}
	public release() {
		this.removeViewEvent();
	}
	private addViewEvent() {
	}
	private removeViewEvent() {
	}
	private setData() {
		var subRole = SubRoles.ins().getSubRoleByIndex(this.curRole);
		let config = GlobalConfig.ins("SkillsBuildingConfig")[subRole.job];
		let data = [];
		for (var i = 0; i < config.length; i++) {
			let newdata = { job: subRole.job, index: config[i].index, curRole: this.curRole };
			data.push(newdata);
		}
		this.listData.replaceAll(data);
	}
	private onClickClose() {
		ViewManager.ins().close(this);
	}

}
ViewManager.ins().reg(SkillRecomWin, LayerManager.UI_Popup);
window["SkillRecomWin"]=SkillRecomWin