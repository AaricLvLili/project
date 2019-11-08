class ZhuanZhiEquipItem extends eui.ItemRenderer{
	public constructor() {
		super();
        this.skinName = "ZhuanZhiEquipItemSkin";
		this.imgList = [];
		this.addEventListener(egret.TouchEvent.TOUCH_END,this.selectedHandle,this);
	}

	/**item索引*/
	public mIndex: number
	private isSelected:boolean;
	public itemIcon;
	public select:eui.Image;
	public title:eui.Label;
	public level:eui.Label;
	public lock:eui.Image;
	public redPoint:eui.Image;
	public starGroup:eui.Group;

    protected dataChanged(): void
	{
		this.itemIcon.imgJob.visible = false;
		var equip:EquipsData = this.data.equip;
		if(equip.item && equip.item.configID > 0)
		{
			this.itemIcon.setData(equip.item.itemConfig);
			this.title.text = equip.item.itemConfig.zsLevel > 0 ? (equip.item.itemConfig.zsLevel + GlobalConfig.jifengTiaoyueLg.st100067) : (equip.item.itemConfig.level + GlobalConfig.jifengTiaoyueLg.st100093);
			this.level.text = "+" + equip.num2;
			this.lock.visible = false;
		}
		else
		{
			this.itemIcon.setData(null);
			this.itemIcon.imgIcon.source = `ui_zz_zb_icon_${this.mIndex+8}_${this.data.job}_png`;
			this.title.text = "";
			this.level.text = "";

			var equipId = ZhuanZhiModel.ins().getZhuanZhiEquipId(this.mIndex,this.data.job);
			var config = GlobalConfig.ins("TransferEquipConfig")[equipId];
			var role = SubRoles.ins().getSubRoleByIndex(this.data.roleIndex);
			this.lock.visible = !(role.zhuanZhiJm.level >= config.activationLevel);
		}
		this.foundStarLvl(equip.star);
	}

    private selectedHandle(evt:egret.TouchEvent):void
    {
        if(!this.isSelected)
            GameGlobal.MessageCenter.dispatch(MessageDef.ZHUANZHI_EQUIP_ITEM_SELECT,this.mIndex);
    }

	public set selected(value :boolean)
    {
        if (this.isSelected == value) return;
        this.isSelected = value;
		this.select.visible = value;
    }

	/**设置转职装备item红点*/
	public setShowRedPoint(isShow: boolean): void {
        this.redPoint.visible = isShow;
    }

	/** 等级规律，5级一变*/
	private readonly LAW: number = 5;
	/** 存储list列表*/
	private imgList: Array<any>;

	/** 创建，传入对应的等级，会计算好排列*/
	public foundStarLvl(lvl: number): void {
		var self:ZhuanZhiEquipItem = this;

		self.clear();

		//第一层循环，计算有几个月亮
		var moon: number = Math.floor(lvl / self.LAW);
		var img: eui.Image;

		for (var i: number = 0; i < moon; i++) {
			img = self.getimage();
			img.source = "comp_15_15_01_png";
			this.starGroup.addChild(img);
		}


		//第二层，计算星星
		var star: number = lvl - moon * self.LAW;
		for (i = 0; i < star; i++) {
			img = self.getimage();
			img.source = "comp_222_2222_png";;
			this.starGroup.addChild(img);
		}
	}

	/** 清理*/
	private clear(): void {
		while (this.starGroup.numChildren) {
			this.imgList.push(this.starGroup.removeChildAt(0));
		}
	}

	/** 返回个btm*/
	private getimage(): eui.Image {
		if (this.imgList.length > 0) return this.imgList.shift();
		var img: eui.Image = new eui.Image();
		return img;
	}
}
window["ZhuanZhiEquipItem"]=ZhuanZhiEquipItem