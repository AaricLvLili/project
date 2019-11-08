/**开服-周活动-幸运转盘 幸运轮盘 */
class ActivityType31Data extends ActivityBaseData {
	private _goldPool: number; // tag 1
	update(e: Sproto.activity_type31) {
		this.goldPool = e.goldPool;
	}

	public set goldPool(value: number) {
		this._goldPool = value;
	}

	public get goldPool() {
		return this._goldPool;
	}

	isOpenActivity() {
		return this.isOpenTime()
	}

	public static getConfig(id: number) {
		var config = GlobalConfig.activityType17Config[id]
		if (!config) {
			config = GlobalConfig.activityType17AConfig[id]
		}
		if (!config) {
			config = GlobalConfig.activityType17BConfig[id]
		}
		return config
	}

	public static  GetActivityConfig1(id: number) {
		let config = GlobalConfig.activityType4Config[id];
		if (config == null) {
			config = GlobalConfig.activityType4AConfig[id];
		}
		if (config == null) {
			config = GlobalConfig.activityType4BConfig[id];
		}
		return config
	}

}
window["ActivityType31Data"] = ActivityType31Data