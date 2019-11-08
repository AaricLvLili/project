class UserBag extends BaseSystem {

	private static EMPTY_TABLE = []
	private bagBaseConfig: any;
	private vipGridConfig: any;
	/** 是否自动熔炼*/
	public isAuto: boolean;
	bagNum: number = 0;
	/** 背包数据 <BR>
	 * 0其他装备，1装备，2寻宝相关。参考UserBag枚举定义3是十连抽仓库
	 * */
	bagModel: ItemData[][] = [];
	/** 使用物品的返回
	 * 0, -- 使用成功
	 * 1, -- 背包满了
	 * 3, -- 不能被使用
	 * 4, -- 级别不足
	 * 5, -- 数量不足够
	 */
	public get promptList() {
		let list = ["", GlobalConfig.jifengTiaoyueLg.st101472, GlobalConfig.jifengTiaoyueLg.st101473, GlobalConfig.jifengTiaoyueLg.st101474, GlobalConfig.jifengTiaoyueLg.st101475, GlobalConfig.jifengTiaoyueLg.st101476, GlobalConfig.jifengTiaoyueLg.st101477, GlobalConfig.jifengTiaoyueLg.st100008];
		return list;
	}


	_useItemFunc = {};
	upLevelEquips = [];
	/**选择的当前熔炼的装备 */
	public smeltItemList: any;
	static ins(): UserBag {
		return super.ins();
	}

	public constructor() {
		super();

		this.bagModel[UserBag.BAG_TYPE_OTHTER] = [];
		this.bagModel[UserBag.BAG_TYPE_EQUIP] = [];
		this.bagModel[UserBag.BAG_TYPE_TREASUREHUNT] = [];
		this.bagModel[UserBag.BAG_THE_LUCK] = [];
		this.bagModel[UserBag.BAG_TYPE_VIPTREASUREHUNT] = []

		this.sysId = PackageID.Bag;
		this.regNetMsg(S2cProtocol.sc_bag_init_data, this.doBagData);
		this.regNetMsg(S2cProtocol.sc_bag_deal_valumn_add, this.doBagValumnAdd);
		this.regNetMsg(S2cProtocol.sc_bag_deal_delete_item, this.doDeleteItem);
		this.regNetMsg(S2cProtocol.sc_bag_deal_add_item, this.doAddItem);
		this.regNetMsg(S2cProtocol.sc_bag_update_item_data, this.doUpDataItem);
		this.regNetMsg(S2cProtocol.sc_bag_user_item_back, this.doUserItemBack);
		this.regNetMsg(S2cProtocol.sc_bag_get_treasure_equip, this.doGetTreasure);
		this.regNetMsg(S2cProtocol.sc_bag_get_tendraw_equip, this.sc_bag_get_tendraw_equip);
		this.registerUseItemFunc(ItemConst.RENAME, this.useRenameItem);
		this.regNetMsg(S2cProtocol.sc_bag_compose_result, this.doHcItemBack);
		this.regNetMsg(S2cProtocol.sc_equip_autosmelt_res, this.sc_equip_autosmelt_res_request);
		this.regNetMsg(S2cProtocol.sc_bag_danyao_info, this.getBagDanyaoMsg);
	}
	//==================丹药===================
	public eatCnt: number = 0;
	public eatTime: number = 0;
	private getBagDanyaoMsg(req: Sproto.sc_bag_danyao_info_request) {
		this.eatCnt = req.eatCnt;
		this.eatTime = req.eatTime;
		GameGlobal.MessageCenter.dispatch(MessageDef.DANYAO_UPDATE);
	}
	public sendGetDanyaoMsg() {
		var rsp = new Sproto.cs_bag_danyao_info_request();
		GameSocket.ins().Rpc(C2sProtocol.cs_bag_danyao_info, rsp);
	}
	public sendRefCDDanyaoMsg() {
		var rsp = new Sproto.cs_bag_danyao_cd_request();
		GameSocket.ins().Rpc(C2sProtocol.cs_bag_danyao_cd, rsp);
	}

	//========================================
	private sc_equip_autosmelt_res_request(req: Sproto.sc_equip_autosmelt_res_request): void {
		this.isAuto = req.result == 1;
		if (req.result == 1) {//设置成功先清理一次
			//根据解锁个数获取背包能熔炉的列表
			var list1 = UserBag.ins().getOutEquips(false);
			let list2 = UserBag.ins().getOutFuwenEquips(list1.length);
			for (let i = 0; i < list2.length; ++i)
				list1.push(list2[i]);
			UserBag.ins().creatListLength(list1);
			UserEquip.ins().sendSmeltEquip(0, list1, true);
		}
	}

	public sendAddBagGrid(num: number): void {
		// var bytes = this.getBytes(2);
		// bytes.writeInt(num);
		// this.sendToServer(bytes);
		var cs_bag_add_grid = new Sproto.cs_bag_add_grid_request();
		cs_bag_add_grid.bagNum = num;
		GameSocket.ins().Rpc(C2sProtocol.cs_bag_add_grid, cs_bag_add_grid);
	};
    /**
     * 使用道具
     */
	public sendUseItem(id, count) {
		if (this._useItemFunc[id] != null) {
			this._useItemFunc[id](id, count);
			return true;
		}
		//没有注册的回调方法，就直接发送给后端
		var cs_bag_use_item = new Sproto.cs_bag_use_item_request();
		cs_bag_use_item.id = id;
		cs_bag_use_item.count = count;
		GameSocket.ins().Rpc(C2sProtocol.cs_bag_use_item, cs_bag_use_item);
		// var bytes = this.getBytes(6);
		// bytes.writeInt(id);
		// bytes.writeInt(count);
		// this.sendToServer(bytes);
		return false;
	};
	public sendUserGoods(id, count) {
	};

	/**合成道具*/
	public sendHcItem(id, count) {
		var cs_bag_compose_item = new Sproto.cs_bag_compose_item_request();
		cs_bag_compose_item.id = id;
		cs_bag_compose_item.count = count;
		GameSocket.ins().Rpc(C2sProtocol.cs_bag_compose_item, cs_bag_compose_item);
	};

	/** 请求设置自动熔炼*/
	public setAutoBag(flg: boolean): void {
		var req = new Sproto.cs_equip_autosmelt_req_request();
		req.type = flg ? 1 : 0;
		GameSocket.ins().Rpc(C2sProtocol.cs_equip_autosmelt_req, req);
	}

	/**合成道具返回*/
	public doHcItemBack(rsp: Sproto.sc_bag_compose_result_request) {
		if (rsp.result == 1) {
			UserBag.postHcItemSuccess();
		}
	};

	/**派发合成道具成功 */
	public static postHcItemSuccess() {
	};

    /**
     * 处理背包数据初始化
     * 3-1
     * @param bytes
     */
	public doBagData(rsp: Sproto.sc_bag_init_data_request) {
		var code = rsp.code;
		//背包类型 0是其他物品 1是装备
		var type = rsp.type;
		//0是清空数据，其他视为追加数据
		if (code == 0)
			this.bagModel[type] = [];
		var len = rsp.datas.length;
		var itemModel;
		for (var i = 0; i < len; i++) {
			itemModel = new ItemData();
			itemModel.parser(rsp.datas[i]);
			this.bagModel[type].push(itemModel);
		}
		// UserBag.postItemAdd();
		// MessageCenter.ins().dispatch(MessageDef.ADD_ITEM)
		// GameGlobal.MessageCenter.dispatch(MessageDef.ITEM_COUNT_CHANGE)
		if (type == 1)
			this.doBagVolChange();
		if (type == 2) {
			UserBag.postHuntStore();
		}
		UserBag._DispatchHasItemCanUse(this.getIsExitUsedItem());
	};
    /**
     * 背包容量提示
     */
	public doBagVolChange() {
		//道具数量变更
		var isTip = this.getBagItemNum() / this.getMaxBagRoom() >= 0.8 || this.getWingZhuEquip().length >= 10;
		// UserBag.postItemCountChange(b);
		MessageCenter.ins().dispatch(MessageDef.BAG_ITEM_COUNT_CHANGE, isTip)
		isTip = this.getSurplusCount() < this.getMaxBagRoom() * 0.05;
		MessageCenter.ins().dispatch(MessageDef.BAG_WILL_FULL, isTip)
		// UserBag.postBagWillFull(isTip);
		if (isTip) {
			this.autoSmelt()
		}
	};
	private autoTime = 0;
	private autoSmelt() {
		if (UserBag.ins().isAuto && (this.autoTime - egret.getTimer()) < 0) {
			this.autoTime = egret.getTimer() + 1000;
			//根据解锁个数获取背包能熔炉的列表
			var list1 = UserBag.ins().getOutEquips(false);
			let list2 = UserBag.ins().getOutFuwenEquips(list1.length);
			for (let i = 0; i < list2.length; ++i)
				list1.push(list2[i]);
			UserBag.ins().creatListLength(list1);
			UserEquip.ins().sendSmeltEquip(0, list1, true);
		}
	}
	public doUserItemBack(rsp: Sproto.sc_bag_user_item_back_request) {
		var index = rsp.tipIndex;
		if (index > 0) {
			UserTips.ins().showTips(this.promptList[index]);
		}
		else if (index == 0) {
			UserBag.postUseItemSuccess();
		}
	};
    /**
     * 处理添加背包格子数
     * 3-2
     * @param bytes
     */
	public doBagValumnAdd(rsp: Sproto.sc_bag_deal_valumn_add_request) {
		if (this.bagBaseConfig == null)
			this.bagBaseConfig = GlobalConfig.ins("BagBaseConfig");

		this.bagNum = rsp.bagNum * this.bagBaseConfig.rowSize + this.bagBaseConfig.baseSize;
		UserBag.postBagVolAdd();
	};
    /**
     * 处理删除背包数据
     * 3-3
     * @param bytes
     */
	public doDeleteItem(rsp: Sproto.sc_bag_deal_delete_item_request) {
		//背包类型 0是其他物品 1是装备
		var type = rsp.type;
		if (type != 4) {
			var handle = rsp.handle;
			for (var i = this.bagModel[type].length - 1; i >= 0; i--) {
				if (this.bagModel[type][i].handle == (handle)) {
					this.bagModel[type].splice(i, 1);
					break;
				}
			}

			if (type == UserBag.BAG_TYPE_TREASUREHUNT) {
				UserBag.postHuntStore();
			} else {
				GameGlobal.MessageCenter.dispatch(MessageDef.DELETE_ITEM)
				this.doBagVolChange();
				GameGlobal.MessageCenter.dispatch(MessageDef.ITEM_COUNT_CHANGE)
			}
			UserBag._DispatchHasItemCanUse(this.getIsExitUsedItem());
		} else {
			GadSproto.ins().getGadDelBag(rsp);
		}

	};
	/**需要特殊弹窗的数据id */
	public showList = [];
    /**
     * 处理添加背包数据
     * 3-4
     * @param bytes
     */
	public doAddItem(rsp: Sproto.sc_bag_deal_add_item_request) {
		//背包类型 0是其他物品 1是装备
		var type = rsp.type;
		var itemModel = new ItemData();
		itemModel.parser(rsp.data);
		if (itemModel.itemConfig.type == ItemType.FUWEN) {
			itemModel.mIsNewItem = true
		}
		this.bagModel[type].push(itemModel);
		let config = GlobalConfig.ins("ExhibitionConfig");
		if (config[rsp.data.configID] && !TreasureStorePanel.isOpen) {
			this.showList.push(rsp.data.configID);
			if (!MainGetNewWin.isOpen) {
				ViewManager.ins().open(MainGetNewWin);
			}
		}
		var showTip = rsp.showTip;
		if (showTip) {
			if (itemModel.itemConfig.quality >= 4 && type == UserBag.BAG_TYPE_EQUIP) {
				UserTips.ins().showGoodEquipTips(itemModel);
			} else {
				if (type != UserBag.BAG_TYPE_TREASUREHUNT) {
					var quality = ItemBase.QUALITY_TIPS_COLOR[itemModel.itemConfig.quality];
					var str = GlobalConfig.jifengTiaoyueLg.st101471 + "|C:" + quality + "&T:" + itemModel.itemConfig.name + " x " + itemModel.count + "|";
					UserTips.ins().showTips(str);
				}
			}
		}
		if (type == UserBag.BAG_TYPE_TREASUREHUNT) {
			UserBag.postHuntStore();
		} else {
			UserBag.postItemAdd();
			GameGlobal.MessageCenter.dispatch(MessageDef.ADD_ITEM)
			this.doBagVolChange();
			GameGlobal.MessageCenter.dispatch(MessageDef.ITEM_COUNT_CHANGE)
		}
		UserBag._DispatchHasItemCanUse(this.getIsExitUsedItem());
	};
    /**
     * 处理物品更新
     * 3-5
     * @param bytes
     */
	public doUpDataItem(rsp: Sproto.sc_bag_update_item_data_request) {
		//背包类型 0是其他物品 1是装备
		var type = rsp.type;
		var handle = rsp.handle;
		var addNum = 0;
		var element;
		for (var i = 0; i < this.bagModel[type].length; i++) {
			element = this.bagModel[type][i];
			if (element.handle == (handle)) {
				var num = rsp.num;
				addNum = num - element.count;
				element.count = num;
				//				element.parser(bytes);
				break;
			}
		}
		if (element) {
			if (addNum > 0) {
				let config = GlobalConfig.ins("ExhibitionConfig");
				if (config[element.itemConfig.id]&&!TreasureStorePanel.isOpen) {
					this.showList.push(element.itemConfig.id);
					if (!MainGetNewWin.isOpen) {
						ViewManager.ins().open(MainGetNewWin);
					}
				}
			}
			var showTip = rsp.showTip;
			if (showTip) {
				if (addNum > 0) {
					if (type != 2) {
						var quality = ItemBase.QUALITY_COLOR[element.itemConfig.quality];
						var str = GlobalConfig.jifengTiaoyueLg.st101471 + "|C:" + quality + "&T:" + element.itemConfig.name + " x " + addNum + "|";
						UserTips.ins().showTips(str);
					}
				}
			}
		}
		if (type != UserBag.BAG_TYPE_TREASUREHUNT) {
			this.doBagVolChange();
			UserBag.postItemChange();
			MessageCenter.ins().dispatch(MessageDef.CHANGE_ITEM)
			GameGlobal.MessageCenter.dispatch(MessageDef.ITEM_COUNT_CHANGE)
		}
		UserBag._DispatchHasItemCanUse(this.getIsExitUsedItem());

	};
    /**
     * 发送取出宝物
     * 3-4
     * @param type	探宝类型 ,默认是寻宝仓库，
     */
	public sendGetGoodsByStore(uuid, type: number = UserBag.BAG_TYPE_TREASUREHUNT) {
		//去除单件装备 && 背包空间不足的情况下
		if (uuid != 0 && this.getSurplusCount() < 1) {
			var strTips = GlobalConfig.ins("ServerTips")[2].tips;
			UserTips.ins().showTips(strTips);
			return;
		}
		var cs_bag_get_goods_by_store = new Sproto.cs_bag_get_goods_by_store_request();
		cs_bag_get_goods_by_store.uuid = uuid;
		if (type == UserBag.BAG_TYPE_VIPTREASUREHUNT) {
			GameSocket.ins().Rpc(C2sProtocol.cs_bag_get_ticket_by_store, cs_bag_get_goods_by_store);
		} else
			if (type == UserBag.BAG_THE_LUCK) {
				GameSocket.ins().Rpc(C2sProtocol.cs_bag_get_tendraw_by_store, cs_bag_get_goods_by_store);
			}
			else
				GameSocket.ins().Rpc(C2sProtocol.cs_bag_get_goods_by_store, cs_bag_get_goods_by_store);
		// var bytes = this.getBytes(4);
		// bytes.writeDouble(uuid);
		// this.sendToServer(bytes);
	};
	doGetTreasure(rsp: Sproto.sc_bag_get_treasure_equip_request) {
		rsp.handle.forEach(element => {
			let itemModel;
			for (var i = this.bagModel[UserBag.BAG_TYPE_TREASUREHUNT].length - 1; i >= 0; i--) {
				if (this.bagModel[UserBag.BAG_TYPE_TREASUREHUNT][i].handle == (element)) {
					itemModel = this.bagModel[UserBag.BAG_TYPE_TREASUREHUNT][i];
					this.bagModel[UserBag.BAG_TYPE_TREASUREHUNT].splice(i, 1);
					break;
				}
			}
			if (itemModel.itemConfig.type == ItemType.FUWEN) {
				itemModel.mIsNewItem = true
			}
			this.bagModel[UserBag.BAG_TYPE_EQUIP].push(itemModel);
		});
		UserBag.postHuntStore();
		UserBag.postItemAdd();
		GameGlobal.MessageCenter.dispatch(MessageDef.ADD_ITEM)
		this.doBagVolChange();
		GameGlobal.MessageCenter.dispatch(MessageDef.ITEM_COUNT_CHANGE)
		UserBag._DispatchHasItemCanUse(this.getIsExitUsedItem());
	}

	/** 十连抽仓库变动*/
	private sc_bag_get_tendraw_equip(rsp: Sproto.sc_bag_get_tendraw_equip_request): void {
		rsp.handle.forEach(element => {
			let itemModel;
			for (var i = this.bagModel[UserBag.BAG_THE_LUCK].length - 1; i >= 0; i--) {
				if (this.bagModel[UserBag.BAG_THE_LUCK][i].handle == (element)) {
					itemModel = this.bagModel[UserBag.BAG_THE_LUCK][i];
					this.bagModel[UserBag.BAG_THE_LUCK].splice(i, 1);
					break;
				}
			}
			if (itemModel.itemConfig.type == ItemType.FUWEN) {
				itemModel.mIsNewItem = true
			}
			this.bagModel[UserBag.BAG_TYPE_EQUIP].push(itemModel);
		});
		UserBag.postHuntStore();
	}

	///////////////////////////////////////////////////派发消息/////////////////////////////////////////////////////
	/*派发道具变更*/
	public static postItemChange() {
	};
    /**
     * 注册使用道具的回调方法
     * 用于一些道具特殊处理的情况
     */
	public registerUseItemFunc(itemID, useFunc) {
		this._useItemFunc[itemID] = useFunc;
	};
	/*派发删除道具*/

	/**派发道具增加消息*/
	public static postItemAdd() {
	};
	/** 派发道具数量变更消息*/
	// public static postItemCountChange(isChange) {
	// 	return isChange;
	// };
	/**派发背包数量快不足的提示*/
	// public static postBagWillFull(willFull) {
	// 	return willFull;
	// };
	/**派发更新寻宝仓库*/
	public static postHuntStore() {
	}

	/**派发是否有可用道具提示*/
	private static _DispatchHasItemCanUse(hasItemCanUse) {
		MessageCenter.ins().dispatch(MessageDef.BAG_HAS_ITEM_CAN_USE, hasItemCanUse)
	}

	/**派发使用道具成功 */
	public static postUseItemSuccess() {
	};
	/**背包增加格子数*/
	public static postBagVolAdd() {
	};
	///////////////////////////////////////////////////////////////各种查询方法///////////////////////////////////////////////////////////////
    /**
     * 通过id获取背包物品
     * @param type 类型
     * @param id
     */
	public getBagItemById(id) {
		var itemData = this.bagModel[UserBag.BAG_TYPE_OTHTER];
		for (var _i = 0, itemData_1 = itemData; _i < itemData_1.length; _i++) {
			var data = itemData_1[_i];
			if (data.itemConfig && data.itemConfig.id == id)
				return data;
		}
		return null;
	};
	/**根据道具类型和id获取道具*/
	public getBagGoodsByTypeAndId(type, id) {
		var itemData = this.bagModel[type];
		for (var _i = 0, itemData_2 = itemData; _i < itemData_2.length; _i++) {
			var data = itemData_2[_i];
			if (data.itemConfig.id == id)
				return data;
		}
		return null;
	};
    /**
     * 获取背包了某种类型的装备
     * @param type 类型
     */
	public getBagEquipByType(type): ItemData[] {
		var itemData = this.bagModel[UserBag.BAG_TYPE_EQUIP];
		var itemData1 = [];
		for (var a in itemData) {
			if (!itemData[a] || !itemData[a].itemConfig) {
				var str: string = '';
				if (GameLogic.ins() && GameLogic.ins().actorModel) {
					if (GameLogic.ins().actorModel.name == null)
						str += "玩家账号：" + StartGetUserInfo.uid + ">>>";
					else
						str += "玩家名字：" + GameLogic.ins().actorModel.name + ">>>";
				}
				StatisticsUtils.debugInfoLogPhp(str + "  这个道具有毒：" + a);
			}

			if (itemData[a] && itemData[a].itemConfig && itemData[a].itemConfig.type == type) {
				itemData1.push(itemData[a]);
			}
		}
		return itemData1;
	};

    /**
     * 通过装备id获取背包装备的数量
     */
	public getBagEquipCountById(id) {
		var count: number = 0;
		if (this.bagModel[UserBag.BAG_TYPE_EQUIP]) {
			var equipsList = this.bagModel[UserBag.BAG_TYPE_EQUIP];
			for (var equip of equipsList) {
				if (equip.configID == id) {
					count++;
				}
			}
		}
		return count;
	};
    /**
     * 通过id获取背包物品的数量
     * @param type 类型
     * @param id
     */
	public getBagGoodsCountById(type, id) {
		var itemData = this.bagModel[type];
		for (var i = 0; i < itemData.length; i++) {
			if (itemData[i].itemConfig.id == id)
				return itemData[i].count;
		}
		return 0;
	};
    /**
     * 通过索引获取背包物品
     * @param type 0是其他物品 1是装备
     * @param index
     */
	public getBagGoodsByIndex(type, index) {
		return this.bagModel[type][index];
	};
    /**
     * 获取背包道具数量
     * @param type	0是其他物品 1是装备
     */
	public getBagItemNum(type: number = 1) {
		// if (type === void 0) { type = 1; }
		var itemData = this.bagModel[type];
		return itemData ? itemData.length : 0;
	};
    /**
	 * 获取对应配置表类型数据 *************by恒****************
	 * @param type	0是其他物品 1是装备
	 */
	public getAllItemListBuyType(type: number, configType: number): ItemData[] {
		var itemData = this.bagModel[type];
		let listData: ItemData[] = [];
		for (var i = 0; i < itemData.length; i++) {
			if (itemData[i].itemConfig.type == configType)
				listData.push(itemData[i]);
		}
		return listData;
	}

	/**
	 * 获取对应配置表类型数据 *************by恒****************
	 * 多加了个品质判断
	 * @param type	0是其他物品 1是装备
	 */
	public getAllItemListBuyTypeAndQuality(type: number, configType: number, quality: number): ItemData[] {
		var itemData = this.bagModel[type];
		let listData: ItemData[] = [];
		for (var i = 0; i < itemData.length; i++) {
			if (itemData[i].itemConfig.type == configType && itemData[i].itemConfig.quality == quality) {
				listData.push(itemData[i]);
			}
		}
		return listData;
	}


    /**
     * 获取背包剩余空间
     * 只有装备背包才有空间概念
     */
	public getSurplusCount() {
		return this.getMaxBagRoom() - this.getBagItemNum();
	};
    /**
     * 获取背包总空间
     */
	public getMaxBagRoom() {
		if (this.vipGridConfig == null)
			this.vipGridConfig = GlobalConfig.ins("VipGridConfig");
		return this.bagNum + this.vipGridConfig[UserVip.ins().lv].grid + Recharge.ins().getAddBagGrid();
	};
	public sort1(a, b) {
		var s1 = ItemConfig.calculateBagItemScore(a);
		var s2 = ItemConfig.calculateBagItemScore(b);
		if (s1 > s2)
			return -1;
		else if (s1 < s2)
			return 1;
		else
			return 0;
	};
	public sort2(a, b) {
		var s1 = ItemConfig.calculateBagItemScore(a);
		var s2 = ItemConfig.calculateBagItemScore(b);
		if (s1 < s2)
			return -1;
		else if (s1 > s2)
			return 1;
		else
			return 0;
	};
    /**
     * 获取背包排序过的装备 0:评分从小到大 1：评分从大到小
     * @param isSort
     */
	public getBagSortEquips(isSort) {
		if (isSort === void 0) { isSort = 0; }
		var itemData = this.bagModel[UserBag.BAG_TYPE_EQUIP];
		if (isSort)
			itemData.sort(this.sort1);
		else
			itemData.sort(this.sort2);
		return itemData;
	};
    /**
     * 获取背包排列过的某种品质的装备 默认全部品质 可以多种品质 可以单一品质
     * @param quality  品质
     * @param sole   是否单一品质   0：返回多种  1：返回单一
     * @param sort 0:评分从小到大 1：评分从大到小
     * @param filter 过滤方法
	 * @param noType 特殊的不用过滤的类型 物品类型
     */
	public getBagSortQualityEquips(quality: number = 5, sole: number = 0, sort: number = 0, filter: any = null, noTypeList: any[] = null) {
		var list = this.bagModel[UserBag.BAG_TYPE_EQUIP];
		var returnList = [];
		for (var i = 0; i < list.length; i++) {
			let isCan = false;
			if (noTypeList) {
				for (var f = 0; f < noTypeList.length; f++) {
					if (list[i].itemConfig.type == noTypeList[f]) {
						isCan = true;
					}
				}
			}
			if (quality != 5 && (list[i].itemConfig.quality > quality || (sole && list[i].itemConfig.quality < quality)) && !isCan)
				continue;
			if (filter != null && !filter(list[i]))
				continue;
			returnList[returnList.length] = list[i];
		}
		return returnList;
	};
	private equipList: Array<string>//可熔炼装备ID列表
	/**
	 * 获取背包中可以熔炼的装备，包括普通装备（品质0 1 2 3），以及里装
	 */
	public getCanSmeltEquips() {
		let equipList = this.bagModel[UserBag.BAG_TYPE_EQUIP];
		let tempList = []
		if (!this.equipList) this.equipList = Object.keys(GlobalConfig.smeltequipConfig)
		for (let i = 0; i < equipList.length; i++) {
			let oEquip = equipList[i];
			if (oEquip.itemConfig.type == ItemType.EQUIP) {
				if (oEquip.itemConfig.quality <= 3) {
					tempList[tempList.length] = equipList[i]
				}
			} else if (oEquip.itemConfig.type == ItemType.ZHUANZHI) {
				if (this.equipList.indexOf(oEquip.itemConfig.id + "") >= 0) {
					tempList[tempList.length] = equipList[i]
				}
			} else if (oEquip.itemConfig.type == ItemType.MOUNTEQUIP) {
				if (this.equipList.indexOf(oEquip.itemConfig.id + "") >= 0) {
					tempList[tempList.length] = equipList[i]
				}
			}
		}
		return tempList;
	}
    /**
     * 可熔炼的非普通装备筛选方法
     * 羽翼装备、天珠等
     */
	public otherEquipSmeltFilter(item) {
		if (item.itemConfig.type == 4)
			return true;
		if (item.itemConfig.type == 0) {
			var subType = item.itemConfig.subType;
			for (var key in ForgeConst.CAN_FORGE_EQUIP) {
				if (ForgeConst.EQUIP_POS_TO_SUB[ForgeConst.CAN_FORGE_EQUIP[key]] == subType)
					return false;
			}
			return true;
		}
		return false;
	};
    /**
     * 可熔炼的普通装备筛选方法
     */
	public normalEquipSmeltFilter(item) {
		return item.itemConfig.type == ItemType.EQUIP || item.itemConfig.type == ItemType.RINGSOUL// && item.itemConfig.subType != ForgeConst.EQUIP_POS_TO_SUB[EquipPos.DZI];
	};
	/**
	 * 可普通熔炼的符文装备
	 */
	public normalFuwenSmeltFilter(item) {
		return item.itemConfig.type == ItemType.FUWEN
	}
	/**
	 * 所有可普通熔炼的装备
	 */
	public canSmeltNormalFilter(item) {
		return item.itemConfig.type == ItemType.EQUIP || item.itemConfig.type == ItemType.FUWEN || item.itemConfig.type == ItemType.RINGSOUL || item.itemConfig.type == ItemType.ZHUANZHI || item.itemConfig.type == ItemType.MOUNTEQUIP
	}
	/**
	 * 获取可熔炼的符文装备
	 */
	public getOutFuwenEquips(maxCount: number) {
		var returnList = [];
		var list: ItemData[] = this.getBagSortQualityEquips(5, 0, 1, this.normalFuwenSmeltFilter);
		if (list.length == 0) return returnList;
		list.sort(this.sort1);
		let equipScores = [null, [], [], []];
		for (let i = 0; i < SubRoles.ins().subRolesLen; ++i) {
			let role = SubRoles.ins().getSubRoleByIndex(i);
			for (let j = 0; j < ItemConfig.FuwenEquipSlot.Count; ++j) {
				equipScores[role.job][j] = role.fuwen.equipDatas[j].itemConfig && ItemConfig.calculateBagItemScore(role.fuwen.equipDatas[j]) || 0;
			}
		}
		var usefullFuwen = [null, [], [], []];
		list.forEach(element => {
			if (returnList.length < maxCount) {
				if (equipScores[element.itemConfig.job] && ItemConfig.calculateBagItemScore(element) <= equipScores[element.itemConfig.job][element.itemConfig.subType]) {
					returnList.push(element);
				} else {
					if (!usefullFuwen[element.itemConfig.job][element.itemConfig.subType])
						usefullFuwen[element.itemConfig.job][element.itemConfig.subType] = [];
					if (!usefullFuwen[element.itemConfig.job][element.itemConfig.subType][ItemConfig.calcItemLevel(element)])
						usefullFuwen[element.itemConfig.job][element.itemConfig.subType][ItemConfig.calcItemLevel(element)] = true;
					else {
						returnList.push(element);
					}
				}
			}
		});
		return returnList;
	}
    /**
     * 获取背包内用于熔炼的装备（用于熔炼）
     */
	public getOutEquips(isCheckCont: boolean = true) {
		var list = this.getBagSortQualityEquips(5, 0, 1, this.normalEquipSmeltFilter); //取得背包内所有的装备
		var returnList = [];
		var nowEquips = [];
		var lv = GameLogic.ins().actorModel.level;
		var zsLv = UserZs.ins().lv;
		//穿在身上的装备
		var len = SubRoles.ins().subRolesLen;
		for (var i = 0; i < len; i++) {
			var role = SubRoles.ins().getSubRoleByIndex(i);
			var equipLen = role.getEquipLen();
			// this.makeEquipsList(nowEquips, onEquips, i + 1);
			for (var ii = 0; ii < equipLen; ii++) {
				var goods = role.getEquipByIndex(ii);
				if (!goods.item.itemConfig) {
					continue;
				}
				this.addOneEquipToList(nowEquips, goods, ii + 1);
			}
		}
		var outEquip;
		for (var i = 0; i < list.length; i++) {
			var item = list[i];
			outEquip = this.checkEquipsIsGood(nowEquips, this.cloneItemDataInfo(item));
			if (outEquip) {
				//只筛选品质小于4的装备 熔炼
				if (!UserEquip.ins().checkEquipsIsWear(outEquip) && outEquip.itemConfig.quality < 4) {
					returnList.push(outEquip);
				}
				if (!UserEquip.ins().checkEquipsIsWear(outEquip) && outEquip.itemConfig.quality <= 5 && outEquip.itemConfig.type == 7) {
					returnList.push(outEquip);
				}
			}
			//每次只需要拿x个物品
			if (returnList.length >= Const.SMELT_COUNT && isCheckCont) {
				break;
			}
		}
		this.upLevelEquips = [];
		// this.creatListLength(returnList);
		return returnList;
	};
	//填充返回的列表
	public creatListLength(list) {
		if (list.length < Const.SMELT_COUNT) {
			for (var i = 0; i < Const.SMELT_COUNT; i++) {
				if (list[i] == undefined) {
					list[i] = null;
				}
			}
		}
	};
	//筛选超过自身等级限制 但是保留的装备
	public checkUpLevelEquips(item) {
		var job = item.itemConfig.job;
		var subType = item.itemConfig.subType;
		var zsLv = item.itemConfig.zsLevel;
		var level = item.itemConfig.level;
		if (!this.upLevelEquips) {
			this.upLevelEquips = [];
		}
		if (!this.upLevelEquips[job]) {
			this.upLevelEquips[job] = [];
		}
		if (!this.upLevelEquips[job][subType]) {
			this.upLevelEquips[job][subType] = [];
		}
		if (!this.upLevelEquips[job][subType][zsLv]) {
			this.upLevelEquips[job][subType][zsLv] = [];
		}
		var onItem;
		if (subType == 4 || subType == 5) {
			//装备子类型为 4 或者 5的同时需要保留两件 特殊处理
			if (!this.upLevelEquips[job][subType][zsLv][level]) {
				this.upLevelEquips[job][subType][zsLv][level] = [];
				this.upLevelEquips[job][subType][zsLv][level][0] = item;
			}
			else {
				onItem = this.upLevelEquips[job][subType][zsLv][level][0];
				if (onItem) {
					onItem = this.upLevelEquips[job][subType][zsLv][level][1];
					if (onItem) {
						var best = void 0;
						best = this.checkEquipGetBest(onItem, item);
						onItem = this.upLevelEquips[job][subType][zsLv][level][0];
						best = this.checkEquipGetBest(onItem, item);
						if (best == onItem) {
							this.upLevelEquips[job][subType][zsLv][level][0] = item;
						}
						return best;
					}
					else {
						this.upLevelEquips[job][subType][zsLv][level][1] = item;
					}
				}
			}
		}
		else {
			onItem = this.upLevelEquips[job][subType][zsLv][level];
			if (onItem) {
				var best = this.checkEquipGetBest(onItem, item);
				if (best == onItem) {
					this.upLevelEquips[job][subType][zsLv][level] = item;
				}
				return best;
			}
			else {
				this.upLevelEquips[job][subType][zsLv][level] = item;
			}
		}
		return null;
	};
	//筛选超过自身等级限制 但是评分低的装备
	public checkUplevelBest(item, list) {
		var job = item.itemConfig.job;
		var subType = item.itemConfig.subType;
		var item1;
		var item2;
		var bestOne = null;
		if (!list[job]) {
			list[job] = [];
		}
		if (subType == 4 || subType == 5) {
			//装备子类型为 4 或者 5的同时需要保留两件 特殊处理
			if (!list[job][subType]) {
				list[job][subType] = [];
			}
			if (!list[job][subType][0]) {
				list[job][subType][0] = null;
			}
			if (!list[job][subType][1]) {
				list[job][subType][1] = null;
			}
			item1 = list[job][subType][0];
			item2 = list[job][subType][1];
			if (item1) {
				bestOne = this.checkEquipGetBest(item1, item);
			}
			if (item2) {
				bestOne = this.checkEquipGetBest(item2, bestOne);
			}
		}
		else {
			if (!list[job][subType]) {
				list[job][subType] = null;
			}
			item1 = list[job][subType];
			if (item1) {
				bestOne = this.checkEquipGetBest(item1, item);
			}
		}
		return bestOne;
	};
	//筛选可熔炼的装备
	public checkEquipsIsGood(list, item) {
		var lv = GameLogic.ins().actorModel.level;
		var zsLv = UserZs.ins().lv;
		var job = item.itemConfig.job;
		var subType = item.itemConfig.subType;
		//超出等级限制
		if (item.itemConfig.level > lv || item.itemConfig.zsLevel > zsLv) {
			var best = this.checkUplevelBest(item, list);
			if (best && !UserEquip.ins().checkEquipsIsWear(best)) {
				return best;
			}
			return this.checkUpLevelEquips(item);
		}
		if (!list[job] || !list[job][subType]) {
			this.addOneEquipToList(list, item);
			return null;
		}
		var oldItem;
		var clearItem1;
		var clearItem;
		if (subType == 4 || subType == 5) {
			//装备子类型为 4 或者 5的同时需要保留两件 特殊处理
			if (!list[job][subType][1]) {
				list[job][subType][1] = item;
				return null;
			}
			else {
				oldItem = list[job][subType][0];
				clearItem1 = this.checkEquipGetBest(oldItem, item);
				if (oldItem == clearItem1) {
					list[job][subType][0] = item;
				}
				oldItem = list[job][subType][1];
				clearItem = this.checkEquipGetBest(oldItem, clearItem1);
				if (oldItem == clearItem) {
					list[job][subType][1] = clearItem1;
				}
			}
		}
		else {
			oldItem = list[item.itemConfig.job][subType];
			clearItem = this.checkEquipGetBest(oldItem, item);
			if (oldItem == clearItem) {
				list[item.itemConfig.job][subType] = item;
			}
		}
		return clearItem;
	};
	//对比两个装备
	public checkEquipGetBest(oldItem, newItem) {
		if (oldItem != null && newItem != null && oldItem.point >= newItem.point) {
			return newItem;
		}
		return oldItem;
	};
	//填充保留装备的列表
	public addOneEquipToList(list, item, index = 0) {
		var goods;
		if (item instanceof EquipsData) {
			goods = this.cloneItemDataInfo(item.item);
		}
		else {
			goods = this.cloneItemDataInfo(item);
		}
		var job = goods.itemConfig.job;
		if (goods.itemConfig.job == 0) {
			var job_1 = index;
		}
		var subType = goods.itemConfig.subType;
		if (!list[job]) {
			list[job] = [];
		}
		if (subType == 4 || subType == 5) {
			//装备子类型为 4 或者 5的同时需要保留两件 特殊处理
			if (list[job][subType]) {
				list[job][subType][1] = goods;
			}
			else {
				list[job][subType] = [];
				list[job][subType][0] = goods;
			}
		}
		else {
			list[job][subType] = goods;
		}
	};
    /**
     * 复制一个道具数组
     * @param list
     */
	public cloneItemDataList(list) {
		var returnList = [];
		for (var i = 0; i < list.length; i++) {
			var item = new ItemData();
			item.handle = list[i].handle;
			item.configID = list[i].configID;
			item.att = list[i].att;
			item.itemConfig = list[i].itemConfig;
			item.count = list[i].count;
			returnList.push(item);
		}
		return returnList;
	};
    /**
     * 复制一个道具数组
     * @param list
     */
	public cloneItemDataInfo(data) {
		var item = new ItemData();
		item.handle = data.handle;
		item.configID = data.configID;
		item.att = data.att;
		item.itemConfig = data.itemConfig;
		item.count = data.count;
		return item;
	};
    /**
     * 获取背包物品排序
     */
	public getBagGoodsBySort() {
		//需要排序 暂时不需要 lxh
		if (this.bagModel[UserBag.BAG_TYPE_OTHTER])
			return this.bagModel[UserBag.BAG_TYPE_OTHTER];

		var goodsList = this.bagModel[UserBag.BAG_TYPE_OTHTER].sort(function (n1, n2) {
			if (n1.configID > n2.configID) {
				return 1;
			}
			if (n1.configID < n2.configID) {
				return -1;
			}
			return 0;
		});
		return goodsList;
	};
    /**
     * 获取背包了某种类型的物品
     * @param type 类型
     */
	public getBagGoodsByType(type) {
		var itemData = this.bagModel[UserBag.BAG_TYPE_OTHTER];
		var itemData1 = [];
		for (var a in itemData) {
			if (itemData[a].itemConfig.type == type) {
				itemData1.push(itemData[a]);
			}
		}
		return itemData1;
	};

    /**
     * 获取背包心法(排除最高阶心法)
     * @param type 类型
     */
	public getBagXinfaRuleOut() {
		var itemData = this.bagModel[UserBag.BAG_TYPE_OTHTER];
		var itemData1 = [];
		for (var a in itemData) {
			let xf = MiJiSkillConfig.getXinFaByItemId(itemData[a].configID);
			if (itemData[a].itemConfig.type == 2 && xf.typelevel != 11) {
				itemData1.push(itemData[a]);
			}
		}
		return itemData1;
	};


    /**
     * 获取背包指定阶级的心法
     * @param type 类型
	 * @param xfIdArr 已经选中的心法id数组
     */
	public getBagXinFaByLevel(level, xfIdArr) {
		var itemData = this.bagModel[UserBag.BAG_TYPE_OTHTER];
		var itemData1 = [];
		for (var a in itemData) {
			if (itemData[a].itemConfig.type == 2) {
				let xf = MiJiSkillConfig.getXinFaByItemId(itemData[a].configID);
				if (xf.typelevel == level) {
					if (xfIdArr.indexOf(itemData[a].configID) == -1) {
						itemData1.push(itemData[a]);
					}
					else {
						var count: number = itemData[a].count;
						for (var i = 0; i < 3; i++) {
							if (itemData[a].configID == xfIdArr[i]) count--;
						}
						if (count > 0) itemData1.push(itemData[a]);
					}
				}

			}
		}
		return itemData1;
	};

    /**
     * 获取背包指定阶级的心法-自动选择心法合成
     * @param type 类型
     */
	public getBagXinFaAutoByLevel(level) {
		var itemData = this.bagModel[UserBag.BAG_TYPE_OTHTER];
		var itemData1 = [];
		for (var a in itemData) {
			if (itemData[a].itemConfig.type == 2) {
				let xf = MiJiSkillConfig.getXinFaByItemId(itemData[a].configID);
				if (xf.typelevel == level) {
					var count: number = itemData[a].count;
					for (var i = 0; i < count; i++) {
						itemData1.push(itemData[a].configID);
					}
				}
			}
		}
		return itemData1;
	};

    /**
     * 获取背包可以替换装备的转职装备
     * @param type 类型
     */
	public getBagGoodsByZhuanZhi(type, subType, job) {
		var itemData = this.bagModel[UserBag.BAG_TYPE_EQUIP];
		var itemData1 = [];
		for (var a in itemData) {
			if (itemData[a].itemConfig.type == type && itemData[a].itemConfig.subType == subType && itemData[a].itemConfig.job == job) {
				if (Checker.Level(itemData[a].itemConfig.zsLevel, itemData[a].itemConfig.level, false))
					itemData1.push(itemData[a]);
			}
		}
		return itemData1;
	};

	public getBagGoodsByMountEquip(type: number, subType: number, job: number) {
		var itemData = this.bagModel[UserBag.BAG_TYPE_EQUIP];
		var itemData1 = [];
		for (var a in itemData) {
			if (itemData[a].itemConfig.type == type && itemData[a].itemConfig.subType == subType && (itemData[a].itemConfig.job == job || itemData[a].itemConfig.job == 0)) {
				itemData1.push(itemData[a]);
			}
		}
		return itemData1;
	}


    /**
     * 获取背包某种品质装备的id排序，小到大
     */
	public getBagEquipBySort(quality) {
		var ret = [];
		//优化取消排序 不需要lxh
		// var equipsList = this.bagModel[UserBag.BAG_TYPE_EQUIP].sort(function (n1, n2) {
		// 	if (n1.configID > n2.configID) {
		// 		return 1;
		// 	}
		// 	if (n1.configID < n2.configID) {
		// 		return -1;
		// 	}
		// 	return 0;
		// });
		var equipsList = this.bagModel[UserBag.BAG_TYPE_EQUIP];

		for (var k in equipsList) {
			if (GlobalConfig.itemConfig[equipsList[k].configID].quality == quality) {
				ret.push(equipsList[k]);
			}
		}
		return ret;
	};
    /**
    * 获取背包某种品质装备的id
    */
	public getBagEquipByLevelSort(quality): ItemData[] {
		var ret = [];
		if (this.bagModel[UserBag.BAG_TYPE_EQUIP]) {
			var equipsList = this.bagModel[UserBag.BAG_TYPE_EQUIP];
			var itemData = null;

			var itemConfig2 = null;
			for (var k in equipsList) {
				itemData = equipsList[k];
				itemConfig2 = GlobalConfig.itemConfig[itemData.configID];
				if (itemConfig2 && itemConfig2.quality == quality && itemConfig2.type == 0) {
					ret.push(itemData);
				}
			}
		}
		return ret;
	};

	public getBagEquipByZhuanZhiSplit(): ItemData[] {
		var ret = [];
		var equipsList = this.bagModel[UserBag.BAG_TYPE_EQUIP];
		if (equipsList) {
			var itemData: ItemData = null;
			for (var k in equipsList) {
				itemData = equipsList[k];
				if (itemData.itemConfig && itemData.itemConfig.type == ItemType.ZHUANZHI) {
					ret.push(itemData);
				}
			}
		}
		return ret;
	}

	public getBagEquipByOrangeSplit(quality): ItemData[] {
		var ret = [];
		var equipsList = this.bagModel[UserBag.BAG_TYPE_EQUIP];
		if (equipsList) {
			var itemData: ItemData = null;
			var equipArray: Array<number> = [];

			for (var k in equipsList) {
				itemData = equipsList[k];
				if (itemData.itemConfig && itemData.itemConfig.quality == quality && itemData.itemConfig.type == 0) {
					ret.push(itemData);
					// if(itemData.itemConfig.subType != 0 && itemData.itemConfig.subType !=2)
					// {
					// 	ret.push(itemData);
					// }
					// else
					// {
					// 	if(itemData.itemConfig.level < 80)
					// 	{
					// 		var tempEquip:EquipsData = SubRoles.ins().getEquipMinLevelByIndex(itemData.itemConfig.subType,itemData.itemConfig.job);
					// 		if(tempEquip == null || tempEquip.item.itemConfig == null)
					// 			continue;
					// 		if(itemData.itemConfig.level <= tempEquip.item.itemConfig.level)
					// 		{
					// 			ret.push(itemData);
					// 		}	
					// 		else
					// 		{
					// 			equipArray[itemData.configID] = (equipArray[itemData.configID] == undefined)?1:equipArray[itemData.configID] + 1;
					// 			if(equipArray[itemData.configID] < this.getBagEquipCountById(itemData.configID))
					// 				ret.push(itemData);
					// 		}
					// 	}
					// 	else
					// 	{
					// 		var tempEquip:EquipsData = SubRoles.ins().getEquipMinLevelByIndex(itemData.itemConfig.subType,itemData.itemConfig.job);
					// 		if(tempEquip == null || tempEquip.item.itemConfig == null)
					// 			continue;
					// 		if(itemData.itemConfig.level <= tempEquip.item.itemConfig.level && itemData.itemConfig.zsLevel <= tempEquip.item.itemConfig.zsLevel)
					// 		{
					// 			ret.push(itemData);	
					// 		}									
					// 		else
					// 		{
					// 			equipArray[itemData.configID] = (equipArray[itemData.configID] == undefined)?1:equipArray[itemData.configID] + 1;
					// 			if(equipArray[itemData.configID] < this.getBagEquipCountById(itemData.configID))
					// 				ret.push(itemData);
					// 		}
					// 	}
					// }

				}
			}
		}
		return ret;
	}

    /**
     * 通过handle获取背包物品
     * @param type 类型
     * @param handle
     */
	public getBagGoodsByHandle(type, handle) {
		var itemData = this.bagModel[type];
		for (var i = 0; i < itemData.length; i++) {
			if (itemData[i].handle == (handle))
				return itemData[i];
		}
		return null;
	};
    /** TODO hepeiye
     * 获取寻宝仓库排序,可以传入其他类型共用，，默认是寻宝
     */
	public getHuntGoodsBySort(type: number = UserBag.BAG_TYPE_TREASUREHUNT) {
		let a = egret.getTimer();
		var goodsList = [];
		//取消排序
		if (this.bagModel[type]) {//直接返回 lxh
			return this.bagModel[type];
		}

		if (this.bagModel[type]) {
			goodsList = this.bagModel[type].sort(function (n1, n2) {
				if (n1.itemConfig.type < n2.itemConfig.type) {
					return 1;
				}
				else if (n1.itemConfig.type > n2.itemConfig.type) {
					return -1;
				}
				if (n1.itemConfig.type) {
					if (n1.configID >= n2.configID) {
						return 1;
					}
					else if (n1.configID < n2.configID) {
						return -1;
					}
				}
				else {
					if (ItemConfig.calculateBagItemScore(n1) >= ItemConfig.calculateBagItemScore(n2)) {
						return -1;
					}
					else if (ItemConfig.calculateBagItemScore(n1) < ItemConfig.calculateBagItemScore(n2)) {
						return 1;
					}
				}
				return 0;
			});
		}
		let b = egret.getTimer();

		console.log("获取寻宝仓库排序 = " + (b - a));

		return goodsList;
	};
	//可熔炼的羽翼和天珠装备
	public getWingZhuEquip() {
		// var _this = this;
		var item = this.getBagSortQualityEquips(5, 0, 0, this.otherEquipSmeltFilter);
		var ronglist = [];
		if (item.length > 0) {
			item.sort(this.sort1);
			var equipNeededCount = [];
			var equipsLen = SubRoles.ins().getSubRoleByIndex(0).wingsData.equipsLen
			for (var i = 0; i < equipsLen; i++) {
				equipNeededCount[i] = [];
			}
			item.forEach((element) => {
				if (this.updateWingEquip(element) != null)
					ronglist.push(element);
				else {
					let count = (equipNeededCount[element.itemConfig.subType][element.itemConfig.level] || 0) + 1;
					if (count <= 3) {
						equipNeededCount[element.itemConfig.subType][element.itemConfig.level] = count;
					} else {
						ronglist.push(element);
					}
				}
			});
		}
		return ronglist;
	};
	//对比下装备
	public updateWingEquip(data) {
		//和身上的天珠装备比较评分
		var index = 0;
		var len = SubRoles.ins().subRolesLen;
		// if (data.itemConfig.subType == ForgeConst.EQUIP_POS_TO_SUB[EquipPos.DZI]) {
		// 	var score = ItemConfig.calculateBagItemScore(data);
		// 	for (var i = 0; i < len; i++) {
		// 		var mo = SubRoles.ins().getSubRoleByIndex(i);
		// 		var equip = mo.getEquipByIndex(EquipPos.DZI);
		// 		var config = equip.item.itemConfig;
		// 		if (config && score <= ItemConfig.calculateBagItemScore(equip.item)) {
		// 			index++;
		// 		}
		// 	}
		// }
		// if (index >= len)
		// 	return data;
		// index = 0;
		for (var i = 0; i < len; i++) {
			var wingsData = SubRoles.ins().getSubRoleByIndex(i).wingsData;
			// let equpip: EquipsData[] = wingsData.equipsLen;
			var len_1 = wingsData.equipsLen;
			for (var k = 0; k < len_1; k++) {
				var equdata = wingsData.getEquipByIndex(k);
				if (equdata.configID != 0) {
					if (data.itemConfig.subType == equdata.itemConfig.subType
						&& ItemConfig.calculateBagItemScore(data) <= ItemConfig.calculateBagItemScore(equdata)) {
						index++;
					}
				}
			}
		}
		if (index >= len)
			return data;
		return null;
	};
    /**
     * 获取是否有可用道具
     */
	public getIsExitUsedItem() {
		var arr = this.bagModel[UserBag.BAG_TYPE_OTHTER];
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].getCanbeUsed()) {
				return true;
			}
		}
		return false;
	};
	/**计算装备评分 是否比身上的装备评分高 */
	public calculationScore(item) {
		var equipsData;
		var mPoint = 0;
		var len = SubRoles.ins().subRolesLen;
		for (var ii = 0; ii < len; ii++) {
			var role = SubRoles.ins().getSubRoleByIndex(ii);
			if (role.job == item.itemConfig.job) {
				var equipLen = role.getEquipLen();
				for (var n = 0; n < equipLen; n++) {
					equipsData = role.getEquipByIndex(n).item;
					if (equipsData && equipsData.itemConfig && equipsData.itemConfig.subType == item.itemConfig.subType) {
						if (mPoint == 0) {
							mPoint = equipsData.point;
						}
						else {
							mPoint = Math.min(equipsData.point, mPoint);
						}
					}
				}
			}
		}
		var ceGap = item.point - mPoint;
		return ceGap;
	};

	getBagGoodsById(type: number, id: number): ItemData {
		for (var list = this.bagModel[type], n = 0; n < list.length; n++)
			if (list[n].itemConfig.id == id) return list[n];
		return null
	}

	//------------------------------------------------特殊道具回调函数------------------------------------------------
	public useRenameItem(id, count) {
		// console.warn("useRenameItem " + "RenameWin");
		ViewManager.ins().open(RenameWin);
	};

	private UseCallBoss(id, count) {

	}


	private static attrPowerConfig: any;
    /**
 * 换算属性组的战斗力
 * @param attr
 */
	public static getAttrPower(attr) {
		if (this.attrPowerConfig == null)
			this.attrPowerConfig = GlobalConfig.ins("AttrPowerConfig");
		var allPower = 0;
		var tmp = [];
		for (var i = 0; i < attr.length; i++) {
			if (this.attrPowerConfig[attr[i].type] == null) continue;
			allPower += (attr[i].value == undefined ? 0 : attr[i].value) * this.attrPowerConfig[attr[i].type].power;
			tmp[attr[i].type] = attr[i].value
		}
		allPower += (tmp[2] ? tmp[2] : 0) * (tmp[11] ? tmp[11] : 0) / 10000 * this.attrPowerConfig[2].power + (tmp[4] ? tmp[4] : 0) * (tmp[12] ? tmp[12] : 0) / 10000 * this.attrPowerConfig[4].power
		return Math.floor(allPower / 100);
	};
	/**背包物品类型-其他物品*/
	public static BAG_TYPE_OTHTER = 0;
	/**背包物品类型-装备 */
	public static BAG_TYPE_EQUIP = 1;
	/**寻宝相关 */
	public static BAG_TYPE_TREASUREHUNT = 2;
	/**十连抽仓库相关 */
	public static BAG_THE_LUCK = 3;
	/**VIP寻宝 */
	public static BAG_TYPE_VIPTREASUREHUNT = 5;
	public static BAG_ENOUGH = 20;

	public static CheckEnough(itemId: number, value: number): boolean {
		var curNum = UserBag.ins().getBagGoodsCountById(0, itemId);
		if (curNum < value) {
			let config = GlobalConfig.itemConfig[itemId]
			if (config) {
				UserTips.ins().showTips(config.name + "数量不足")
			}
			return false
		}
		return true
	}

	//=======================十连抽start====================

	//=======================十连抽stop=====================
	/**设置一个道具消耗的通用方法 */
	public setNeedItem(list: { type: number, id: number, count: number }[], group: eui.Group, imgWH: number = 22, labSize: number = 16, labColor = 0x3b3b3b, stroke = 0, strokeColor = 0xFFFFFF) {
		let imageList = [];
		let labList = [];
		let numChild = group.numChildren;
		for (var i = 0; i < numChild; i++) {
			let child = group.removeChildAt(0);
			if (child && child instanceof eui.Image) {
				imageList.push(child);
			}
			if (child && child instanceof eui.Label) {
				labList.push(child);
			}
		}
		for (var i = 0; i < list.length; i++) {
			let img: eui.Image;
			if (!imageList[i]) {
				img = new eui.Image();
			} else {
				img = imageList[i]
			}
			img.width = imgWH;
			img.height = imgWH;
			let str = "";
			if (list[i].id == 2) {
				img.source = "little_icon_03_png";
			} else if (list[i].id == 1) {
				img.source = "little_icon_02_png";
			} else {
				let itemConfig = GlobalConfig.ins("ItemConfig")[list[i].id];
				let itmeType = 0;
				if (itemConfig && itemConfig.type == 0) {
					itmeType = 1;
				}
				str = CommonUtils.overLength(UserBag.ins().getBagGoodsCountById(itmeType, list[i].id)) + "/";
				if (itemConfig) {
					img.source = itemConfig.icon + "_png";
				}
			}
			let lab: eui.Label
			if (!labList[i]) {
				lab = new eui.Label();
			} else {
				lab = labList[i];
			}
			lab.height = imgWH;
			lab.verticalAlign = "middle";
			lab.size = labSize;
			lab.textColor = labColor;
			lab.stroke = stroke;
			lab.strokeColor = strokeColor;
			let num = CommonUtils.overLength(list[i].count);
			lab.text = str + num;
			group.addChild(img);
			group.addChild(lab);
		}
	}

}

MessageCenter.compile(UserBag);

/**背包类型 */
enum BagType {
	/**其他物品背包 */
	TYPE0 = 0,
	/**装备背包 */
	TYPE1 = 1,
	/**纹章背包 */
	TYPE4 = 4,
}
window["UserBag"] = UserBag