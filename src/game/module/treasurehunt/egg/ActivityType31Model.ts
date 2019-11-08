class ActivityType31Model extends BaseSystem {
	static isPlayTween: boolean = false;
	static bCanClose: boolean = true;//是否可以关闭界面
	public constructor() {
		super();

		this.regNetMsg(S2cProtocol.sc_luckywheel_hunt, this.doHuntone);
		this.regNetMsg(S2cProtocol.sc_luckywheel_record, this.doLuckywheelRecord);
		this.regNetMsg(S2cProtocol.sc_luckywheel_add_record, this.doLuckywheelAddRecord);
		this.regNetMsg(S2cProtocol.sc_luckywheel_goldPool_broadcast, this.doLuckywheelGoldPool);


	}
	static ins(): ActivityType31Model {
		return super.ins();
	};
	/**
     * 发送探宝
     * 
    */
	sendHuntOne(type, activityId: number = 0) {
		var cs_luckywheel_hunt = new Sproto.cs_luckywheel_hunt_request();
		cs_luckywheel_hunt.type = type;
		cs_luckywheel_hunt.activityId = activityId;
		this.Rpc(C2sProtocol.cs_luckywheel_hunt, cs_luckywheel_hunt);
	};

	/**
     * 探宝结果
     * 
     */
	doHuntone(bytes: Sproto.sc_luckywheel_hunt_request) {
		var type = bytes.type;
		if (bytes.items) {
			var num = bytes.items.length;
		}
		var activityId = bytes.activityId;
		var activityData = <ActivityType31Data>GameGlobal.activityData[activityId];
		if (activityData) {
			activityData.goldPool = bytes.goldCount;
		}

		var arr = [];
		for (var i = 0; i < num; i++) {
			arr[i] = [bytes.items[i].id, bytes.items[i].count];
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.HUNT_LUCK_REWARD, type, arr)
	};


	sendLuckywheelList() {
		this.Rpc(C2sProtocol.cs_luckywheel_record, new Sproto.cs_luckywheel_record_request());
	};


	doLuckywheelRecord(bytes: Sproto.sc_luckywheel_record_request) {
		ActivityType31Model.postBestListInfo(bytes);
	}

	private doLuckywheelGoldPool(e: Sproto.sc_luckywheel_goldPool_broadcast_request) {
		var activityData = <ActivityType31Data>GameGlobal.activityData[e.activityId];
		if (activityData) {
			activityData.goldPool = e.goldPool;
			GameGlobal.MessageCenter.dispatch(MessageDef.HUNT_LUCK_GOODPOOL, e.goldPool)
		}
	}

	static postBestListInfo(bytes: Sproto.sc_luckywheel_record_request) {
		var num = bytes.luckywheelRecord.length;
		var arr = [];
		for (var i = 0; i < num; i++) {
			arr[i] = [bytes.luckywheelRecord[i].name, bytes.luckywheelRecord[i].itemid];
		}
		arr.reverse();
		return arr;
	};

	doLuckywheelAddRecord(rsp: Sproto.sc_luckywheel_add_record_request) {
		var record = [rsp.luckyWheelRecord.name, rsp.luckyWheelRecord.itemid];
		if (ActivityType31Model.isPlayTween == false) {
			setTimeout(function () {
				GameGlobal.MessageCenter.dispatch(MessageDef.HUNT_LUCK_ADDLOG, record)
			}, 5000);
		} else {
			GameGlobal.MessageCenter.dispatch(MessageDef.HUNT_LUCK_ADDLOG, record)
		}
	}
}

MessageCenter.compile(ActivityType31Model);
window["ActivityType31Model"] = ActivityType31Model