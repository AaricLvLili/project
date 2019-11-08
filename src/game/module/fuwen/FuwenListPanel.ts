class FuwenListPanel extends BaseEuiPanel {

    // 定义view对象的层级
    public static LAYER_LEVEL = LayerManager.UI_Popup

  // private dialogCloseBtn:eui.Button;
    private getwayLabel: GetwayLabel
    private list: eui.List
    private tabBar: eui.TabBar

    public static m_RoleIndex = 0
    public static m_Type: number = 0
    private m_List: ItemData[][] = []
    private languageTxt:eui.Label;

    public constructor() {
        super()
        this.skinName = "FuwenListPanelSkin"

        this.list.itemRenderer = FuwenListItem;
        let tabList = [GlobalConfig.jifengTiaoyueLg.st100287,GlobalConfig.jifengTiaoyueLg.st100288];
        this.tabBar.dataProvider = new eui.ArrayCollection(tabList)
        this.tabBar.selectedIndex = 0
    }

	initUI() {
		super.initUI();
        this.languageTxt.text = GlobalConfig.jifengTiaoyueLg.st100291;
    }

    open(...param: any[]) {
      //  this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClose, this);
        FuwenListPanel.m_RoleIndex = param[0]
        FuwenListPanel.m_Type = param[1]

        this.AddClick(this.getwayLabel, this._OnClick)
        this.AddItemClick(this.tabBar, this._UpdateContent)

        this.observe(MessageDef.FUWEN_EQUIP_UPDATE, this._UpdateContent)
        this._UpdateContent()
        this.m_bg.init(`FuwenListPanel`,GlobalConfig.jifengTiaoyueLg.st100289)
    }

    close() {
        //this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClose, this)
    }

    private _OnClose(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}

    private _OnClick(e: egret.TouchEvent) {
        switch(e.currentTarget) {
            case this.getwayLabel:
                FuwenPanel.BuyGoodsWarn()
            break
        }
    }
    
    private _UpdateContent() {
        let lv = GameGlobal.actorModel.level
        let zsLv = GameGlobal.zsModel.lv

        let subList = []
        let items = UserBag.ins().getBagEquipByType(ItemType.FUWEN)
        let role = SubRoles.ins().getSubRoleByIndex(FuwenListPanel.m_RoleIndex)
        for (let item of items) {
            if (item.itemConfig.job == role.job && item.itemConfig.subType == FuwenListPanel.m_Type
                && lv >= item.itemConfig.level && zsLv >= item.itemConfig.zsLevel) {
                subList.push(item)
            }
        }
        this.m_List[0] = subList
        this.m_List[1] = items

        this.list.dataProvider = new eui.ArrayCollection(this.m_List[this.tabBar.selectedIndex])
    }
}

class FuwenListItem extends ItemBase {

    public childrenCreated() {
        this.isShowJob(true)
    }

    public showDetail() {
        if (this.data.itemConfig.subType == FuwenListPanel.m_Type) {
            WarnWin.show(GlobalConfig.jifengTiaoyueLg.st100290, this._OnClick, this)
        } else {
            super.showDetail()
        }
    }

    private _OnClick() {
        FuwenModel.ins().SendEquipup(FuwenListPanel.m_RoleIndex, this.data.handle, FuwenListPanel.m_Type)
    }
}
window["FuwenListPanel"]=FuwenListPanel
window["FuwenListItem"]=FuwenListItem