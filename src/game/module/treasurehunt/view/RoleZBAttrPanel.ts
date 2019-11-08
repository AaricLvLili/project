class RoleZBAttrPanel extends BaseEuiPanel {
	public constructor() {
		super()
	}
	public dialogCloseBtn: eui.Button;
	public m_RoleTitle: eui.Label;
	public title: eui.Label;
	public equipPosGroup: eui.Group;
	public equipLvGroup: eui.Group;

	public m_AttLab1: eui.Label;
	public m_AttLab3: eui.Label;
	public m_AttLab2: eui.Label;
	public m_AttLab4: eui.Label;

	public rightBtn: eui.Button;
	public leftBtn: eui.Button;

	private curRole: number;

	private forgeType: ForgeType;

	private m_LibeList: eui.Label[] = [];
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;
	public m_lan1: eui.Label;
	public m_lan2: eui.Label;
	public m_lan3: eui.Label;
	public m_lan4: eui.Label;
	public m_lan5: eui.Label;
	public m_lan6: eui.Label;
	public m_lan7: eui.Label;
	public m_lan8: eui.Label;

	initUI() {
		super.initUI()
		this.skinName = "RoleZBAttrSkin"
		this.m_LibeList.push(this.m_AttLab1, this.m_AttLab2, this.m_AttLab3, this.m_AttLab4);
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100329;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st101833;

		this.m_lan1.text = GlobalConfig.jifengTiaoyueLg.st100114;
		this.m_lan2.text = GlobalConfig.jifengTiaoyueLg.st100115;
		this.m_lan3.text = GlobalConfig.jifengTiaoyueLg.st100116;
		this.m_lan4.text = GlobalConfig.jifengTiaoyueLg.st100117;
		this.m_lan5.text = GlobalConfig.jifengTiaoyueLg.st100118;
		this.m_lan6.text = GlobalConfig.jifengTiaoyueLg.st100118;
		this.m_lan7.text = GlobalConfig.jifengTiaoyueLg.st100119;
		this.m_lan8.text = GlobalConfig.jifengTiaoyueLg.st100119;
	};
	open(...param: any[]) {
		this.curRole = param[0];
		this.forgeType = param[1];
		this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		this.leftBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		this.rightBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		this.setRoleAttr();
	}
	close() {
		this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		this.leftBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		this.rightBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
	}
	onTouch(e) {
		switch (e.currentTarget) {
			case this.leftBtn:
				--this.curRole;
				this.setRoleAttr();
				break;
			case this.rightBtn:
				++this.curRole;
				this.setRoleAttr();
				break;
		}
	};

	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}

	private setRoleAttr(): void {
		let roleId: number = this.curRole;
		var role: Role = SubRoles.ins().getSubRoleByIndex(roleId);
		let config: any;
		let jopName = Role.getJobNameByJob(role.job);
		let forgeName: string;
		switch (this.forgeType) {
			case ForgeType.TYPE0:
				forgeName = GlobalConfig.jifengTiaoyueLg.st100317;
				break;
			case ForgeType.TYPE1:
				forgeName = GlobalConfig.jifengTiaoyueLg.st101194;
				break;
			case ForgeType.TYPE2:
				forgeName = GlobalConfig.jifengTiaoyueLg.st101198;
				break;
		}
		this.title.text = forgeName + GlobalConfig.jifengTiaoyueLg.st101831;
		this.m_RoleTitle.text = jopName + forgeName + GlobalConfig.jifengTiaoyueLg.st101832;
		let dic: Dictionary<any> = new Dictionary<any>();
		for (var i = 0; i < 8; i++) {
			let lv = role.GetEquipLevelByType(i, this.forgeType)
			if (lv) {
				let nameLab: eui.Label = <eui.Label>this.equipPosGroup.getChildAt(i);
				//nameLab.textColor = Color.Green;
				let lvLab: eui.Label = <eui.Label>this.equipLvGroup.getChildAt(i);
				//lvLab.textColor = Color.Green;
				lvLab.text = "+" + lv;
			} else {
				let nameLab: eui.Label = <eui.Label>this.equipPosGroup.getChildAt(i);
				//nameLab.textColor = 0x535557;
				let lvLab: eui.Label = <eui.Label>this.equipLvGroup.getChildAt(i);
				//lvLab.textColor = 0x535557;
				lvLab.text = "+" + 0;
			}
			config = UserForge.ins().getForgeConfigByPos(i, lv, this.forgeType);
			if (config) {
				var attr: any[] = AttributeData.getAttrStrAdd(config.attr, this.forgeType == 0 ? 11 : 12);
				for (var f = 0; f < attr.length; f++) {
					let newData = { value: attr[f].value, type: attr[f].type };
					if (newData.type) {
						let dicData = dic.get(newData.type);
						if (dicData) {
							dicData.value += newData.value;
							dic.set(newData.type, dicData);
						} else {
							let data = newData;
							dic.set(newData.type, data);
						}
					}
				}
			}
		}
		let dicArr: any[] = dic.values;
		for (let i = 0; i < this.m_LibeList.length; i++) {
			let valueData = dicArr[i];
			if (valueData) {
				this.m_LibeList[i].text = AttributeData.getAttStr([dicArr[i]], 1);
			} else {
				this.m_LibeList[i].text = "";
			}
		}
		this.setBtn();
	};

	private setBtn() {
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
	}
}


ViewManager.ins().reg(RoleZBAttrPanel, LayerManager.UI_Popup);
window["RoleZBAttrPanel"] = RoleZBAttrPanel