class MonthSingPanel extends BaseView {
	private m_SingDayLab: eui.Label;
	private m_Scroller: eui.Scroller;
	private m_List: eui.List;
	private m_ListData: eui.ArrayCollection;
	private m_RetroactiveLab: eui.Label;
	public m_LanLab: eui.Label;

	public constructor() {
		super();
		this.skinName = "MonthSingSkin";
		this.m_List.itemRenderer = MonthSingItem;
		this.m_ListData = new eui.ArrayCollection();
		this.m_List.dataProvider = this.m_ListData;
		this.m_LanLab.text = GlobalConfig.jifengTiaoyueLg.st100011;
	}
	private removeEvent() {
		GameGlobal.MessageCenter.removeListener(MessageDef.UPDATE_ACTIVITY_PANEL, this.setData, this);
	}
	public open() {
		GameGlobal.MessageCenter.addListener(MessageDef.UPDATE_ACTIVITY_PANEL, this.setData, this);
		this.setData();
	};
	public close() {
		this.release();
	};
	private release() {
		this.removeEvent();
	}
	private setData() {
		var activityData: ActivityType20Data = <ActivityType20Data>GameGlobal.activityData[201];
		if (activityData) {
			this.m_SingDayLab.text = activityData.signInDay + '';
			this.m_RetroactiveLab.text = activityData.mondCnt + GlobalConfig.jifengTiaoyueLg.st100006;
			let datas: any[] = [];
			let isDaySing: boolean = false;
			let loginConfig: any = GlobalConfig.ins("LoginConfig");
			if (activityData.todaySigan == 1) {
				isDaySing = true;
			}
			let buSing: number = 0;
			for (var i = 0; i < activityData.siganInData.length; i++) {
				let data = loginConfig[activityData.month][i][0];
				if (isDaySing == false && activityData.siganInData[i] == SingType.SINGTYPE1) {
					isDaySing = true;
					data["siganInData"] = SingType.SINGTYPE3;
				} else {
					if (buSing < activityData.mondCnt && activityData.siganInData[i] == SingType.SINGTYPE1) {
						buSing++;
						data["siganInData"] = activityData.siganInData[i];
					} else if (activityData.siganInData[i] == SingType.SINGTYPE1) {
						data["siganInData"] = SingType.SINGTYPE0;
					} else {
						data["siganInData"] = activityData.siganInData[i];
					}
				}
				data["singIndex"] = i + 1;
				datas.push(data);
			}
			this.m_ListData.replaceAll(datas);
		}
	}
}

window["MonthSingPanel"] = MonthSingPanel