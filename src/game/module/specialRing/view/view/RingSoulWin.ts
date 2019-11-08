//戒灵
class RingSoulWin extends BaseView implements ICommonWindowTitle {
	windowTitleIconName: string = "L戒灵R"
	attr: eui.Label
	powerLabel: PowerLabel
	mc_group: eui.Group
	mc: MovieClip
	private btn: eui.Button
	private btn0: eui.Button
	redPoint: eui.Image
	item_g: eui.Group
	item_bg: eui.Group
	item_num = 0 //存当前点击项
	bg1: eui.Image
	bg2: eui.Image
	bg3: eui.Image
	bg4: eui.Image
	bg5: eui.Image
	bg6: eui.Image
	bg7: eui.Image
	itemIcon1:ItemSmall//ItemIcon
	itemIcon2:ItemSmall
	itemIcon3:ItemSmall
	itemIcon4:ItemSmall
	itemIcon5:ItemSmall
	itemIcon6:ItemSmall
	itemIcon7:ItemSmall
	jie: eui.Label
	attr1: eui.Label
	attr2: eui.Label
	attr3_1:RingBuffName
	scrolle: eui.Scroller
	s_g: eui.Group
	attr_g: eui.Group
	isDress: eui.Label
	
	
	array = [false, false, false, false, false, false, false]
	ring_buff_name = {}
	
	public constructor() {
		super()
		this.skinName = "RingSoulSkin"
		this.name = "戒灵"
	}
	
	open(...param: any[]) {
		UIHelper.SetLinkStyleLabel(this.attr)
		this.AddClick(this.btn, this.onBtn);
		this.AddClick(this.btn0, this.onBtn0);
		this.AddClick(this.attr, this.showAttr);
		MessageCenter.ins().addListener(MessageDef.RING_BUFF_UPDATE,this.UpdateContent,this)

		
		this.ring_buff_name = RingSoulModel.ins().getRingBuffName()
		this.UpdateContent()
	}
	onBtn0(e){
        //点击戒语洗练按钮
		ViewManager.ins().open(RingSoulWashWin,this.item_num);

    }
	onBtn(e){
        //点击更换按钮会弹出界面
        ViewManager.ins().open(RingSoulChangeWin,this.item_num);/*item_num*/
    }
	
	close() {
		MessageCenter.ins().removeAll(this)
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

	onClick(e:egret.TouchEvent){
		var childList = <Array<eui.Image>>this.item_bg.$children
		childList[this.item_num].visible = false
		this.item_num = e.currentTarget.parent.getChildIndex(e.currentTarget) ? e.currentTarget.parent.getChildIndex(e.currentTarget) : 0//获取点击的索引
		childList[this.item_num].visible = true
		this.updateAtt()
	}

	updateAtt(){
		var id = RingSoulModel.ins().ring_soul_data.arr[this.item_num]
		this.jie.text = '' //
		if(id){ 
			var attrs = ZhuanZhiModel.ins().getZhuanZhiEquipBaseAttr(id); 
			this.attr1.text = AttributeData.getAttStr(attrs, 0, 1, "： "); //'' + AttributeData.getAttStrForRing( id.att ) 
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
			this.attr2.y = this.attr1.height + this.attr1.y + 6
			this.attr2.text = '戒语:'
			this.attr3_1.y = this.attr2.y - 2
			this.attr_g.visible = true
			this.isDress.visible = false

			var cfg = GlobalConfig.ins('ItemConfig')
			var word = ['0','一','二','三','四','五','六','七','八','九','十','十一','十二'];//
			this.jie.text = cfg[id.configID].zsLevel + '转 ' + cfg[id.configID].name
			this.btn.label = '更换'

			let ttt = false
			let lv = cfg[id.configID].zsLevel
			var equips = <ItemData[]>UserBag.ins().getBagEquipByType(ItemType.RINGSOUL) //获取背包戒灵戒语
			for(var equip of equips){
				if( equip.itemConfig.zsLevel>lv && equip.itemConfig.subType==(this.item_num+1) ) ttt = true
			}
			this.redPoint.visible = ttt
		}
		else{
			this.attr_g.visible = false
			this.isDress.visible = true
			this.btn.label = '装备'
			this.redPoint.visible = false
			var equips = <ItemData[]>UserBag.ins().getBagEquipByType(ItemType.RINGSOUL) //获取背包戒灵戒语
			for(var equip of equips){
				if(equip.itemConfig.subType==(this.item_num+1)) this.redPoint.visible = true
			}
		}
		
	}

    UpdateContent(){
		this.powerLabel.text = RingSoulModel.ins().ring_soul_data.power
		// var n = RingSoulModel.ins().ring_soul_data.arr[this.item_num]
		this.attr3_1.setImage(true)
		// this.attr3_1.setLabel('忍耐')
		

		// this.mc.loadUrl(ResDataPath.GetUIEffePath(`eff_ui_rings_001`), true, -1)
		this.updateItems()
		this.updateAtt()
		this.updateBuffName()
    }

	public CheckRedPoint(): boolean {
		return RingSoulModel.ins().hasRedRing();
    }

	updateItems(){
		var childList = <Array<ItemSmall>>this.item_g.$children
		var cfg_n
		var cfg = GlobalConfig.ins('ItemConfig')
		var arr = <ItemData[]>UserBag.ins().getBagEquipByType(ItemType.RINGSOUL) //获取背包戒灵戒语 
		var arrs = []
		
		for(var a of arr) {
			if(!arrs[a.itemConfig.subType-1]) 
				arrs[a.itemConfig.subType-1] = [];
			arrs[a.itemConfig.subType-1].push(a.itemConfig)
        }

		for(var i=0; i<childList.length ; i++){
			if( RingSoulModel.ins().ring_soul_data.arr[i]==null ) { 
				// childList[i].setItemImg('ring_soul_lock_png') //
				childList[i].setItemImg('balck_90000' + (i+1) + '_png')  //
				childList[i].showImgBottom(false)
				if(arrs[i]&&arrs[i].length>0){
					childList[i].showRedPoint(true)
					
				}
				else{
					childList[i].showRedPoint(false)
				} 
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

				if(!arrs[i] || arrs[i].length==0) 
					childList[i].showRedPoint(false)
				else {
					let t = false
					for(let b of arrs[i]){
						if(b.zsLevel>cfg_n.zsLevel) t = true
					}
					childList[i].showRedPoint(t)
					
				}
			}
			// childList[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
			this.AddClick(childList[i],this.onClick)
		}
		
	}

	/** 较复杂,请谨慎修改!!!*/
	updateBuffName(){
		this.s_g.removeChildren() //先清空子元素
		var word = ['0','一','二','三','四','五','六','七','八','九','十','十一','十二'];//
		
		var data = RingSoulModel.ins().getSortBufs() //
		var len = data.length
		var num
		var x = [3, 53, 103]
		var y = 4//16 + 10
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
				buff.textColor=0x535557;
			}
			else {
				// buff.textColor = 0x00ff00
				let labelGo = this.s_g.getChildByName('buff' + i) as eui.Label
				labelGo.text = data[i].zslevel + '转 ' + data[i].name + ' (' + buff_n +'/'+ num +')'
				labelGo.textColor = 0x00ff00
				buff.textColor=0x00ff00;
			}
		}
	}


}
window["RingSoulWin"]=RingSoulWin