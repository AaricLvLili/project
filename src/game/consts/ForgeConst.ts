class ForgeConst {


	/** 可锻造的装备索引 */
	public static CAN_FORGE_EQUIP = [
		EquipPos.WEAPON,
		EquipPos.HEAD,
		EquipPos.CLOTHES,
		EquipPos.NECKLACE,
		EquipPos.BRACELET1,
		EquipPos.BRACELET2,
		EquipPos.RING1,
		EquipPos.RING2,
	];
	/** 装备索引对应的子类型 */
	public static EQUIP_POS_TO_SUB = {
		[EquipPos.WEAPON]: 0,

		[EquipPos.HEAD]: 1,
		[EquipPos.CLOTHES]: 2,
		[EquipPos.NECKLACE]: 3,
		[EquipPos.BRACELET1]: 4,
		[EquipPos.BRACELET2]: 4,
		[EquipPos.RING1]: 5,
		[EquipPos.RING2]: 5,
		// [EquipPos.DZI]: 6,

	}

}

// 0 强化 1 宝石 2 注灵 3 突破
enum ForgeType {
	BOOST = 0,
	GEM = 1,
	ZHULING = 2,
	TUPO = 3,
}
window["ForgeConst"]=ForgeConst