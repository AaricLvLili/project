class Title extends BaseSystem {
	public constructor() {
		super();

		this.sysId = PackageID.Title;
		this.regNetMsg(S2cProtocol.sc_title_list, this.postListUpdate);
		this.regNetMsg(S2cProtocol.sc_title_add, this.doAdd);
		this.regNetMsg(S2cProtocol.sc_title_del, this.doRemove);
		this.regNetMsg(S2cProtocol.sc_title_set, this.doUpdateShow);
	}

	showID
	useRole
	timeDict
	infoDict
	_totalAttrs
	_totalAttrsText

	list: eui.ArrayCollection
	private _dressTitleList: eui.ArrayCollection

	static ins(): Title {
		return super.ins();
	};
	/**派发使用称号 */
	postUseTitle(data) {
		return data;
	};
    /**
     * 请求称号列表
     * 38-1
     */
	sendGetList() {
		GameSocket.ins().Rpc(C2sProtocol.cs_title_req);
		// var bytes = this.getBytes(1);
		// this.sendToServer(bytes);
	};
    /**
     * 称号列表
     * 38-1
     */
	postListUpdate(bytes: Sproto.sc_title_list_request) {
		//读取已拥有的称号结束时间
		var timeDict = {};
		var n = bytes.titles.length;
		for (var i = 0; i < n; ++i) {
			timeDict[bytes.titles[i].titleid] = bytes.titles[i].titleEndTime;
		}
		//初始化列表
		this.useRole = 0;
		this.showID = SubRoles.ins().getSubRoleByIndex(0).title || 0;
		this.initList(timeDict);
		//检查已佩戴的称号ID和角色索引
		// this.showID = this.useRole = 0;
		// var len = SubRoles.ins().subRolesLen;
		// for (var i = 0; i < len; i++) {
		// 	var role = SubRoles.ins().getSubRoleByIndex(i);
		// 	if (role == null)
		// 		continue;
		// 	if (this.showID) {
		// 		//只能显示一个角色称号
		// 		this.sendChangeShow(0);
		// 	}
		// 	else if (role.title) {
		// 		//记录已显示的称号
		// 		this.showID = role.title;
		// 		this.useRole = Number(i);
		// 	}
		// }
	};
    /**
     * 获得一个称号
     * 38-2
     */
	doAdd(bytes:Sproto.sc_title_add_request) {
		this.change(bytes.titleid, bytes.titleEndTime);
	};
    /**
     * 失去一个称号
     * 38-3
     */
	doRemove(bytes:Sproto.sc_title_del_request) {
		this.change(bytes.titleid, -1);
	};
    /**
     * 设置显示的称号
     * 38-4
     */
	sendChangeShow(title) {
		var cs_title_set = new Sproto.cs_title_set_request();
		cs_title_set.titleid = title;
		GameSocket.ins().Rpc(C2sProtocol.cs_title_set, cs_title_set);
		// var bytes = this.getBytes(4);
		// bytes.writeShort(roleID);
		// bytes.writeInt(title);
		// this.sendToServer(bytes);
	};
    /**
     * 更新角色显示的称号
     * 38-4
     */
	doUpdateShow(bytes: Sproto.sc_title_set_request) {
		var role = <CharRole>EntityManager.ins().getEntityByHandle(bytes.rolehandle);
		if (role) {
			role.infoModel.title = bytes.titleid;
			role.updateTitle();
			if (role.team == Team.My) {
				var lastTitle = this.showID;
				var roleModel = role.infoModel;
				if (roleModel.title) {
					this.useRole = role.infoModel.index;
					this.showID = role.infoModel.title;
				}
				else if (roleModel.index == this.useRole) {
					this.showID = 0;
				}
				GameGlobal.MessageCenter.dispatch(MessageDef.TITLE_SHOW, this.useRole, this.showID, lastTitle)
			}
		}
	};

    /**
 * 设置称号
 */
	setTitle(titleID) {
		this.sendChangeShow(titleID);
		//设置到另一个角色，要移除之前的角色称号
		// if (roleIndex != this.useRole && this.showID) {
		// 	this.sendChangeShow(this.useRole, 0);
		// }
	};
    /**
     * 排序方法
     */
	sortFunc(a, b) {
		return a.endTime < 0 == b.endTime < 0 ? (a.config.Id > b.config.Id ? 1 : -1) : a.endTime < 0 ? 1 : -1;
	};
    /**
     * 初始化列表
     */
	initList(timeDict) {
		this.timeDict = timeDict;
		this.infoDict = {};
		this._totalAttrs = [];
		this._totalAttrsText = new eui.ArrayCollection;
		var infoList:Array<TitleInfo> = [];
		var configList = GlobalConfig.ins("TitleConf");
		for (var i in configList) {
			var info = new TitleInfo(configList[i]);
			if (info.config.Id in timeDict) {
				info.endTime = timeDict[info.config.Id];
				for (var i_1 in info.config.attrs) {
					this._totalAttrs[info.config.attrs[i_1].type] = (this._totalAttrs[info.config.attrs[i_1].type] || 0) + info.config.attrs[i_1].value;
				}
			}
			else {
				info.endTime = -1;
			}
			infoList[infoList.length] = this.infoDict[info.config.Id] = info;
			info.attrsTotal = this._totalAttrsText;
		}
		infoList.sort(this.sortFunc);
		this.list = new eui.ArrayCollection(infoList);
		this.updateTotalAttrs();
		this.setDressTitle(infoList)
	};
	private setDressTitle(list: Array<TitleInfo>): void {
		let infoList = [];
		for (let i = 0, len = list.length; i < len; i++) {
			let data = list[i]
			let item = new DressItemInfo
			item.context = <DressWin>ViewManager.ins().getView(DressWin)
			item.zhuanban = data.config
			item.isDress = data.config.Id == SubRoles.ins().getSubRoleByIndex(0).title
			item.isUser = data.endTime >= 0
			item.timer = data.endTime
			item.isTitle =true
			infoList.push(item)
		}
		this._dressTitleList = new eui.ArrayCollection(infoList);
	}
	public get dressTitleList() {
		return this._dressTitleList
	}
    /**
     * 称号变更（增加、减少）
     */
	change(id, time) {
		if (!this.infoDict || !(id in this.infoDict))
			return;
		if ((id in this.timeDict) == time >= 0)
			return;
		var info = this.infoDict[id];
		info.endTime = time;
		if (time < 0)
			delete this.timeDict[id];
		else
			this.timeDict[id] = time;
		//重新排序
		this.list.source.sort(this.sortFunc);
		this.list.refresh();
		//总属性增减
		var sign = time < 0 ? -1 : 1;
		for (var _i = 0, _a = info.config.attrs; _i < _a.length; _i++) {
			var attr = _a[_i];
			this._totalAttrs[attr.type] = (this._totalAttrs[attr.type] || 0) + sign * attr.value;
		}
		this.updateTotalAttrs();
		//装扮
		this.setDressTitle(this.list.source)
	};
    /**
     * 更新总属性
     */
	updateTotalAttrs() {
		var list = this._totalAttrsText.source;
		list.length = 0;
		for (var i in this._totalAttrs) {
			if (this._totalAttrs[i] > 0)
				list.push(TitleInfo.formatAttr(Number(i), this._totalAttrs[i]));
		}
		//没有总属性，默认显示为0
		if (list.length == 0) {
			var attrs = this.infoDict[1].config.attrs;
			for (var _i = 0, attrs_1 = attrs; _i < attrs_1.length; _i++) {
				var attr = attrs_1[_i];
				list.push(TitleInfo.formatAttr(attr.type, 0));
			}
		}
		this._totalAttrsText.refresh();
	};

	getTitleByActivityId(id: number) {
		var titleConfig = GlobalConfig.ins("TitleConf");
		for (var i in titleConfig) {
			if (id == titleConfig[i].Id) {
				return titleConfig[i];
			}
		}
		return null
	}

	public static IsEffName(name): boolean {
		if (name == null) {
			return false
		}
		return name.indexOf("eff") != -1
	}
}

MessageCenter.compile(Title);
window["Title"]=Title