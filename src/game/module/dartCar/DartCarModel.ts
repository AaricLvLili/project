
enum DartExsploitType {
	NONE = 0,//0 未运镖
	EXPLOIT = 1,//运镖中
	FINISH = 2,//运镖完毕未领取奖励
}

class DartCarModel extends BaseSystem {

	/**#今日已运送镖车次数*/
	public exploitCnt:number = 0;
	/**#今日已掠夺他人镖车次数*/
	public robNum:number = 0;
	/**#当前运送的镖车类型*/
	public DartCarType;
	/**#正在运镖的结束时间*/
	public endTime;
	/**#镖车品质刷新类型*/
	public refreshType = 1;
	/**#镖车品质刷新次数*/
	public refreshNum;
	/**当前状态 0 未运镖 1运镖中 2运镖完毕未领取奖励*/
	public exploitStatus;
	/**#镖车品质刷新消耗*/
	public refreshCost = 0;
	/**#当前被掠夺的数据*/
	public DartRobInfoList = [];
	/**#双倍运镖活动是否开启*/
	public isDoubleDartCar:boolean;
	/**#运镖奖励是否是双倍*/
	public isDoubleReward:boolean;
	/**镖车列表*/
	public dartCarList: DartCarListInfo[] = [];
	/**#掠夺记录列表*/
	public dartCarRecordList: Sproto.biaoche_record_info[] = [];

	public constructor() {
		super();
		this.regNetMsg(S2cProtocol.sc_double_biaoche_notice, this.doubleDartCarNotice);
		this.regNetMsg(S2cProtocol.sc_biaoche_list, this.doDartCarList);
		this.regNetMsg(S2cProtocol.sc_self_biaoche_info, this.doSelfBiaocheInfo);
		this.regNetMsg(S2cProtocol.sc_biaoche_refresh_result, this.doDartCarRefreshResult);
		this.regNetMsg(S2cProtocol.sc_biaoche_berob_record, this.doDartCarReportInfo);
	}

	private biaoCheConfig:any;
	static ins(): DartCarModel {
		return super.ins()
	}

	/**双倍运镖活动通知*/
	private doubleDartCarNotice(rsp: Sproto.sc_double_biaoche_notice_request):void
	{
		this.isDoubleDartCar = rsp.doubleTime;
		GameGlobal.MessageCenter.dispatch(MessageDef.DOUBLE_DARTCAR_NOTICE)
	}

	/**#运镖个人信息以及更新*/
	private doSelfBiaocheInfo(rsp:Sproto.sc_self_biaoche_info_request):void
	{
		if (this.exploitStatus != rsp.exploitStatus && rsp.exploitStatus == DartExsploitType.EXPLOIT) {
			ViewManager.ins().isShow(DartCarRefushWin) && ViewManager.ins().close(DartCarRefushWin)
		}
		this.exploitCnt = rsp.exploitCnt
		this.robNum = rsp.robCnt
		this.DartCarType = rsp.exploitType || 1
		this.refreshType = rsp.refreshType || 1
		this.refreshNum = rsp.refreshCnt
		this.isDoubleReward = rsp.isDoublereward

		if(this.biaoCheConfig == null)
			this.biaoCheConfig = GlobalConfig.ins("BiaoCheConfig");

		let config = this.biaoCheConfig.refreshkuangyuanyuanbao;
		let len = config.length - 1
		this.refreshCost = 0
		for (let i = 0; i < this.refreshNum; ++i) {
			this.refreshCost = config[i < len ? i : len]
		}

		this.endTime = rsp.exploitOverTime
		this.exploitStatus = rsp.exploitStatus

		this.DartRobInfoList = rsp.beRobInfos;
		GameGlobal.MessageCenter.dispatch(MessageDef.DARTCAR_STATU_CHANGE)

		this._InitTimer()
		this.sendDartCarList();		
	}

	public HasDartCar() {
		if (this.endTime > 0 && DartExsploitType.EXPLOIT == this.exploitStatus) {
			return true
		}
		return this.exploitStatus == DartExsploitType.FINISH
	}

	private m_OutTime = 0
	private _InitTimer() 
	{
		TimerManager.ins().remove(this._DoTimer, this)
		if (this.endTime > 0 && DartExsploitType.EXPLOIT == this.exploitStatus) {
			var t = this.endTime
			this.m_OutTime = Math.ceil(t - GameServer.serverTime);

			TimerManager.ins().doTimer(1000, this.m_OutTime, this._DoTimer, this)
		}
	}

	private _DoTimer() 
	{
		--this.m_OutTime
		GameGlobal.MessageCenter.dispatch(MessageDef.MINE_UPDATE_TIME)//派发主界面图标
	}

