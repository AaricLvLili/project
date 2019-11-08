class TheGunAwardItem extends eui.ItemRenderer {
	public constructor() {
		super();
	}
	public m_ItemList: eui.List;
	public m_Cont: eui.Label;
	public m_GetBtn: eui.Button;
	public m_GetTxt: eui.Label;
	public m_GetImg: eui.Image;

	private listData: eui.ArrayCollection;
	public createChildren() {
		super.createChildren();
		this.addEvent();
		this.m_ItemList.itemRenderer = ItemBase;
		this.listData = new eui.ArrayCollection();
		this.m_ItemList.dataProvider = this.listData;
		this.m_GetTxt.text = GlobalConfig.jifengTiaoyueLg.st100680;
	}

	private addEvent() {
		this.m_GetBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickGetBtn, this)
	}
	public dataChanged() {
		super.dataChanged();
		let spearAchievementConfig = GlobalConfig.ins("SpearAchievementConfig")[this.itemIndex + 1];
		if (spearAchievementConfig) {
			this.listData.removeAll();
			this.listData.replaceAll(spearAchievementConfig.award);
			this.listData.refresh();
			this.m_Cont.text = spearAchievementConfig.shuoMing;
		}
		let type = this.data
		switch (type) {
			case 1:
				this.m_GetBtn.visible = true;
				this.m_GetTxt.visible = false
				this.m_GetImg.visible = false
				this.m_GetBtn.label = GlobalConfig.jifengTiaoyueLg.st101076;//"领 取";
				break;
			case 0:
				//没达到要求
				this.m_GetBtn.visible = false;
				this.m_GetTxt.visible = true
				this.m_GetImg.visible = false
				this.m_GetBtn.label = GlobalConfig.jifengTiaoyueLg.st101076;//"领 取";
				break;
			case 2:
				this.m_GetBtn.visible = false;
				this.m_GetTxt.visible = false
				this.m_GetImg.visible = true
				this.m_GetBtn.label = GlobalConfig.jifengTiaoyueLg.st100981;//"已领取";
				break;
		}
	}

	private onClickGetBtn() {
		let spearAchievementConfig = GlobalConfig.ins("SpearAchievementConfig")[this.itemIndex + 1];
		if (spearAchievementConfig) {
			TheGunSproto.ins().sendTheGunGetAward(spearAchievementConfig.rankMin);
		}
	}

}
window["TheGunAwardItem"] = TheGunAwardItem