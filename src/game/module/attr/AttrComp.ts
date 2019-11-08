class AttrComp extends eui.Component {
	public constructor() {
		super();
		this.skinName = "AttrCompSkin";
	}

	private m_ArrImg: eui.Image;
	private m_LeftGroup: eui.Group;
	private m_LeftLab: eui.Label;
	private m_LeftTitel: eui.Label;
	private m_RightGroup: eui.Group;
	private m_RightLab: eui.Label;
	private m_RightTitle: eui.Label;

	public setState(state = "state1") {
		this.currentState = state;
	}
	public setLeftAttr(attr: any[], strlist: string[] = []) {
		let pAttrList = [];
		for (var i = 0; i < strlist.length; i++) {
			let str1 = strlist[i].split("+")
			let str2 = str1[1].split("%");
			let str3;
			if (str2[0] != "?") {
				str3 = parseInt(str2[0]);
				pAttrList.push(str3);
			} else {
				break;
			}
		}
		let newAttr = [];
		if (pAttrList.length > 0) {
			for (var i = 0; i < pAttrList.length; i++) {
				let value = { type: attr[i].type, value: attr[i].value * (pAttrList[i] / 100) + attr[i].value }
				newAttr.push(value);
			}
		} else {
			newAttr = attr;
		}
		this.m_LeftLab.textFlow = (new egret.HtmlTextParser).parser(GlobalConfig.jifengTiaoyueLg.st100306 + "：<font color='#008f22'>" + UserBag.getAttrPower(newAttr) + "</font>")
		AttributeData.setAttrGroup(attr, this.m_LeftGroup, 16, Color.FontColor, false, Color.Green, strlist, true);
		this.m_LeftGroup.validateDisplayList();
	}
	public setRightAttr(attr: any[], strlist: string[] = []) {
		this.m_RightLab.textFlow = (new egret.HtmlTextParser).parser(GlobalConfig.jifengTiaoyueLg.st100306 + "：<font color='#008f22'>" + UserBag.getAttrPower(attr) + "</font>")
		AttributeData.setAttrGroup(attr, this.m_RightGroup, 16, Color.FontColor, false, Color.Green, strlist, true);
		this.m_RightGroup.validateDisplayList();
	}

	public setLeftLab(str: string) {
		this.m_LeftTitel.text = str;
	}
	public setRightLab(str: string) {
		this.m_RightTitle.text = str;
	}


}
window["AttrComp"] = AttrComp;