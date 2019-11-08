class AttrTipsWin extends BaseEuiView {
	public colorCanvas: eui.Image;
	public background: eui.Component;
	public itemIcon: any;
	public nameLabel: eui.Label;
	public m_NumLab: eui.Label;

	public attr1: eui.Label;
	public attr2: eui.Label;
	public attr3: eui.Label;
	public attr4: eui.Label;
	public lv: eui.Label;
	public career: eui.Label;
	public score: eui.Label;
	public levelKey: eui.Label;
	public powerLabel: eui.BitmapLabel;
	public add: eui.Group;
	public sub1Btn: eui.Image;
	public add1Btn: eui.Image;
	public maxBtn: eui.Button;
	public minBtn: eui.Button;
	public numLabel: eui.TextInput;
	public useBtn: eui.Button;

	_equipPower = 0;
	_totalPower = 0;

	useNum
	maxNum = 0;
	goodsId
	private configUseType: ItemUseType;
	private config: any;
	public constructor() {
		super();
		this.skinName = "AttrTipsSkin";
		this.itemIcon.imgJob.visible = false;
	}
	public open(...param: any[]) {
		if (UserBag.ins().eatCnt == 0) {
			UserBag.ins().sendGetDanyaoMsg();
		}
		var type = param[0];
		var handle = param[1];
		var configID = param[2];
		var data = param[3];
		this.useNum = 1;
		this.numLabel.text = this.useNum + "";
		this.colorCanvas.addEventListener(egret.TouchEvent.TOUCH_END, this.otherClose, this);
		this.minBtn.addEventListener(egret.TouchEvent.TOUCH_END, this.onTap, this);
		this.maxBtn.addEventListener(egret.TouchEvent.TOUCH_END, this.onTap, this);
		this.sub1Btn.addEventListener(egret.TouchEvent.TOUCH_END, this.onTap, this);
		this.add1Btn.addEventListener(egret.TouchEvent.TOUCH_END, this.onTap, this);
		this.useBtn.addEventListener(egret.TouchEvent.TOUCH_END, this.onTap, this);
		MessageCenter.addListener(UserBag.postUseItemSuccess, this.useSuccess, this);
		this.numLabel.addEventListener(egret.Event.CHANGE, this.onTxtChange, this);
		this.setData(type, handle, configID, data);
	};
	public close() {
		this.colorCanvas.removeEventListener(egret.TouchEvent.TOUCH_END, this.otherClose, this);
		this.minBtn.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTap, this);
		this.maxBtn.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTap, this);
		this.sub1Btn.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTap, this);
		this.add1Btn.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTap, this);
		this.useBtn.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTap, this);
		this.numLabel.removeEventListener(egret.Event.CHANGE, this.onTxtChange, this);
	};
	public otherClose(evt: egret.TouchEvent) {
		ViewManager.ins().close(this);
	};

	public setData(type, handle, configID, _data) {
		var data = _data instanceof ItemData ? _data : undefined;
		var itemConfig;
		this.goodsId = configID;
		this._totalPower = 0;
		itemConfig = GlobalConfig.itemConfig[configID];
		this.config = itemConfig;
		this.nameLabel.text = itemConfig.name;
		this.nameLabel.textColor = ItemBase.QUALITY_COLOR[itemConfig.quality];
		this.itemIcon.setData(itemConfig);
		if (data instanceof ItemData || itemConfig != null) {
			this.lv.text = itemConfig.zsLevel > 0 ?  LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101367,[itemConfig.zsLevel]) : LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101368,[itemConfig.level]);
			if (itemConfig.zsLevel > 0) {
				this.lv.textColor = UserZs.ins().lv < itemConfig.zsLevel ? 0xf87372 : 0x00ff00;
			}
			else {
				this.lv.textColor = GameLogic.ins().actorModel.level < itemConfig.lv ? 0xf87372 : 0x00ff00;
			}
			this.career.text = Role.getJobNameByJob(itemConfig.job);
		}
		var ii = 1;
		this.attr1.visible = false;
		this.attr2.visible = false;
		this.attr3.visible = false;
		this.attr4.visible = false;
		var totalAttr = [];
		for (var i = 0; i < itemConfig.useArg.length; i++) {
			var attrStr = "";
			var attrName = "";
			let config = itemConfig.useArg;
			attrName += AttributeData.getAttrStrByType(config[i].type) + ": ";
			attrStr += config[i].value;
			var attrs = new AttributeData;
			attrs.type = config[i].type;
			attrs.value = config[i].value;
			totalAttr.push(attrs);
			if (data != undefined) {
				var attr = data.att;
				for (var index = 0; index < attr.length; index++) {
					if (attr[index].type == config[i].type) {
						attrStr += ' +' + attr[index].value;
						attrs.value += attr[index].value;
						break;
					}
				}
			}
			this['attr' + ii].textFlow = <Array<egret.ITextElement>>[{ text: attrName, style: { "textColor": 0x535557 } }, { text: attrStr, style: { "textColor": 0xFFBF26 } }];;
			this['attr' + ii].visible = true;
			ii++;
		}

		this._equipPower = Math.floor(UserBag.getAttrPower(itemConfig.useArg));
		this._totalPower += this._equipPower;


		this.powerLabel.text =GlobalConfig.jifengTiaoyueLg.st100094 + this._totalPower.toString()
		this.score.textFlow = <Array<egret.ITextElement>>[{ text: GlobalConfig.jifengTiaoyueLg.st100070+": ", style: { "textColor": 0x535557 } }, { text: this._totalPower.toString(), style: { "textColor": 0xFFBF26 } }];

		this.setUseData(type, configID)
	};

	private setUseData(type, id) {
		let itemConfig = GlobalConfig.itemConfig[id];
		var data = UserBag.ins().getBagGoodsByTypeAndId(type, id);
		this.m_NumLab.text = data.count + "";
		this.maxNum = data.count;
		if (this.maxNum > 100) {
			this.maxNum = 100;
		}
		this.configUseType = itemConfig.useType;
		if (itemConfig.useType == ItemUseType.TYPE03) {
			let configDan = GlobalConfig.ins("ShuXingDanjcConfig");
			let eatCnt = UserBag.ins().eatCnt;
			if (configDan.Num == eatCnt) {
				this.useNum = 0;
				this.numLabel.text = this.useNum + "";
			}
		}
	}
	onTxtChange(e) {
		var num = Number(this.numLabel.text);
		if (num > this.maxNum) {
			num = this.maxNum;
		}
		this.useNum = num;
		this.numLabel.text = this.useNum + "";
	};
	onTap(e) {
		switch (e.target) {
			case this.minBtn:
				if (this.configUseType == ItemUseType.TYPE03) {
					let eatCnt = UserBag.ins().eatCnt;
					let config = GlobalConfig.ins("ShuXingDanjcConfig");
					if (config.Num == eatCnt) {
						this.useNum = 0;
						UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101478);
					} else {
						this.useNum = 1;
					}
				} else {
					this.useNum = 1;
				}
				break;
			case this.maxBtn:
				if (this.configUseType == ItemUseType.TYPE03) {
					let eatCnt = UserBag.ins().eatCnt;
					let config = GlobalConfig.ins("ShuXingDanjcConfig");
					if (config) {
						if (config.Num == eatCnt) {
							UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101478);
						} else {
							let maxEatCnt = config.Num - eatCnt;
							this.useNum = (this.maxNum > maxEatCnt) ? maxEatCnt : this.maxNum;
						}
					}
				} else {
					this.useNum = this.maxNum;
				}
				break;
			case this.sub1Btn:
				if (this.configUseType == ItemUseType.TYPE03) {
					let eatCnt = UserBag.ins().eatCnt;
					let config = GlobalConfig.ins("ShuXingDanjcConfig");
					if (config.Num == eatCnt) {
						this.useNum = 0;
						UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101478);
					} else {
						this.useNum--;
						if (this.useNum <= 0) {
							this.useNum = 1;
						}
					}
				} else {
					this.useNum--;
					if (this.useNum <= 0) {
						this.useNum = 1;
					}
				}
				break;
			case this.add1Btn:
				if (this.configUseType == ItemUseType.TYPE03) {
					let eatCnt = UserBag.ins().eatCnt;
					let config = GlobalConfig.ins("ShuXingDanjcConfig");
					if (config) {
						if (this.useNum + eatCnt < config.Num) {
							this.useNum++;
							if (this.useNum > this.maxNum) {
								this.useNum = this.maxNum;
							}
						} else {
							UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101478);
						}
					}
				} else {
					this.useNum++;
					if (this.useNum > this.maxNum) {
						this.useNum = this.maxNum;
					}
				}
				break;
			case this.useBtn:
				if (this.configUseType == ItemUseType.TYPE03) {
					let eatCnt = UserBag.ins().eatCnt;
					let config = GlobalConfig.ins("ShuXingDanjcConfig");
					if (this.useNum > config.Num - eatCnt) {
						UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101479);
						this.useNum = config.Num - eatCnt;
					} else if (config.Num == eatCnt) {
						UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101478);
					} else {
						let len = SubRoles.ins().subRolesLen;
						let ishaveJob: boolean = false;
						for (var i = 0; i < len; i++) {
							let role: Role = SubRoles.ins().getSubRoleByIndex(i);
							if (this.config.job == role.job) {
								ishaveJob = true;
								break;
							}
						}
						if (ishaveJob == true) {
							if (UserBag.ins().sendUseItem(this.goodsId, this.useNum)) {
								ViewManager.ins().close(ItemUseTipsWin);
							}
						} else {
							UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101480);
						}
					}
				} else {
					if (UserBag.ins().sendUseItem(this.goodsId, this.useNum)) {
						ViewManager.ins().close(ItemUseTipsWin);
					}
				}
				break;
		}
		this.numLabel.text = this.useNum + "";
	};
	useSuccess() {
		var data = UserBag.ins().getBagItemById(this.goodsId);
		if (!data) {
			ViewManager.ins().close(this);
		}
		else {
			this.setUseData(0, this.goodsId);
			this.onTxtChange(null);
		}
	};
}
ViewManager.ins().reg(AttrTipsWin, LayerManager.UI_Popup);
window["AttrTipsWin"]=AttrTipsWin