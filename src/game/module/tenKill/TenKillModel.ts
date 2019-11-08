class TenKillModel {
	private static s_instance: TenKillModel;
	public static get getInstance(): TenKillModel {
		if (!TenKillModel.s_instance) {
			TenKillModel.s_instance = new TenKillModel();
		}
		return TenKillModel.s_instance;
	}

	public buffList: Dictionary<Sproto.buff> = new Dictionary<Sproto.buff>();
	public useCnt: number;
	public winCnt: number;
	public raidType: number;

	public myTeamMaxBlood: number;
	public otherTeamMaxBlood: number;
	public constructor() {
	}
	public setBuffDic(buffs: Sproto.buff[]) {
		this.buffList.clear();
		for (var i = 0; i < buffs.length; i++) {
			this.buffList.set(buffs[i].type, buffs[i]);
		}
	}

	public isBuyBuff(): boolean {
		let isBuy = false;
		let buffList: Sproto.buff[] = this.buffList.values
		for (var i = 0; i < buffList.length; i++) {
			if (buffList[i].sign == true) {
				isBuy = true;
				break;
			}
		}
		return isBuy;
	}

	public checkRedPoint() {
		if (Deblocking.Check(DeblockingType.TYPE_34, true)) {
			let config = GlobalConfig.ins("ShiLianShaCommonConfig");
			if (config) {
				let itemId = config.costItem.id;
				let costItemNum = config.costItem.count;
				let itemType = config.costItem.type;
				let itemNum = UserBag.ins().getBagGoodsCountById(0, itemId);
				if (this.useCnt >= 1 || this.winCnt > 0 || (itemNum >= costItemNum)) {
					return true;
				}
			}
		}
		return false;
	}
}

enum RaidType {
	/**普通关卡 */
	Type2 = 2,
	/**彩蛋关卡 */
	Type3 = 3,
}
window["TenKillModel"] = TenKillModel