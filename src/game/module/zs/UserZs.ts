class UserZs extends BaseSystem {



	lv: number = 0
	exp: number;
	upgradeCount: Array<number>;

	private ZhuanShengConfig: any;

	static ins(): UserZs {
		return super.ins()
	}

	public constructor() {
		super();
		this.sysId = PackageID.Zs;
		//this.regNetMsg(1, this.postZsData);
		this.regNetMsg(S2cProtocol.sc_zs_data, this.postZsData);
	}

	/**
     * 处理转生数据
     * 13-1
     * @param bytes
     */
	public postZsData(rsp: Sproto.sc_zs_data_request) {
		let oldLv = this.lv
		let oldExp = this.exp
		this.lv = rsp.lv;
		this.exp = rsp.exp;
		this.upgradeCount = [rsp.expupCount, rsp.normalupCount, rsp.highupCount];
		if (oldLv != this.lv) {
			ActivityModel.SendLevelInfo()
		}
		if (oldExp != this.exp) {
			if (this.exp > oldExp) {
				UserTips.ins().showTips("修为 +" + (this.exp - oldExp))
			}
		}
	};
    /**
     * 发送获取修为
     * 13-1
     * @param type 1 等级转换 2普通道具提升 3高级道具提升
     */
	public sendGetXiuWei(type, itemid: number = -1) {
		var cs_zs_get_exp = new Sproto.cs_zs_get_exp_request();
		cs_zs_get_exp.type = type;
		cs_zs_get_exp.itemid = itemid;
		GameSocket.ins().Rpc(C2sProtocol.cs_zs_get_exp, cs_zs_get_exp);
		// var bytes = this.getBytes(1);
		// bytes.writeByte(type);
		// this.sendToServer(bytes);
	};
    /**
     * 发送提升转生等级
     * 13-2
     */
	public sendZsUpgrade() {
		GameSocket.ins().Rpc(C2sProtocol.cs_zs_uplevel, new Sproto.cs_zs_uplevel_request());
		// var bytes = this.getBytes(2);
		// this.sendToServer(bytes);
	};
	public canUpgrade() {
		var config = GlobalConfig.zhuanShengLevelConfig[this.lv];
		var nextAttConfig = GlobalConfig.zhuanShengLevelConfig[this.lv + 1];
		if (!nextAttConfig)
			return false;
		var flg1 = Checker.Level(null, config.levelLimit, false);
		var flg2 = true;
		for (let i = 0; i < 3; i++) {
			if ((ZhuanZhiModel.ins().getZhuanZhiLevel(i) < config.zzLevelLimit)) {
				flg2 = false;
				break;
			}
		}
		return flg1 && flg2 && this.exp >= nextAttConfig.exp;
	};
	public isMaxLv() {
		if (this.ZhuanShengConfig == null)
			this.ZhuanShengConfig = GlobalConfig.zhuanShengLevelConfig;
		return this.ZhuanShengConfig[this.lv + 1] ? false : true;
	};
	public canGet(i): boolean {
		if (!this.upgradeCount) return
		var config = GlobalConfig.ins("ZhuanShengConfig");
		var sCount;
		if (i == 0) {
			sCount = config.conversionCount - this.upgradeCount[0];
			return (sCount > 0 && Checker.Level(null, config.level + 1, false))
		}
		else if (i == 1) {
			sCount = config.normalCount[UserZs.ins().lv] - this.upgradeCount[1];
			let count1 = UserBag.ins().getBagGoodsCountById(0, config.normalItem);
			return sCount > 0 && count1 > 0;
		}
		else if (i == 2) {
			sCount = config.advanceCount[UserZs.ins().lv] - this.upgradeCount[2];
			let count2 = UserBag.ins().getBagGoodsCountById(0, config.advanceItem);
			return sCount > 0 && count2 > 0;
		}
		return false;
	}
	public canOpenZSWin() {
		var lv = GameLogic.ins().actorModel.level;
		var zs = this.lv != null ? this.lv : 0;
		if (zs <= 0 && lv < 80)
			return false;
		else
			return true;
	};

	public canGetRedPoint(): boolean {
		for (var i = 0; i < 3; i++) {
			if (this.canGet(i))
				return true;
		}
		return false;
	}
}

MessageCenter.compile(UserZs);
window["UserZs"] = UserZs