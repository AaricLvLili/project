class TitleWin extends BaseEuiPanel implements ICommonWindow, ICommonWindowTitle{
	public constructor() {
		super()
	}

	private	list: eui.DataGroup

	private commonWindowBg: CommonWindowBg

	private totalPower: PowerLabel

	initUI() {
		super.initUI()
		this.skinName = "TitleSkin";
		this.list.itemRenderer = TitleItem;
	};
	open(...param: any[]) {
		MessageCenter.addListener(Title.ins().postListUpdate, this.updateList, this);
		GameGlobal.MessageCenter.addListener(MessageDef.TITLE_SHOW, this.updateShow, this);
		MessageCenter.addListener(Title.ins().postUseTitle, this.useTitle, this);

		this.list.dataProvider = new eui.ArrayCollection()
		this.commonWindowBg.OnAdded(this, param[0] || 0)
		if (Title.ins().list == null)
			Title.ins().sendGetList();
		else
			this.updateList();
	};
	close() {
		this.commonWindowBg.OnRemoved()
		MessageCenter.ins().removeAll(this);
	};
	onTap(e) {
		//关闭
		ViewManager.ins().close(TitleWin);
	};
    /**
     * 请求带上或卸下称号
     */
	useTitle(info) {
		//带上
		if (info.config.Id != Title.ins().showID) {
		// 	//检查职业
		// 	if (!info.config.job || info.config.job == SubRoles.ins().getSubRoleByIndex(this.m_RoleSelectPanel.getCurRole()).job)
		 		Title.ins().setTitle(info.config.Id);
		// 	else
		// 		UserTips.ins().showTips('职业不符');
		}
		else {
			Title.ins().setTitle(0);
		}
		this.updatePower()
	};

	updatePower () {
		let value = 0
		let list: eui.ArrayCollection = Title.ins().list
		for (let i = 0; i < list.length; ++i) {
			let data = list.getItemAt(i) as TitleInfo
			if (data.endTime >= 0 && data.power) {
				value += data.power * SubRoles.ins().subRolesLen
			}
		}
		this.totalPower.text = `战斗力 ${value}`
	}

    /**
     * 更新列表
     */
	updateList() {
		this.list.dataProvider = Title.ins().list;
		this.updatePower()
	};
    /**
     * 更新设置的称号
     */
	updateShow(roleIndex, titleID, lastID) {
		if (roleIndex != Title.ins().useRole)
			return;
		//更换，只刷新两个项
		if (titleID > 0 == lastID > 0) {
			this.updateItemByID(lastID);
			this.updateItemByID(titleID);
		}
		else {
			for (var id in Title.ins().timeDict) {
				this.updateItemByID(Number(id));
			}
		}
		this.updateList()
	};
    /**
     * 更新指定称号的列表项
     */
	updateItemByID(titleID) {
		if (!(titleID in Title.ins().infoDict))
			return;
		var info = Title.ins().infoDict[titleID];
		Title.ins().list.itemUpdated(info);
	};


	OnBackClick(clickType: number): number {
		return 0
	}

	OnOpenIndex(openIndex: number): boolean {
		return true
	}

	UpdateContent(): void {

	}
}

ViewManager.ins().reg(TitleWin, LayerManager.UI_Main);

window["TitleWin"]=TitleWin