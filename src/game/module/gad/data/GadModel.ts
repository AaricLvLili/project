class GadModel {
	private static s_instance: GadModel;
	public static get getInstance(): GadModel {
		if (!GadModel.s_instance) {
			GadModel.s_instance = new GadModel();
		}
		return GadModel.s_instance;
	}
	public constructor() {
		this.gadDic = new Dictionary<Dictionary<GadData>>();
		this.gadBagDic = new Dictionary<GadBagData>();
		this.lvUpSelectData = new Dictionary<GadBagData>();
		for (var i = 0; i < 3; i++) {
			let newDic = new Dictionary<GadData>();
			this.gadDic.set(i, newDic);
			for (var f = 0; f < 6; f++) {
				let gadData = new GadData;
				gadData.slot = f + 1;
				gadData.itemid = - 1;
				gadData.roleId = i;
				gadData.exp = 0;
				gadData.level = 0;
				gadData.attr = [];
				gadData.mainId = -1;
				newDic.set(f + 1, gadData);
			}
		}
	}
	public gadDic: Dictionary<Dictionary<GadData>>;

	public nowSelectRoleId: number = 0;
	public gadBagDic: Dictionary<GadBagData>;

	public lvUpSelectData: Dictionary<GadBagData>;

	public setGadBagDic(data: Sproto.tatoo_bag_item[]) {
		for (var i = 0; i < data.length; i++) {
			let gadBagData = new GadBagData();
			gadBagData.configID = data[i].configID;
			gadBagData.attr = data[i].att;
			gadBagData.exp = data[i].exp;
			gadBagData.handle = data[i].handle;
			gadBagData.level = data[i].level;
			gadBagData.mainId = data[i].mainid;
			this.gadBagDic.set(gadBagData.handle, gadBagData);
		}
	}
	public setGadDic(data: Sproto.tatoo_data[]) {
		for (var i = 0; i < data.length; i++) {
			let roleGadData: Sproto.tatoo_data = data[i];
			let gadRoleDic = this.gadDic.get(roleGadData.roleid);
			if (!gadRoleDic) {
				gadRoleDic = new Dictionary<GadData>();
			}
			for (var f = 0; f < roleGadData.tatoo.length; f++) {
				let itemData: Sproto.tatoo_item = roleGadData.tatoo[f];
				let gadData = new GadData();
				if (itemData.slot) {
					gadData.attr = itemData.attr;
					gadData.exp = itemData.exp;
					gadData.itemid = itemData.itemid;
					gadData.level = itemData.level;
					gadData.slot = itemData.slot;
					gadData.roleId = roleGadData.roleid;
					gadData.mainId = itemData.mainid;
				} else {
					gadData.attr = [];
					gadData.exp = 0;
					gadData.itemid = -1;
					gadData.level = 0;
					gadData.slot = f + 1;
					gadData.roleId = roleGadData.roleid;
					gadData.mainId = -1;
				}
				gadRoleDic.set(gadData.slot, gadData);
			}
			this.gadDic.set(roleGadData.roleid, gadRoleDic);
		}
	}
	/**套装分类封装 */
	public getSuitByRole(roleId: number) {
		let gadDic: Dictionary<GadData> = this.gadDic.get(roleId);
		let gadDatas: GadData[] = gadDic.values;
		let dic: Dictionary<{ type: number, haveNum: number, quality: number, id: number, weight: number }> = new Dictionary<{ type: number, haveNum: number, quality: number, id: number, weight: number }>();
		for (var i = 0; i < gadDatas.length; i++) {
			if (gadDatas[i].itemid > 0) {
				let coawordproduceConfig = GlobalConfig.ins("COAwordproduceConfig")[gadDatas[i].itemid];
				if (coawordproduceConfig) {
					let coasuitConfig = GlobalConfig.ins("COAsuitConfig")[coawordproduceConfig.suit];
					if (coasuitConfig) {
						let type = coawordproduceConfig.suit;
						let list: { type: number, haveNum: number, quality: number, id: number, weight: number } = dic.get(coawordproduceConfig.suit);

						if (!list) {
							let weight = (1 * 10000000000 + gadDatas[i].itemConfig.quality * 1000000000 + (10000000 - gadDatas[i].itemid));
							let newlist = { type: coawordproduceConfig.suit, haveNum: 1, quality: gadDatas[i].itemConfig.quality, id: gadDatas[i].itemConfig.id, weight: weight };
							dic.set(coawordproduceConfig.suit, newlist);
						} else {
							list.haveNum += 1;
							let weight = (list.haveNum * 10000000000 + gadDatas[i].itemConfig.quality * 1000000000 + (10000000 - gadDatas[i].itemid));
							if (list.weight < weight) {
								list.weight = weight;
							}
						}
					}
				}
			}
		}
		return dic;
	}

	public getShowSuitByRole(roleId: number) {
		let dic = this.getSuitByRole(roleId);
		let dicValue: { type: number, haveNum: number, quality: number, id: number, weight: number }[] = dic.values;
		dicValue.sort(this.sorWeight);
		return dicValue;
	}
	/**关联排序 */
	private sorWeight(item1: { weight: number }, item2: { weight: number }): number {
		return item2.weight - item1.weight;
	}

	/**返回角色装备最多套装有多少件 */
	public getMainSuitByRole(roleId: number): { suit: number, suitLen: number } {
		let dic = this.getSuitByRole(roleId);
		let dicValue: { type: number, haveNum: number, quality: number, id: number, weight: number }[] = dic.values;
		if (dicValue.length > 0) {
			/**suit：套装id,suitLen：总共有多小件 */
			let data = { suit: dicValue[0].type, suitLen: dicValue[0].haveNum };
			for (var i = 0; i < dicValue.length; i++) {
				if (dicValue[i + 1] && dicValue[i].haveNum < dicValue[i + 1].haveNum) {
					data.suit = dicValue[i + 1].type;
					data.suitLen = dicValue[i + 1].haveNum;
				}
			}
			return data;
		}
		return null;
	}
	/**返回该套装装备有多小件 */
	public getSuitNum(roleId: number, suit: number): { type: number, haveNum: number } {
		let dic = this.getSuitByRole(roleId);
		let suits = dic.get(suit);
		if (suits) {
			return { type: suit, haveNum: suits.haveNum };
		}
		return null;
	}

	public getGadBuySlot(slot: number): GadBagData[] {
		let itemDatas: GadBagData[] = this.gadBagDic.values;
		let slotItemData: GadBagData[] = [];
		let config = GlobalConfig.ins("COAwordproduceConfig");
		for (var i = 0; i < itemDatas.length; i++) {
			let itemId = itemDatas[i].configID;
			let coawordproduceConfig = config[itemId];
			if (coawordproduceConfig) {
				if (coawordproduceConfig.site == slot) {
					slotItemData.push(itemDatas[i]);
				}
			}
		}
		return slotItemData;
	}

	public getNowSelectItemAllExpAndGold(): { exp: number, gold: number } {
		let gadBagDatas: GadBagData[] = this.lvUpSelectData.values;
		let exp: number = 0;
		let gold: number = 0;
		for (var i = 0; i < gadBagDatas.length; i++) {
			let gadData = gadBagDatas[i];
			let coalevelConfig = GlobalConfig.ins("COAlevelConfig")[gadData.itemConfig.quality][gadData.level];
			if (coalevelConfig) {
				exp += coalevelConfig.supexp;
				gold += coalevelConfig.gold;
			}
		}
		let data = { exp: exp, gold: gold };
		return data;
	}

	public getUpLvNumBuyExp(gadData: GadData, exp: number, level: number = 0): { lv: number, isbeyond: boolean } {
		let config = GlobalConfig.ins("COAlevelConfig")[gadData.itemConfig.quality];
		let lv = gadData.level + level;
		let coalevelConfig = config[lv];
		let maxExp: number;
		if (level == 0) {
			maxExp = exp + gadData.exp;
		} else {
			maxExp = exp;
		}
		if (maxExp < coalevelConfig.exp) {
			return { lv: lv, isbeyond: false };
		} else {
			let nextConfig = config[lv + 1];
			if (nextConfig) {
				let nextExp = exp - coalevelConfig.exp;
				return this.getUpLvNumBuyExp(gadData, nextExp, level + 1)
			} else {
				return { lv: lv, isbeyond: true };
			}
		}
	}

	public getGadItemData(): ItemData[] {
		let gadBagDatas = this.gadBagDic.values;
		let itemDatas: ItemData[] = [];
		for (var i = 0; i < gadBagDatas.length; i++) {
			let gadBagData = gadBagDatas[i];
			gadBagData.weight = 0;
			gadBagData.weight += gadBagData.suit;
			gadBagData.weight += gadBagData.star * 10;
		}
		gadBagDatas.sort(this.sorUpWeight);
		for (var i = 0; i < gadBagDatas.length; i++) {
			let gadBagData = gadBagDatas[i];
			let itemData = new ItemData();
			let data = new Sproto.item_data();
			data.handle = gadBagData.handle;
			data.att = gadBagData.attr;
			data.configID = gadBagData.configID;
			data.count = 1;
			data.invalidtime = 0;
			itemData.parser(data);
			itemDatas.push(itemData);
		}
		return itemDatas;
	}

	public getChangeGadItemData(gadBagDatas: GadBagData[]): ItemData[] {
		let itemDatas: ItemData[] = [];
		for (var i = 0; i < gadBagDatas.length; i++) {
			let gadBagData = gadBagDatas[i];
			let itemData = new ItemData();
			let data = new Sproto.item_data();
			data.handle = gadBagData.handle;
			data.att = gadBagData.attr;
			data.configID = gadBagData.configID;
			data.count = 1;
			data.invalidtime = 0;
			itemData.parser(data);
			itemDatas.push(itemData);
		}
		return itemDatas;
	}
	/**关联排序 */
	private sorUpWeight(item1: { weight: number }, item2: { weight: number }): number {
		return item2.weight - item1.weight;
	}

	public setStarNum(star: number, group: eui.Group, size: number = 0.5, wh: number = 20) {
		group.removeChildren();
		for (var i = 0; i < 5; i++) {
			let img = new eui.Image();
			img.scaleX = img.scaleY = size;
			img.width = img.height = wh;
			group.addChild(img);
			if (i < star) {
				img.source = "comp_23_23_1_png";
			} else {
				img.source = "comp_23_23_2_png";
			}
		}
	}

	public checkAllRoleCanChangeItem() {
		if (!Deblocking.Check(DeblockingType.TYPE_62, true)) {
			return false;
		}
		for (var i = 0; i < 3; i++) {
			let isCan: boolean = this.checkRoleCanChangeItem(i);
			if (isCan) {
				return true;
			}
		}
		return false
	}
	public checkRoleCanChangeItem(roleId: number) {
		if (!Deblocking.Check(DeblockingType.TYPE_62, true)) {
			return false;
		}
		let roleDic = this.gadDic.get(roleId);
		if (roleDic) {
			for (var i = 0; i < roleDic.values.length; i++) {
				let isCan: boolean = this.checkIsCanChangeItem(roleId, i + 1)
				if (isCan) {
					return true;
				}
			}
		}
		return false;
	}
	public checkIsCanChangeItem(roleId: number, slot: number) {
		if (!Deblocking.Check(DeblockingType.TYPE_62, true)) {
			return false;
		}
		var role = SubRoles.ins().getSubRoleByIndex(roleId);
		if (!role) {
			return false;
		}
		let coaConfig = GlobalConfig.ins("COAConfig")[slot];
		if (coaConfig) {
			switch (coaConfig.conditionkind) {
				case 2:
					let lv = GameLogic.ins().actorModel.level;
					if (lv < coaConfig.conditionnum) {
						return false;
					}
					break;
				case 1:
					if (UserFb.ins().guanqiaID < coaConfig.conditionnum) {
						return false;
					}
					break;
			}
		}
		let dic = this.gadDic.get(roleId);
		if (dic) {
			let gadData = dic.get(slot);
			if (gadData.isHaveItem) {
				let gadBagDics = this.gadBagDic.values;
				for (var i = 0; i < gadBagDics.length; i++) {
					if (gadBagDics[i].slot == gadData.slot && gadBagDics[i].level > gadData.level) {
						return true;
					}
				}
			} else {
				let gadBagDics = this.gadBagDic.values;
				for (var i = 0; i < gadBagDics.length; i++) {
					if (gadBagDics[i].slot == gadData.slot) {
						return true;
					}
				}
			}
		}
		return false;

	}

	public checkAllRoleCanLvUp() {
		if (!Deblocking.Check(DeblockingType.TYPE_62, true)) {
			return false;
		}
		for (var i = 0; i < 3; i++) {
			let isCan: boolean = this.checkRoleCanLvUp(i);
			if (isCan) {
				return true;
			}
		}
		return false
	}


	public checkRoleCanLvUp(roleId: number) {
		if (!Deblocking.Check(DeblockingType.TYPE_62, true)) {
			return false;
		}
		let roleDic = this.gadDic.get(roleId);
		if (roleDic) {
			for (var i = 0; i < roleDic.values.length; i++) {
				let isCan: boolean = this.checkIsCanLvUp(roleId, i + 1)
				if (isCan) {
					return true;
				}
			}
		}
		return false;
	}

	public checkIsCanLvUp(roleId: number, slot: number) {
		if (!Deblocking.Check(DeblockingType.TYPE_62, true)) {
			return false;
		}
		let roleDic = this.gadDic.get(roleId)
		if (roleDic) {
			let gadData = roleDic.get(slot);
			if (gadData) {
				if (gadData.isHaveItem) {
					if (!gadData.isLvMax) {
						if (this.gadBagDic.length > 0) {
							return this.setAutoLvUpItem();
						}
					}
				}
			}
		}
		return false;
	}

	public setAutoLvUpItem() {
		let gadModel = GadModel.getInstance;
		let gadBagDatas: GadBagData[] = gadModel.gadBagDic.values;
		let dic = new Dictionary<number[]>();
		for (var i = 0; i < 3; i++) {
			let gadRoleData: Dictionary<GadData> = gadModel.gadDic.get(i);
			for (var f = 0; f < 6; f++) {
				let gadData: GadData = gadRoleData.get(f + 1);
				let star = gadData.star;
				if (!star) {
					star = 0;
				}
				let slotData = dic.get(gadData.slot);
				if (slotData) {
					slotData.push(star);
				}
				else {
					slotData = [];
					slotData.push(star)
				}
				dic.set(gadData.slot, slotData);
			}
		}
		let gadBagDicSlot = new Dictionary<GadBagData[]>();
		for (var i = 0; i < gadBagDatas.length; i++) {
			let gadBagData: GadBagData = gadBagDatas[i];
			let gadBagDataSlots: GadBagData[] = gadBagDicSlot.get(gadBagData.slot);
			if (gadBagDataSlots) {
				gadBagDataSlots.push(gadBagData);
			} else {
				gadBagDataSlots = [];
				gadBagDataSlots.push(gadBagData);
			}
			gadBagDicSlot.set(gadBagData.slot, gadBagDataSlots);
		}
		for (var i = 0; i < 6; i++) {
			let nowSlotStars: number[] = dic.get(i + 1);
			let gadBagDataSlots: GadBagData[] = gadBagDicSlot.get(i + 1);
			if (gadBagDataSlots) {
				for (var f = 0; f < gadBagDataSlots.length; f++) {
					let min = Math.min.apply(null, nowSlotStars);
					if (gadBagDataSlots[f].star > min) {
						for (var k = 0; k < nowSlotStars.length; k++) {
							if (gadBagDataSlots[f].star > nowSlotStars[k]) {
								nowSlotStars[k] = gadBagDataSlots[f].star;
								break;
							}
						}
					}
				}
			}
		}
		this.lvUpSelectData.clear();
		for (var i = 0; i < 6; i++) {
			let gadBagDataSlots: GadBagData[] = gadBagDicSlot.get(i + 1);
			let nowSlotStars: number[] = dic.get(i + 1);
			let min = Math.min.apply(null, nowSlotStars);
			if (gadBagDataSlots) {
				for (var f = 0; f < gadBagDataSlots.length; f++) {
					if (gadBagDataSlots[f].star < min) {
						if (this.lvUpSelectData.length < 20) {
							this.lvUpSelectData.set(gadBagDataSlots[f].handle, gadBagDataSlots[f])
						} else {
							if (this.lvUpSelectData.length > 0) {
								return true;
							} else {
								return false;
							}
						}
					}
				}
			}
		}
		if (this.lvUpSelectData.length > 0) {
			return true;
		} else {
			return false;
		}
	}


}
window["GadModel"] = GadModel