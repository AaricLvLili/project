class MainScene extends BaseScene {

    /**
     * 进入Scene调用
     */
	public onEnter() {
		super.onEnter();
		this.addLayerAt(LayerManager.Game_Bg, 1);
		this.addLayerAt(LayerManager.Game_Main, 2);
		this.addLayer(LayerManager.UI_HUD);
		this.addLayer(LayerManager.UI_USER_INFO);
		this.addLayer(LayerManager.UI_Main);
		this.addLayer(LayerManager.UI_NAVIGATION);
		this.addLayer(LayerManager.UI_Main_2);
		this.addLayer(LayerManager.UI_Popup);
		this.addLayer(LayerManager.UI_Tips);
		this.addLayer(LayerManager.UI_Top);
		Rank.ins().sendGetRankingData(0);
		Rank.ins().sendGetAllPraiseData();
		ViewManager.ins().open(GameSceneView);
		// ViewManager.ins().open(ChatMainUI);

		// //小游戏sdk界面要飘到最上面
		// if (window['wx']) {
		// 	StageUtils.ins().getStage().setChildIndex(LayerManager.SdkLayer, StageUtils.ins().getStage().numChildren - 1);
		// }

		ViewManager.ins().open(UIView1);
		ViewManager.ins().open(UIView1_1);
		ViewManager.ins().open(UIView2);
		ViewManager.ins().open(TipsView);
		// SoundManager.ins().stopBg();
		RoleMgr.ins().hideLabel();
		newAI.ins().init();
		if (GameMap.IsPublicBoss() || GameMap.IsHomeBoss() || GameMap.IsSyBoss() || GameMap.IsZhuanshengBoss() || GameMap.IsGuildBoss() || GameMap.IsGuildWar()
			|| GameMap.IsKfBoss() || GameMap.IsWorldBoss() || GameMap.IsXbBoss() || GameMap.IsHeroBattle() || GameMap.IsGuanQiaBoss() || GameMap.IsTeamFb() || GameMap.IsMaterialFb() || GameMap.IsPersonalBoss() || GameMap.IsCityBoss()) {
			ViewManager.ins().hideUIView(UIView1_1, false);
		}
		else {
			ViewManager.ins().hideUIView(UIView1_1, true);
		}

		var t = egret.setTimeout(() => {
			egret.clearTimeout(t);
			ResMgr.ins().clearLoadingRes();
			//如果是微信小游戏，设置手机保持常亮
			if (SdkMgr.isWxGame()) {
				WxSdk.ins().setKeepScreenOn();
			}
			WxSdk.ins().IsLoinged = true;
		}, this, 5000)
		if (DeviceUtils.isIOS) {
			StageUtils.ins().getStage().addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTap, this);
		}
	};
	private onTap(): void {
		let isPlay = SoundSetPanel.getSoundLocalData("soundBg");
		SoundUtils.getInstance().setMusicEnable(isPlay);
		if (isPlay) {
			SoundUtils.getInstance().setMusicEnable(true);
			if (GameMap.IsNoramlLevel()) {
				if (ViewManager.ins().isShow(MainCityView)) {
					SoundUtils.getInstance().playSound(GlobalConfig.soundConfig[3].id, -1, null, false)
				} else {
					SoundUtils.getInstance().playSound(GlobalConfig.soundConfig[1].id, -1, null, false);
				}
			}
			else {
				SoundUtils.getInstance().playSound(GlobalConfig.soundConfig[2].id, -1, null, false);
			}
		}
		StageUtils.ins().getStage().removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTap, this);
	}

}
window["MainScene"] = MainScene