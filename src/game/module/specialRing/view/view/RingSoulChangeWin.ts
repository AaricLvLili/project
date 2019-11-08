//戒灵更换界面
class RingSoulChangeWin  extends BaseEuiPanel implements ICommonWindow {

	//dialogCloseBtn: eui.Button

    open(...param: any[]) {
        this.n = param[0]
        MessageCenter.ins().addListener(MessageDef.RING_BUFF_UPDATE,this.update,this)
       // this.AddClick(this.dialogCloseBtn, this.onClose)
        this.update()
        
		// this.UpdateContent()
        this.m_bg.init(`RingSoulChangeWin`,`更换`)
	}

    onClose(e){
        ViewManager.ins().close(RingSoulChangeWin)
    }

    windowTitleIconName: string = "L更换R"
    /** 列表*/
	private list: eui.List;
	/** 列表数据容器*/
	private listArr: eui.ArrayCollection;
    itemIcon0: RingSoulChangeItem
    isDress = false
    n

	public constructor() {
		super()
		this.skinName = "RingSoulChangeSkin"
        this.name = '更换'
	}
	protected childrenCreated(): void {
		super.childrenCreated();
        
        // this.update()
        // var config = ['1','2','3','3','3','3','7'];
        // this.updataList(config)
    }
    updataList(array:Array<any>){
        var b=[]

        for (var i=0; i<array.length; i++){
            b.push({ 
                data:array[i],
                is:this.isDress
            })
        }
        this.list.itemRenderer = RingSoulChangeItem;
        this.listArr = new eui.ArrayCollection();
        this.listArr.source = b; //改用转换后的数组b
		this.list.dataProvider = this.listArr;
    }
	
    update(){
        this.UpdateContent()

        var arr = []
        var arr1 = []
        arr = <ItemData[]>UserBag.ins().getBagEquipByType(ItemType.RINGSOUL) //获取背包戒灵戒语
        for(var a of arr) {
            if(a.itemConfig.subType==(this.n+1)){
                arr1.push(a)
            }
        }
           
        this.updataList(arr1)
    }
    onBtn(e){
        
    }
	public CheckRedPoint() {
        return false
    }
	close() {
		
	}
    UpdateContent(){
        var index = this.n
        if (RingSoulModel.ins().ring_soul_data.arr[index]){ this.isDress = true }
        if (this.isDress){
            this.itemIcon0.group1.visible = true
            this.itemIcon0.group2.visible = false
            this.itemIcon0.current.visible = true
            this.itemIcon0.btn.visible = false
            //如果装备了戒语
            var id = RingSoulModel.ins().ring_soul_data.arr[index]
            var attrs = ZhuanZhiModel.ins().getZhuanZhiEquipBaseAttr(id); 
            this.itemIcon0.attr0.text = AttributeData.getAttStr(attrs, 0, 1, "：");//'' + AttributeData.getAttStrForRing( id.att ) 
			var itemID = GlobalConfig.ins('ItemConfig')[id.configID]
			var str = '' + itemID.name
            this.itemIcon0.attr1.y = this.itemIcon0.attr0.height + this.itemIcon0.attr0.y + 10
            this.itemIcon0.buff.y = this.itemIcon0.attr1.y - 6
            var a = ['0','一','二','三','四','五','六','七','八','九','十','十一','十二'];//
            this.itemIcon0.jie.text = str + ' ' + a[itemID.zsLevel] + '转'
            
            var attr = id.att
            var str1
            if (attr instanceof Array) {
                for (var i = 0; i < attr.length; i++) {
                    if (attr[i].type!=AttributeType.atRingBuff) { continue; }
                    else {  str1 = RingSoulModel.ins().getRingBuffName()[attr[i].value].name }
                }
            }
			this.itemIcon0.buff.setLabel(str1)
            this.itemIcon0.buff.setImage(true)
            this.itemIcon0.itemIcon.setData(itemID)
        }
        else {
            this.itemIcon0.group1.visible = false
            this.itemIcon0.group2.visible = true
        }
    }
}
ViewManager.ins().reg(RingSoulChangeWin, LayerManager.UI_Popup);
window["RingSoulChangeWin"]=RingSoulChangeWin