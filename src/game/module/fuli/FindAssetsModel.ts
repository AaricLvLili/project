class FindAssetsModel extends BaseSystem {
    
	private m_Assets: Sproto.find_assets_data[] = []

	public static ins(): FindAssetsModel {
		return super.ins()
	}

	public constructor() {
		super()
		this.regNetMsg(S2cProtocol.sc_find_assets_init_info, this._DoAssetsInit)
	}

	private _DoAssetsInit(rsp: Sproto.sc_find_assets_init_info_request) {
		this.m_Assets = rsp.datas

        // 移除不存在的配置
		for (let i = this.m_Assets.length - 1; i >= 0; --i) {
            let data = this.m_Assets[i]
			let configData = GlobalConfig.ins("RetrieveConfig")[data.type]
			if (!configData) {
				this.m_Assets.splice(i, 1)
			}
		}

		GameGlobal.MessageCenter.dispatch(MessageDef.FIND_ASSETS_UPDATE)
	}

	public SendInit() {
		this.Rpc(C2sProtocol.cs_find_assets_init)

		// let data = new Sproto.sc_find_assets_init_info_request
		// data.datas = []

		// let d = new Sproto.find_assets_data
		// d.type = 1
		// d.state = 0
		// d.datas = [
		// 	{type:0,id:1,count:123333},
		// 	{type:0,id:0,count:123333},
		// ] as any
		// data.datas = [
		// 	d
		// ]

		// this._DoAssetsInit(data)
	}

	public SendAssetsGet(type: number, moneyType: number) {
		let req = new Sproto.cs_find_assets_get_request
		req.type = type
		req.moneyType = moneyType
		this.Rpc(C2sProtocol.cs_find_assets_get, req)
	}

	public get assets(): Sproto.find_assets_data[] {
		return this.m_Assets
	}

	public HasFindAssets(): boolean {
		if (GameServer.loginDay <= 1) {
			return false
		}
		if (this.m_Assets.length > 0) {
			for (let data of this.m_Assets) {
				if (data.state == FindAssetsState.NONE) {
					return true
				}
			}
		}
		return false
	}
}

enum FindAssetsState {
	NONE = 0,
	GET = 1,
}
window["FindAssetsModel"]=FindAssetsModel