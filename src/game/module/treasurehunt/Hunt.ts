class Hunt extends BaseSystem {
	/**今天抽奖次数*/
	public todayHuntCount:number = 0;
	/**宝箱领取的下标状态 */
	public rewardbin:number = 0;

	public constructor() {
		super();

		this.sysId = PackageID.TreasureHunt;
		this.regNetMsg(S2cProtocol.sc_treasure_hunt_result, this.doHuntResult);
		this.regNetMsg(S2cProtocol.sc_treasure_record_datas, this.doBestListInfo);
		this.regNetMsg(S2cProtocol.sc_treasure_add_record, this.doAddBestList);
		this.regNetMsg(S2cProtocol.sc_treasure_base_info, this.doTreasureBoxInfo);
	}

	static ins(): Hunt {
		return super.ins();
	};
    /**
     * 发送探宝
     * 22-1
     * @param type	探宝类型
    */
	sendHunt(type) {
		var cs_treasure_hunt = new Sproto.cs_treasure_hunt_request();
		cs_treasure_hunt.type = type;
		GameSocket.ins().Rpc(C2sProtocol.cs_treasure_hunt, cs_treasure_hunt);
		// var bytes = this.getBytes(1);
		// bytes.writeShort(type);
		// this.sendToServer(bytes);
	};
    /**
     * 探宝列表
     * 22-2
     * @param type	探宝类型
     */
	sendHuntList() {
		GameSocket.ins().Rpc(C2sProtocol.cs_treasure_record,  new Sproto.cs_treasure_record_request());
		// var bytes = this.getBytes(2);
		// this.sendToServer(bytes);
	};
    /**
     * 探宝结果
     * 22-1
     */
	doHuntResult(bytes:Sproto.sc_treasure_hunt_result_request) {
		var type = bytes.type;
		var num = bytes.items.length;
		var arr = [];
		for (var i = 0; i < num; i++) {
			arr[i] = [bytes.items[i].id, bytes.items[i].count];
		}
		let view = ViewManager.ins().getView(HuntResultWin)
		if (view && view.isShow()) {
			// Hunt.postHuntResult(type, arr);
			GameGlobal.MessageCenter.dispatchImmediate(MessageDef.HUNT_RESULT, [type, arr])
		}
		else {
			ViewManager.ins().open(HuntResultWin, type, arr);
		}
	};
	// static postHuntResult(...params: any[]) {
	// 	return params;
	// };
	doBestListInfo(bytes:Sproto.sc_treasure_record_datas_request) {
		Hunt.postBestListInfo(bytes);
	}
	static postBestListInfo(bytes:Sproto.sc_treasure_record_datas_request) {
		var num = bytes.treasureRecord.length;
		var arr = [];
		for (var i = 0; i < num; i++) {
			arr[i] = [bytes.treasureRecord[i].name, bytes.treasureRecord[i].itemid];
		}
		arr.reverse();
		return arr;
	};
	doAddBestList(rsp:Sproto.sc_treasure_add_record_request) {
		var record = [rsp.treasureRecord.name, rsp.treasureRecord.itemid];
		GameGlobal.MessageCenter.dispatch(MessageDef.HUNT_ADDRECORD, record)
	}

	/**寻宝宝箱基本信息*/
	doTreasureBoxInfo(rsp:Sproto.sc_treasure_base_info_request):void
	{
		this.todayHuntCount = rsp.todayHuntCount;
		this.rewardbin = rsp.rewardbin;
		GameGlobal.MessageCenter.dispatch(MessageDef.HUNT_BOX_INFO)
	}

	/**领取寻宝宝箱奖励*/
	getTreasureDailyAward(id:number):void
	{
		var req = new Sproto.cs_get_treasure_daily_award_request();
		req.id = id;
		GameSocket.ins().Rpc(C2sProtocol.cs_get_treasure_daily_award, req);
	}
}


MessageCenter.compile(Hunt);
window["Hunt"]=Hunt