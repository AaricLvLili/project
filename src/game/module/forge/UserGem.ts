class UserGem extends BaseSystem {
	private bAutoBuyCailiao = false;
	public constructor() {
		super();

		this.sysId = PackageID.Gem;
		//this.regNetMsg(2, this.postForgeUpdata);
        this.regNetMsg(S2cProtocol.sc_gem_update_data, this.postForgeUpdata);
	}


	static ins(): UserGem {
		return super.ins();
	};
	postForgeUpdata(rsp : Sproto.sc_gem_update_data_request) {
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
	sendUpGrade(roleId: number, pos: number, canyb: boolean = false) {
        var cs_gem_upgrade_grade = new Sproto.cs_gem_upgrade_grade_request();
        cs_gem_upgrade_grade.roleId = roleId;
        cs_gem_upgrade_grade.pos = pos;
		cs_gem_upgrade_grade.canUseYuanbao = canyb;
        GameSocket.ins().Rpc(C2sProtocol.cs_gem_upgrade_grade, cs_gem_upgrade_grade);
	};
	get isAutoBuy() {
		return this.bAutoBuyCailiao;
	}
	set isAutoBuy(value) {
		if (this.bAutoBuyCailiao != value) {
			this.bAutoBuyCailiao = value;
			//this.canChange = false;
			//TimerManager.ins().doTimer(1000, 10, this.overDealy, this, this.dealyOver, this);
		}
	}
}

MessageCenter.compile(UserGem);
window["UserGem"]=UserGem