	/**#获取镖车列表*/
	public sendDartCarList()
	{
		let req = new Sproto.cs_get_biaoche_list_request
		req.index = 0;
		this.Rpc(C2sProtocol.cs_get_biaoche_list, req);
	}

	/**#返回所有的镖车列表*/
	private doDartCarList(bytes:Sproto.sc_biaoche_list_request):void
	{
		this.dartCarList = [];
		var len = bytes.biaocheList.length
		for (var r = 0; r < len; r++) {
			this.dartCarList[r] = new DartCarListInfo
			this.dartCarList[r].parse(bytes.biaocheList[r], r + 1);
		}

		GameGlobal.MessageCenter.dispatch(MessageDef.UPDATA_DARTCAR_LIST)
	}

	/**#升级镖车*/
	public sendUpLevelDartCar() {
		this.Rpc(C2sProtocol.cs_uplevel_biaoche, new Sproto.cs_uplevel_biaoche_request);
	}

	/**#升级镖车品质结果*/
	private doDartCarRefreshResult(rsp: Sproto.sc_biaoche_refresh_result_request):void
	{
		var result = rsp.result;
		this.refreshType = rsp.biaocheType || 1;
		this.refreshNum = rsp.refreshNum;
		this.refreshCost = rsp.costNum;
		GameGlobal.MessageCenter.dispatch(MessageDef.REFUSH_DARTCAR_SUCCESS);
		result?UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101604):UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101603);
	}

	/**#开始运送镖车*/
	public sendStartDartCar():void
	{
		this.Rpc(C2sProtocol.cs_start_biaoche, new Sproto.cs_start_biaoche_request);
	}

	/**#领取镖车奖励*/
	public sendGetDartCarReward():void
	{
		this.Rpc(C2sProtocol.cs_rob_biaoche_award, new Sproto.cs_rob_biaoche_award_request);
	}

	/**#请求劫镖*/
	public sendRobDartCar(acId):void
	{
		let req = new Sproto.cs_rob_biaoche_request;
		req.dbid = acId;
		this.Rpc(C2sProtocol.cs_rob_biaoche, req);
	}

	/**#请求掠夺记录*/
	public sendDartCarReportInfo():void
	{
		this.Rpc(C2sProtocol.cs_biaoche_get_revenge_list, new Sproto.cs_biaoche_get_revenge_list_request);
	}

	/**#掠夺记录返回*/
	private doDartCarReportInfo(rsp:Sproto.sc_biaoche_berob_record_request):void
	{
		this.dartCarRecordList = rsp.biaocheRecordList
		this.dartCarRecordList.sort((lhs, rhs) => {
			return rhs.robTime - lhs.robTime
		})
		GameGlobal.MessageCenter.dispatch(MessageDef.DARTCAR_REVENGE_LIST)
	}

	/**#请求复仇*/
	public sendDartCarRevenge(robIndex):void
	{
		let req = new Sproto.cs_biaoche_revenge_request;
		req.robIndex = robIndex;
		this.Rpc(C2sProtocol.cs_biaoche_revenge, req);
	}

	static countRewardList(level: number, t = false, i = 1) {
		var n, r = GlobalConfig.ins("BiaoCheTypeConfig");
		for (var o in r)
			if (r[o].level == level) {
				n = r[o];
				break
			}
		if (ErrorLog.Assert(n, "DartCarModel   countRewardList    " + level)) return [];
		var s = t ? n.losegold : n.rewardgold,
			a = t ? n.losefeats : n.rewardfeats,
			l = new RewardData;
		l.type = 0, l.id = 1, l.count = s * i;
		var h = new RewardData;
		return h.type = 0, h.id = 7, h.count = a * i, [l, h]
	}
	carRedPoint = new DartCarModelRedPoint
}

class DartCarModelRedPoint extends IRedPoint {

	private biaoCheConfig:any;
	public GetMessageDef(): string[] {
		return [
			MessageDef.DARTCAR_STATU_CHANGE
		]
	}

	public IsRed(): boolean {
		if (!Deblocking.Check(DeblockingType.TYPE_27, true)) {
			return false
		}
		let dartCarModel = DartCarModel.ins()
		if(this.biaoCheConfig == null)
			this.biaoCheConfig = GlobalConfig.ins("BiaoCheConfig");

		if (dartCarModel.exploitStatus != MineExploitType.EXPLOIT
				&& this.biaoCheConfig.maxcaikuangcount > dartCarModel.exploitCnt 
				&& dartCarModel.endTime <= 0) {
			return true
		}
		return false
	}
}

window["DartCarModel"]=DartCarModel
window["DartCarModelRedPoint"]=DartCarModelRedPoint