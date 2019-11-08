class RoleElementIcon extends eui.Component {
	public constructor() {
		super();
	}
	public m_ElementImg: eui.Image;
	public m_SelectImg: eui.Image;
	public type: number = 0;
	public curRole: number;
	public m_Activate: eui.Image;
	public createChildren() {
		super.createChildren();
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}

	public setData() {
		let role: Role = SubRoles.ins().getSubRoleByIndex(this.curRole);
		if (role.attrElementMianType == this.type) {
			this.m_SelectImg.visible = true;
			this.filters = null;
			this.m_Activate.visible = true;
		} else {
			this.m_SelectImg.visible = false;
			FilterUtil.setGayFilter(this);
			this.m_Activate.visible = false;
		}
		this.m_ElementImg.source = ResDataPath.GetElementImgName(this.type);
	}

	private onClick() {
		if (this.m_SelectImg.visible == false) {
			GameLogic.ins().sendChangElement(this.curRole, this.type);
		}
	}

	public release() {
		this.filters = null;
	}
}
window["RoleElementIcon"] = RoleElementIcon