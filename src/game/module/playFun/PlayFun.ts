var __ref_field__: any = Guild

class PlayFun extends BaseSystem {
	//功能提示数据
	private moduleProArr = [];
	//功能红点数据
	private redPointList: Array<RedPointInfo> = [];
	//跳转红点数据
	private redNavigateList = [];
	public constructor() {
		super();

		//待改
		MessageCenter.addListener(UserFb.ins().postWaveChange, this.updateAutoPk, this);
		//this.regNetMsg(S2cProtocol.sc_set_is_open_payfrist, this.autoTimeer);
		this.regNetMsg(S2cProtocol.sc_public_boss_reborn_notice, this.sc_public_boss_reborn_notice);
		//功能提示
		this.regNetMsg(S2cProtocol.sc_funopen_res, this.modulePromptfun);
		GameGlobal.MessageCenter.addListener(MessageDef.MODULE_PROMPT_CLOSE, this.openModulePrompt, this);
		this.regNetMsg(S2cProtocol.sc_func_tips, this.redPoint)
		this.regNetMsg(S2cProtocol.sc_exten_info, this.redNavigate)
	}
	//功能提示数据返回
	private modulePromptfun(data: Sproto.sc_funopen_res_request): void {
		if (data) {
			this.moduleProArr = this.moduleProArr.concat(data.id);
			this.openModulePrompt()
		}
	}
	//打开功能提示
	private openModulePrompt(e = null): void {
		let len = this.moduleProArr.length;
		if (len > 0 && !GuideUtils.ins().isShow()) {
			ViewManager.ins().open(ModulePrompt, this.moduleProArr.shift());
		}

	}

	public static ins(): PlayFun {
		return super.ins()
	}

	//0 倒计时没有结束  1 倒计时结束还未打开过  2已经打开过
	public autoOpenShouChong = 0;
	// public autoTimeer(rsp: Sproto.sc_set_is_open_payfrist_request) {
	// 	if (!rsp.value && !GameServer.serverMergeTime && PlayFun.ins().autoOpenShouChong == 0)
	// 		TimerManager.ins().doTimer(300000, 1,
	// 			() => {
	// 				GameGlobal.MessageCenter.dispatch(MessageDef.AUTO_OPENSHOUCHONG_COMPLET)
	// 				PlayFun.ins().autoOpenShouChong = 1;
	// 			}, this);
	// }
	public isCheckTimering = false;
	public autoTimeer() {
		if (Recharge.ins().getFirstRechargeState() && !GameServer.serverMergeTime && PlayFun.ins().autoOpenShouChong == 0 && !this.isCheckTimering) {
			this.removeAutoTimer();
			TimerManager.ins().doTimer(300000, 1, this._timerOutComplete, this);
			this.isCheckTimering = true
		}
	}

	private _timerOutComplete(): void {
		GameGlobal.MessageCenter.dispatch(MessageDef.AUTO_OPENSHOUCHONG_COMPLET)
		PlayFun.ins().autoOpenShouChong = 1;
		this.removeAutoTimer()
	}
	public removeAutoTimer(): void {
		TimerManager.ins().remove(this._timerOutComplete, this);
	}

	public isCheckAnimTimering = false;
	public autoAnimTimeer() {
		let isOpen = 0;
		let config = GlobalConfig.ins("ChongZhiAdvertisementConfig");
		let chongZhiConfig: any;
		if (GameServer.serverMergeTime > 0) {
			isOpen = config[2].effective
			chongZhiConfig = config[2];
		} else {
			isOpen = config[1].effective;
			chongZhiConfig = config[1];
		}
		if (Recharge.ins().getFirstRechargeState() && isOpen && chongZhiConfig && !this.isCheckAnimTimering) {
			this.removeAnimTime();
			TimerManager.ins().doTimer(chongZhiConfig.time * 1000, 1, this.sendFirstPlayAnim, this);
			this.isCheckAnimTimering = true
		}
	}

	private sendFirstPlayAnim() {
		if (!Recharge.ins().getFirstRechargeState()) {
			this.removeAnimTime();
			return;
		}
		let isOpen = 0;
		let config = GlobalConfig.ins("ChongZhiAdvertisementConfig");
		let chongZhiConfig: any;
		if (GameServer.serverMergeTime > 0) {
			isOpen = config[2].effective
			chongZhiConfig = config[2];
		} else {
			isOpen = config[1].effective;
			chongZhiConfig = config[1];
		}
		if (Recharge.ins().getFirstRechargeState() && isOpen && chongZhiConfig) {
			this.removeSecAnimTime();
			TimerManager.ins().doTimer(chongZhiConfig.rate * 1000, 0, this.sendSedPlayAnim, this);
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.AUTO_OPENSHOUCHONGANIM_COMPLET)
	}

