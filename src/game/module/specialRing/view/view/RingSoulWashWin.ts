//戒灵戒语洗练
class RingSoulWashWin  extends BaseEuiPanel implements ICommonWindow {

    // public static LAYER_LEVEL = LayerManager.UI_Main
	commonWindowBg: CommonWindowBg
    item_num = 0
	num = null
	value = null

    public constructor() {
        super();
      
        this.skinName = "SpecialRingMainSkin";
        this.commonWindowBg.AddChildStack(new RingSoulWashPanel)
    }

	open(...param: any[]) {
        this.item_num = param[0] /**item_num */

		this.commonWindowBg.OnAdded(this)
        this.commonWindowBg.tabBar.visible = false
        // this.setRedPoint();
    }

    close() {
        this.commonWindowBg.OnRemoved()
    }

    setRedPoint() {
        this.commonWindowBg.CheckTabRedPoint()
    }

	OnOpenIndex?(openIndex: number): boolean {
        return true
    }

	playEff (e) {
		var t = new MovieClip();
		var ename = e ? "eff_success" : "eff_fail";
		t.scaleX = t.scaleY = 1, t.rotation = 0, t.x = 240, t.y = 300, t.loadUrl(ResDataPath.GetUIEffePath(ename), !0, 1,()=>{
			// ObjectPool.push(t)
			DisplayUtils.dispose(t);
			t = null;
			var win = <RingSoulWashWin>ViewManager.ins().getView("RingSoulWashWin")
			if(win){
				ViewManager.ins().open(RingSoulWashFinish,win.num,win.value); //
			}
		}), this.addChild(t)
	}
}
ViewManager.ins().reg(RingSoulWashWin, LayerManager.UI_Popup);

class RingSoulWashPanel extends BaseView implements ICommonWindowTitle {
	windowTitleIconName: string = "L戒语洗练R"
	attr: eui.Label
	powerLabel: PowerLabel
	mc_group: eui.Group
	mc: MovieClip
	private btn0: eui.Button
	item_g: eui.Group
	item_bg: eui.Group
	item_num = 0 //存当前点击项

	attr1: eui.Label
	attr2: eui.Label
	attr3_1:RingBuffName
    attr1_2: eui.Label
	attr2_2: eui.Label
	attr3_2:RingBuffName
    count_bottom: eui.Label
    atr2_g: eui.Group
	attr_g: eui.Group
	isDress: eui.Label

	scrolle: eui.Scroller
	s_g: eui.Group
    itemBase: ItemBase
    item_data: ItemData
	
	
	array = [false, false, false, false, false, false, false] //戒语类型是否激活
	ring_buff_name = {}
	
	public constructor() {
		super()
		this.skinName = "RingSoulWashSkin"
		this.name = "戒语洗练"
	}
	
	open(...param: any[]) {
		this.item_num = (<RingSoulWashWin>ViewManager.ins().getView("RingSoulWashWin")).item_num
		this.AddClick(this.btn0, this.onBtn0);
		UIHelper.SetLinkStyleLabel(this.attr)
		this.AddClick(this.attr, this.showAttr);
        this.AddClick(this.itemBase, this.onChosee);
		MessageCenter.ins().addListener(MessageDef.RING_BUFF_UPDATE,this.UpdateContent,this)

		this.ring_buff_name = RingSoulModel.ins().getRingBuffName()
		// this.UpdateContent()
		var childList = <Array<eui.Image>>this.item_bg.$children
		childList[0].visible = false
		childList[this.item_num].visible = true
	}

