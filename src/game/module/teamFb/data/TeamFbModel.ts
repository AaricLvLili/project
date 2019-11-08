class TeamFbModel {
	private static s_instance: TeamFbModel;
	public static get getInstance(): TeamFbModel {
		if (!TeamFbModel.s_instance) {
			TeamFbModel.s_instance = new TeamFbModel();
		}
		return TeamFbModel.s_instance;
	}
	public teamLadderDic: Dictionary<TeamLadderData> = new Dictionary<TeamLadderData>();
	public teamPlayerDic: Dictionary<TeamPlayerData> = new Dictionary<TeamPlayerData>();
	public isInRoom: boolean = false;
	// public teamFbSelectIndex: number = 0;
	public teamFbSelectId: number = 0;

	public gotop1Time: number = 0;
	public gotop2Time: number = 0;
	public openTime: number = 0;

	public shouTongDataList = [];

	public rewardCount = 0;

	public myTeamLadderId: number = 0;
	public myTeamId: number = 0;

	public roomMaxNum = 3;
	public setTeamLadderData(data: Sproto.sc_team_res_request) {
		this.teamLadderDic.clear();
		if (data.list) {
			for (var i = 0; i < data.list.length; i++) {
				let getData = data.list[i];
				let teamLadderData = new TeamLadderData();
				teamLadderData.fbId = data.groupid;
				teamLadderData.roomId = getData.teamid;
				teamLadderData.name = getData.name;
				teamLadderData.playerNum = getData.num;
				teamLadderData.job = getData.job;
				teamLadderData.sex = getData.sex;
				this.teamLadderDic.set(teamLadderData.roomId, teamLadderData);
			}
		}
	}

	public setMyTeamData(data: Sproto.sc_team_info_res_request) {
		this.teamPlayerDic.clear();
		this.myTeamLadderId = data.captain
		this.myTeamId = data.teamid
		if (data.members) {
			for (var i = 0; i < data.members.length; i++) {
				let getData = data.members[i];
				let teamPlayerData = new TeamPlayerData();
				if (data.captain == getData.dbid) {
					teamPlayerData.isLadder = true;
				} else {
					teamPlayerData.isLadder = false;
				}
				teamPlayerData.job = getData.job;
				teamPlayerData.lv = getData.level;
				teamPlayerData.name = getData.name;
				teamPlayerData.power = getData.power;
				teamPlayerData.sex = getData.sex;
				teamPlayerData.zslv = getData.zslevel;
				teamPlayerData.dbid = getData.dbid;
				teamPlayerData.serverId = getData.serverid;
				teamPlayerData.teamId = data.teamid;
				this.teamPlayerDic.set(teamPlayerData.dbid, teamPlayerData);
			}
		}
	}

	public get isMyLadder() {
		return this.myTeamLadderId == RoleMgr.actorid;
	}
	public get isMyRoomFull() {
		return this.teamPlayerDic.values.length >= this.roomMaxNum;
	}

	public isShouTong(id: number) {
		if (!this.shouTongDataList[id - 1]) {
			return true;
		}
		return false;
	}

	public isFbOpen(fbId: number) {
		let teamFbConfig = GlobalConfig.ins("teamFbConfig")[fbId];
		if (teamFbConfig) {
			let rolesModel = SubRoles.ins().rolesModel;
			let maxWingLv = 0;
			for (var i = 0; i < rolesModel.length; i++) {
				let role = rolesModel[i];
				let lv = role.wingsData.lv
				if (lv) {
					maxWingLv = Math.max(lv, maxWingLv);
				}
			}
			if (maxWingLv < (teamFbConfig.wingLevel - 1)) {
				return false;
			} else {
				if (teamFbConfig.zslevel) {
					let playerzs = UserZs.ins() ? UserZs.ins().lv : 0;
					if (playerzs < teamFbConfig.zslevel) {
						return false;
					} else {
						return true;
					}
				} else {
					if (GameLogic.ins().actorModel.level < teamFbConfig.level) {
						return false;
					} else {
						return true;
					}
				}
			}
		}
		return false;
	}

	public isShowRedPoint() {
		if (this.rewardCount > 0 && Deblocking.Check(DeblockingType.TYPE_83, true)) {
			return true;
		}
		return false;
	}

	public releaseTeamData() {
		this.myTeamLadderId = 0;
		this.isInRoom = false;
		this.teamPlayerDic.clear();
		MessageCenter.ins().dispatch(TeamFbEvt.TEAMFB_UPDATE_DATA);
	}


}
window["TeamFbModel"] = TeamFbModel