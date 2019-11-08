class ExpjadeModel extends BaseSystem {

	private m_AllExp = 0
	private m_UseCount = 0
	private m_DoubleCount = 0

	public get allExp(): number {
		return this.m_AllExp
	}

	public get useCount(): number {
		return this.m_UseCount
	}

	public get doubleCount(): number {
		return this.m_DoubleCount
	}

	public static ins(): ExpjadeModel {
		return super.ins()
	}

	public constructor() {
		super()
		// 经验玉的经验
		this.regNetMsg(S2cProtocol.sc_expjade_data, this._DoInitData)
		// 经验玉使用成功
		this.regNetMsg(S2cProtocol.sc_expjade_use_result, this._DoUseResult)
		// 经验玉增加经验
		this.regNetMsg(S2cProtocol.sc_expjade_addexp, this._DoAddExp)
	}

	// 经验玉的经验
	private _DoInitData(rsp: Sproto.sc_expjade_data_request) {
		this.m_AllExp = rsp.allExp
		this.m_DoubleCount = rsp.doubleCount
		this.m_UseCount = rsp.useCount
		GameGlobal.MessageCenter.dispatch(MessageDef.EXPJADE_UPDATE)
	}

	// 经验玉使用成功
	private _DoUseResult(rsp: Sproto.sc_expjade_use_result_request) {
		this.m_AllExp = rsp.allExp
		this.m_DoubleCount = rsp.doubleCount
		this.m_UseCount = rsp.useCount
		GameGlobal.MessageCenter.dispatch(MessageDef.EXPJADE_UPDATE)
		UserTips.ins().showTips(StringUtils.addColor(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101739, [this.m_UseCount, ExpjadeModel.GetCountPerDay() - this.m_UseCount]), Color.Green))
	}

	// 经验玉增加经验
	private _DoAddExp(rsp: Sproto.sc_expjade_addexp_request) {
		this.m_AllExp = rsp.allExp
		let addExp = rsp.addExp
		GameGlobal.MessageCenter.dispatch(MessageDef.EXPJADE_UPDATE)
	}

	// 使用经验玉
	public SendUse(type: number) {
		let req = new Sproto.cs_expjade_use_request
		req.type = type
		this.Rpc(C2sProtocol.cs_expjade_use, req)
	}

	/**
     * 获取下次vip显示
     * return -1表示已全部用完
     */
	public getNextVip() {
		let maxVipLv=GlobalConfig.ins("ZhuanShengConfig").vipLevel
		for (let i = 0; i < maxVipLv; ++i) {
			let config = GlobalConfig.ins("JingyanyuLevelConfig")[i]
			if (config.doubleCount > this.m_DoubleCount) {
				return i
			}
		}
		return maxVipLv;
	};

	public static GetCountPerDay(): number {
		return GlobalConfig.ins("JingyanyuLevelConfig")[GameGlobal.actorModel.vipLv].countPerDay
	}

	// 还有的使用次数
	public static HasUseCount(): number {
		return Math.max(ExpjadeModel.GetCountPerDay() - ExpjadeModel.ins().useCount, 0)
	}
}
window["ExpjadeModel"] = ExpjadeModel