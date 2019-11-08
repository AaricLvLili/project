//戒灵更换按钮会弹出界面item
class RingSoulChangeItem extends eui.ItemRenderer {
    public constructor() {
        super()
        this.skinName = 'RingSoulChangeItemSkin';
        this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.euiComplete, this);
        this.group1.visible = true
        this.group2.visible = false
    }

    /** 当UI组件第一次被添加到舞台并完成初始化后调度*/
    private euiComplete(e: eui.UIEvent): void {
        this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.euiComplete, this);
        this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.btnClick, this)
  
    }

    btn: eui.Button;
    jie: eui.Label;
    none: eui.Label;
    current: eui.Label
    attr0: eui.Label
    attr1: eui.Label
    group1: eui.Group
    group2: eui.Group
    itemIcon: ItemIcon
    buff: RingBuffName

    static array = [ '防御', '神力', '暴击', '治愈', '护身', '复活', '麻痹', ]
    private btnClick(e: egret.TouchEvent): void {
        var req = new Sproto.cs_ring_soul_evil_change_request;
        req.slotIndex = (<RingSoulChangeWin>ViewManager.ins().getView("RingSoulChangeWin")).n + 1
        req.handle = this.data.data.handle; //物品id
		GameSocket.ins().Rpc(C2sProtocol.cs_ring_soul_evil_change, req, null, this);//请求
    }
    
    public dataChanged() {
        var a = ['0','一','二','三','四','五','六','七','八','九','十','十一','十二'];//
        var data = { icon:121008, id:121015, quality:0 }

        var item = this.data.data.itemConfig
        var attr = this.data.data.att;
        this.itemIcon.setData( { icon:item.icon, id:item.id, quality:item.quality } )
        
        this.jie.text = item.name + ' ' + a[item.zsLevel] + '转'
        var attrs = ZhuanZhiModel.ins().getZhuanZhiEquipBaseAttr(this.data.data); 
        this.attr0.text = AttributeData.getAttStr(attrs, 0, 1, "："); //AttributeData.getAttStrForRing( attr )
       

        this.attr1.y = this.attr0.height + this.attr0.y + 10
        this.buff.y = this.attr1.y - 6
        this.buff.setImage(true)
        
        var str1
        if (attr instanceof Array) {
            for (var i = 0; i < attr.length; i++) {
                if (attr[i].type!=AttributeType.atRingBuff) { continue; }
                else {  str1 = RingSoulModel.ins().getRingBuffName()[attr[i].value].name }
            }
        }
        this.buff.setLabel(str1)

        if (this.data.is){
            this.btn.label = '更换'
        }
        else { this.btn.label = '装备' }

        
    }


}
window["RingSoulChangeItem"]=RingSoulChangeItem