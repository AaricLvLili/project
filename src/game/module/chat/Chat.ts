class Chat extends BaseSystem {

	//聊天数据
	chatInterval = 5000;
	charMax = 50;
	miniChatMax = 30;
	canSpeak = true;
	UpSpeak = "";
	/**迷你聊天数据 */
	minichatList = new eui.ArrayCollection();
	worldchatList = new eui.ArrayCollection
	kfChatList = new eui.ArrayCollection
	syschatList = new eui.ArrayCollection
	guildchatList = new eui.ArrayCollection

	_chatList
	_systemList

	miniChatOpenStatus: boolean = false;
	//isfristOpen: boolean = true;

	isNoShowTipsPanel = false;
	publicCD = 0;
	allChatList: Array<eui.ArrayCollection>

	public constructor() {
		super();

		this.sysId = PackageID.Chat;
		this.regNetMsg(S2cProtocol.sc_chat_new_msg, this.doNewChatMsg);
		// this.regNetMsg(2, this.doSystemInfo);
		this.regNetMsg(S2cProtocol.sc_chat_is_send_success, this.doIsSendSuccess);
		this.regNetMsg(S2cProtocol.sc_chat_system_message, this.doSystemMessage);
		this.regNetMsg(S2cProtocol.sc_chat_msg_delete, this.doGmDeleteMessage);
	}

	public Init(): void {
		this.m_PreTime = egret.getTimer()
		this.m_GapTimer = GlobalConfig.ins("ChatConstConfig").chatTipsRefresh * 60 * 1000
		TimerManager.ins().doTimer(60000, 0, this._DoUpdate, this)
		
	}

	private m_PreTime = 0
	private m_GapTimer = 5 * 60 * 1000

	private _DoUpdate() {
		if (egret.getTimer() - this.m_PreTime > this.m_GapTimer) {
			this.m_PreTime = egret.getTimer()
			let val = MathUtils.limitInteger(1, CommonUtils.getObjectLength(GlobalConfig.ins("ChatTipsConfig")))
			let str = GlobalConfig.ins("ChatTipsConfig")[val]
			if (str) {
				var data = new ChatInfoData()
				data.type = ChatType.TIP
				data.str = str.chatTips
				Chat.ins().setMinichatData(data)
			} else {
				console.log("random value is error => " + val)
			}
		}
	}

	static ins(): Chat {
		return super.ins();
	};

	sendChatInfo(type, str, pointId = 0, s) {
		if (str.length <= 0) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101400);
			return;
		}
		let req = new Sproto.cs_chat_send_info_request
		req.str = str

		// var bytes = this.getBytes(1);
		// bytes.writeByte(type);
		// bytes.writeUnsignedInt(pointId);
		// bytes.writeString(str);
		// bytes.writeBoolean(s)
		// this.sendToServer(bytes);
		req.type = type
		req.pointId = pointId
		req.bool = s
		this.Rpc(C2sProtocol.cs_chat_send_info, req)
	};
	/**收到新的新的聊天消息 */
	doNewChatMsg(bytes: Sproto.sc_chat_new_msg_request) {
		var message = new ChatInfoData(bytes);
		this.postNewChatMsg(message);
	};
	removeChatWithId(t) {
		if (this.worldchatList) {
			for (var e = [], i = 0; i < this.worldchatList.length; i++) {
				var s = this.worldchatList.getItemAt(i);
				s.id != t && e.push(s)
			}
			this.worldchatList.source = e
		}
		if (this.minichatList) {
			for (var e = [], i = 0; i < this.minichatList.length; i++) {
				var s = this.minichatList.getItemAt(i);
				s.id != t && e.push(s)
			}
			this.minichatList.source = e
		}
	}

	/**移除某个玩家的聊天消息*/
	public doGmDeleteMessage(bytes: Sproto.sc_chat_msg_delete_request): void {
		if (this.worldchatList) {
			for (var e = [], i = 0; i < this.worldchatList.length; i++) {
				var chat = this.worldchatList.getItemAt(i);
				if (chat.id != bytes.id)
					e.push(chat)
			}
			this.worldchatList.source = e
		}

		if (this.kfChatList) {
			for (var e = [], i = 0; i < this.kfChatList.length; i++) {
				var chat = this.kfChatList.getItemAt(i);
				if (chat.id != bytes.id)
					e.push(chat)
			}
			this.kfChatList.source = e
		}

		if (this.minichatList) {
			for (var e = [], i = 0; i < this.minichatList.length; i++) {
				var chat = this.minichatList.getItemAt(i);
				if (chat.id != bytes.id)
					e.push(chat)
			}
			this.minichatList.source = e
		}
	}

	//派发一条聊天消息
	postNewChatMsg(message) {
		// if (!this._chatList) {
		// 	this._chatList = [];
		// }
		// if (this._chatList.length >= this.charMax) {
		// 	this._chatList.splice(0, 1);
		// }
		// this._chatList.push(message);
		// this.setMinichatData(message);
		// return message;
		if (message.type == ChatType.KFChat)
			this.setKfChatListData(message)
		else
			this.setWorldchatData(message)
		this.setMinichatData(message)
		return message
	};
	// doSystemInfo(bytes) {
	// };
	doIsSendSuccess(bytes: Sproto.sc_chat_is_send_success_request) {	
		if (bytes.success) {
			this.postSendInfoSuccess();
		//	GameGlobal.MessageCenter.dispatch(MessageDef.CHAT_SEND_SUCCESS_UPDATE);
		}
	};
	/**派发新发送消息成功 */
	postSendInfoSuccess() {
	};
	doSystemMessage(bytes: Sproto.sc_chat_system_message_request) {
		var level = bytes.level; //玩家的等级，低于这个等级则不显示这个信息 0表示不限制
		var type = bytes.type;
		var str = bytes.str;
		if (level == 0 || GameLogic.ins().actorModel.level >= level) {
			switch (type) {
				case 4:
					ErrorLog.ins().show(str);
					break;
				default:
					UserTips.ins().showTips(str);
					break;
			}
		}
	};

	get chatList() {
		if (!this._chatList) {
			this._chatList = [];
		}
		return this._chatList;
	}
	startInterval() {
		this.canSpeak = false;
		TimerManager.ins().doTimer(this.chatInterval, 1, this.timeDo, this);
	};
	timeDo() {
		this.canSpeak = true;
	};
	postSysChatMsg(message) {                                   //添加  系统消息
		this.setSyschatData(message)
		return message
		// if (!this._systemList) {
		// 	this._systemList = [];
		// }
		// if (this._systemList.length >= this.charMax) {
		// 	this._systemList.splice(0, 1);
		// }
		// this._systemList.push(message);
		// this.setMinichatData(message);
		// return message;
		// MessageCenter.ins().dispatch(MessagerEvent.GET_NEW_MESSAGE,message);
		// UserChat.postNewChatMsg(message);
	};
	get systemList() {
		if (!this._systemList) {
			this._systemList = [];
		}
		return this._systemList;
	}
	checkRepeatString(str) {
		var len = str.length;
		if (len <= 10) {
			return true;
		}
		var repeatNum = 0;
		for (var i = 0; i < len; i++) {
			var strIndex = str.charAt(i);
			if (this.UpSpeak.lastIndexOf(strIndex) != -1) {
				++repeatNum;
			}
		}
		if (repeatNum >= 10) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101639);
			return false;
		}
		return true;
	};
	/**设置迷你面板聊天数据 */
	private _timeOut:number =-1;
	setMinichatData(val: ChatInfoData) {
		if (this.minichatList.length >= this.miniChatMax) {
			this.minichatList.removeItemAt(0);
		}
		this.minichatList.addItem(val);
		this.minichatList.source.sort(this.miniChatSortFunction),
			this.minichatList.refresh()
		MiniChatPanel.Refresh()
	
		if (this._timeOut > -1) {
			return
		}
		this._timeOut = setTimeout(() => {
			GameGlobal.MessageCenter.dispatch(MessageDef.CHAT_RECEIVE_SUCCESS_UPDATE);
			clearTimeout(this._timeOut)
			this._timeOut = -1
		}, 0);
	};

	miniChatSortFunction(t, e) {
		return t.sendTime && e.sendTime ? t.sendTime - e.sendTime : 0
	}
	setWorldchatData(t) {
		if (this.worldchatList.length >= this.charMax) {
			this.worldchatList.removeItemAt(0)
		}
		this.worldchatList.addItem(t)
	}

	setKfChatListData(t) {
		if (this.kfChatList.length >= this.charMax) {
			this.kfChatList.removeItemAt(0)
		}
		this.kfChatList.addItem(t)
	}

	setGuildchatData(t) {
		if (this.guildchatList.length >= this.charMax) {
			this.guildchatList.removeItemAt(0)
		}
		this.guildchatList.addItem(t)
		this.guildchatList.refresh()
		Chat.ins().setMinichatData(t)
	}
	setSyschatData(t) {
		if (this.syschatList.length >= this.charMax) {
			this.syschatList.removeItemAt(0)
		}
		this.syschatList.addItem(t)
		Chat.ins().setMinichatData(t)
	}
	speakState(t) {
		// var e = GlobalConfig.ins("ChatConstConfig");
		// if (Assert(e, "ChatConstConfig data is null, please check!")) return 0;
		// if (UserFb.ins().guanqiaID < e.checkLevel) return - e.checkLevel;
		// if (0 == t) {
		// 	if (this.worldSpeakTimeCD > 0) return this.worldSpeakTimeCD
		// } else if (this.guildSpeakTimeCD > 0) return this.guildSpeakTimeCD;
		return 0
	}

	startupSpeakTime(t) {
		// var e = GlobalConfig.ins("ChatConstConfig");
		// 0 == t ? this.worldSpeakTimeCD = this.worldSpeakTimeCD > 0 ? this.worldSpeakTimeCD : e.worldChatCd : 1 == t && (this.guildSpeakTimeCD = this.guildSpeakTimeCD > 0 ? this.guildSpeakTimeCD : e.guildChatCd),
		// 	this.worldSpeakTimeCD > 0 && (TimerManager.ins().isExists(this.updateWorldCD, this) || TimerManager.ins().doTimer(1e3, this.worldSpeakTimeCD, this.updateWorldCD, this)),
		// 	this.guildSpeakTimeCD > 0 && (TimerManager.ins().isExists(this.updateGuildCD, this) || TimerManager.ins().doTimer(1e3, this.guildSpeakTimeCD, this.updateGuildCD, this))
	}

	updateWorldCD() {
		this.worldSpeakTimeCD-- ,
			this.worldSpeakTimeCD <= 0 && TimerManager.ins().remove(this.updateWorldCD, this)
	}
	updateGuildCD() {
		this.guildSpeakTimeCD-- ,
			this.guildSpeakTimeCD <= 0 && TimerManager.ins().remove(this.updateGuildCD, this)
	}
	worldSpeakTimeCD = 0
	guildSpeakTimeCD = 0

	public ClearMsg() {
		this.minichatList = new eui.ArrayCollection([])
		this.worldchatList = new eui.ArrayCollection([])
		this.kfChatList = new eui.ArrayCollection([])
		this.guildchatList = new eui.ArrayCollection([])
		this.allChatList = null
	}
	public getChatByType(type: ChatTabbarType): eui.ArrayCollection {
		switch (type) {
			case ChatTabbarType.All:
				return this.minichatList
			case ChatTabbarType.World:
				return this.worldchatList
			case ChatTabbarType.Guild:
				return this.guildchatList
			case ChatTabbarType.KF:
				return this.kfChatList
			case ChatTabbarType.System:
				return this.syschatList
			default:
				return null
		}
	}

	static SEND_CHAT_INFO = "SEND_CHAT_INFO";
}

enum ChatType {
	/**公告 */
	Public = 1,
	/**系统 */
	System = 2,
	/**聊天 */
	Normal = 7,
	/**跨服 */
	KFChat = 8,
	/**公会聊天 */
	Guild = 3,
	/**公会公告 */
	GuildPublic = 4,
	/** 系统提示 */
	TIP = 10,
}
enum ChatTabbarType {
	None = -1,
	All = 0,
	World = 1,
	Guild = 2,
	KF = 3,
	System = 4,
}

MessageCenter.compile(Chat);
window["Chat"]=Chat