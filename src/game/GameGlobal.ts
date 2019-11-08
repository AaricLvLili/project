class GameGlobal {

	// public static TEST_FUNC = true
	public static TEST_FUNC = false

	static get ybTurntableModel(): YbTurntableModel {
		return YbTurntableModel.ins()
	}

	static get dressmodel(): DressModel {
		return DressModel.ins()
	}

	static get taskModel(): UserTask {
		return UserTask.ins()
	}
	
	static get activityData() {
		return ActivityModel.ins().activityData
	}

	static get rechargeData(): RechargeData[] {
		return Recharge.ins().rechargeData
	}
	static get firstRechargeData(): FirstRechargeData {
		return Recharge.ins().firstRechargeData
	}

	static get activityModel(): ActivityModel {
		return ActivityModel.ins()
	}

	// static get summerActivityModel():SummerActivityModel {
	// 	return SummerActivityModel.ins();
	// }

	static get serverOpenDay(): number {
		// return 10
		return GameServer.serverOpenDay
	}

	static get BitmapNumber(): BitmapNumber {
		return BitmapNumber.ins()
	}

	static get MessageCenter(): MessageCenter {
		return MessageCenter.ins()
	}

	static get vipModel(): UserVip {
		return UserVip.ins()
	}

	static get zsModel(): UserZs {
		return UserZs.ins()
	}

	static get actorModel(): ActorModel {
		return GameLogic.ins().actorModel
	}

	static get ViewManager(): ViewManager {
		return ViewManager.ins()
	}

	static get ZsBossModel(): ZsBoss {
		return ZsBoss.ins()
	}

	static get zhuZaiModel(): ZhuzaiEquip {
		return ZhuzaiEquip.ins()
	}

	static get mineModel(): MineModel {
		return MineModel.ins()
	}

	public static get rolesModel(): Role[] {
		return SubRoles.ins().rolesModel
	}



	public static roleHintCheck(role, type) {
		var count = 1
		let cost = 0
		let r = 0
		let itemID = 0
		switch (type) {
			case 0:
				count = role.exRingsData[0];
				var s = GlobalConfig.ins("ExRing0Config")[count];
				s && (cost = s.cost, itemID = GlobalConfig.ins("ExRingConfig")[0].costItem);
				break;
			case 1:
				count = role.exRingsData[1];
				var a = GlobalConfig.ins("ExRing1Config")[count];
				a && (cost = a.cost, itemID = GlobalConfig.ins("ExRingConfig")[1].costItem);
				break;
			case 2:
				count += role.loongSoul;
				var l = GlobalConfig.ins("LoongSoulConfig")[count];
				l && (cost = l.count, itemID = l.itemId);
				break;
			case 3:
				count += role.shield;
				var h = GlobalConfig.ins("ShieldConfig")[count];
				h && (cost = h.count, itemID = h.itemId);
				break;
			case 4:
				count = role.jingMaiData.level;
				var p = GlobalConfig.jingMaiLevelConfig[count];
				p && (cost = p.count, itemID = p.itemId)
		}
		return cost && (r = UserBag.ins().getBagGoodsCountById(0, itemID), r >= cost) ? !0 : !1
	}

	public static getAttrPower(attr: any): number {
		return UserBag.getAttrPower(attr)
	}

	public static GetItemName(itemId: number): string {
		let config = GlobalConfig.itemConfig[itemId]
		if (!config) {
			return " "
		}
		return config.name
	}
}
window["GameGlobal"]=GameGlobal