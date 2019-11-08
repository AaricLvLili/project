class ConsumeLabel extends eui.Component implements eui.UIComponent {

	private label0: eui.Label
	private label: eui.Label
	private richGroup: eui.Group

	private m_ConsumeType: string
	private m_ConsumeValue: number
	private m_CurValue: number

	private m_ConsumeRich: string[][]

	private m_CacheValue: string

	private m_Types: eui.Label[] = []
	private m_Icons: eui.Image[] = []

	public set consumeType(value) {
		this.m_ConsumeType = value
	}

	public set consumeRich(value: string | string[][] | string[]) {
		this.m_ConsumeRich = []
		if (typeof (value) == "string") {
			let array = value.split("|")
			for (let data of array) {
				this.m_ConsumeRich.push(data.split(","))
			}
		} else {
			if (value.length > 0) {
				if (typeof (value[0]) == "string") {
					let list = []
					list.push(value)
					value = list
				}
			}
			this.m_ConsumeRich = <any>value
		}
		this._UpdateContent()
	}

	public set maxTip(value) {
		if (this.richGroup != null)
			this.richGroup.visible = false;
		if (this.label != null) {
			this.label.visible = true
			this.label.visible = value
		}
	}

	public set consumeValue(value: any) {
		this.m_ConsumeValue = parseInt(value)
		this._UpdateContent()
	}

	public get consumeValue() {
		return this.m_ConsumeValue
	}

	public set curValue(value: any) {
		this.m_CurValue = parseInt(value)
		this._UpdateContent()
	}

	public get curValue() {
		return this.m_CurValue
	}

	private _UpdateRich(): void {
		this.label.visible = false
		this.richGroup.visible = true

		this.m_Types = []
		this.m_Icons = []
		for (let i = 0; i < this.richGroup.numChildren; ++i) {
			let child = this.richGroup.getChildAt(i)
			if (egret.is(child, "eui.Label")) {
				this.m_Types.push(<eui.Label>child)
			} else if (egret.is(child, "eui.Image")) {
				this.m_Icons.push(<eui.Image>child)
			} else {
				console.warn("ConsumeLabel:_UpdateContent Not Define Type", child)
			}
		}
		this.richGroup.removeChildren()

		let label = this._GetTypelabel()
		label.text = (this.m_ConsumeType ? this.m_ConsumeType : GlobalConfig.jifengTiaoyueLg.st100218) + "："
		this.richGroup.addChild(label)

		for (let i = 0, len = this.m_ConsumeRich.length; i < len; ++i) {
			let data = this.m_ConsumeRich[i]
			let icon = data[0]
			let cur = data[1]
			let value = data[2]

			if (!value) {
				value = " " + cur
				cur = null
			} else {
				cur += " "
			}

			let img = this._GetTypeIcon()
			img.source = icon
			this.richGroup.addChild(img)

			if (cur) {
				let label = this._GetTypelabel()
				label.text = cur + "/"
				this.richGroup.addChild(label)
			}

			if (value) {
				let label = this._GetTypelabel()
				if (i != len - 1) {
					value += "        "
				}
				label.text = value
				this.richGroup.addChild(label)
			}
		}

		egret.callLater(this._CallLater, this)
	}

	private _CallLater(): void {
		this.richGroup.x = (480 - this.richGroup.width) * 0.5
	}

	private _GetTypelabel(): eui.Label {
		let label = this.m_Types.length > 0 ? this.m_Types.pop() : null
		if (!label) {
			label = new eui.Label
			label.size = 13
			label.textColor = 0x535557
		}
		return label
	}

	private _GetTypeIcon(): eui.Image {
		let img = this.m_Icons.length > 0 ? this.m_Icons.pop() : null
		if (!img) {
			img = new eui.Image
			img.maxWidth = 30
			img.maxHeight = 30
		}
		return img
	}

	private _UpdateContent() {
		// if (!this.$stage) {
		// 	return
		// }
		if (this.m_ConsumeRich) {
			this._UpdateRich()
			return
		}
		this.label.visible = true
		this.richGroup.visible = false
		let str = GlobalConfig.jifengTiaoyueLg.st100218;//"消耗"
		if (this.m_ConsumeType) {
			str += this.m_ConsumeType
		}
		str += "：";
		// 特殊处理一下有黑色背景的
		if (this.currentState == "bg" && this.label0 != null) {
			this.label0.textFlow = TextFlowMaker.generateTextFlow(str);
			str = "";
		}
		if (this.m_CurValue != null) {
			if (this.m_ConsumeValue != null)
				str += (this.m_CurValue < this.m_ConsumeValue ? "|C:0xf87372&T:" : "|C:0x008f22&T:") + CommonUtils.overLength(this.m_CurValue) + "|C:0x535557&T:" + "|/";
			else
				str += CommonUtils.overLength(this.m_CurValue) + "/";
		}
		// else {

		// 	str += 0
		// }
		// str += "/"
		if (this.m_ConsumeValue != null) {
			str += "|C:0x535557&T:" + CommonUtils.overLength(this.m_ConsumeValue)
		} else {
			str += 0
		}
		// if (this.m_ConsumeType == "宝石碎片" || this.m_ConsumeType == "强化石"
		// 	|| this.m_ConsumeType == "灵魄" || this.m_ConsumeType == "神装碎片"
		// 	|| this.m_ConsumeType == "龙珠碎片" || this.m_ConsumeType == "龙鳞碎片" ||
		// 	this.m_ConsumeType == "龙纹碎片" || this.m_ConsumeType == "龙魂碎片") {
		// 	this.label.textFlow = TextFlowMaker.generateTextFlow(str, 1);
		// } else {
		// 	this.label.textFlow = TextFlowMaker.generateTextFlow(str);
		// }
		if (this.m_ConsumeType == GlobalConfig.jifengTiaoyueLg.st100655 || this.m_ConsumeType == GlobalConfig.jifengTiaoyueLg.st100656
			|| this.m_ConsumeType == GlobalConfig.jifengTiaoyueLg.st100657 || this.m_ConsumeType == GlobalConfig.jifengTiaoyueLg.st100496
			|| this.m_ConsumeType == GlobalConfig.jifengTiaoyueLg.st100658 || this.m_ConsumeType == GlobalConfig.jifengTiaoyueLg.st100659 ||
			this.m_ConsumeType == GlobalConfig.jifengTiaoyueLg.st100660 || this.m_ConsumeType == GlobalConfig.jifengTiaoyueLg.st100661) {
			this.label.textFlow = TextFlowMaker.generateTextFlow(str, 1);
		} else {
			this.label.textFlow = TextFlowMaker.generateTextFlow(str);
		}

	}

	public static GetValueColor(value, needValue): egret.ITextElement[] {
		value = value || 0
		return TextFlowMaker.generateTextFlow(StringUtils.addColor(value, value >= needValue ? 0x008f22 : Color.Red) + "/" + needValue)
	}

	public constructor() {
		super();
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}

	protected childrenCreated(): void {
		super.childrenCreated();
		this._UpdateContent()
	}

	public ShowMaxTip(value: string): void {
		if (!value) {
			return
		}
		this.m_CacheValue = this.label.text
		this.label.text = value
	}

	// public static GetLabelText(cur: number, need: number): string {
	// 	// return cur < need ? "|C:0xf87372&T:"
	// 	// if (cur < need) {
	// 	// 	return "|C:0xf87372&T:" : "|C:0x008f22&T:") + this.m_CurValue + "|/"
	// 	// }
	// 	// return `|${cur < need ? "C:0xf87372&T": "" }${cur}|/${need}`
	// }
}
window["ConsumeLabel"] = ConsumeLabel