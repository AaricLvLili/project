class UserZhuLing extends BaseSystem {
	public constructor() {
		super();

		this.sysId = PackageID.Zhuling;
		//this.regNetMsg(2, this.postForgeUpdata);
		this.regNetMsg(S2cProtocol.sc_essence_update_data, this.postForgeUpdata);
	}


	static ins(): UserZhuLing {
		return super.ins();
	};
	postForgeUpdata(rsp : Sproto.sc_essence_update_data_request) {
		var roleId = rsp.roleId;
		var model = SubRoles.ins().getSubRoleByIndex(roleId);
		model.parseForgeChange(rsp, this.sysId);
		UserForge.ins().postForgeUpdate(this.sysId);
	};
    /**
     * 提升请求
     * @param roleId 角色
     * @param pos 部位
     */
	sendUpGrade(roleId: number, pos,isAuto=false) {
		var cs_essence_upgrade_grade = new Sproto.cs_essence_upgrade_grade_request();
		cs_essence_upgrade_grade.roleId = roleId;
		cs_essence_upgrade_grade.pos = pos;
		cs_essence_upgrade_grade.isAuto=isAuto;
		GameSocket.ins().Rpc(C2sProtocol.cs_essence_upgrade_grade, cs_essence_upgrade_grade);
		var bytes = this.getBytes(2);
		bytes.writeShort(roleId);
		bytes.writeShort(pos);
		this.sendToServer(bytes);
	};
}

MessageCenter.compile(UserZhuLing);
window["UserZhuLing"]=UserZhuLing