class GuildMemberItem1Render extends eui.ItemRenderer {
	public constructor() {
		super();

		this.skinName = "MemberItemSkin";
	}

	nameLab: ActorName
	office
	conLab
	// monthcard
	// vip
	// vipTitle

	dataChanged() {
		if (this.data instanceof GuildMemberInfo) {
			var info = this.data;
			if (info) {
				// this.nameLab.text = info.name;
				this.office.text = GuildLanguage.guildOffice(info.office);
				this.conLab.text = info.contribution + "";
				// this.monthcard.visible = info.monthCard == 1;
				// this.vip.removeChildren();
				// this.vip.addChild(BitmapNumber.ins().createNumPic(info.vipLevel, '5'));
				// this.vip.visible = info.vipLevel > 0;
				// this.vipTitle.visible = info.vipLevel > 0;
				this.nameLab.Set(info.name, info.vipLevel, info.monthCard, info.superMonthCard)
			}
		}
	};
}
window["GuildMemberItem1Render"]=GuildMemberItem1Render