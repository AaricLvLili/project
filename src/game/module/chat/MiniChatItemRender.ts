class MiniChatItemRender extends eui.ItemRenderer {
	public constructor() {
		super();
	}

	private txtName: eui.Label
	private group: eui.Group
	private lab: eui.Label
	public vip_iamge: eui.Image;
	//private imgBg: eui.Image
	//actorName: ActorName

	protected createChildren() {
		super.createChildren();
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
	}
	private onClick() {
		let data: ChatInfoData = this.data;
		let gameSceneView = ViewManager.ins().getView(GameSceneView) as GameSceneView;
		if (data.teamID && gameSceneView.miniChat.currentState != "mini") {
			TeamFbSproto.ins().sendCreateTeam(data.fbId, data.teamID);
		} else if (data.id && gameSceneView.miniChat.currentState != "mini") {
			UserReadPlayer.ins().LookPlayer(data.id, 0)
			UserReadPlayer.ins().actorId = data.id;
			MessageCenter.ins().addListener(MessageDef.SHOW_OTHER_ACTOR, this.openWin, this)
		}
	}

	private openWin() {
		MessageCenter.ins().removeListener(MessageDef.SHOW_OTHER_ACTOR, this.openWin, this)
		let data: ChatInfoData = this.data;
		ViewManager.ins().open(TrRoleWin, data.id)
	}
	dataChanged() {
		super.dataChanged()
		let self = this;
		let data: ChatInfoData = self.data;
		if (self.data.type) {
			self.vip_iamge.source = self.data.isTeacher == 1 ? `comp_38_16_01_png` : `comp_43_25_01_png`
			if (self.data.isTeacher == 1 || self.data.vip > 0) {
				self.vip_iamge.visible = true
				self.vip_iamge.width = self.data.isTeacher == 1 ? 38 : 43
			} else {
				self.vip_iamge.width = 0
				self.vip_iamge.visible = false
			}
			//self.vip_iamge.validateNow();
			if (self.lab && self.lab.parent) {
				self.removeChild(self.lab)
			}

			self.lab = new eui.Label
			self.lab.textColor = 0xffffff;
			self.lab.verticalCenter = 0
			self.lab.verticalAlign = "middle"
			self.lab.size = 14
			self.lab.lineSpacing = 3
			self.addChild(self.lab)
			let s = "";
			let landata = GlobalConfig.jifengTiaoyueLg;
			switch (self.data.type) {
				case ChatType.GuildPublic:
				case ChatType.Public:
					s = "<font color = '0xFE4F7C'>[" + landata.st101719 + "]</font>";
					break;
				case ChatType.Normal:
					s = "<font color = '0xF07F2C'>[" + landata.st101402 + "]" + "<font color = '0x5DB7F6'>" + self.getNameStr();
					break;
				case ChatType.Guild:
					s = "<font color = '0xEDFF66'>[" + landata.st100896 + "]" + self._getGuidePostTxt(self.data.office) + "<font color = '0x5DB7F6'>" + self.getNameStr();
					break;
				case ChatType.TIP:
				case ChatType.System:
					s = "<font color = '0xFE4F7C'>[" + landata.st101403 + "]</font>";
					break
				case ChatType.KFChat:
					s = "<font color = '0x6AF932'>[" + landata.st100466 + "]" + "<font color = '0x5DB7F6'>" + self.getNameStr();
					break
			}
			self.txtName.textFlow = TextFlowMaker.getTextFlowByHtml(s)

			if (data.type == ChatType.Public || data.type == ChatType.System || data.type == ChatType.TIP || data.type == ChatType.GuildPublic) {
				self.lab.textFlow = TextFlowMaker.generateTextFlow("<font color = '0xffffff'>" + data.str)
			} else if (self.data.type == ChatType.Guild || self.data.type == ChatType.KFChat) {
				var n = self.filterContentStr();
				self.lab.textFlow = TextFlowMaker.getTextFlowByHtml("<font color = '0xffffff'>" + n + "</font>");
			} else if (self.data.type == ChatType.Normal) {
				self.lab.textFlow = TextFlowMaker.getTextFlowByHtml("<font color = '0xffffff'>" + data.str + "</font>");
			}
			self.validateNow();
			let border = 0;//边距
			let txtWidth = self.width - self.group.width - border * 2;
			self.lab.x = self.group.width + border * 1.5;
			if (self.lab.width > txtWidth) {
				self.lab.width = txtWidth;
				self.lab.validateNow();
			}
			//self.imgBg.x = self.group.width;
			//self.imgBg.width = self.lab.width + border * 2
			//self.imgBg.height = self.lab.height + border

		}
	}
	private _getGuidePostTxt(lv: GuildOffice): string {
		let data = GlobalConfig.jifengTiaoyueLg;
		switch (lv) {
			case GuildOffice.GUILD_MEMBER:
				return `<font color = '0xffffff'>[` + data.st100934 + `]</font>`
			case GuildOffice.GUILD_JINGYING:
				return `<font color = '0x008f22'>[` + data.st101504 + `]</font>`
			case GuildOffice.GUILD_TANGZHU:
				return `<font color = '0x6AF932'>[` + data.st101505 + `]</font>`
			case GuildOffice.GUILD_HUFA:
				return `<font color = '0xEDFF66'>[` + data.st101506 + `]</font>`
			case GuildOffice.GUILD_ZHANGLAO:
				return `<font color = '0xEDFF66'>[` + data.st101507 + `]</font>`
			case GuildOffice.GUILD_FUBANGZHU:
				return `<font color = '0xFE4F7C'>[` + data.st101508 + `]</font>`
			case GuildOffice.GUILD_BANGZHU:
				return `<font color = '0xF07F2C'>[` + data.st101036 + `]</font>`
			default:
				return ``
		}
	}
	/**
	 * 0xF07F2C 橙色
	 * 0xFE4F7C 红色
	 * 0x6AF932 绿色
	 * 0xEDFF66 黄色
	 */
	filterContentStr() {
		let self = this
		var t = "";
		if (self.data && self.data.str) {
			t = self.data.str;
			for (var e = "<",
				i = "&lt;",
				s = t.indexOf(e, 0); s >= 0;) t = t.replace(e, i),
					s = t.indexOf(e, s + i.length)
		}
		return t
	}
	getImageSpaceStr() {
		// if (self.data.vip <= 0 && self.data.isTeacher == 0)
		// 	return "";
		let self = this
		var _w: number = 0;
		let nameWidth = 43;//vip的宽度
		let instructorImg = 77;//指导员的宽度
		if (self.data.vip > 0) {
			_w = nameWidth;
		}
		if (self.data.isTeacher == 1) {
			_w = _w + instructorImg;
		}
		if (_w == 0) {
			return "";
		}
		self.lab.text = "";
		let str = "";
		while (self.lab.textWidth < _w) {
			str += " ";
			self.lab.text = str;
		}
		// for (let s = self.lab.textWidth, n = Math.ceil(nameWidth / s), a = 0; n > a; a++) {
		// 	str += " "
		// }
		return str
	}

	getNameStr() {
		return this.data.name ? "<u>" + this.data.name + "</u>" : ""
	}

	static IMAGE_POS_X = -1
}
window["MiniChatItemRender"] = MiniChatItemRender