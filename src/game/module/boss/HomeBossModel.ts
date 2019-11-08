class HomeBossModel {
	private static s_instance: HomeBossModel;
	public static get getInstance(): HomeBossModel {
		if (!HomeBossModel.s_instance) {
			HomeBossModel.s_instance = new HomeBossModel();
		}
		return HomeBossModel.s_instance;
	}
	/**vipBoss配置表数据 */
	public vipBossConfigData: Dictionary<any>;
	/**层次刷新boss cd */
	public layerBossRefCD1: number;
	public layerBossRefCD2: number;
	public layerBossRefCD3: number;
	/**挑战cd */
	public cdJoin: number;

	public layerBossData1: Dictionary<Sproto.public_boss_info>;
	public layerBossData2: Dictionary<Sproto.public_boss_info>;
	public layerBossData3: Dictionary<Sproto.public_boss_info>;

	public remindStats: Sproto.reminds[] = [];
	public constructor() {
		this.vipBossConfigData = new Dictionary<any>();
		this.layerBossData1 = new Dictionary<Sproto.public_boss_info>();
		this.layerBossData2 = new Dictionary<Sproto.public_boss_info>();
		this.layerBossData3 = new Dictionary<Sproto.public_boss_info>();

	}
	public initTypeData() {
		if (this.vipBossConfigData.length > 0) {
			return;
		}
		let publicBossConfigData: any[] = GlobalConfig.ins("PublicBossConfig");
		if (publicBossConfigData) {
			this.vipBossConfigData.clear();
			for (let key in publicBossConfigData) {
				if (parseInt(key) >= 100) {
					this.vipBossConfigData.set(parseInt(key), publicBossConfigData[key][0]);
				}
			}
		}
	}

	public isCanBattle(): boolean {
		let t = Math.max(0, (this.cdJoin || 0) - GameServer.serverTime)
		if (t <= 0) {
			return true;
		}
		return false;
	}

	public get battleCDPrice(): number {
		let t = Math.max(0, (this.cdJoin || 0) - GameServer.serverTime);
		if (t > 0) {
			let config = GlobalConfig.ins("PublicBossBaseConfig");
			let price = t / 60 * parseInt(config.vipcdpirce);
			return Math.floor(price);
		}
		return 0;
	}

	public checkAllRedPoint(): boolean {
		let isHave: boolean = this.checkLayerRedPoint(HomeBossLayerType.LAYERTYPE1);
		if (isHave) {
			return true;
		}
		isHave = this.checkLayerRedPoint(HomeBossLayerType.LAYERTYPE2);
		if (isHave) {
			return true;
		}
		isHave = this.checkLayerRedPoint(HomeBossLayerType.LAYERTYPE3);
		if (isHave) {
			return true;
		}
		return false;
	}

	public checkLayerRedPoint(layer: HomeBossLayerType): boolean {
		let vipLv = UserVip.ins().lv;
		let config = GlobalConfig.ins("PublicBossBaseConfig");
		let configLv = config.vipOpenlLimit[layer - 1];
		if (vipLv < configLv) {
			return false;
		}
		let datas: Sproto.public_boss_info[] = [];
		switch (layer) {
			case HomeBossLayerType.LAYERTYPE1:
				datas = this.layerBossData1.values;
				break;
			case HomeBossLayerType.LAYERTYPE2:
				datas = this.layerBossData2.values;
				break;
			case HomeBossLayerType.LAYERTYPE3:
				datas = this.layerBossData3.values;
				break;
		}
		if (!datas) {
			return false;
		}
		for (var i = 0; i < datas.length; i++) {
			let data: Sproto.public_boss_info = datas[i];
			let bossConfigData: any = this.vipBossConfigData.get(data.id);
			let playerlv = GameLogic.ins().actorModel.level;
			let playerzs = UserZs.ins() ? UserZs.ins().lv : 0;
			let bosslv = bossConfigData.level;
			let bosszs = bossConfigData.zsLevel;
			let bosslvzs = bossConfigData.zsLevel ? bossConfigData.zsLevel * 10 + 80 : bossConfigData.level;
			let playerlvzs = playerzs ? playerzs * 10 + 80 : playerlv;
			if (data.hp <= 0) {
				continue;
			} else if (bossConfigData) {
				if (bosszs) {
					if (playerzs >= bosszs) {
						if (playerlvzs >= bosslvzs + 50) {
							continue;
						} else {
							return true;
						}
					} else {
						continue;
					}
				} else {
					if (playerlvzs >= bosslv + 50) {
						continue;
					} else if (playerlvzs < bosslv) {
						continue
					} else {
						return true;
					}
				}
			}
		}
		return false;
	}
}

enum HomeBossLayerType {
	//同配置表的LevelType；
	LAYERTYPE1 = 1,
	LAYERTYPE2 = 2,
	LAYERTYPE3 = 3,
}
window["HomeBossModel"]=HomeBossModel