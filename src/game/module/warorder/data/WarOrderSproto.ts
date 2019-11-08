class WarOrderSproto extends BaseSystem {
	public constructor() {
		super();

		this.regNetMsg(S2cProtocol.sc_activity_warorder_reward, this.getAward);
		this.regNetMsg(S2cProtocol.sc_activity_warorder_exreward, this.getExpBag);
		this.regNetMsg(S2cProtocol.sc_task_warorder_data, this.getAllMission);
		this.regNetMsg(S2cProtocol.sc_task_warorder_update, this.getMission);
	}
	static ins(): WarOrderSproto {
		return super.ins();
	}


	/**领取奖励返回 */
	private getAward(bytes: Sproto.sc_activity_warorder_reward_request) {
		ViewManager.ins().open(ResultWin, true, bytes.data, null, null, 1);
		MessageCenter.ins().dispatch(WarOrderEvt.WARORDEREVT_DATAUPDATE_MSG);
	}

	/**领取经验包返回 */
	private getExpBag(bytes: Sproto.sc_activity_warorder_exreward_request) {
		ViewManager.ins().open(ResultWin, true, bytes.data, null, null, 1);
		MessageCenter.ins().dispatch(WarOrderEvt.WARORDEREVT_DATAUPDATE_MSG);
	}

	/**任务 */
	private getAllMission(bytes: Sproto.sc_task_warorder_data_request) {
		WarOrderModel.getInstance.setMissionData(bytes.data);
		MessageCenter.ins().dispatch(WarOrderEvt.WARORDEREVT_DATAUPDATE_MSG);
	}

	/**任务 */
	private getMission(bytes: Sproto.sc_task_warorder_update_request) {
		WarOrderModel.getInstance.setMissionData([bytes.data], false);
		MessageCenter.ins().dispatch(WarOrderEvt.WARORDEREVT_DATAUPDATE_MSG);
	}

	/**领取额外经验包 */
	public sendGetExpBag() {
		let rsp = new Sproto.cs_activity_warorder_exreward_request;
		rsp.activityId = WarOrderModel.getInstance.mainId;
		this.Rpc(C2sProtocol.cs_activity_warorder_exreward, rsp);
	}

	/**领取所有等级奖励 */
	public sendGetAllAward() {
		let rsp = new Sproto.cs_activity_warorder_reward_request;
		rsp.activityId = WarOrderModel.getInstance.mainId;
		this.Rpc(C2sProtocol.cs_activity_warorder_reward, rsp);
	}
	/**升级 */
	public sendUpWarOrderLv(num: number) {
		let rsp = new Sproto.cs_activity_warorder_buylv_request;
		rsp.activityId = WarOrderModel.getInstance.mainId;
		rsp.buyNum = num;
		this.Rpc(C2sProtocol.cs_activity_warorder_buylv, rsp);
	}
	/**进阶 */
	public sendUpWarOrdetJinJie() {
		let rsp = new Sproto.cs_activity_warorder_buyscale_request;
		rsp.activityId = WarOrderModel.getInstance.mainId;
		this.Rpc(C2sProtocol.cs_activity_warorder_buyscale, rsp);
	}
	/**任务 */
	public sendCompMission(id: number) {
		let rsp = new Sproto.cs_task_warorder_reward_request;
		rsp.taskID = id;
		this.Rpc(C2sProtocol.cs_task_warorder_reward, rsp);
	}
}
window["WarOrderSproto"] = WarOrderSproto