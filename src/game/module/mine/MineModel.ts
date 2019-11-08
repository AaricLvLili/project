enum MineReportType {
 // 1升级矿源 2 确认开采 3领取奖励 4 请求复仇记录 5 快速完成
	UPGRADE = 1,
	SURE_MINE = 2,
	GET_REWARD = 3,
	REQ_REVENGE = 4,
	QUICK_FINISH = 5,
}

enum MineExploitType {
	NONE = 0,
	EXPLOIT = 1,
	FINISH = 2,
}

class MineModel extends BaseSystem {


	// mineInfoList: MineNowInfo[]

	mineInfoList: MineNowInfo[] = []	// 当前被掠夺的数据


	exploitCnt = 0	// 开采次数
	robNum = 0		// 剩余掠夺次数
	mineType
	refreshNum
	refreshCost = 0 // 刷新消耗
	refreshType = 1
	// upCount
	endTime			// 剩余时间
	mineMapNum = 0
	exploitStatus

	showType = 1
	mapMine = new MinePeopleItem

	refushNum = 0

	/**剩余偷矿次数*/
	public stealCnt:number = 0;
	/**被偷矿信息*/
	// public beStealInfos: Sproto.stealInfo[]; // tag 9
	robNews = false //  掠夺红点提示


	upCount = 0
	curIndex = 1
	
	bIsTipsFlag:boolean = false;  //是否弹过提示，每次启动游戏重置
	private caiKuangConfig:any;

	/**双倍挖矿活动是否开启*/
	public isDoubleMining:boolean;
	/**挖矿奖励是否是双倍*/
	public isDoubleReward:boolean;

	static ins(): MineModel {
		return super.ins()
	}

	public constructor() {
		super()

		this.regNetMsg(S2cProtocol.sc_mine_info, this.getMineInfo)
		this.regNetMsg(S2cProtocol.sc_mine_refresh_result, this.getRefushMineInfo)
		// this.regNetMsg(S2cProtocol.sc_mine_star_mine_back, this.getStarMineBack)
		this.regNetMsg(S2cProtocol.sc_mine_map_info, this.getMineMapInfo)
		// this.regNetMsg(S2cProtocol.sc_mine_reward_back, this.getRwardBack)
		// this.regNetMsg(S2cProtocol.sc_mine_record, this.getMineRecord)
		// this.regNetMsg(S2cProtocol.sc_mine_rob_info, this.getRobInfo)
		// this.regNetMsg(S2cProtocol.sc_mine_back_rob_info, this.getBackRobInfo)
		// this.regNetMsg(S2cProtocol.sc_mine_my_mine_over, this.getMyMineOver)
		// this.regNetMsg(S2cProtocol.sc_mine_new_rob_Info, this.getNewRobInfo)
		// this.regNetMsg(S2cProtocol.sc_mine_enter_fb_info, this.enterFbInfo)

		this.regNetMsg(S2cProtocol.sc_mine_berob_record, this.DoMineBerobRecord)
		this.regNetMsg(S2cProtocol.sc_double_mining_notice, this.DoubleMiningNotice);

		this.regNetMsg(S2cProtocol.sc_steal_mine_fight_notice,this.stealFightNotice);
	}

	private stealFightNotice(rsp:Sproto.sc_steal_mine_fight_notice_request):void
	{
		ViewManager.ins().open(MineStealTips,rsp.countdown);
	}


	/**双倍挖矿活动通知*/
	private DoubleMiningNotice(rsp: Sproto.sc_double_mining_notice_request):void
	{
		this.isDoubleMining = rsp.doubleTime;
		GameGlobal.MessageCenter.dispatch(MessageDef.DOUBLE_MINING_NOTICE)
	}

	mineRecordList: Sproto.mine_record_info[] = []

	private DoMineBerobRecord(rsp: Sproto.sc_mine_berob_record_request) {
		this.mineRecordList = rsp.mineRecordList
		this.mineRecordList.sort((lhs, rhs) => {
			return rhs.robTime - lhs.robTime
		})
		GameGlobal.MessageCenter.dispatch(MessageDef.MINE_REVENGE_LIST)
	}
	/**偷矿*/
	public requestSteal(acId:number):void
	{
		let req = new Sproto.cs_mine_steal_request();
		req.acId = acId;
		this.Rpc(C2sProtocol.cs_mine_steal, req);
	}

	// 1升级矿源 2 确认开采 3领取奖励 4 请求复仇记录 5 快速完成
	reportMineInfo(type: MineReportType) {
		let req = new Sproto.cs_mine_report_mine_info_request
		req.type = type
		this.Rpc(C2sProtocol.cs_mine_report_mine_info, req)
	}

