class Shop extends BaseSystem {

    shopData: ShopData;
    shopNorefrush: boolean;

    //OtherShopData: { [key: number]: any }

    static ins(): Shop {
        return super.ins()
    }


    constructor() {
        super();
        this.sysId = PackageID.Shop;
        this.shopData = new ShopData();
        this.regNetMsg(S2cProtocol.sc_shop_data, Shop.postUpdateShopData);
        this.regNetMsg(S2cProtocol.sc_shop_buy_ret, Shop.BuyResult);
        this.regNetMsg(S2cProtocol.sc_shop_refresh_ret, this.refreshGoodsSuccess);
        this.regNetMsg(S2cProtocol.sc_shop_jifen_buy_ret, Shop.RefreshIntegrationSucc);
        this.regNetMsg(S2cProtocol.sc_shop_update_medal_message, this.updateMedalMessage);
        this.regNetMsg(S2cProtocol.sc_shop_update_buy_medal, this.updateBuyMedal);
        this.regNetMsg(S2cProtocol.sc_mystery_shop_open_state, this.updateShopOpenState);
        this.regNetMsg(S2cProtocol.sc_shop_cross_tianti_glory_buy, this.onBuyHonorBack);
        this.regNetMsg(S2cProtocol.sc_shop_cross_tianti_glory_times, this.onHonorBuyTimesBack);

    }

    /**
         * 发送购买物品
         * 16-2
         * @param shopType	商店类型
         * @param arr		 物品数组id,num
         */
    public sendBuy(shopType, arr) {
        var cs_shop_buy = new Sproto.cs_shop_buy_request();
        cs_shop_buy.shopType = shopType;
        cs_shop_buy.items = new Array();
        for (var i = 0; i < arr.length; i++) {
            cs_shop_buy.items[i] = new Sproto.shopitem();
            cs_shop_buy.items[i].id = arr[i][0];
            cs_shop_buy.items[i].count = arr[i][1];
        }
        GameSocket.ins().Rpc(C2sProtocol.cs_shop_buy, cs_shop_buy);
    };
	/**
		送刷新商店
		6-3
	 */
    public sendRefreshShop() {
        GameSocket.ins().Rpc(C2sProtocol.cs_shop_refresh, new Sproto.cs_shop_refresh_request());
    };
	/**
		开启刷新商店
		6-3
	 */
    public sendStartRefreshShop() {
        GameSocket.ins().Rpc(C2sProtocol.cs_shop_start_refresh);
    };
    /**
     * 更新装备商店数据
     * 16-1
     */
    public static postUpdateShopData(bytes) {
        Shop.ins().shopData.parser(bytes);
    }
    /**
     * 购买商品结果
        6-2
     */
    public static postBuyResult(bytes: Sproto.sc_shop_buy_ret_request) {
        var result = bytes.result;

        return result;
    }
    public static BuyResult(bytes: Sproto.sc_shop_buy_ret_request) {
        Shop.postBuyResult(bytes);
    }
    public refreshGoodsSuccess(bytes) {
        GameGlobal.MessageCenter.dispatch(MessageDef.SHOP_REFRESH, true)
    };
    /*积分商店回包*/
    public static postRefreshIntegrationSucc(bytes: Sproto.sc_shop_jifen_buy_ret_request) {
        var result = bytes.result;
        var num = bytes.num;
        Shop.ins().shopData.point = num
        return [result, Shop.ins().shopData.point];
    };
    public static RefreshIntegrationSucc(bytes: Sproto.sc_shop_jifen_buy_ret_request) {
        Shop.postRefreshIntegrationSucc(bytes);
    }
    /**
    * 购买积分商店
    * 16-5
    */
    public sendIntegrationShop(index) {
        var cs_shop_buy_jifen = new Sproto.cs_shop_buy_jifen_request();
        cs_shop_buy_jifen.index = index;
        GameSocket.ins().Rpc(C2sProtocol.cs_shop_buy_jifen, cs_shop_buy_jifen);
    };

    public updateMedalMessage(byte: Sproto.sc_shop_update_medal_message_request) {
        let data = new FeatsStoreData(byte.featsStoreData);
        switch (byte.typ) {
            case ShopType.PET:
                GameLogic.ins().actorModel.petCredit = byte.credit
                break;
            case ShopType.RIDE:
                GameLogic.ins().actorModel.rideCredit = byte.credit
                break;
            case ShopType.CROSS:
                GameLogic.ins().actorModel.crossCredit = byte.credit
                break;
            case ShopType.ARTI:
                GameLogic.ins().actorModel.artifactCredit = byte.credit
                break;
        }
        // if (byte.typ == ShopType.PET) {
        //     GameLogic.ins().actorModel.petCredit = byte.credit
        // } else if (byte.typ == ShopType.RIDE) {
        //     GameLogic.ins().actorModel.rideCredit = byte.credit
        // } else if (byte.typ == ShopType.CROSS) {
        //     GameLogic.ins().actorModel.crossCredit = byte.credit
        // } else if (byte.typ == ShopType.CROSS) {
        //     GameLogic.ins().actorModel.crossCredit = byte.credit
        // }

        GameGlobal.MessageCenter.dispatch(MessageDef.SHOP_MEADAL_RESULT, data, byte.typ)
    }

