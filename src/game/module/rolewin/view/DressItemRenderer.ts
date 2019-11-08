class DressItemRenderer extends eui.ItemRenderer {
	public constructor() {
		super()
		this.skinName = "DressItemSkin"
	}

	redPoint0
	timelabel: eui.Label
	imgIcon: eui.Image
	imageName: eui.Label
	huanhuaImage
	levellabel: eui.Label
	selectImage: eui.Image

	private zhuangBanId: any;
	dataChanged() {
		super.dataChanged();
		var data: DressItemInfo = this.data;
		if (data.isTitle) {
			this._updataTitle()
			return
		}
		let timeInfo = GameGlobal.dressmodel.timeInfo;
		if (this.zhuangBanId == null) {
			this.zhuangBanId = GlobalConfig.ins("ZhuangBanId");
		}
		if (null != data) {
			let cfgZhuanban = this.zhuangBanId[data.zhuanban.id]
			let iconName = cfgZhuanban ? cfgZhuanban.cost.itemId : ""
			iconName = GlobalConfig.itemConfig[iconName] ? GlobalConfig.itemConfig[iconName].icon : iconName
			if (this.redPoint0.visible = !1, data.isUser) this.timelabel.visible = !0, this.imgIcon.source = ResDataPath.GetItemFullName(iconName);
			else {
				this.timelabel.visible = !1
				this.imgIcon.source = ResDataPath.GetItemFullName(iconName)
				// this.imgIcon.source = "dress" + e.zhuanban.id + "d_png";
				//UserBag.ins().getBagGoodsCountById(0, t) >= i && (3 == data.zhuanban.pos && GameGlobal.actorModel.level <= 16 ? this.redPoint0.visible = !1 : this.redPoint0.visible = !0)
			}
			this.setRedVisible(data);
			if (this.imageName.text = data.zhuanban.name, data.isDress ? this.huanhuaImage.visible = !0 : this.huanhuaImage.visible = !1, 0 == data.timer) {
				this.timelabel.textFlow = (new egret.HtmlTextParser).parser("<font color='#00ff00'>" + GlobalConfig.jifengTiaoyueLg.st100627 + "</font>"), this.levellabel.visible = !0;
				var n = GameGlobal.dressmodel.getinfoById(data.zhuanban.id);
				this.levellabel.text = n.dressLevel + GlobalConfig.jifengTiaoyueLg.st100093;
			} else data.timer > 0 ? (this.timelabel.text = this.updateTimer(data.timer), this.levellabel.visible = !1) : (this.timelabel.visible = !1, this.levellabel.visible = !1)

			this.UpdateSelect()
		}
	}
	private _updataTitle(): void {
		let self = this
		let data: DressItemInfo = this.data
		self.timelabel.visible = data.timer >= 0
		self.timelabel.text = data.timer == 0 ? GlobalConfig.jifengTiaoyueLg.st100627 : this.updateTimer(data.timer)
		self.imageName.text = data.zhuanban.name
		self.huanhuaImage.visible = data.isDress
		self.imgIcon.source = ResDataPath.GetItemFullName(data.zhuanban.iconID)
		this.UpdateSelect();
	}
	private setRedVisible(data: DressItemInfo): void {
		var t = data.zhuanban.cost.itemId,
			i = data.zhuanban.cost.num;
		var n = GameGlobal.dressmodel.getinfoById(data.zhuanban.id);
		if (n) {
			if (UserBag.ins().getBagGoodsCountById(0, t) >= i && n.dressLevel < 5) //&& GameGlobal.actorModel.level > 16
			{
				this.redPoint0.visible = true;
			} else {
				this.redPoint0.visible = false;
			}
		} else {
			if (UserBag.ins().getBagGoodsCountById(0, t) >= i) //&& GameGlobal.actorModel.level <= 16
			{
				this.redPoint0.visible = true;
			} else {
				this.redPoint0.visible = false;
			}
		}
	}
	public UpdateSelect() {
		let data: DressItemInfo = this.data
		if (data == null || data.context == null) {
			return
		}
		let dressId = null
		switch (data.zhuanban.pos) {
			case DressType.ROLE:
				dressId = data.context.mDressBody
				break
			case DressType.ARM:
				dressId = data.context.mDressWeapon
				break
			case DressType.WING:
				dressId = data.context.mDressWing
				break
			case DressType.MOUNT:
				dressId = data.context.mDressMount
				break
			case DressType.TaoZhuang:
				dressId = data.context.mDressTao
				break
		}
		if (data.isTitle) dressId = data.context.mDressTitle
		this.selectImage.visible = dressId == (data.zhuanban.id || data.zhuanban.Id)

	}

	updateTimer(e) {
		var t = "",
			i = e - GameServer.serverTime;
		return t = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100628, [(i / 24 / 3600 >> 0), (i / 3600 % 24 >> 0), (i / 60 % 60 >> 0)]);
	}
}
window["DressItemRenderer"] = DressItemRenderer