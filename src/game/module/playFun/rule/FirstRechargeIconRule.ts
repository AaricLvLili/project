class FirstRechargeIconRule extends RuleIconBase {

	public constructor(t) {
		super(t)
		this.firstTap = !0
		this.updateMessage = [MessageDef.UPDATE_FIRSTRECHARGE]
		this._groupEff = t.getChildByName("eff")
	}
	private img = new eui.Image();

	checkShowIcon() {
		// DisplayUtils.removeFromParent(this._mc)
		// this._mc = null
		if (WxSdk.ins().isHidePay()) {
			return false;
		}
		if (StartGetUserInfo.isUsa || StartGetUserInfo.isOne)//针对渠道过审核屏蔽
			return false;

		var data = GameGlobal.firstRechargeData;


		if (data && data.statau) {
			this.tar.icon = GameServer.serverMergeTime > 0 ? "fun_hfsc_png" : "fun_sc_png";
			this._initMc("eff_fun_sc");
			this.img.visible = true;
			return true
		} else {
			if (Recharge.IsShowDayRecharge()) {
				this._initMc("eff_fun_sc")
				this.tar.icon = "fun_mrcz_png"
				this.img.visible = false;
				return true
			}
		}

		return false


		// if (StartGetUserInfo.isUsa || StartGetUserInfo.isOne)//针对渠道过审核屏蔽
		// 	return false;

		// var data = GameGlobal.rechargeData[0];
		// if (!data) {
		// 	return false
		// }
		// this.tar.icon = ''
		// let eff 
		// if (GameGlobal.rechargeData[0].isFirst) {
		// 	this.tar.icon = GameServer.serverMergeTime > 0 ? "fun_hfsc_png" : "fun_sc_png";
		// 	eff = "eff_fun_sc";
		// } else {
		// 	this.tar.icon = "fun_mrcz_png";
		// 	eff = "eff_fun_mrcz";
		// }

		// if (this._mc == null) {
		// 	this._mc = new MovieClip
		// 	this._mc.x = this._groupEff.width / 2
		// 	this._mc.y = this._groupEff.height / 2
		// 	this._mc.scaleX = this._mc.scaleY = .65
		// 	this._groupEff.addChild(this._mc)
		// 	this._mc.loadUrl(ResDataPath.GetUIEffePath(eff), true, -1);
		// }

		// let config = Recharge.ins().GetConfig()
		// for (let key in config) {
		// 	if (!BitUtil.Has(data.isAwards, config[key].index)) {
		// 		return true
		// 	}
		// }
		// DisplayUtils.removeFromParent(this._mc)
		// this._mc = null
		// return false
	}
	private _initMc(name: string): void {
		if (this._mc == null) {
			this._mc = new MovieClip//ObjectPool.ins().pop("MovieClip")
			this._mc.x = this._groupEff.width / 2
			this._mc.y = this._groupEff.height / 2
			this._mc.scaleX = this._mc.scaleY = .65
			this._groupEff.addChild(this._mc)
			this._mc.loadUrl(ResDataPath.GetUIEffePath(name), true, -1);
			this.img.source = "comp_20_33_01_png";
			this.img.right = 0;
			this.img.top = 0;
			this._groupEff.parent.addChild(this.img);
		}
	}

	checkShowRedPoint() {
		let firstData = GameGlobal.firstRechargeData;

		if (firstData && firstData.statau) {
			return firstData.awards == AwardStatus.awaitrReceive
		} else {
			var data = GameGlobal.rechargeData[0];
			if (!data) {
				return 0
			}
			let config = Recharge.ins().GetConfig()
			for (let key in config) {
				let configData = config[key]
				if (data.num >= configData.pay && !BitUtil.Has(data.isAwards, configData.index)) {
					return 1
				}
			}
			return 0
		}


		// var data = GameGlobal.rechargeData[0];
		// if (!data) {
		// 	return 0
		// }
		// let config = Recharge.ins().GetConfig()
		// for (let key in config) {
		// 	let configData = config[key]
		// 	if (data.num >= configData.pay && !BitUtil.Has(data.isAwards, configData.index)) {
		// 		return 1
		// 	}
		// }
		// return 0
	}

	getEffName(e) {
		//return this.DefEffe(e)
	}

	tapExecute() {
		if (FirstRechargeIconRule.EnterFirstRecharge()) {
			this.firstTap = false
			this.update()
		}
	}

	public static EnterFirstRecharge() {
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
		return false
	}
}
window["FirstRechargeIconRule"] = FirstRechargeIconRule