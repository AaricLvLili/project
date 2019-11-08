class ZhuzaiEquipItemTab {

	private m_ItemTab: eui.Component
	// private m_Callback: Function
	// private m_ThisObject: any

	private m_Tab: eui.ToggleButton[]
	private m_SelectIndex: number;

	// public constructor(itemTab: eui.Component, callback: Function, thisObject: any) {
	// 	this.m_ItemTab = itemTab
	// 	this.m_Callback = callback
	// 	this.m_ThisObject = thisObject

	// 	this.m_Tab = []
	// 	for (var e = 0; 4 > e; e++) {
	// 		this.m_Tab.push(itemTab["tab" + e]);
	// 	}
	// 	this.m_Tab[0].selected = true
	// 	this.m_SelectIndex = 0
	// }

	private m_Listener: Function[] = []

	public constructor(itemTab: eui.Component) {
		this.m_ItemTab = itemTab
		// this.m_Callback = callback
		// this.m_ThisObject = thisObject

		this.m_Tab = []
		for (var e = 0; 4 > e; e++) {
			this.m_Tab.push(itemTab["tab" + e]);
		}
		this.m_Tab[0].selected = true
		this.m_SelectIndex = 0
	}

	public AddListener(callback: Function, thisObject: any) {
		this.m_Listener.push(callback, thisObject)
	}

	public RemoveListener(callback: Function, thisObject: any) {
		for (let i = 0; i < this.m_Listener.length; i = i + 2) {
			if (this.m_Listener[i] == callback && this.m_Listener[i + 1] == thisObject) {
				delete this.m_Listener[i + 1]
				delete this.m_Listener[i]
				break
			}
		}
	}

	public Open() {
		for (var i = 0; i < this.m_Tab.length; i++) {
			this.m_Tab[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClick, this);
		}
	}

	public Close() {
		for (var i = 0; i < this.m_Tab.length; i++) {
			this.m_Tab[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClick, this);
		}
	}

	private OnClick(e: egret.TouchEvent) {
		this.m_SelectIndex = this.m_Tab.indexOf(e.currentTarget)
		this._Set()
	}

	private _Set(): void {
		for (var i = 0; i < this.m_Tab.length; i++) {
			this.m_Tab[i].selected = this.m_SelectIndex == i
		}

		for (let i = 0; i < this.m_Listener.length; i = i + 2) {
			if (this.m_Listener[i]) {
				this.m_Listener[i].call(this.m_Listener[i + 1])
			}
		}
	}

    EquipPointConstConfig:any;
	setEquipPoint(zhuzaiDatas: ZhuZaiData[], funcName: string) {
		if(	this.EquipPointConstConfig == null )
			this.EquipPointConstConfig = GlobalConfig.ins("EquipPointGrowUpConfig");
		var config = GlobalConfig.equipPointBasicConfig
		for (let datas = zhuzaiDatas, i = 0; i < this.m_Tab.length; i++) {
			let tab = this.m_Tab[i]
			let data = datas[i]
			if (data.lv) {
				var temp = this.EquipPointConstConfig[data.id][data.lv]
				if(temp)
				{
					tab.label = (config[i + 1].name)
					tab["lvTxt"].text = temp.rank+GlobalConfig.jifengTiaoyueLg.st100103;
				}
			} else {
				tab.label = ((config[i + 1].activationLevel / 1e3 >> 0) + GlobalConfig.jifengTiaoyueLg.st100104)
				tab["lvTxt"].text = ""
			}
			let [img, bgImg] = ZhuzaiEquip.GetBgIconByData(data)
			tab.icon = img
			tab["redPoint"].visible = data[funcName]()
			tab["bg"].source = bgImg
		}
	}

	public GetSelectIndex(): number {
		return this.m_SelectIndex
	}

	public SetSelectIndex(index: number): void {
		this.m_SelectIndex = index
		this._Set()
	}
}
window["ZhuzaiEquipItemTab"]=ZhuzaiEquipItemTab