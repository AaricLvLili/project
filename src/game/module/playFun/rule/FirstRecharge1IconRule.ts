class FirstRecharge1IconRule extends RuleIconBase {
	private groupEff:eui.Group
	private mc:MovieClip
    public constructor(t) {
        super(t)
        this.firstTap = !0
        this.updateMessage = [MessageDef.UPDATE_RECHARGE,MessageDef.UPDATE_FIRSTRECHARGE]
        this.groupEff = t.getChildByName("eff")
    }
    checkShowIcon() {
        DisplayUtils.removeFromParent(this.mc)
		this.mc = null
		if(WxSdk.ins().isHidePay())
		{
			return false;
		}
		if (StartGetUserInfo.isUsa || StartGetUserInfo.isOne)//针对渠道过审核屏蔽
			return false;

		var data = GameGlobal.rechargeData[0];
		if (!data) {
			return false
		}

		// if(!FunOpenMgr.IsDefaultShow(FUNCTION_ID.TYPE_69))
		// 	return false;
			
		//this.tar.icon = "fun_mrcz_png";
       

		let config = Recharge.ins().GetConfig()
        for (let key in config) {
            if (!BitUtil.Has(data.isAwards, config[key].index)) {
                if (this.mc == null) {
                    this.mc = new MovieClip//ObjectPool.ins().pop("MovieClip")
                    this.mc.x = this.groupEff.width / 2
                    this.mc.y = this.groupEff.height / 2
                    this.mc.scaleX = this.mc.scaleY = .65
                    this.groupEff.addChild(this.mc)
                    this.mc.loadUrl(ResDataPath.GetUIEffePath("eff_fun_sc"), true, -1);
                }
                return true
            }
		}
		return false
    }

    checkShowRedPoint() {

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

    getEffName(e) {
       // return this.DefEffe(e)
    }

    tapExecute() {
       if (FirstRecharge1IconRule.EnterFirstRecharge()) {
			this.firstTap = false
			this.update()
		}
    }

    public static EnterFirstRecharge() {
      // if (FunOpenMgr.checkFunIsOpen(FUNCTION_ID.TYPE_69)) {
			ViewManager.ins().open(Recharge1Win)
			return true
		//}
    }
}
window["FirstRecharge1IconRule"]=FirstRecharge1IconRule