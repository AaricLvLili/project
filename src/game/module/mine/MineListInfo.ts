class MineListInfo {
	acId = 0
	name = ""
	attNum = 0
	guildName = ""
	type = 1
	surplusTime = 0
	private fightNum = 0
	// fightList: number[] = []
	fightPow = 0
	isAtt = !0
	showError = ""
	post = 0;
	/**被偷次数*/
	public stealcount: number = 0;
	/**被偷的最大次数*/
	public stealcountmax: number = 0;
	private robStatus = false
	private caiKuangConfig: any;
	public sex: number;
	public job: number;
	public mainEle: number;

	parse(mapInfo: Sproto.mine_map_info, tempPos: number) {
		this.post = tempPos
		this.acId = mapInfo.dbid
		if (0 != this.acId) {
			this.name = mapInfo.actorName
			this.fightNum = mapInfo.berobotcount
			this.guildName = mapInfo.guildName
			this.type = mapInfo.mineType;
			this.stealcount = mapInfo.berobotcount;
			this.surplusTime = mapInfo.overTime
			this.robStatus = mapInfo.robStatus
			this.fightPow = mapInfo.fightPow
			this.job = mapInfo.job;
			this.sex = mapInfo.sex;
			this.mainEle = mapInfo.mainEle;

			if (this.acId == GameGlobal.actorModel.actorID) {
				this.isAtt = false;
				this.name = GlobalConfig.jifengTiaoyueLg.st101725;
			}
			else {
				this.isAtt = true;//this.checkIsAtt();
			}

			// this.acId == GameGlobal.actorModel.actorID 
			// 	? (this.isAtt = false, this.name = "我") 
			// 	: this.isAtt = this.checkIsAtt();
			"" == this.guildName && (this.guildName = GlobalConfig.jifengTiaoyueLg.st100897);
			if (this.caiKuangConfig == null)
				this.caiKuangConfig = GlobalConfig.ins("CaiKuangConfig");

			this.stealcountmax = this.caiKuangConfig.maxbestealcount;
		}
	}

	checkIsAtt() {
		if (this.caiKuangConfig == null)
			this.caiKuangConfig = GlobalConfig.ins("CaiKuangConfig");

		this.stealcountmax = this.caiKuangConfig.maxbestealcount;
		if (this.fightNum >= this.caiKuangConfig.maxberobotcount) {
			this.showError = GlobalConfig.jifengTiaoyueLg.st101726;
			return false
		}
		if (this.robStatus) {
			this.showError =GlobalConfig.jifengTiaoyueLg.st101727;
			return false
		}
		return true
	}
}
window["MineListInfo"]=MineListInfo