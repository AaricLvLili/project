class GameSceneView extends BaseEuiView {
	public constructor() {
		super();
		//this.imgMask.visible =false
	}

	map: MapView;

	pkBossBtn: eui.Button;
	escBtn: eui.Button;
	input: eui.EditableText;
	stateImg: eui.Image;
	miniChat: MiniChatPanel;

	skillWordImg: eui.Image

	public initUI() {
		super.initUI();
		this.skinName = "GameFightSceneSkin"
		this.touchEnabled = false;
		this.map = new MapView;
		this.map.initMap();
		this.addChildAt(this.map, 0);
		this.pkBossBtn.touchEnabled = true;
		this.pkBossBtn.visible = false;
		this.input = new eui.EditableText;
		this.input.visible = false;
		this.input.text = "";
		this.input.size = 20;
		this.input.prompt = "点我输入命令1645";
		this.input.promptColor = 0xff0000;
		this.input.textColor = 0xff0000;
		this.input.x = 68;
		this.input.y = 425;
		this.addChild(this.input);
		this.escBtn.visible = false;
		// this.miniChat.y = StageUtils.ins().getHeight() - 162;
		this.miniChat.visible = StartGetUserInfo.isOne == false;//针对单机过审核
		this.escBtn.label = GlobalConfig.jifengTiaoyueLg.st101397;
	};
	public open(...param: any[]) {
		super.open(param);
		this.miniChat.name = "miniChat";
		GameGlobal.dressmodel.sendDressInfoReq();//装扮信息查询
		MessageCenter.addListener(GameLogic.ins().postHookStateChange, this.upDataGuajiState, this);
		this.pkBossBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.escBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		// var len = SubRoles.ins().subRolesLen;
		// for (var i = 0; i < len; i++) {
		// 	let role = EntityManager.ins().getMainRole(i)
		// 	if (role && role.continuePlay) {
		// 		role.continuePlay();
		// 	}
		// }
		this.miniChat.openPanel && this.miniChat.openPanel()

		this.observe(MessageDef.GAME_SCENE_WORD, this._ShowSkillWord)
	};
	public close(...param: any[]) {
		super.close(param);
		this.pkBossBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.escBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		MessageCenter.ins().removeAll(this);
		this.miniChat.closePanel && this.miniChat.closePanel()
	};
	public upDataGuajiState(value) {
		if (GameMap.fubenID != 0 && value == 1) {
			value = 0;
		}
		this.stateImg.source = value ? "comp_133_31_01_png" : "";
	};
	public onTap(e) {
		switch (e.currentTarget) {
			case this.pkBossBtn:
				GameLogic.ins().startPkBoss();
				break;
			case this.escBtn:
				//关闭倒计时
				var obj = <UIView2>ViewManager.ins().getView("UIView2");
				if (obj != null) {
					obj.clearFB();//关闭倒计时
				}
				//如果主动退出的是关卡boss，则关闭自动挑战
				if (GameMap.fbType == UserFb.FB_TYPE_GUANQIABOSS)
					PlayFun.ins().closeAuto();
				//如果主动退出的是转生boss，则关闭自动复活
				if (ZsBoss.ins().isZsBossFb(GameMap.fubenID) || GameMap.IsWorldBoss())
					ZsBoss.ins().autoClear = false;
				if (GuildWar.ins().checkinAppoint()) {
					ViewManager.ins().open(GuileWarReliveWin, 3)
					return
				}
				if (GameMap.IsPublicBoss()) {
					let cdata = new Sproto.cs_raid_exit_raid_request();
					cdata.fbType = UserFb.FB_TYPE_PUBLIC_BOSS;
					GameSocket.ins().Rpc(C2sProtocol.cs_raid_exit_raid, cdata);
					return;
				}
				if (GameMap.IsHomeBoss()) {
					let cdata = new Sproto.cs_raid_exit_raid_request();
					cdata.fbType = UserFb.FB_TYPE_HOME_BOSS;
					GameSocket.ins().Rpc(C2sProtocol.cs_raid_exit_raid, cdata);
					return;
				}
				if (GameMap.IsSyBoss()) {
					let cdata = new Sproto.cs_raid_exit_raid_request();
					cdata.fbType = UserFb.FB_TYPE_SYBOSS;
					GameSocket.ins().Rpc(C2sProtocol.cs_raid_exit_raid, cdata);
					return;
				}
				if (GameMap.IsTeamFb()) {
					TeamFbSproto.ins().sendQuitTeam();
					UserFb.ins().sendExitFb();
				}
				else {
					UserFb.ins().sendExitFb();
				}

				break;
		}
	};

	private _ShowSkillWord(imgName) {
		if (this.skillWordImg) {
			egret.Tween.removeTweens(this.skillWordImg)
		}
		if (imgName) {
			this.skillWordImg.source = null
			this.skillWordImg.source = imgName
			this.skillWordImg.visible = true
			var tween = egret.Tween.get(this.skillWordImg)
			this.skillWordImg.scaleX = 3
			this.skillWordImg.scaleY = 3
			this.skillWordImg.alpha = 1
			this.skillWordImg.y = 250
			tween.to({
				y: 250,
				scaleX: 1,
				scaleY: 1
			}, 200).wait(500).to({
				alpha: 0
			}, 400).call(() => {
				egret.Tween.removeTweens(this.skillWordImg)
			});
		}
	}

	public destoryView() {
		//场景自动释放
	};
}

ViewManager.ins().reg(GameSceneView, LayerManager.Game_Bg);
window["GameSceneView"] = GameSceneView