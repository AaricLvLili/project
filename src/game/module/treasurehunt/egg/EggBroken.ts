class EggBroken extends BaseSystem {
	public count: number
	public awards: number
	public endTime: number
	/**天降豪礼活动砸蛋开启天数，当天开启就是0*/
	public diffDay: number = 0;
	public constructor() {
		super();

		this.regNetMsg(S2cProtocol.sc_eggbroken_hunt_result, this.doHuntResult);
		this.regNetMsg(S2cProtocol.sc_eggbroken_record_datas, this.doBestListInfo);
		this.regNetMsg(S2cProtocol.sc_eggbroken_add_record, this.doAddBestList);
		this.regNetMsg(S2cProtocol.sc_eggbroken_info, this.doEggbrokenInfo);
	}

	static ins(): EggBroken {
		return super.ins();
	};
    /**
     * 发送探宝
     * 22-1
     * @param type	探宝类型
    */
	sendHunt(type, activityId: number = 0) {
		var cs_eggbroken_hunt = new Sproto.cs_eggbroken_hunt_request();
		cs_eggbroken_hunt.type = type;
		cs_eggbroken_hunt.activityId = activityId;
		GameSocket.ins().Rpc(C2sProtocol.cs_eggbroken_hunt, cs_eggbroken_hunt);
		// var bytes = this.getBytes(1);
		// bytes.writeShort(type);
		// this.sendToServer(bytes);
	};
	sendHitting(id, activityId: number = 0) {
		var cs_eggbroken_hitting = new Sproto.cs_eggbroken_hitting_request();
		cs_eggbroken_hitting.id = id;
		cs_eggbroken_hitting.activityId = activityId;
		GameSocket.ins().Rpc(C2sProtocol.cs_eggbroken_hitting, cs_eggbroken_hitting);
		// var bytes = this.getBytes(2);
		// this.sendToServer(bytes);
	};
    /**
     * 探宝列表
     * 22-2
     * @param type	探宝类型
     */
	sendHuntList() {
		GameSocket.ins().Rpc(C2sProtocol.cs_eggbroken_record, new Sproto.cs_eggbroken_record_request());
		// var bytes = this.getBytes(2);
		// this.sendToServer(bytes);
	};
    /**
     * 探宝结果
     * 22-1
     */
	doHuntResult(bytes: Sproto.sc_eggbroken_hunt_result_request) {
		var type = bytes.type;
		var num = bytes.items.length;
		var activityId = bytes.activityId;
		var arr = [];
		for (var i = 0; i < num; i++) {
			arr[i] = [bytes.items[i].id, bytes.items[i].count];
		}
		ViewManager.ins().open(EggBrokenResultWin, type, arr, activityId);
		GameGlobal.MessageCenter.dispatch(MessageDef.EGG_BROKEN_RESULT, type)
	};

	doBestListInfo(bytes: Sproto.sc_eggbroken_record_datas_request) {
		EggBroken.postBestListInfo(bytes);
	}
	static postBestListInfo(bytes: Sproto.sc_eggbroken_record_datas_request) {
		var num = bytes.eggbrokenRecord.length;
		var arr = [];
		for (var i = 0; i < num; i++) {
			arr[i] = [bytes.eggbrokenRecord[i].name, bytes.eggbrokenRecord[i].itemid, bytes.eggbrokenRecord[i].count, bytes.eggbrokenRecord[i].activityId];
		}
		arr.reverse();
		return arr;
	};
	doAddBestList(rsp: Sproto.sc_eggbroken_add_record_request) {
		var record = [rsp.eggbrokenRecord.name, rsp.eggbrokenRecord.itemid, rsp.eggbrokenRecord.count, rsp.eggbrokenRecord.activityId];
		GameGlobal.MessageCenter.dispatch(MessageDef.EggBroken_ADDRECORD, record)
	}
	doEggbrokenInfo(rsp: Sproto.sc_eggbroken_info_request) {
		this.count = rsp.count
		this.awards = rsp.awards
		this.endTime = rsp.endTime
		GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_ACTIVITY_PANEL, ActivityModel.CUS_ACT_3.id)
	}

	/**flg:是否是开服活动的砸蛋*/
	HasAward(flg: boolean = true) {
		var config = flg ? GlobalConfig.ins("SEtotalrewardsConfig") : GlobalConfig.ins("SEtotalrewardsAConfig")
		for (let index in config) {
			if ((this.awards & (1 << config[index].index)) == 0 && this.count >= config[index].time)
				return true
		}
		return false
	}

	public static IsOpen(): boolean {
		// return EggBroken.ins().endTime && EggBroken.ins().endTime > GameServer.serverTime
		let config = GlobalConfig.ins("SmashEggsConfig").opentime;
		return (GameServer.serverOpenDay >= config[0] && GameServer.serverOpenDay <= config[1])
	}
}


MessageCenter.compile(EggBroken);
window["EggBroken"] = EggBroken