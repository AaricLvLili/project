class ArtifactModel {
	private static s_instance: ArtifactModel;
	public static get getInstance(): ArtifactModel {
		if (!ArtifactModel.s_instance) {
			ArtifactModel.s_instance = new ArtifactModel();
		}
		return ArtifactModel.s_instance;
	}
	public constructor() {
		this.artufactDic = new Dictionary<ArtifactEquData>();
	}
	public artufactDic: Dictionary<ArtifactEquData>;
	public scrollV: number = 0;
	// public nowSelectIndex: number = 0;
	public nowSelectIndex1: number = 0;
	public nowSelectIndex2: number = 0;
	/**当前激活神器id */
	public curid: number = 0;
	/**激活进度id */
	public conid: number = 0;

	public setIndex(type: number, index: number) {
		switch (type) {
			case 1:
				this.nowSelectIndex1 = index;
				break;
			case 2:
				this.nowSelectIndex2 = index;
				break;
		}
	}

	public getIndex(type: number) {
		switch (type) {
			case 1:
				return this.nowSelectIndex1;
			case 2:
				return this.nowSelectIndex2;
		}
	}
	public setArtufactData(data: Sproto.artifact_data[]) {
		for (var i = 0; i < data.length; i++) {
			let artifactEquData = new ArtifactEquData();
			artifactEquData.id = data[i].id;
			artifactEquData.level = data[i].level;
			artifactEquData.strenglv = data[i].strenglv;
			this.artufactDic.set(artifactEquData.id, artifactEquData)
		}
	}

	public get activateIndex(): number {
		let activateIndex = 0;
		let artufactDatas = this.artufactDic.values;
		for (var i = 0; i < artufactDatas.length; i++) {
			if (artufactDatas[i].isActivate == true) {
				activateIndex += 1;
			}
		}
		return activateIndex;
	}

	public setNoActivateDebrisGroup(group: eui.Group, list: any[]) {
		let len = group.numChildren;
		for (var i = 0; i < len; i++) {
			let child = group.removeChildAt(0);
			if (child && child instanceof ArtifactDebrisLab) {
				child.release();
			}
		}
		group.removeChildren();
		for (var i = 0; i < list.length; i++) {
			let lab = new ArtifactDebrisLab();
			lab.data = list[i];
			group.addChild(lab);
			lab.setData();
		}
	}
	public getLvAttr(id: number, level: number): { type: number, value: number }[] {
		let artifactsStrengConfig = GlobalConfig.ins("ArtifactsStrengConfig")[id];
		if (artifactsStrengConfig) {
			let needItme: number = 1 + Math.floor(level / 5);
			let power = AttributeData.getNowPower(0, level, 0, 5, artifactsStrengConfig.price, artifactsStrengConfig.basiccon, artifactsStrengConfig.increasecon, artifactsStrengConfig.slope, artifactsStrengConfig.revisecon);
			// let attr = AttributeData.getAttrByPower(artifactsStrengConfig.maxHp, artifactsStrengConfig.maxAtk, artifactsStrengConfig.maxDef, artifactsStrengConfig.maxMagDef, power);
			let attr = AttributeData.getAttrElementByPower(power, artifactsStrengConfig.elementValue1, artifactsStrengConfig.elementValue2, artifactsStrengConfig.maxElement1, artifactsStrengConfig.maxElement2);
			return attr;
		}
		return [];
	}

	public layerlvAttr(id: number, level: number): { type: number, value: number }[] {
		let artifactsRankConfig = GlobalConfig.ins("ArtifactsRankConfig")[id];
		if (artifactsRankConfig) {
			if (level > 0) {
				let data = artifactsRankConfig[level - 1];
				return data.attrs;
			}
		}
		return [];
	}
	public checkIsCanLayerUP(id: number): boolean {
		let artifactData = this.artufactDic.get(id);
		if (artifactData) {
			let artifactsConfig = GlobalConfig.ins("ArtifactsConfig")[artifactData.id];
			if (!artifactsConfig) {
				return false;
			}
			if (artifactData.isActivate == false) {
				return false;
			}
			let artifactsRankConfig = GlobalConfig.ins("ArtifactsRankConfig")[artifactData.id];
			if (artifactData.level == artifactsRankConfig.length) {
				return false;
			}
			/**去掉等级限制 */
			// if (artifactData.strenglv < artifactData.layerNeedLv) {
			// 	return false;
			// }
			/**增加的兼容模式 */
			let num2 = artifactData.level - 1;
			if (num2 <= 0) {
				num2 = 0;
			}
			let needList2 = artifactsRankConfig[num2].rankUpItem2;
			let itemConfig2 = GlobalConfig.ins("ItemConfig")[needList2.id];
			let itmeType2 = 0;
			if (itemConfig2 && itemConfig2.type == 0) {
				itmeType2 = 1;
			}
			let neednum2 = UserBag.ins().getBagGoodsCountById(itmeType2, needList2.id);
			if (neednum2 >= needList2.count) {
				return true;
			}
			let needList3 = artifactsRankConfig[num2].rankUpItem3;
			if (needList3) {
				let neednum3 = UserBag.ins().getBagGoodsCountById(itmeType2, needList3.id);
				if (neednum3 >= needList3.count) {
					return true;
				}
			}
			/********** */
			let needList = artifactsRankConfig[num2].rankUpItem;
			let itemConfig = GlobalConfig.ins("ItemConfig")[needList.id];
			let itmeType = 0;
			if (itemConfig && itemConfig.type == 0) {
				itmeType = 1;
			}
			let num = UserBag.ins().getBagGoodsCountById(itmeType, needList.id);
			if (num >= needList.count) {
				return true;
			}
		}
		return false;
	}
	/**暂时去掉神器等级 */
	public checkIsCanLvUP(id: number): boolean {
		let artifactData = this.artufactDic.get(id);
		let needArr = [];
		if (artifactData) {
			let artifactsConfig = GlobalConfig.ins("ArtifactsConfig")[artifactData.id];
			if (!artifactsConfig) {
				return false;
			}
			if (artifactData.isActivate == false) {
				if (artifactsConfig[0].activateType == 1) {
					let initAttr = artifactsConfig[0].attrs;
					if (artifactData.id == this.curid) {
						if (artifactsConfig.length == this.conid) {
							return true;
						}
					}
					let isCanActivate = this.checkAllDebrisIsCanActivate(artifactsConfig[0].id);
					if (isCanActivate) {
						return true;
					}
				} else {
					let needItemData = [];
					needItemData.push(artifactsConfig[0].activationItem);
					needArr = needItemData;
				}
			}
			else {
				let artifactsStrengConfig = GlobalConfig.ins("ArtifactsStrengConfig")[artifactData.id];
				if (artifactsStrengConfig) {
					let newneedArr = [];
					for (var i = 1; i <= 2; i++) {
						let needData = { type: 0, id: 0, count: 0 };
						needData.type = 0;
						needData.id = artifactsStrengConfig["itemId" + i];
						if (i == 2) {
							needData.count = artifactData.strenglv * 500;
						} else {
							needData.count = 1 + Math.floor(artifactData.strenglv / 5);
						}
						newneedArr.push(needData);
					}
					needArr = newneedArr;
				}
			}
			if (artifactData.strenglv <= 0 && artifactData.isActivate == false) {
				let artifactsConfig = GlobalConfig.ins("ArtifactsConfig")[artifactData.id];
				if (artifactsConfig) {
					if (artifactsConfig[0].activateType == 2) {
						let itemConfig = GlobalConfig.ins("ItemConfig")[artifactsConfig[0].activationItem.id];
						let itmeType = 0;
						if (itemConfig && itemConfig.type == 0) {
							itmeType = 1;
						}
						let num = UserBag.ins().getBagGoodsCountById(itmeType, artifactsConfig[0].activationItem.id);
						if (num >= artifactsConfig[0].activationItem.count) {
							return true;
						}
					}
				}
			}
			// else if (artifactData.isActivate == true) {
			// 	let artifactsStrengConfig = GlobalConfig.ins("ArtifactsStrengConfig")[artifactData.id];
			// 	if (artifactsStrengConfig) {
			// 		let isCanUp = true;
			// 		if (artifactData.level < artifactData.lvNeedLayer) {
			// 			isCanUp = false;
			// 		}
			// 		if (isCanUp) {
			// 			for (var i = 0; i < needArr.length; i++) {
			// 				if (needArr[i].id == 1) {
			// 					let gold: number = GameLogic.ins().actorModel.gold;
			// 					if (gold < needArr[i].count) {
			// 						isCanUp = false;
			// 						break;
			// 					}
			// 				} else {
			// 					let itemConfig = GlobalConfig.ins("ItemConfig")[needArr[i].id];
			// 					let itmeType = 0;
			// 					if (itemConfig && itemConfig.type == 0) {
			// 						itmeType = 1;
			// 					}
			// 					let num = UserBag.ins().getBagGoodsCountById(itmeType, needArr[i].id);
			// 					if (num < needArr[i].count) {
			// 						isCanUp = false;
			// 						break;
			// 					}
			// 				}
			// 			}
			// 		}
			// 		if (isCanUp) {
			// 			return true;
			// 		}
			// 	}
			// }
		}
		return false;
	}
	public checkAllDebrisIsCanActivate(groupId: number) {
		let config = GlobalConfig.ins("ArtifactsConfig")[groupId];
		for (let key in config) {
			let artifactsConfig = config[key];
			let isCanActivate = this.checkDebrisIsCanActivate(artifactsConfig);
			if (isCanActivate) {
				return true;
			}
		}
		return false;
	}
	/**是否有神器碎片可以升级 */
	public checkAnyIsCanActivate(): boolean {
		let list = Object.keys(GlobalConfig.ins("ArtifactsConfig"))
		for (let i = 0, len = list.length; i < len; i++) {
			if (this.checkAllDebrisIsCanActivate(parseInt(list[i]))) {
				return true
			}
		}
		return false
	}

	public checkAllLvUp(): boolean {
		let datas = this.artifactDataList;
		for (var i = 0; i < datas.length; i++) {
			let isCanUp = this.checkIsCanLvUP(datas[i].id);
			if (isCanUp) {
				return true;
			}
		}
		return false;
	}

	public checkAllLvUpByType(type: number): boolean {
		let datas = this.artifactDataTypeList(type);
		for (var i = 0; i < datas.length; i++) {
			let isCanUp = this.checkIsCanLvUP(datas[i].id);
			if (isCanUp) {
				return true;
			}
		}
		return false;
	}

	public checkAllLvUpAndActivate(): boolean {
		if (this.checkAllLvUp() || this.checkAnyIsCanActivate()) {
			return true;
		}
		return false;
	}

	public checkAllLvUpAndActivateByType(type: number) {
		if (this.checkAllLvUpByType(type) || this.checkAnyIsCanActivate()) {
			return true;
		}
		return false;
	}

	public checkAllLayerUp(): boolean {
		let datas = this.artifactDataList;
		for (var i = 0; i < datas.length; i++) {
			let isCanUp = this.checkIsCanLayerUP(datas[i].id);
			if (isCanUp) {
				return true;
			}
		}
		return false;
	}

	public checkAllLayerUpBuyType(type): boolean {
		let datas = this.artifactDataTypeList(type);
		for (var i = 0; i < datas.length; i++) {
			let isCanUp = this.checkIsCanLayerUP(datas[i].id);
			if (isCanUp) {
				return true;
			}
		}
		return false;
	}

	public checkDebrisIsCanActivate(data: any) {
		if (data) {
			let artifacrEquData = this.artufactDic.get(data.id);
			if (artifacrEquData) {
				let artifactsConfig = GlobalConfig.ins("ArtifactsConfig")[artifacrEquData.id];
				let modNum = 0;
				if (this.curid == data.id) {
					modNum = data.fragmentCount - this.conid;
					if (this.conid >= data.fragmentId) {
						return false;
					}
					switch (data.conditionkind) {
						case ArtifactGetType.TYPE1:
							if (UserFb.ins().CheckFb) {
								if (UserFb.ins().guanqiaID >= data.conditionnum) {
									return true;
								}
							}
							break;
						case ArtifactGetType.TYPE2:
							let playerlv = GameLogic.ins().actorModel.level;
							if (playerlv >= data.conditionnum) {
								return true;
							}
							break;
						case ArtifactGetType.TYPE3:
							let vipLv = UserVip.ins().lv;
							if (vipLv >= data.conditionnum) {
								return true;
							}
							break;
						case ArtifactGetType.TYPE4:
							if (GameServer.serverOpenDay >= data.conditionnum) {
								return true;
							}
							break;
						case ArtifactGetType.TYPE5:
							// if (artifactModel.conid < this.data.fragmentId) {
							// 	if (GameServer.serverOpenDay >= data.conditionnum) {
							// 		this.m_ActivateBtn.visible = true;
							// 		this.m_ConditionLab.visible = false;
							// 	}
							// }
							break;
						case ArtifactGetType.TYPE6:
							let zsLv = GameLogic.ins().actorModel.zsLv;
							if (zsLv >= data.conditionnum) {
								return true;
							}
							break;
					}
				}
			}
		}
		return false;
	}
	/**排序后的数据（重要） */
	private get artifactDataList(): ArtifactEquData[] {
		let artifactDatas = this.artufactDic.values
		artifactDatas.sort(this.sorLvUp);
		return artifactDatas;
	}
	public artifactDataTypeList(type: number): ArtifactEquData[] {
		let data = this.artifactDataList;
		let newData = [];
		for (var i = 0; i < data.length; i++) {
			if (data[i].type == type) {
				newData.push(data[i]);
			}
		}
		return newData;

	}
	/**关联排序 */
	private sorLvUp(item1: { id: number }, item2: { id: number }): number {
		return item1.id - item2.id;
	}
}

enum ArtifactGetType {
	/**通关关卡数 */
	TYPE1 = 1,
	/**人物等级 */
	TYPE2 = 2,
	/**VIP等级 */
	TYPE3 = 3,
	/**开服天数 */
	TYPE4 = 4,
	/**登录天数 */
	TYPE5 = 5,
	/**转职等级 */
	TYPE6 = 6,
}
window["ArtifactModel"] = ArtifactModel