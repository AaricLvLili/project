class AcrossLadderRecordItemData {

	public recordTypeOrg:boolean;
	public recordResultOrg:boolean;
	// public recordType:string;
	// public recordResult:string;
	public opPlayerId:number;
	public opName:string;
	public opZsLv:number;
	public opLv:number;
	public rankChange:number;
	public rankChangeNum:number;
	// public rankChangeDirection:string;
	public recordTime:number;

	parser(rsp: Sproto.sc_cross_get_combat_record_request) {
		for (var len = rsp.combatRecord.length, i = 0; len > i; i++) {
			this.disposeData(rsp.combatRecord[i]);
		}
	}

	disposeData(rsp: Sproto.tianti_combat_record) {
		this.recordTypeOrg = rsp.isCombat;
		this.recordResultOrg = rsp.isWin;
		// this.recordType = rsp.isCombat ? "ui_acrossladder_attack_png" : "ui_acrossladder_defend_png";
		// this.recordResult = rsp.isWin ? "ui_acrossladder_win_png" : "ui_acrossladder_lost_png";
		this.opPlayerId = rsp.revengeDbid;
		this.opName = rsp.name;
		this.opZsLv = rsp.zhuansheng_lv;
		this.opLv = rsp.level;
		this.rankChange = rsp.rankChange;
		this.rankChangeNum = rsp.selfRankChangeNum;
		this.recordTime = rsp.recordTime;
		// switch(this.rankChange){
		// 	case 0 : this.rankChangeDirection = "ui_acrossladder_green_png"; break;
		// 	case 1 : this.rankChangeDirection = "ui_acrossladder_down_png"; break;
		// 	case 2 : this.rankChangeDirection = "ui_acrossladder_up_png";break;
		// };
	}
}
window["AcrossLadderRecordItemData"]=AcrossLadderRecordItemData