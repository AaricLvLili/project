class OmGifBagModel {
	private static s_instance: OmGifBagModel;
	public static get getInstance(): OmGifBagModel {
		if (!OmGifBagModel.s_instance) {
			OmGifBagModel.s_instance = new OmGifBagModel();
		}
		return OmGifBagModel.s_instance;
	}
	public list: Sproto.gift_base[] = [];
	public getNum(index): number {
		let data = this.list[index - 1];
		if (data) {
			return data.num;
		}
		return 0;
	}
	public isBuy(index: number) {
		let data = this.list[index - 1];
		if (data) {
			return data.statu > 0;
		}
		return false;
	}
	public isCanGetAward(index: number) {
		let data = this.list[index - 1];
		if (data) {
			return data.statu == 1;
		}
		return false;
	}

	public isShow(index) {
		let isOneGift = GlobalConfig.ins("UniversalConfig").isOneGift;
		if (isOneGift) {
			let data = this.list[index - 1];
			if (data) {
				return data.statu < 2;
			}
		}
		return false
	}

}
window["OmGifBagModel"] = OmGifBagModel