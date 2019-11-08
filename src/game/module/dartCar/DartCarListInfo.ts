class DartCarListInfo {
	/**镖车dbid*/
	public acId = 0;
	/**玩家名字*/
	public name = "";
	/**公会名字*/
	public guildName = "";
	/**镖车类型*/
	public type = 1;
	/**运镖结束时间*/
	public surplusTime = 0;
	/**被抢夺的次数*/
	public fightNum = 0;
	/**战斗力*/
	public fightPow = 0;
	public isAtt = true;
	public showError = "";
	/**镖车位置*/
	public post = 0;
	/**是否已经被劫过*/
	public robStatus = false;
	public biaoCheConfig: any;

	public job: number;
	public sex: number;
	public mainEle: number;

	parse(carInfo: Sproto.biaoche_info, tempPos: number) {
		this.post = tempPos
		this.acId = carInfo.dbid
		if (0 != this.acId) {
			this.name = carInfo.actorName
			this.fightNum = carInfo.berobotcount
			this.guildName = carInfo.guildName
			this.type = carInfo.biaocheType;
			this.surplusTime = carInfo.overTime
			this.robStatus = carInfo.robStatus
			this.fightPow = carInfo.fightPow
			this.job = carInfo.job;
			this.sex = carInfo.sex;
			this.mainEle = carInfo.mainEle;

			if (this.acId == GameGlobal.actorModel.actorID) {
				this.isAtt = false;
				this.name = GlobalConfig.jifengTiaoyueLg.st101725
			}
			else {
				this.isAtt = true;
			}
		}
	}

	public checkIsAtt() {
		if (this.biaoCheConfig == null)
			this.biaoCheConfig = GlobalConfig.ins("BiaoCheConfig");

		if (this.fightNum >= this.biaoCheConfig.maxberobotcount) {
			this.showError =GlobalConfig.jifengTiaoyueLg.st101726;
			return false
		}

		if (this.robStatus) {
			this.showError = GlobalConfig.jifengTiaoyueLg.st101727;
			return false
		}
		return true
	}
}
window["DartCarListInfo"]=DartCarListInfo