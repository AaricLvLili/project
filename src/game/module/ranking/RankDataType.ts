class RankDataType {
	/** 战力排行 */
	public static TYPE_POWER: number = 0;
	/** 竞技场排行 */
	public static TYPE_ARENA: number = 1;
	/** pk排行 */
	public static TYPE_SKIRMISH: number = 2;
	/** 关卡排行 */
	public static TYPE_PASS: number = 3;
	/** 副本排行 */
	public static TYPE_COPY: number = 4;
	/** 等级排行 */
	public static TYPE_LEVEL: number = 5;
	/** 羽翼排行 */
	public static TYPE_WING: number = 6;
	/** 职业排行（剑士） */
	public static TYPE_JOB_ZS: number = 7;
	/** 职业排行（法师） */
	public static TYPE_JOB_FS: number = 8;
	/** 职业排行（牧师） */
	public static TYPE_JOB_DS: number = 9;
	/** 神功排行 */
	public static TYPE_LILIAN: number = 10;
	/** 王者排行 */
	public static TYPE_LADDER: number = 11;
	/** 宝石排行 */
	public static TYPE_BAOSHI: number = 12;
	/** 威名排行 */
	public static TYPE_PRESTIGE: number = 20;
	/**开服累充 */
	public static TYPE_KFRECHARGE: number = 114;
	/**开服消费 */
	public static TYPE_KFSPEND: number = 115;
	/**跨服累充 */
	public static TYPE_HFRECHARGE: number = 116;
	/**跨服消费 */
	public static TYPE_HFSPEND: number = 117;
	/** */
	public static TYPE_CHONGZHI: number = 122;
	/**幸运转盘 */
	public static TYPE_LUCK: number = 133;
	/** 排名 - short */
	public static DATA_POS = 'pos';
	/** ID - int */
	public static DATA_ID = 'id';
	/** 名字 - string */
	public static DATA_PLAYER = 'player';
	/** 等级 - short */
	public static DATA_LEVEL = 'level';
	/** 转生 - short */
	public static DATA_ZHUAN = 'zhuan';
	/** VIP等级 - short */
	public static DATA_VIP = 'vip';
	/** 月卡 - short */
	public static DATA_MONTH = 'month';
	/** 战斗力 - int */
	public static DATA_POWER = 'power';
	/** 数量 - int */
	public static DATA_COUNT = 'count';
	/** 经验 - int */
	public static DATA_EXP = 'exp';
	/** 职业 - char */
	public static DATA_JOB = 'job';
	/** 性别 - char */
	public static DATA_SEX = 'sex';
	/** 第2名背景标志 */
	public static DATA_BG2 = 'xphb_json.phb_7';
	/** 第3名背景标志 */
	public static DATA_BG3 = 'xphb_json.phb_8';

	/** 排行项目内容 */
	public static ITEMS = []
	//数据对应的读取方式
	public static readFunc = {};



	public static TYPE_ZHANLING: number = 13;
	public static TYPE_LONGHUN: number = 14;
	public static TYPE_XIAOFEI: number = 16;

}

//战力
RankDataType.ITEMS[RankDataType.TYPE_POWER] =
	//羽翼
	RankDataType.ITEMS[RankDataType.TYPE_WING] =
	//职业
	RankDataType.ITEMS[RankDataType.TYPE_JOB_ZS] =
	RankDataType.ITEMS[RankDataType.TYPE_JOB_FS] =
	RankDataType.ITEMS[RankDataType.TYPE_JOB_DS] =
	RankDataType.ITEMS[RankDataType.TYPE_CHONGZHI] =
	RankDataType.ITEMS[RankDataType.TYPE_LUCK]=
	[
		RankDataType.DATA_POS,
		RankDataType.DATA_ID,
		RankDataType.DATA_PLAYER,
		RankDataType.DATA_LEVEL,
		RankDataType.DATA_ZHUAN,
		RankDataType.DATA_VIP,
		RankDataType.DATA_MONTH,
		RankDataType.DATA_POWER,
	];
