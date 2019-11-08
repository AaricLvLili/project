class ActivityType2Panel extends ActivityPanel implements ICommonWindowTitle{

	type2PanelList = []
	cruPanel
	private static activityType2Config;
	public constructor() {
		super()
	}

	childrenCreated() {
	}

	public static IsGift(activityId) {
		if(ActivityType2Panel.activityType2Config == null)
			ActivityType2Panel.activityType2Config = GlobalConfig.ins("ActivityType2Config");
		let config = ActivityType2Panel.activityType2Config[activityId];
		if (config == null) {
			return false
		}
		// return config[4] == null && config[3] != null //这做法有点问题zy
		return activityId == 8;//开服活动特惠礼包zy
	}

	open(arg2) {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.cruPanel && (this.cruPanel.close(), DisplayUtils.removeFromParent(this.cruPanel));
		var configData = GlobalConfig.ins("ActivityConfig")[this.activityID];
        // 界面显示的样式
		if (ActivityType2Panel.IsGift(this.activityID)) {
			// 显示四栏
			this.type2PanelList[this.activityID + ""] || (this.type2PanelList[this.activityID + ""] = new Activity2Panel2, this.type2PanelList[this.activityID + ""].activityID = this.activityID);
		}
		else if(this.activityID == 18)//合服活动特惠礼包
		{
			this.type2PanelList[this.activityID + ""] || (this.type2PanelList[this.activityID + ""] = new Activity2Panel3, this.type2PanelList[this.activityID + ""].activityID = this.activityID);
		}
		else 
		{
			// 显示三栏
			this.type2PanelList[this.activityID + ""] || (this.type2PanelList[this.activityID + ""] = new Activity2Panel1, this.type2PanelList[this.activityID + ""].activityID = this.activityID)
		}

		this.cruPanel = this.type2PanelList[this.activityID + ""], this.cruPanel.open(arg2), this.addChild(this.cruPanel)
	}

	close() {
		for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		DisplayUtils.removeFromParent(this.cruPanel)
	}

	updateData() {
		if (this.cruPanel) {
			this.cruPanel.updateData()
		}
	}

	public GetActivityTimeAndDes() {
		if (ActivityType2Panel.IsGift(this.activityID)) {
			return [false, false]
		}
		return [null, null]
	}
	public UpdateContent() {
		// let list = ActivityModel.ins().getTargetKFActivity();
	}
}
window["ActivityType2Panel"]=ActivityType2Panel