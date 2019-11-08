class MiniChatPanel extends BaseComponent {
    public constructor() {
        super();
        this.skinName = "MiniChatSkin";
    }

    list: eui.List
    public scroller_chat: eui.Scroller;

    public m_Btn1: eui.Button;
    public m_Btn2: eui.Button;
    public m_Btn3: eui.Button;
    public m_Btn4: eui.Button;
    public m_Btn5: eui.Button;



    btnSend: eui.Button
    // channel: eui.Button
    private txtTips: eui.Label
    private groupSend: eui.Group
    // channelList: eui.Group
    // group: eui.Group
    // toggle1: eui.Group
    toggle2: eui.Button
    private groupTab: eui.Group
    private btnClose: eui.Button

    private _selectIndex = 0
    public m_Lan1: eui.Label;
    public input: eui.EditableText;

    static IsShowChat(): boolean {
        // if (!ViewManager.ins().isShow(GameSceneView)) {
        //     return false
        // }
        let view = <GameSceneView>ViewManager.ins().getView(GameSceneView)
        if (view == null) {
            return true
        }
        // return view.miniChat.group.visible
        return true
    }

    static CheckSend() {
        if (!ViewManager.ins().isShow(GameSceneView)) {
            return
        }
        let view = <GameSceneView>ViewManager.ins().getView(GameSceneView)
        view.miniChat.DoEnterSend()
        // (view).DoEnterSend()
    }

    static CancelSend() {
        if (!ViewManager.ins().isShow(GameSceneView)) {
            return
        }
        let view = <GameSceneView>ViewManager.ins().getView(GameSceneView)
        view.miniChat.DoCancelSend()
    }

    init() {
        this.list.itemRenderer = MiniChatItemRender
        // this.list.useVirtualLayout = false
        this.input.text = ""
    };
    openPanel() {
        this.currentState = "mini"
        this.btnSend.label = GlobalConfig.jifengTiaoyueLg.st101401;
        this.m_Btn1.label = GlobalConfig.jifengTiaoyueLg.st100288;
        this.m_Btn2.label = GlobalConfig.jifengTiaoyueLg.st101402;
        this.m_Btn3.label = GlobalConfig.jifengTiaoyueLg.st100896;
        this.m_Btn4.label = GlobalConfig.jifengTiaoyueLg.st100466;
        this.m_Btn5.label = GlobalConfig.jifengTiaoyueLg.st101403;
        if (this.m_Lan1) {
            this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101404;
        }
        this.input.prompt = GlobalConfig.jifengTiaoyueLg.st101405;
        this._selectIndex = 0;
        // this.addTouchEvent(this, this.onTouch, this)
        this.addTouchEvent(this, this.onTouch, this.btnSend)
        this.addTouchEvent(this, this.onTouch, this.btnClose)
        this.addTouchEvent(this, this.onTouch, this.input)
        // this.addTouchEvent(this, this.onTouch, this.channelList)
        this.addTouchEvent(this, this.onTouch, this.scroller_chat)
        this.addTouchEvent(this, this.onTouch, this.toggle2);
        // this.addEvent(eui.CollectionEvent.COLLECTION_CHANGE, this.collectionChange, this, this.list.dataProvider)
        this.groupTab.addEventListener(egret.TouchEvent.TOUCH_TAP, this._clickTab, this)
        // GameGlobal.MessageCenter.addListener(MessageDef.CHAT_SEND_SUCCESS_UPDATE, this.updateView, this);
        GameGlobal.MessageCenter.addListener(MessageDef.CHAT_RECEIVE_SUCCESS_UPDATE, this.updateViewReceive, this);
        //this.list.dataProvider = Chat.ins().minichatList
        this.scroller_chat.viewport = this.list;
        //this._DoRefresh()

        if (Chat.ins().guildchatList.length < 1) {
            Guild.ins().sendAllGuildMessage()
        }
        this.txtTips.visible = this._selectIndex == ChatTabbarType.System

        this._updateButton(this._selectIndex)
        let view = <PlayFunView>ViewManager.ins().getView(PlayFunView)
        if (view) view.mask = null

    }
    private _DoRefresh() {
        // this.list.scrollV = 0
        this.list.validateNow()
        // let h = 0
        // for (let i = 0; i < this.list.numChildren; ++i) {
        //     h += ((this.list.getChildAt(i)).height)
        // }

        // egret.setTimeout(() => {
        //     // this.scroller_chat.viewport.scrollV = this.scroller_chat.viewport.contentHeight - this.scroller_chat.viewport.height;
        //     // this.list.scrollV = Math.max( this.scroller_chat.height - h+10, 0) 
        //     this.list.scrollV = Math.max(h - 60, 0)
        //     this.list.scrollV = this.list.height
        // }, this, 50)

    }

    public static Refresh() {
        // if (!ViewManager.ins().isShow(GameSceneView)) {
        //     return
        // }
        // let view = <GameSceneView>ViewManager.ins().getView(GameSceneView)
        // view.miniChat._DoRefresh()
    }

    closePanel() {
        // super.$onClose()
        this.removeEvents()
        this.groupTab.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._clickTab, this)
        //this.scroller_chat.removeEventListener(eui.UIEvent.CHANGE_END, this._listChange, this)
        // GameGlobal.MessageCenter.removeListener(MessageDef.CHAT_SEND_SUCCESS_UPDATE, this.updateView, this);
        GameGlobal.MessageCenter.removeListener(MessageDef.CHAT_RECEIVE_SUCCESS_UPDATE, this.updateViewReceive, this);
        this.list.dataProvider = null
    }
    // private _listChange():void{
    //     this._DoRefresh()
    // }
    // private updateView(): void {
    //    // this._updateButton(this._selectIndex)
    //     this.input.text = "";
    // }
    private updateViewReceive(): void {
        this._updateButton(this._selectIndex)
    }
    private _clickTab(e: egret.TouchEvent): void {
        let target = e.target
        if (!(target instanceof eui.Button)) {
            return
        }
        let idx = this.groupTab.getChildIndex(e.target)
        if (idx == this._selectIndex) {
            return
        }
        if (idx == ChatTabbarType.Guild) {
            if (!GameLogic.ins().actorModel.guildID) {
                UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101399)
                return
            }
            // if (Chat.ins().guildchatList.length < 1) {
            //     Guild.ins().sendAllGuildMessage()
            // }
        }

        this._updateButton(idx)


        //  source.refresh();       
    }
    private _updateButton(idx): void {
        let self = this
        for (let i = 0, len = self.groupTab.numChildren; i < len; i++) {
            let item = self.groupTab.getChildAt(i) as eui.Button
            item.currentState = i == idx ? "down" : "up";
        }
        self._selectIndex = idx
        let source = Chat.ins().getChatByType(self._selectIndex)
        self.list.dataProvider = source;
        //source.refresh();     
        self.groupSend.visible = self._selectIndex != ChatTabbarType.System
        self.txtTips.visible = self._selectIndex == ChatTabbarType.System
        self.validateNow();
        if (self.scroller_chat && self.scroller_chat.viewport && self.scroller_chat.viewport.contentHeight > self.scroller_chat.height)
            self.list.scrollV = self.scroller_chat.viewport.contentHeight - self.scroller_chat.height;
    }
    onTouch(e: egret.TouchEvent) {

        let target = e.target
        // let channelIndex = this.channelList.getChildIndex(target)
        // if (channelIndex != -1) {
        //     if (channelIndex == 1 && !ChatWin.CanGuildChat()) {
        //         return
        //     }
        //     this._selectIndex = channelIndex
        //     this.channelList.visible = false
        //     // this.channel.label = target.label
        //     return -1
        // }

        switch (e.currentTarget) {
            case this.btnSend:
                this._Send()
                return

            // case this.channel:
            //     this.channelList.visible = !this.channelList.visible
            // return
            case this.scroller_chat:
                if (this.currentState == "normal") return
                this._changeState()
                break;
            case this.btnClose:
            case this.toggle2:
                this._changeState()
                // ViewManager.ins().open(ChatWin)
                break;
        }
    }
    public viewChange() {
        this._changeState();
    }
    private _changeState(): void {
        this.currentState = this.currentState == "normal" ? "mini" : "normal"
        this.btnSend.label = GlobalConfig.jifengTiaoyueLg.st101401;
        this.m_Btn1.label = GlobalConfig.jifengTiaoyueLg.st100288;
        this.m_Btn2.label = GlobalConfig.jifengTiaoyueLg.st101402;
        this.m_Btn3.label = GlobalConfig.jifengTiaoyueLg.st100896;
        this.m_Btn4.label = GlobalConfig.jifengTiaoyueLg.st100466;
        this.m_Btn5.label = GlobalConfig.jifengTiaoyueLg.st101403;
        if (this.m_Lan1) {
            this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101404;
        }
        this.input.prompt = GlobalConfig.jifengTiaoyueLg.st101405;
        let rect = new egret.Rectangle(0, 0, 480, 388)
        let view = <PlayFunView>ViewManager.ins().getView(PlayFunView)
        let viewGuildWar = <PlayFunView>ViewManager.ins().getView(GuildWarInfoPanel)
        let viewBoss = <PlayFunView>ViewManager.ins().getView(BossBloodPanel)
        let chaosBattleAtkWin = <PlayFunView>ViewManager.ins().getView(ChaosBattleAtkWin);
        if (view) view.mask = this.currentState == "normal" ? rect : null
        if (viewGuildWar) viewGuildWar.mask = this.currentState == "normal" ? rect : null
        if (viewBoss) viewBoss.mask = this.currentState == "normal" ? rect : null
        if (chaosBattleAtkWin) chaosBattleAtkWin.mask = this.currentState == "normal" ? rect : null
        this._updateButton(ChatTabbarType.All)
    }

    private _Send() {
        let msg = this.input.text.trim()
        if (msg == null) {
            UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101400)
            return
        }
        switch (this._selectIndex) {
            case ChatTabbarType.All:
            case ChatTabbarType.World:
                Chat.ins().sendChatInfo(ChatType.Normal, msg, 0, false)
                break;
            case ChatTabbarType.Guild:
                Guild.ins().sendGuildMessage(msg)
                break;
            case ChatTabbarType.KF:
                Chat.ins().sendChatInfo(ChatType.KFChat, msg, 0, false)
                break;
        }
        this.input.text = "";
    }


    DoEnterSend() {
        // if (this.input.currentState != "normal") {
        //     return
        // }
        this._Send()

        // if (this.input.currentState)
    }

    DoCancelSend() {
        // this.input.text = ""
        // this.input.currentState = "normalWithPrompt"
    }

}
window["MiniChatPanel"] = MiniChatPanel