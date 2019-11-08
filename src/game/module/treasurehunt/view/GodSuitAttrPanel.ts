// class GodSuitAttrPanel extends BaseEuiPanel implements ICommonWindowTitle, ICommonWindow, ICommonWindowRoleSelect {
class GodSuitAttrPanel extends BaseEuiPanel {
	public constructor() {
		super()
	}
	// commonWindowBg: CommonWindowBg
	//private dialogCloseBtn: eui.Button;
	// godsuit: number[]
	attrList: eui.DataGroup
	scroller: eui.Scroller
	//label: eui.Label
	label0: eui.Label

	private height01 = 530
	private height02 = 487
	private labelY = 88
	private languageTxt:eui.Label;

	initUI() {
		super.initUI()
		this.skinName = "GodSuitAttrSkin"
		this.attrList.itemRenderer = GodSuitAttrItem
		this.languageTxt.text = GlobalConfig.jifengTiaoyueLg.st100642;
	};
	public static GetStage(configID) {
		return LegendModel.GetStage(configID)
	}
	open(...param: any[]) {
		this.m_bg.init(`GodSuitAttrPanel`, GlobalConfig.jifengTiaoyueLg.st100302)
		this.m_Role = param[0]
		//this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);

		// this.height01 = this.commonDialog.height
		// this.height02 = this.scroller.height

		// for (let i = 1; i <= this.attrList.numChildren; ++i) {
		// 	let configData = GlobalConfig.ins("LegendSuitConfig")[i]
		// 	let comp = this.attrList.getChildAt(i - 1)
		// 	for (let j = 0; j < 4; ++j) {
		// 		let index = ((j + 1) * 2)
		// 		comp["info" + j].text = `(${index}/8)${AttributeData.getAttStr(new AttributeData(configData["attr" + index][0]), 0)}`
		// 	}
		// }

		this.UpdateContent()
	}
	close() {
		//this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	}

	private _OnClick(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}
	// changeLabels: eui.Label[] = []
	UpdateContent() {

		let godsuit = []
		// let len = LegendEquipPanel.GetMaxRank();
		let len = 1;
		for (let i = 0; i < len; ++i) {
			let l = []
			let lv = [];
			for (let j = 0; j < EquipPos.MAX; ++j) {
				l[j] = false
				lv[j] = 0;
			}
			godsuit[i] = { mIndex: i, mEquipSet: l, mLv: lv }
		}

		let role = this.m_Role
		for (let i = 0; i < EquipPos.MAX; ++i) {
			let equipData = role.getEquipByIndex(i);
			if (equipData.goditem.configID > 0) {
				let stage = GodSuitAttrPanel.GetStage(equipData.goditem.configID)
				// godsuit[stage - 1].mEquipSet[i] = true
				godsuit[0].mEquipSet[i] = true
				godsuit[0].mLv[i] = stage;
			}
		}

		// for (let i = godsuit.length - 1; i >= 0; --i) {
		// 	let data = godsuit[i]
		// 	let has = false
		// 	for (let state of data.mEquipSet) {
		// 		if (state) {
		// 			has = true
		// 			break
		// 		}
		// 	}
		// 	if (!has) {
		// 		godsuit.splice(i, 1)
		// 	}
		// }

		this.label0.visible = godsuit.length == 0
		this.attrList.dataProvider = new eui.ArrayCollection(godsuit)
		this.attrList.validateNow()

		let h = 0
		for (let i = 0; i < this.attrList.numChildren; ++i) {
			h += (this.attrList.getChildAt(i) as eui.Component).height
		}

		// this.scroller.height = Math.min(this.height02, h) + 10
		// this.commonDialog.height = this.height01 - this.height02 + this.scroller.height
		// this.label.y = this.labelY + (this.height01 - this.commonDialog.height) * 0.5 + 13
		// this.label0.y = this.label.y
	}

	// private _roleId: number
	private m_Role: Role
};

class GodSuitAttrItem extends eui.ItemRenderer {

	private totalneme: eui.Label
	private m_EquipPosGroup: eui.Label[]
	private m_EquipLvGroup: eui.Label[];
	public equipLvGroup: eui.Group;

	private m_Info: eui.Label[] = []

	private static NORMAL = 0x9E9E9E
	private static LABEL_HEIGHT = 19
	private static HEIGHT = 144

	public constructor() {
		super()
	}

	public childrenCreated() {
		GodSuitAttrItem.HEIGHT = this.height
		for (let i = 0; i < 4; ++i) {
			this.m_Info[i] = this["info" + i]
			GodSuitAttrItem.LABEL_HEIGHT = this.m_Info[i].height
		}
		this.m_EquipPosGroup = (this["equipPosGroup"] as eui.Group).$children as eui.Label[]
		this.m_EquipLvGroup = this.equipLvGroup.$children as eui.Label[];
		GodSuitAttrItem.NORMAL = this.m_EquipPosGroup[0].textColor
	}

