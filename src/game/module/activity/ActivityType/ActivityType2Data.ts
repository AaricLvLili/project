class ActivityType2Data extends ActivityBaseData {

	buyData: number[] = [0, 0, 0, 0]
	update(t: Sproto.activity_type02) {
		this.buyData = [];
		for (var len = t.buyData.length, i = 0; len > i; i++) {
			this.buyData.push(t.buyData[i])
		}
		MessageCenter.ins().dispatch(MessageDef.UPDATE_ACTIVITY2_MSG);
	}

	canReward() {
		return this.isOpenActivity() && this.IsRedpointType2()
	}

	isOpenActivity() {
		return this.isOpenTime()
	}

	public GetConfigData() {
		return ActivityType2Data.GetConfig(this.id)
	}

	public IsRedpointType2() {
		var state = false
		let config = this.GetConfigData()
		try {
			for (var i = 0; i < config.length && !(state = this.IsRedpointType2Item(i)); i++);
		} catch (r) {
			egret.log("获取限购可购布尔值报错！"), egret.warn(r)
		}
		return state
	}

	public IsRedpointType2Item(index: number) {
		var state = false
		try {
			let config = this.GetConfigData()
			let configData = config[index]
			let surplusCount = this.buyData[index] || 0
			let a = 1 == configData.currencyType ? GameGlobal.actorModel.gold : GameGlobal.actorModel.yb
			let l = 1 == configData.currencyType
			// let l = true
			let h = parseInt(a + "") >= configData.price
			let p = surplusCount > 0
			if ((UserVip.ins().lv >= configData.vip) && l && h && p) {
				state = true
			}
		} catch (u) {
			egret.log("获取限购可购布尔值报错！"), egret.warn(u)
		}
		return state
	}

	public static GetConfig(id: number) {
		var config = GlobalConfig.ins("ActivityType9Config")[id]
		if (!config) {
			config = GlobalConfig.ins("ActivityType2Config")[id]
		}
		if (!config) {
			config = GlobalConfig.ins("ActivityType2AConfig")[id]
		}
		return config
	}
}
window["ActivityType2Data"]=ActivityType2Data