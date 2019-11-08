class BlessItem extends eui.Component {
	public constructor() {
		super()
	}
	bless
	selected
	_data: EquipsData;
	red
	_source
	item
	bless1   //已启灵器字体显示
	public m_lvLab: eui.Label;
	private oldlv: number;
	private oldbless: number;
	setIsBlessed(val) {
		this.bless.visible = val;
	};
	getIsSelected() {
		return this.selected.visible;
	};
	setIsSelected(val) {
		this.selected.visible = val;
	};
	setData(data: EquipsData, num: number) {
		this._data = data;
		// this.bless.visible = data.bless > 0;
		// this.bless1.visible = data.bless > 0;
		if (this.getData().bless >= 1) {
			this.red.visible = Bless.ins().checkBlessUpLv(num, data);
		}
		else {
			this.red.visible = Bless.ins().checkIsEnough();
		}
		if (data.blesslv > 0 && data.bless > 0) {
			this.m_lvLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101439, [data.blesslv]);
			this.setSource(ResDataPath.GetEquipDefaultPIcon(num));
		} else {
			this.m_lvLab.text = "";
			this.setSource(ResDataPath.GetEquipDefaultIcon(num));
		}
		if ((this.oldlv != null && this.oldlv < data.blesslv) || (this.oldbless != null && this.oldbless < data.bless)) {
			this.playeEff();
		}
		this.oldlv = data.blesslv;
		this.oldbless = data.bless;

	};
	getData() {
		return this._data;
	};
	getSource() {
		return this._source;
	};
    /**
     * 设置魂珠图标
     */
	setSource(value) {
		if (this._source == value)
			return;
		this._source = value;
		this.item.source = this._source;
	};
	private eff: MovieClip;
	public m_EffGroup: eui.Group;
	private playeEff() {
		this.eff = ViewManager.ins().createEff(this.eff, this.m_EffGroup, "eff_ui_icon", 1)
	}
}
window["BlessItem"] = BlessItem