class LegendShowPanel extends BaseEuiPanel implements ICommonWindow, ICommonWindowTitle, ICommonWindowRoleSelect {
	public static LAYER_LEVEL = LayerManager.UI_Main_2
	public constructor() {
		super()
		this.skinName = "LegendShowPanelSkin"
	}

	windowTitleIconName: string = "L永恒套装R"
	private static SHOW_LIST: any[] = [
		["eff_ui_body800_1", "eff_ui_body800_0", "eff_ui_weapon800_1"],
		["body801/eff_ui_body801_1", "body801/eff_ui_body801_0", "body801/eff_ui_weapon801_1"],
		["body802/eff_ui_body802_1", "body802/eff_ui_body802_0", "body802/eff_ui_weapon802_1"],
		["body803/eff_ui_body803_0", "body803/eff_ui_body803_1", "body803/eff_ui_weapon803_1"],
		["body804/eff_ui_body804_0", "body804/eff_ui_body804_1", "body804/eff_ui_weapon804_1"],
		["body805/eff_ui_body805_0", "body805/eff_ui_body805_1", "body805/eff_ui_weapon805_1"],
	]

	commonWindowBg: CommonWindowBg
	roleShowPanel: RoleShowPanel
	rightBtn: eui.Button
	leftBtn: eui.Button
	rankLabel: eui.Label;
	tipImg: eui.Label
	dressBtn: eui.Button
	useDefault: eui.CheckBox
	// rankLabelGroup: eui.CheckBox

	private m_ShowIndex = 0

	open(...param: any[]) {
		let roleIndex = param[0] ? param[0] : 0

		this.AddClick(this.rightBtn, this._OnClick)
		this.AddClick(this.leftBtn, this._OnClick)
		this.AddClick(this.dressBtn, this._OnClick)
		this.AddClick(this.useDefault, this._OnClick)
		this.observe(MessageDef.LEGEND_UPDATE_DRESS, this.UpdateContent)

		if (LegendModel.ins().IsNewDress(roleIndex)) {
			this.m_ShowIndex = LegendModel.ins().GetShowDressIndex(roleIndex) - 1
		} else {
			let [maxStage, maxFullStage] = LegendModel.GetFullStageByRoleIndex(roleIndex)
			this.m_ShowIndex = Math.min(Math.max(maxFullStage - 1, 0), LegendShowPanel.SHOW_LIST.length - 1)
		}
		LegendModel.ins().SetNewDress(roleIndex)

		this.commonWindowBg.OnAdded(this, 0, roleIndex)
	}

	close() {
		this.commonWindowBg.OnRemoved()
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.target) {
			case this.leftBtn:
				this.m_ShowIndex = Math.max(--this.m_ShowIndex, 0) 
			break
			case this.rightBtn:
				this.m_ShowIndex = Math.min(++this.m_ShowIndex, LegendShowPanel.SHOW_LIST.length - 1) 
			break
			case this.dressBtn:
				LegendModel.ins().SendDress(this._roleId, this.m_ShowIndex)
			break
			case this.useDefault:
				if (this.useDefault.selected &&  SubRoles.ins().getSubRoleByIndex(this._roleId).legendDress != null) {
					LegendModel.ins().SendDress(this._roleId, null)
				}
			break
		}

		this.UpdateContent()
	}

	UpdateContent(): void {
		let role = SubRoles.ins().getSubRoleByIndex(this._roleId);
		let [maxStage, maxFullStage] = LegendModel.GetFullStageByRole(role)
		let stageIndex = this.m_ShowIndex + 1
		let canDress = false
		// if (this.m_ShowIndex == 0) {
		// 	canDress = role.getEquipByIndex(EquipPos.WEAPON).goditem.configID != 0
		// 					&& role.getEquipByIndex(EquipPos.CLOTHES).goditem.configID != 0
		// } else {
			canDress = maxFullStage >= stageIndex
		// }
		this.leftBtn.visible = this.m_ShowIndex > 0
		this.rightBtn.visible = this.m_ShowIndex < LegendShowPanel.SHOW_LIST.length - 1

		this.rightBtn.enabled = this.m_ShowIndex < maxStage

		// this.tipLabel.text = this.m_ShowIndex == 0 ? "集齐武器和护甲即可激活此形象" : "集齐八件同品阶装备即可激活此形象"
		// this.tipImg.text = "集齐八件同品阶装备即可激活此形象"
		this.tipImg.visible = !canDress
		this.dressBtn.enabled = canDress
		// this.useDefault.visible = role.legendDress != null
		this.useDefault.selected = role.legendDress == null
		if (this.m_ShowIndex == role.legendDress) {
			// this.dressBtn.visible = false
			this.dressBtn.enabled = false
			this.dressBtn.label = "已穿戴"
		} else {
			this.dressBtn.label = "穿戴"
		}
		// let data = LegendShowPanel.SHOW_LIST[this.m_ShowIndex]
		// this.roleShowPanel.SetBody(ResDataPath.GetUIEffePath(data[role.sex]), null, null, true)
		// this.roleShowPanel.SetWeapon(ResDataPath.GetUIEffePath(data[2]), null, true)
		LegendShowPanel.SetRoleShowPanel(this.roleShowPanel, this.m_ShowIndex + 1, role.sex)

		// this.rankLabelGroup.visible = this.m_ShowIndex != 0
		// if (this.m_ShowIndex != 0) {
		// 	this.rankLabel.text = TextFlowMaker.getCStr(this.m_ShowIndex)
		// }
		this.rankLabel.text = `${stageIndex}阶永恒神装`

	}

	public static SetRoleShowPanel(roleShowPanel: RoleShowPanel, stage: number, sex: number) {
		let data = LegendShowPanel.SHOW_LIST[stage - 1]
		roleShowPanel.SetBody(ResDataPath.GetUIEffePath(data[sex || 0]), null, null, true)
		roleShowPanel.SetWeapon(ResDataPath.GetUIEffePath(data[2]), null, true)
	}
	
	// windowTitleIconName: string = "ui_cqtz_p_cqtz"

	m_RoleSelectPanel: RoleSelectPanel

	private get _roleId(): number {
		return this.m_RoleSelectPanel.getCurRole()
	}
}
window["LegendShowPanel"]=LegendShowPanel