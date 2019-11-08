class SelectMemberPanelWin extends BaseEuiPanel {

	public static LAYER_LEVEL = LayerManager.UI_Popup

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // SelectMemberPanelSkin.exml
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private sureBtn: eui.Button
    private list: eui.List
    private chooseNum: eui.Label
    ////////////////////////////////////////////////////////////////////////////////////////////////////

	index
	maxNum
	selectList: SelectInfoData[]
	numList: number[]
	public selectItemList: SelectInfoData[] = []
	//private dialogCloseBtn:eui.Button;

	public constructor() {
		super()
		this.skinName = "SelectMemberPanelSkin"
		this.list.itemRenderer = MemberItem3Renderer
		this.sureBtn.label = GlobalConfig.jifengTiaoyueLg.st100040;
	}

	open(...param: any[]) {
		this.index = param[0]
		this.maxNum = param[1]
		//this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		this.list.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.sureBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		GuildReward.ins().sendList[this.index] = []
		GuildReward.ins().sendNumList[this.index] = []
		this.selectList = []
		this.numList = []
		this.selectItemList = []
		this.chooseNum.text = GlobalConfig.jifengTiaoyueLg.st101783 + " " + this.countNum() + "/" + this.maxNum
		this.sureBtn.enabled = this.selectList.length == this.maxNum
		this.refushList()
		this.m_bg.init(`SelectMemberPanelWin`,GlobalConfig.jifengTiaoyueLg.st101784)
	}
	
	refushList() {
		this.list.dataProvider = new eui.ArrayCollection(GuildReward.ins().getMyGuildPointRank())
	}
	
	close() {
		//this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
		this.list.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.sureBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		GameGlobal.MessageCenter.dispatch(MessageDef.GUILDWAR_SENDLIST_CHANGE)
	}
	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}
	countNum() {
		var count = 0;
		if (this.selectItemList) {
			for (var key in this.selectItemList) {
				count += this.selectItemList[key].chooseNum;
			} 
		}
		return count
	}
	
	onTap(e) {
		switch (e.currentTarget) {
			case this.sureBtn:
				this.toNumList()
				GuildReward.ins().sendList[this.index] = this.selectList
				GuildReward.ins().sendNumList[this.index] = this.numList
				ViewManager.ins().close(this);
				break;
			case this.list:
				var comp = e.target.parent as MemberItem3Renderer
				if (comp && comp.data) {
					let memberData = comp.data as SelectInfoData
					var i = this.selectItemList.lastIndexOf(memberData);
					switch (e.target) {
						case comp.btn1:
							// --comp.chooseNum
							--memberData.chooseNum
							memberData.chooseNum < 1 && (memberData.chooseNum = 1);
							break;
						case comp.btn2:
							if (this.countNum() >= this.maxNum) {
								UserTips.ErrorTip(GlobalConfig.jifengTiaoyueLg.st101789);//分配人数已满
								return
							}
							++memberData.chooseNum;
							break;
						default:
							if (i >= 0) {
								comp.checkBoxs.selected = false
								memberData.chooseNum = 0
								this.selectItemList.splice(i, 1);
							} else {
								if (this.countNum() >= this.maxNum) {
									comp.checkBoxs.selected = false
									UserTips.ErrorTip(GlobalConfig.jifengTiaoyueLg.st101789);//分配人数已满
									return
								}
								comp.checkBoxs.selected = true
								this.selectItemList.push(memberData)
								memberData.chooseNum = 1
							}
					}
					comp.num1.text = memberData.chooseNum + ""
					this.setAddInfoShow(comp, comp.checkBoxs.selected)
					this.chooseNum.text = GlobalConfig.jifengTiaoyueLg.st101783 + " " + this.countNum() + "/" + this.maxNum
					this.sureBtn.enabled = this.countNum() == this.maxNum
				}
		}
	}
	
	setAddInfoShow(comp, state = false) {
		comp.btn1.visible = comp.btn2.visible = comp.num1.visible = comp.inputBg.visible = state
	}
	
	toNumList() {
		if (this.selectItemList) {
			for (var key in this.selectItemList) {
				this.selectList.push(this.selectItemList[key])
				this.numList.push(this.selectItemList[key].chooseNum)
			}
		}
	}
}
window["SelectMemberPanelWin"]=SelectMemberPanelWin