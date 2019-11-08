class SmeltEquipRongluPanel extends BaseView implements ICommonWindowTitle {

	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st101457;
	public constructor() {
		super()
		this.skinName = "SmeltMain1Skin";
		this.smeltBtn0.label = GlobalConfig.jifengTiaoyueLg.st101460;
		this.smeltBtn.label = GlobalConfig.jifengTiaoyueLg.st101454;
	}
	UpdateContent(): void {
		this.smeltComplete();
	}

	lastNum = -1;
	lastlevel = 0;
	// totalPower
	smeltEquips

	itemList
	dataInfo
	smeltBtn
	smeltBtn0
	// attrTxt
	// _totalPower
	// nextAttrTxt
	maxTips
	attrTxt0
	expBar

	private powerLabel: PowerLabel
	private attrLabel: AttrLabel

	private effectMc: MovieClip;
	public m_EffGroup: eui.Group;

	childrenCreated() {
		this.name = GlobalConfig.jifengTiaoyueLg.st101457;
		// this.totalPower = BitmapNumber.ins().createNumPic(1000000, "1");
		// this.totalPower.x = 220;
		// this.totalPower.y = 146;
		// this.addChild(this.totalPower);
		this.smeltEquips = [];
		this.smeltEquips.length = 10;
		this.itemList.itemRenderer = SmeltEquipItem;
		this.dataInfo = new eui.ArrayCollection(this.smeltEquips);
		this.itemList.dataProvider = this.dataInfo;
	};
	open() {
		var param = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			param[_i - 0] = arguments[_i];
		}
		MessageCenter.addListener(Bless.ins().postBlessRongluSuccess, this.smeltComplete, this);
		MessageCenter.addListener(UserEquip.ins().postEquipCheckList, this.setItemList, this);
		this.smeltBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.itemList.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.smeltBtn0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		// this.smeltComplete();
	};
	close() {
		var param = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			param[_i - 0] = arguments[_i];
		}
		this.smeltBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.smeltBtn0.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.itemList.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		MessageCenter.ins().removeAll(this);
	};
	smeltComplete() {
		var config = GlobalConfig.ins("RongLuLevelConfig")[Bless.ins().level];
		// this.attrTxt.text = AttributeData.getAttStr(AttributeData.transformAttr(config.attr), 1);
		// this._totalPower = UserBag.getAttrPower(AttributeData.transformAttr(config.attr)) * SubRoles.ins().subRolesLen;
		// BitmapNumber.ins().changeNum(this.totalPower, this._totalPower, "1");
		this.attrLabel.SetCurAttr(AttributeData.getAttStr(AttributeData.transformAttr(config.attr), 1))
		this.powerLabel.text = UserBag.getAttrPower(AttributeData.transformAttr(config.attr)) * SubRoles.ins().subRolesLen;
		var config1 = GlobalConfig.ins("RongLuLevelConfig")[Bless.ins().level + 1];
		if (config1) {
			this.attrLabel.SetNextAttr(AttributeData.getAttStr(AttributeData.transformAttr(config1.attr), 1))
			// this.nextAttrTxt.text = AttributeData.getAttStr(AttributeData.transformAttr(config1.attr), 1);
		}
		else {
			// this.nextAttrTxt.text = "已满级\n已满级\n已满级\n已满级";
			this.smeltBtn.visible = false;
			this.smeltBtn0.visible = false;
			this.maxTips = new eui.Label();
			this.maxTips.textFlow = new egret.HtmlTextParser().parser(GlobalConfig.jifengTiaoyueLg.st101458);
			this.maxTips.size = 20;
			this.maxTips.fontFamily = "Microsoft YaHei";
			this.maxTips.x = 175;
			this.maxTips.y = 566;
			this.addChild(this.maxTips);
		}
		this.attrTxt0.text = "(" + LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101368, [Bless.ins().level]) + ")";
		this.expBar.maximum = config.exp;
		this.expBar.value = Bless.ins().exp;
		// this.smeltEquips.length = 0;
		// var n = this.itemList.numChildren;
		// while (n--) {
		// 	this.itemList.getChildAt(n).playEff();
		// }
		var data = this.itemList.getChildAt(0).data;
		if (this.effectMc == null && data != null) {
			this.effectMc = new MovieClip();
			this.m_EffGroup.addChild(this.effectMc);
			this.effectMc.loadUrl(ResDataPath.GetUIEffePath("effe_ui_uppower_floor"), true, 1, () => {
				DisplayUtils.dispose(this.effectMc);
				this.effectMc = null;
			});
		}


		this.setItemData();
		if (this.lastNum != -1) {
			var exp = 0;
			if (Bless.ins().level > this.lastlevel) {
				for (var i = Bless.ins().level - 1; i >= this.lastlevel; i--) {
					exp += GlobalConfig.ins("RongLuLevelConfig")[i].exp;
				}
				exp += Bless.ins().exp - this.lastNum;
				this.showBoost(exp);
			}
			if (Bless.ins().exp > this.lastNum) {
				this.showBoost(Bless.ins().exp - this.lastNum);
			}
		}
		this.lastNum = Bless.ins().exp;
		this.lastlevel = Bless.ins().level;
	};
    /**
     * 培养表现

     * @param addExp 增加的经验
     */
	showBoost(addExp) {
		UserTips.ins().showTips(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101459, [addExp]));
		// var _this = this;
		// var label = new eui.Label;
		// label.size = 20;
		// var str = "";
		// label.textColor = 0x00FF00;
		// str = "熔炼值 +" + addExp;
		// label.x = 360;
		// label.y = 540;
		// label.text = str;
		// this.addChild(label);
		// var t = egret.Tween.get(label);
		// t.to({ "y": label.y - 45 }, 500).call(function () {
		// 	_this.removeChild(label);
		// }, this).call(() => {
		// 	egret.Tween.removeTweens(label);
		// });
	};
	setItemList(list) {
		this.dataInfo.replaceAll(list);
		this.itemList.dataProvider = this.dataInfo;
	};
	setItemData() {
		//     //如果直接用dataProvider = ArrayCollection清空会导致特效播不出
		var n = 10;
		this.smeltEquips.length = 0;
		this.smeltEquips.length = n;
		this.dataInfo.replaceAll(this.smeltEquips);
	};
	//一键选择装备
	setyijian() {
		var smeltList = UserBag.ins().getWingZhuEquip();
		var ronglist = [];
		if (smeltList.length > 0) {
			smeltList.forEach(function (element) {
				if (ronglist.length < 10)
					ronglist.push(element);
			});
			if (ronglist.length < 10) {
				for (var i = ronglist.length; i < 10; i++) {
					ronglist.push(null);
				}
			}
			this.dataInfo.replaceAll(ronglist);
			this.itemList.dataProvider = this.dataInfo;
		}
	};
	onTap(e) {
		switch (e.currentTarget) {
			case this.smeltBtn:
				Bless.ins().sendRonglu(this.smeltEquips);
				break;
			case this.smeltBtn0:
				this.setyijian();
				break;
			case this.itemList:
				var item = e.target;
				if (item && item.data) {
					var i = this.smeltEquips.indexOf(item.data);
					if (i >= 0) {
						this.smeltEquips.splice(i, 1);
						item.data = null;
					}
				}
				else {
					var smeltList = UserBag.ins().getBagSortQualityEquips(5, 0, 0, UserBag.ins().otherEquipSmeltFilter);
					if (smeltList.length > 0) {
						var smeltSelectWin = <SmeltSelectWin>ViewManager.ins().open(SmeltSelectWin, smeltList, Const.SMELT_COUNT, this.smeltEquips);
						// smeltSelectWin.setSmeltEquipList(this.smeltEquips);
					}
					else {
						UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101452);
					}
				}
				break;
		}
	};
}
window["SmeltEquipRongluPanel"] = SmeltEquipRongluPanel