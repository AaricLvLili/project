class GainGoodsItem extends eui.ItemRenderer {
	public constructor() {
		super()
		this.skinName = "GainGoodsItemSkin";
	}

	desc: eui.Label

	dataChanged() {
		if (this.data) {
            var t = this.data[0];
            this.data[1],
            this.data[2];
            this.desc.text = t
        }
	};
	get userData() {
		return this.data;
	}
}
window["GainGoodsItem"]=GainGoodsItem