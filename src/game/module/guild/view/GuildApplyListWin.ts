class GuildApplyListWin extends BaseEuiPanel {
	public constructor() {
		super();
	}

	list
	attrNum
	checkBoxs

	private noLabel: eui.Label
	private oneKeyOk: eui.Button
	private oneKeyCancel: eui.Button
	public m_Lan1: eui.Label;

	//private dialogCloseBtn:eui.Button;

	initUI() {
		super.initUI()
		this.skinName = "MemberApplySkin";
		this.list.itemRenderer = GuildAppltListItemRender;
		this.attrNum.restrict = "0-9";
		this.attrNum.maxChars = 8;
		this.noLabel.text = GlobalConfig.jifengTiaoyueLg.st100950;
		this.oneKeyOk.label = GlobalConfig.jifengTiaoyueLg.st100952;
		this.oneKeyCancel.label = GlobalConfig.jifengTiaoyueLg.st100953;
		this.m_Lan1.text=GlobalConfig.jifengTiaoyueLg.st100951;
	};
	open() {
		this.m_bg.init(`GuildApplyListWin`, GlobalConfig.jifengTiaoyueLg.st100948)
		var param = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			param[_i - 0] = arguments[_i];
		}
		//this.dialogCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClose, this);
		this.list.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onListTouch, this);
		MessageCenter.addListener(Guild.ins().postGuildApplysInfos, this.updateList, this);
		Guild.ins().sendApplyInfos();
		this.checkBoxs.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.attrNum.addEventListener(egret.Event.CHANGE, this.onTxtChange, this);
		this.checkBoxs.selected = Guild.ins().isAuto == 1;
		this.attrNum.text = Guild.ins().attrLimit + "";

		this.AddClick(this.oneKeyOk, this._OnClick)
		this.AddClick(this.oneKeyCancel, this._OnClick)
	};

	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.oneKeyOk:
				{
					let len = Guild.ins().applyPlayers.length
					if ((Guild.ins().getMemberNum() + len) > Guild.ins().GetMaxMember()) {
						UserTips.ErrorTip(GlobalConfig.jifengTiaoyueLg.st100949)
						return;
					}
					for (let data of Guild.ins().applyPlayers) {
						Guild.ins().sendProcessJoin(data.roleID, 1);
					}

					Guild.ins().applyPlayers = []
					Guild.ins().hasApply = false
					Guild.ins().postGuildApplysInfos();
				}
				break
			case this.oneKeyCancel:
				for (let data of Guild.ins().applyPlayers) {
					Guild.ins().sendProcessJoin(data.roleID, 0);
				}

				Guild.ins().applyPlayers = []
				Guild.ins().hasApply = false
				Guild.ins().postGuildApplysInfos();
				break
		}
	}

	close() {
		var param = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			param[_i - 0] = arguments[_i];
		}
		//this.dialogCloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClose, this)
		this.list.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onListTouch, this);
		Guild.ins().sendGuildMembers();
		this.checkBoxs.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.attrNum.removeEventListener(egret.Event.CHANGE, this.onTxtChange, this);
		MessageCenter.ins().removeAll(this);
	};
	onTxtChange(e) {
		Guild.ins().sendAddGuildLimit(this.checkBoxs.selected ? 1 : 0, parseInt(this.attrNum.text));
	};
	updateList() {
		var listData = Guild.ins().applyPlayers;
		listData.sort(this.sort);
		this.list.dataProvider = new eui.ArrayCollection(listData);
		this.noLabel.visible = listData.length < 1
	};
	private _OnClose(e: egret.TouchEvent) {
		ViewManager.ins().close(this);
	}
	onListTouch(e) {
		if (e.target instanceof eui.Button) {
			var item = e.target.parent;
			item.onTap(e.target);
		}
	};
	onTap(e) {
		switch (e.currentTarget) {

			case this.checkBoxs:
				this.onTxtChange(null);
				break;
		}
	};
	sort(a, b) {
		if (a.attack > b.attack)
			return -1;
		else if (a.attack < b.attack)
			return 1;
		else
			return 0;
	};
}


ViewManager.ins().reg(GuildApplyListWin, LayerManager.UI_Popup);
window["GuildApplyListWin"] = GuildApplyListWin