	reportMineMapInfo(mapIndex: number, t = 0) {
		let req = new Sproto.cs_mine_mapdata_request
		req.mapIndex = mapIndex
		// if(GameLogic.ins().actorModel.name == "纪依波♂")
		// {
		// 	StatisticsUtils.debugInfoLogPhp("reportMineMapInfo  这个矿有毒："+mapIndex);
		// }
		// req.arg = t

		this.Rpc(C2sProtocol.cs_mine_mapdata, req)
	}

	robOtherMine(acId) {
		let req = new Sproto.cs_mine_rob_request
		req.acId = acId
		this.Rpc(C2sProtocol.cs_mine_rob, req)
	}

	breakRobOther(acId) {
		let req = new Sproto.cs_mine_revenge_request
		req.acId = acId
		this.Rpc(C2sProtocol.cs_mine_revenge, req)
	}



	getMineInfo(rsp: Sproto.sc_mine_info_request) {

		if (this.exploitStatus != rsp.exploitStatus && rsp.exploitStatus == MineExploitType.EXPLOIT) {
			ViewManager.ins().isShow(MineRefushWin) && ViewManager.ins().close(MineRefushWin)
		}

		this.exploitCnt = rsp.exploitCnt
		this.robNum = rsp.robCnt
		// this.mineType = rsp.refreshType < 1 ? 1 : rsp.refreshType
		this.mineType = rsp.exploitType || 1
		this.refreshType = rsp.refreshType || 1
		this.refreshNum = rsp.refreshCnt
		this.isDoubleReward = rsp.isDoublereward

		if(this.caiKuangConfig == null)
			this.caiKuangConfig = GlobalConfig.ins("CaiKuangConfig");
		if(this.caiKuangConfig == null)
		{
			Main.errorBack("getMineInfo exploitCnt="+this.exploitCnt + " exploitType="+rsp.exploitType + " this.refreshNum="+this.refreshNum +" this.refreshType="+this.refreshType);
			return ;
		}
		let config = this.caiKuangConfig.refreshkuangyuanyuanbao;
		let len = config.length - 1
		this.refreshCost = 0
		for (let i = 0; i < this.refreshNum; ++i) {
			this.refreshCost = config[i < len ? i : len]
		}

		this.stealCnt = rsp.stealCnt;
		// this.beStealInfos = rsp.beStealInfos;

		this.endTime = rsp.exploitOverTime
		this.exploitStatus = rsp.exploitStatus
		var t = rsp.beRobInfos.length;
		this.mineInfoList = [];
		for (var i = 0; t > i; i++) this.mineInfoList[i] = new MineNowInfo, this.mineInfoList[i].parse(rsp.beRobInfos[i]);
		GameGlobal.MessageCenter.dispatch(MessageDef.MINE_STATU_CHANGE)

		this._InitTimer()

		// 请求地图数据
		this.reportMineMapInfo(this.curIndex)
	}

	public HasMine() {
		if (this.endTime > 0 && MineExploitType.EXPLOIT == this.exploitStatus) {
			return true
		}
		return this.exploitStatus == MineExploitType.FINISH
	}

	private m_OutTime = 0

	private _InitTimer() {
		TimerManager.ins().remove(this._DoTimer, this)
		if (this.endTime > 0 && MineExploitType.EXPLOIT == this.exploitStatus) {
			var t = this.endTime
			this.m_OutTime = Math.ceil(t - GameServer.serverTime);

			TimerManager.ins().doTimer(1000, this.m_OutTime, this._DoTimer, this)
		}
	}

	private _DoTimer() {
		--this.m_OutTime
		GameGlobal.MessageCenter.dispatch(MessageDef.MINE_UPDATE_TIME)
	}

	getRefushMineInfo(e: Sproto.sc_mine_refresh_result_request) {
		// GameGlobal.mineModel.decodeMineType(e) 

		var t = e.result
		this.refreshType = e.mineType || 1
		this.refreshNum = e.refreshNum
		this.refreshCost = e.costNum
		// this.upCount = e.upCount
		GameGlobal.MessageCenter.dispatch(MessageDef.REFUSH_MINE_SUCCESS);
		var i = GlobalConfig.jifengTiaoyueLg.st101603;
		t && (i = GlobalConfig.jifengTiaoyueLg.st101640)

		UserTips.ins().showTips(i)
		//  App.ControllerManager.applyFunc(ControllerConst.TIPS, TipsFunc.SHOW_TIPS, i)

	}

	mapNumLen = 0
	mapId
	mapMineList: MineListInfo[]

