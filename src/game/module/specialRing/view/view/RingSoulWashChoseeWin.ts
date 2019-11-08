// RingSoulWashChoseeWin
class RingSoulWashChoseeWin  extends BaseEuiPanel {

    item_data: ItemData
    list: eui.List
   // dialogCloseBtn: eui.Button
    itemChosee: RingSoulWashChoseeItem
    public constructor() {
        super();
      
        this.skinName = "RingSoulWashChoseeSkin";
    }

	open(...param: any[]) {
        this.item_data = param[0] 
        // this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this)
       // this.AddClick(this.dialogCloseBtn,this.onClose)
        this.up()
        this.updateView()
        this.m_bg.init(`RingSoulWashChoseeWin`,`选择材料`)
    }

    up() {
        if(!this.item_data) {
            this.itemChosee.label.visible = true
            this.itemChosee.group1.visible = false
        }
        else{
            this.itemChosee.label.visible = true
            this.itemChosee.label.text = '当前选择'
            this.itemChosee.group1.visible = true
            this.itemChosee.btn.label = '取消选择'
            this.itemChosee.itemBase.setDataByConfig(this.item_data.itemConfig)
            this.itemChosee.itemBase.setCount(''+this.item_data.count)
            this.itemChosee.itemBase.itemConfig = this.item_data.itemConfig
        }
    }

    updateView(): void {
        var ringWashs = UserBag.ins().getBagGoodsByType(ItemType.RINGBUFF)//从背包读取洗戒石
        var list = []
        if(ringWashs){
            for(var a of ringWashs){
                if(a.itemConfig.subType!=0) { list.push(a) }
            }
        }
        
		this.list.itemRenderer = RingSoulWashChoseeItem;
        this.list.dataProvider = new eui.ArrayCollection(list);
    }

    onClose(e){
        ViewManager.ins().close(RingSoulWashChoseeWin)
    }

    close() {

    }

}
ViewManager.ins().reg(RingSoulWashChoseeWin, LayerManager.UI_Popup);

class RingSoulWashChoseeItem extends eui.ItemRenderer {
     public constructor() {
        super()
        this.skinName = 'RingSoulWashChoseeItemSkin';
        this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.euiComplete, this);
    }

    /** 当UI组件第一次被添加到舞台并完成初始化后调度*/
    private euiComplete(e: eui.UIEvent): void {
        this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.euiComplete, this);
        this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.btnClick, this)
  
    }

    btn: eui.Button;
    label: eui.Label
    itemBase: ItemBase
    group1: eui.Group

    private btnClick(e: egret.TouchEvent): void {
        var panel = ViewManager.ins().getView(RingSoulWashChoseeWin)
        var win = ViewManager.ins().getView(RingSoulWashWin) as RingSoulWashWin
        ViewManager.ins().close(panel)
        if(win){
            if(e.currentTarget.label == '选择')
                win.commonWindowBg.GetCurViewStackElementByIndex(0).updataChosee(this.data);
            else{
                win.commonWindowBg.GetCurViewStackElementByIndex(0).updataChosee(null)
            }
        }
    }
    
    public dataChanged() {
        this.label.visible = false
        this.itemBase.setCount(''+this.data.count)
        this.itemBase.setDataByConfig(this.data.itemConfig)
        this.itemBase.itemConfig = this.data.itemConfig
    }

}
window["RingSoulWashChoseeWin"]=RingSoulWashChoseeWin
window["RingSoulWashChoseeItem"]=RingSoulWashChoseeItem