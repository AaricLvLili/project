class DayOneActivityController extends BaseSystem {
	/**一元活动充值状态(1充值过了，没有领取  2没有充值 3充值过了，领取了)*/
	public rewardState:number;
	public constructor() {
		super();
		this.regNetMsg(S2cProtocol.sc_one_recharge_activity_state, this.doDayOneActivityRewardState);
		this.regNetMsg(S2cProtocol.sc_one_recharge_activity_gain, this.doDayOneActivityRewardResult);
	}

	static ins(): DayOneActivityController {
		return super.ins()
	}

	/**#一元充值活动，奖励状态*/
	private doDayOneActivityRewardState(rsp: Sproto.sc_one_recharge_activity_state_request):void
	{
		this.rewardState = rsp.awardState;
		GameGlobal.MessageCenter.dispatch(MessageDef.DAYONE_ACTIVITY);
	}

	/**#一元充值活动,请求领取*/
	public sendDayOneActivityReward():void
	{
		this.Rpc(C2sProtocol.cs_one_recharge_activity_gain, new Sproto.cs_one_recharge_activity_gain_request);
	}

	/**#一元充值活动，领取奖励返回*/
	private doDayOneActivityRewardResult(rsp: Sproto.sc_one_recharge_activity_gain_request):void
	{
		if(rsp.code == 0)
			ViewManager.ins().close(DayOneActivityPanel);
	}
}
window["DayOneActivityController"]=DayOneActivityController