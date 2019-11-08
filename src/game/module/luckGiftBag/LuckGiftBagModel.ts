class LuckGiftBagModel {
	private static s_instance: LuckGiftBagModel;
	public static get getInstance(): LuckGiftBagModel {
		if (!LuckGiftBagModel.s_instance) {
			LuckGiftBagModel.s_instance = new LuckGiftBagModel();
		}
		return LuckGiftBagModel.s_instance;
	}
	public constructor() {
	}
	public luckGiftData: Dictionary<Sproto.luckypackage_row> = new Dictionary<Sproto.luckypackage_row>();
	public isModelOpen: boolean = false;
	public setLuckGiftData(lickGiftData: Sproto.luckypackage_row[]) {
		this.luckGiftData.clear();
		for (var i = 0; i < lickGiftData.length; i++) {
			this.luckGiftData.set(lickGiftData[i].id, lickGiftData[i]);
		}
	}

	public cleckAllRedPoint() {
		let luckDatas: Sproto.luckypackage_row[] = this.luckGiftData.values;
		let isBuy: boolean = false;
		for (var i = 0; i < luckDatas.length; i++) {
			isBuy = this.cleckRedPoint(luckDatas[i].id);
			if (isBuy == true) {
				return isBuy;
			}
		}
		return isBuy;
	}

	public cleckRedPoint(id: number): boolean {
		let luckData = this.luckGiftData.get(id);
		if (luckData) {
			let configData = GlobalConfig.ins("ActivityGiftConfig")[luckData.id];
			if (configData && luckData) {
				let buyNum = configData.limitTimes - luckData.num;
				if (buyNum <= 0) {
					return false;
				}
			}
			return true;
		}
		return false;
	}
}
window["LuckGiftBagModel"]=LuckGiftBagModel