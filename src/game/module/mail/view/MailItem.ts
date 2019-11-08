class MailItem extends eui.ItemRenderer {

	tipLabel
	nameLabel
	dateLabel
	treasure

	public constructor() {
		super()

		this.skinName = "MailItemSkin"
		this.tipLabel = null
	}

	dataChanged() {
		var e = this.data;
		if(this.nameLabel == null)
			return ;
		e instanceof MailData && (this.nameLabel.text = "" + e.title, this.dateLabel.text = DateUtils.getFormatBySecond(e.times, 2), this.treasure.source = 0 == e.receive ? "propIcon_151_png" : ""), this.tipLabel || (this.tipLabel = new eui.Label, this.tipLabel.fontFamily = "Microsoft YaHei", this.tipLabel.x = this.nameLabel.x + this.nameLabel.width, this.tipLabel.y = this.nameLabel.y, this.tipLabel.size = this.nameLabel.size, this.addChild(this.tipLabel)), this.tipLabel.text = e.type ? "(已读)" : "(未读)", this.tipLabel.textColor = e.type ? 5987163 : 52275
	}
}
window["MailItem"]=MailItem