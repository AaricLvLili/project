class ActivityType6Data extends ActivityBaseData {
	isOpenActivity() {
		var config = GlobalConfig.ins("ActivityConfig")[this.id];
		if (!config) {
			config = GlobalConfig.ins("ActivityAConfig")[this.id];
		}

		if (!config) {
            console.error("ActivityType6Data   config  is null   this.id = ", this.id)
			return false
		}

		if (this.isOpenTime() && this.openState == 1) {
			if (config.params) {
				return config.params.openLevel <= GameGlobal.actorModel.level
			}
			return true
		}
		return false
	}
}
window["ActivityType6Data"]=ActivityType6Data