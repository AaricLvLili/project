class ChatListItemRenderer extends eui.ItemRenderer {
	public constructor() {
		super()

		this.skinName = "ChatItemSkin"
	}

	btn_friend
	btn_blackList
	head
	posX
	// monthcard
	// nameLabel
	// vip
	frame
	// vipImg
	showText
	/** 指导员图片*/
	private instructorImg: eui.Image;
	//actorName: ActorName
	private vip_image: eui.Image;
	private name_label: eui.Label;
	private group: eui.Group;

	childrenCreated() {
		super.childrenCreated();
		this.addEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.addedToStage, this);
	}
	dataChanged() {
		super.dataChanged()
		let data = <ChatInfoData>this.data
		this.head.source = JobHeadIconConst.GetIcon(data.job, data.sex)
		this.frame && this.frame.changeState && this.frame.changeState instanceof Function && this.frame.changeState(1)
		this.showText.textFlow = new egret.HtmlTextParser().parser(data.str);
		this.name_label.text = data.name;
		//this.actorName.Set(data.name, this.data.vip, data.monthCard, data.superMonthCard)

		this.instructorImg.visible = data.isTeacher == 1;
		this.vip_image.visible = this.data.vip > 0;


		var child: egret.DisplayObject;
		var _x: number = 0;
		for (var i: number = 0; i < this.group.numChildren; i++) {
			child = this.group.getChildAt(i);
			if (child.visible) {
				child.x = _x;
				_x = _x + child.width;
			}
		}
	}

	private addedToStage(e: egret.TouchEvent): void {

	}



}
window["ChatListItemRenderer"] = ChatListItemRenderer