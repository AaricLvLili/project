class SpecialRingPreviewPanel extends BaseEuiPanel {

    public static LAYER_LEVEL = LayerManager.UI_Popup

	//private dialogCloseBtn:eui.Button;
	private arrow: eui.Image
	private list: eui.DataGroup
	private attrGroup: eui.DataGroup
	// commonWindowBg: CommonWindowBg
	public constructor() {
		super()
		this.skinName = "SpecialRingPreviewSkin"
		this.attrGroup.itemRenderer = SpecialRingPreviewItem1
		this.list.itemRenderer = SpecialRingPreviewItem2
		// this.commonWindowBg.title = ''
	}

	public open(...param: any[]) {
		//this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		let id = param[0]    //100001    技能
		let level = param[1] //1         阶数

		let curConfig = GlobalConfig.publicSpeRRConfig[id][level - 1]
		let nextConfig = GlobalConfig.publicSpeRRConfig[id][level]
		this.arrow.visible = nextConfig ? true : false
        
		let list1 = [{num:0,id: id, level: level}]
        let list2 = [{num:0,id: id, level: level}]
		if (nextConfig) {
			list1.push({num:1,id: id, level: level})
			list2.push({num:1,id: id, level: level+1})
		}


		this.attrGroup.dataProvider = new eui.ArrayCollection(list2)
		this.list.dataProvider = new eui.ArrayCollection(list1)
		this.m_bg.init(`SpecialRingPreviewPanel`,`升阶`)
	}

	public close() {
		//this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	}
	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}
}

class SpecialRingPreviewItem1 extends eui.ItemRenderer {

	private ringIcon: eui.Image
	private ringNameImg: eui.Label //ui.Image
	private attr: eui.Component
	private powerLabel: eui.Label
	private levelLabel: eui.Label
	protected childrenCreated() {

	}

	protected dataChanged() {
		let data: {
			num:number,
			id: number,
			level: number
		} = this.data

		// this.ringNameImg.source = SpecialRingWin.GetRingNameImg(data.id)
		this.ringNameImg.text = SpecialRingWin.ringNames[SpecialRingWin.GetIdIndex(data.id)-1]
		this.levelLabel.text = `（${data.level}阶）`
		this.ringIcon.source = SpecialRingWin.GetRingIconImg(data.id)
		this.powerLabel.text = `战斗力：${SpecialRingWin.GetRingPower(data.id, data.level)}`
		SpecialRingWin.SetAttrLabelByData(this.attr, data.id, data.level, this.itemIndex == 0 ? "ui_tj_zi_dqsx" : "ui_tj_xjsx")
	}
}

class SpecialRingPreviewItem2 extends eui.ItemRenderer {

	//private lvImg: eui.Image
	private content: eui.Component
	//private lvLabel: eui.Label
	private lv:eui.Label

	protected childrenCreated() {

	}

	protected dataChanged() {
		let data: {
			num:number,
			id: number,
			level: number
		} = this.data
		let num=data.num
		let tj_lv=[5,10,15,20]
		//let SkillId=GlobalConfig.publicSpeRRConfig[data.id][data.level].skillid
        let SkillId=GlobalConfig.publicSpeRRConfig[data.id][data.level-1].skillid
		let Sk_lv=GlobalConfig.skillsConfig[SkillId].displayLevel
		//this.lvImg.source = this.itemIndex == 0 ? "ui_tj_zi_dqjn" : "ui_tj_zi_xjjn"
		//this.lvLabel.text = data.level + ""
		if(num==0){
          this.lv.text="当前技能"
		  SpecialRingWin.SetSkillAttrLabel(this.content,data.id, data.level,Sk_lv)
		}else{
			       
			     let level
				 let sk_lv
                 if(data.level<tj_lv[0]){					 
                    this.lv.text="下级技能(特戒"+tj_lv[0]+"阶开启)"
					level=tj_lv[0];
					sk_lv=2
				 }
				 if(data.level>=tj_lv[0]&&data.level<tj_lv[1]){
                    this.lv.text="下级技能(特戒"+tj_lv[1]+"阶开启)"
					level=tj_lv[1];
					sk_lv=3
				 }
				 if(data.level>=tj_lv[1]&&data.level<tj_lv[2]){
                    this.lv.text="下级技能(特戒"+tj_lv[2]+"阶开启)"
					level=tj_lv[2];
					sk_lv=4
				 }
				 if(data.level>=tj_lv[2]&&data.level<tj_lv[3]){
                    this.lv.text="下级技能(特戒"+tj_lv[3]+"阶开启)"
					level=tj_lv[3];
					sk_lv=5
				 }
				 if(data.level>=tj_lv[3]){
                    this.lv.text="已经升至满级"
					level=tj_lv[3];
				 }		
				 SpecialRingWin.SetSkillAttrLabel(this.content,data.id,level,sk_lv)	 		    
		}
	}
}
window["SpecialRingPreviewPanel"]=SpecialRingPreviewPanel
window["SpecialRingPreviewItem1"]=SpecialRingPreviewItem1
window["SpecialRingPreviewItem2"]=SpecialRingPreviewItem2