class RoleAddAttrPointModel extends BaseSystem {
	public constructor() {
		super();
		this.regNetMsg(S2cProtocol.sc_zs_point_info, this.sc_zs_point_info);
	}

	/**角色潜能点信息*/
	public addPointList: Array<RoleAddAttrPointData> = [];

	public get allLastPoint() {
		let maxPoint = 0;
		let nowAddPoint = 0;
		let roleAddAttrPointWin = ViewManager.ins().getView(RoleAddAttrPointWin);
		if (roleAddAttrPointWin && roleAddAttrPointWin instanceof RoleAddAttrPointWin) {
			let panel = roleAddAttrPointWin.roleAddAttrPointPanel;
			if (panel) {
				maxPoint = panel.addItem0.data.point;
				nowAddPoint += panel.addItem0.num;
				nowAddPoint += panel.addItem1.num;
				nowAddPoint += panel.addItem2.num;
				nowAddPoint += panel.addItem3.num;
			}
		}
		return maxPoint - nowAddPoint;
	}
	public static ins(): RoleAddAttrPointModel {
		return super.ins();
	}

	/**请求潜能点信息*/
	public cs_zs_point_req() {
		this.Rpc(C2sProtocol.cs_zs_point_req, new Sproto.cs_zs_point_req_request);
	}

	/**角色潜能点信息列表返回*/
	private sc_zs_point_info(bytes: Sproto.sc_zs_point_info_request) {
		if (this.addPointList[bytes.roldid] == null)
			this.addPointList[bytes.roldid] = new RoleAddAttrPointData();
		this.addPointList[bytes.roldid].parse(bytes);
		GameGlobal.MessageCenter.dispatch(MessageDef.ROLE_ADD_ATTR_POINT_INFO);
	}

	/**请求加潜能点*/
	public cs_add_zs_point(roleid, value) {
		let req = new Sproto.cs_add_zs_point_request;
		req.roleid = roleid;
		req.value = value;
		this.Rpc(C2sProtocol.cs_add_zs_point, req);
	}

	/**清除潜能点信息*/
	public cs_zs_point_clear(roleid) {
		let req = new Sproto.cs_zs_point_clear_request;
		req.roldid = roleid;
		this.Rpc(C2sProtocol.cs_zs_point_clear, req);
	}

	/**获取指定角色已经投放的潜能点*/
	public getAddPointCount(roleid) {
		var count = 0;
		let data = this.addPointList[roleid];
		if (data) {
			var points = data.points;
			points.forEach(element => {
				count += element;
			});
		} else {
			this.cs_zs_point_req();
		}
		return count;
	}

	/**根据职业和加点类型获取加点属性配置*/
	public getAddAttrPointConfig(job, type) {
		let config = GlobalConfig.zhuanShengValuePointConfig;
		return config[job][type];
	}
}
window["RoleAddAttrPointModel"] = RoleAddAttrPointModel