class ItemUseTipsWin extends BaseEuiPanel {

	public static LAYER_LEVEL = LayerManager.UI_Popup

	maxNum = 0;
	bossBoxIdList = [ItemConst.SUMMON_BOSS_01, ItemConst.SUMMON_BOSS_02, ItemConst.SUMMON_BOSS_03];
	numLabel
	itemIcon
	goodsId
	minBtn
	maxBtn
	sub1Btn
	add1Btn
	useBtn
	useNum
	isBossBox
	nameLabel
	lv
	num
	description: eui.Label
	add
	//private dialogbg: eui.Image;
	//private dialogCloseBtn: eui.Button;

	private configUseType: ItemUseType;
	private config: any;
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;

	public constructor() {
		super();


	}


	initUI() {
		super.initUI()
		this.skinName = "ItemUseTipsSkin";
		this.numLabel.restrict = "0-9";
		this.itemIcon.imgJob.visible = false;
		this.m_Lan1.text=GlobalConfig.jifengTiaoyueLg.st101853;
		this.m_Lan2.text=GlobalConfig.jifengTiaoyueLg.st100923;
		this.useBtn.label=GlobalConfig.jifengTiaoyueLg.st100683;
		this.maxBtn.label=GlobalConfig.jifengTiaoyueLg.st101113;
		this.minBtn.label=GlobalConfig.jifengTiaoyueLg.st101114;

	};
	open(...param: any[]) {
		var type = param[0];
		var id = param[1];
		this.goodsId = id;
		this.m_bg.init(`ItemUseTipsWin`, GlobalConfig.jifengTiaoyueLg.st101497)
		// this.colorCanvas.addEventListener(egret.TouchEvent.TOUCH_TAP, this.otherClose, this);
		this.minBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.maxBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.sub1Btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.add1Btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.useBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		MessageCenter.addListener(UserBag.postUseItemSuccess, this.useSuccess, this);
		this.numLabel.addEventListener(egret.Event.CHANGE, this.onTxtChange, this);
		this.useNum = 1;
		this.numLabel.text = this.useNum + "";
		this.setData(type, id);
		this.isBossBox = this.bossBoxIdList.lastIndexOf(id) != -1;
		//this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
	};
	close() {
		//this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
		// this.colorCanvas.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.otherClose, this);
		this.minBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.maxBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.sub1Btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.add1Btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.useBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.numLabel.removeEventListener(egret.Event.CHANGE, this.onTxtChange, this);
		MessageCenter.ins().removeAll(this);
	};

	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
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
				if (this.isBossBox) {
					ViewManager.ins().close(ItemUseTipsWin);
					ViewManager.ins().open(RandBossWin, this.goodsId);
					return;
				}
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
			ViewManager.ins().close(ItemUseTipsWin);
		}
		else {
			this.setData(0, this.goodsId);
			this.onTxtChange(null);
		}
	};
	setData(type, id) {
		var numStr = "";
		// var posX = 0;
		// if (num == undefined) {
		var data = UserBag.ins().getBagGoodsByTypeAndId(type, id);
		if (data == null) return;
		this.maxNum = data.count;
		if (this.maxNum > 100) {
			this.maxNum = 100;
		}
		numStr = data.count + "";
		// } else
		//	 numStr = num + "";
		var config = GlobalConfig.itemConfig[id];
		this.configUseType = config.useType;
		this.config = config;
		this.nameLabel.text = config.name;
		this.nameLabel.textColor = ItemBase.QUALITY_COLOR[config.quality];
		this.itemIcon.setData(config);
		this.lv.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101368, [config.level]);
		this.num.text = numStr;
		this.description.textFlow = TextFlowMaker.generateTextFlow(config.desc);
		// posX += 126 + this.description.height;
		this.add.visible = config.useType == 1 || config.useType == ItemUseType.TYPE03 || config.useType == ItemUseType.TYPE05;
		if (this.add.visible) {
			// posX += 10;
			// this.add.y = posX + this.BG.y;
		}
		// posX += 52;

		// egret.callLater(this._UpdateLayout, this)//
		// this.useBtn.y = posX + this.BG.y;
		// this.BG.height = posX + 50;
		if (config.useType == ItemUseType.TYPE03) {
			let configDan = GlobalConfig.ins("ShuXingDanjcConfig");
			let eatCnt = UserBag.ins().eatCnt;
			if (configDan.Num == eatCnt) {
				this.useNum = 0;
				this.numLabel.text = this.useNum + "";
			}
		}
	};

	private _UpdateLayout(): void {
		let labelHeight = this.description.height
		//this.dialogbg.height = 353 - 14 + labelHeight
	}
}
window["ItemUseTipsWin"] = ItemUseTipsWin