	getMineMapInfo(bytes: Sproto.sc_mine_map_info_request) {
		// GameGlobal.mineModel.decodeMineMapInfo(e)

		this.mineMapNum = bytes.mineMapNum
		this.curIndex = bytes.curIndex

		0 == this.mapNumLen && (this.mapNumLen = this.countMapNumLen());
		var i = this.curIndex % this.mapNumLen;
		this.mapId = 0 == i ? this.mapNumLen : i, this.mapMineList = [];
		for (var n = bytes.mapMineList.length, r = 0; n > r; r++) {
			this.mapMineList[r] = new MineListInfo
			this.mapMineList[r].parse(bytes.mapMineList[r], r + 1);
		}
		this.mapMineList.sort((lhs,rhs)=>{
			if(lhs.isAtt!=rhs.isAtt)
			{
				if(lhs.isAtt){
                   return -1
				}
			    return 1
			}
			return -1
		})
		this.mapMineList.sort((lhs,rhs)=>{
			if(lhs.isAtt==true&&rhs.isAtt==true){
               if(lhs.type<rhs.type){
				   return 1
			   }else{
				   if(lhs.type==rhs.type){
					   if(lhs.fightPow>rhs.fightPow){
						   return 1
					   }
				   }
			   }
			}
			return -1;
		})

		for (let i = 0; i < this.mapMineList.length; ++i) {
			this.mapMineList[i].post = i + 1
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_MINE_LIST)
	}

	getBackRobInfo(e) { }

	cfgLen = 0

	addMineToMap(e: number) {
		if (e == 1) {
			this.mapMine.setLookInfo(this.showType)
			this.mapMine.x = 1632
			this.mapMine.y = 992
			GameLogic.ins().gamescene.map.addEntity(this.mapMine)
		} else {
			DisplayUtils.removeFromParent(this.mapMine)
		}
	}

	countMapNumLen() {
		if (this.cfgLen > 0) return this.cfgLen;
		var e = 0
		let t = GlobalConfig.ins("KuangDiTuConfig");
		for (var i in t) t[i] && ++e;
		return this.cfgLen = e, this.cfgLen
	}

	getCfgByType(e = -1) {
		-1 == e && (e = this.mineType);
		var t = GlobalConfig.ins("KuangYuanConfig");
		for (var i in t)
			if (t[i].level == e) return t[i];
		return null
	}

	getFreshCfgByType(e = -1) {
		-1 == e && (e = this.refreshType);
		var t = GlobalConfig.ins("KuangYuanConfig");
		for (var i in t)
			if (t[i].level == e) return t[i];
		return null
	}

	static countRewardList(level: number, t = false, i = 1) {
		var n, r = GlobalConfig.ins("KuangYuanConfig");
		for (var o in r)
			if (r[o].level == level) {
				n = r[o];
				break
			}
		if (ErrorLog.Assert(n, "MineModel   countRewardList    " + level)) return [];
		var s = t ? n.losegold : n.rewardgold,
			a = t ? n.losefeats : n.rewardfeats,
			l = new RewardData;
		l.type = 0, l.id = 1, l.count = s * i;
		var h = new RewardData;
		return h.type = 0, h.id = 7, h.count = a * i, [l, h]
	}
	get isTipsFlag() {
		return this.bIsTipsFlag;
	}
	set isTipsFlag(value) {
		if (this.bIsTipsFlag != value) {
			this.bIsTipsFlag = value;
		}
	}

	countPosition (e) {
		var t = GlobalConfig.ins("KuangDiTuConfig")[this.mapId];
		let p = t.pos[e - 1]
		if (p) {
			return new egret.Point(p[0], p[1] - 30)
		} else {
			p = t.pos[0]
		}
		return new egret.Point(t.pos[e - 1][0], t.pos[e - 1][1] - 30)
	}

	mRedPoint = new MineModelRedPoint	
}

class MineModelRedPoint extends IRedPoint {

	private caiKuangConfig:any;
	public GetMessageDef(): string[] {
		return [
			MessageDef.MINE_STATU_CHANGE
		]
	}

	public IsRed(): boolean {
		if (!Deblocking.Check(DeblockingType.TYPE_08, true)) {
			return false
		}
		let mineModel = MineModel.ins()
		if(this.caiKuangConfig == null)
			this.caiKuangConfig = GlobalConfig.ins("CaiKuangConfig");

		if (mineModel.exploitStatus != MineExploitType.EXPLOIT
				&& this.caiKuangConfig.maxcaikuangcount > mineModel.exploitCnt 
				&& mineModel.endTime <= 0) {
			return true
		}
		return false
	}
}
window["MineModel"]=MineModel
window["MineModelRedPoint"]=MineModelRedPoint