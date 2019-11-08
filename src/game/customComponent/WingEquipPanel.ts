class WingEquipPanel extends BaseEuiPanel implements ICommonWindow, ICommonWindowTitle, ICommonWindowRoleSelect {
	public constructor() {
		super()
		this.skinName = "WingEquipSkin";
	}

	m_RoleSelectPanel?: RoleSelectPanel
	windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st100707;
	equips: RoleItem[]
	updateEquipList
	// closeBtn
	// closeBtn0
	boostBtn1:eui.Button;
	// roleSelect
	private get curRole(): number {
		return this.m_RoleSelectPanel.getCurRole()
	}
	_wingsData
	wingImg
	wingName
	oneKey
	private groupReward:eui.Group;
	// oneKeyEff

    private commonWindowBg: CommonWindowBg

	childrenCreated() {
		super.childrenCreated();
		// this.item0
		this.equips = [];
		for (var i = 0; i < 4; i++) {
			this.equips[i] = this['item' + i];
			this.equips[i].touchEnabled = true;
			this.equips[i].isShowJob(false);
		}
		this.updateEquipList.itemRenderer = WingEquipItemrender;
		this.boostBtn1.label = GlobalConfig.jifengTiaoyueLg.st100706;
	};
	open(...param: any[]) {
		this.AddClick(this.boostBtn1,this.onTouch);
		this.observe(MessageDef.ITEM_COUNT_CHANGE, this.UpdateContent);
        this.commonWindowBg.OnAdded(this, 0, param[0] || 0)
	};
	close() {
		this.commonWindowBg.OnRemoved()
	};
	//改变角色
	UpdateContent() {
		this._wingsData = SubRoles.ins().getSubRoleByIndex(this.curRole).wingsData;
		//this.wingImg.source = GlobalConfig.wingLevelConfig[this._wingsData.lv].appearance + "_png";
		this.wingName.text = "" + GlobalConfig.wingLevelConfig[this._wingsData.lv].name;
		this.updateEquip(SubRoles.ins().getSubRoleByIndex(this.curRole));
		var obj = [];
		var itemdata = UserBag.ins().getBagEquipByType(4);
		var len = itemdata.length;
		for (var i = 0; i < len; i++) {
			var object = new Object();
			object["curRole"] = this.curRole;
			object["data"] = itemdata[i];
			if (this._wingsData.lv < itemdata[i].itemConfig.level) {
				obj.push(object);
			}
		}
		this.updateEquipList.dataProvider = new eui.ArrayCollection(obj);
		this.setCanChange()
	};
	//设置装备
	updateEquip(role : Role) {
		if (role == null)
			return;
		var len = role.wingsData.equipsLen;
		for (var i = 0; i < len; i++) {
			var element = role.wingsData.getEquipByIndex(i);
			this.equips[i].model = role;
			this.equips[i].wings = true;
			this.equips[i].data = element;
			if (element.configID == 0) {
				this.equips[i].setItemImg("winge_" + i +"_png");
			}
		}
	};
	onTouch(e) {
		switch (e.target) {
			// case this.closeBtn:
			// case this.closeBtn0:
			// 	ViewManager.ins().close(WingEquipPanel);
			// 	break;
			case this.boostBtn1:
				if (this.oneKey) {
					Wing.ins().checkWingEquip(this.curRole, true);
					this.setCanChange();
				}
				else {
					UserTips.ins().showTips("|C:0x535557&T:" + GlobalConfig.jifengTiaoyueLg.st100705 + "！|");
				}
				break;
		}
	};
	setCanChange() {
		// var d = data ? (data[this.curRole] ? data[this.curRole] : []) : [];
		let datas = Wing.ins().mRedPoint.GetEquipState(this.curRole)
		
		this.oneKey = false;
		for (var i = 0; i < 4; i++) {
			// this["redPoint" + i].visible = d[i] ? d[i] : false;
			UIHelper.ShowRedPoint(this.equips[i], datas[i] ? datas[i] : false)
			if (!this.oneKey)
				this.oneKey = datas[i] ? datas[i] : false;
		}
		UIHelper.SetBtnNormalEffe(this.boostBtn1, this.oneKey)
		this.showreaPoin();
	};
	showreaPoin() {
		for (let i = 0; i < SubRoles.ins().subRolesLen; ++i) {
			let datas = Wing.ins().mRedPoint.GetEquipState(i)
			this.m_RoleSelectPanel.showRedPoint(i, datas.indexOf(true) != -1)
		}
	};
}


ViewManager.ins().reg(WingEquipPanel, LayerManager.UI_Main);
window["WingEquipPanel"]=WingEquipPanel