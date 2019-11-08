class DressModel extends BaseSystem {

	public static ins(): DressModel {
		return super.ins()
	}

	public constructor() {
		super()
		this.regNetMsg(S2cProtocol.sc_dress_time_end, this.doDressTimeEnd)
	}

	sendDressInfoReq() {
		this.Rpc(C2sProtocol.cs_dress_get_info, null, this.doDressInfo, this)
	}

	private doDressInfo(e: Sproto.cs_dress_get_info_response) {
		this.parser(e)
		GameGlobal.MessageCenter.dispatch(MessageDef.DRESS_INFO)
	}

	sendDressActivationReq(id: number) {
		let req = new Sproto.cs_dress_activate_request
		req.id = id
		this.Rpc(C2sProtocol.cs_dress_activate, req, this.doDressActivationRes, this)
	}
	public isActivat: boolean = false;
	private doDressActivationRes(e: Sproto.cs_dress_activate_response) {
		this.isActivat = true;
		this.parserAct(e)
		GameGlobal.MessageCenter.dispatch(MessageDef.DRESS_JIHUORES)
		UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101656)
	}

	private zhuangBanId: any;

	sendDressUserReq(roleIndex, id) {
		if (this.zhuangBanId == null) {
			this.zhuangBanId = GlobalConfig.ins("ZhuangBanId");
		}
		let config = this.zhuangBanId[id]
		if (config && (config.pos == DressType.ARM || config.pos == DressType.ROLE)) {
			LegendModel.ins().SendDress(roleIndex, null)
		}
		let req = new Sproto.cs_dress_dress_request
		req.roleIndex = roleIndex
		req.id = id
		this.Rpc(C2sProtocol.cs_dress_dress, req, this.doDressUserRes, this)
	}

	private doDressUserRes(e: Sproto.cs_dress_dress_response) {
		this.parserDress(e)
		GameGlobal.MessageCenter.dispatch(MessageDef.DRESS_INFO)
		UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101657);
		if (this.isActivat) {
			this.isActivat = false;
			// let dressWin = ViewManager.ins().getView(DressWin);
			// if (dressWin instanceof DressWin) {
			// 	let roleId = dressWin.m_RoleSelectPanel.getCurRole();
			let zhuangBanId = GlobalConfig.ins("ZhuangBanId")[e.dressId];
			ViewManager.ins().open(MainNewWin, ResAnimType.TYPE4, e.roleIndex, [null, zhuangBanId.name, 4])
			// }
		}
	}

	sendUnDressUserReq(e, t) {
		let req = new Sproto.cs_dress_undress_request
		req.roleIndex = e
		req.id = t
		this.Rpc(C2sProtocol.cs_dress_undress, req, this.doUnDressUserRes, this)
	}

	private doUnDressUserRes(e: Sproto.cs_dress_undress_response) {
		this.parserDress(<Sproto.cs_dress_dress_response><any>e)
		GameGlobal.MessageCenter.dispatch(MessageDef.DRESS_UN_INFO, e.roleIndex, e.posIndex), UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101658)
	}

	private doDressTimeEnd(e: Sproto.sc_dress_time_end_request) {
		this.parserDel(e.dressId), GameGlobal.MessageCenter.dispatch(MessageDef.DRESS_INFO)
	}

	sendTiShengReq(e) {
		let req = new Sproto.cs_dress_upgrade_request
		req.id = e
		this.Rpc(C2sProtocol.cs_dress_upgrade, req, this.doTiShengRes, this)
	}

	private doTiShengRes(e: Sproto.cs_dress_upgrade_response) {
		this.parserUpdateAct(e.timeInfo)
		GameGlobal.MessageCenter.dispatch(MessageDef.DRESS_INFO)
	}

	sendXuFeiReq(e) {
		let req = new Sproto.cs_dress_continue_request
		req.id = e
		this.Rpc(C2sProtocol.cs_dress_continue, req, this.doXuFeiRes, this)
	}

	private doXuFeiRes(e: Sproto.cs_dress_continue_response) {
		this.parserUpdateAct(e.timeInfo)
		UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101659)
		GameGlobal.MessageCenter.dispatch(MessageDef.DRESS_INFO)
	}

	timeInfo: DressTimeInfo[] = []
	private posInfo: DressPosInfo[] = []

	parser(rsp: Sproto.cs_dress_get_info_response) {
		var len = rsp.timeInfo.length
		this.timeInfo = [];
		for (let i = 0; len > i; i++) {
			var n = new DressTimeInfo;
			let data = rsp.timeInfo[i]
			n.dressId = data.dressId
			n.invalidtime = data.invalidtime
			n.dressLevel = data.dressLevel
			n.dressExp = data.dressExp
			this.timeInfo.push(n)
		}
		this.posInfo = []
		for (let len = rsp.posInfo.length, i = 0; len > i; i++) {
			for (var data = new DressPosInfo, j = 0; 5 > j; j++) {
				data.posAry[j] = rsp.posInfo[i].posArray[j]
			}
			this.posInfo.push(data)
		}
	}

	parserAct(rsp: Sproto.cs_dress_activate_response) {
		let e = rsp.timeInfo
		var t = new DressTimeInfo
		t.dressId = e.dressId
		t.invalidtime = e.invalidtime
		t.dressLevel = e.dressLevel
		t.dressExp = e.dressExp
		this.timeInfo.push(t)
	}

	parserUpdateAct(data: DressTimeInfo) {
		var timeInfo = new DressTimeInfo;
		timeInfo.dressId = data.dressId, timeInfo.invalidtime = data.invalidtime, timeInfo.dressLevel = data.dressLevel, timeInfo.dressExp = data.dressExp;
		for (var i = this.timeInfo.length, n = 0; i > n; n++)
			if (this.timeInfo[n].dressId == timeInfo.dressId) {
				this.timeInfo[n] = timeInfo;
				break
			}
	}

	parserDress(e: Sproto.cs_dress_dress_response) {
		var roleIndex = e.roleIndex,
			pInfo = this.posInfo[roleIndex],
			posIndex = e.posIndex,
			dressId = e.dressId;
		pInfo && (pInfo.posAry[posIndex - 1] = dressId)
		GameGlobal.rolesModel[roleIndex].zhuangbei[posIndex - 1] = dressId
		1 == posIndex || 2 == posIndex
			? GameGlobal.MessageCenter.dispatch(MessageDef.CHANGE_EQUIP)
			: GameGlobal.MessageCenter.dispatch(MessageDef.CHANGE_WING);
		var o = <CharRole>EntityManager.ins().getEntityByHandle(GameGlobal.rolesModel[roleIndex].handle);
		o && o.updateModel()
		/**这段逻辑是套装跟衣服武器互斥 */
		if (posIndex == 5 && dressId > 0) {
			if (pInfo.posAry[0] > 0) {
				this.sendUnDressUserReq(roleIndex, 1);
			}
			if (pInfo.posAry[1] > 0) {
				this.sendUnDressUserReq(roleIndex, 2);
			}
		} else if ((posIndex == 1 || posIndex == 2) && dressId > 0) {
			if (pInfo.posAry[4] > 0) {
				this.sendUnDressUserReq(roleIndex, 5);
			}
		}
	}

	parserDel(dressId: number) {
		let i = 0,
			n = this.timeInfo.length,
			r = this.posInfo.length;
		for (i = 0; n > i; i++) {
			var o = this.timeInfo[i];
			if (o.dressId == dressId) {
				this.timeInfo.splice(i, 1);
				break
			}
		}
		for (i = 0; r > i; i++)
			for (var s = this.posInfo[i], a = 0; 3 > a; a++)
				if (s.posAry[a] == dressId) {
					s.posAry[a] = 0
					GameGlobal.rolesModel[i].zhuangbei[a] = 0
					0 == a || 1 == a
						? GameGlobal.MessageCenter.dispatch(MessageDef.CHANGE_EQUIP)
						: GameGlobal.MessageCenter.dispatch(MessageDef.CHANGE_WING);
					var l = <CharRole>EntityManager.ins().getEntityByHandle(GameGlobal.rolesModel[i].handle);
					l && l.updateModel();
					break
				}
	}

	getModelPosId(index): DressPosInfo {
		return this.posInfo[index] || new DressPosInfo
	}

	redPoint() {
		return this.careerRedPoint()
	}

	careerRedPoint() {
		for (var e = !1, t = GameGlobal.rolesModel.length, i = 0; t > i; i++) {
			var n = GameGlobal.rolesModel[i].job,
				r = this.getinfoByCareer(n);
			r.forEach(function (t) {
				var i = t.cost.itemId,
					n = t.cost.num;
				UserBag.ins().getBagGoodsCountById(0, i) >= n && (e = 3 == t.pos && GameGlobal.actorModel.level <= 16 ? !1 : !0)
			})
		}
		return e
	}

	// curRoleRedPoint(e) {
	// 	return this.roleRedPoint()[e]
	// }

	// roleRedPoint() {
	// 	for (var e = [!1, !1, !1], t = GameGlobal.rolesModel.length, i = (t) => {
	// 		var i = GameGlobal.rolesModel[t].job,
	// 			r = n.getinfoByCareer(i);
	// 		r.forEach(function (i) {
	// 			var n = i.cost.itemId,
	// 				r = i.cost.num;
	// 			UserBag.ins().getBagGoodsCountById(0, n) >= r && (3 == i.pos && GameGlobal.actorModel.level <= 16 ? e[t] = !1 : e[t] = !0)
	// 		})
	// 	}, n = this, r = 0; t > r; r++) i(r);
	// 	return e
	// }

	canDress(e: number, t: number, role: number = 0) {
		if (t == DressType.WING && GameGlobal.actorModel.level <= 16) return !1;
		var i = this.getinfoByCareer(e);

		for (var n in i)
			if (i[n].pos == t) {
				var r = i[n].cost.itemId,
					o = i[n].cost.num;
				var timeInfo = this.timeInfo[role];
				if (timeInfo)//是否有激活的装扮
				{
					if (timeInfo.dressId == i[n].id && timeInfo.dressLevel == 5)		//是否满级
						return false;
					else if (UserBag.ins().getBagGoodsCountById(0, r) >= o)
						return true;
				}
				else if (UserBag.ins().getBagGoodsCountById(0, r) >= o)			//未激活装扮
				{
					return true;
				}
			}
		return !1
	}

	posRedPoint(obj: JobConst) {
		var t = [!1, !1, !1],
			i = this.getinfoByCareer(obj);
		return i.forEach(function (e) {
			var i = e.cost.itemId,
				n = e.cost.num;
			UserBag.ins().getBagGoodsCountById(0, i) >= n && (3 == e.pos && GameGlobal.actorModel.level <= 16 ? t[e.pos - 1] = !1 : t[e.pos - 1] = !0)
		}), t
	}

	getinfoByCareer(job: JobConst) {
		var t = [];
		//if (!this.timeInfo) return t;
		var subRolesLen: number = SubRoles.ins().subRolesLen;

		if (this.zhuangBanId == null) {
			this.zhuangBanId = GlobalConfig.ins("ZhuangBanId");
		}

		for (var i in this.zhuangBanId) {
			var maxNum = 0;
			if (this.zhuangBanId[i].roletype == job) {
				for (var n = false, r = this.timeInfo.length, o = 0; r > o; o++)
					if (this.timeInfo[o].dressId == this.zhuangBanId[i].id && this.timeInfo[o].dressLevel == 5)//判断是否等级达到最大等级
						maxNum++;

				if (maxNum < subRolesLen)
					t.push(this.zhuangBanId[i]);
			}
		}
		return t
	}

	getinfoById(e) {
		for (var t in this.timeInfo)
			if (this.timeInfo[t].dressId == e) return this.timeInfo[t];
		return null
	}

	public GetDressIDByRole(roleIndex: number, pos: number): number {
		let info = this.posInfo[roleIndex]
		if (info) {
			return info.posAry[pos]
		}
		return 0
	}

	public mDressModelRedPoint = new DressModelRedPoint

}