    private updateBuyMedal(e: Sproto.sc_shop_update_buy_medal_request) {
        var t = e.index,
            i = e.count;
        GameGlobal.MessageCenter.dispatch(MessageDef.SHOP_MEADAL_BUY_RESULT, t, i, e.typ)
    }

    public sendMedalMessage(type: number) {
        let req = new Sproto.cs_shop_medal_message_request();
        req.typ = type
        this.Rpc(C2sProtocol.cs_shop_medal_message, req)
    }

    public sendBuyHonor(index: number) {
        var req = new Sproto.cs_shop_cross_tianti_glory_buy_request();
        req.cfgIndex = index;
        this.Rpc(C2sProtocol.cs_shop_cross_tianti_glory_buy, req);
    }

    private onBuyHonorBack(byte: Sproto.sc_shop_cross_tianti_glory_buy_request): void {
        var flag = byte.code;
        switch (flag) {
            case 0:
                UserTips.ins().showTips("购买成功");
                break;
            case 1:
                UserTips.ins().showTips("配置错误");
                break;
            case 2:
                UserTips.ins().showTips("每日购买次数不足");
                break;
            case 3:
                UserTips.ins().showTips("荣耀值不够");
                break;
        }
    }

    private onHonorBuyTimesBack(byte: Sproto.sc_shop_cross_tianti_glory_times_request): void {
        let data = new HonorStoreData(byte.cfgIdNums);
        GameGlobal.MessageCenter.dispatch(MessageDef.SHOP_HONOR_RESULT, data)
    }

    public sendReqHonorTimes(): void {
        var req = new Sproto.cs_shop_cross_tianti_glory_times_request();
        this.Rpc(C2sProtocol.cs_shop_cross_tianti_glory_times, req);
    }

    public sendBuyMedal(index: number, type: number) {
        let rep = new Sproto.cs_shop_buy_medal_request
        rep.index = index
        rep.typ = type
        this.Rpc(C2sProtocol.cs_shop_buy_medal, rep)
    }

    public openState: boolean = true;
    /**服务端通知神秘商店是否开启*/
    private updateShopOpenState(bytes: Sproto.sc_mystery_shop_open_state_request): void {
        this.openState = bytes.openstate;
        GameGlobal.MessageCenter.dispatch(MessageDef.SHOP_MEADAL_OPEN_STATE)
    }
    private shopPriceDic: Dictionary<number> = new Dictionary<number>();
    public getShopPrice(id: number, count: number = 1) {
        if (this.shopPriceDic.values.length <= 0) {
            let cof = GlobalConfig.ins("ItemStoreConfig");
            for (let key in cof) {
                let item = cof[key]
                this.shopPriceDic.set(item.itemId, item.price);
            }
        }
        return this.shopPriceDic.get(id) * count
    }

}

class ShopData {
    _refushTime: number;

    shopEquipData: Array<ShopEquipData>;
    point: number;
    times: number;

    public get refushTime() {
        return this._refushTime - GameServer.serverTime;
    }
    public set refushTime(value) {
        this._refushTime = value + GameServer.serverTime;
    }
    public parser(bytes: Sproto.sc_shop_data_request) {
        this.shopEquipData = [];
        this.refushTime = bytes.refreshTime;
        this.point = bytes.storescore;
        this.times = bytes.refreshCount;
        var num = bytes.datas.length;
        for (var i = 0; i < num; i++) {
            var s = new ShopEquipData;
            s.parser(bytes.datas[i]);
            this.shopEquipData[s.id] = s;
        }
    };
    /**
    * 获取黑市数据长度
    */
    public getShopEquipDataLength() {
        var result = 0;
        if (this.shopEquipData != null) {
            result = this.shopEquipData.length;
        }
        return result;
    };
    /**
    * 获取黑市数据（通过索引）
    * @param index
    */
    public getShopEquipDataByIndex(index): ShopEquipData {
        var result = null;
        if (this.shopEquipData != null) {
            if (index >= 0 && index < this.shopEquipData.length) {
                result = this.shopEquipData[index];
            }
        }
        return result;
    };
}
class ShopEquipData {

    id: number;
    costType: number;
    costNum: number;
    discountType: number;
    item = new ItemData;

    public parser(bytes: Sproto.shop_data) {
        this.id = bytes.id;
        this.costType = bytes.costType;
        this.costNum = bytes.costNum;
        // if (bytes.discountType == 80) this.discountType = 1;
        // else if (bytes.discountType == 50) this.discountType = 2;
        // else this.discountType = 0;
        let value = bytes.discountType / 100;
        if (value > 0 && value < 1)
            this.discountType = bytes.discountType / 10;
        else
            this.discountType = 0;
        this.item = new ItemData;
        this.item.parser(bytes.item);
    };
}
enum ShopType {
    NONE = 0,
    /**功勋商店 */
    FEAT = 1,//功勋商店
    /**宠物商店 */
    PET = 2,//宠物商店
    /**坐骑商店 */
    RIDE = 3,//坐骑商店
    /**跨服商店 */
    CROSS = 4,//跨服商店
    /**公会商店 */
    GUILD = 5,//公会商店
    /**神器商店 */
    ARTI = 6,//神器商店
}
MessageCenter.compile(Shop);
window["Shop"] = Shop
window["ShopData"] = ShopData
window["ShopEquipData"] = ShopEquipData