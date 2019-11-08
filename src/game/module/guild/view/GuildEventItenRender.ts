class GuildEventItenRender extends eui.ItemRenderer {
	public constructor() {
		super();

		this.skinName = "GuildEventItemSkin";
	}
	info

	dataChanged() {
		if (typeof this.data == 'string') {
			var str = this.data;
			if (str && str != "")
				this.info.textFlow = new egret.HtmlTextParser().parser(str);
		}
	};
}
window["GuildEventItenRender"]=GuildEventItenRender