	/**显示属性 */
	public showAttr() {
		let comp = new eui.Component;
		comp.skinName = "RingSoulAttrSkin";

		var str:string = "";
		var items = RingSoulModel.ins().ring_soul_data.arr as ItemData[]
		var a = []
		var b = []
		for(var item of items){
			var attrs = ZhuanZhiModel.ins().getZhuanZhiEquipBaseAttr(item);
			if(item){
				for(var q of attrs){  
					if(!a[q.type]) a[q.type] = 0;
					a[q.type] += q.value;

				}
			}
		}

		var _a = RingSoulModel.ins().getAttrSoul() //
		for(var _i in _a){
			if(a[_a[_i].type])  a[_a[_i].type] += _a[_i].value
			else  a[_a[_i].type] = _a[_i].value
		}

		for(var i=0;i<a.length;i++){
			if(a[i]) b.push( {type:i, value:a[i]} )
		}
		str = AttributeData.getAttStrForRing( b ) 
		comp["attr"].text = str

		comp.addEventListener(egret.TouchEvent.TOUCH_END, () => {
				comp.$getEventMap()[egret.TouchEvent.TOUCH_END] = null;
				LayerManager.UI_Popup.removeChild(comp);
			}, comp);
		LayerManager.UI_Popup.addChild(comp);
	}

	reItem(){
		this.itemBase.setItemImg('pf_orange_02_png')
        this.itemBase.setCount('')
		this.itemBase.setItemBg( ResDataPath.GetItemQualityName(0) )
        this.itemBase.nameTxt.text = '选择材料'

		var washs = UserBag.ins().getBagGoodsByType(ItemType.RINGBUFF)
        var n = 0
        if(washs){
            for(var a of washs){
                if(a.itemConfig.subType==0) { n = a.count }
            }
        }
        this.count_bottom.text = '消耗洗戒石: ' + n + '/1'
		this.count_bottom.visible = true
	}

    onChosee(e){
		ViewManager.ins().open(RingSoulWashChoseeWin,this.item_data); //
    }

	onBtn0(e){
        //点击戒语洗练按钮
		var item_index = RingSoulModel.ins().ring_soul_data.arr[this.item_num]
		if(!item_index) { return UserTips.ErrorTip('该槽位未装备戒灵符文') }
		let v2
		let att2 = item_index.att
		for(let j in att2){
				if(att2[j].type == AttributeType.atRingBuff) v2 = att2[j].value
			}
        if(this.item_data){
			let att1 = this.item_data.itemConfig
			let v1
			v1 = att1.subType
			
			if(v1 && v2 && v1==v2){
				let str = GlobalConfig.ins('JieYuTypeName')[v1].name
				return UserTips.ErrorTip('当前戒语已经是' + str + '，不能重复洗炼')
				
			}
			else{
				var request = new Sproto.cs_wash_soul_evil_type_request;
				request.slotIndex = this.item_num + 1
				request.handle = this.item_data.handle; //物品handle
				GameSocket.ins().Rpc(C2sProtocol.cs_wash_soul_evil_type, request, null, this);//请求
				// ViewManager.ins().close(RingSoulWashWin)
				var win = <RingSoulWashWin>ViewManager.ins().getView("RingSoulWashWin")
				if(win){
					win.num = this.item_num
					win.value = v2
				}
				this.item_data = null //清空选择
				return 
			}
            
        }

        var ringWashs = UserBag.ins().getBagGoodsByType(ItemType.RINGBUFF)//从背包读取洗戒石
		if (ringWashs.length<1) { return UserTips.ErrorTip('背包无洗戒石') }
        else{
            var i
            for (let item of ringWashs){
                if(item.itemConfig.subType==0) { i = item  }

            }
			if(!i){ 
				return UserTips.ErrorTip('背包无洗戒石')
			}
            var req = new Sproto.cs_wash_soul_evil_type_request;
            req.slotIndex = this.item_num + 1
            req.handle = i.handle; //物品handle
            GameSocket.ins().Rpc(C2sProtocol.cs_wash_soul_evil_type, req, null, this);//请求
			// ViewManager.ins().close(RingSoulWashWin)
			var win = <RingSoulWashWin>ViewManager.ins().getView("RingSoulWashWin")
			if(win){
				win.num = this.item_num
				win.value = v2
			}
            return 
        }
		
    }

