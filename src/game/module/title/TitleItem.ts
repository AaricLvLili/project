class TitleItem extends eui.ItemRenderer {
	public constructor() {
		super();
	}
	btnSet: eui.CheckBox
	img
	labLack
	rareText
	labRare
	powLabel
	timeTF
	mc: MovieClip

	onTap(e) {
		if (e.target == this.btnSet) {
			//设置称号
			// MessageCenter.ins().dispatch(MessagerEvent.TITLE_SET, this.data);
			Title.ins().postUseTitle(this.data);
		}
		else {
			//展开、收起
			// this.currentState = this.currentState != 'expand' ? 'expand' : 'simple';
		}
	};
	dataChanged() {
		if (this.data instanceof TitleInfo) {
			var titleInfo = this.data;
			var i = titleInfo.config.img.split("_");
			//称号外观
			// if(i[2] && "png" != i[2]) {
			if (titleInfo.config.img.indexOf("eff_title") != -1 ) {
				this.mc || (this.mc = new MovieClip, this.mc.x = 80, this.mc.y = 60)
				this.mc.loadUrl(ResDataPath.GetUIEffePath(titleInfo.config.img), !0)
				// if (titleInfo.config.Id == 7) {
				// 	this.mc.scaleX = this.mc.scaleY = 0.7
				// } else if (titleInfo.config.Id == 16) {
				// 	this.mc.scaleX = this.mc.scaleY = 0.9
				// } else {
				// 	this.mc.scaleX = this.mc.scaleY = 1
				// }

				this.addChild(this.mc)
				this.img.source = ""
			} else {
				this.img.source = titleInfo.config.img
			}
			//更新按钮的显示
			if (titleInfo.endTime >= 0) {
				// this.btnSet.label = titleInfo.config.Id == Title.ins().showID ? '卸下' : Title.ins().showID ? '更换' : '穿戴';
				this.btnSet.selected = titleInfo.config.Id == Title.ins().showID
				this.btnSet.visible = true;
				this.labLack.visible = false;
			}
			else {
				this.btnSet.visible = false;
				this.labLack.visible = true;
			}
			//稀有度
			if (typeof TitleItem.rareText[titleInfo.config.rare] == 'string') {
				var rareStr: string = TextFlowMaker.generateTextFlow('稀有度：|C:' + TitleItem.rareText[titleInfo.config.rare]).toString();
				TitleItem.rareText[titleInfo.config.rare] = rareStr;
			}
			this.labRare.textFlow = TitleItem.rareText[titleInfo.config.rare];
			this.powLabel.text = titleInfo.power;
			
			if (this.data.endTime <= 0) {
				this.timeTF.visible = false
			} else {
				this.timeTF.visible = true;
				this.timeTF.text = DateUtils.getFormatBySecond(this.data.endTime - GameServer.serverTime, 5, 4);
			}
			this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		}
		else {
			this.timeTF.visible = false;
			this.img.source = '';
			this.powLabel.text = "";
			this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		}
	};
	/** 稀有度列表 */
	static rareText = [
		'0xfbf8ee&T:普通',
		'0x00ff3c&T:稀有',
		'0x066eba&T:珍贵',
		'0xd200ff&T:国器',
		'0xf45601&T:无双',
	];
}
window["TitleItem"]=TitleItem