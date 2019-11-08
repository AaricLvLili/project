class SmeltEquipItem extends ItemBase {
	public constructor() {
		super();

		this.touchChildren = false;
	}
	//mc: MovieClip
	childrenCreated() {
		super.childrenCreated();
		// this.mc = new MovieClip;
		// this.mc.x = 34;
		// this.mc.y = 34;
	};
	dataChanged() {
		this.clear();
		if (this.data instanceof ItemData) {
			this.itemConfig = this.data.itemConfig;
			this.itemIcon.setData(this.itemConfig);
			if (this.itemConfig.type == 4) {
				this.nameTxt.text = this.itemConfig.name;
			}
			else {
				// if (this.itemConfig.subType == ForgeConst.EQUIP_POS_TO_SUB[EquipPos.DZI]) {
				// 	this.nameTxt.text = this.itemConfig.name;
				// }
				// else
					this.nameTxt.text = this.itemConfig.zsLevel > 0 ? ( LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101367,[this.itemConfig.zsLevel])) : ("lv." + this.itemConfig.level);
			}
			// this.itemIcon.imgJob.source = (this.itemConfig.type == ItemType.EQUIP || this.itemConfig.type == ItemType.WING) && this.itemConfig.job && this.itemIcon.imgJob.visible ? JobItemIconConst[this.itemConfig.job] : '';
			this.itemIcon.setJobImg((this.itemConfig.type == ItemType.EQUIP || this.itemConfig.type == ItemType.WING) && this.itemConfig.job ? JobItemIconConst[this.itemConfig.job] : '')
		}else if(this.data instanceof Object)
		{
			var str = 1000 <= this.data.param ? LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101426,[this.data.param/1000]) : LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101424,[this.data.param]);
			this.nameTxt.textFlow = TextFlowMaker.generateTextFlow("<font color = '0xf87372'>"+str+"</font>");
			this.itemIcon.setItemImg("pf_suotou_01_png");
		}
	};
	onClick() {
	};
	// playEff() {
	// 	if (this.data instanceof ItemData) {
	// 		this.mc.loadFile("litboom", true, 1);
	// 		this.addChild(this.mc);
	// 	}
	// };
	clear() {
		super.clear();
		this.itemIcon.setItemImg("pf_orange_02_png")
	}
}
window["SmeltEquipItem"]=SmeltEquipItem