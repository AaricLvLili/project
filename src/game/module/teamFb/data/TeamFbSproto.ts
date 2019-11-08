class TeamFbSproto extends BaseSystem {
	public constructor() {
		super();
		this.regNetMsg(S2cProtocol.sc_team_my_res, this.getInfoMsg);
		this.regNetMsg(S2cProtocol.sc_team_res, this.getAllTeamMsg);
		this.regNetMsg(S2cProtocol.sc_team_info_res, this.getMyTeamMsg);
		this.regNetMsg(S2cProtocol.sc_team_join_res, this.getJoinTeam);
		this.regNetMsg(S2cProtocol.sc_team_quit_res, this.getQuitTeam);
	}
	static ins(): TeamFbSproto {
		return super.ins();
	}
	/**我的基础组队信息 */
	public getInfoMsg(rsp: Sproto.sc_team_my_res_request) {
		let teamFbModel = TeamFbModel.getInstance;
		teamFbModel.rewardCount = rsp.times;
		teamFbModel.shouTongDataList = rsp.first;
		MessageCenter.ins().dispatch(TeamFbEvt.TEAMFB_UPDATE_DATA);
	};

	/**所有组队信息 */
	public getAllTeamMsg(rsp: Sproto.sc_team_res_request) {
		let teamFbModel = TeamFbModel.getInstance;
		teamFbModel.setTeamLadderData(rsp);
		MessageCenter.ins().dispatch(TeamFbEvt.TEAMFB_UPDATE_DATA);
	};
	/**我的组队信息 */
	public getMyTeamMsg(rsp: Sproto.sc_team_info_res_request) {
		let teamFbModel = TeamFbModel.getInstance;
		teamFbModel.setMyTeamData(rsp);
		teamFbModel.teamFbSelectId = rsp.groupid;
		if (rsp.members.length > 0) {
			TeamFbModel.getInstance.isInRoom = true;
		} else {
			TeamFbModel.getInstance.isInRoom = false;
		}
		MessageCenter.ins().dispatch(TeamFbEvt.TEAMFB_UPDATE_DATA);
	}
	/**进入返回 */
	public getJoinTeam(rsp: Sproto.sc_team_join_res_request) {
		switch (rsp.result) {
			case -1:
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101985);
				break;
			case -2:
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101986);
				break;
			case -3:
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101987);
				break;
			case -4:
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101994);
				break;
			default:
				// TeamFbModel.getInstance.isInRoom = true;
				ViewManager.ins().open(FbWin, 2);
				break;
		}
	}
	/**退队返回 */
	public getQuitTeam(rsp: Sproto.sc_team_quit_res_request) {
		let teamFbModel = TeamFbModel.getInstance;
		teamFbModel.teamPlayerDic.remove(rsp.dbid);
		teamFbModel.myTeamLadderId = rsp.captain;
		if (rsp.captain > 0) {
			let players = teamFbModel.teamPlayerDic.values;
			for (var i = 0; i < players.length; i++) {
				let player = players[i];
				if (player.dbid == rsp.captain) {
					player.isLadder = true;
				} else {
					player.isLadder = false;
				}
			}
		}
		if (rsp.captain <= 0) {
			teamFbModel.myTeamLadderId = 0;
			teamFbModel.isInRoom = false;
			teamFbModel.teamPlayerDic.clear();
		} else if (rsp.dbid == RoleMgr.actorid) {
			TeamFbModel.getInstance.isInRoom = false;
			TeamFbModel.getInstance.teamPlayerDic.clear();
		}
		MessageCenter.ins().dispatch(TeamFbEvt.TEAMFB_UPDATE_DATA);
	}
	/**获取副本组队信息 */
	public sendGetTeamMsg(groupid: number) {
		let rsp = new Sproto.cs_team_req_request;
		rsp.groupid = groupid;
		this.Rpc(C2sProtocol.cs_team_req, rsp);
	}

	/**获取队伍信息(没用到) */
	public sendTeamInfoMsg() {
		let rsp = new Sproto.cs_team_info_req_request;
		this.Rpc(C2sProtocol.cs_team_info_req, rsp);
	}

	/**创建队伍 */
	public sendCreateTeam(groupid: number, teamid: number) {
		let rsp = new Sproto.cs_team_join_req_request;
		rsp.groupid = groupid;
		rsp.teamid = teamid;
		this.Rpc(C2sProtocol.cs_team_join_req, rsp);
	}

	/**退出队伍 */
	public sendQuitTeam() {
		let rsp = new Sproto.cs_team_quit_req_request;
		this.Rpc(C2sProtocol.cs_team_quit_req, rsp);
	}
	/**T人 */
	public sendTRole(kickid: number) {
		let rsp = new Sproto.cs_team_kick_req_request;
		rsp.kickid = kickid;
		this.Rpc(C2sProtocol.cs_team_kick_req, rsp);
	}
	/**战斗 */
	public sendFight() {
		let rsp = new Sproto.cs_team_fight_req_request;
		this.Rpc(C2sProtocol.cs_team_fight_req, rsp);
	}
}
window["TeamFbSproto"] = TeamFbSproto