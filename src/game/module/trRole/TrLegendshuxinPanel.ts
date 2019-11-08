class TrLegendshuxinPanel extends BaseView implements ICommonWindowTitle, ICommonWindowRoleSelect {
	public wu: eui.Label;
	public fuzhuImg: eui.Image;
	// public fuzhuImg0: eui.Image;
	public weiIcon: eui.Label;
	public shuxin: eui.Group;
	public powerLabel: eui.BitmapLabel;
	public shuxinOne: eui.Group;
	public textOne: eui.Label;
	public henText: eui.Label;
	public henTextXF: eui.Label;
	public henText0: eui.Label;
	public shuxinTwo: eui.Group;
	public textTwo: eui.Label;
	public shuText: eui.Label;
	public shuxinThree: eui.Group;
	public textThree: eui.Label;
	public shuxinFour: eui.Group;
	public textFour: eui.Label;
	public shuxinFive: eui.Group;
	public textFive: eui.Label;
	public shuText0: eui.Label;
	public itemTu: eui.Image;
	public curId;
	private tabData: eui.ArrayCollection;
	private list: eui.List
	private listIcom: eui.List
	private listJNIcom: eui.List
	private groupShuxin: eui.Group
	private scroller: eui.Scroller
	private scrollerBig: eui.Scroller

	// private attrSJList: eui.DataGroup

	private static equipItemIndex: number = 0;

	private _curId: number
	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st100096;

	/**小牛 */
	public m_titleImg: eui.Image;

	public m_ArtifactGroup: eui.Group;
	public m_ArtifactAttrGroup: eui.Group;
	public m_NoActLab: eui.Label;


	public m_SZGroup: eui.Group;
	public m_SZAttrSJList: eui.DataGroup;
	private szListData: eui.ArrayCollection;

	public m_JMGroup: eui.Group;
	public m_JMAttrGroup: eui.Group;
	public m_JMLvLab: eui.Label;
	public m_JMSkillList: eui.List;
	private jmListData: eui.ArrayCollection;


	public m_LZGroup: eui.Group;
	public m_LZAttrGroup: eui.Group;
	public m_LZLab: eui.Label;
	public m_LzTeShuGroup: eui.Group;


	public m_FWGroup: eui.Group;
	public m_FWAttrGroup: eui.Group;
	public m_FWTeShuGroup: eui.Group;
	public m_FWLab: eui.Label;

	public m_TFGroup: eui.Group;
	public m_TFSkillList: eui.List;
	private tfSkillData: eui.ArrayCollection;


	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;
	public m_Lan3: eui.Label;
	public m_Lan4: eui.Label;
	public m_Lan5: eui.Label;
	public m_Lan6: eui.Label;
	public m_Lan7: eui.Label;
	public m_Lan8: eui.Label;
	public m_Lan9: eui.Label;


	public constructor(context: TrTreasureHuntWin) {
		super();
		this.skinName = "TrLegendshuxinSkin";
		this.name = GlobalConfig.jifengTiaoyueLg.st100096;
		this.listIcom.itemRenderer = TrLegendshuxinItemLabel;
		// this.listJNIcom.itemRenderer = TrLegendshuxinItemJNLabel;
		// this.attrSJList.itemRenderer = GodSuitAttrItem 
		this.m_SZAttrSJList.itemRenderer = GodSuitAttrItem;
		this.szListData = new eui.ArrayCollection();
		this.m_SZAttrSJList.dataProvider = this.szListData;

		this.m_JMSkillList.itemRenderer = TrLegendshuxinItemJNLabel;
		this.jmListData = new eui.ArrayCollection();
		this.m_JMSkillList.dataProvider = this.jmListData;

		this.m_TFSkillList.itemRenderer = TrLegendshuxinItemJNLabel;
		this.tfSkillData = new eui.ArrayCollection();
		this.m_TFSkillList.dataProvider = this.tfSkillData;

		this.m_NoActLab.text = GlobalConfig.jifengTiaoyueLg.st100099;
		this.wu.text = GlobalConfig.jifengTiaoyueLg.st100300;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st100301;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st100302;
		this.m_Lan3.text = GlobalConfig.jifengTiaoyueLg.st100301;
		this.m_Lan4.text = GlobalConfig.jifengTiaoyueLg.st100303;
		this.m_Lan5.text = GlobalConfig.jifengTiaoyueLg.st100303;
		this.m_Lan6.text = GlobalConfig.jifengTiaoyueLg.st100301;
		this.m_Lan7.text = GlobalConfig.jifengTiaoyueLg.st100304;
		this.m_Lan8.text = GlobalConfig.jifengTiaoyueLg.st100301;
		this.m_Lan9.text = GlobalConfig.jifengTiaoyueLg.st100302;

	}

	public static GetStage(configID) {
		return LegendModel.GetStage(configID)
	}

	public open(...param: any[]) {
		super.open(param);
		// this.m_Role = param[0]
		this.fuzhuImg.visible = false;
		// this.fuzhuImg0.visible = false;
		this.shuxin.visible = false;
		this.wu.visible = false;
		this.shuxinOne.visible = false;
		this.shuxinTwo.visible = false;
		this.shuxinThree.visible = false;
		this.shuxinFour.visible = false;
		this.shuxinFive.visible = false;
		this.listJNIcom.visible = false;
		this.listIcom.visible = false;
		this.list.itemRenderer = TrLegendshuxinItem
		this.tabData = new eui.ArrayCollection
		Sproto.SprotoReceiver.AddHandler(S2cProtocol.sc_get_actor_module_isactive, this.sc_get_actor_module_isactive, this);//查询玩家模块功能是否开启
		Sproto.SprotoReceiver.AddHandler(S2cProtocol.sc_actor_base_info_aritifact, this.sc_actor_base_info_aritifact, this);//神器
		Sproto.SprotoReceiver.AddHandler(S2cProtocol.sc_actor_base_info_exring, this.sc_actor_base_info_exring, this);//特戒
		Sproto.SprotoReceiver.AddHandler(S2cProtocol.sc_actor_base_info_fuwen, this.sc_actor_base_info_fuwen, this);//符文
		Sproto.SprotoReceiver.AddHandler(S2cProtocol.sc_actor_base_info_godequip, this.sc_actor_base_info_godequip, this);//神装
		Sproto.SprotoReceiver.AddHandler(S2cProtocol.sc_actor_base_info_skillmiji, this.sc_actor_base_info_skillmiji, this);//心法
		Sproto.SprotoReceiver.AddHandler(S2cProtocol.sc_actor_base_info_jingmai, this.sc_actor_base_info_jingmai, this);//经脉
		Sproto.SprotoReceiver.AddHandler(S2cProtocol.sc_actor_base_info_talent, this.sc_actor_base_info_talent, this);//天赋
		Sproto.SprotoReceiver.AddHandler(S2cProtocol.sc_actor_base_info_lizhuang, this.sc_actor_base_info_lizhuang, this);//里装
		this.list.addEventListener(egret.TouchEvent.TOUCH_TAP, this._touchList, this)
		this.list.useVirtualLayout = false
		this.listJNIcom.useVirtualLayout = false
	}

	public close(...param: any[]) {
		super.close();
		this.list.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._touchList, this)
		this._curId == null
	}

	private _touchList(e: egret.TouchEvent) {
		if (!(e.target instanceof TrLegendshuxinItem)) return
		let curId = e.target.id
		if (this._curId == curId) return
		this._setTabSelect(curId)
		this._curId = curId
		GameLogic.ins().SendGetOtherInfo(UserReadPlayer.ins().actorId, this.m_RoleSelectPanel.curRole, curId);
		if (this.scrollerBig && this.scrollerBig.viewport) {
			this.scrollerBig.viewport.scrollV = 0
		}
		// console.log(curId)
	}

	private _setTabSelect(id: number): void {
		for (let i = 0, len = this.list.numChildren; i < len; i++) {
			let item = this.list.getChildAt(i) as TrLegendshuxinItem
			item.setSelect(id == item.id)
		}
	}

	public sc_get_actor_module_isactive(byt: Sproto.sc_get_actor_module_isactive_request): void {
		// console.log(byt)
		this._updataTabBar(byt.isactive);
	}

	//开启功能
	private _updataTabBar(data: Sproto.isactive_info) {
		let tabList: Array<any> = [];
		let dataList = [data.sq, data.ex, data.fw, data.sz, data.xf, data.jm, data.tf, data.lz]
		let isNull: boolean = true//是否全部未开启
		for (let i = 0, len = dataList.length; i < len; i++) {
			if (dataList[i] > 0) {
				tabList.push(i)
				isNull = false
			}
		}
		if (isNull) {
			this.wu.visible = true;
			this.fuzhuImg.visible = false;
			this.shuxin.visible = false;
			this.setVisible(null);
		} else {
			this.fuzhuImg.visible = true;
			// this.fuzhuImg0.visible = true;
			this.shuxin.visible = true;
			this.wu.visible = false;
		}
		this.tabData.replaceAll(tabList)
		this.list.dataProvider = this.tabData
		if (tabList.length > 5) {
			this.fuzhuImg.visible = true;
		} else {
			this.fuzhuImg.visible = false;
		}
		if (!isNull) {
			let selectId = tabList.indexOf(this._curId) >= 0 ? this._curId : tabList[0]
			if (this.scroller && this.scroller.viewport && selectId == tabList[0]) {
				this.scroller.viewport.scrollH = 0
			}
			GameLogic.ins().SendGetOtherInfo(UserReadPlayer.ins().actorId, this.m_RoleSelectPanel.curRole, selectId);
			this.list.validateNow()
			this._setTabSelect(selectId)
		}
	}

	//神器
	public sc_actor_base_info_aritifact(bytSq: Sproto.sc_actor_base_info_aritifact_request): void {
		if (bytSq.attrs && bytSq.attrs.length > 0) {
			this.m_NoActLab.visible = false;
		} else {
			this.m_NoActLab.visible = true
		}
		this.powerLabel.text = bytSq.info.sumpower + "";
		AttributeData.setAttrGroup(bytSq.attrs, this.m_ArtifactAttrGroup);
		this.setVisible(LookState.AR);
	}

	private setVisible(type: LookState) {
		if (type == null) {
			this.m_titleImg.visible = false;
		} else {
			this.m_titleImg.visible = true;
			this.m_titleImg.source = "comp_state_" + type + "_png";
		}
		this.m_ArtifactGroup.visible = false;
		this.m_SZGroup.visible = false;
		this.m_JMGroup.visible = false;
		this.m_LZGroup.visible = false;
		this.m_FWGroup.visible = false;
		this.m_TFGroup.visible = false;
		switch (type) {
			case LookState.AR:
				this.m_ArtifactGroup.visible = true;
				break;
			case LookState.SZ:
				this.m_SZGroup.visible = true;
				break;
			case LookState.JM:
				this.m_JMGroup.visible = true;
				break;
			case LookState.LZ:
				this.m_LZGroup.visible = true;
				break;
			case LookState.FW:
				this.m_FWGroup.visible = true;
				break;
			case LookState.TF:
				this.m_TFGroup.visible = true;
				break;
		}
	}

	//特戒(屏蔽了)
	public sc_actor_base_info_exring(bytTj: Sproto.sc_actor_base_info_exring_request): void {
		// //基础属性
		// this.henText0.visible = true;
		// let data = bytTj.info;
		// this.powerLabel.text = data.sumpower + "";
		// this.weiIcon.text = "特 戒";
		// this.textOne.text = "基础属性：";
		// let life = this._getTotalTjValue(data.exrings, 0) + "";//生命
		// let attack = this._getTotalTjValue(data.exrings, 1) + "";//攻击
		// let authors = this._getTotalTjValue(data.exrings, 2) + "";//物防
		// let prevention = this._getTotalTjValue(data.exrings, 3) + "";//法防

		// let str: string = "生命：+" + life + "\n" + "物防：+" + authors;
		// this.henText.textFlow = TextFlowMaker.generateTextFlow(str);
		// let str0: string = "攻击：+" + attack + "\n" + "法防：+" + prevention;
		// this.henText0.textFlow = TextFlowMaker.generateTextFlow(str0);

		// //神戒技能
		// this.listJNIcom.visible = false;
		// let skillStr: string = ""
		// for (let i = 0; i < data.exrings.length; i++) {
		// 	let index = data.exrings[i].id;
		// 	let LevelId = data.exrings[i].level;
		// 	let skillConfig = GlobalConfig.ins("PublicSpecialringConfig")[index];
		// 	this.shuxinTwo.visible = true;
		// 	let SkillsConfig = GlobalConfig.skillsConfig[GlobalConfig.publicSpeRRConfig[skillConfig.id][LevelId - 1].skillid]
		// 	skillStr += skillConfig.skillname + "(Lv" + LevelId + ")" + " " + SkillsConfig.desc + "\n";
		// }
		// this.shuxinOne.visible = true;
		// this.shuxinTwo.visible = true;
		// this.shuxinFour.visible = false;
		// this.shuxinFive.visible = false;
		// this.shuText.visible = true;
		// this.listJNIcom.visible = false;
		// this.textTwo.visible = true;
		// this.textTwo.text = "神戒技能：";
		// this.shuText.textFlow = TextFlowMaker.generateTextFlow(skillStr);

		// //戒灵之语
		// if (bytTj.ringsoul && bytTj.ringsoul.length > 0) {
		// 	this.shuxinThree.visible = true;
		// 	this.listIcom.visible = true;
		// 	this.textThree.text = "戒灵之语：";
		// 	this.listIcom.dataProvider = new eui.ArrayCollection(bytTj.ringsoul);
		// } else {
		// 	this.shuxinThree.visible = false;
		// }
		// this._sortGroupView();
	}

	//符文
	public sc_actor_base_info_fuwen(bytFw: Sproto.sc_actor_base_info_fuwen_request): void {
		//基础属性
		let data = bytFw.info[0];
		this.powerLabel.text = data.sumpower + "";
		let v1 = 0;//生命
		let v2 = 0;//攻击
		let v3 = 0;//物防
		let v4 = 0;//法防
		for (let i = 0; i < data.ids.length; i++) {
			let fwIndex = data.ids[i];
			let fuWenConfig = GlobalConfig.ins("EquipConfig")[fwIndex];
			v1 += fuWenConfig.hp;
			v2 += fuWenConfig.atk;
			v3 += fuWenConfig.def;
			v4 += fuWenConfig.res;
		}
		let datas = [];
		let data1 = { type: 2, value: v1 };
		let data2 = { type: 4, value: v2 };
		let data3 = { type: 5, value: v3 };
		let data4 = { type: 6, value: v4 };
		datas.push(data1, data2, data3, data4);
		AttributeData.setAttrGroup(datas, this.m_FWAttrGroup);


		//套装加成
		let fwlevel = data.level;
		let fwlevelConfig = GlobalConfig.ins("FuwenLevelConfig")[fwlevel];
		let fwlevelStr = GlobalConfig.jifengTiaoyueLg.st100097 + fwlevelConfig.PlayerEnhance / 100 + "%" + "\n" + GlobalConfig.jifengTiaoyueLg.st100098 + fwlevelConfig.MonsterEnhance / 100 + "%";
		this.m_FWLab.textFlow = TextFlowMaker.generateTextFlow(fwlevelStr);

		//特殊属性
		// let pddata = data.ids
		// var list = [];
		// for (let id of data.ids) {
		// 	let fuWenConfig = GlobalConfig.ins("EquipConfig")[id];
		// 	if (fuWenConfig && fuWenConfig.baseAttr)
		// 		list.push(id);
		// }

		// this.shuxinThree.visible = list.length > 0;
		// this.listIcom.dataProvider = new eui.ArrayCollection(list);

		this.setVisible(LookState.FW);

	}

	//神装
	public sc_actor_base_info_godequip(bytSz: Sproto.sc_actor_base_info_godequip_request): void {
		let szId = bytSz.info;
		let lastArr = szId.pop()
		szId.unshift(lastArr)
		let szAttr: string = "";
		let szNum = 0;
		for (let i = 0; i < szId.length; i++) {
			if (szId[i].configID == 0) {
				continue
			}
			szNum += ItemConfig.pointCalNumber(GlobalConfig.itemConfig[szId[i].configID]);
		}
		szAttr += szNum;
		this.powerLabel.text = szAttr;//计算战力

		let godsuit = []
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

		for (let i = 0; i < EquipPos.MAX; ++i) {
			if (szId[i].configID > 0) {
				let stage = GodSuitAttrPanel.GetStage(szId[i].configID)
				godsuit[0].mEquipSet[i] = true
				godsuit[0].mLv[i] = stage;
			}
		}

		this.szListData.replaceAll(godsuit);
		this.m_SZAttrSJList.validateNow()

		let h = 0
		for (let i = 0; i < this.m_SZAttrSJList.numChildren; ++i) {
			h += (this.m_SZAttrSJList.getChildAt(i) as eui.Component).height
		}

		this.setVisible(LookState.SZ);
	}

	//心法(屏蔽了)
	public sc_actor_base_info_skillmiji(bytXf: Sproto.sc_actor_base_info_skillmiji_request): void {
		// let xfdata = bytXf.info;
		// this.powerLabel.text = xfdata.sumpower + "";
		// this.weiIcon.text = "心 法";
		// this.textOne.text = "详细属性：";
		// let xfStr: string = "";
		// for (let i = 0; i < xfdata.configidlist.length; i++) {
		// 	let xfIndex = xfdata.configidlist[i];
		// 	let xfConfig = GlobalConfig.ins("ItemConfig")[xfIndex];
		// 	if (xfConfig == null) {
		// 		continue
		// 	}
		// 	let xfName = xfConfig.name;
		// 	let xfColor = ItemBase.QUALITY_COLOR[xfConfig.quality];
		// 	xfStr += `<font color='${xfColor}'>${xfName}</font>` + ":   " + xfConfig.desc + "\n";
		// }
		// this.shuxinOne.visible = true;
		// this.shuxinTwo.visible = false;
		// this.textTwo.visible = false;
		// this.shuxinThree.visible = false;
		// this.shuxinFour.visible = false;
		// this.shuxinFive.visible = false;
		// this.henText0.visible = false;
		// this.henText.textFlow = TextFlowMaker.generateTextFlow(xfStr);

		// this._sortGroupView();
	}

	//经脉
	public sc_actor_base_info_jingmai(bytJm: Sproto.sc_actor_base_info_jingmai_request): void {
		let jmAttr = ["attr_zs", "attr_fs", "attr_ds"]
		this.henText0.visible = true;
		this.listJNIcom.visible = true;
		this.powerLabel.text = bytJm.sumpower + "";
		let jmdata = bytJm.info[0];
		let jmLevel = jmdata.level;
		let jmStage = jmdata.stage;
		this.m_JMLvLab.text = jmStage + GlobalConfig.jifengTiaoyueLg.st100103 + jmLevel + GlobalConfig.jifengTiaoyueLg.st100093;
		let jmLevelConfig = GlobalConfig.ins("MeridianLevelConfig")[jmLevel];
		let jmStageConfig = GlobalConfig.ins("MeridianStageConfig")[jmStage];

		let attr = jmAttr[this.m_RoleSelectPanel.getCurRole()];
		let attrData = [];
		let lvlist = jmLevelConfig[attr];
		for (var i = 0; i < lvlist.length; i++) {
			let data = { type: lvlist[i].type, value: lvlist[i].value };
			attrData.push(data);
		}
		let stageList = jmStageConfig[attr];
		for (var i = 0; i < stageList.length; i++) {
			let data = { type: stageList[i].type, value: stageList[i].value };
			attrData.push(data);
		}
		let newAttrdata = AttributeData.getAttr([attrData]);
		this.jmListData.replaceAll(jmdata.skill);
		AttributeData.setAttrGroup(newAttrdata, this.m_JMAttrGroup);
		this.setVisible(LookState.JM);
	}

	//天赋
	public sc_actor_base_info_talent(bytTf: Sproto.sc_actor_base_info_talent_request): void {
		// console.log(bytTf)
		this.powerLabel.text = bytTf.sumpower + "";

		let arr = bytTf.info
		let lastArr = []
		for (let i = 0, len = arr.length; i < len; i++) {
			let item = arr[i]
			if (item.talentlevel > 0) {
				lastArr.push(item)
			}
		}
		this.tfSkillData.replaceAll(lastArr);
		this.setVisible(LookState.TF);
	}

	//里装
	public sc_actor_base_info_lizhuang(bytLz: Sproto.sc_actor_base_info_lizhuang_request): void {
		this.powerLabel.text = bytLz.sumpower + "";
		let allAttr = [];
		let configMain1 = GlobalConfig.ins("TransferEquipGrowUpConfig");
		let configMain2 = GlobalConfig.ins("TransferEquipStarConfig");
		for (var i = 0; i < bytLz.info.length; i++) {
			let attr1 = [];
			for (let key in configMain1) {
				let configLv = configMain1[key];
				for (let key2 in configLv) {
					if (configLv[key2].itemID == bytLz.info[i].item.configID) {
						let config1 = configLv[key2];
						attr1 = ZhuanZhiModel.ins().getZhuanZhiEquipAttr(config1, bytLz.info[i].num2, 5);
					}
				}
			}
			let attr2 = [];
			for (let key in configMain2) {
				let configStar = configMain2[key];
				for (let key2 in configStar) {
					if (configStar[key2].itemID == bytLz.info[i].item.configID) {
						let config2 = configStar[key2];
						attr2 = ZhuanZhiModel.ins().getZhuanZhiEquipAttr(config2, bytLz.info[i].star, 4);
					}
				}
			}
			let itemData = new ItemData();
			itemData.parser(bytLz.info[i].item);
			let bassAttrs = ZhuanZhiModel.ins().getZhuanZhiEquipBaseAttr(itemData);
			let addAttrs = AttributeData.AttrAddition(attr1, attr2);
			let nowAttrs = AttributeData.AttrAddition(bassAttrs, addAttrs);
			allAttr = AttributeData.AttrAddition(allAttr, nowAttrs);
		}

		AttributeData.setAttrGroup(allAttr, this.m_LZAttrGroup);

		let lzdata = bytLz.info;
		let lzlen = lzdata.length;
		let lzAttr: string = "";
		for (let i = 0; i < lzlen; i++) {
			let configID = lzdata[i].item.configID;
			let lzConfig = GlobalConfig.ins("EquipConfig")[configID];
			if (lzConfig.baseAttr) {
				lzAttr += StringUtils.complementByChar(AttributeData.getAttrStrByType(lzConfig.baseAttr[0].type), 0) + ": " + AttributeData.getAttStrByType(lzConfig.baseAttr[0]) + "\n"
			}
		}
		this.m_LZLab.text = lzAttr;
		if (lzAttr.length > 1) {
			this.m_LzTeShuGroup.visible = true;
		} else {
			this.m_LzTeShuGroup.visible = false;
		}

		this.setVisible(LookState.LZ);
	}


	private _getTotalTjValue(arr: Array<any>, ind: number, cfg: string = "PublicSpeRRConfig"): number {
		let total: number = 0;
		for (let i = 0; i < arr.length; i++) {
			let index = arr[i].id;
			let levelId = arr[i].level - 1;
			let rankConfig = GlobalConfig.ins(cfg)[index][levelId];
			if (rankConfig)
				total += rankConfig.attrs[ind].value
		}
		return total
	}

	private _sortGroupView(): void {
		this.listJNIcom.validateNow()
		let height = 0;
		for (let i = 0, len = this.groupShuxin.numChildren; i < len; i++) {
			let item = this.groupShuxin.getChildAt(i) as eui.Group
			if (item.visible) {
				item.top = height;
				height += item.height + 20;
			}
		}
	}




	public UpdateContent() {
		if (UserReadPlayer.ins().actorId == null) return
		GameLogic.ins().SendGetOtherActorBaseInfo(UserReadPlayer.ins().actorId, this.m_RoleSelectPanel.curRole)
	}

	m_RoleSelectPanel: RoleSelectPanel


	private get _roleId(): number {
		return this.m_RoleSelectPanel.getCurRole()
	}
}
enum LookState {
	AR = 0, //法器
	EX = 1, //特戒
	FW = 2,//符文
	SZ = 3,//神装
	MJ = 4, //心法
	JM = 5,//经脉
	TF = 6,//天赋 
	LZ = 7,//里装
}
window["LookState"] = LookState
window["TrLegendshuxinPanel"] = TrLegendshuxinPanel