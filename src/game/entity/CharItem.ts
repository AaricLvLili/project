class CharItem extends egret.DisplayObjectContainer {

	private _nameTxt: eui.Label;
	private _itemImg: eui.Image;
	private _bgColorImg: eui.Image;
	public index: number
	private _tx: number;

	private _ty: number;

	private static HANDLE = 1

	public set tx(value: number) {
		this._tx = value;
	}

	public get tx(): number {
		return GameMap.CELL_SIZE * this._tx + (GameMap.CELL_SIZE >> 1);
	}

	public set ty(value: number) {
		this._ty = value;
	}

	public get ty(): number {
		return GameMap.CELL_SIZE * this._ty + (GameMap.CELL_SIZE >> 1);
	}

	public constructor() {
		super()

		this.index = CharItem.HANDLE++

		this.touchEnabled = false;
		this.touchChildren = false;
		this._nameTxt = new eui.Label;
		// this._nameTxt.fontFamily = "Microsoft YaHei";
		let point = (-56 * 0.6) >> 1;
		this._nameTxt.stroke = 1;
		this._nameTxt.strokeColor = 0x333333;
		this._nameTxt.size = 14;
		this._nameTxt.y = -25;
		this._itemImg = new eui.Image;
		this._itemImg.x = point;
		this._itemImg.y = point;
		this._itemImg.scaleX = this._itemImg.scaleY = 0.6;
		this._bgColorImg = new eui.Image;
		// this._bgColorImg.scaleX = this._itemImg.scaleY = 0.6;
		this._bgColorImg.width = 180;
		this._bgColorImg.height = 319;
		this._bgColorImg.x = -88;
		this._bgColorImg.y = -270;
		this._bgColorImg.anchorOffsetX = this.width / 2;
		this._bgColorImg.anchorOffsetY = this.height * 2;
		this.addChild(this._bgColorImg);
		this.addChild(this._itemImg);
		this.addChild(this._nameTxt);


		// this._bgColorImg.x = (-56) >> 1;
		// this._bgColorImg.y = (-56) >> 1;
		// this._bgColorImg.scaleX = this._bgColorImg.scaleY = 0.6;

	}

	private addEffect() {
		if (1 == 1) return;
		let effect: MovieClip = new MovieClip();
		effect.name = "item_eff_test_json";
		effect.scaleX = 0.5;
		effect.scaleY = 0.5;
		this.addChild(effect);
		effect.loadUrl(ResDataPath.GetUIEffePath("item_eff_test"), true, -1)
	}
	public setData(item) {
		if (item == null)
			return;
		// 1道具物品
		this._bgColorImg.visible = false;
		if (item.type) {

			let obj = GlobalConfig.itemConfig[item.id];
			if (obj) {
				this._nameTxt.text = obj.name;
				this._nameTxt.textColor = ItemBase.QUALITY_COLOR[obj.quality];
				this._itemImg.source = ResDataPath.GetItemFullName(obj.icon);
				if (obj.quality > 0) {
					this.addEffect();
				}
				if (obj.quality >= 3) {
					this._bgColorImg.visible = true
					this._bgColorImg.source = "comp_180_319_" + obj.quality + "_png";
				}
			}
			else {
				this._nameTxt.text = "道具名称";
				let s = " : 掉落报错，不存在的物品ID=" + item.id + "  副本名称（ID）：" +
					GameMap.fbName + "(" + GameMap.fubenID + ")   怪物ID：" + UserFb.ins().monsterID + "( BOSSID:" + UserFb.ins().bossID + ")";

				Main.errorBack(s);
			}
		}
		else {
			if (item.id == 1) {
				if (item.count) {
					this._nameTxt.text = "" + item.count;
				} else {
					this._nameTxt.text = ""
				}
				// this._itemImg.source = ResDataPath.GetItemFullName("icgoods117");
				this._itemImg.source = "icgoods117_png";
			}
			else if (item.id == 2) {
				if (item.count) {
					this._nameTxt.text = "" + item.count;
				} else {
					this._nameTxt.text = ""
				}
				// this._itemImg.source = ResDataPath.GetItemFullName("icgoods121");
				this._itemImg.source = "icgoods121_png";
			}
		}
		this._nameTxt.x = -this._nameTxt.textWidth >> 1;
	};
	public reset() {
	};
	public destruct() {
	};
}
window["CharItem"] = CharItem