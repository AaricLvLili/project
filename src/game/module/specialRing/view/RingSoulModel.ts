//戒灵BOSS与戒灵的model
class RingSoulModel extends BaseSystem {
	
	isOpen = false//false //是否解锁戒灵BOSS与戒灵
	ring_soul_data = { power:0 , arr:[ null, null, null, null, null, null, null ], buffs: null } //arr: item_data[]
	ringboss_init = { chalTimes: 0, refreshTimes: null, activeValue2: 20, activeValue: 0, bossListKey: null, } //免费挑战boss次数
	ring_buff_name 

	public static ins(): RingSoulModel {
		return super.ins()
	}

	public constructor() {
		super();
		this.regNetMsg(S2cProtocol.sc_ring_soul_data, this.update)
		this.regNetMsg(S2cProtocol.sc_ring_soul_evil_change_ret, this.ringBuffChange)
		this.regNetMsg(S2cProtocol.sc_ring_soul_evil_wash_ret, this.ringBuffWash)
		this.regNetMsg(S2cProtocol.sc_ringboss_init, this.ringBossData)
	}

    update(rsp: Sproto.sc_ring_soul_data_request){
		this.isOpen = true
		this.ring_soul_data.power = rsp.power
		if(rsp.slotData){
			for(var i=0; i<rsp.slotData.length; i++){
			this.ring_soul_data.arr[rsp.slotData[i].slotIndex-1] = rsp.slotData[i].itemData  //槽位索引从1开始，但变换后数组从0开始
			}
		}
		this.ring_soul_data.buffs = rsp.activeSoulEvil.length>0 ? rsp.activeSoulEvil : [{configId:2, zslevel:3}]
		GameGlobal.MessageCenter.dispatch(MessageDef.RING_BUFF_UPDATE)
	}

	ringBuffChange(rsp: Sproto.sc_ring_soul_evil_change_ret_request){
		if (rsp.retCode==0) { UserTips.InfoTip2('更换成功') }
		else if (rsp.retCode==1) { UserTips.ErrorTip('无法在背包找到物品') }
		else if (rsp.retCode==2) { UserTips.ErrorTip('此槽位禁止装备此物品') }
	}

	ringBuffWash(rsp: Sproto.sc_ring_soul_evil_wash_ret_request){
		if (rsp.retCode==0) { 
			var win = <RingSoulWashWin>ViewManager.ins().getView("RingSoulWashWin")
			if(win){  win.playEff(true)  }
			else{ UserTips.InfoTip2('洗戒语成功') }
		}
		else if (rsp.retCode==1) { UserTips.ErrorTip('无法在背包找到洗戒语') }
		else if (rsp.retCode==2) { UserTips.ErrorTip('此槽位禁止装备此洗戒语') }
	}

	ringBossData(rsp: Sproto.sc_ringboss_init_request){
		var cfg1 = GlobalConfig.ins('RingBossCommonConfig')
		this.ringboss_init.chalTimes = (cfg1.challengTimes - rsp.chalTimes)>=0 ? (cfg1.challengTimes - rsp.chalTimes) : 0
		this.ringboss_init.refreshTimes = rsp.refreshTimes
		this.ringboss_init.activeValue = rsp.activeValue
		this.ringboss_init.bossListKey = rsp.bosslist
		GameGlobal.MessageCenter.dispatch(MessageDef.RING_BOSS_UPDATE)
	}

	/**获取戒语名字 */
	getRingBuffName(){
		if(!this.ring_buff_name) { this.ring_buff_name = GlobalConfig.ins('JieYuTypeName') }
		return this.ring_buff_name
	}

	getRingBuffList(){

		return UserBag.ins().getBagEquipByType(ItemType.RINGSOUL)//从背包读取戒语
	}

	getRingBuff(){

		return UserBag.ins().getBagEquipByType(ItemType.RINGBUFF)//从背包读取洗戒语
	}

	hasRedPoint():boolean {
		//戒灵BOSS
		var cfg = GlobalConfig.ins('RingBossCommonConfig')
		var t = ( RingSoulModel.ins().isOpen && cfg  && cfg.zslv<=GameGlobal.actorModel.zsLv && cfg.openTime<=GameServer.serverOpenDay ) ? true : false
		if ( this.ringboss_init.activeValue<this.ringboss_init.activeValue2 && this.ringboss_init.chalTimes<1 || !t ){
			return false
		}
		else {
			return true
		}
        
    }

	hasRedRing():boolean {
		//戒灵
		if(!this.isOpen)
			return false;
		var t = false
		var cfg_n
		var cfg = GlobalConfig.ins('ItemConfig')
		var arr = <ItemData[]>UserBag.ins().getBagEquipByType(ItemType.RINGSOUL) //获取背包戒灵戒语 
		var arrs = []
		for(var a of arr) {
			if(!arrs[a.itemConfig.subType-1]) 
				arrs[a.itemConfig.subType-1] = [];
			arrs[a.itemConfig.subType-1].push(a.itemConfig)
        }

		for(var i=0; i<7 ; i++){
			if( RingSoulModel.ins().ring_soul_data.arr[i]==null ) { 
				
				if(arrs[i] && arrs[i].length>0) t = true
			}
			else {
				cfg_n = cfg[RingSoulModel.ins().ring_soul_data.arr[i].configID]
				
				if(!arrs[i] || arrs[i].length==0) {
					//
				}
				else {
					let tt = false
					for(let b of arrs[i]){
						if(b.zsLevel>cfg_n.zsLevel) tt = true
					}
					t = t ? t : tt
				}
			}
			
		}

        return t //false
    }

