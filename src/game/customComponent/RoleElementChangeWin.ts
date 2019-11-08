class RoleElementChangeWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "RoleElementChangeWinSkin";
	}
	public m_MainGroup: eui.Group;
	public m_ContLab: eui.Label;
	public m_ContLab1: eui.Label;
	private curRole: number;
	public helpBtn: eui.Button;

	public m_ElemTypeLab: eui.Label;

	private m_ElemTypeName = [
		GlobalConfig.jifengTiaoyueLg.st101956,
		GlobalConfig.jifengTiaoyueLg.st101957,
		GlobalConfig.jifengTiaoyueLg.st101958,
		GlobalConfig.jifengTiaoyueLg.st101959,
		GlobalConfig.jifengTiaoyueLg.st101960,
	]
	initUI() {
		super.initUI();
		this.m_ContLab.text = GlobalConfig.jifengTiaoyueLg.st100205;
		this.m_ContLab1.text = GlobalConfig.jifengTiaoyueLg.st100206;
		this.m_bg.init(`RoleElementChangeWin`, GlobalConfig.jifengTiaoyueLg.st100204);
	}
	open(...param: any[]) {
		this.curRole = param[0];
		this.addViewEvent();
		this.setData();
	}
	close() {
		this.release();
		let numChlid = this.m_MainGroup.numChildren;
		for (var i = 0; i < numChlid; i++) {
			let child = this.m_MainGroup.getChildAt(i);
			if (child && child instanceof RoleElementIcon) {
				child.filters = null;
			}
		}
	}
	public release() {
		this.removeViewEvent();

	}
	private addViewEvent() {
		this.AddClick(this.helpBtn, this.onClickHelp);
		this.observe(MessageDef.UPDATE_MAINELEMENT, this.setData)
	}
	private removeViewEvent() {
	}
	private setData() {
		let num = this.m_MainGroup.numChildren;
		let role: Role = SubRoles.ins().getSubRoleByIndex(this.curRole);
		for (var i = 0; i < num; i++) {
			let child = this.m_MainGroup.getChildAt(i);
			if (child && child instanceof RoleElementIcon) {
				child.type = i + 1;
				child.curRole = this.curRole;
				child.setData();
				// if (role.attrElementMianType == (i + 1)) {
				// 	let str = AttributeData.getElementName(role.attrElementMianType)
				// 	let str2 = AttributeData.getElementName(AttributeData.getElementKType(role.attrElementMianType));
				// this.m_ContLab.text = str + "克" + str2;
				// }
			}
		}
		let name = this.m_ElemTypeName[role.attrElementMianType - 1];
		this.m_ElemTypeLab.text = name;
	}
	private onClickClose() {
		ViewManager.ins().close(this);
	}

	private onClickHelp() {
		ViewManager.ins().open(ZsBossRuleSpeak, 34);
	}
}
ViewManager.ins().reg(RoleElementChangeWin, LayerManager.UI_Popup);
window["RoleElementChangeWin"] = RoleElementChangeWin