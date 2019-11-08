class CouponSproto extends BaseSystem {
	public constructor() {
		super();
		this.regNetMsg(S2cProtocol.sc_ticket_treasure_base_info, this.getCouponInfo);
		this.regNetMsg(S2cProtocol.sc_ticket_treasure_hunt_result, this.getSearchResult);
		this.regNetMsg(S2cProtocol.sc_ticket_treasure_record_datas, this.getSearch);
		this.regNetMsg(S2cProtocol.sc_ticket_treasure_add_record, this.getAddSearch);
		this.regNetMsg(S2cProtocol.sc_vipshop_datas_info, this.getShopInfo);
		this.regNetMsg(S2cProtocol.sc_vipshop_item_info, this.getShopItem);
		this.regNetMsg(S2cProtocol.sc_bag_get_ticket_equip, this.getBagChange);
	}
	static ins(): CouponSproto {
		return super.ins();
	}

	private getCouponInfo(bytes: Sproto.sc_ticket_treasure_base_info_request) {
		let couponModel = CouponModel.getInstance;
		couponModel.lucknum = bytes.luckyValue;
		couponModel.luckIndex = bytes.awardValue;
		GameGlobal.MessageCenter.dispatch(CouponEvt.COUPON_TREASURE_UPDATE);
	}
	/**获得探索的奖励列表 */
	private getSearchResult(bytes: Sproto.sc_ticket_treasure_hunt_result_request) {
		let items: Sproto.treasure_item[] = bytes.items;
		CouponModel.getInstance.setTreasureResultData(items)
		ViewManager.ins().open(PetTreasureResultWin, 1);
		GameGlobal.MessageCenter.dispatch(CouponEvt.COUPON_TREASURE_UPDATE);
	}

	/**获得探索的人物奖励列表 */
	private getSearch(bytes: Sproto.sc_ticket_treasure_record_datas_request) {
		let treasureRoleList: Sproto.treasure_record[] = bytes.treasureRecord;
		CouponModel.getInstance.setTreasureRoleList(treasureRoleList)
		GameGlobal.MessageCenter.dispatch(CouponEvt.COUPON_TREASURE_ROLE_MSG);
	}
	/**获得探索的人物奖励列表 */
	private getAddSearch(bytes: Sproto.sc_ticket_treasure_add_record_request) {
		let treasureRoleList: Sproto.treasure_record = bytes.treasureRecord;
		CouponModel.getInstance.setTreasureRoleList([treasureRoleList])
		GameGlobal.MessageCenter.dispatch(CouponEvt.COUPON_TREASURE_ROLE_MSG);
	}
	/**商城信息 */
	private getShopInfo(bytes: Sproto.sc_vipshop_datas_info_request) {
		let couponModel = CouponModel.getInstance;
		let datas = bytes.datas;
		for (var i = 0; i < datas.length; i++) {
			couponModel.shopDic.set(datas[i].id, datas[i].buyCnt)
		}
		GameGlobal.MessageCenter.dispatch(CouponEvt.COUPON_SHOP_MSG);
	}

	/**商城信息 */
	private getShopItem(bytes: Sproto.sc_vipshop_item_info_request) {
		let couponModel = CouponModel.getInstance;
		couponModel.shopDic.set(bytes.id, bytes.buyCnt)
		GameGlobal.MessageCenter.dispatch(CouponEvt.COUPON_SHOP_MSG);
	}

	/** 仓库变动*/
	private getBagChange(rsp: Sproto.sc_bag_get_ticket_equip_request): void {
		let bagModel = UserBag.ins().bagModel;
		rsp.handle.forEach(element => {
			let itemModel;
			for (var i = bagModel[UserBag.BAG_TYPE_VIPTREASUREHUNT].length - 1; i >= 0; i--) {
				if (bagModel[UserBag.BAG_TYPE_VIPTREASUREHUNT][i].handle == (element)) {
					itemModel = bagModel[UserBag.BAG_TYPE_VIPTREASUREHUNT][i];
					bagModel[UserBag.BAG_TYPE_VIPTREASUREHUNT].splice(i, 1);
					break;
				}
			}
			if (itemModel.itemConfig.type == ItemType.FUWEN) {
				itemModel.mIsNewItem = true
			}
			bagModel[UserBag.BAG_TYPE_EQUIP].push(itemModel);
		});
		UserBag.postHuntStore();
	}

	/**探索 type 1 1次 2 10次 */
	public sendTreasure(type: number) {
		let rsp = new Sproto.cs_ticket_treasure_hunt_request;
		rsp.type = type;
		this.Rpc(C2sProtocol.cs_ticket_treasure_hunt, rsp);
	}
	/**请求探索的人物奖励列表 */
	public sendTreasureRoleList() {
		let rsp = new Sproto.cs_ticket_treasure_record_request;
		this.Rpc(C2sProtocol.cs_ticket_treasure_record, rsp);
	}

	public sendShopBuy(id: number) {
		let rsp = new Sproto.cs_buy_vipshop_item_request;
		rsp.id = id;
		this.Rpc(C2sProtocol.cs_buy_vipshop_item, rsp);
	}

	public sendShopInfo() {
		let rsp = new Sproto.cs_vipshop_info_request;
		this.Rpc(C2sProtocol.cs_vipshop_info, rsp);
	}

	public sendGetAward(id: number) {
		let rsp = new Sproto.cs_ticket_treasure_reward_request;
		rsp.id = id;
		this.Rpc(C2sProtocol.cs_ticket_treasure_reward, rsp);
	}



}
window["CouponSproto"] = CouponSproto