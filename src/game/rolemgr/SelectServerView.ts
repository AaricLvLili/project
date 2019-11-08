class SelectServerView extends BaseEuiView {

    public constructor() {
        super();
        this.skinName = "SelectServerSkin";
        // EXML.load(StartGameView.ROOT + StartGameView.ROO2 + "SelectServerSkin.exml", this.onLoaded, this);
        this.onLoaded();
        SelectServerView.m_Instance = this
        StageUtils.ins().getUIStage().addChild(this);

        GameGlobal.MessageCenter.addListener(MessageDef.START_GAME_SERVER_LIST, this.UpdateSerTable, this)
        this.m_bg.init(`SelectServerView`, "选择区服", false, this._Close.bind(this))
    }

    private serverTable: eui.List
    private serverList: eui.List
    // private dialogCloseBtn: eui.Button
    // private dialogReturnBtn: eui.Button
    private dialogMask: eui.Button
    private m_bg: CommonPopBg
    private m_SelectTab = -1

    private static m_Instance: SelectServerView
    public tips: eui.Label;

    public open() {
        // this.m_bg.init(`SelectServerView`, `选择区服`, false, this._Close.bind(this))
    }

    public onLoaded() {//clazz, url) {
        // this.skinName = clazz

        this.serverTable.addEventListener(eui.ItemTapEvent.ITEM_TAP, this._ServerTabClick, this)
        this.serverTable.itemRenderer = SelectServerItem01

        this.serverList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this._ServerListClick, this)
        this.serverList.itemRenderer = SelectServerItem02
        this.UpdateSerTable()

        //this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._Close, this)
        // this.dialogReturnBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._Close, this)
        this.dialogMask.addEventListener(egret.TouchEvent.TOUCH_TAP, this._Close, this)
        this.tips.text = "服务器列表";
    }

    private _Close() {
        GameGlobal.MessageCenter.removeAll(this)
        this.serverTable.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this._ServerTabClick, this)
        this.serverList.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this._ServerListClick, this)
        // this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._Close, this)
        this.dialogMask.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._Close, this)
        this.serverTable.removeChildren();
        this.serverList.removeChildren();
        this.removeChildren();
        let childNum = this.serverList.numChildren;
        for (var i = 0; i < childNum; i++) {
            let child = this.serverList.getChildAt(i);
            if (child && child instanceof SelectServerItem02) {
                child.bg2.filters = null;
            }
        }
        this.serverTable = null;
        this.serverList = null;
        // this.dialogCloseBtn = null;
        this.dialogMask = null;

        // StageUtils.ins().getStage().removeChild(this)
        if (SelectServerView.m_Instance.parent)
            SelectServerView.m_Instance.parent.removeChild(SelectServerView.m_Instance);
        SelectServerView.m_Instance = null

    }

    private _ServerTabClick(e: eui.ItemTapEvent) {
        this.ClickTable(e.item.type)
    }

    private _ServerListClick(e: eui.ItemTapEvent) {
        let data: SelectServerItemData = e.item
        StartGetUserInfo.ServerId = data.id
        this._Close()
        StartGameView.Start()
    }

    public UpdateSerTable() {
        // this.serverTable.dataProvider = new eui.ArrayCollection(StartGameView.mServerTab)
        this.serverTable.dataProvider = new eui.ArrayCollection(StartGetUserInfo.mServerTab)
        this.UpdateServerList()
    }

    private UpdateServerList() {
        let tabList = []
        if (this.m_SelectTab == -1) {
            tabList = StartGetUserInfo.mServerDict[-1]
        } else {
            let list = StartGetUserInfo.mServerDict[this.m_SelectTab]
            if (list == null || list.length == 0) {
                let page = this.m_SelectTab
                StartGameView.get_serverlist(page, (rsp) => {
                    let jo = JSON.parse(rsp)
                    let jsonObject = jo.data

                    let list = []
                    for (let key in jsonObject) {
                        let obj = jsonObject[key]
                        // egret.log(333)
                        // egret.log(obj)
                        let serverData = StartGameView.ParserServerData(obj)
                        if (serverData) {
                            list.push(serverData)
                        }
                    }
                    list.sort((lhs, rhs) => {
                        return rhs.id - lhs.id
                    })
                    StartGetUserInfo.mServerDict[page] = list

                    if (page == this.m_SelectTab) {
                        this.serverList.dataProvider = new eui.ArrayCollection(list)
                    }
                })
            } else {
                tabList = list
            }
        }
        this.serverList.dataProvider = new eui.ArrayCollection(tabList)
        this.serverTable.selectedIndex = 0;
    }

    public ClickTable(type: number) {
        let self = this
        if (self.m_SelectTab == type) {
            return
        }
        self.m_SelectTab = type
        for (let i = 0; i < self.serverTable.numChildren; ++i) {
            let child = self.serverTable.getChildAt(i)
            if (child["UpdateSel"]) {
                child["UpdateSel"]()
            }
        }
        self.UpdateServerList()
    }

    public static ClickItem(index: number) {
        if (!this.m_Instance) {
            return
        }
    }

    public static GetSelectTab(): number {
        if (!this.m_Instance) {
            return 0
        }
        return this.m_Instance.m_SelectTab
    }
}