    updataChosee(item_data){
        if(item_data){
            this.item_data = item_data
            this.itemBase.setDataByConfig(item_data.itemConfig)
            this.updateAtt()
        }
		else{
			this.item_data = null
			// this.UpdateContent()  //取消选择
			this.reItem()
			this.updateAtt()
		}
    }

	public CheckRedPoint(): boolean {
		return false;//test
    }
	close() {
		MessageCenter.ins().removeAll(this)
	}

	onClick(e:egret.TouchEvent){
		var childList = <Array<eui.Image>>this.item_bg.$children
		childList[this.item_num].visible = false
		this.item_num = e.currentTarget.parent.getChildIndex(e.currentTarget) ? e.currentTarget.parent.getChildIndex(e.currentTarget) : 0//获取点击的索引
		childList[this.item_num].visible = true
		this.updateAtt()
	}

	updateAtt(){
		var id = RingSoulModel.ins().ring_soul_data.arr[this.item_num]
		this.attr_g.x = 0
		if(id){ 
			var attrs = ZhuanZhiModel.ins().getZhuanZhiEquipBaseAttr(id); 
			this.attr1.text = AttributeData.getAttStr(attrs, 0, 1, "： "); 
			// this.attr1.text = '' + AttributeData.getAttStrForRing( id.att ) 
			//如果装备了戒语
			var attr = id.att
            var str1
            if (attr instanceof Array) {
                for (var i = 0; i < attr.length; i++) {
                    if (attr[i].type!=AttributeType.atRingBuff) { continue; }
                    else {  str1 = RingSoulModel.ins().getRingBuffName()[attr[i].value].name }
           		}
			}
			this.attr3_1.setLabel(str1)
            this.attr3_1.setImage(true)
			// this.attr2.y = this.attr1.height + this.attr1.y + 8
			// this.attr2.text = '戒语:'
			// this.attr3_1.y = this.attr2.y - 6
			this.attr_g.visible = true
			this.isDress.visible = false
		}
		else{
			this.attr_g.visible = false
			this.isDress.visible = true
            this.atr2_g.visible = false //
		}
		this.attr2.y = this.attr1.height + this.attr1.y + 6
		this.attr2.text = '戒语:'
		this.attr3_1.y = this.attr2.y - 2
		
        //atr2_g
        if(id&&this.item_data){
            this.atr2_g.visible = true
            this.attr1_2.text = this.attr1.text
            this.attr2_2.text = this.attr2.text
            //name
            var na = this.item_data.itemConfig.subType
            let str = RingSoulModel.ins().getRingBuffName()[na].name
            this.attr3_2.setLabel(str)
            this.attr2_2.y = this.attr2.y
            this.attr3_2.y = this.attr3_1.y
            this.attr3_2.setImage(true)
			this.attr3_2.visible = true
            this.count_bottom.visible = false
        }
        else{
			if(id){
				this.attr_g.x = 100
				this.atr2_g.visible = false//false
				// this.attr3_2.visible = false
				// this.attr2_2.text = '戒语: 随机戒语'
				// this.attr2_2.y = this.attr2.y
				// this.attr1_2.text = this.attr1.text
				this.count_bottom.visible = true
			}
        }
	}

    UpdateContent(){
		this.powerLabel.text = RingSoulModel.ins().ring_soul_data.power
		// var n = RingSoulModel.ins().ring_soul_data.arr[this.item_num]
		this.attr3_1.setImage(true)
		// this.attr3_1.setLabel('忍耐')
		

		// this.mc.loadUrl(ResDataPath.GetUIEffePath(`eff_ui_rings_001`), true, -1)
		this.reItem()
		this.updateItems()
		this.updateAtt()
		this.updateBuffName()

    }

