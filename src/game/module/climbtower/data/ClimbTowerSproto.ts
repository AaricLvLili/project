class ClimbTowerSproto extends BaseSystem {
	public constructor() {
		super();
		this.regNetMsg(S2cProtocol.sc_tower_init_res, this.getTowerInit);
		this.regNetMsg(S2cProtocol.sc_tower_award_res, this.getTowerAward);
		this.regNetMsg(S2cProtocol.sc_tower_sweep_res, this.getTowerSweep);
		this.regNetMsg(S2cProtocol.sc_tower_sync, this.getTowerLayer);
		// this.regNetMsg(S2cProtocol.sc_tower_floor_res, this.getTowerLayer);

	}
	static ins(): ClimbTowerSproto {
		return super.ins();
	}

	/**爬塔初始化信息 */
	private getTowerInit(bytes: Sproto.sc_tower_init_res_request) {
		let climbTowerModle = ClimbTowerModel.getInstance;
		climbTowerModle.setData(bytes);
		switch (bytes.type) {
			case ClimbType.PET:
				GameGlobal.MessageCenter.dispatch(ClimbTowerEvent.CLIMBPET_DATAUPDATE_MSG);
				break;
			case ClimbType.MOUNT:
				GameGlobal.MessageCenter.dispatch(ClimbTowerEvent.CLIMBMOUNT_DATAUPDATE_MSG);
				break;
		}

	}
	/**爬塔奖励信息 */
	private getTowerAward(bytes: Sproto.sc_tower_award_res_request) {
		let climbTowerModle = ClimbTowerModel.getInstance;
		switch (bytes.type) {
			case ClimbType.PET:
				climbTowerModle.ClimbTowerPetData.rewards[bytes.id - 1] = bytes.status;
				GameGlobal.MessageCenter.dispatch(ClimbTowerEvent.CLIMBPET_DATAUPDATE_MSG);
				break;
			case ClimbType.MOUNT:
				climbTowerModle.ClimbTowerMountData.rewards[bytes.id - 1] = bytes.status;
				GameGlobal.MessageCenter.dispatch(ClimbTowerEvent.CLIMBMOUNT_DATAUPDATE_MSG);
				break;
		}
	}
	/**爬塔扫荡信息 */
	private getTowerSweep(bytes: Sproto.sc_tower_sweep_res_request) {
		let climbTowerModle = ClimbTowerModel.getInstance;
		switch (bytes.type) {
			case ClimbType.PET:
				climbTowerModle.ClimbTowerPetData.sweep = bytes.sweep;
				GameGlobal.MessageCenter.dispatch(ClimbTowerEvent.CLIMBPET_DATAUPDATE_MSG);
				break;
			case ClimbType.MOUNT:
				climbTowerModle.ClimbTowerMountData.sweep = bytes.sweep;
				GameGlobal.MessageCenter.dispatch(ClimbTowerEvent.CLIMBMOUNT_DATAUPDATE_MSG);
				break;
		}
		climbTowerModle.reward = bytes.reward;
		ViewManager.ins().open(ClimbResultWin, null, 1);
	}
	/**爬塔同步层数信息 */
	private getTowerLayer(bytes: Sproto.sc_tower_sync_request) {
		let climbTowerModle = ClimbTowerModel.getInstance;
		switch (bytes.type) {
			case ClimbType.PET:
				if (climbTowerModle.ClimbTowerPetData) {
					climbTowerModle.ClimbTowerPetData.pass = bytes.pass;
				}
				climbTowerModle.changePetSelectIndex();
				GameGlobal.MessageCenter.dispatch(ClimbTowerEvent.CLIMBPET_DATAUPDATE_MSG);
				break;
			case ClimbType.MOUNT:
				if (climbTowerModle.ClimbTowerMountData) {
					climbTowerModle.ClimbTowerMountData.pass = bytes.pass;
				}
				climbTowerModle.changeMountSelectIndex();
				GameGlobal.MessageCenter.dispatch(ClimbTowerEvent.CLIMBMOUNT_DATAUPDATE_MSG);
				break;
		}
	}


	/**爬塔初始化信息 type 1001 宠物 1002坐骑 */
	public sendGetTowerInit(type: number) {
		let rsp = new Sproto.cs_tower_init_req_request;
		rsp.type = type;
		this.Rpc(C2sProtocol.cs_tower_init_req, rsp);
	}
	/**领取奖励 */
	public sendGetTowerAward(type: number, id: number) {
		let rsp = new Sproto.cs_tower_award_req_request;
		rsp.type = type;
		rsp.id = id;
		this.Rpc(C2sProtocol.cs_tower_award_req, rsp);
	}
	/**进入副本 */
	public sendTowerEnter(type: number, floor: number) {
		let rsp = new Sproto.cs_tower_enter_req_request;
		rsp.type = type;
		rsp.floor = floor;
		if (type == ClimbType.PET) {
			ClimbTowerModel.getInstance.petBattleId = floor;
		} else if (type == ClimbType.MOUNT) {
			ClimbTowerModel.getInstance.mountBattleId = floor;
		}
		this.Rpc(C2sProtocol.cs_tower_enter_req, rsp);
	}
	/**扫荡信息 */
	public sendGetSweep(type: number) {
		let rsp = new Sproto.cs_tower_sweep_req_request;
		rsp.type = type;
		this.Rpc(C2sProtocol.cs_tower_sweep_req, rsp);
	}
	/**获取层数信息 */
	public sendGetLayer(type: number, floor: number) {
		let rsp = new Sproto.cs_tower_floor_req_request;
		rsp.type = type;
		rsp.floor = floor;
		this.Rpc(C2sProtocol.cs_tower_floor_req, rsp);
	}



}
window["ClimbTowerSproto"] = ClimbTowerSproto