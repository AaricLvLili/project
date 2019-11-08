class ActivityType303Data extends ActivityBaseData {


	private records: number = 0;
	update(e) {
		this.records = e.records;
	}

	public isAllCanBattle() {
		let config = ActivityType303Data.getConfig(303);
		for (var i = 0; i < config.length; i++) {
			let type = this.isCanBattle(i);
			if (type == battleType303.TYPE1) {
				return true;
			}
		}
		return false;
	}

	public isCanBattle(index: number): number {

		let re = this.records & 1 << index;
		if (re <= 0) {
			if (index != 1) {
				let re = this.records & 1 << index - 1;
				if (re <= 0) {
					return battleType303.TYPE2;
				} else {
					return battleType303.TYPE1;
				}
			} else {
				return battleType303.TYPE1;
			}
		}
		return battleType303.TYPE3;
	}

	canReward() {
		var config = ActivityType303Data.getConfig(this.id);
		if (!config) {
			return false
		}

		for (let configData of config) {
			let state = this.isCanBattle(configData["index"]);
			if (state == 3)
				return true;
		}
		return false
	}

	isOpenActivity() {
		return this.isOpenTime()
	}

	public static getConfig(id: number) {
		var config = GlobalConfig.ins("ActivityType303Config")[id]
		if (!config) {
			config = GlobalConfig.ins("ActivityType303AConfig")[id]
		}
		return config
	}

}

enum battleType303 {
	/**能打 */
	TYPE1 = 1,
	/**不能打 */
	TYPE2 = 2,
	/**打完*/
	TYPE3 = 3,
}

window["ActivityType303Data"] = ActivityType303Data