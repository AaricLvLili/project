class AcrossLadderRankItemData {

	public playerId:number;
	public name:string;
	public power:number;
	public zhLv:number;
	public lv:number;
	public rank:number;

	parser(rsp: Sproto.sc_cross_get_tianti_rank_info_request) {
		for (var len = rsp.rankInfo.length, i = 0; len > i; i++) {
			this.disposeData(rsp.rankInfo[i]);
		}
	}

	disposeData(rsp: Sproto.tianti_rank_info) {
		this.playerId = rsp.serverid;
		this.name = rsp.name;
		this.power = rsp.power;
		this.zhLv = rsp.zhuansheng_lv;
		this.lv = rsp.level;
		this.rank = rsp.rank;
	}
}
window["AcrossLadderRankItemData"]=AcrossLadderRankItemData