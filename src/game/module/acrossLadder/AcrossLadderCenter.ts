class AcrossLadderCenter extends BaseSystem{
	
	public constructor() {
		super();
		this.regNetMsg(S2cProtocol.sc_cross_get_self_info,this.doMsgAcrossLadderSelfInfo);
		this.regNetMsg(S2cProtocol.sc_get_cross_tianti_list,this.doMsgAcrossLadderList);
		this.regNetMsg(S2cProtocol.sc_cross_start_combat,this.doMsgAcrossLadderStartCombat);
		this.regNetMsg(S2cProtocol.sc_cross_combat_result,this.doMsgAcrossLadderCombatResult);
		this.regNetMsg(S2cProtocol.sc_cross_get_combat_record,this.doMsgAcrossLadderRecord);
		this.regNetMsg(S2cProtocol.sc_cross_get_tianti_rank_info,this.doMsgAcrossLadderRank);
		this.regNetMsg(S2cProtocol.sc_cross_get_tianti_history_rank,this.doMsgAcrossLadderHistoryRank);
		this.regNetMsg(S2cProtocol.sc_cross_gain_tianti_history_award,this.doMsgAcrossLadderHistoryReward);
		this.regNetMsg(S2cProtocol.sc_cross_buy_combat_num,this.doMsgAcrossLadderBuyCombatNum);
		
		// sc_cross_gain_tianti_history_award
		// sc_cross_get_tianti_history_rank
		// selfRank 0 : integer #当前排名
		// award_history_info 1 :*award_history_info
	}

    public static ins () : AcrossLadderCenter {
        return super.ins();
    };

	private acrossLadderPanelModel:AcrossLadderPanelData = AcrossLadderPanelData.ins();
	
	private doMsgAcrossLadderSelfInfo(rsp:Sproto.sc_cross_get_self_info_request)
	{
		this.acrossLadderPanelModel.updateSelfInfoData(rsp);
		MessageCenter.ins().dispatch(MessageDef.ACROSSLADDER_REFRESH_PLAYER_INFO);
	}

	private doMsgAcrossLadderList(rsp:Sproto.sc_get_cross_tianti_list_request)
	{
		this.acrossLadderPanelModel.updateItemsData(rsp);
		MessageCenter.ins().dispatch(MessageDef.ACROSSLADDER_REFRESH_ITEMS);
	}

	private doMsgAcrossLadderStartCombat(rsp:Sproto.sc_cross_start_combat_request):void
	{
		// this.acrossLadderPanelModel.combatState = rsp.combatState;
		// this.acrossLadderPanelModel.setTargetPlayerId(rsp.targetdbid);
		switch(rsp.combatState){
			case 0 :
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101681);
				break;
			case 1 :
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101682);
				break;
			case 2 :// 弹出提示框去挑战
				ViewManager.ins().close(AcrossLadderChallengeTip);
				break;
			case 10 :// 弹出提示框提示对手排名数据已变更，是否挑战？点取消就是刷新匹配列表，点挑战继续打。
				MessageCenter.ins().dispatch(MessageDef.ACROSSLADDER_CHALLENGE_CONFIRM);
				break;
		}
	}

	private doMsgAcrossLadderRecord(rsp:Sproto.sc_cross_get_combat_record_request):void
	{
		this.acrossLadderPanelModel.updateRecordData(rsp);
		ViewManager.ins().open(AcrossLadderRecord);
	}

	private doMsgAcrossLadderRank(rsp:Sproto.sc_cross_get_tianti_rank_info_request):void{
		this.acrossLadderPanelModel.updateRankData(rsp);
		ViewManager.ins().open(AcrossLadderRank);
	}

	private doMsgAcrossLadderCombatResult(rsp:Sproto.sc_cross_combat_result_request):void
	{
		if(rsp.isWin)
			ViewManager.ins().open(AcrossLadderResultWin,rsp.rewardData,rsp.lastRank,rsp.nowRank);
		else{
			ViewManager.ins().open(ResultWin, false);//失败窗口
		}
	}

	private doMsgAcrossLadderHistoryRank(rsp:Sproto.sc_cross_get_tianti_history_rank_request):void
	{
		this.acrossLadderPanelModel.updateHistoryRankData(rsp);
		MessageCenter.ins().dispatch(MessageDef.ACROSSLADDER_HISTORY_RANK);
	}

	private doMsgAcrossLadderHistoryReward(rsp:Sproto.sc_cross_gain_tianti_history_award_request):void
	{
		// code 0 : integer #1没有此名次的奖励。2已领取，3名次不足
	}

	private doMsgAcrossLadderBuyCombatNum(rsp:Sproto.sc_cross_buy_combat_num_request):void
	{

	}

	/**获取跨服天梯*/
	public reqAcrossLadderInfo(isRefresh:boolean = false)
	{
		if(!isRefresh)
			GameSocket.ins().Rpc(C2sProtocol.cs_cross_get_self_info, new Sproto.cs_cross_get_self_info_request());
		GameSocket.ins().Rpc(C2sProtocol.cs_get_cross_tianti_list, new Sproto.cs_get_cross_tianti_list_request());
	}

	/**向服务器请求开始战斗**/
	public reqAcrossLadderStartCombat(playerId:number, combat:number)
	{
		let csMsg = new Sproto.cs_cross_start_combat_request();
		csMsg.dbid = playerId;
		csMsg.combat = combat;
		GameSocket.ins().Rpc(C2sProtocol.cs_cross_start_combat, csMsg);
	}

	/**查看战斗记录，只显示20条**/
	public reqAcrossLadderRecord()
	{
		GameSocket.ins().Rpc(C2sProtocol.cs_cross_get_combat_recode, new Sproto.cs_cross_get_combat_recode_request());
	}

	/**请求排行榜数据**/
	public reqAcrossLadderRank()
	{
		GameSocket.ins().Rpc(C2sProtocol.cs_cross_get_tianti_rank_info, new Sproto.cs_cross_get_tianti_rank_info_request());
	}

	/**请求最高历史排名奖励信息**/
	public reqAcrossLadderHistoryRank()
	{
		GameSocket.ins().Rpc(C2sProtocol.cs_cross_get_tianti_history_rank, new Sproto.cs_cross_get_tianti_history_rank_request());
	}

	/**领取最高历史排名奖励**/
	public reqAcrossLadderHistoryReward(index:number)
	{
		var req = new Sproto.cs_cross_gain_tianti_history_award_request();
		req.cfgIndex = index;
		GameSocket.ins().Rpc(C2sProtocol.cs_cross_gain_tianti_history_award, req);
	}

	public reqBuyCombatNum(times:number)
	{
		let csMsg = new Sproto.cs_cross_buy_combat_num_request();
		csMsg.num = times;
		GameSocket.ins().Rpc(C2sProtocol.cs_cross_buy_combat_num, csMsg);
	}

	/**跨服天梯排名奖励红点**/
	public rankRewardRedPoint():boolean
	{
		var configs = GlobalConfig.ins("KuafuJingJiBestRankAwardConfig");
		var flag:number = 0;
		var currentRank:number = AcrossLadderPanelData.ins().rank;
		var rewardCfgIdxArr:Array<string> = AcrossLadderPanelData.ins().rewardCfgIdxArr;
		var id:number = 0;
		for (var key in configs)
		{
			id = Number(key);
			flag = rewardCfgIdxArr.indexOf(key);
			if(rewardCfgIdxArr.length > 0 && flag == -1)
			{//没有被完成或者没有领取
				if(currentRank <= id)
					return true;
			}
		}
		return false;
	}
}

MessageCenter.compile(AcrossLadderCenter);
window["AcrossLadderCenter"]=AcrossLadderCenter