class AcrossLadderPanelData extends BaseClass {

	public head: string = "";
	public power: number = 0;
	public rank: number = 0;
	public win: number = 0;
	public lost: number = 0;
	public challengeNum: number = 0;
	public todayBuyTimes: number = 0;
	public flagBuyTips: boolean = false;
	public m_ElementType: number;

	private targetPlayerId: number;
	public combatState: number;

	// public currentRank:number = 0;
	public rewardCfgIdxArr: Array<string> = [];
	public playerList: Array<AcrossLadderItemData> = [];
	public recordList: Array<AcrossLadderRecordItemData> = [];
	public rankList: Array<AcrossLadderRankItemData> = [];
	public baseConfig: any = null;
	public static DEFAULT_RANK: number = 10000;
	public static ins(...args: any[]): AcrossLadderPanelData {
		return super.ins();
	}

	public updateSelfInfoData(rsp: Sproto.sc_cross_get_self_info_request) {
		this.head = ResDataPath.GetHeadMiniImgName(rsp.job, rsp.sex);
		this.power = rsp.power;
		this.rank = (rsp.rank == 0 ? AcrossLadderPanelData.DEFAULT_RANK : rsp.rank);
		this.win = rsp.winNum;
		this.lost = rsp.lossNum;
		this.challengeNum = rsp.times;
		this.todayBuyTimes = rsp.dailyBuyNum;
		this.m_ElementType = rsp.mainEle;
	}

	public updateItemsData(rsp: Sproto.sc_get_cross_tianti_list_request) {
		this.playerList.length = 0;
		this.setTargetPlayerId(0);
		if (rsp.roles == null)
			return;
		for (var len = rsp.roles.length, i = 0; len > i; i++) {
			var data = new AcrossLadderItemData();
			data.disposeData(rsp.roles[i]);
			this.playerList.push(data);
		}
	}

	public updateRecordData(rsp: Sproto.sc_cross_get_combat_record_request) {
		this.recordList.length = 0;
		if (rsp.combatRecord == null)
			return;
		for (var len = rsp.combatRecord.length, i = 0; len > i; i++) {
			var data = new AcrossLadderRecordItemData();
			data.disposeData(rsp.combatRecord[i]);
			this.recordList.push(data);
		}
	}

	public updateRankData(rsp: Sproto.sc_cross_get_tianti_rank_info_request) {
		this.rankList.length = 0;
		if (rsp.rankInfo == null)
			return;
		for (var len = rsp.rankInfo.length, i = 0; len > i; i++) {
			var data = new AcrossLadderRankItemData();
			data.disposeData(rsp.rankInfo[i]);
			this.rankList.push(data);
		}
	}

	public updateHistoryRankData(rsp: Sproto.sc_cross_get_tianti_history_rank_request) {
		this.rank = rsp.selfRank;
		if (this.rank == 0)
			this.rank = AcrossLadderPanelData.DEFAULT_RANK;
		this.rewardCfgIdxArr = [];
		for (var len = rsp.award_history_info.length, i = 0; len > i; i++) {
			this.rewardCfgIdxArr.push(rsp.award_history_info[i].cfgIndex.toString());
		}
	}

	public getTargetPlayerId(): number {
		return this.targetPlayerId;
	}
	public setTargetPlayerId(targetPlayerId: number): void {
		this.targetPlayerId = targetPlayerId;
	}

	public getCurrentPlayerItem(): AcrossLadderItemData {
		return this.getPlayerItem(this.targetPlayerId);
	}

	public getPlayerItem(playerId: number): AcrossLadderItemData {
		var playerItem: AcrossLadderItemData = null;
		for (let data of this.playerList) {
			if (data.playerId == playerId)
				return data
		}
		return null;
	}

	public getBaseCfg(): any {
		if (this.baseConfig == null)
			this.baseConfig = GlobalConfig.ins("KuafuJingJiBaseConfig");
		return this.baseConfig
	}
}
window["AcrossLadderPanelData"]=AcrossLadderPanelData