	public dataChanged() {
		let equipSet = this.data.mEquipSet
		let index = this.data.mIndex
		let count = 0
		for (let i = 0; i < equipSet.length; ++i) {
			let set = equipSet[i]
			this.m_EquipPosGroup[i].textColor = set ? Color.Green : GodSuitAttrItem.NORMAL;
			this.m_EquipLvGroup[i].textColor = set ? Color.Green : GodSuitAttrItem.NORMAL;
			this.m_EquipPosGroup[i].text = GodSuitAttrItem.godSuitToName(i);
			count = count + (set ? 1 : 0)
		}
		let dic: Dictionary<number> = new Dictionary<number>();
		let lvs: number[] = this.data.mLv;
		for (var i = 0; i < lvs.length; i++) {
			let lv = lvs[i];
			if (lv == 0) {
				this.m_EquipLvGroup[i].text = "(" + GlobalConfig.jifengTiaoyueLg.st100280 + ")";
			} else {
				this.m_EquipLvGroup[i].text = "(" + lv + GlobalConfig.jifengTiaoyueLg.st100103 + ")";
			}
			for (var f = 0; f < lvs.length; f++) {
				if (lvs[i] <= lvs[f] && f != i) {
					let num = dic.get(lvs[i]);
					if (!num) {
						dic.set(lvs[i], lvs[i]);
					}
				}
			}
		}
		let maxDic: Dictionary<number> = new Dictionary<number>();
		let replv: number[] = dic.values;
		for (var i = 0; i < replv.length; i++) {
			for (var f = 0; f < lvs.length; f++) {
				if (replv[i] <= lvs[f]) {
					let maxNum = maxDic.get(replv[i]);
					if (maxNum) {
						maxNum += 1;
					} else {
						maxNum = 1;
					}
					maxDic.set(replv[i], maxNum);
				}
			}
		}
		let maxKey: number[] = maxDic.keys;
		maxKey.sort(this.sorLv);
		let showCount = Math.min(Math.floor(count * 0.5) + 1, EquipPos.MAX >> 1)
		// this.totalneme.text = `神装神装${index + 1}阶(${count}/${EquipPos.MAX})`


		for (let j = 0; j < 4; ++j) {
			let index = (j + 1) * 2
			let info = this.m_Info[j]
			let maxLv: number = 0;
			for (var f = 0; f < maxKey.length; f++) {
				if (maxDic.get(maxKey[f]) >= index) {
					maxLv = maxKey[f];
					break;
				}
			}
			// let textColor = count >= index ? Color.Green : GodSuitAttrItem.NORMAL
			let configData = GlobalConfig.ins("LegendSuitConfig")[maxLv];
			if (!configData) {
				configData = GlobalConfig.ins("LegendSuitConfig")[1];
			}
			if (count >= index) {
				info.textFlow = <Array<egret.ITextElement>>[
					{ text: `(${index}/8)${AttributeData.getAttStr(new AttributeData(configData["attr" + index][0]), 0)}`, style: { "textColor": Color.Green } },
					{ text: "(" + maxLv + GlobalConfig.jifengTiaoyueLg.st100641 + ")", style: { "textColor": 0xEDCB57 } },
				]
			} else {
				info.textFlow = <Array<egret.ITextElement>>[
					{ text: `(${index}/8)${AttributeData.getAttStr(new AttributeData(configData["attr" + index][0]), 0)}`, style: { "textColor": GodSuitAttrItem.NORMAL } },
					{ text: "(" + GlobalConfig.jifengTiaoyueLg.st100340 + ")", style: { "textColor": GodSuitAttrItem.NORMAL } },
				]
			}
			info.visible = j < showCount
		}
		this.height = GodSuitAttrItem.HEIGHT - (4 - showCount) * GodSuitAttrItem.LABEL_HEIGHT
	}
	/**关联排序 */
	private sorLv(item1: number, item2: number): number {
		return item2 - item1;
	}

    public static godSuitToName(type){
        let realType = [
            GlobalConfig.jifengTiaoyueLg.st100114,//"武器",
            GlobalConfig.jifengTiaoyueLg.st100115,//"头盔",
            GlobalConfig.jifengTiaoyueLg.st100116,//"衣服",
            GlobalConfig.jifengTiaoyueLg.st100117,//"项链",
            GlobalConfig.jifengTiaoyueLg.st100118,//"手镯",
			GlobalConfig.jifengTiaoyueLg.st100118,//"手镯",
            GlobalConfig.jifengTiaoyueLg.st100119,//"戒指",
			GlobalConfig.jifengTiaoyueLg.st100119,//"戒指",
        ];
        return realType[type];
    }
}

ViewManager.ins().reg(GodSuitAttrPanel, LayerManager.UI_Popup);
window["GodSuitAttrPanel"] = GodSuitAttrPanel
window["GodSuitAttrItem"] = GodSuitAttrItem