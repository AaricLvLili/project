class SCAnim extends eui.Component {
	public constructor() {
		super();
		this.skinName = "SCAnimSkin";
	}
	public m_AnimGroup: eui.Group;
	private m_Eff: MovieClip;
	public m_Bg: eui.Image;

	public createChildren() {
		super.createChildren();
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}
	public release() {
		DisplayUtils.removeFromParent(this);
		DisplayUtils.dispose(this.m_Eff);
		this.m_Eff = null;
	}

	public setData() {
		this.visible = true;
		let view = ViewManager.ins().getView(PlayFunView);
		view.addChild(this);
		this.initAnim();
		this.addTime();
	}

	private addTime() {
		this.removTime();
		let time = 0;
		let config = GlobalConfig.ins("ChongZhiAdvertisementConfig");
		if (GameServer.serverMergeTime > 0) {
			time = config[2].lasttime;
		} else {
			time = config[1].lasttime;
		}
		TimerManager.ins().doTimer(time * 1000, 1, this.release, this);
	}

	private removTime() {
		TimerManager.ins().remove(this.release, this);
	}

	// private initEffData() {
	// 	if (!this.m_Eff) {
	// 		this.m_Eff = new MovieClip();
	// 		this.m_Eff.touchEnabled = false;
	// 		this.m_AnimGroup.addChild(this.m_Eff);
	// 		this.m_Eff.x = this.m_AnimGroup.width / 2;
	// 		this.m_Eff.y = this.m_AnimGroup.height / 2;
	// 	}
	// }

	private initAnim() {
		// let config = GlobalConfig.ins("PetBasicConfig");
		// if (GameServer.serverMergeTime > 0) {
		// 	let petId = config.hfpetID;
		// 	let petConfig = GlobalConfig.ins("PetConfig")[petId];
		// 	this.playEff(petConfig.avatar + "_3" + EntityAction.STAND);
		// 	this.m_Bg.source = "comp_183_199_02_png";
		// } else {
		// 	let petId = config.petID;
		// 	let petConfig = GlobalConfig.ins("PetConfig")[petId];
		// 	this.playEff(petConfig.avatar + "_3" + EntityAction.STAND);
		// 	this.m_Bg.source = "comp_183_199_01_png";
		// }
		if (GameServer.serverMergeTime > 0) {
			let petId = GlobalConfig.ins("UniversalConfig").hfpetID;
			let petConfig = GlobalConfig.ins("PetConfig")[petId];
			let name = petConfig.avatar + "_3" + EntityAction.STAND;
			this.m_Eff = ViewManager.ins().createEff(this.m_Eff, this.m_AnimGroup, name, -1, ResAnimType.TYPE2)
		} else {
			let petId = GlobalConfig.ins("UniversalConfig").petID;
			let petConfig = GlobalConfig.ins("PetConfig")[petId];
			let name = petConfig.avatar + "_3" + EntityAction.STAND;
			this.m_Eff = ViewManager.ins().createEff(this.m_Eff, this.m_AnimGroup, name, -1, ResAnimType.TYPE2)
		}
	}
	// private playEff(name: string) {
	// 	this.initEffData();
	// 	this.m_Eff.loadUrl(ResDataPath.GetMonsterBodyPath(name), true, -1, );
	// }

	private onClick() {
		this.release();
		if (GameGlobal.firstRechargeData) {
			if (GameGlobal.firstRechargeData.statau) {
				if (!WxSdk.ins().isHidePay())
					ViewManager.ins().open(Recharge1GetWin)
				return true
			} else {
				if (Recharge.IsShowDayRecharge()) {
					ViewManager.ins().open(Recharge1Win)
					return true
				}
			}

		}
	}
}
window["SCAnim"] = SCAnim