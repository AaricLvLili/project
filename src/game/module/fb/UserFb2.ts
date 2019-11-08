class UserFb2 extends BaseSystem {

	fbChallengeId: number = 1;

	mPreLevel: number = -1
	mPreStatus: boolean = false
	levelStatus1: number = 0;
	levelStatus2: number = 0;
	public constructor() {
		super()
		this.sysId = PackageID.FbChallenge;
		// this.regNetMsg(1, this.doUpDataInfo);
		this.regNetMsg(S2cProtocol.sc_challenge_raid_update_info, this.doUpDataInfo);
	}

	static ins(): UserFb2 {
		return super.ins();
	}

	/**
     * 发送挑战副本
     * 1-1
     * @param fbID 副本id
     */
	public sendChallenge() {
		// var bytes = this.getBytes(1);
		// this.sendToServer(bytes);
		this.Rpc(C2sProtocol.cs_challenge_raid_send)
	};

	public SendChallengeReward() {
		this.Rpc(C2sProtocol.cs_challenge_raid_day_reward)
	}

    /**
     * 更新挑战副本信息
     * 1-1
     * @param bytes
     */
	public doUpDataInfo(bytes: Sproto.sc_challenge_raid_update_info_request) {
		this.fbChallengeId = bytes.fbID
		this.mPreLevel = bytes.level
		this.mPreStatus = bytes.status
		this.levelStatus1 = bytes.levelStatus1;
		this.levelStatus2 = bytes.levelStatus2;
		GameGlobal.MessageCenter.dispatch(MessageDef.CHALLENGE_UPDATE_INFO)
	};

	public get commonLv() {
		let config = GlobalConfig.ins("FbChallengeStageAwardConfig");
		for (let key in config) {
			let lv = parseInt(key);
			if (lv > this.levelStatus1) {
				return lv;
			}
		}
		return null;
	}

	public get commonLv2() {
		let config = GlobalConfig.ins("FbChallengeStageAwardConfig");
		for (let key in config) {
			let lv = parseInt(key);
			if (lv > this.fbChallengeId) {
				return lv;
			}
		}
		return null;
	}

	public get tagerLv() {
		let config = GlobalConfig.ins("FbChallengeTaskAwardConfig");
		for (let key in config) {
			let lv = parseInt(key);
			if (lv > this.levelStatus2) {
				return lv;
			}
		}
		return null;
	}





	public IsRed(): boolean {
		let config = GlobalConfig.fbChallengeConfig[this.mPreLevel];
		if (config) {
			return !UserFb2.ins().mPreStatus
		}
		return false
	}

	public sendGetRewad(ctype: number, level: number) {
		let rsp = new Sproto.cs_challenge_raid_new_reward_request;
		rsp.ctype = ctype;
		rsp.level = level;
		this.Rpc(C2sProtocol.cs_challenge_raid_new_reward, rsp);
	}
}

window["UserFb2"] = UserFb2