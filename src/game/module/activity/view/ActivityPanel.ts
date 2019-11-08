class ActivityPanel extends BaseEuiPanel {
	public constructor() {
		super()
	}

	private _activityID

	get activityID() {
		return this._activityID
	}
	set activityID(e) {
		this._activityID = e;
		var t = ActivityModel.GetActivityConfig(e)
		this.name = t.tabName
	}

	static create(id) {
		var config = ActivityModel.GetActivityConfig(id)
		let type = config.activityType
		if (type == 9) {
			type = 2
		}

		let typePanel;
		//17合服连充活动
		if (id == 17) {
			typePanel = ObjectPool.ins().pop("HfActivityType3Panel");
		}
		else {
			if (type == 21 || type == 22) {
				typePanel = ObjectPool.ins().pop("ActivityType21Panel");
			} else {
				typePanel = ObjectPool.ins().pop("ActivityType" + type + "Panel");
			}
		}

		typePanel.activityID = id
		typePanel.initUI()
		return typePanel
	}

	initUI() { }

	updateData() { }

	protected GetActData<T>(): T {
		return <T><any>ActivityModel.ins().GetActivityDataById(this.activityID)
	}
}
window["ActivityPanel"] = ActivityPanel