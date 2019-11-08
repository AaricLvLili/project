class Checker {
	public static YUNBAO_FRAME = 2

	public static Level(zsLevel: number, level: number, showTip: boolean = true): boolean {
		let lv = GameLogic.ins().actorModel.level
		let zsLv = UserZs.ins().lv
		if (zsLevel && zsLevel > zsLv) {
			if (showTip) {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100219)//转生等级不足
			}
			return false
		}
		if (level && level > lv) {
			if (showTip) {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100220)//等级不足
			}
			return false
		}
		return true
	}

	public static Money(type: MoneyConst, value: number, showTip: boolean | number = true, showTitle = null): boolean {
		let actorValue = 0
		let actor = GameLogic.ins().actorModel
		let errorTip = null
		switch (type) {
			case MoneyConst.yuanbao:
				actorValue = actor.yb
				errorTip = GlobalConfig.jifengTiaoyueLg.st100008;//"钻石不足"
				break

			case MoneyConst.gold:
				actorValue = actor.gold
				errorTip = GlobalConfig.jifengTiaoyueLg.st100222;//"金币不足"
				break
			case MoneyConst.XIUWEI:
				actorValue = UserZs.ins().exp;
				errorTip = GlobalConfig.jifengTiaoyueLg.st100223;//"修为不足"
				break
			case MoneyConst.COUPON:
				actorValue = actor.coupon;
				errorTip = GlobalConfig.jifengTiaoyueLg.st102103;//"点券不足"
				break
			default:
				console.warn("未定义的货币类型", type)
				break
		}
		if (value > actorValue) {
			if (showTip == true) {
				UserTips.ins().showTips(errorTip)
				if (type == MoneyConst.COUPON)
					UserWarn.ins().setBuyGoodsWarn(type);
			} else if (type == MoneyConst.yuanbao && showTip == Checker.YUNBAO_FRAME) {
				if (StartGetUserInfo.isOne) {
					UserTips.ErrorTip(GlobalConfig.jifengTiaoyueLg.st100224);//针对单机处理 材料不足
				}
				else
					Checker.YunbaoTip(showTitle)
			}
			return false
		}
		return true
	}

	public static YunbaoTip(showTitle: string = null) {
		let chargeTip = ""
		let state = Recharge.ins().ToDayRechargeState()
		if (state != 0) {
			chargeTip = "\n" + GlobalConfig.jifengTiaoyueLg.st100231 + "：", Color.Blue
			if (Recharge.ins().getFirstRechargeState()) {//state == 1
				chargeTip += StringUtils.addColor(GlobalConfig.jifengTiaoyueLg.st100230, Color.Yellow)
			} else if (state == 2) {
				chargeTip += StringUtils.addColor(GlobalConfig.jifengTiaoyueLg.st100229, Color.Yellow)
			} else {
				chargeTip = ""
			}
		}
		let title = showTitle || GlobalConfig.jifengTiaoyueLg.st100228;
		WarnWin.show(TextFlowMaker.generateTextFlow(title + chargeTip), () => {
			ViewManager.ins().open(ChargeFirstWin);
			ViewManager.ins().close(ActivityType2003ResultPanel);
		}, this, null, null, "sure", {
				btnName: state == 1 ? GlobalConfig.jifengTiaoyueLg.st100226 : GlobalConfig.jifengTiaoyueLg.st100227,
				title: GlobalConfig.jifengTiaoyueLg.st100221
			})
	}

	public static OpenDay(day: number, showTip = true): boolean {
		if (GameServer.serverOpenDay < day) {
			if (showTip) {
				UserTips.ErrorTip(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100225, [day]))
			}
			return false
		}
		return true
	}
}
window["Checker"] = Checker