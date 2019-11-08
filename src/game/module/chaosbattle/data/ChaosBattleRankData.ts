class ChaosBattleRankData {
	public constructor() {
	}
	public rankNum: number = 1;
	public name: string;
	public guildName: string;
	public pointNum: number;
	public vipLv: number = 3;
	public setData(data: Sproto.sorce_info) {
		this.name = data.name;
		this.pointNum = data.sorce;
		this.guildName = data.orgname
	}
}