enum DeblockingType {
	TYEP_01 = 1, 		// 熔炼
	TYPE_02 = 2,		// 王者争霸
	TYPE_03 = 3,		// 材料副本	
	TYPE_04 = 4,		// 闯天关	
	TYPE_05 = 5,		// 个人BOSS	
	TYPE_06 = 6,		// 全民BOSS	
	TYPE_07 = 7,		// PK，符文	
	TYPE_08 = 8,		// 矿洞，突破
	TYPE_09 = 9,		// 功勋商店	
	TYPE_10 = 10,		// 每日首充	
	TYPE_14 = 14,		// 商店
	TYPE_15 = 15,		// 神器
	TYPE_17 = 17,		// 特戒
	TYPE_18 = 18,		// 工会boss
	TYPE_19 = 19,		// 心法
	TYPE_20 = 20,		// 跨服Boss
	TYPE_21 = 21,		// 转生Boss
	TYPE_22 = 22,		// 心法副本
	TYPE_23 = 23,		// 世界Boss
	TYPE_24 = 24,		// 神器副本
	TYPE_25 = 25,		// 试炼之路
	TYPE_26 = 26,		// 跨服天梯
	TYPE_27 = 27,		// 运镖
	TYPE_28 = 28,		// 功能预告
	TYPE_29 = 29,		// 转职任务
	TYPE_30 = 30,		// 转职
	TYPE_31 = 31,		// 里装
	TYPE_32 = 32,		// 变身
	TYPE_33 = 33,		// 十连抽
	TYPE_34 = 34,       // 十连杀
	TYPE_35 = 35,       // 羽翼
	TYPE_43 = 43,       // 天赋
	TYPE_44 = 44,       // 戒灵
	TYPE_45 = 45,       // 戒灵BOSS
	TYPE_47 = 47,       // 内功
	TYPE_48 = 48,		// 秘境
	TYPE_60 = 60,		// 宠物
	TYPE_61 = 61,		// 技能
	TYPE_62 = 62,		// 纹章
	TYPE_63 = 63,		// 坐骑
	TYPE_73 = 73,		// 通天塔（宠物）
	TYPE_74 = 74,		// 天空之塔（坐骑）
	TYPE_75 = 75,		// 圣域BOSS
	TYPE_76 = 76,		// 宝石
	TYPE_77 = 77,		// 元神
	TYPE_78 = 78,		// 注灵
	TYPE_79 = 79,		// 遭遇boss
	TYPE_80 = 80,		// 守城boss
	TYPE_81 = 81,		// 属性点
	TYPE_82 = 82,		// 宠物探索
	TYPE_83 = 83,		// 组队副本
	TYPE_84 = 84,		// 一键强化·强化
	TYPE_85 = 85,		// 一键强化·宝石
	TYPE_86 = 86,		// 一键强化·注灵
	TYPE_87 = 87,		// 一键强化·羽翼
	TYPE_88 = 88,		// 一键强化·龙装
	TYPE_89 = 89,		// 威名
	TYPE_90 = 90,		// 转生
	TYPE_91 = 91,		// 魔龙圣殿
	TYPE_92 = 92,		// 圣枪
	TYPE_94 = 94,		// 宠物附身

}

/**功能开启条件 */
enum FUN_OPEN_CONDITION {
	GUAN_QIA_NUM = 1,//通关关卡数
	ACTOR_LEVEL = 2,//人物等级
	VIP_LEVEL = 3,//VIP等级
	OPEN_SERVER_DAY = 4,//开服天数
	LOGIN_DAY = 5,//登录天数
	ZHUAN_ZHI_LEVEL = 6,//转职等级
	SPECIAL_RING = 7,//特戒全部解封
	JOIN_IN_GANG = 8//加入帮会
}

class Deblocking {

	private static KEYS = ["conditionkind", "conditionkind2"]
	private static VALUES = ["conditionnum", "conditionnum2"]
	public static funcOpenConfig: any;

	private static CheckSinge(type: number, value: number): boolean {
		if (!type || !value) {
			return true
		}
		switch (type) {
			case FUN_OPEN_CONDITION.GUAN_QIA_NUM://通关关卡数
				return (UserFb.ins().guanqiaID >= value);

			case FUN_OPEN_CONDITION.ACTOR_LEVEL://人物等级
				return ((UserZs.ins().lv * 1000 + GameGlobal.actorModel.level) >= value);

			case FUN_OPEN_CONDITION.VIP_LEVEL://VIP等级
				return (UserVip.ins().lv >= value);

			case FUN_OPEN_CONDITION.OPEN_SERVER_DAY://开服天数
				return (GameServer.serverOpenDay >= value);

			case FUN_OPEN_CONDITION.LOGIN_DAY://登录天数
				return (GameServer.loginDay >= value);

			case FUN_OPEN_CONDITION.ZHUAN_ZHI_LEVEL://转职等级
				for (let i = 0; i < 3; i++) {
					if ((ZhuanZhiModel.ins().getZhuanZhiLevel(i) >= value)) {
						return true
					}
				}
				return false;

			case FUN_OPEN_CONDITION.SPECIAL_RING://特戒全部解封
				return RingSoulModel.ins().isOpen;

			case FUN_OPEN_CONDITION.JOIN_IN_GANG://加入帮会
				return !(GameLogic.ins().actorModel.guildID == undefined || GameLogic.ins().actorModel.guildID == 0)
		}
		return true
	}

