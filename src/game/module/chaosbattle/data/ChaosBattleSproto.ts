class ChaosBattleSproto extends BaseSystem {
	public constructor() {
		super();
		this.regNetMsg(S2cProtocol.sc_basic_info, this.getChaosBattleData);
		this.regNetMsg(S2cProtocol.sc_self_sorce_rank, this.getChaosBattleMyRankData);
		this.regNetMsg(S2cProtocol.sc_sorce_info, this.getChaosBattleRankData);
		this.regNetMsg(S2cProtocol.sc_update_feats, this.getChaosBattlePoint);
		this.regNetMsg(S2cProtocol.sc_update_sorce, this.getChaosPoint);
		this.regNetMsg(S2cProtocol.sc_can_attack_actor, this.getChaosAtkRole);
		this.regNetMsg(S2cProtocol.sc_already_attack_actor, this.getChaosDefRole);
		this.regNetMsg(S2cProtocol.sc_can_attack_boss, this.getChaosBoss);
		this.regNetMsg(S2cProtocol.sc_enter_top_actor, this.getChaosTopLayer);
		this.regNetMsg(S2cProtocol.sc_kill_top_boss_actor, this.getChaosTopLayerBoss);
		this.regNetMsg(S2cProtocol.sc_actor_dead, this.getChaosRoleDead);
		this.regNetMsg(S2cProtocol.sc_cur_attr_target, this.getChaosAtkTager);
		this.regNetMsg(S2cProtocol.sc_reward_info, this.getChaosResult);
		this.regNetMsg(S2cProtocol.sc_receive_sorce_reward, this.getPointData);
	}
	static ins(): ChaosBattleSproto {
		return super.ins();
	}
	/**初始化魔龙圣殿 */
	private getChaosBattleData(bytes: Sproto.sc_basic_info_request) {
		let chaosBattleModel = ChaosBattleModel.getInstance;
		chaosBattleModel.endTime = bytes.endtime;
		chaosBattleModel.openTime = bytes.starttime;
		let config = GlobalConfig.ins("CompetitionLevel");
		for (let key in config) {
			if (config[key].fbId == bytes.fbid) {
				chaosBattleModel.nowLayer = config[key].id;
			}
			if (config[key].fbId == bytes.topid) {
				chaosBattleModel.maxLayer = config[key].id;
			}
		}
		let competitionStageAward = GlobalConfig.ins("CompetitionStageAward");
		chaosBattleModel.layerAwardData = [];
		for (let key in competitionStageAward) {
			if (chaosBattleModel.maxLayer >= competitionStageAward[key].id) {
				chaosBattleModel.layerAwardData.push(1);
			} else {
				chaosBattleModel.layerAwardData.push(-1);
			}
		}
		MessageCenter.ins().dispatch(ChaosBattleEvt.CHAOSBATTLE_DATAUPDATE_MSG);
	}
	/**我的排行信息*/
	private getChaosBattleMyRankData(bytes: Sproto.sc_self_sorce_rank_request) {
		let chaosBattleModel = ChaosBattleModel.getInstance;
		chaosBattleModel.myRankNum = bytes.rankid;
		chaosBattleModel.myPoint = bytes.sorce;
		MessageCenter.ins().dispatch(ChaosBattleEvt.CHAOSBATTLE_DATAUPDATE_MSG);
	}
	/**所有排行信息 */
	private getChaosBattleRankData(bytes: Sproto.sc_sorce_info_request) {
		let chaosBattleModel = ChaosBattleModel.getInstance;
		chaosBattleModel.setRankDic(bytes.data);
		MessageCenter.ins().dispatch(ChaosBattleEvt.CHAOSBATTLE_DATAUPDATE_MSG);
	}
	/**更新战功 */
	private getChaosBattlePoint(bytes: Sproto.sc_update_feats_request) {
		let chaosBattleModel = ChaosBattleModel.getInstance;
		chaosBattleModel.battlePoint = bytes.feats;
		MessageCenter.ins().dispatch(ChaosBattleEvt.CHAOSBATTLE_DATAUPDATE_BATTLEPOINT);
	}
	/**更新积分 */
	private getChaosPoint(bytes: Sproto.sc_update_sorce_request) {
		let chaosBattleModel = ChaosBattleModel.getInstance;
		chaosBattleModel.point = bytes.sorce;
		// let config = GlobalConfig.ins("CompetitionPersonalAward");
		// for (let key in config) {
		// 	if (chaosBattleModel.point >= config[key].integral) {
		// 		chaosBattleModel.nowPointId = config[key].id;
		// 	}
		// }
		// if (!chaosBattleModel.nowPointId) {
		// 	chaosBattleModel.nowPointId = 1;
		// }
		MessageCenter.ins().dispatch(ChaosBattleEvt.CHAOSBATTLE_DATAUPDATE_POINT);
	}

	/**更新可攻击角色 */
	private getChaosAtkRole(bytes: Sproto.sc_can_attack_actor_request) {
		let chaosBattleModel = ChaosBattleModel.getInstance;
		chaosBattleModel.addRoleData(bytes.data);
		MessageCenter.ins().dispatch(ChaosBattleEvt.CHAOSBATTLE_DATAUPDATE_ROLE);
	}

	/**更新受到攻击角色 */
	private getChaosDefRole(bytes: Sproto.sc_already_attack_actor_request) {
		let chaosBattleModel = ChaosBattleModel.getInstance;
		chaosBattleModel.deAtkTager = [];
		for (var i = 0; i < bytes.data.length; i++) {
			chaosBattleModel.deAtkTager.push(bytes.data[i].dbid);
		}
		MessageCenter.ins().dispatch(ChaosBattleEvt.CHAOSBATTLE_DATAUPDATE_ROLE);
	}
	/**更新可攻击Boss */
	private getChaosBoss(bytes: Sproto.sc_can_attack_boss_request) {
		let chaosBattleModel = ChaosBattleModel.getInstance;
		chaosBattleModel.addBossData(bytes.data);
		MessageCenter.ins().dispatch(ChaosBattleEvt.CHAOSBATTLE_DATAUPDATE_ROLE);
	}
	/**更新第一个登顶 */
	private getChaosTopLayer(bytes: Sproto.sc_enter_top_actor_request) {
		let chaosBattleModel = ChaosBattleModel.getInstance;
		chaosBattleModel.firstTopPlayer = bytes.name + "";
		MessageCenter.ins().dispatch(ChaosBattleEvt.CHAOSBATTLE_DATAUPDATE_MSG);
	}

	/**更新第一个登顶杀boss */
	private getChaosTopLayerBoss(bytes: Sproto.sc_kill_top_boss_actor_request) {
		let chaosBattleModel = ChaosBattleModel.getInstance;
		chaosBattleModel.firstTopKillBoss = bytes.name + "";
		MessageCenter.ins().dispatch(ChaosBattleEvt.CHAOSBATTLE_DATAUPDATE_MSG);
	}
	/**更新死亡的信息 */
	private getChaosRoleDead(bytes: Sproto.sc_actor_dead_request) {
		let chaosBattleModel = ChaosBattleModel.getInstance;
		chaosBattleModel.isDead = true;
		chaosBattleModel.killName = bytes.name + "";
		chaosBattleModel.deathTime = bytes.time;
		ViewManager.ins().open(ChaosBattleDeadWin);
	}

	/**更新攻击目标 */
	private getChaosAtkTager(bytes: Sproto.sc_cur_attr_target_request) {
		let chaosBattleModel = ChaosBattleModel.getInstance;
		chaosBattleModel.atkTager = bytes.handle;
		MessageCenter.ins().dispatch(ChaosBattleEvt.CHAOSBATTLE_DATAUPDATE_ROLE);
	}

	private getChaosResult(bytes: Sproto.sc_reward_info_request) {
		ViewManager.ins().open(ChaosBattleResultWin, bytes.data);
	}

	private getPointData(bytes: Sproto.sc_receive_sorce_reward_request) {
		let chaosBattleModel = ChaosBattleModel.getInstance;
		chaosBattleModel.pointList = [];
		for (var i = 0; i < bytes.data.length; i++) {
			chaosBattleModel.pointList.push(bytes.data[i].state);
		}
		MessageCenter.ins().dispatch(ChaosBattleEvt.CHAOSBATTLE_DATAUPDATE_POINT);
	}

	/**进入魔龙圣殿 */
	public sendChaosBattleAtkMsg() {
		let rsp = new Sproto.cs_enter_dragon_request;
		this.Rpc(C2sProtocol.cs_enter_dragon, rsp);
	}

	/**打玩家 */
	public sendChaosAtkRole(dbid: number) {
		let rsp = new Sproto.cs_Challenge_actor_request;
		rsp.dbid = dbid;
		// ChaosBattleModel.getInstance.atkTager = dbid;
		this.Rpc(C2sProtocol.cs_Challenge_actor, rsp);
	}

	/**打Boss */
	public sendChaosAtkBoss(handle: number) {
		let rsp = new Sproto.cs_Challenge_boss_request;
		rsp.handle = handle;
		// ChaosBattleModel.getInstance.atkTager = handle;
		this.Rpc(C2sProtocol.cs_Challenge_boss, rsp);
	}
	/**排行榜信息 */
	public sendRank() {
		let rsp = new Sproto.cs_sore_info_request;
		this.Rpc(C2sProtocol.cs_sore_info, rsp);
	}
	/**魔龙圣殿信息 */
	public sendInfo() {
		let rsp = new Sproto.cs_dragon_info_request;
		this.Rpc(C2sProtocol.cs_dragon_info, rsp);
	}
	/**复活 */
	public sendRevive(retype: number) {
		if (retype == 1) {
			ChaosBattleModel.getInstance.isDead = false
			ChaosBattleModel.getInstance.deathTime = 0;
		}
		let rsp = new Sproto.cs_revive_actor_request;
		rsp.retype = retype;
		this.Rpc(C2sProtocol.cs_revive_actor, rsp);
	}
	/**领取积分奖励 */
	public sendGetPointAward(index: number) {
		let rsp = new Sproto.cs_receive_sorce_reward_request;
		rsp.index = index;
		this.Rpc(C2sProtocol.cs_receive_sorce_reward, rsp);
	}

}
window["ChaosBattleSproto"] = ChaosBattleSproto