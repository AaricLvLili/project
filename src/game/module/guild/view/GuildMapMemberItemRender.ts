class GuildMapMemberItemRender extends eui.ItemRenderer {
	conLab
	office
	nameLab
	public constructor() {
		super();
		this.skinName = "gongxianitemSkin";
	}


	dataChanged() {
		if (this.data instanceof GuildMemberInfo) {
			var info = this.data;
			if (info) {
			//	this.conLab.textColor = this.office.textColor = this.nameLab.textColor = 0x535557;
				this.nameLab.text = info.name;
				this.office.text = GuildLanguage.guildOffice(info.office);
				this.conLab.text = info.curContribution + "";
			}
		}
	};
}

window["GuildMapMemberItemRender"]=GuildMapMemberItemRender