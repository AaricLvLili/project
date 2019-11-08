class RoleItem extends ItemBase {
	public constructor() {
		super();
	}

	boostLv: eui.BitmapLabel
	zhulingLv: eui.BitmapLabel
	tupoLv: eui.BitmapLabel
	equipLv: eui.BitmapLabel
	zhuZaiEquipLv: eui.BitmapLabel
	mc: MovieClip
	bless: eui.Image
	_model
	_wings
	_lastData
	_lastModel
	
	init() {
		super.init();
		this.boostLv = new eui.BitmapLabel;
		this.boostLv.right = 5;
		this.boostLv.bottom = 18;
		this.boostLv.font="font_item_lv_1_fnt";//强化
		this.zhulingLv = new eui.BitmapLabel;
		this.zhulingLv.left = 5;
		this.zhulingLv.bottom = 18;
		this.zhulingLv.font="font_item_lv_2_fnt";//注灵
		this.tupoLv = new eui.BitmapLabel;
		this.tupoLv.right = 5;
		this.tupoLv.top = 5;
		this.tupoLv.font="font_item_lv_2_fnt";//突破
		this.equipLv = new eui.BitmapLabel;
		this.equipLv.left = 5;
		this.equipLv.top = 5;
		this.equipLv.font="font_item_lv_3_fnt";//装备等级
		this.zhuZaiEquipLv = new eui.BitmapLabel;
		this.zhuZaiEquipLv.horizontalCenter = 0;
		this.zhuZaiEquipLv.verticalCenter = -5;
		this.zhuZaiEquipLv.font="font_item_lv_3_fnt";//主宰装备等级
		//this.boostLv.size = this.zhulingLv.size = this.tupoLv.size = this.equipLv.size = 16;
		//this.boostLv.width = this.zhulingLv.width = this.tupoLv.width = 41;
		//this.boostLv.fontFamily = this.zhulingLv.fontFamily = this.tupoLv.fontFamily = "Microsoft YaHei";
		//this.boostLv.stroke = this.zhulingLv.stroke = this.tupoLv.stroke = 1;
		//this.boostLv.strokeColor = this.zhulingLv.strokeColor = this.tupoLv.strokeColor = 0x000000;
		this.boostLv.textAlign = this.tupoLv.textAlign = "right";
		this.addChild(this.boostLv);
		this.addChild(this.zhulingLv);
		this.addChild(this.tupoLv);
		this.addChild(this.equipLv);
		this.addChild(this.zhuZaiEquipLv);
		this.mc = new MovieClip;
		this.mc.x = 34;
		this.mc.y = 34;
	};
	dataChanged() {
		//        if(this._lastData == this.data){
		//            return;
		//        }
		this.playEff();
		super.dataChanged();
		var itemConfig = this.data.itemConfig;
		this.bless.visible = false;
		if (itemConfig && !this.wings) {
			var equipsDatas = this.model.equipsData;
			var equipsData = void 0;
			for (var i = 0; i < equipsDatas.length; i++) {
				if (this.data.handle == equipsDatas[i].item.handle) {
					equipsData = equipsDatas[i];
					break;
				}
			}
			//if (!this.wings) {
				this.boostLv.text = (equipsData.strengthen > 0) ? "+" + equipsData.strengthen : "";
				this.zhulingLv.text = (equipsData.zhuling > 0) ? equipsData.zhuling + "" : "";
				this.tupoLv.text = (equipsData.tupo > 0) ?  LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101446,[equipsData.tupo]) : "";
				this.bless.visible = equipsData.bless > 0;
				this.setEquipTxt(itemConfig)
				// if (itemConfig.subType == ForgeConst.EQUIP_POS_TO_SUB[EquipPos.DZI]) {
				// 	this.nameTxt.text = itemConfig.name;
				// }
			//}
		}
		this._lastData = this.data;
		this._lastModel = this._model;
	};
	private setEquipTxt(config):void{
		if(config == null) return;
        this.itemIcon.setData(config);
        if (config.type == ItemType.EQUIP || config.type == ItemType.FUWEN) {
            var nameStr = config.zsLevel > 0 ? LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101367,[config.zsLevel]) :  LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101368,[config.level]);
            if (ItemConfig.IsLegendItem(config)) {
				nameStr = LanguageString.jifengTiaoyueCh (GlobalConfig.jifengTiaoyueLg.st101439,[ LegendModel.GetStage(config.id)])
            }
            this.equipLv.text = nameStr;
        }
        else {
            this.equipLv.text = config.name;
        }
        if (config.type != 0) {
           // this.equipLv.textColor = ItemBase.QUALITY_COLOR[config.quality];
        }
	}
	clear() {
		super.clear();
		this.boostLv.text = this.zhulingLv.text = this.tupoLv.text = this.equipLv.text =this.zhuZaiEquipLv.text= "";
		this.playEff();
	};
	openEquipsTips() {
		ViewManager.ins().open(EquipDetailedWin, 1, this.data.handle, this.itemConfig.id, this.data, this._model);
	};
	get model() {
		return this._model;
	}
	set model(value) {
		this._model = value;
	}
	get wings() {
		return this._wings;
	}
	set wings(value) {
		this._wings = value;
	}
	playEff() {
		if (this._lastData) {
			if (this._lastData != this.data && this.model == this._lastModel) {
				if(this.mc)
				{
					this.mc.loadUrl(ResDataPath.GetUIEffePath("litboom"),true,1,()=>{
						DisplayUtils.dispose(this.mc);
						this.mc = null;//修改lxh 内存回收
					});
					// this.mc.loadFile("litboom", true, 1);
					this.addChild(this.mc);
				}
			}
		}
	};
}
window["RoleItem"]=RoleItem