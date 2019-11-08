class AcrossLadderItemData {

	public playerId: number;//-
	public playerName: string;
	public zsLv: number;
	public lv: number;
	public rank: number;
	public power: number;
	public job: number;
	public sex: number;
	public weaponId: number;
	public clothesId: number;
	public wingOpenState: number;
	public wingLevel: number;
	public combatState: number;
	public m_ElementType: number;


	parser(rsp: Sproto.sc_get_cross_tianti_list_request) {
		for (var len = rsp.roles.length, i = 0; len > i; i++) {
			this.disposeData(rsp.roles[i])
		}
	}

	disposeData(rsp: Sproto.roles_display_info) {
		this.playerId = rsp.dbid;
		this.playerName = rsp.name;
		this.zsLv = rsp.zhuansheng_lv;
		this.lv = rsp.level;
		this.rank = rsp.rank;
		this.power = rsp.power;
		this.job = rsp.job;
		this.sex = rsp.sex;
		this.weaponId = rsp.weaponId;
		this.clothesId = rsp.clothesId;
		this.wingOpenState = rsp.wingOpenState;
		this.wingLevel = rsp.wingLevel;
		this.combatState = rsp.combatState;
		this.m_ElementType = rsp.mainEle; 
	}
}
window["AcrossLadderItemData"]=AcrossLadderItemData