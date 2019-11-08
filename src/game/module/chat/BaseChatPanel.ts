class BaseChatPanel extends BaseView {
	public constructor() {
		super()
	}

	public barList: eui.Scroller;
	defaultText
	chatInput

	_selectIndex
	chatList
	sendBtn
	oldItem: ChatListItemRenderer

	childrenCreated() {
		this.defaultText = GlobalConfig.jifengTiaoyueLg.st101711;
		this.chatInput && (this.chatInput.maxChars = 40)
	}
	open(...t: any[]) {
		this._selectIndex = t[0]
		this.addEvent(egret.FocusEvent.FOCUS_IN, this.textFocusIn, this, this.chatInput)
		this.addEvent(eui.CollectionEvent.COLLECTION_CHANGE, this.collectionChange, this, this.chatList.dataProvider)
		this.addTouchEvent(this, this.onTap, this.sendBtn)
		this.addItemTapEvent(this, this.onTapChatList, this.chatList)
		this.observe(Chat.ins().postSendInfoSuccess, this.textInOn)
		this.refresh()
	}
	close() {
		// this.removeObserve()
	}

	public release() {
		this.removeObserve();
		this.barList.stopAnimation();
	}
	onTapChatList(t) {
		// var e:ChatListItemRenderer = t.itemRenderer as ChatListItemRenderer;
		// (e != this.oldItem || this.oldItem.getFriendGroup()) && (this.oldItem && this.oldItem.setFriendGroup(!1), this.oldItem = e)
	}
	textInOn() {
		this.chatInput && (this.chatInput.text = "")
	}
	textFocusIn() {
		this.chatInput && GlobalConfig.jifengTiaoyueLg.st101405 == this.chatInput.text && (this.chatInput.text = "")
	}
	onTap(t) {
		BaseChatPanel.Send(this._selectIndex, this.chatInput.text, () => {
			// if (1 == this._selectIndex) {
			this.textInOn()
			// }
		})
	}

	public static Send(channelType: number, msg: string, sucCallback: Function = null) {
		var e = Chat.ins().speakState(channelType)
		var func = () => {
			if (msg.length < 1 || GlobalConfig.jifengTiaoyueLg.st101405 == msg) {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101400)
				return
			}

			if (2 == channelType) {
				Guild.ins().sendGuildMessage(msg)
				Chat.ins().startupSpeakTime(channelType)
			} else {
				if (Chat.ins().checkRepeatString(msg)) {
					if (channelType == 1)
						Chat.ins().sendChatInfo(8, msg, 0, e > 0)
					else
						Chat.ins().sendChatInfo(7, msg, 0, e > 0)
				}
				Chat.ins().UpSpeak = msg
				Chat.ins().startupSpeakTime(channelType)
			}

			if (sucCallback) {
				sucCallback()
			}
		};
		if (0 > e) {
			return void UserTips.ins().showTips(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101712, [Math.abs(e)]))
		}
		if (e > 0) {
			if (0 == channelType) {
				if (Chat.ins().isNoShowTipsPanel) {
					// var n = GlobalConfig.ins("ChatConstConfig"),
					// 	a = (GameServer.serverTime - Chat.ins().publicCD) / 1e3;
					// a >= n.chatCd ? (Chat.ins().publicCD = GameServer.serverTime, s()) : UserTips.ins().showTips("|C:0xf87372&T:您发言太快了|")
				} else {
					ViewManager.ins().open(ChatTipsWin, e, func);
				}
			} else {
				UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101713);
			}
		}
		else {
			func()
		}
	}

	collectionChange(t) {
		this.refresh()
	}
	refresh() {
		this.addEventListener(egret.Event.ENTER_FRAME, this.refushBarList, this)
	}
	refushBarList() {
		this.removeEventListener(egret.Event.ENTER_FRAME, this.refushBarList, this);
		if (this.barList && this.barList.viewport) {
			this.barList.viewport.contentHeight > this.barList.height && (this.barList.viewport.scrollV = this.barList.viewport.contentHeight - this.barList.height)
		}
	}
}
window["BaseChatPanel"] = BaseChatPanel