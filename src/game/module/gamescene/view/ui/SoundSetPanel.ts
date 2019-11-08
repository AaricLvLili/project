class SoundSetPanel extends BaseEuiPanel {
	public constructor() {
		super()
	}

	private cbAutoSound0: eui.CheckBox;
	private cbAutoSound1: eui.CheckBox;
	private cbAutoSound2: eui.CheckBox;
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;
	public m_Lan3: eui.Label;
	public m_Lan4: eui.Label;
	private exitBtn: eui.Button;

	initUI() {
		super.initUI();
		this.skinName = "SoundSetPanelSkin";

		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100344;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st100345;
		this.m_Lan3.text = GlobalConfig.jifengTiaoyueLg.st100346;

		if (SdkMgr.currSdk == SdkMgr.P_TYPE_8) {/////玩吧需要显示openid
			this.m_Lan4.visible = true;
			this.m_Lan4.text = h5_sdk.Sdk_8.openid;
		}
		if (SdkMgr.currSdk == SdkMgr.P_TYPE_1 && StartGetUserInfo.channelId2 == "32") {///应用宝显示退出按钮
			this.exitBtn.visible = true;
		}
	}

	public open() {
		this.m_bg.init(`SoundSetPanel`, GlobalConfig.jifengTiaoyueLg.st100343)
		this.cbAutoSound0.addEventListener(egret.Event.CHANGE, this.cbAutoSoundChange, this);
		this.cbAutoSound0.selected = SoundSetPanel.getSoundLocalData("soundBg");

		this.cbAutoSound1.addEventListener(egret.Event.CHANGE, this.cbAutoSoundChange, this);
		this.cbAutoSound1.selected = SoundSetPanel.getSoundLocalData("skillSoundEff");

		this.cbAutoSound2.addEventListener(egret.Event.CHANGE, this.cbAutoSoundChange, this);
		this.cbAutoSound2.selected = SoundSetPanel.getSoundLocalData("btnSoundEff");

		this.exitBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.exitGame, this);

	}

	public close() {
		this.cbAutoSound0.removeEventListener(egret.Event.CHANGE, this.cbAutoSoundChange, this);
		this.cbAutoSound1.removeEventListener(egret.Event.CHANGE, this.cbAutoSoundChange, this);
		this.cbAutoSound2.removeEventListener(egret.Event.CHANGE, this.cbAutoSoundChange, this);
		this.exitBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.exitGame, this);
	}

	private cbAutoSoundChange(e) {
		switch (e.currentTarget) {
			case this.cbAutoSound0:
				// SoundManager.ins().setBgOn(this.cbAutoSound0.selected);
				if (!this.cbAutoSound0.selected ) {
                   SoundUtils.getInstance().stopAllSound();
				}
				SoundUtils.getInstance().setMusicEnable(this.cbAutoSound0.selected);
				if (this.cbAutoSound0.selected) {
					if (GameMap.IsNoramlLevel()) {
						if (ViewManager.ins().isShow(MainCityView)) {
							SoundUtils.getInstance().playSound(GlobalConfig.soundConfig[3].id)
						} else {
							SoundUtils.getInstance().playSound(GlobalConfig.soundConfig[1].id, -1);
						}
					}
					else {
						SoundUtils.getInstance().playSound(GlobalConfig.soundConfig[2].id, -1);
					}
				}
				LocalStorageData.setItem("soundBg", this.cbAutoSound0.selected ? "1" : "0");
				break;
			case this.cbAutoSound1:
				LocalStorageData.setItem("skillSoundEff", this.cbAutoSound1.selected ? "1" : "0");
				break;
			case this.cbAutoSound2:
				LocalStorageData.setItem("btnSoundEff", this.cbAutoSound2.selected ? "1" : "0");
				break;
		}

	}
	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}

	/**获取缓存的音乐开关数据 */
	public static getSoundLocalData(key: string): boolean {
		let n = parseInt(LocalStorageData.getItem(key));
		if (isNaN(n)) return true;
		return n > 0;
	}

	private exitGame() {
		SdkMgr.loginOut();
	}
}
ViewManager.ins().reg(SoundSetPanel, LayerManager.UI_Popup);
window["SoundSetPanel"] = SoundSetPanel