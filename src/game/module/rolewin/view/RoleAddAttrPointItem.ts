class RoleAddAttrPointItem extends eui.Component {
	public constructor() {
		super();
		this.skinName = "RoleAddAttrPointItemSkin";
	}

	private config: any;
	public data: RoleAddAttrPointData;
	public num: number;
	private addBtn: eui.Button;
	private subBtn: eui.Button;
	private attr0: eui.Label;
	private attr1: eui.Label;
	private attr2: eui.Label;
	private isBEGIN: boolean = false;
	public addItem0: RoleAddAttrPointItem;
	public addItem1: RoleAddAttrPointItem;
	public addItem2: RoleAddAttrPointItem;
	public addItem3: RoleAddAttrPointItem;
	public m_LabGroup: eui.Group;

	public numLabel: eui.EditableText;

	public createChildren() {
		super.createChildren()
		this.addBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBegin, this);
		this.subBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBegin, this);
		this.addBtn.addEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this);
		this.subBtn.addEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this);
		this.addBtn.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onEnd, this);
		this.subBtn.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onEnd, this);
		this.numLabel.addEventListener(egret.Event.CHANGE, this.onTxtChange, this);
		this.numLabel.restrict = "0-9";
	}

	public release() {
		this.numLabel.text = "0";
		this.num = 0;
		this.isBEGIN = false;
	}

	public setData(cfg?, data?) {
		if (cfg) this.config = cfg;
		if (data) this.data = data;
		this.inputOver();
		let attr = this.config.value;

		let addPoint = this.data.points[this.config.type - 1];

		let attrValue = 0;
		let addValue = 0;
		let str = "";
		let str1 = "";
		let str2 = "";
		let attrName = "";
		let childNum = this.m_LabGroup.numChildren;
		for (var i = 0; i < childNum; i++) {
			let child = this.m_LabGroup.getChildAt(i);
			if (child && child instanceof eui.Label) {
				if (attr[i]) {
					attrName = AttributeData.getAttrStrByType(attr[i][0]);
					if (attr[i][0] == AttributeType.atMpRecoveEx) {
						attrValue = attr[i][1] * addPoint / 100;
						addValue = attr[i][1] * this.num / 100;
						str = addValue ? StringUtils.addColor(` +${addValue.toFixed(4)}%`, Color.Green) : "";
						child.textFlow = TextFlowMaker.generateTextFlow(`${attrName}：${attrValue.toFixed(4)}%` + str);
					}
					else {
						addValue = attr[i][1] * this.num;
						attrValue = attr[i][1] * addPoint;
						str1 = StringUtils.isDot(addValue) ? addValue.toString() : addValue.toFixed(1);
						str2 = StringUtils.isDot(attrValue) ? attrValue.toString() : attrValue.toFixed(1);
						str = addValue ? StringUtils.addColor(` +${str1}`, Color.Green) : "";
						child.textFlow = TextFlowMaker.generateTextFlow(`${attrName}：${str2}` + str);
					}
				} else {
					child.text = "";
				}
			}
		}
	}

	onEnd() {
		this.isBEGIN = false;
	}

	onBegin(e: egret.TouchEvent) {
		this.isBEGIN = true;
		switch (e.currentTarget) {
			case this.addBtn:
				this.onAddBegin();
				break;
			case this.subBtn:
				this.onSubBegin();
				break;
		}
	}

	onAddBegin() {
		if (!this.isBEGIN) return;
		if (this.data.point <= 0)
			UserTips.ErrorTip("剩余点数不足");
		if (RoleAddAttrPointModel.ins().allLastPoint <= 0) {
			return;
		}
		this.num += 1;
		this.numLabel.text = this.num + "";
		this.inputOver();
		this.setData();

		var view: RoleAddAttrPointWin = <RoleAddAttrPointWin>ViewManager.ins().getView(RoleAddAttrPointWin);
		if (view && view.roleAddAttrPointPanel) {
			if (view.roleAddAttrPointPanel.recommendBtn.label == "推荐加点")
				view.roleAddAttrPointPanel.recommendBtn.label = "取消";
		}
		egret.setTimeout(this.onAddBegin, this, 200);
	}

	onSubBegin() {
		if (!this.isBEGIN) return;
		this.num -= 1;
		this.numLabel.text = this.num + "";
		this.inputOver();
		this.setData();

		var view: RoleAddAttrPointWin = <RoleAddAttrPointWin>ViewManager.ins().getView(RoleAddAttrPointWin);
		if (view && view.roleAddAttrPointPanel) {
			if (view.roleAddAttrPointPanel.recommendBtn.label == "推荐加点")
				view.roleAddAttrPointPanel.recommendBtn.label = "取消";
		}
		egret.setTimeout(this.onSubBegin, this, 500);
	}

	inputOver() {
		this.num = parseInt(this.numLabel.text);
		if (isNaN(this.num) || this.num < 0)
			this.num = 0;
		if (this.num > this.data.point)
			this.num = this.data.point;
		this.numLabel.text = this.num + "";
	}
	private onTxtChange() {
		let num = parseInt(this.numLabel.text);
		let lastPoint = RoleAddAttrPointModel.ins().allLastPoint + this.num;
		if (num > lastPoint) {
			this.numLabel.text = lastPoint + "";
		}
		this.inputOver();
		this.setData();
		var view: RoleAddAttrPointWin = <RoleAddAttrPointWin>ViewManager.ins().getView(RoleAddAttrPointWin);
		if (view && view.roleAddAttrPointPanel) {
			if (view.roleAddAttrPointPanel.recommendBtn.label == "推荐加点")
				view.roleAddAttrPointPanel.recommendBtn.label = "取消";
		}
	}
}
window["RoleAddAttrPointItem"] = RoleAddAttrPointItem