class BossBloodPanelTypeNull implements IBossBloodPanel {

	private m_Context: BossBloodPanel

	public constructor(context: BossBloodPanel) {
		this.m_Context = context
	}

	DoOpen() {
		let context = this.m_Context
		if (!context) {
			return
		}
		context.cd.visible = false
		context.see.visible = false
		context.hudun.visible = false
	}

	OnRefreshTargetInfo() {
	}

	OnAutoClearCD() {
	}

	OnAddEvent() {
	}

	OnRemoveEvent() {
	}

	OnSeeReward() {
	}

	OnClearCD() {
	}

	ClearData() {
	}
}
window["BossBloodPanelTypeNull"]=BossBloodPanelTypeNull