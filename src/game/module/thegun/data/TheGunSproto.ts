class TheGunSproto extends BaseSystem {
	public constructor() {
		super();
		this.regNetMsg(S2cProtocol.sc_holygun_init, this.getTheGunInit);
		this.regNetMsg(S2cProtocol.sc_holygun_upscala, this.getTheGunLvUp);
		this.regNetMsg(S2cProtocol.sc_holygun_upstar, this.getTheGunStarUp);
		this.regNetMsg(S2cProtocol.sc_holygun_upskill, this.getTheGunSkillUp);
		this.regNetMsg(S2cProtocol.sc_holygun_eatdanyao, this.getTheGunDanYaoEat);
		this.regNetMsg(S2cProtocol.sc_holygun_achievement, this.getTheGunGetaward);
	}
	static ins(): TheGunSproto {
		return super.ins();
	}

	/**获取圣枪初始化信息 */
	private getTheGunInit(bytes: Sproto.sc_holygun_init_request) {
		let theGunModel = TheGunModel.getInstance;
		for (var i = 0; i < bytes.data.length; i++) {
			let theGunData: TheGunData = new TheGunData(bytes.data[i]);
			theGunModel.theGunDic.set(bytes.data[i].roleid, theGunData);
		}
		// theGunModel.achieve = bytes.achieve;
		GameGlobal.MessageCenter.dispatch(TheGunEvt.THEGUN_DATAUPDATE_MSG);
	}
	/**获取圣枪初升级信息 */
	private getTheGunLvUp(bytes: Sproto.sc_holygun_upscala_request) {
		let theGunModel = TheGunModel.getInstance;
		let theGunData: TheGunData = theGunModel.theGunDic.get(bytes.roleid);
		if (theGunData) {
			theGunData.level = bytes.scala;
			let spearLevelConfig = GlobalConfig.ins("SpearLevelConfig")[bytes.scala];
			ViewManager.ins().open(MainNewWin, ResAnimType.TYPE1, 0, [spearLevelConfig.appearance, spearLevelConfig.name, 2])
		}
		this.sendTheGunInitMsg();
		// ViewManager.ins().open(TheGunNewWin, theGunData);
		GameGlobal.MessageCenter.dispatch(TheGunEvt.THEGUN_DATAUPDATE_MSG);
	}
	/**获取圣枪升星信息 */
	private getTheGunStarUp(bytes: Sproto.sc_holygun_upstar_request) {
		let theGunModel = TheGunModel.getInstance;
		let theGunData: TheGunData = theGunModel.theGunDic.get(bytes.roleid);
		if (theGunData) {
			theGunData.star = bytes.star;
			theGunData.exp = bytes.exp;
		}
		GameGlobal.MessageCenter.dispatch(TheGunEvt.THEGUN_DATAUPDATE_MSG);
	}
	/**获取圣枪技能升级信息 */
	private getTheGunSkillUp(bytes: Sproto.sc_holygun_upskill_request) {
		let theGunModel = TheGunModel.getInstance;
		let theGunData: TheGunData = theGunModel.theGunDic.get(bytes.roleid);
		if (theGunData) {
			// let skillId = theGunData.skill.set[bytes.id - 1];
			// if (skillId) {
			// 	theGunData.skill[bytes.id - 1] = bytes.level
			// } else {
			// 	theGunData.skill.push(bytes.level);
			// }
			if (bytes.id != null && bytes.level != null) {
				theGunData.skill.set(bytes.id, bytes.level);
			}
		}
		GameGlobal.MessageCenter.dispatch(TheGunEvt.THEGUN_DATAUPDATE_MSG);
		GameGlobal.MessageCenter.dispatch(TheGunEvt.THEGUN_SKILLDATAUPDATE_MSG);
	}

	/**获取圣枪丹药信息 */
	private getTheGunDanYaoEat(bytes: Sproto.sc_holygun_eatdanyao_request) {
		let theGunModel = TheGunModel.getInstance;
		let theGunData: TheGunData = theGunModel.theGunDic.get(bytes.roleid);
		if (theGunData) {
			theGunData.danYao.set(bytes.id, bytes.num);
		}
		// ViewManager.ins().close(MountDanYaoUseWin);
		GameGlobal.MessageCenter.dispatch(TheGunEvt.THEGUN_DANYAO_MSG);
		GameGlobal.MessageCenter.dispatch(TheGunEvt.THEGUN_DATAUPDATE_MSG);
	}

	/**获取圣枪升阶奖励信息 */
	private getTheGunGetaward(bytes: Sproto.sc_holygun_achievement_request) {
		let theGunModel = TheGunModel.getInstance;
		theGunModel.achieve = bytes.data;
		GameGlobal.MessageCenter.dispatch(TheGunEvt.THEGUN_AWARD_MSG);
	}




	/**圣枪初始化信息 */
	public sendTheGunInitMsg() {
		let rsp = new Sproto.cs_holygun_init_request;
		this.Rpc(C2sProtocol.cs_holygun_init, rsp);
		this.sendTheGunInitAward();
	}
	/**圣枪升级 */
	public sendTheGunLvUp(roleId: number) {
		let rsp = new Sproto.cs_holygun_upscala_request;
		rsp.roleid = roleId;
		this.Rpc(C2sProtocol.cs_holygun_upscala, rsp);
	}

	/**圣枪升星信息 */
	public sendTheGunStarUp(roleId: number, isAuto: boolean) {
		let rsp = new Sproto.cs_holygun_upstar_request;
		rsp.roleid = roleId;
		rsp.isAuto = isAuto;
		this.Rpc(C2sProtocol.cs_holygun_upstar, rsp);
	}

	/**圣枪技能升级信息 */
	public sendTheGunSkillUp(roleId: number, skillid: number) {
		let rsp = new Sproto.cs_holygun_upskill_request;
		rsp.roleid = roleId;
		rsp.id = skillid;
		this.Rpc(C2sProtocol.cs_holygun_upskill, rsp);
	}

	/**吃丹药 */
	public sendTheGunEatDanYao(roleId: number, itemid: number, count: number) {
		let rsp = new Sproto.cs_holygun_eatdanyao_request;
		rsp.roleid = roleId;
		rsp.id = itemid;
		rsp.num = count;
		this.Rpc(C2sProtocol.cs_holygun_eatdanyao, rsp);
	}

	/**领奖 */
	public sendTheGunGetAward(id: number) {
		let rsp = new Sproto.cs_holygun_reward_request;
		rsp.id = id;
		this.Rpc(C2sProtocol.cs_holygun_reward, rsp);
	}

	/**进阶领奖初始 */
	public sendTheGunInitAward() {
		let rsp = new Sproto.cs_holygun_achievement_request;
		this.Rpc(C2sProtocol.cs_holygun_achievement, rsp);
	}
}
window["TheGunSproto"] = TheGunSproto