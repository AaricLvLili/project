class ZhuZaiData {

	id: number;
	// rank: number;
	// growupID: number;
	level:number;
	private EquipPointConstConfig;
	private equipPointGrowUpConfig;
	private equipPointRankConfig;
	// 最终于成长id = (rank * 10000) + growUpId
	public parser(rspData: Sproto.zhuzai_data) {
		this.id = rspData.id
		this.level = rspData.level
		// this.rank = rspData.rank
		// this.growupID = rspData.growupID
	};

	public get lv() {
		// if (this.EquipPointConstConfig == null)
		// 	this.EquipPointConstConfig = GlobalConfig.ins("EquipPointConstConfig");
		// var temp = this.rank * this.EquipPointConstConfig.rankGrowUp + this.growupID;
		// return this.rank * this.EquipPointConstConfig.rankGrowUp + this.growupID;
		return this.level;
	}
	public isMaxLevel() {
		if (this.equipPointGrowUpConfig == null)
			this.equipPointGrowUpConfig = GlobalConfig.ins("EquipPointGrowUpConfig");
		var nextConfig = this.equipPointGrowUpConfig[this.id][this.lv + 1];
		if(!nextConfig)
		{
			var temp = (Math.floor(this.lv/10000)+1)*10000;
			nextConfig = this.equipPointGrowUpConfig[this.id][temp];
		}
		return nextConfig ? false : true;
	};
	public canLevelup() {
		if (this.equipPointGrowUpConfig == null)
			this.equipPointGrowUpConfig = GlobalConfig.ins("EquipPointGrowUpConfig");
		var config = this.equipPointGrowUpConfig[this.id][this.lv];
		var itemID = config.growUpItem.id;
		var needZs = config.needLevel / 1000 >> 0;
		var needLv = config.needLevel % 1000;
		if (this.isMaxLevel() || (needZs && UserZs.ins().lv < needZs) || (GameLogic.ins().actorModel.level < needLv)) {
			return false;
		}
		if (UserBag.ins().getBagGoodsCountById(0, itemID) < config.growUpItem.count) {
			return false;
		}
		return true;
	};
	public canAdvance() {
		if(this.equipPointRankConfig == null)
			this.equipPointRankConfig = GlobalConfig.ins("EquipPointGrowUpConfig");
		var config = this.equipPointRankConfig[this.id][this.lv];
		if (!this.lv || !config)
			return false;
		var itemID = config.growUpItem.id;
		if (UserBag.ins().getBagGoodsCountById(0, itemID) < config.growUpItem.count) {
			return false;
		}
		return true;
	};

	/**获取主宰装备阶zy*/
	public getZyRank() {
		if(this.equipPointRankConfig == null)
			this.equipPointRankConfig = GlobalConfig.ins("EquipPointGrowUpConfig");
		var config = this.equipPointRankConfig[this.id][this.lv];
		if (config)
			return config.rank;
		return 0;
	}
}
window["ZhuZaiData"]=ZhuZaiData