	/** 获取戒语激活组合属性*/
	getAttrSoul(){
		var data1 = GlobalConfig.ins('ExRingSoulEvil')
		var data = []
		var buf = RingSoulModel.ins().ring_soul_data.arr
		if(!buf || !data1) return []//'';

		var itemConfig = GlobalConfig.ins('ItemConfig')

		var aa = []
		var attBuf
		for(var i=0;i<7;i++){
			aa.push( {lv:0, value:null} )
		}
		for(let j in buf){
			if(!buf[j])  continue;
			aa[j].lv = itemConfig[buf[j].configID].zsLevel

			for(let q of buf[j].att){
				if(q.type==AttributeType.atRingBuff) attBuf = q.value
			}

			aa[j].value = attBuf
		}

		for(let dd in data1){
			let lv = 0
			let item = 1  //全没有则设为1
			
			let n1n2 = 0
			for(let ddd in data1[dd]){
				var de = data1[dd][ddd].evil
				var n1 = 0
				var n2 = 0
				var tempA = [false,false,false,false,false,false,false]  //是否已判断槽位
				for(let dddd of de){
					for(let aaa in aa){
						if(aa[aaa].value && aa[aaa].lv>=data1[dd][ddd].zslevel && aa[aaa].value==dddd && !tempA[aaa]) {
							tempA[aaa] = true
							n1++
							break;
						}
					}
					n2++
				}
				n2 = n2==0 ? 1 : n2
				if(n1/n2>0 && n1/n2>n1n2){
					n1n2 = n1/n2
					item = data1[dd][ddd].zslevel
				}
				else if(n1/n2>0 && n1/n2==n1n2){
					item = data1[dd][ddd].zslevel>item ? data1[dd][ddd].zslevel : item
				}

			}
			// data.push( [ data1[dd][item], n1n2] )
			if(n1n2==1) data.push( data1[dd][item].attr );
		}

		var arr = []
		var arrs = []
		for(var c in data){
			for(var cc in data[c]){
				var _c = data[c][cc]
				if(arr[_c.type]) arr[_c.type].value += _c.value;
				else  arr[_c.type] = _c;
			}
		}
		for(var b in arr){
			if(arr[b]) arrs.push(arr[b])
		}

		return arrs;
	}

	/** 获取排序后的戒语组合数组
	 * 较复杂,请谨慎修改!!!
	*/
	getSortBufs():any[] {
		var data1 = GlobalConfig.ins('ExRingSoulEvil')
		var data = []
		var buf = RingSoulModel.ins().ring_soul_data.arr
		if(!buf || !data1) return [];
		var itemConfig = GlobalConfig.ins('ItemConfig')

		var aa = []
		var attBuf
		for(var i=0;i<7;i++){
			aa.push( {lv:0, value:null} )
		}
		for(let j in buf){
			if(!buf[j])  continue;
			aa[j].lv = itemConfig[buf[j].configID].zsLevel

			for(let q of buf[j].att){
				if(q.type==AttributeType.atRingBuff) attBuf = q.value
			}

			aa[j].value = attBuf
		}

		for(let dd in data1){
			let lv = 0
			let item = 1  //全没有则设为1
			
			let n1n2 = 0
			for(let ddd in data1[dd]){
				var de = data1[dd][ddd].evil
				var n1 = 0
				var n2 = 0
				var tempA = [false,false,false,false,false,false,false]  //是否已判断槽位
				for(let dddd of de){
					// var tf = false
					// for(let aaa of aa){
					// 	if(aaa.value && aaa.lv>=data1[dd][ddd].zslevel && aaa.value==dddd) 
					// 		tf = true
					// }
					for(let aaa in aa){
						if(aa[aaa].value && aa[aaa].lv>=data1[dd][ddd].zslevel && aa[aaa].value==dddd && !tempA[aaa]) {
							tempA[aaa] = true
							n1++
							break;
						}
					}
					// if(tf)  n1++
					n2++
				}
				n2 = n2==0 ? 1 : n2
				if(n1/n2>0 && n1/n2>n1n2){
					n1n2 = n1/n2
					item = data1[dd][ddd].zslevel
				}
				else if(n1/n2>0 && n1/n2==n1n2){
					item = data1[dd][ddd].zslevel>item ? data1[dd][ddd].zslevel : item
				}

			}
			
			data.push( [ data1[dd][item], n1n2] )

		}
		//data排序
		var data2 = []
		for(let h=0; h<data.length ; h++){
			var temp 
			for(let g=h+1; g<data.length ; g++){
				if(data[h][1]<data[g][1]){
					temp = data[h]
					data[h] = data[g]
					data[g] = temp
				}
				if(data[h][1]==data[g][1] && data[h][0].zslevel<data[g][0].zslevel){
					temp = data[h]
					data[h] = data[g]
					data[g] = temp
				}
			}
		}
		
		for(let w of data){
			data2.push(w[0])
		}
		return data2
	}

	/**[ lv value ]*/
	getKeyValue(){
		var buf = RingSoulModel.ins().ring_soul_data.arr
		if(!buf) return [];
		var itemConfig = GlobalConfig.ins('ItemConfig')

		var aa = []
		var attBuf
		for(var i=0;i<7;i++){
			aa.push( {lv:0, value:null} )
		}
		for(let j in buf){
			if(!buf[j])  continue;
			aa[j].lv = itemConfig[buf[j].configID].zsLevel

			for(let q of buf[j].att){
				if(q.type==AttributeType.atRingBuff) attBuf = q.value
			}

			aa[j].value = attBuf
		}
		return aa
	}
}
window["RingSoulModel"]=RingSoulModel