//pk
RankDataType.ITEMS[RankDataType.TYPE_SKIRMISH] =
	[
		RankDataType.DATA_POS,
		RankDataType.DATA_ID,
		RankDataType.DATA_PLAYER,
		RankDataType.DATA_JOB,
		RankDataType.DATA_SEX,
		RankDataType.DATA_LEVEL,
		RankDataType.DATA_ZHUAN,
		RankDataType.DATA_VIP,
		RankDataType.DATA_COUNT,
		RankDataType.DATA_MONTH,
	];
//等级
RankDataType.ITEMS[RankDataType.TYPE_LEVEL] =
	[
		RankDataType.DATA_POS,
		RankDataType.DATA_ID,
		RankDataType.DATA_PLAYER,
		RankDataType.DATA_LEVEL,
		RankDataType.DATA_ZHUAN,
		RankDataType.DATA_VIP,
		RankDataType.DATA_MONTH,
	];
//关卡 
RankDataType.ITEMS[RankDataType.TYPE_PASS] =
	//副本
	RankDataType.ITEMS[RankDataType.TYPE_COPY] =
	[
		RankDataType.DATA_POS,
		RankDataType.DATA_ID,
		RankDataType.DATA_PLAYER,
		RankDataType.DATA_POWER,
		RankDataType.DATA_VIP,
		RankDataType.DATA_COUNT,
		RankDataType.DATA_MONTH,
	];
//战功
RankDataType.ITEMS[RankDataType.TYPE_LILIAN] =
	[
		RankDataType.DATA_POS,
		RankDataType.DATA_ID,
		RankDataType.DATA_PLAYER,
		RankDataType.DATA_LEVEL,
		RankDataType.DATA_ZHUAN,
		RankDataType.DATA_VIP,
		RankDataType.DATA_MONTH,
		RankDataType.DATA_COUNT,
		RankDataType.DATA_EXP,
	];
// 威名
RankDataType.ITEMS[RankDataType.TYPE_PRESTIGE] =
	[
		RankDataType.DATA_POS,
		RankDataType.DATA_ID,
		RankDataType.DATA_PLAYER,
		RankDataType.DATA_LEVEL,
		RankDataType.DATA_ZHUAN,
		RankDataType.DATA_VIP,
		RankDataType.DATA_MONTH,
		RankDataType.DATA_POWER,
	];

// 王者
RankDataType.ITEMS[RankDataType.TYPE_LADDER] =
	[
		RankDataType.DATA_POS,
		RankDataType.DATA_ID,
		RankDataType.DATA_PLAYER,
		RankDataType.DATA_JOB,
		RankDataType.DATA_SEX,
		RankDataType.DATA_LEVEL,
		RankDataType.DATA_ZHUAN,
		RankDataType.DATA_VIP,
		RankDataType.DATA_COUNT,
		RankDataType.DATA_MONTH,
	];


RankDataType.readFunc[RankDataType.DATA_JOB] =
	RankDataType.readFunc[RankDataType.DATA_SEX] =
	'readByte';
RankDataType.readFunc[RankDataType.DATA_POS] =
	RankDataType.readFunc[RankDataType.DATA_LEVEL] =
	RankDataType.readFunc[RankDataType.DATA_ZHUAN] =
	RankDataType.readFunc[RankDataType.DATA_VIP] =
	RankDataType.readFunc[RankDataType.DATA_MONTH] =
	'readShort';
RankDataType.readFunc[RankDataType.DATA_ID] =
	RankDataType.readFunc[RankDataType.DATA_POWER] =
	RankDataType.readFunc[RankDataType.DATA_COUNT] =
	RankDataType.readFunc[RankDataType.DATA_EXP] =
	'readInt';
RankDataType.readFunc[RankDataType.DATA_POWER] = 'readDouble';
RankDataType.readFunc[RankDataType.DATA_PLAYER] = 'readString';
window["RankDataType"] = RankDataType