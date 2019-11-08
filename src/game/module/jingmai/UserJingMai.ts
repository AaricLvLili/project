class UserJingMai extends BaseSystem {

	static ins(): UserJingMai {
		return super.ins();
	}

	public sendBoost(roleId: number): void {
		let req = new Sproto.cs_jingmai_boost_request()
		req.roleID = roleId
		this.Rpc(C2sProtocol.cs_jingmai_boost, req, this.doUpData, this)
	}

	public sendUpgrade(roleId: number): void {
		let req = new Sproto.cs_jingmai_upgrade_request()
		req.roleID = roleId
		this.Rpc(C2sProtocol.cs_jingmai_upgrade, req, this.doUpData, this)
	}

	private doUpData(rsp: any): void {
		var index = rsp.index
		SubRoles.ins().getSubRoleByIndex(index).jingMaiData.parser(rsp.data);
		this.postUpdate();
	}

	public postUpdate(): void {
	}

	public sendBigUpLevel(roleId: number): void {
		let req = new Sproto.cs_jingmai_stage_request()
		req.roleID = roleId
		this.Rpc(C2sProtocol.cs_jingmai_stage, req, this.doBigUpLevel, this)
	}

	private doBigUpLevel(rsp: Sproto.cs_jingmai_stage_response): void {
		var result = rsp.result
		var str;
		if (!result) {
			if (!rsp.type) {
				str = "使用成功，元神等阶+1";
				this.doUpData(rsp);
			}
		} else {
			str = "道具不足够";
		}
		if (str) {
			UserTips.ins().showTips(str);
		}
	}
	private jingMaiCommonConfig: any;
    /**
     * 是否可以提升元神
     */
	canGradeupJingMai() {
		var boolList = [false, false, false];
		if (this.jingMaiCommonConfig == null) {
			this.jingMaiCommonConfig = GlobalConfig.ins("JingMaiCommonConfig");
		}
		if (GameLogic.ins().actorModel.level < this.jingMaiCommonConfig.openLevel) {
			return boolList
		}
		var config;
		var costNum = 0;
		var itemNum = 0;
		var len = SubRoles.ins().subRolesLen;
		for (var i = 0; i < len; i++) {
			var role = SubRoles.ins().getSubRoleByIndex(i);
			config = GlobalConfig.jingMaiLevelConfig[role.jingMaiData.level];
			costNum = config.count;
			if (costNum) {
				itemNum = UserBag.ins().getBagGoodsCountById(0, config.itemId);
				boolList[i] = (itemNum >= costNum);
			}
			else {
				boolList[i] = false;
			}
		}
		return boolList;
	};

	public IsRed(): boolean {
		if (Deblocking.Check(DeblockingType.TYPE_77, true)) {
			if (this.jingMaiCommonConfig == null) {
				this.jingMaiCommonConfig = GlobalConfig.ins("JingMaiCommonConfig");
			}
			if (GameLogic.ins().actorModel.level < this.jingMaiCommonConfig.openLevel) {
				return false
			}
			if (UserBag.ins().getBagGoodsCountById(UserBag.BAG_TYPE_OTHTER, this.jingMaiCommonConfig.levelItemid) > 0) {
				return true
			}
			let list = this.canGradeupJingMai()
			for (let v of list) {
				if (v) {
					return true
				}
			}
		}
		return false
	}

}

MessageCenter.compile(UserJingMai);
window["UserJingMai"] = UserJingMai