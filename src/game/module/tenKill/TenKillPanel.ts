class TenKillPanel extends BaseView implements ICommonWindowTitle {

	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st100885;
	public m_OpenBtn: eui.Button;
	public m_OpenNumLab: eui.Label;
	public m_ItemNumLab: eui.Label;
	public m_GuankaLab: eui.Label;

	public m_BuffBtn: eui.Button;

	public m_ConditionGroup: eui.Group;
	public m_GetItemImg: eui.Label;
	public m_BotTipsLab: eui.Label;
	public m_WinCntGroup: eui.Group;
	public m_WinCntLab: eui.Label;
public m_Lan1:eui.Label;
public m_RuleBtn:eui.Group;

	constructor() {
		super();
		this.skinName = "TenKillPanelSkin";
		this.name = GlobalConfig.jifengTiaoyueLg.st100885;
		this.m_Lan1.text=GlobalConfig.jifengTiaoyueLg.st100894;
		this.m_GetItemImg.text=GlobalConfig.jifengTiaoyueLg.st100895;
		this.m_OpenBtn.label=GlobalConfig.jifengTiaoyueLg.st100892;
	}

	open(...param: any[]) {
		UIHelper.SetLinkStyleLabel(this.m_GetItemImg);
		this.addViewEvent();
		TenKillSproto.ins().sendGetTenKillBuffList();
		TenKillSproto.ins().sendGetTenKillMsg();
	}
	close() {
		this.removeViewEvent();
	}

	private addViewEvent() {
		this.m_OpenBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickOpen, this);
		MessageCenter.ins().addListener(MessageDef.TENKILLBUFF_UPDATE, this.updateBuffMsg, this);
		MessageCenter.ins().addListener(MessageDef.TENKILL_PANEL_UPDATE, this.updatePanelMsg, this);
		this.m_BuffBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickBuffBtn, this);
		this.m_RuleBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickRuleBtn, this)
		this.m_GetItemImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickGetItem, this);
	}

	private removeViewEvent() {
		this.m_OpenBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickOpen, this);
		MessageCenter.ins().removeListener(MessageDef.TENKILLBUFF_UPDATE, this.updateBuffMsg, this);
		MessageCenter.ins().removeListener(MessageDef.TENKILL_PANEL_UPDATE, this.updatePanelMsg, this);
		this.m_BuffBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickBuffBtn, this);
		this.m_RuleBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickRuleBtn, this)
		this.m_GetItemImg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickGetItem, this);
	}


	private onClickGetItem() {
		let config = GlobalConfig.ins("ShiLianShaCommonConfig");
		let itemId = config.costItem.id;
		UserWarn.ins().setBuyGoodsWarn(itemId);
	}

	private onClickOpen() {
		let tenKillModel: TenKillModel = TenKillModel.getInstance;
		if (tenKillModel.useCnt >= 1 || tenKillModel.winCnt > 0) {
			if (tenKillModel.isBuyBuff() || tenKillModel.winCnt > 0) {
				TenKillSproto.ins().sendGetTenKillToGo();
			} else {
				WarnWin.show(GlobalConfig.jifengTiaoyueLg.st100886, function () { TenKillSproto.ins().sendGetTenKillToGo(); }, this);
			}
		} else {
			let config = GlobalConfig.ins("ShiLianShaCommonConfig");
			let itemId = config.costItem.id;
			let costItemNum = config.costItem.count;
			let itemType = config.costItem.type;
			let itemNum = UserBag.ins().getBagGoodsCountById(0, itemId);
			if (itemNum >= costItemNum) {
				// let itemConfig = GlobalConfig.ins("ItemConfig");
				// WarnWin.show("是否消耗" + costItemNum + "个" + itemConfig[itemId].name + "?", function () {
				if (tenKillModel.isBuyBuff()) {
					TenKillSproto.ins().sendGetTenKillToGo();
				} else {
					WarnWin.show(GlobalConfig.jifengTiaoyueLg.st100886, function () { TenKillSproto.ins().sendGetTenKillToGo(); }, this);
				}
				// }, this);
			} else {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100887);
			}
		}
	}

	private updateBuffMsg() {

	}

	private updatePanelMsg() {
		let config = GlobalConfig.ins("ShiLianShaCommonConfig");
		if (config) {
			let itemId = config.costItem.id;
			let costItemNum = config.costItem.count;
			let itemType = config.costItem.type;
			let itemNum = UserBag.ins().getBagGoodsCountById(0, itemId);
			this.m_ItemNumLab.text = itemNum + "/" + costItemNum;
			this.m_OpenNumLab.text = GlobalConfig.jifengTiaoyueLg.st100356 + "（" + TenKillModel.getInstance.useCnt + "/" + config.num + "）" + GlobalConfig.jifengTiaoyueLg.st100532;
		}
		let winCnt = TenKillModel.getInstance.winCnt;
		this.m_GuankaLab.text = GlobalConfig.jifengTiaoyueLg.st100373 + (winCnt + 1) + GlobalConfig.jifengTiaoyueLg.st100369;
		if (winCnt > 0) {
			this.m_ConditionGroup.visible = false;
			this.m_WinCntGroup.visible = true;
			this.m_BotTipsLab.text = "";
			this.m_OpenBtn.label = GlobalConfig.jifengTiaoyueLg.st100888;
			if (winCnt < config.maxFb) {
				this.m_WinCntLab.textFlow = <Array<egret.ITextElement>>[
					{ text: GlobalConfig.jifengTiaoyueLg.st100889 },
					{ text: winCnt + "/" + config.maxFb, style: { "textColor": 0x00FF3F } },
				]
			} else {
				this.m_WinCntLab.textFlow = <Array<egret.ITextElement>>[
					{ text: GlobalConfig.jifengTiaoyueLg.st100890 },
				]
			}
		} else {
			this.m_ConditionGroup.visible = true;
			this.m_WinCntGroup.visible = false;
			this.m_BotTipsLab.text = GlobalConfig.jifengTiaoyueLg.st100891;
			this.m_OpenBtn.label = GlobalConfig.jifengTiaoyueLg.st100892;
		}
	}

	private onClickBuffBtn() {
		let tenKillModel: TenKillModel = TenKillModel.getInstance;
		let isBuy = tenKillModel.isBuyBuff();
		let buffList: Sproto.buff[] = tenKillModel.buffList.values
		let tips: string;
		let config = GlobalConfig.ins("PropertyLibraryConfig");
		if (isBuy) {
			tips = "<font color='#00FF3F'>" + config[1].tips2 + "</font>";
			WarnWin.show(tips, null, this, null, null, "sure");
		}
		let configCommon = GlobalConfig.ins("ShiLianShaCommonConfig");
		if (!isBuy) {
			if (tenKillModel.winCnt > 0) {
				ViewManager.ins().open(ZsBossRuleSpeak, 28, "");
			} else {
				tips = "<font color='#f27d27'>" + config[1].tips1 + "</font>\n" + LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100893, [configCommon.costAttr]);
				WarnWin.show(tips, function () {
					let yb: number = GameLogic.ins().actorModel.yb;
					if (yb < configCommon.costAttr) {
						UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100008);
					} else {
						TenKillSproto.ins().sendGetTenKillBuyBuff(config[1].value[0].type);
					}
				}, this);
			}
		}
	}

	private onClickRuleBtn() {
		ViewManager.ins().open(ZsBossRuleSpeak, 28, "");
	}

	public static openCheck() {
		return Deblocking.Check(DeblockingType.TYPE_34);
	}

	public CheckRedPoint() {
		return TenKillModel.getInstance.checkRedPoint();
	}


	UpdateContent() {

	}

}
window["TenKillPanel"] = TenKillPanel