class SelectServerItem01 extends eui.ItemRenderer {
    public bg;
    public constructor() {
        super()

        this.touchChildren = false
        this.touchEnabled = true


        let bg = new eui.Image()
        bg.source = "rhomb_btn_01_png";
        bg.horizontalCenter = 0
        bg.verticalCenter = 0
        bg.width = 154;
        bg.height = 44;
        this.bg = bg;
        this.addChild(bg)


        let select = new eui.Image()
        select.source = "rhomb_btn_03_png"
        select.horizontalCenter = 0
        select.verticalCenter = 0
        select.width = 154
        select.height = 44
        this.addChild(select)
        this.select = select

        let label = new eui.Label;
        label.text = "最近登录"//"最近登录";
        label.size = 20;
        label.textColor = 0xffffff;//0xd4c68e
        // label.width = 120;
        // label.height = 50;
        label.horizontalCenter = 0
        label.verticalCenter = 0
        label.textAlign = egret.HorizontalAlign.CENTER;
        label.verticalAlign = egret.VerticalAlign.MIDDLE;
        label.stroke = 2;
        label.strokeColor = 0xa25743;
        this.addChild(label);
        this.label = label;
    }

    private label: eui.Label
    private select: eui.Image

    public dataChanged() {
        let data: { type: number, name: string } = this.data
        this.label.text = data.name
        this.UpdateSel()
    }

    public UpdateSel() {
        let data: { type: number, name: string } = this.data
        this.select.visible = data.type == SelectServerView.GetSelectTab()
    }

}

class SelectServerItem02 extends eui.ItemRenderer {
    public bg2: eui.Image;
    public constructor() {
        super()

        this.touchChildren = false
        this.touchEnabled = true

        let w = 184;
        let h = 44;

        let bg = new eui.Image()
        bg.source = "rhomb_btn_02_png";
        bg.horizontalCenter = 0
        bg.verticalCenter = 0
        bg.width = w;
        bg.height = h;
        this.bg2 = bg;
        this.addChild(bg);


        let label = new eui.Label;
        label.text = "双线1服"//"双线1服";
        label.size = 20;
        label.textAlign = egret.HorizontalAlign.CENTER;
        label.verticalAlign = egret.VerticalAlign.MIDDLE;
        label.horizontalCenter = 0
        label.verticalCenter = 0
        label.textColor = 0xffffff;
        label.stroke = 2;
        label.strokeColor = 0x4346a2;
        this.addChild(label);
        this.label = label;

        let flag = new eui.Image()
        flag.top = 0
        flag.right = 0
        this.addChild(flag)
        this.flag = flag
    }

    label: eui.Label
    flag: eui.Image;

    public dataChanged() {
        let data: SelectServerItemData = this.data;
        this.label.text = data.name;
        this.touchEnabled = true;
        let img = "";
        this.filters = null;
        if (data.status == 1 || data.status == 3)//新服
        {
            this.flag.top = 0
            this.flag.verticalCenter = undefined;
            img = "comp_455_01_01_png"
        } else if (data.status == 2 || data.status == 4)//火热服
        {
            this.flag.top = undefined;
            this.flag.verticalCenter = 0;
            img = "comp_27_29_01_png";
        }
        else if (data.status == 5)//维护中
        {
            this.flag.source = "";
            this.touchEnabled = StartGetUserInfo.gmLevel > 0;
            FilterUtil.setGayFilter2(this);
        }
        this.flag.source = img;
    }

}

interface SelectServerItemData {
    // id: number, name: string, flag: boolean, ip: string, isMainTain: boolean
    id: number
    name: string
    status: number
    version: number
    ip: string
}
window["SelectServerView"] = SelectServerView
window["SelectServerItem01"] = SelectServerItem01
window["SelectServerItem02"] = SelectServerItem02