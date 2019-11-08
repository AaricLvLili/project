class ZsPanel extends BaseView implements ICommonWindowTitle {
	public constructor() {
		super();
		this.skinName = "ZsPanelSkin";
	}

	getBtn: eui.Button;
	curAtt
	nextAtt
	curZsLv
	_totalPower: number

	group
	curAttImg
	curAttBg
	maxTxt

	powerLabel: PowerLabel;
	private m_HelpBtn: eui.Button;
	private consumeValue: eui.Label;
	private curValue: eui.Label;


	infoTxts
	toDays
	items
	btns
	private ZhuanShengConfig;
	private infoTxt0: eui.Label;
	private toDay0: eui.Label;
	private btn0: eui.Button;
	private infoTxt1: eui.Label;
	private toDay1: eui.Label;
	private m_TurnLab1: eui.Label;
	private btn1: eui.Button;
	private infoTxt2: eui.Label;
	private toDay2: eui.Label;
	private m_TurnLab2: eui.Label;
	private btn2: eui.Button;
	private item0: ItemBase;
	private item1: ItemBase;
	private item2: ItemBase;
	private priceIcon1: PriceIcon;
	private priceIcon2: PriceIcon;

	private languageTxt: eui.Label;
	private languageTxt0: eui.Label;
	private languageTxt1: eui.Label;
	private languageTxt2: eui.Label;


	protected childrenCreated(): void {
		super.childrenCreated();

		this.infoTxts = [this['infoTxt0'], this['infoTxt1'], this['infoTxt2']];
		this.toDays = [this['toDay0'], this['toDay1'], this['toDay2']];
		this.items = [this['item0'], this['item1'], this['item2']];
		this.btns = [this['btn0'], this['btn1'], this['btn2']];
		for (var i = 0; i < this.items.length; i++) {
			this.items[i].isShowName(false);
		}
		var reward = new RewardData();
		reward.type = 0;
		reward.id = 0;
		reward.count = 0;
		this.items[0].data = reward;
		this.languageTxt.text = GlobalConfig.jifengTiaoyueLg.st100722 + "：";
		this.languageTxt0.text = GlobalConfig.jifengTiaoyueLg.st100723;
		this.languageTxt1.text = GlobalConfig.jifengTiaoyueLg.st100724 + "：";
		this.languageTxt2.text = GlobalConfig.jifengTiaoyueLg.st100725 + "：";
		this.getBtn.label = GlobalConfig.jifengTiaoyueLg.st100465;
		this.btns[0].label = GlobalConfig.jifengTiaoyueLg.st100726;
	};
	open() {
		this.AddClick(this.getBtn, this.onTap);
		this.AddClick(this.m_HelpBtn, this.onTap);
		this.AddClick(this.btn0, this.onTap);
		this.AddClick(this.btn1, this.onTap);
		this.AddClick(this.btn2, this.onTap);
		this.observe(UserZs.ins().postZsData, this.UpdateContent);
		this.observe(GameLogic.ins().postLevelChange, this.UpdateContent);
	};
	close() {
	};
	onTap(e) {
		switch (e.currentTarget) {
			case this.getBtn:
				var ins = UserZs.ins();
				var config = GlobalConfig.zhuanShengLevelConfig[ins.lv + 1];
				if (!config || ins.exp < config.exp) {
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100223);
					return;
				}
				UserZs.ins().sendZsUpgrade();
				break;
			case this.m_HelpBtn:
				ViewManager.ins().open(ZsBossRuleSpeak, 25, GlobalConfig.jifengTiaoyueLg.st100710);
				break;
			default:
				var index_1 = this.btns.indexOf(e.target);
				if (index_1 > -1) {
					if (index_1 == 0) {
						UserZs.ins().sendGetXiuWei(index_1 + 1);
					}
					else if (this.btns[index_1].label == GlobalConfig.jifengTiaoyueLg.st100711) {
						UserZs.ins().sendGetXiuWei(index_1 + 1);
					}
					else {
						var price = this['priceIcon' + index_1].getPrice();
						// if (GameLogic.ins().actorModel.yb < price) {
						// 	UserTips.ins().showTips(GlobalConfig.languageConfig.st100008);
						// 	return;
						// }
						var config = this.ZhuanShengConfig;
						let itemID: number;
						if (index_1 == 1)
							itemID = config.normalItem;
						else
							itemID = config.advanceItem;
						let storeconfig = ItemStoreConfig.getStoreByItemID(itemID)
						if (Checker.Money(storeconfig.costType, price)) {
							if (this.ZhuanShengConfig == null)
								this.ZhuanShengConfig = GlobalConfig.ins("ZhuanShengConfig");
							let tmp = this.ZhuanShengConfig;
							tmp = index_1 == 1 && tmp.normalItem || tmp.advanceItem
							UserZs.ins().sendGetXiuWei(index_1 + 1, tmp);
						}
					}
				}
		}
	};
	UpdateContent() {
		this.curAtt.lineSpacing = 5;
		this.nextAtt.lineSpacing = 5;
		var ins = UserZs.ins();
		UIHelper.ShowRedPoint(this.getBtn, ins.canUpgrade())
		this.curZsLv.text = ins.lv + GlobalConfig.jifengTiaoyueLg.st100067;
		var config = GlobalConfig.zhuanShengLevelConfig[ins.lv];
		this.curAtt.text = AttributeData.getAttStr(config, 1);
		var objAtts = [];
		for (var k in AttributeData.translate) {
			if (isNaN(config[k]))
				continue;
			var a = new AttributeData;
			a.type = parseInt(AttributeData.translate[k]);
			a.value = config[k];
			objAtts.push(a);
		}
		var len = SubRoles.ins().subRolesLen;
		this._totalPower = UserBag.getAttrPower(objAtts) * len;

		this.powerLabel.text = this._totalPower
		var nextAttConfig = GlobalConfig.zhuanShengLevelConfig[ins.lv + 1];
		if (nextAttConfig) {
			this.nextAtt.text = AttributeData.getAttStr(nextAttConfig, 1);
			let color = ins.exp >= nextAttConfig.exp ? Color.Green : Color.Red;
			this.curValue.textFlow = TextFlowMaker.generateTextFlow(StringUtils.addColor(ins.exp.toString(), color));
			this.consumeValue.text = nextAttConfig.exp + "";

			var flg1 = Checker.Level(null, config.levelLimit, false);
			var flg2 = true;
			for (let i = 0; i < 3; i++) {
				if ((ZhuanZhiModel.ins().getZhuanZhiLevel(i) < config.zzLevelLimit)) {
					flg2 = false;
					break;
				}
			}
			this.getBtn.visible = flg1 && flg2;
			this.maxTxt.visible = !flg1 || !flg2;
			if (!flg1)
				this.maxTxt.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100712, [config.levelLimit, nextAttConfig.level]);//`达到${config.levelLimit}级可以${nextAttConfig.level}转`;
			if (flg1 && !flg2)
				this.maxTxt.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100713, [nextAttConfig.level, config.zzLevelLimit]);//`3角色转职${config.zzLevelLimit}转可以${nextAttConfig.level}转`;
		}
		else { //满修
			this.nextAtt.visible = false;
			this.maxTxt.visible = true;
			this.maxTxt.text = GlobalConfig.jifengTiaoyueLg.st100714;//"转生等级已满";
			this.getBtn.visible = false;
		}
		this.setData();
	};

	setData() {
		if (this.ZhuanShengConfig == null)
			this.ZhuanShengConfig = GlobalConfig.ins("ZhuanShengConfig");
		var config = this.ZhuanShengConfig;
		var actorModel = GameLogic.ins().actorModel;
		var lowestLv = config.level + 1;
		var lv = Math.max(actorModel.level, lowestLv);
		var lvConfig = GlobalConfig.zhuanShengLevelConfig[lv];
		var expConfig = GlobalConfig.ins("ZhuanShengExpConfig")[lv];
		var ins = UserZs.ins();
		var sCount;
		this.toDays[0].textColor = actorModel.level < lowestLv ? 0xf87372 : 0xA89C88;
		let languageStr = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100715, [expConfig.exp])//"增加<font color=\"#9de242\">" + expConfig.exp + "</font>修为\n\n等级兑换：降1级"
		this.infoTxts[0].textFlow = (new egret.HtmlTextParser()).parser(languageStr);
		sCount = config.conversionCount - ins.upgradeCount[0];

		let languageStr1 = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100716, [lowestLv - 1]);//"大于" + (lowestLv - 1) + "级才能兑换"
		let languageStr2 = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100717, [sCount]);//"今天还可兑换<font color=\"#9de242\">" + sCount + "</font>次"
		this.toDays[0].textFlow = (new egret.HtmlTextParser()).parser(actorModel.level < lowestLv ? languageStr1 : languageStr2);
		this.btns[0].enabled = sCount > 0;
		var itemID = config.normalItem;
		var itemConfig = GlobalConfig.itemConfig[itemID];
		var count = UserBag.ins().getBagGoodsCountById(0, itemID);
		this.items[1].data = itemID;
		if (count) {
			this.btns[1].label = GlobalConfig.jifengTiaoyueLg.st100711;//"立即使用"
			this.btns[1].labelDisplay.size = 14
		}
		else {
			this.btns[1].label = GlobalConfig.jifengTiaoyueLg.st100718;//"购买并使用"
			this.btns[1].labelDisplay.size = 14
		}
		this.btns[1].name = config.normalExp + "";
		this.priceIcon1.visible = count == 0;
		let storeconfig1 = ItemStoreConfig.getStoreByItemID(itemID)
		this.priceIcon1.setPrice(storeconfig1.price);
		this.priceIcon1.setType(storeconfig1.costType);
		let callId1=itemID;
		this.item1.mCallback = () => { UserWarn.ins().setBuyGoodsWarn(callId1); }
		this.priceIcon1.name = itemConfig.name;
		let languageStr3 = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100719, [config.normalExp, itemConfig.name]);
		let languageStr4 = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100720, [count]);
		this.infoTxts[1].textFlow = (new egret.HtmlTextParser()).parser(languageStr3 + (count ? languageStr4 : ""));
		let zsLv: number = 0;
		if (UserZs.ins().lv > 12) {
			zsLv = 12;
		} else {
			zsLv = UserZs.ins().lv;
		}
		sCount = config.normalCount[zsLv] - ins.upgradeCount[1]
		let languageStr5 = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100717, [sCount]);//"今天还可兑换<font color=\"#9de242\">" + sCount + "</font>次"
		this.toDays[1].textFlow = (new egret.HtmlTextParser()).parser(languageStr5);
		this.btns[1].enabled = sCount > 0;
		itemID = config.advanceItem;
		itemConfig = GlobalConfig.itemConfig[itemID];
		count = UserBag.ins().getBagGoodsCountById(0, itemID);
		this.items[2].data = itemID;
		if (count) {
			this.btns[2].label = GlobalConfig.jifengTiaoyueLg.st100711;//"立即使用"
			this.btns[2].labelDisplay.size = 14
		}
		else {
			this.btns[2].label = GlobalConfig.jifengTiaoyueLg.st100718;//"购买并使用"
			this.btns[2].labelDisplay.size = 14
		}
		this.btns[2].name = config.advanceExp + "";

		this.priceIcon2.visible = count == 0;
		let storeconfig2 = ItemStoreConfig.getStoreByItemID(itemID)
		this.priceIcon2.setPrice(storeconfig2.price);
		this.priceIcon2.setType(storeconfig2.costType);
		this.priceIcon2.name = itemConfig.name;
		let callId2=itemID;
		this.item2.mCallback = () => { UserWarn.ins().setBuyGoodsWarn(callId2); }
		let languageStr6 = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100719, [config.advanceExp, itemConfig.name]);
		let languageStr7 = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100720, [count]);

		this.infoTxts[2].textFlow = (new egret.HtmlTextParser()).parser(languageStr6 + (count ? languageStr7 : ""));
		sCount = config.advanceCount[zsLv] - ins.upgradeCount[2]
		let languageStr8 = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100717, [sCount]);
		this.toDays[2].textFlow = (new egret.HtmlTextParser()).parser(languageStr8);
		this.btns[2].enabled = sCount > 0;
		for (var i = 0; i < 3; i++) {
			UIHelper.ShowRedPoint(this['btn' + i], UserZs.ins().canGet(i));
		}
		if (ins.lv >= config.maxzslevel) {
			this.m_TurnLab1.visible = false;
			this.m_TurnLab2.visible = false;
		} else {
			let nextLv: number = ins.lv + 1;
			if (nextLv > 12) {
				nextLv = 12;
			}
			this.m_TurnLab1.textFlow = (new egret.HtmlTextParser()).parser("<font color=\"#9de242\">" + nextLv + "</font>" + GlobalConfig.jifengTiaoyueLg.st100721 + "<font color=\"#9de242\">" + this.ZhuanShengConfig["normalCount"][nextLv] + "</font>");
			this.m_TurnLab2.textFlow = (new egret.HtmlTextParser()).parser("<font color=\"#9de242\">" + nextLv + "</font>" + GlobalConfig.jifengTiaoyueLg.st100721 + "<font color=\"#9de242\">" + this.ZhuanShengConfig["advanceCount"][nextLv] + "</font>");
		}
	};
}
window["ZsPanel"] = ZsPanel