class GuanQiaModel {
	private static s_instance: GuanQiaModel;
	public static get getInstance(): GuanQiaModel {
		if (!GuanQiaModel.s_instance) {
			GuanQiaModel.s_instance = new GuanQiaModel();
		}
		return GuanQiaModel.s_instance;
	}
	public constructor() {
	}
	/**当前关卡boss体力 */
	public tiliNum: number = 0;
	/**购买体力的次数 */
	public tiliBuyNum: number = 0;
	/**有二进制解析boss状态 */
	public info: number = 0;
	/**下次体力刷新时间 */
	public time: number = 0;
	/**是否可以到下一章节 */
	public isCanNextLayer: boolean = true;

	public checkAllRedPoint() {
		if (this.checkSGQBossRedPoint() || this.checkAllGetAwardRedPoibt()) {
			return true;
		}
		return false;
	}
	public checkAllGetAwardRedPoibt() {
		let config = GlobalConfig.ins("ChaptersRewardConfig");
		for (let key in config) {
			let chaptersRewardConfig = config[key];
			if (this.checkGetAwardRedPoint(parseInt(key))) {
				return true;
			}
		}
		return false;
	}

	public checkGetAwardRedPoint(id: number) {
		let guanqiaID = UserFb.ins().guanqiaID;
		let [chaptersRewardConfig, isReward] = this.checkCanGetAward(id)
		if (isReward) {
			return true
		}
		return false;
	}
	/**检查boss有没有挑战过 */
	public checkIsGetAward(pass: number[], id: number): boolean {
		let index = Math.floor(id / 30);
		let re = pass[index] & 1 << (id - index * 30);
		if (re > 0) {
			return true;
		}
		return false;
	}
	public checkCanGetAward(id: number): any {
		let config = GlobalConfig.ins("ChaptersRewardConfig");
		let isReward = false
		var guanqiaID = UserFb.ins().guanqiaID;
		var chaptersRewardConfig = config[id];
		let guanqiaRewardId = UserFb.ins().guanqiaReward;
		if (chaptersRewardConfig) {
			let guanQiaId: number = UserFb.ins().guanqiaID;
			let isGet: boolean = this.checkIsGetAward(guanqiaRewardId, id)
			if (guanQiaId > chaptersRewardConfig.needLevel && !isGet) {
				isReward = true;
			}
		}
		return [chaptersRewardConfig, isReward]
	}
	/**当前关卡boss是否可以购买体力 */
	public get canBuyTili(): boolean {
		if (this.canBuyMaxNum > this.tiliBuyNum) {
			return true;
		}
		return false;
	}
	/**能购买体力的次数 */
	public get canBuyMaxNum(): number {
		let chaptersBossCommonConfig = GlobalConfig.ins("ChaptersBossCommonConfig");
		if (chaptersBossCommonConfig) {
			let canBuyNum = chaptersBossCommonConfig.timesCount[UserVip.ins().lv];
			return canBuyNum;
		}
		return 0;
	}
	/**购买体力单价 */
	public get buyTiliPrice(): number {
		let chaptersBossCommonConfig = GlobalConfig.ins("ChaptersBossCommonConfig");
		if (chaptersBossCommonConfig) {
			let price = chaptersBossCommonConfig.timesPirce[this.tiliBuyNum];
			if (price) {
				return price;
			} else {
				price = chaptersBossCommonConfig.timesPirce[chaptersBossCommonConfig.timesPirce.length - 1];
				return price
			}
		}
		return 0;
	}
	/**检查boss的挑战状态 true是挑战 false扫荡 */
	public checkBossIsBattle(id: number) {
		let re = this.info & 1 << id;
		if (re > 0) {
			return false;
		}
		return true;
	}
	/**第一次进入引导 */
	public checkIsFirstGuide(): boolean {
		let guanqiaID = UserFb.ins().guanqiaID;
		let config = GlobalConfig.ins("ChaptersRewardConfig");
		let isNeedLv: boolean = false;
		let chaptersRewardConfig = config[1];
		if (chaptersRewardConfig && chaptersRewardConfig.needLevel == guanqiaID) {
			isNeedLv = true;
		}
		if (this.isCanNextLayer && isNeedLv) {
			return true;
		}
		return false;
	}
	/**是否可以去下一章 */
	public checkIsCanGoNextLayer(): boolean {
		let guanqiaID = UserFb.ins().guanqiaID;
		let config = GlobalConfig.ins("ChaptersRewardConfig");
		let isNeedLv: boolean = false;
		for (let key in config) {
			let chaptersRewardConfig = config[key];
			if (chaptersRewardConfig && chaptersRewardConfig.needLevel == guanqiaID) {
				isNeedLv = true;
				break;
			}
		}
		if (this.isCanNextLayer && isNeedLv) {
			return true;
		}
		return false;
	}
	/**检查这章节是否通关 */
	public checkIsComp(mapId: number) {
		let guanQiaId: number = UserFb.ins().guanqiaID;
		let chaptersConfig = GlobalConfig.ins("ChaptersConfig")[guanQiaId];
		let chaptersRewardConfig = GlobalConfig.ins("ChaptersRewardConfig")[mapId]
		if (!chaptersRewardConfig.needLevel) {
			return false;
		}
		if (chaptersConfig) {
			let nowChaptersRewardConfig = GlobalConfig.ins("ChaptersRewardConfig")[chaptersConfig.mapid];
			if (nowChaptersRewardConfig) {
				if (guanQiaId > nowChaptersRewardConfig.needLevel || nowChaptersRewardConfig.needLevel > chaptersRewardConfig.needLevel || (this.checkIsCanGoNextLayer() && chaptersRewardConfig.needLevel == guanQiaId)) {
					return true;
				}
			}
		}
		return false
	}
	/**是否第一次打守关boss */
	public checkIsFirstBoss() {
		let isCanAtt = this.checkBossIsBattle(1)
		if (isCanAtt) {
			let guanQiaId: number = UserFb.ins().guanqiaID;
			let chaptersRewardConfig = GlobalConfig.ins("ChaptersRewardConfig")[1];
			if (guanQiaId > chaptersRewardConfig.needLevel) {
				return true;
			}
		}
		return false;
	}

	public guideConfig: any
	public setGuideConfig() {
		let config = GlobalConfig.ins("dialogueSetConfig")[4];
		let dialogueSetConfig: any = config[UserFb.ins().guanqiaID];
		// for (let key in config) {
		// 	if (config[key].param == UserFb.ins().guanqiaID) {
		// 		dialogueSetConfig = config[key];
		// 		break;
		// 	}
		// }
		this.guideConfig = dialogueSetConfig;
		return this.guideConfig;
	}

	public getPoint(nowConfig: any): number {
		let config = GlobalConfig.ins("dialogueSetConfig")[4];
		let dialogueSetConfig: any;
		let i = 1;
		for (let key in config) {
			if (config[key].param == nowConfig.param) {
				return (i + 1);
			}
			i++;
		}
		return i;
	}


	private lastJQConfig: any;
	public getLastJQGuideConfig(): any {
		let config = GlobalConfig.ins("dialogueSetConfig")[4];
		if (!this.lastJQConfig) {
			let dialogueSetConfig: any;
			for (let key in config) {
				dialogueSetConfig = config[key];
			}
			this.lastJQConfig = dialogueSetConfig;
		}
		return this.lastJQConfig;
	}

	public checkSGQBossRedPoint() {
		return this.tiliNum > 0 && UserFb.ins().guanqiaID > 10;
	}

}
window["GuanQiaModel"] = GuanQiaModel