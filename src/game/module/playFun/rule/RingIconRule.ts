class RingIconRule extends RuleIconBase {

	private funcBar: eui.ProgressBar
	private funcIcon: eui.Button;

	public constructor(t) {
		super(t)
		this.updateMessage = [
			MessageDef.RING_UPDATE_OPEN_DATA,
			MessageDef.RING_UPDATE_TASK_DATA,
			MessageDef.RING_UPDATE_DATA,
			MessageDef.LEVEL_CHANGE,
		]

		this.funcBar = t.getChildByName("bar")
		this.funcIcon = t.getChildByName("icon")
	}

	checkShowIcon() {
		if (!SpecialRing.IsDeblocking()) {
			return false
		}
		let ringId = SpecialRing.ins().GetCurActId()
		if (SpecialRing.ins().HasRing(ringId)) {
			return false
		}
		this._Update()
		let state = SpecialRing.ins().GetCurActSurplusTime() > 0 && ringId > 0
		this.tar.visible = state
		return state
	}

	update() {
		super.update()
		this._Update()
	}

	private _Update() {
		let ringId = SpecialRing.ins().GetCurActId()
		if (!ringId || SpecialRing.ins().HasRing(ringId)) {
			return
		}
		this.funcIcon.icon = `fun_sj0${SpecialRingWin.GetIdIndex(ringId)}_png`
		let config = GlobalConfig.ins("PublicSpecialringConfig")[ringId]
		let count = 0
		let cur = 0
		for (let taskId of config.condition) {
			++count
			let taskInfo = SpecialRing.ins().GetTaskInfo(taskId)
			if (taskInfo && taskInfo.state != RewardState.NotReached) {
				++cur
			}
		}
		this.funcBar.maximum = count
		this.funcBar.value = cur
	}

	getEffName(e) {
		return this.DefEffe(e)
	}

	tapExecute() {
		ViewManager.ins().open(SpecialRingActivityPanel)
	}
}
window["RingIconRule"]=RingIconRule