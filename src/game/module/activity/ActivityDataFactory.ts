class ActivityDataFactory {
	static create(rsp: any) {
		var typeData: ActivityBaseData
		let id = rsp.baseData.id
		let openState = rsp.baseData.openState
		let startTime = rsp.baseData.startTime
		let endTime = rsp.baseData.endTime
		let type = rsp.baseData.type
		switch (type) {
			case 1:
				typeData = new ActivityType1Data();
				break;
			case 2:
				typeData = new ActivityType2Data();
				break;
			case 3:
				typeData = new ActivityType3Data();
				break;
			case 4:
				typeData = new ActivityType4Data();
				break;
			case 5:
				typeData = new ActivityType5Data();
				break;
			case 6:
				typeData = new ActivityType6Data();
				break;
			case 7:
				typeData = new ActivityType7Data();
				break;
			case 8:
				typeData = new ActivityType8Data();
				break;
			case 9:
				typeData = new ActivityType9Data();
				break;
			case 10:
				typeData = new ActivityType10Data();
				break;
			case 11:
				typeData = new ActivityType11Data();
				break;
			case 12:
				typeData = new ActivityType12Data();
				break;
			case 13:
				typeData = new ActivityType13Data();
				break;
			case 14:
				typeData = new ActivityType14Data();
				break;
			case 15:
				typeData = new ActivityType15Data();
				break;
			case 16:
				typeData = new ActivityType16Data();
				break;
			case 17:
				typeData = new ActivityType17Data();
				break;
			case 18:
				typeData = new ActivityType18Data();
				break;
			case 19:
				typeData = new ActivityType19Data();
				break;
			case 20:
				typeData = new ActivityType20Data();
				break;
			case 21:
				typeData = new ActivityType21Data();
				break;
			case 22:
				typeData = new ActivityType21Data();
				break;
			case 31:
				typeData = new ActivityType31Data();//开服-周活动-幸运转盘 幸运轮盘
				break;
			case 302:
				typeData = new ActivityType302Data();
				break;
			case 2000: typeData = new ActivityType2000Data(); break;
			case 2001: typeData = new ActivityType2001Data(); break;
			case 2002: typeData = new ActivityType2002Data(); break;
			case 2003: typeData = new ActivityType2003Data(); break;
			case 2004: typeData = new ActivityType2004Data(); break;
			case 303: typeData = new ActivityType303Data(); break;
			case 35:
			     
			     break;
			default:
				return null
		}
		if (typeData) {
			typeData.id = id
			typeData.startTime = startTime
			typeData.endTime = endTime
			typeData.type = type
			typeData.openState = openState
			typeData.init();
			typeData.update(rsp)
			var a = typeData.isOpenActivity() && 1 == typeData.openState;
		}
		if (typeData.type == 6 && typeData.isOpenActivity()) {
			GameGlobal.ybTurntableModel.data = typeData
			GameGlobal.ybTurntableModel.activityId = typeData.id
		}
		return typeData
	}
}
window["ActivityDataFactory"] = ActivityDataFactory