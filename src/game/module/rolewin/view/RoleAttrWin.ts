class RoleAttrWin extends BaseEuiPanel {

	_lastX = 0;
	proShowList1 = [
		2,
		4,
		5,
		48,
		49,
	]
	proShowList2 = [
		3,
		10,
		6,
		51,
		50,
	]
	proShowList3 = [
		7,
		19,
		13,
		16,
		101,
		102,
		103,
		104,
		105,
	]

	proShowList4 = [
		8,
		38,
		14,
		21,
		106,
		107,
		108,
		109,
		110,
	]

	curRole
	// bg
	public job: eui.Label;
	public leftBtn: eui.Button;
	public rightBtn: eui.Button;
	public m_AttrGroup: eui.Group;
	public m_AttrTopGroup: eui.Group;
	public attr1: eui.Label;
	public attr3: eui.Label;
	public attr2: eui.Label;
	public attr4: eui.Label;
	public baseAttrTxt: eui.Label;
	public seniorAttrTxt: eui.Label;

	public constructor() {
		super()
		this.skinName = "RoleAttrSkin";
	}


	initUI() {
		super.initUI()
		this.baseAttrTxt.text = GlobalConfig.jifengTiaoyueLg.st100301;
		this.seniorAttrTxt.text = GlobalConfig.jifengTiaoyueLg.st100109;
		this.m_bg.init(`RoleAttrWin`, GlobalConfig.jifengTiaoyueLg.st100107);
	};
	open() {
		var param = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			param[_i - 0] = arguments[_i];
		}
		this.curRole = param[0];
		this.setRoleAttr(this.curRole);
		var len = SubRoles.ins().subRolesLen;
		if (len > 1) {
			this.leftBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
			this.rightBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		}
		this.addEventListener(egret.TouchEvent.TOUCH_END, this.otherClose, this);
	};
	close() {
		var param = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			param[_i - 0] = arguments[_i];
		}
		var len = SubRoles.ins().subRolesLen;
		if (len > 1) {
			this.leftBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
			this.rightBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		}
		this.removeEventListener(egret.TouchEvent.TOUCH_END, this.otherClose, this);
	};
	onClose(e) {
		ViewManager.ins().close(this);
	};
	otherClose(e) {
		if (e.target instanceof eui.Button)
			return;
		ViewManager.ins().close(this);
	};
	onMove(e) {
		switch (e.type) {
			case egret.TouchEvent.TOUCH_BEGIN:
				this._lastX = e.localX;
				break;
			case egret.TouchEvent.TOUCH_END:
				if (this._lastX > e.localX) {
					if (this.curRole < 3) {
						this.setRoleAttr(++this.curRole);
						this.moveAttr(-200);
					}
				}
				else if (this._lastX < e.localX) {
					if (this.curRole > 0) {
						this.setRoleAttr(--this.curRole);
						this.moveAttr(200);
					}
				}
				break;
		}
	};
	moveAttr(num) {
		// var t = egret.Tween.get(this.attr);
		// var toNum;
		// if (num > 0)
		// 	toNum = 0;
		// else
		// 	toNum = 242;
		// t.to({ "x": this.attr.x + num, "alpha": 0 }, 200).to({ "x": toNum }, 200).to({ "x": 183, "alpha": 1 }, 200).call(() => {
		// 	egret.Tween.removeTweens(this.attr);
		// });
	};
	onTouch(e) {
		switch (e.currentTarget) {
			case this.leftBtn:
				this.setRoleAttr(--this.curRole);
				this.moveAttr(200);
				break;
			case this.rightBtn:
				this.setRoleAttr(++this.curRole);
				this.moveAttr(-200);
				break;
		}
	};
	setRoleAttr(roleId: number): void {
		this.setData(roleId, this.proShowList1, this.attr1);
		this.setData(roleId, this.proShowList2, this.attr2)
		this.setData(roleId, this.proShowList3, this.attr3)
		this.setData(roleId, this.proShowList4, this.attr4)
		this.setBtn();
	};

	private setData(roleId: number, list: any[], text: eui.Label) {
		var role = SubRoles.ins().getSubRoleByIndex(roleId);
		this.job.text = Role.jobNumberToName(role.job)
		var str = "";
		var attName = "";
		var value = 0;
		var i = 0;
		for (var j = 0; j < list.length; j++) {
			i = list[j];
			attName = AttributeData.getAttrStrByType(i);
			value = this.getPercentageAdd(role, i);
			if (value < 0) {
				console.error(`${attName} :${value}`)
				value = 0
			}
			if (attName.length < 3) {
				attName = AttributeData.inserteBlank(attName, 4);
			}
			attName = `<font color='#535557'>${attName}</font>`
			if (i > 1 && i <= 11) {
				if (i == 7 || i == 8) {
					str += attName + "：" + value / 100 + "%";
				} else {
					str += attName + "：" + value;
				}
			} else if (i > 12 && i < 15 || i > 15 && i < 48) {
				if (i == AttributeType.atCritEnhance) {
					str += attName + "：" + (value / 100 + 150) + "%";
				} else {
					str += attName + "：" + value / 100 + "%";
				}
			} else if (i >= 48) {
				str += attName + "：" + value;
			} else {
				continue;
			}
			if (j < list.length - 1) {
				str += "\n";
			}
			let data = { type: i, value: value };
		}
		text.textFlow = TextFlowMaker.getTextFlowByHtml(str);
	}

	private getPercentageAdd(role, type) {
		var value = role.getAtt(type);
		switch (type) {
			// case AttributeType.atMaxHp: //最大血量服务器已经计算好加成并下发了
			// 	value = value + Math.floor(value * role.getAtt(AttributeType.atHpEx)/10000);
			//     break;
			case AttributeType.atAttack:
				value = value + Math.floor(value * role.getAtt(AttributeType.atAtkEx) / 10000);
				break;
			case AttributeType.atDef:
				value = value + Math.floor(value * role.getAtt(AttributeType.atDefEx) / 10000);
				break;
			case AttributeType.atRes:
				value = value + Math.floor(value * role.getAtt(AttributeType.atResEx) / 10000);
				break;
		}
		return value;
	}
	setBtn() {
		var len = SubRoles.ins().subRolesLen;
		if (len == 1) {
			this.leftBtn.visible = false;
			this.rightBtn.visible = false;
		}
		else if (len > 1) {
			if (this.curRole == 0) {
				this.leftBtn.visible = false;
				this.rightBtn.visible = true;
			}
			else if (this.curRole == 1) {
				this.leftBtn.visible = true;
				if (len < 3)
					this.rightBtn.visible = false;
				else
					this.rightBtn.visible = true;
			}
			else if (this.curRole == 2) {
				this.leftBtn.visible = true;
				this.rightBtn.visible = false;
			}
		}
	};
}

ViewManager.ins().reg(RoleAttrWin, LayerManager.UI_Popup);
window["RoleAttrWin"] = RoleAttrWin