	updateItems(){
		var childList = <Array<ItemSmall>>this.item_g.$children
		var cfg_n
		var cfg = GlobalConfig.ins('ItemConfig')
		for(var i=0; i<childList.length ; i++){
			if( RingSoulModel.ins().ring_soul_data.arr[i]==null ) { 
				// childList[i].setItemImg('ring_soul_lock_png') //
				childList[i].setItemImg('balck_90000' + (i+1) + '_png')  //
				childList[i].showImgBottom(false)
			}
			else {
				cfg_n = cfg[RingSoulModel.ins().ring_soul_data.arr[i].configID]
				childList[i].setItemImg(cfg_n.icon + '_png')  //
				childList[i].setItemBg( ResDataPath.GetItemQualityName(cfg_n.quality) )
				let att = RingSoulModel.ins().ring_soul_data.arr[i].att
				let value = 1
				for(let i in att){
					if(att[i].type && att[i].type==AttributeType.atRingBuff)  value = att[i].value;
				}
				childList[i].setImgBottom('90000'+ value + '_png')
				childList[i].showImgBottom(true)
			}
			// childList[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
			this.AddClick(childList[i],this.onClick)
		}
	}

	/** 较复杂,请谨慎修改!!!*/
	updateBuffName(){
		this.s_g.removeChildren() //先清空子元素
		var word = ['0','一','二','三','四','五','六','七','八','九','十','十一','十二'];//
		
		var data = RingSoulModel.ins().getSortBufs()
		var len = data.length
		var num
		var x = [3, 53, 103]
		var y = 4 //16 + 10
		var buff
		var buff_n
		var keyValue = RingSoulModel.ins().getKeyValue() //

		for(var i=0; i<len; i++){
			var tempA = [false,false,false,false,false,false,false]  //是否已判断槽位
			buff = new eui.Label()
			buff.text = word[data[i].zslevel] + '转 ' + data[i].name
			buff.size = 14
			buff.name = 'buff' + i
			this.s_g.addChild(buff)
			buff.x = 8
			buff.y = y
			y = y + 14 +4

			buff = null
			buff_n = 0
			num = data[i].evil.length ? data[i].evil.length : 0
			for(var j=0; j<num; j++){
				buff = new RingBuffName
				buff.setImage(false)
				buff.text.textColor="0xc8e4ed"
				buff.text.strokeColor="0x1f5263"
				for(let kk in keyValue){
					if(keyValue[kk].value && keyValue[kk].lv>=data[i].zslevel && data[i].evil[j]==keyValue[kk].value && !tempA[kk]){
						tempA[kk] = true
						buff.setImage(true) 
						buff.text.textColor="0xf3ecc8"
						buff.text.strokeColor="0x4f3514"
						buff_n++
						break;
					}
				}
				
				buff.setLabel( this.ring_buff_name[ data[i].evil[j] ].name ) 
				this.s_g.addChild(buff)
				buff.x = x[j%3]
				buff.y = y + (21+4)*Math.floor(j/3)
			}
			y = y + (21+4)*Math.floor(num/3+2/3)

			buff = new eui.Label()
			buff.text = AttributeData.getAttStrForRing( data[i].attr )
			// buff.text = AttributeData.getAttStr(data[i].attr, 0, 1, "：")
			buff.size = 14
			this.s_g.addChild(buff)
			buff.x = 8
			buff.y = y
			y = y + buff.height + 10

			if (buff_n<num) {
				// buff.textColor = 0xcecdcc
				let labelGo = this.s_g.getChildByName('buff' + i) as eui.Label
				labelGo.text = data[i].zslevel + '转 ' + data[i].name + ' (' + buff_n +'/'+ num +')'
				labelGo.textColor = 0x535557
			}
			else {
				// buff.textColor = 0x00ff00
				let labelGo = this.s_g.getChildByName('buff' + i) as eui.Label
				labelGo.text = data[i].zslevel + '转 ' + data[i].name + ' (' + buff_n +'/'+ num +')'
				labelGo.textColor = 0x00ff00
			}
		}

	}

}
window["RingSoulWashWin"]=RingSoulWashWin
window["RingSoulWashPanel"]=RingSoulWashPanel