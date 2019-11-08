class ItemHcTipsWin extends BaseEuiPanel {

	public static LAYER_LEVEL = LayerManager.UI_Popup
	private maxNum = 0;
	private goodsId
	private useNum
	private itemIcon;
	private nameLabel: eui.Label;

	private itemIcon1;
	private nameLabel1: eui.Label;

	private num: eui.Label;
	private lv: eui.Label;

	private description: eui.Label;
	private consumeLabel: ConsumeLabel;
	private sub1Btn: eui.Image;
	private add1Btn: eui.Image;
	private maxBtn: eui.Button;
	private minBtn: eui.Button;
	private numLabel: eui.TextInput;
	private useBtn: eui.Button;
	//private dialogCloseBtn:eui.Button;

	public constructor() {
		super();
		this.skinName = "ItemHcTipsSkin";
		// this.skinName = "EquipTipsSkin";
	}

	initUI() {
		super.initUI()
		this.numLabel.restrict = "0-9";
		this.itemIcon.imgJob.visible = false;
		this.itemIcon1.imgJob.visible = false;
		this.consumeLabel.consumeType = GlobalConfig.jifengTiaoyueLg.st101496;
	};
	open(...param: any[]) {
		var type = param[0];
		var id = param[1];
		this.goodsId = id;
		this.m_bg.init(`ItemHcTipsWin`, GlobalConfig.jifengTiaoyueLg.st101124)
		this.minBtn.addEventListener(egret.TouchEvent.TOUCH_END, this.onTap, this);
		this.maxBtn.addEventListener(egret.TouchEvent.TOUCH_END, this.onTap, this);
		this.sub1Btn.addEventListener(egret.TouchEvent.TOUCH_END, this.onTap, this);
		this.add1Btn.addEventListener(egret.TouchEvent.TOUCH_END, this.onTap, this);
		this.useBtn.addEventListener(egret.TouchEvent.TOUCH_END, this.onTap, this);
		//this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);

		MessageCenter.addListener(UserBag.postHcItemSuccess, this.useSuccess, this);
		this.numLabel.addEventListener(egret.Event.CHANGE, this.onTxtChange, this);
		this.useNum = 1;
		this.numLabel.text = this.useNum + "";
		this.setData(type, id);
	};
	close() {
		this.minBtn.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTap, this);
		this.maxBtn.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTap, this);
		this.sub1Btn.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTap, this);
		this.add1Btn.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTap, this);
		this.useBtn.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTap, this);
		this.numLabel.removeEventListener(egret.Event.CHANGE, this.onTxtChange, this);
		//this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
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
				this.useNum = 1;
				break;
			case this.maxBtn:
				this.useNum = this.maxNum;
				break;
			case this.sub1Btn:
				this.useNum--;
				if (this.useNum <= 0) {
					this.useNum = 1;
				}
				break;
			case this.add1Btn:
				this.useNum++;
				if (this.useNum > this.maxNum) {
					this.useNum = this.maxNum;
				}
				break;
			case this.useBtn:
				UserBag.ins().sendHcItem(this.goodsId, this.useNum);
				break;
		}
		this.numLabel.text = this.useNum + "";
	};
	useSuccess() {
		var data = UserBag.ins().getBagItemById(this.goodsId);
		var config = GlobalConfig.itemConfig[this.goodsId];
		var canNum = data ? Math.floor(data.count / config.hcnumber) : 0;

		if (canNum <= 0) {
			ViewManager.ins().close(ItemHcTipsWin);
		}
		else {
			this.setData(0, this.goodsId);
			this.onTxtChange(null);
		}
	};
	setData(type, id) {
		var numStr = "";
		var data = UserBag.ins().getBagGoodsByTypeAndId(type, id);
		if (data == null) return;

		var config = GlobalConfig.itemConfig[id];
		var config1 = GlobalConfig.itemConfig[config.hcgenerate];

		this.nameLabel.text = config.name;
		this.nameLabel.textColor = ItemBase.QUALITY_COLOR[config.quality];
		this.nameLabel1.text = config1.name;
		this.nameLabel1.textColor = ItemBase.QUALITY_COLOR[config1.quality];

		this.itemIcon.setData(config);
		this.itemIcon1.setData(config1);

		this.lv.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101368, [config.level]);
		this.num.text = data.count + "";
		this.description.textFlow = TextFlowMaker.generateTextFlow(config.desc);

		this.consumeLabel.curValue = data.count;
		this.consumeLabel.consumeValue = config.hcnumber;
		this.maxNum = Math.floor(data.count / config.hcnumber);
		if (this.maxNum > 100) {
			this.maxNum = 100;
		}
		if (this.maxNum <= 0) this.maxNum = 1;
	};
}
window["ItemHcTipsWin"] = ItemHcTipsWin