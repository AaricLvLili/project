/** 内功控制器*/
class NeiGongControl extends BaseSystem {
	public constructor() {
		super()
		this.regNetMsg(S2cProtocol.sc_neigong_info, this.sc_neigong_info);
	}

	public static ins(): NeiGongControl {
		return super.ins();
	}

	public neiGongDic: Dictionary<NeiGongData> = new Dictionary<NeiGongData>();

	public sc_neigong_info(byt: Sproto.sc_neigong_info_request): void {
		let neiGongData = new NeiGongData();
		neiGongData.progress = byt.progress;
		neiGongData.starLv = byt.starLv;
		neiGongData.roleid = byt.roleid;
		neiGongData.jindu = byt.jindu;
		neiGongData.power = byt.power;
		this.neiGongDic.set(neiGongData.roleid, neiGongData);
		GameGlobal.MessageCenter.dispatch(MessageDef.NEIGONG_UPDATE);
	}

	/** # 请求内功升级星数*/
	public cs_neigong_upstar(roleid: number): void {
		var rpcReq: Sproto.cs_neigong_upstar_request = new Sproto.cs_neigong_upstar_request;
		rpcReq.roleid = roleid;
		this.Rpc(C2sProtocol.cs_neigong_upstar, rpcReq);
	}


	/** # 请求内功升级阶数*/
	public cs_neigong_uppro(roleid: number): void {
		var rpcReq: Sproto.cs_neigong_uppro_request = new Sproto.cs_neigong_uppro_request;
		rpcReq.roleid = roleid;
		this.Rpc(C2sProtocol.cs_neigong_uppro, rpcReq);
	}


	/** # 请求内功信息*/
	public cs_neigong_info(roleid: number): void {
		var rpcReq: Sproto.cs_neigong_info_request = new Sproto.cs_neigong_info_request;
		rpcReq.roleid = roleid;
		this.Rpc(C2sProtocol.cs_neigong_info, rpcReq);
	}

	public getAllRoleNeiGongMsg() {
		var len = SubRoles.ins().subRolesLen;
		for (var i = 0; i < len; i++) {
			var role = SubRoles.ins().getSubRoleByIndex(i);
			if (role) {
				this.cs_neigong_info(role.roleID);
			}
		}
	}

	/**获取每个角色红点*/
	public checkRed() {
		if (Deblocking.Check(DeblockingType.TYPE_47, true)) {
			var len = SubRoles.ins().subRolesLen;
			for (var i = 0; i < len; i++) {
				var role = SubRoles.ins().getSubRoleByIndex(i);
				if (role) {
					let isShow = this.checkRoleRed(role.roleID);
					if (isShow) {
						return true;
					}
				}
			}
		}
		return false;
	}

	public checkRoleRed(roleId: number) {
		let neiGongConfigCommon = GlobalConfig.ins("NeiGongConfigCommon");
		let levelMax = neiGongConfigCommon.levelMax;
		let neiGongData = this.neiGongDic.get(roleId);
		if (neiGongData) {
			let starLv = neiGongData.starLv + neiGongData.progress * neiGongConfigCommon.levelPerStage;
			if (starLv < levelMax) {
				let neiGongConfigLevel = GlobalConfig.ins("NeiGongConfigLevel")[starLv];
				if (neiGongConfigLevel) {
					let num = UserBag.ins().getBagGoodsCountById(0, neiGongConfigLevel.cost.id);
					if (num >= neiGongConfigLevel.cost.count) {
						return true;
					}
				}
			}
		}
		return false;
	}

}
window["NeiGongControl"] = NeiGongControl