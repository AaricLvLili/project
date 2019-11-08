class ZhuzaiEquip extends BaseSystem {
	public constructor() {
		super();

		this.sysId = PackageID.ZhuZaiEquip;
		this.regNetMsg(S2cProtocol.sc_zhuzai_data, this.doZhuZaiData);
		this.regNetMsg(S2cProtocol.sc_zhuzai_shengjie_result, this.doShengjie);
		this.regNetMsg(S2cProtocol.sc_zhuzai_grow_result, this.doShengjie);
		
	}

	static ins(): ZhuzaiEquip {
		return super.ins()
	}

	/**
     * 处理主宰装备数据
     * 31-1
     * @param bytes
     */
	public doZhuZaiData(bytes: Sproto.sc_zhuzai_data_request) {
		SubRoles.ins().getSubRoleByIndex(bytes.roleId).setZhuZaiData(bytes.data.id - 1, bytes.data)

		GameGlobal.MessageCenter.dispatch(MessageDef.ZHUZAI_DATA_UPDATE)
	};
    /**
     * 发送升阶
     * 13-3
     */
	public sendShengjie(roleID, id) {
		var cs_zhuzai_shengjie = new Sproto.cs_zhuzai_shengjie_request();
		cs_zhuzai_shengjie.roleId = roleID;
		cs_zhuzai_shengjie.pos = id;
		GameSocket.ins().Rpc(C2sProtocol.cs_zhuzai_shengjie, cs_zhuzai_shengjie);
	
	};
	public doShengjie(bytes: Sproto.sc_zhuzai_grow_result_request) {
		GameGlobal.MessageCenter.dispatch(MessageDef.ZHUZAI_UP_RESULT, bytes.result)
	};
    /**
     * 发送成长
     * 13-4
     */
	public sendGrow(roleID, id ,isProtect) {
		var cs_zhuzai_grow = new Sproto.cs_zhuzai_grow_request();
		cs_zhuzai_grow.roleId = roleID;
		cs_zhuzai_grow.pos = id;
		cs_zhuzai_grow.isProtect = isProtect;
		GameSocket.ins().Rpc(C2sProtocol.cs_zhuzai_grow, cs_zhuzai_grow);
	};
    /**
     * 发送分解材料
     * 13-5
     */
	public sendFenjie() {
		if(this.canFengjie())//zy修改
		{
			let req = new Sproto.cs_zhuzai_fenjie_request();
			req.items = this.GetFengjieItemHandleData();
			GameSocket.ins().Rpc(C2sProtocol.cs_zhuzai_fenjie, req);
		}
	};
	public canFengjie() {
		let list = this.GetFengjieList()
		for (let key in list) {
			if (list[parseInt(key)] > 0) {
				return true
			}
		}
		return false
	};

	/**获取可以分解的list*/
	public GetFengjieList() {
		let list = {}
		let config = GlobalConfig.ins("EquipPointResolveConfig")
		let baseConfig = GlobalConfig.equipPointBasicConfig
		for (let key in config) {
			let itemId = parseInt(key)
			let id = config[itemId].id
			let needCount = baseConfig[id].activationItem.count
			let itemData = UserBag.ins().getBagGoodsById(UserBag.BAG_TYPE_OTHTER, itemId)
			let itemCount = itemData ? itemData.count : 0

			for (let i = 0; i < SubRoles.MAX_COUNT; ++i) {
				let role = SubRoles.ins().getSubRoleByIndex(i)
				if (role) {
					let data = role.getZhuZaiDataByIndex(id - 1)
					if (data && data.getZyRank() > 0) {
						continue
					}
				}
				itemCount -= needCount
			}
			list[itemId] = Math.max(itemCount, 0)
		}
		return list
	}

	/**获取可以分解的itemHandleData*/
	public GetFengjieItemHandleData() {
		let list:Sproto.zhuzai_fenjie_data[] = [];
		let config = GlobalConfig.ins("EquipPointResolveConfig")
		let baseConfig = GlobalConfig.equipPointBasicConfig
		for (let key in config) {
			let itemId = parseInt(key)
			let id = config[itemId].id
			let needCount = baseConfig[id].activationItem.count
			let itemData = UserBag.ins().getBagGoodsById(UserBag.BAG_TYPE_OTHTER, itemId)
			let itemCount = itemData ? itemData.count : 0

			for (let i = 0; i < SubRoles.MAX_COUNT; ++i) {
				let role = SubRoles.ins().getSubRoleByIndex(i)
				if (role) {
					let data = role.getZhuZaiDataByIndex(id - 1)
					if (data && data.getZyRank() > 0) {
						continue
					}
				}
				itemCount -= needCount
			}

			if(itemData && itemCount > 0)
			{
				let obj:Sproto.zhuzai_fenjie_data = new Sproto.zhuzai_fenjie_data();
				obj.itemHandle = itemData.handle;
				obj.count = itemCount;
				list.push(obj);
			}
		}
		return list
	}

	public canAllLevelup() {
		var len = SubRoles.ins().subRolesLen;
		for (var i = 0; i < len; i++) {
			if (this.canLevelup(i))
				return true;
		}
		return false;
	};
	public canLevelup(roleIndex) {
		var config = GlobalConfig.equipPointBasicConfig;
		var b = false;
		for (var i in config) {
			var role = SubRoles.ins().getSubRoleByIndex(roleIndex);
			var zhuzaiData = role.getZhuZaiDataByIndex(parseInt(i) - 1);
			if (zhuzaiData) {
				b = zhuzaiData.canLevelup();
			}
			if (b)
				return true;
		}
		return false;
	};
	public canAllAdvance() {
		var len = SubRoles.ins().subRolesLen;
		for (var i = 0; i < len; i++) {
			if (this.canAdvance(i))
				return true;
		}
		return false;
	};
	public canAdvance(roleIndex) {
		var config = GlobalConfig.equipPointBasicConfig;
		var b = false;
		for (var i in config) {
			var role = SubRoles.ins().getSubRoleByIndex(roleIndex);
			var zhuzaiData = role.getZhuZaiDataByIndex(parseInt(i) - 1);
			if (zhuzaiData) {
				b = zhuzaiData.canAdvance();
			}
			if (b)
				return true;
		}
		return false;
	};

	//  static GetIcon(index: number, disable: boolean): string {
	// 	return ResDataPath.GetItemFullName(ItemConst["ZHUZAI_0" + (index + 1) + disable ? "_1" : ""])
	// }
	private static EquipPointConstConfig:any;
	private static qualityObj:Array<string> = ["pf_black_01_png","pf_green_01_png","pf_blue_01_png",
										"pf_purple_01_png","pf_orange_01_png","pf_red_01_png"];
	public static GetBgIconByData(zhuzaiData: ZhuZaiData): string[] {
		let bgImg = "pf_orange_01_png"
		let index = zhuzaiData.id
		if(	this.EquipPointConstConfig == null )
			this.EquipPointConstConfig = GlobalConfig.ins("EquipPointGrowUpConfig");
		let tempEquip = this.EquipPointConstConfig[index][zhuzaiData.lv];
		// if (tempEquip.growlevel > 0) {
		// 	bgImg = ZhuzaiEquip.qualityObj[tempEquip.quality];
		// }
		return [ResDataPath.GetItemFullName(ItemConst["ZHUZAI_0" + index] + (tempEquip.growlevel < 1 ? "_1" : "")), bgImg]
	}

	public static GetBgIcon(roleIndex: number, index: number): string[] {
		return this.GetBgIconByData(SubRoles.ins().getSubRoleByIndex(roleIndex).getZhuZaiDataByIndex(index))
	}
}

MessageCenter.compile(ZhuzaiEquip);
window["ZhuzaiEquip"]=ZhuzaiEquip