	private removeAnimTime() {
		TimerManager.ins().remove(this.sendFirstPlayAnim, this);
	}

	private sendSedPlayAnim() {
		if (!Recharge.ins().getFirstRechargeState()) {
			this.removeSecAnimTime();
			return;
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.AUTO_OPENSHOUCHONGANIM_COMPLET);
	}

	private removeSecAnimTime() {
		TimerManager.ins().remove(this.sendSedPlayAnim, this);
	}



	public index = 0;
	public noTips = false;
	/** 通知全民BOSS刷新弹窗提示*/
	private sc_public_boss_reborn_notice(rsp: Sproto.sc_public_boss_reborn_notice_request): void {
		this.index = rsp.index;
		GameGlobal.MessageCenter.dispatch(MessageDef.PUBLIC_BOSS_REBIRTHT_TIPS)
	}

	public sendAutoOpen() {
		PlayFun.ins().autoOpenShouChong = 2;

		let req = new Sproto.cs_set_is_open_payfrist_request()
		req.value = 1;
		this.Rpc(C2sProtocol.cs_set_is_open_payfrist, req)
	}

	//关闭自动挑战关卡boss
	public closeAuto() {
		var view: PlayFunView = <PlayFunView>ViewManager.ins().getView(PlayFunView);
		if (view)
			view.autoPkBoss.selected = false;
	};

	public upDataWillBoss() {
		var view: PlayFunView = <PlayFunView>ViewManager.ins().getView(PlayFunView);
		if (view)
			view.upDataWillBoss();
	};


	private chaptersConfig: any;
	public updateAutoPk() {
		if (!GameMap.IsNoramlLevel()) {
			console.log("正在挑战其它关卡，取消自动挂机挂机关卡挑战")
			return
		}
		if (GuanQiaModel.getInstance.checkIsCanGoNextLayer()) {
			return;
		}
		if (this.chaptersConfig == null)
			this.chaptersConfig = GlobalConfig.ins("ChaptersConfig");

		var gqID = UserFb.ins().guanqiaID;
		if (!this.chaptersConfig[gqID]) {
			// WarnWin.show("内存优化只保留500关数据,没有配置信息,需要重新登录加载\n当前关卡数：" + UserFb.ins().guanqiaID, function () {
			// 	window.location.reload();
			// }, this, null, null, "sure");
			// return;
		}
		var m = this.chaptersConfig[gqID].bossNeedWave;
		var v = Math.min(UserFb.ins().killMonsterCount, m);

		var view: PlayFunView = <PlayFunView>ViewManager.ins().getView(PlayFunView);
		if (view && view.autoPkBoss.selected && v >= m) {
			if (UserBag.ins().getSurplusCount() < UserBag.BAG_ENOUGH) {
				view.autoPkBoss.selected = false;
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101919);
			}
			else {
				GameLogic.ins().startPkBoss();
			}
		}
	};
	public AWYShowQrCode(s) {
		// var view: PlayFunView = <PlayFunView>ViewManager.ins().getView(PlayFunView);
		// if (view)
		//     view.showAWYQrCode(s);
	};

	//功能红点
	private redPoint(rsp: Sproto.sc_func_tips_request): void {
		var datas = rsp.data;
		if (datas == undefined)
			return;

		for (let info of datas) {
			if (this.redPointList[info.id] == null)
				this.redPointList[info.id] = new RedPointInfo();
			this.redPointList[info.id].parse(info);
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.REDPOINT_STATE)
	}

	private redNavigate(rsp: Sproto.sc_exten_info_request) {
		PlayFun.ins().redNavigateList = rsp.list; //登录的时候，如果没有数据，后端不发这条协议过来，如果传null过来说明是凌晨重置
		MessageCenter.ins().dispatch(MessageDef.REDPOINT_NAVIGATE_UPDATE);
	}

	public getRedNavigetList() {
		return PlayFun.ins().redNavigateList;
	}

	/**#获取功能红点*/
	public getFuncRedById(id: number, roleId: number = null) {
		var redInfo = this.redPointList[id];
		if (redInfo == undefined || redInfo.state == undefined)
			return false;

		if (roleId != null) {
			return redInfo.state.indexOf(roleId) != -1;
		}
		return redInfo.state.length > 0;
	}
}

MessageCenter.compile(PlayFun);
window["PlayFun"] = PlayFun