	public static Check(type: number, notTip = false): boolean {
		if (Deblocking.funcOpenConfig == null)
			Deblocking.funcOpenConfig = GlobalConfig.ins("FuncOpenConfig");
		let cfg = Deblocking.funcOpenConfig[type];
		if (!cfg || !cfg.conditionkind) {
			return true
		}
		let result = true
		for (let i = 0; i < this.KEYS.length; ++i) {
			let type = this.KEYS[i]
			let value = this.VALUES[i]
			if (!this.CheckSinge(cfg[type], cfg[value])) {
				result = false
				break
			}
		}
		if (result) {
			return true
		}

		if (!notTip) {
			UserTips.ins().showTips("|C:0xf87372&T:" + cfg.opencondition + "|")
		}
		// Deblocking._ShowTip(conType, conValue, notTip, cfg.opencondition)
		return false
	}

	private static _ShowTip(type, value: number, notTip = false, tipValue) {
		if (notTip) {
			return
		}
		let str = tipValue
		if (!str) {
			switch (type) {
				case 1:
					str = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101423, [value])
					break
				case 2:
					str = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101424, [value]);
					break
				case 3:
					str = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101425, [value]);
					break
			}
		}
		if (str) {
			UserTips.ins().showTips("|C:0xf87372&T:" + str + "|")
		}
	}

	public static IsHide(type: number): boolean {
		if (this.Check(type, true)) {
			return false
		}

		if (Deblocking.funcOpenConfig == null)
			Deblocking.funcOpenConfig = GlobalConfig.ins("FuncOpenConfig");
		let cfg = Deblocking.funcOpenConfig[type];
		if (cfg && cfg.isHide == 1) {
			return true
		}
		return false
	}
	public static IsRedDotBossBtn(): boolean {
		if (!Deblocking.Check(DeblockingType.TYPE_06, true)) {
			return false
		}
		var e = GlobalConfig.ins("PublicBossBaseConfig").openCheck;
		if (UserFb.ins().guanqiaID < e) {
			return false
		} else if (DailyFubenConfig.isCanChallenge() || UserBoss.ins().isCanChalleng() || UserBoss.ins().isCanChallengKf()
			|| HomeBossModel.getInstance.checkAllRedPoint() || SyBossModel.getInstance.checkAllRedPoint()) {
			return true
		}
		return false
	}
	public static IsRedDotGuildBtn(): boolean {
		if (Guild.ins().myOffice >= GuildOffice.GUILD_FUBANGZHU && Guild.ins().hasApplys())
			return true;
		if (GuildFB.ins().hasbtn())
			return true;
		if ((GameLogic.ins().actorModel.guildID == undefined || GameLogic.ins().actorModel.guildID == 0) && GameLogic.ins().actorModel.level > 69)
			return true;
		if (GuildRobber.ins().hasbtn())
			return true;
		return false;
	}
	public static IsRedDotLadderBtn(): boolean {
		if (!Deblocking.Check(DeblockingType.TYPE_07, true))
			return false;
		return Encounter.CheckRedPoint() || Ladder.ins().checkRedShow() == 1
			|| MineModel.ins().mRedPoint.IsRed() || DartCarModel.ins().carRedPoint.IsRed() || AcrossLadderCenter.ins().rankRewardRedPoint() || TenKillModel.getInstance.checkRedPoint();
	}
	public static IsRedDotGadrBtn(): boolean {
		let isShow: boolean = false;
		if (GadModel.getInstance.checkAllRoleCanChangeItem() || GadModel.getInstance.checkAllRoleCanLvUp()) {
			isShow = true;
		}
		return isShow;

	}
	public static IsRedDotFubenBtn(): boolean {
		if (!Deblocking.Check(DeblockingType.TYPE_03, true))
			return false;
		return UserFb.ins().getCount() > 0 || UserFb2.ins().IsRed() || DrillModel.ins().isRed() || TeamFbModel.getInstance.isShowRedPoint();
	}

	public static IsRedDotArtifactBtn(): boolean {
		if (!Deblocking.Check(DeblockingType.TYPE_15, true))
			return false;
		return ArtifactModel.getInstance.checkAllLvUpAndActivate() || ArtifactModel.getInstance.checkAllLayerUp() /**|| ShenQiFBModel.ins().haveRedPoint()*/;
	}

	public static IsRedDotZhuanZhiBtn(): boolean {
		if (!Deblocking.Check(DeblockingType.TYPE_30, true))
			return false;
		return ZhuanZhiModel.ins().zhuanZhiEquipAllRedPoint() || ZhuanZhiModel.ins().zhuanZhiIsRed();
	}

	public static IsRedDotSkillBtn(): boolean {
		if (!Deblocking.Check(DeblockingType.TYPE_61, true))
			return false;
		return UserSkill.ins().checkAllSkillRedPoint() || FuwenModel.ins().CalculationFuwenRedPoint() || NeiGongControl.ins().checkRed() || UserJingMai.ins().IsRed() || PrestigeModel.CheckRedPoint();
	}
}

window["Deblocking"] = Deblocking