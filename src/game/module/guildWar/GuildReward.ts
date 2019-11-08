class GuildReward extends BaseSystem {

	public static ins(): GuildReward {
		return super.ins()
	}

	public constructor() {
		super()

		this.regNetMsg(S2cProtocol.sc_guildwar_redpacket_info, this._DoInfo)
		this.regNetMsg(S2cProtocol.sc_guildwar_send_redpacket_ret, this._DoRedRet)
		this.regNetMsg(S2cProtocol.sc_guildwar_get_redpacket_ret, this._DoGetRedRet)
		this.regNetMsg(S2cProtocol.sc_guildwar_winner, this._DoWinner)
		this.regNetMsg(S2cProtocol.sc_guildwar_dayaward_info, this._DoDayawardInfo)
		this.regNetMsg(S2cProtocol.sc_guildwar_disp_info, this._DoDispInfo)
		this.regNetMsg(S2cProtocol.sc_guildwar_disp_ret, this._DoDispRet)
		this.regNetMsg(S2cProtocol.sc_guildwar_winner_info, this._DoWinnerInfo)
		this.regNetMsg(S2cProtocol.sc_guildwar_guild_scores, this._DoUpdateGuildRankData)
		this.regNetMsg(S2cProtocol.sc_guildwar_actor_scores, this._DoUpdatePersonalRankData)
		// this.regNetMsg(S2cProtocol.sc_guildwar_guild_rank_info, this._DoUpdateMyGuildRankInfo)
		this.regNetMsg(S2cProtocol.sc_gdwar_guild_member, this._DoUpdateMyGuildRankInfo)
		this.regNetMsg(S2cProtocol.sc_guildwar_firstwinner_awardinfo, this._DoFirstWinner)
	}

	/** PROTO */

	private m_IsFirstWinner = null

	private _DoFirstWinner(rsp: Sproto.sc_guildwar_firstwinner_awardinfo_request) {
		this.m_IsFirstWinner = rsp.canAward
		GameGlobal.MessageCenter.dispatch(MessageDef.GUILDWAR_FIRST_WINNER)
	}

	public GetFirstRewardState(): RewardState {
		if (this.m_IsFirstWinner == null) {
			return RewardState.NotReached
		}
		if (this.m_IsFirstWinner == false) {
			return RewardState.Gotten
		}
		return RewardState.CanGet
	}

	private m_RedInfo: Sproto.sc_guildwar_redpacket_info_request = null
	/**红包信息返回4101*/
	private _DoInfo(rsp: Sproto.sc_guildwar_redpacket_info_request) {
		this.m_RedInfo = rsp
		GameGlobal.MessageCenter.dispatch(MessageDef.GUILDWAR_REDBAGINFO_CHANGE)
	}

	private _DoRedRet(rsp: Sproto.sc_guildwar_send_redpacket_ret_request) {
		if (rsp.success) {
			ViewManager.ins().close(GuildWarRedBagPanel)
			UserTips.InfoTip2(GlobalConfig.jifengTiaoyueLg.st101593)//发送红包成功
		}
	}

	private _DoGetRedRet(rsp: Sproto.sc_guildwar_get_redpacket_ret_request) {
		if (rsp.success) {
			ViewManager.ins().close(GuildWarRedBagPanel)
			// ViewManager.ins().open(RedBagDetailsWin)
		}
	}

	private m_Winner: Sproto.sc_guildwar_winner_request = null

	private _DoWinner(rsp: Sproto.sc_guildwar_winner_request) {
		this.m_Winner = rsp	
	}

	/**遗迹争霸每日奖励信息*/
	private m_DayawardInfo: Sproto.sc_guildwar_dayaward_info_request = null
	/**跨服争霸每日奖励信息*/
	private kF_m_DayawardInfo: Sproto.sc_guildwar_dayaward_info_request = null

	/**每日奖励信息返回4112*/
	private _DoDayawardInfo(rsp: Sproto.sc_guildwar_dayaward_info_request) {
		if(rsp.type && rsp.type > 0)
			this.kF_m_DayawardInfo = rsp;	
		else
			this.m_DayawardInfo = rsp;	
		GameGlobal.MessageCenter.dispatch(MessageDef.GUILDWAR_GETDAY_REWARD);
	}

	/**遗迹奖励分配数据*/
	private m_DispInfo: Sproto.sc_guildwar_disp_info_request = null;
	/**跨服小组奖励分配数据*/
	private kFm1_DispInfo: Sproto.sc_guildwar_disp_info_request = null;
	/**跨服决赛奖励分配数据*/
	private kFm2_DispInfo: Sproto.sc_guildwar_disp_info_request = null;

	/**分配奖励数据返回4119*/
	private _DoDispInfo(rsp: Sproto.sc_guildwar_disp_info_request) {
		switch(rsp.type)
		{
			case 1:
				this.kFm1_DispInfo = rsp;
			break;
			case 2:
				this.kFm2_DispInfo = rsp;
			break;
			default:
				this.m_DispInfo = rsp;	
			break;
		}	
		GameGlobal.MessageCenter.dispatch(MessageDef.GUILD_REWARD_UPDATE_DISP_INFO)
	}

	/**分配奖励完成返回4120*/
	private _DoDispRet(rsp: Sproto.sc_guildwar_disp_ret_request) {
		if (rsp.success) {
			ViewManager.ins().close(SelectMemberRewardWin)
			if(rsp.type == 1)
			{
				if (this.kFm1_DispInfo) 
					this.kFm1_DispInfo.canDisp = false;			
			}
			else if(rsp.type == 2)
			{
				if (this.kFm2_DispInfo) 
					this.kFm2_DispInfo.canDisp = false;
			}
			else
			{
				if (this.m_DispInfo) 
					this.m_DispInfo.canDisp = false;
			}

			UserTips.InfoTip(GlobalConfig.jifengTiaoyueLg.st101594)//奖励已分配完
			GameGlobal.MessageCenter.dispatch(MessageDef.GUILDWAR_SENDREWARD_SUCCESS)
		}
	}

	private m_WinnerInfo: Sproto.sc_guildwar_winner_info_request = null
	/**4121获胜公会信息返回*/
	private _DoWinnerInfo(rsp: Sproto.sc_guildwar_winner_info_request) {
		this.m_WinnerInfo = rsp		
		GameGlobal.MessageCenter.dispatch(MessageDef.GUILD_REWARD_WINNER_INFO)
	}

	private m_GuildRankData: Sproto.sc_guildwar_guild_scores_request = null

	private _DoUpdateGuildRankData(rsp: Sproto.sc_guildwar_guild_scores_request) {
		if (rsp && rsp.scores) {
			rsp.scores.sort(function(lhs, rhs) {
				return rhs.score - lhs.score
			})	
		}
		this.m_GuildRankData = rsp
		GameGlobal.MessageCenter.dispatch(MessageDef.GUILDWAR_RANK_INFO)
	}

	private m_PersonalRankData: Sproto.sc_guildwar_actor_scores_request = null

	private _DoUpdatePersonalRankData(rsp: Sproto.sc_guildwar_actor_scores_request) {
		if (rsp && rsp.scores) {
			rsp.scores.sort(function(lhs, rhs) {
				return rhs.score - lhs.score
			})	
			// 调换显示顺序
			for (let data of rsp.scores) {
				let value = data.actorname
				data.actorname = data.guildname
				data.guildname = value
			}
		}
		this.m_PersonalRankData = rsp
		GameGlobal.MessageCenter.dispatch(MessageDef.GUILDWAR_PERSONAL_RANK_INFO)
	}

	// private m_MyGuildRankInfo: Sproto.sc_guildwar_guild_rank_info_request = null
	private m_MyGuildRankInfo: Sproto.sc_gdwar_guild_member_request = null

	// private _DoUpdateMyGuildRankInfo(rsp: Sproto.sc_guildwar_guild_rank_info_request) {
	private _DoUpdateMyGuildRankInfo(rsp: Sproto.sc_gdwar_guild_member_request) {
		this.m_MyGuildRankInfo = rsp
		GameGlobal.MessageCenter.dispatch(MessageDef.GUILDWAR_MYRANK_CHANGE)
	}

	/**公会战发红包4102*/
	public SendRedpacket(yb: number, number: number) {
		let req = new Sproto.cs_guildwar_send_redpacket_request;	
		req.yuanbao = yb;
		req.number = number;
		req.type = this.getRedBagType;
		this.Rpc(C2sProtocol.cs_guildwar_send_redpacket, req);
	}

	/**公会战抢红包4103*/
	public SendGetRedpacket(): void {
		let req = new Sproto.cs_guildwar_get_redpacket_request;
		req.type = this.getRedBagType;
		this.Rpc(C2sProtocol.cs_guildwar_get_redpacket,req);
	}

	/**领取公会每日奖励4113*/
	public SendGetDayaward(type:number): void {
		let req = new Sproto.cs_guildwar_get_dayaward_request;
		req.type = type;
		req.day = (type && type>0)?this.kFrewardDay:this.rewardDay;
		this.Rpc(C2sProtocol.cs_guildwar_get_dayaward,req)
	}

	/**分配奖励请求4120*/
	public SendDispAward(): void {
		let len = this.getCanSendNumByRank()
		let sendList =  this.sendList
		let sendNumList = this.sendNumList

		let datas = []
		for (let rankIndex = 0; rankIndex < len; ++rankIndex) {
			let actorids = []
			let numList = sendNumList[rankIndex]
			let dataList = sendList[rankIndex]
			for (let i = 0; i < numList.length; ++i) {
				let numData = numList[i]
				for (let j = 0; j < numData; ++j) {
					actorids.push(dataList[i].data.roleID)
				}
			}
			let reqDat = new Sproto.guildwar_disp_info
			reqDat.id = rankIndex + 1
			reqDat.actorids = actorids
			datas.push(reqDat)
		}
		 
		let req = new Sproto.cs_guildwar_disp_award_request
		req.dispInfos = datas;
		req.type = SelectMemberRewardWin.dispIndex;
		this.Rpc(C2sProtocol.cs_guildwar_disp_award, req)
	}

	/**请求获胜公会信息4121
	 * type: integer# 0.本服行会战 1.跨服小组赛 2.跨服决赛
	*/
	public SendWinnerInfo(type:number): void {
		let req = new Sproto.cs_guildwar_get_winnerinfo_request
		req.type = type;
		this.Rpc(C2sProtocol.cs_guildwar_get_winnerinfo,req);
	}

	/**请求跨服决赛上届公会积分排行*/
	public SendKfGuildLastRank() 
	{
		let req = new Sproto.sc_guildwar_get_guild_scores_request;
		req.type = 2;
		this.Rpc(C2sProtocol.sc_guildwar_get_guild_scores,req);
	}

	/**请求遗迹争霸：开启中的公会排行/上届公会排行*/
	public SendGuildRank() 
	{
		if (GuildWar.ins().isWatStart) {
			this.Rpc(C2sProtocol.cs_gdwar_guild_rank);
		} else {
			this.Rpc(C2sProtocol.sc_guildwar_get_guild_scores);
		}
	}

	/**请求遗迹争霸：开启中的个人排行/上届个人排行*/
	public SendPersonalRank() {
		if (GuildWar.ins().isWatStart) {
			this.Rpc(C2sProtocol.cs_gdwar_actor_rank)
		} else {
			this.Rpc(C2sProtocol.sc_guildwar_get_actor_scores)
		}
	}

	public SendGetFirstwinnerAward() {
		this.Rpc(C2sProtocol.cs_guildwar_get_firstwinner_award)
	}

	/** 获取本帮排名 */
	public SendGetMyGuildRank() {
		// this.Rpc(C2sProtocol.cs_guildwar_get_my_guild_rank_info)
		this.Rpc(C2sProtocol.cs_gdwar_guild_member)
	}

	/** PROTO END */

	public get guildRankList(): Sproto.guildwar_scoreinfo[] {
		if (this.m_GuildRankData) {
			return this.m_GuildRankData.scores
		}
		return []
	}

	public get upGuildName(): string {
		if (this.m_GuildRankData) {
			return this.m_GuildRankData.upGuildName || ""
		}
		return ""
	}

	public get upReason(): number {
		if (this.m_GuildRankData) {
			return this.m_GuildRankData.upReason || 0
		}
		return 0
	}

	public get guildPersonalRankList(): Sproto.guildwar_scoreinfo[] {
		if (this.m_PersonalRankData) {
			return this.m_PersonalRankData.scores
		}
		return []
	}

	public GetWinner(): string {
		if (this.m_Winner) {
			return this.m_Winner.guildname
		}
		return ""
	}

	/**获取红包类型0.本服公会战 1.跨服小组赛 2.跨服决赛*/
	public get getRedBagType(): number {
		if (this.m_RedInfo && this.m_RedInfo.type) {
			return this.m_RedInfo.type;
		}
		return 0
	}

	public get canSend(): boolean {
		if (this.m_RedInfo) {
			return this.m_RedInfo.canSend
		}
		return false
	}

	public get canRod(): boolean {
		if (this.m_RedInfo) {
			return this.m_RedInfo.canGet
		}
		return false
	}

	public get getRedBagNum(): number {
		return this.rebList.length
	}

	public get redBagCount(): number {
		if (this.m_RedInfo) {
			return this.m_RedInfo.count
		}
		return 0
	}

	public get redBagSurplusTime(): number {
		if (this.m_RedInfo) {
			return Math.max(this.m_RedInfo.endTime - GameServer.serverTime, 0)
		}
		return 0
	}

	public get remainYB(): number {
		if (this.m_RedInfo) {
			return this.m_RedInfo.sendYuanbao
		}
		return 0
	}

	public get sendYbNum(): number {
		if (this.m_RedInfo) {
			return this.m_RedInfo.allYuanbao
		}
		return 0
	}

	public get maxRedNum(): number {
		if (this.m_RedInfo) {
			return this.m_RedInfo.count
		}
		return 0
	}

	public get robYbNum(): number {
		if (this.m_RedInfo) {
			for (let data of this.m_RedInfo.getInfos) {
				if (data.actorid == GameGlobal.actorModel.actorID) {
					return data.yuanbao
				}
			}
		}
		return 0
	}

	public get remainRedNum(): number {
		if (this.m_RedInfo) {
			return this.m_RedInfo.leftCount
		}
		return 0
	}

	public get rebList(): Sproto.guildwar_redpacket_getinfo[] {
		if (this.m_RedInfo) {
			return this.m_RedInfo.getInfos
		}
		return []
	}

	/*判断红包是否显示*/
	public isHaveRedBag() {
		return this.redBagSurplusTime > 0 && (this.canSend || this.canRod || this.getRedBagNum > 0)
	}

	public IsRedPointRedBag(): boolean {
		return this.redBagSurplusTime > 0 && (this.canSend || this.canRod)
	}

	/**是否有遗迹争霸每日奖励红点*/
	public IsRedPointByDay(): boolean {
		return this.canGetDay && !this.getDayReward;
	}

	/**是否有跨服争霸每日奖励红点*/
	public IsRedPointByKfDay(): boolean {
		return this.canKfGetDay && !this.getKfDayReward;
	}

	public IsShowRedPoint(): boolean {
		return this.IsRedPointRedBag() || this.IsRedPointByDay() || this.IsRedPointByKfDay();
	}

	/**获取占领公会信息*/
	public get winGuildInfo(): Sproto.sc_guildwar_winner_info_request {
		if (this.m_WinnerInfo) {
			return this.m_WinnerInfo
		}
		return {guildid: 0} as any
	}

	/**获取遗迹争霸每日奖励是否可以领取*/
	public get canGetDay(): boolean {
		if (this.m_DayawardInfo) {
			return this.m_DayawardInfo.canGet
		}
		return false
	}

	/**获取跨服争霸每日奖励是否可以领取*/
	public get canKfGetDay(): boolean {
		if (this.kF_m_DayawardInfo) {
			return this.kF_m_DayawardInfo.canGet
		}
		return false
	}

	/**获取遗迹争霸每日奖励是否已领取*/
	public get getDayReward(): boolean {
		if (this.m_DayawardInfo) {
			return this.m_DayawardInfo.isGet
		}
		return false
	}

	/**获取跨服争霸每日奖励是否已领取*/
	public get getKfDayReward(): boolean {
		if (this.kF_m_DayawardInfo) {
			return this.kF_m_DayawardInfo.isGet;
		}
		return false;
	}

	/**获取遗迹争霸每日奖励第几天*/
	public get rewardDay(): number {
		if (this.m_DayawardInfo) {
			return this.m_DayawardInfo.day
		}
		return 1
	}

	/**获取跨服争霸每日奖励第几天*/
	public get kFrewardDay(): number {
		if (this.kF_m_DayawardInfo) {
			return this.kF_m_DayawardInfo.day;
		}
		return 1
	}

	/**获取跨服争霸每日奖励类型(小组or决赛)*/
	public get kFrewardType(): number {
		if (this.kF_m_DayawardInfo) {
			return this.kF_m_DayawardInfo.type;
		}
		return 1
	}
	
	/**获取遗迹争霸分配奖励公会排行*/
	public get guildWarRank(): number {
		if (this.m_DispInfo) {
			return this.m_DispInfo.guildrank
		}
		return 0
	}

	/**获取跨服争霸小组赛分配奖励公会排行*/
	public get kF1guildWarRank(): number {
		if (this.kFm1_DispInfo) {
			return this.kFm1_DispInfo.guildrank
		}
		return 0
	}

	/**获取跨服争霸决赛分配奖励公会排行*/
	public get kF2guildWarRank(): number {
		if (this.kFm2_DispInfo) {
			return this.kFm2_DispInfo.guildrank
		}
		return 0
	}

	/**是否有遗迹争霸分配奖励*/
	public get canSendReward(): boolean {
		if (this.m_DispInfo) {
			return this.m_DispInfo.canDisp
		}
		return false
	}

	/**是否有跨服小组赛分配奖励*/
	public get canSendReward1(): boolean {
		if (this.kFm1_DispInfo) {
			return this.kFm1_DispInfo.canDisp
		}
		return false
	}

	/**是否有跨服决赛分配奖励*/
	public get canSendReward2(): boolean {
		if (this.kFm2_DispInfo) {
			return this.kFm2_DispInfo.canDisp
		}
		return false
	}

	public get myRankList(): MyGuildRankInfo[] {
		if (this.m_MyGuildRankInfo) {
			let list = []
			for (let d of this.m_MyGuildRankInfo.datas) {
				let info = new MyGuildRankInfo
				info.ToData(d)
				list.push(info)
			}
			return list
		}
		return []
	}

	getCanSendNumByRank (e = -1): number {

		var rank:number;
		var config:any;
		if(SelectMemberRewardWin.dispIndex == 1)
		{
			rank = GuildReward.ins().kF1guildWarRank;
			config =  GlobalConfig.ins("GuildBattleDistributionAward1");
		}
		else if(SelectMemberRewardWin.dispIndex == 2)
		{
			rank = GuildReward.ins().kF2guildWarRank;	
			config =  GlobalConfig.ins("GuildBattleDistributionAward2");
		}
		else
		{
			rank = GuildReward.ins().guildWarRank;
			config =  GlobalConfig.ins("GuildBattleDistributionAward");
		}
		
		var configData = config[rank];
		let i = 0;
		for (var key in configData) {
			if (key == e + "") {
				return configData[key].count;
			}
			++i
		}
		return i
	}

	// public sendList: {[key: number]: SelectInfoData[]} = []
	// public sendNumList: {[key: number]:number[]} = []
	public sendList: SelectInfoData[][] = []
	public sendNumList: number[][] = []
	// public rewardIndex = 0
	public myGuildPointRank = []

	getSelectDataByIndex (index: number) {
		var list = [];
		if (this.sendList && this.sendList[index] && this.sendList[index].length > 0) {
			let sendDatas = this.sendList[index]
			let sendNum = this.sendNumList[index];
			for (let i = 0; i < sendDatas.length; i++) {
				let data = new SelectInfoData
				data.data = sendDatas[i].data
				data.num = sendNum[i]
				list.push(data)
			}
		}
		return list
	}

	getMyGuildPointRank () {
		var members = Guild.ins().getGuildMembers(0)
		let len = members.length;
		this.myGuildPointRank = [];
		for (var r = 0; len > r; r++) {
			let member = members[r]
			let data = new SelectInfoData
			data.data = member
			// data.point = this.getPointByAcId(member.roleID)
			data.num = this.getPointByAcId(member.roleID)
			this.myGuildPointRank.push(data);
		}
		this.myGuildPointRank.sort(this.sort)
		return this.myGuildPointRank
	}

	sort (lhs: SelectInfoData, rhs: SelectInfoData) {
		let i = lhs.num
		let n = rhs.num
		return i > n ? -1 : n > i ? 1 : 0
	}

	/**根据玩家id获取玩家对应的遗迹积分*/
	getPointByAcId (actorId: number): number {
		// let list = this.myRankList
		// for (var len = list.length, i = 0; len > i; i++) {
		// 	if (list[i].actorId == actorId) {
		// 		return this.myRankList[i].point;
		// 	}
		// }
		var info:Sproto.sc_guildwar_disp_info_request = null;
		if(SelectMemberRewardWin.dispIndex == 1)
		{
			info = this.kFm1_DispInfo;
		}
		else if(SelectMemberRewardWin.dispIndex == 2)
		{
			info = this.kFm2_DispInfo;
		}
		else
		{
			info = this.m_DispInfo;
		}

		if (info == null || info.scores == null) {
			return 0
		}
		for (let data of info.scores) {
			if (data.actorid == actorId) {
				return data.score
			}
		}
		return 0
	}

	checkISSendAll() {
		let maxIndex = this.getCanSendNumByRank()
		for (var index = 0; maxIndex > index; index++) {
			var sendCount = this.getCanSendNumByRank(index);
			if (!this.sendList[index]) {
				UserTips.ErrorTip(GlobalConfig.jifengTiaoyueLg.st101595)//请先选择需要分配奖励的成员
				return false
			}
			let count2 = 0
			for (let j = 0; j < this.sendNumList[index].length; j++) {
				count2 += this.sendNumList[index][j];
			}
			if (sendCount > count2) {
				 UserTips.ErrorTip(GlobalConfig.jifengTiaoyueLg.st101595)//请先选择需要分配奖励的成员
				 return false
			}
			for (var j = 0; j < this.sendList[index].length; j++) {
				if (!Guild.ins().checkIsInGuild(this.sendList[index][j].data.roleID)) {
					UserTips.ErrorTip(this.sendList[index][j].data.name + " " + GlobalConfig.jifengTiaoyueLg.st101596)//已退出公会
					return false
				}
			}
		}
		return true
	}
}

window["GuildReward"]=GuildReward