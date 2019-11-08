class YbTurntableModel extends BaseSystem {
	level = 1
	// isBuyed = false
	chargeRecord = 0
	msgList = []

	data

	activityId = 0

	public static ins(): YbTurntableModel {
		return super.ins()
	}

	public constructor() {
		super()

		this.regNetMsg(S2cProtocol.sc_yb_turntable_info, this.doGetInfo)
		// this.regNetMsg(S2cProtocol.sc_yb_turntable_buy_cb, this.doBuyCb)
		this.regNetMsg(S2cProtocol.sc_yb_turntable_roll_start_cb, this.doRollStartCb)
		// this.regNetMsg(S2cProtocol.sc_yb_turntable_roll_finish_cb, this.doRollFinishCb)
		this.regNetMsg(S2cProtocol.sc_yb_turntable_msg, this.doMsg)

		GameGlobal.MessageCenter.addListener(MessageDef.UPDATE_RECHARGE, () => {
			// _Log("MessageDef.UPDATE_RECHARGE ===========> ")
			this.isOpenActivity() && this.sendGetInfo(this.data.id)
		}, this)
	}


	sendGetInfo(id: number) {
		// _Trace("-----------------SendGetInfo")
		let req = new Sproto.cs_yb_turntable_info_request
		req.activityId = id
		this.Rpc(C2sProtocol.cs_yb_turntable_info, req)
	}

	private doGetInfo(e: Sproto.sc_yb_turntable_info_request) {
		this.activityId = e.activityId
		this.level = e.level
		// this.isBuyed = e.isBuyed
		this.chargeRecord = e.chargeRecord

		GameGlobal.MessageCenter.dispatch(MessageDef.YB_TURNTABLE_UPDATE)
	}

	// sendBuy(e) {
		// let req = new Sproto.cs_yb_turntable_buy_request
		// req.activityId = e
		// this.Rpc(C2sProtocol.cs_yb_turntable_buy, req)
	// }

	// doBuyCb(e: Sproto.sc_yb_turntable_buy_cb_request) {
	// 	var activityId = e.activityId
	// 	let result = e.result
	// 	this.isBuyed = result, result ? this.sendRollStart(activityId) : egret.log("购买钻石转盘失败")
	// }

	sendRollStart(e) {
		let req = new Sproto.cs_yb_roll_start_request
		req.activityId = e
		this.Rpc(C2sProtocol.cs_yb_roll_start, req)
	}

	doRollStartCb(rsp: Sproto.sc_yb_turntable_roll_start_cb_request) {
		if (rsp.result) {
			var i = rsp.activityId
			GameGlobal.MessageCenter.dispatch(MessageDef.YBTURNTABLE_START, rsp.resultId)
		} else egret.log("开始钻石转盘失败")
	}

	// sendRollFinish(e) {
	// 	let req = new Sproto.cs_yb_roll_finish_request
	// 	req.activityId = e
	// 	this.Rpc(C2sProtocol.cs_yb_roll_finish, req)
	// }

	// doRollFinishCb(e: Sproto.sc_yb_turntable_roll_finish_cb_request) {
	// 	var activityId = e.activityId
	// 	e.result ? (GameGlobal.ybTurntableModel.isBuyed = !1, this.sendGetInfo(activityId)) : egret.log("结束钻石转盘失败")
	// }

	doMsg(e: Sproto.sc_yb_turntable_msg_request) {
		var t: string = (e.name),
			i = e.count,
			n = parseFloat(e.rate as any),
			r = "<font color=0x00A5FF>" + t + "</font> 投资" + i + "钻石获得",
			o = "<font color=0x08FF00>" + n + "倍返还</font>",
			s = ",共计<font color=0x08FF00>" + Math.floor(i * n) + "钻石</font>",
			a = r + o + s;
		let func = () => {
			GameGlobal.ybTurntableModel.msgList.push(a)
			GameGlobal.ybTurntableModel.msgList.length > 50 && (GameGlobal.ybTurntableModel.msgList = GameGlobal.ybTurntableModel.msgList.slice(GameGlobal.ybTurntableModel.msgList.length - 49, GameGlobal.ybTurntableModel.msgList.length))
			GameGlobal.MessageCenter.dispatch(MessageDef.YBTURNTABLE_RECORD_MSG)
		}
		if (t == GameGlobal.actorModel.name) {
			egret.setTimeout(func,this, 5000)
		} else {
			func()
		}
	}



	get config() {
		var e = null;
		try {
			for (var t = this.getConfig(this.data.id), i = 0, n = t; i < n.length; i++) {
				var r = n[i];
				if (r.level == this.level || t.indexOf(r) == t.length - 1) {
					e = r;
					break
				}
			}
		} catch (o) {
			egret.log("获取钻石轮盘配置错误"), egret.log(o)
		}
		return e
	} 
	
	get maxLevel() {
		var e = 0;
		try {
			var t = this.getConfig(this.data.id);
			e = t.length
		} catch (i) {
			egret.log("获取钻石轮盘最大等级错误"), egret.log(i)
		}
		return e
	}

	isOpenActivity() {
		// return this.data && this.data.isOpenActivity() ? (this.sendGetInfo(this.data.id), !0) : !1
		return this.data && this.data.isOpenActivity() ? (!0) : !1
	}

	canStart() {
		var e = !1;
		return e
	}

	remainTime() {
		var e = 0;
		try {
			var t = this.data;
			e = Math.floor(t.endTime - GameServer.serverTime)
		} catch (i) {
			egret.log("钻石转盘活动剩余时间异常"), egret.log(i)
		}
		return e
	}

	private getConfig(id: number) {
		var config = GlobalConfig.ins("ActivityType6Config")[id]
		if (!config) {
			config = GlobalConfig.ins("ActivityType6AConfig")[id]
		}
		return config
	}
}
window["YbTurntableModel"]=YbTurntableModel