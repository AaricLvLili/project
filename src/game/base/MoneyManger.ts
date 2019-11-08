class MoneyManger {
	public constructor() {
	}
	public static MoneyConstToSource(id: number) {
		let config = GlobalConfig.ins("LanResourcesConfig")[id];
		if (config) {
			return config.icon;
		}
		return "";
	}

	public static MoneyConstToName(id: number) {
		let config = GlobalConfig.ins("LanResourcesConfig")[id];
		if (config) {
			return config.name;
		}
		return "";
	}

	public static MoneyConstToQuality(id: number) {
		let config = GlobalConfig.ins("LanResourcesConfig")[id];
		if (config) {
			return config.useLevel;
		}
		return 1;
	}
}

enum MoneyConst {
	exp = 0,
	gold = 1,
	yuanbao = 2,
	fame = 3,
	soul = 4,

	GuildContrib = 5,
	GuildFund = 6,

	FEATS = 7,    // 功勋
	RedNameScore = 8,    // 红名
	PRESTIGE = 10,   // 威望
	XIUWEI = 11,   //修为
	HONOR = 12,   //荣耀
	ZHENQI = 14,   //真气
	VIPEXP = 15,   //在线奖励VIP经验
	MiJing = 16,//秘境积分
	sharecoin = 17, //分享币
	RECHARGE = 99,    // 充值
	PETCREDIT = 20,  //宠物积分
	RIDECREDIT = 21, //坐骑积分
	CROSSCREDIT = 22, //跨服积分
	ARTIFACTCREDIT = 23, //神器积分
	WARORDER = 24,//战令
	COUPON = 25,//点卷
	// wing = 105,
}