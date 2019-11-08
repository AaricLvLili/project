class GuildStore extends BaseSystem {


	private m_GuildStoreLv: number = 0
	//公会商店等级
	get guildStoreLv(): number {
		return this.m_GuildStoreLv
		// return Guild.ins().getBuildingLevels(GuildBuilding.GUILD_SHOP - 1 )
	} 

	guildStoreNum: number = 0
	_recordInfoAry: GuildStoreRecordInfo[] = []; //抽奖记录
	_guildStoreItemData: GuildStoreItemData

	_recordInfo: GuildStoreRecordInfo;

	public static ins(): GuildStore {
		return super.ins()
	}

	public constructor() {
		super();

		this.sysId = PackageID.GuildStore;
		this.regNetMsg(S2cProtocol.sc_guildshop_info, this.postGuildStoreInfo);
		this.regNetMsg(S2cProtocol.sc_guildshop_record, this.postGuildStoreBoxInfo);
		this.regNetMsg(S2cProtocol.sc_guildshop_open_ret, this.postGuildStoreBox);
	}

	/**抽奖记录 GuildStoreRecordInfo*/
	public getRecordInfoAry(index: number = -1): GuildStoreRecordInfo {
		// return index == -1 ? this._recordInfoAry : this._recordInfoAry[index];
		return this._recordInfoAry[index];
	};

	public GetRecordInfos(): GuildStoreRecordInfo[] {
		return this._recordInfoAry
	}

	/**箱子数据 GuildStoreItemData*/
	public getGuildStoreItemData(): GuildStoreItemData {
		return this._guildStoreItemData
	};
	//公会商店信息
	public postGuildStoreInfo(bytes: Sproto.sc_guildshop_info_request) {
		this.m_GuildStoreLv = bytes.level
		this.guildStoreNum = bytes.leftCount
	};
	//公会宝箱记录
	public postGuildStoreBoxInfo(bytes: Sproto.sc_guildshop_record_request) {
		// let list = []
		this._recordInfoAry = []
		for (var i = 0; i < bytes.records.length; i++) {
			var info = new GuildStoreRecordInfo();
			let data = bytes.records[i]
			info.times = data.time
			info.roleName = data.name
			info.itemId = data.itemid
			this._recordInfoAry.push(info)
		}
		this._recordInfoAry.sort(function(lhs, rhs) {
			return rhs.times - lhs.times
		})
		// for (let data of list) {
		// 	this._recordInfoAry.unshift(data)
		// }
		// for (let i = this._recordInfoAry.length - 1; i >= 50; ++i) {
		// 	this._recordInfoAry.pop()
		// }
	};
	//公会宝箱结果
	public postGuildStoreBox(bytes: Sproto.sc_guildshop_open_ret_request) {
		this._guildStoreItemData = new GuildStoreItemData
		this._guildStoreItemData.itemId = bytes.itemid
		this._guildStoreItemData.num = bytes.count
		this.guildStoreNum -= 1;
	};
	//获取公会商店信息
	public getGuildStoreInfo() {
		this.Rpc(C2sProtocol.cs_guildshop_getinfo)
	};
	//请求开箱记录
	public sendGuildStoreBoxInfo() {
		this.Rpc(C2sProtocol.cs_guildshop_getrecord)
	};
	//发送开箱请求
	public sendGuildStoreBox() {
		this.Rpc(C2sProtocol.cs_guildshop_open)
	};
}

MessageCenter.compile(GuildStore);
window["GuildStore"]=GuildStore