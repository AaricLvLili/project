class GadSproto extends BaseSystem {
	public constructor() {
		super();
		this.regNetMsg(S2cProtocol.sc_tatoo_init_res, this.getGadInit);
		this.regNetMsg(S2cProtocol.sc_tatoo_equipon_res, this.getEquipChange);
		this.regNetMsg(S2cProtocol.sc_tatoo_equipoff_res, this.getEquipOff);
		this.regNetMsg(S2cProtocol.sc_tatoo_strength_res, this.getGadLvUp);
		this.regNetMsg(S2cProtocol.sc_tatoo_bag_init, this.gatGadBag);
		this.regNetMsg(S2cProtocol.sc_tatoo_add_res, this.gatGadAddBag);
		// this.regNetMsg(S2cProtocol.sc_bag_deal_delete_item, this.getGadDelBag);
	}
	static ins(): GadSproto {
		return super.ins();
	}

	/**纹章初始化 */
	private getGadInit(bytes: Sproto.sc_tatoo_init_res_request) {
		let gadModel = GadModel.getInstance;
		gadModel.setGadDic(bytes.data);
		GameGlobal.MessageCenter.dispatch(GadEvent.GAD_DATAUPDATE_MSG);
	}
	/**更换装备 */
	private getEquipChange(bytes: Sproto.sc_tatoo_equipon_res_request) {
		let gadModel = GadModel.getInstance;
		let dic: Dictionary<GadData> = gadModel.gadDic.get(bytes.roleid);
		let itemData = bytes.item;
		let gadData = dic.get(itemData.slot);
		gadData.attr = itemData.attr;
		gadData.exp = itemData.exp;
		gadData.itemid = itemData.itemid;
		gadData.level = itemData.level;
		gadData.roleId = bytes.roleid;
		gadData.slot = itemData.slot;
		gadData.mainId = itemData.mainid;
		GameGlobal.MessageCenter.dispatch(GadEvent.GAD_DATAUPDATE_MSG);
		ViewManager.ins().close(GadSelectWin);
	}
	/**卸下装备 */
	private getEquipOff(bytes: Sproto.sc_tatoo_equipoff_res_request) {
		let gadModel = GadModel.getInstance;
		let dic: Dictionary<GadData> = gadModel.gadDic.get(bytes.roleid);
		let gadData: GadData = dic.get(bytes.slot);
		gadData.attr = []
		gadData.exp = 0;
		gadData.itemid = -1;
		gadData.level = 0;
		GameGlobal.MessageCenter.dispatch(GadEvent.GAD_DATAUPDATE_MSG);
		ViewManager.ins().close(GadSelectWin);
	}
	/**升级 */
	private getGadLvUp(bytes: Sproto.sc_tatoo_strength_res_request) {
		let gadModel = GadModel.getInstance;
		let dic: Dictionary<GadData> = gadModel.gadDic.get(bytes.roleid);
		let itemData = bytes.item;
		let gadData = dic.get(itemData.slot);
		gadData.attr = itemData.attr;
		gadData.exp = itemData.exp;
		gadData.itemid = itemData.itemid;
		gadData.level = itemData.level;
		gadData.roleId = bytes.roleid;
		gadData.slot = itemData.slot;
		gadData.mainId = itemData.mainid;
		gadModel.lvUpSelectData.clear();
		gadModel.setAutoLvUpItem();
		GameGlobal.MessageCenter.dispatch(GadEvent.GAD_LVUP_MSG);
	}
	/**背包数据 */
	private gatGadBag(bytes: Sproto.sc_tatoo_bag_init_request) {
		let gadModel = GadModel.getInstance;
		if (bytes.code == 0) {
			// gadModel.gadBagDic.clear();
			gadModel.setGadBagDic(bytes.datas);
		} else {
			gadModel.setGadBagDic(bytes.datas);
		}
		GameGlobal.MessageCenter.dispatch(GadEvent.GAD_BAG_DATAUPDATE_MSG);
	}
	/**背包添加数据 */
	private gatGadAddBag(bytes: Sproto.sc_tatoo_add_res_request) {
		let gadModel = GadModel.getInstance;
		let gadBagData = new GadBagData();
		let data = bytes.data
		gadBagData.attr = data.att;
		gadBagData.handle = data.handle;
		gadBagData.configID = data.configID;
		gadBagData.level = data.level;
		gadBagData.exp = data.exp;
		gadModel.gadBagDic.set(gadBagData.handle, gadBagData);
		GameGlobal.MessageCenter.dispatch(GadEvent.GAD_BAG_DATAUPDATE_MSG);

		/**做个提示 */
		this.tips(data);
	}
	/**删除纹章背包道具 */
	public getGadDelBag(bytes: Sproto.sc_bag_deal_delete_item_request) {
		if (bytes.type == 4) {
			let gadModel = GadModel.getInstance;
			gadModel.gadBagDic.remove(bytes.handle);
			GameGlobal.MessageCenter.dispatch(GadEvent.GAD_BAG_DATAUPDATE_MSG);
		}
	}



	/**纹章初始化 */
	public sendGadInit() {
		let rsp = new Sproto.cs_tatoo_init_req_request;
		this.Rpc(C2sProtocol.cs_tatoo_init_req, rsp);
	}
	/**纹章更换 */
	public sendGadEquipChange(roleId: number, slot: number, handler: number) {
		let rsp = new Sproto.cs_tatoo_equipon_req_request;
		rsp.roleid = roleId;
		rsp.slot = slot;
		rsp.handler = handler;
		this.Rpc(C2sProtocol.cs_tatoo_equipon_req, rsp);
	}
	/**纹章卸下 */
	public sendGadEquipOff(roleId: number, slot: number) {
		let rsp = new Sproto.cs_tatoo_equipoff_req_request;
		rsp.roleid = roleId;
		rsp.slot = slot;
		this.Rpc(C2sProtocol.cs_tatoo_equipoff_req, rsp);
	}
	/**纹章强化 */
	public sendGadLvUp(roleId: number, slot: number, handler: number[]) {
		let rsp = new Sproto.cs_tatoo_strength_req_request;
		rsp.roleid = roleId;
		rsp.slot = slot;
		rsp.handler = handler;
		this.Rpc(C2sProtocol.cs_tatoo_strength_req, rsp);
	}


	private tips(data: Sproto.tatoo_bag_item) {
		let rsp: Sproto.sc_bag_deal_add_item_request = new Sproto.sc_bag_deal_add_item_request();
		rsp.type = 0;
		rsp.data = new Sproto.item_data();
		rsp.data.configID = data.configID;
		rsp.data.att = data.att;
		rsp.data.handle = data.handle;
		rsp.data.count = 1;
		rsp.data.invalidtime = 0;
		var itemModel = new ItemData();
		var type = rsp.type;
		itemModel.parser(rsp.data);
		if (itemModel.itemConfig.type == ItemType.FUWEN) {
			itemModel.mIsNewItem = true
		}
		var showTip = true;
		if (showTip) {
			if (itemModel.itemConfig.quality >= 4 && type == UserBag.BAG_TYPE_EQUIP) {
				UserTips.ins().showGoodEquipTips(itemModel);
			} else {
				if (type != UserBag.BAG_TYPE_TREASUREHUNT && GameMap.IsNoramlLevel()) {
					var quality = ItemBase.QUALITY_COLOR[itemModel.itemConfig.quality];
					var str = GlobalConfig.jifengTiaoyueLg.st101471 + "|C:" + quality + "&T:" + itemModel.itemConfig.name + " x " + itemModel.count + "|";
					UserTips.ins().showTips(str);
				}
			}
		}
	}





}
window["GadSproto"] = GadSproto