class DressTimeInfo {
	dressId
	invalidtime
	dressLevel
	dressExp
}

class DressPosInfo {
	posAry: number[] = []
}

enum DressType {
	ROLE = 1,
	ARM = 2,
	WING = 3,
	MOUNT = 4,
	TaoZhuang = 5 //套装
}

class DressItemInfo {
	context: DressWin
	isDress = false
	isUser = false
	isTitle = false
	zhuanban
	timer
	weight = 0;
}

class DressModelRedPoint extends IRedPoint {

	private m_Data = false

	public constructor() {
		super()
	}

	public GetMessageDef(): string[] {
		return [
			MessageDef.CHANGE_ITEM,
			MessageDef.ADD_ITEM,
			MessageDef.DELETE_ITEM,
		]
	}

	public DoUpdate(type: string) {
		this._DoCheck()
		// _Log("Dress RedPoint Update!!!")
	}
	private zhuangBanId: any;
	private _DoCheck(): void {
		this.m_Data = false;
		if (this.zhuangBanId == null) {
			this.zhuangBanId = GlobalConfig.ins("ZhuangBanId");
		}
		for (let key in this.zhuangBanId) {
			let data = this.zhuangBanId[key];
			this.m_Data = UserBag.ins().getBagGoodsCountById(0, data.cost.itemId) >= data.cost.num;
			if (this.m_Data) {
				break
			}
		}
	}

	public IsRed(): boolean {
		for (var e = GameGlobal.rolesModel.length, t = 0; e > t; t++) {
			for (var i = 1; i <= 3; i++) {
				var bool = GameGlobal.dressmodel.canDress(GameGlobal.rolesModel[t].job, i, i - 1);
				if (bool)
					return true;
			}
		}
		return false;
		//return this.m_Data;
	}
}
window["DressModel"] = DressModel
window["DressTimeInfo"] = DressTimeInfo
window["DressPosInfo"] = DressPosInfo
window["DressItemInfo"] = DressItemInfo
window["DressModelRedPoint"] = DressModelRedPoint