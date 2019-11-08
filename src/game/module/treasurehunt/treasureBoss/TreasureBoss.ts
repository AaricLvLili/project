class TreasureBoss extends BaseSystem{
	public constructor() {
		super();
		this.regNetMsg(S2cProtocol.sc_treasure_boss_list, this.doTreasureBossList);
	}

	static ins(): TreasureBoss {
		return super.ins();
	}

	/**#获取寻宝BOSS列表*/
	public sendTreasureBossList():void
	{
		GameSocket.ins().Rpc(C2sProtocol.cs_get_treasure_boss_list,  new Sproto.cs_get_treasure_boss_list_request());
	}

	/**#寻宝BOSS列表返回*/
	private doTreasureBossList(bytes:Sproto.sc_treasure_boss_list_request):void
	{
		TreasureBoss.postTreasureBossList(bytes);
	}

	static postTreasureBossList(bytes:Sproto.sc_treasure_boss_list_request) {
		var arr = bytes.bosslist;
		arr.sort(this.bossSort);
		return [arr,bytes.huntMin,bytes.huntMax];
	}

	private static bossSort(a,b)
	{
		if(a.people > b.people)
			return 1;
		if(a.people < b.people)
			return -1;
		if(a.id > b.id)
			return 1;
		if(a.id < b.id)
			return -1;
		return 0;
	}

	/**#进入寻宝副本*/
	public enterTreasureRaid(handle:number):void
	{
		let req = new Sproto.cs_enter_treasure_raid_request()
		req.handle = handle;
		GameSocket.ins().Rpc(C2sProtocol.cs_enter_treasure_raid, req);
	}
}

MessageCenter.compile(TreasureBoss);

window["TreasureBoss"]=TreasureBoss