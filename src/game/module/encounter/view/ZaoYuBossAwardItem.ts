class ZaoYuBossAwardItem extends eui.Component {
	public constructor() {
		super();
		this.skinName = "ZaoYuBossAwardItemSkin";
	}
	public m_MainGroup: eui.Group;
	public m_ItemBase: ItemBase;
	public m_MaskImg: eui.Group;
	public m_NoGoldLab: eui.Label;
	public point: number;
	public index: number;

	public isGet: boolean = false;
	public m_GoldGroup: eui.Group;
	public m_GoldLab: eui.Label;

	public gold: number = 0;

	public createChildren() {
		super.createChildren();
		this.m_GoldGroup.visible = false;
		this.m_NoGoldLab.visible = false;
		this.m_NoGoldLab.text = GlobalConfig.jifengTiaoyueLg.st100740;
	}
	public setData(award: Sproto.reward_data) {
		// let itemConfig = GlobalConfig.ins("ItemConfig")[award.id];
		// if (itemConfig) {
		// 	this.m_ItemBase.setDataByConfig(itemConfig);
		// 	this.m_ItemBase.setCount(award.count);
		// } else {
		this.m_ItemBase.data = award;
		this.m_ItemBase.dataChanged();
		// }
	}

	public addEvt() {
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}

	public removeEvt() {
		this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
	}

	public release() {
		egret.Tween.removeTweens(this);
		this.removeEvt();
	}

	private onClick() {
		if (this.isGet == false) {
			let yb: number = GameLogic.ins().actorModel.yb;
			if (yb >= this.gold) {
				Encounter.ins().sendZaoYuBossAward(this.index);
			} else {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100008);
			}
		}
	}

	public sendGetItem() {
		Encounter.ins().sendZaoYuBossAward(this.index);
	}
	public setGood(value: number) {
		if (this.isGet == false) {
			this.gold = value;
			this.m_GoldLab.text = this.gold + "";
			if (value == 0) {
				this.m_NoGoldLab.visible = true;
				this.m_GoldGroup.visible = false;
			} else if (value > 0) {
				this.m_NoGoldLab.visible = false;
				this.m_GoldGroup.visible = true;
			}
		} else {
			this.m_NoGoldLab.visible = false;
			this.m_GoldGroup.visible = false;
		}
	}

}
window["ZaoYuBossAwardItem"] = ZaoYuBossAwardItem