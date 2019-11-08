//RingSoulWashFinish.ts
class RingSoulWashFinish  extends BaseEuiPanel {
    //dialogCloseBtn: eui.Button
    attr1: eui.Label
    attr2: eui.Label
    attr3_1: RingBuffName
    attr1_2: eui.Label
    attr2_2: eui.Label
    attr3_2: RingBuffName
    public constructor() {
        super();
        this.skinName = "RingSoulWashFinishSkin";
    }

	open(...param: any[]) {
        // this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickClose, this)
       // this.AddClick(this.dialogCloseBtn,this.clickClose)
        
        var num = param[0]
        var v1 = param[1]
        var arr = RingSoulModel.ins().ring_soul_data.arr
        if(arr[num] && num!=null && v1!=null){
            var att2 = arr[num].att
            var v2
            for(let j in att2){
				if(att2[j].type == AttributeType.atRingBuff) v2 = att2[j].value
			}
            var str1 = ZhuanZhiModel.ins().getZhuanZhiEquipBaseAttr(arr[num]); 
			var str = AttributeData.getAttStr(str1, 0, 1, "： "); 
            
            this.attr1.text = str
            this.attr2.y = this.attr1.height + this.attr1.y + 10
            this.attr3_1.y = this.attr2.y - 6
            this.attr1_2.text = str
            this.attr2_2.y = this.attr2.y
            this.attr3_2.y = this.attr3_1.y
            this.attr3_1.setImage(true)
            this.attr3_2.setImage(true)
            var v1_n = RingSoulModel.ins().getRingBuffName()[v1].name
            var v2_n = RingSoulModel.ins().getRingBuffName()[v2].name
            this.attr3_1.setLabel(v1_n)
            this.attr3_2.setLabel(v2_n)
        }
        this.m_bg.init(`RingSoulWashFinish`,`提示`)
        
    }

    clickClose(e){
        ViewManager.ins().close(RingSoulWashFinish)
    }

    close() {

    }

}
ViewManager.ins().reg(RingSoulWashFinish, LayerManager.UI_Popup);
window["RingSoulWashFinish"]=RingSoulWashFinish