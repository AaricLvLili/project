class PetModel {
	private static s_instance: PetModel;
	public static get getInstance(): PetModel {
		if (!PetModel.s_instance) {
			PetModel.s_instance = new PetModel();
		}
		return PetModel.s_instance;
	}
	public constructor() {
		this.petDic = new Dictionary<PetData>();
		let petConfig = GlobalConfig.ins("PetConfig");
		for (let key in petConfig) {
			let petData = new PetData();
			petData.isActivate = false;
			petData.petid = petConfig[key].id;
			petData.name = petConfig[key].name;
			petData.level = 0;
			petData.star = 0;
			petData.exp = 0;
			petData.power = 0;
			petData.isFight = false;
			petData.skill = petConfig[key].skill[0];
			petData.bskill = petConfig[key].bskill;
			petData.wash = [];
			petData.lock = [];
			petData.inRoleId = -1;
			this.petDic.set(petConfig[key].id, petData);
		}
		this.petAttachData = new Dictionary<Sproto.pet_attch_data>();
		this.selectSmeltData = new Dictionary<ItemData>();

		let petBasicConfig = GlobalConfig.ins("PetBasicConfig");
		if (petBasicConfig && petBasicConfig.guidePetId) {
			this.guidePeiId = petBasicConfig.guidePetId;
		}
	}
	public petDic: Dictionary<PetData>;
	public petAttachData: Dictionary<Sproto.pet_attch_data>;

	public scrollH: number = 0;
	/**当前选择的宠物id */
	public selectIndex: number = 0;
	public attachSelectIndex: number = 0;

	public petSkillMaxNum = 8;

	public attachSelectRoleId: number;

	public petAllShowIndex: number = 0;

	public selectSmeltData: Dictionary<ItemData>;

	public guidePeiId: number = 70;

	public guidePeiIdIndex: number = 0;

	public petDebrisBtnIndex: number = 1;
	private _battlePetList: number[] = [0, 0, 0]//出战的宠物列表

	/**宠物探索的 */
	public petTreasureSelectIndex: number = 0;
	/**探索结果 */
	public petTreasureResult = [];
	/**探索的列表 */
	public petTreasureRoleList = [];

	private _petMaxNum = 0;

	public petAllShowLv: number = 1;
	// public petAllShowAttr: Sproto.attribute_data[] = [];
	public setPetDic(data: Sproto.pet_data[]) {
		for (var i = 0; i < data.length; i++) {
			let petData: PetData = this.petDic.get(data[i].petid);
			petData.attr = data[i].attr;
			petData.exp = data[i].exp;
			petData.isActivate = true;
			petData.level = data[i].level;
			petData.name = data[i].name;
			petData.petid = data[i].petid;
			petData.power = data[i].power;
			petData.star = data[i].star;
			petData.skill = data[i].skill;
			petData.bskill = data[i].bskill;
			petData.wash = data[i].wash;
			petData.lock = data[i].lock;
			petData.isAwakening = data[i].awake;
		}
		if (!this.selectIndex) {
			this.selectIndex = this.getSoltPetData()[0].petid;
		}
		// //设置出战宠物状态
		// for (let i = 0, len = SubRoles.ins().subRolesLen; i < len; i++) {
		// 	let role = SubRoles.ins().getSubRoleByIndex(i)
		// 	let petData = this.petDic.get(role.petId)
		// 	if (petData) {
		// 		petData.isFight = true
		// 	}
		// }
	}

	public setPetAttachData(data: Sproto.pet_attch_data[]) {
		for (var i = 0; i < data.length; i++) {
			this.petAttachData.set(data[i].roleid, data[i]);
			let petList = data[i].petid;
			for (var f = 0; f < petList.length; f++) {
				if (petList[f] > 0) {
					let petData = this.petDic.get(petList[f]);
					if (petData) {
						petData.inRoleId = data[i].roleid;
						petData.inRoleSlot = f;
					}
				}
			}
		}
	}

	public getQualityColor(quality: number): number {
		let color: number
		switch (quality) {
			case 1:
				color = Color.Green;
				break;
			case 2:
				color = Color.Blue;
				break;
			case 3:
				color = Color.Purple;
				break;
			case 4:
				color = Color.Yellow;
				break;
			case 5:
				color = Color.Red;
				break;
		}
		return color;
	}

	public getRName(quality: number): string {
		let result: string;
		switch (quality) {
			case 1:
				result = "R";
				break;
			case 2:
				result = "SR";
				break;
			case 3:
				result = "SSR";
				break;
			case 4:
				result = "SSSR";
				break;
			case 5:
				result = "SSSSR";
				break;
			case 6:
				result = "SSSSSR";
				break;
			default:
				result = "R";
				break;
		}
		return result;
	}

	public getRName2(quality: number): string {
		let result: string;
		switch (quality) {
			case 1:
				result = "r";
				break;
			case 2:
				result = "sr";
				break;
			case 3:
				result = "ssr";
				break;
			case 4:
				result = "sssr";
				break;
			case 5:
				result = "ssssr";
				break;
			case 6:
				result = "sssssr";
				break;
			default:
				result = "r";
				break;
		}
		return result;
	}

	public getAllPetPower(): number {
		let petDatas = this.petDic.values;
		let power: number = 0;
		for (var i = 0; i < petDatas.length; i++) {
			power += petDatas[i].power;
		}
		return power;
	}
	public getPetPowerByIdList(ids: number[]) {
		let petDatas = this.petDic.values;
		let power: number = 0;
		for (var i = 0; i < petDatas.length; i++) {
			for (var f = 0; f < ids.length; f++) {
				if (ids[f] == petDatas[i].petid) {
					power += petDatas[i].power;
				}
			}
		}
		return power;
	}

	public getAllPetActivate(): number {
		let petDatas = this.petDic.values;
		let activateNum: number = 0;
		for (var i = 0; i < petDatas.length; i++) {
			if (petDatas[i].isActivate == true) {
				activateNum += 1;
			}
		}
		return activateNum;
	}

	public getNowSelectPetData(): PetData {
		// let petDatas: PetData[] = this.petDic.values;
		let petData = this.petDic.get(this.selectIndex);
		return petData;
	}
	/**不含技能 */
	public getPetAttr(petid: number, lv: number, star: number): any[] {

		let hp = Math.floor(this.getLvAttr(petid, lv)[0].value + this.getStarAttr(petid, star)[0].value);
		let attack = Math.floor(this.getLvAttr(petid, lv)[1].value + this.getStarAttr(petid, star)[1].value);
		let def = Math.floor(this.getLvAttr(petid, lv)[2].value + this.getStarAttr(petid, star)[2].value);
		let res = Math.floor(this.getLvAttr(petid, lv)[3].value + this.getStarAttr(petid, star)[3].value);
		let attrdata = [hp, attack, def, res];
		let attr = [];
		for (var i = 0; i < 4; i++) {
			if (i == 0) {
				let data = { value: attrdata[i], type: 2 };
				attr.push(data);
			} else {
				let data = { value: attrdata[i], type: (i + 3) };
				attr.push(data);
			}
		}
		return attr;
	}

	public getLvAttr(petid: number, lv: number): { type: number, value: number }[] {
		let petLevelExpConfig = GlobalConfig.ins("PetLevelExpConfig")[lv];
		let value = petLevelExpConfig.value;
		let attr = [];
		for (var i = 0; i < value.length; i++) {
			let list = { type: value[i].type, value: value[i].value };
			attr.push(list);
		}
		return attr;
	}

	public getStarAttr(petid: number, star: number): any[] {
		let petConfig = GlobalConfig.ins("PetConfig")[petid];
		let hp = Math.floor(petConfig.hp * (petConfig.hpStarValue / 10000 * star + 1));
		let attack = Math.floor(petConfig.attck * (petConfig.attckStarValue / 10000 * star + 1));
		let def = Math.floor(petConfig.def * (petConfig.defStarValue / 10000 * star + 1));
		let res = Math.floor(petConfig.res * (petConfig.resStarValue / 10000 * star + 1));
		let attrdata = [hp, attack, def, res];
		let attr = [];
		for (var i = 0; i < 4; i++) {
			if (i == 0) {
				let data = { value: attrdata[i], type: 2 };
				attr.push(data);
			} else {
				let data = { value: attrdata[i], type: (i + 3) };
				attr.push(data);
			}
		}
		return attr;
	}


	public getAllLvAttr(): any[] {
		let petDatas: PetData[] = this.petDic.values;
		let attr = [];
		for (var i = 0; i < 4; i++) {
			if (i == 0) {
				let data = { value: 0, type: 2 };
				attr.push(data);
			} else {
				let data = { value: 0, type: (i + 3) };
				attr.push(data);
			}
		}
		for (var i = 0; i < petDatas.length; i++) {
			if (petDatas[i].isActivate) {
				let lvAttr = this.getLvAttr(petDatas[i].petid, petDatas[i].level);
				for (var f = 0; f < attr.length; f++) {
					attr[f].value += lvAttr[f].value;
				}
			}
		}
		return attr;
	}

	public getAllStarAttr(): any[] {
		let petDatas: PetData[] = this.petDic.values;
		let attr = [];
		for (var i = 0; i < 4; i++) {
			if (i == 0) {
				let data = { value: 0, type: 2 };
				attr.push(data);
			} else {
				let data = { value: 0, type: (i + 3) };
				attr.push(data);
			}
		}
		for (var i = 0; i < petDatas.length; i++) {
			if (petDatas[i].isActivate) {
				let starAttr = this.getStarAttr(petDatas[i].petid, petDatas[i].star);
				for (var f = 0; f < attr.length; f++) {
					attr[f].value += starAttr[f].value;
				}
			}
		}
		return attr;
	}



	public setStar(group: eui.Group, star: number) {
		let numChild = group.numChildren;
		for (var i = 0; i < numChild; i++) {
			group.removeChildAt(0);
		}
		if (star == 0) {
			return;
		}
		let bigStarNum = Math.floor(star / 5);
		let littleStarNum = star % 5;
		for (var i = 0; i < bigStarNum; i++) {
			let img: eui.Image = new eui.Image;
			img.source = "comp_23_23_1_png";
			group.addChild(img);
		}
		for (var i = 0; i < littleStarNum; i++) {
			let img: eui.Image = new eui.Image;
			img.source = "comp_23_23_3_png";
			group.addChild(img);
		}
	}

	public getAttachList(): PetData[] {
		let petDatas: PetData[] = this.petDic.values;
		let data1: PetData[] = [];
		for (var i = 0; i < petDatas.length; i++) {
			if (petDatas[i].isActivate == true) {
				let anum = 0;
				let petConfig = GlobalConfig.ins("PetConfig")[petDatas[i].petid]
				if (petConfig) {
					anum = petConfig.quality * 100
				}
				if (petDatas[i].isFight == false && petDatas[i].inRoleId < 0) {
					petDatas[i].attachWeight = 3000 + anum + petDatas[i].petid;
				} else if (petDatas[i].isFight == false && petDatas[i].inRoleId >= 0) {
					petDatas[i].attachWeight = 4000 + anum + petDatas[i].petid;
				} else {
					petDatas[i].attachWeight = 1000 + anum + petDatas[i].petid;
				}
				if (this.attachSelectIndex == petDatas[i].inRoleSlot && this.attachSelectRoleId == petDatas[i].inRoleId) {
					petDatas[i].attachWeight += 100000;
				}
				data1.push(petDatas[i]);
			}
		}
		data1.sort(this.sorLvUp);
		return data1;
	}


	/**关联排序 */
	private sorLvUp(item1: { attachWeight: number }, item2: { attachWeight: number }): number {
		return item2.attachWeight - item1.attachWeight;
	}

	public checkPetListIsAllActivate(petIdList: number[]): boolean {
		let isActivate = true;
		for (var i = 0; i < petIdList.length; i++) {
			let petData = this.petDic.get(petIdList[i]);
			if (petData) {
				if (!petData.isActivate) {
					return false;
				}
			} else {
				return false;
			}
		}
		return true;
	}

	public getAllPetItme(): ItemData[] {
		return UserBag.ins().getAllItemListBuyType(0, 9);
	}

	public checkAllPetRedPoint(): boolean {
		if (Deblocking.Check(DeblockingType.TYPE_60, true)) {
			if (this.checkPetStateRedPoint() || this.checkSkilledPoint() || this.checkAllPetDebrisRedPoint() || this.checkAllRoleAttactRedPoint()) {
				return true;
			}
		}
		return false;
	}

	public checkPetStateRedPoint(): boolean {
		let petDatas = this.petDic.values;
		for (var i = 0; i < petDatas.length; i++) {
			if (petDatas[i].isCanActivate || petDatas[i].isCanLvUp || petDatas[i].isCanStarUp || petDatas[i].isCanAwakening) {
				return true;
			}
		}
		return false;
	}

	public checkSkilledPoint(): boolean {
		if (this.checkSkillUpRedPoint() || this.checkSkillChangeRedPoint()) {
			return true;
		}
		return false;
	}


	public checkSkillChangeRedPoint(): boolean {
		let petDatas = this.petDic.values;
		for (var i = 0; i < petDatas.length; i++) {
			if (petDatas[i].isCanSkillChange) {
				return true;
			}
		}
		return false;
	}

	public checkSkillUpRedPoint(): boolean {
		let petDatas = this.petDic.values;
		for (var i = 0; i < petDatas.length; i++) {
			if (petDatas[i].isCanSkillUp) {
				return true;
			}
		}
		return false;
	}

	public updataPetCharNameLv() {
		let pets = this.petDic.values;
		let charPets = EntityManager.ins().getPet();
		for (var i = 0; i < pets.length; i++) {
			if (pets[i].isFight) {
				for (var f = 0; f < charPets.length; f++) {
					if (charPets[f].infoModel.configID == pets[i].petMonsterId && charPets[f].infoModel.team == Team.My) {
						charPets[f].setCharName(pets[i].name + " lv" + pets[i].level);
					}
				}
			}
		}
	}

	public getSoltPetData(): PetData[] {
		let petDatas: PetData[] = this.petDic.values;
		for (var i = 0; i < petDatas.length; i++) {
			let petData = petDatas[i];
			let point = petData.petid;
			let quality = GlobalConfig.ins("PetConfig")[petData.petid].quality;
			point += (quality * 100);
			if (petData.isCanActivate) {
				point += 1000;
			}
			if (petData.isActivate) {
				point += 10000;
			}
			if (petData.inRoleId >= 0) {
				point += 100000;
			}
			if (petData.isBeiZhan) {
				point += 1000000;
			} else if (petData.isFight) {
				point += 10000000;
			}
			petData.point = point;
		}
		petDatas.sort(this.sorPoint);
		return petDatas;
	}
	/**关联排序 */
	private sorPoint(item1: { point: number }, item2: { point: number }): number {
		return item2.point - item1.point;
	}

	public checkGuideFirstPet() {
		let petData = this.petDic.get(this.guidePeiId);
		if (petData && petData.isCanActivate) {
			return true;
		}
		return false;
	}

	public checkGuideLvUp() {
		let petData = this.petDic.get(this.guidePeiId);
		if (petData && petData.isActivate == true && petData.level == 1 && petData.exp == 0) {
			return true;
		}
		return false;
	}

	public checkGuideBattle() {
		let petData = this.petDic.get(this.guidePeiId);
		if (petData && petData.isActivate == true && petData.isFight == false) {
			return true;
		}
		return false;
	}

	public checkGuideStar() {
		let petData = this.petDic.get(this.guidePeiId);
		let isCompele: boolean = GuideLocalStorage.checkIdIsCompele(27);
		if (petData && petData.isActivate == true && petData.star == 0 && !isCompele && petData.isCanStarUp) {
			return true;
		}
		return false;
	}
	/**检查全部碎片合成红点 */
	public checkAllPetDebrisRedPoint(): boolean {
		for (var i = 1; i < 6; i++) {
			let isRedPoint = this.checkPetDebrisRedPointByQuality(i);
			if (isRedPoint) {
				return true;
			}
		}
		return false;
	}
	/**检查碎片合成红点 */
	public checkPetDebrisRedPointByQuality(quality: number): boolean {
		let itemDatas: ItemData[] = UserBag.ins().getAllItemListBuyTypeAndQuality(0, ItemType.TYPE15, quality);
		if (itemDatas.length > 0) {
			for (var i = 0; i < itemDatas.length; i++) {
				let petComposeConfig = GlobalConfig.ins("PetComposeConfig")[itemDatas[i].configID];
				if (petComposeConfig) {
					if (itemDatas[i].count >= petComposeConfig.count) {
						return true;
					}
				}
			}
		}
		return false;
	}



	public setBattlePetList(index: number, value: number): void {
		if (value != null) {
			this._battlePetList[index] = value;
			this.changeFight();
		}
	}
	public set battlePetList(value: number[]) {
		this._battlePetList = value;
		this.changeFight();
	}
	public get battlePetList(): number[] {
		return this._battlePetList
	}
	/**改变出战 */
	public changeFight() {
		let petDatas: PetData[] = this.petDic.values;
		for (var i = 0; i < petDatas.length; i++) {
			petDatas[i].isFight = false;
		}
		for (var i = 0; i < this._battlePetList.length; i++) {
			let id = this._battlePetList[i]
			if (id > 0) {
				let petData = this.petDic.get(id);
				if (petData) {
					petData.isFight = true;
				}
			}
		}
	}

	//是否附身宠物
	public isAttachPet(id: number): boolean {
		let data = this.petDic.get(id)
		return data.inRoleId != -1
	}

	public test(num = 10) {
		this.petTreasureResult = [];
		for (var i = 0; i < num; i++) {
			let data = { type: 0, id: 2, count: 1000 }
			this.petTreasureResult.push(data);
		}
	}

	public setTreasureResultData(item: Sproto.petsSearch_item[]) {
		let datas = [];
		for (var i = 0; i < item.length; i++) {
			let type = 1;
			if (item[i].id < 100) {
				type = 0;
			} else {
				type = 1;
			}
			let data = { type: type, id: item[i].id, count: item[i].count };
			datas.push(data);
		}
		this.petTreasureResult = datas;
	}

	public setTreasureRoleList(petTreasureRoleList: Sproto.petsSearch_record[]) {
		let datas = [];
		for (var i = 0; i < petTreasureRoleList.length; i++) {
			let data = [];
			data.push(petTreasureRoleList[i].name);
			data.push(petTreasureRoleList[i].itemid);
			datas.push(data)
		}
		let oldData = this.petTreasureRoleList;
		this.petTreasureRoleList = datas.concat(oldData);
	}

	public checkAllRoleAttactRedPoint() {
		var roles = SubRoles.ins().rolesModel;
		for (var i = 0; i < roles.length; i++) {
			let role = roles[i];
			let isShow = this.checkRoleAttactRedPoint(role.roleID);
			if (isShow) {
				return true;
			}
		}
		return false;
	}

	public checkRoleAttactRedPoint(roleid: number) {
		let data: Sproto.pet_attch_data = this.petAttachData.get(roleid);
		if (data) {
			for (var i = 0; i < data.petid.length; i++) {
				let isShow = this.checkAttactRedPoint(roleid, i);
				if (isShow) {
					return true;
				}
			}
		}
		return false;

	}

	public checkAttactRedPoint(roleid: number, slot: number) {
		let data: Sproto.pet_attch_data = this.petAttachData.get(roleid);
		if (data) {
			if (data.petid[slot] == 0 && this.checkNoJobPet()) {
				return true;
			}
		}
		return false;
	}

	private checkNoJobPet() {
		let petDatas: PetData[] = this.petDic.values;
		for (var i = 0; i < petDatas.length; i++) {
			if (petDatas[i].isActivate == true && petDatas[i].isFight == false && petDatas[i].inRoleId < 0) {
				return true;
			}
		}
		return false;
	}
	/**全部的宠物数量 */
	public get petMaxNum(): number {
		if (this._petMaxNum <= 0) {
			let petConfig = GlobalConfig.ins("PetConfig");
			let maxNum = 0;
			for (let key in petConfig) {
				maxNum += 1;
			}
			this._petMaxNum = maxNum;
		}
		return this._petMaxNum
	}
	/**有的宠物数量 */
	public get nowPetHaveNum(): number {
		let petDatas = this.petDic.values;
		let haveNum = 0
		for (var i = 0; i < petDatas.length; i++) {
			let petData = petDatas[i];
			if (petData.isActivate) {
				haveNum += 1;
			}
		}
		return haveNum;
	}
	/**宠物全属性 */
	public get nowPetHaveAttr(): any[] {
		let petDatas = this.petDic.values;
		let haveNum = 0
		let petAllAttr = [];
		for (var i = 0; i < petDatas.length; i++) {
			let petData = petDatas[i];
			if (petData.isActivate) {
				petAllAttr = AttributeData.getAttr([petData.attr, petAllAttr])
			}
		}
		return petAllAttr;
	}
	/**宠物全属性*图鉴百分比 */
	public nowAllShowPetAttr(per: number): any[] {
		let nowPetHaveAttr = this.nowPetHaveAttr;
		for (var i = 0; i < nowPetHaveAttr.length; i++) {
			nowPetHaveAttr[i].value = Math.ceil(nowPetHaveAttr[i].value * per);
		}
		return nowPetHaveAttr;
	}
	/**总的共鸣属性比较复杂 */
	public allResonanceAttr(): any[] {
		let config = GlobalConfig.ins("PetFettersConfig");
		let configList2 = [];
		let configList3 = [];
		let petGroupList = [];
		for (let key1 in config) {
			let config2 = config[key1]
			configList2.push(config2);
			for (let key2 in config2) {
				let config3 = config2[key2];
				configList3.push(config3);
				for (let key3 in config3) {
					let mixConfig = config3[key3]
					let petList = mixConfig.pack;
					petGroupList.push(petList);
					break;
				}
			}
		}
		let needConfigAttr = [];
		for (var i = 0; i < petGroupList.length; i++) {
			let petList = petGroupList[i];
			let isActivate = true;
			let star = 0;
			for (var f = 0; f < petList.length; f++) {
				let petData = this.petDic.get(petList[f]);
				if (!petData.isActivate) {
					isActivate = false;
				}
				star += petData.star;
			}
			if (isActivate == true) {
				let config4 = configList3[i];
				let needConfig: any
				for (var t = 0; t < config4.length; t++) {
					let config5 = config4[t];
					if (star >= config5.condition) {
						needConfig = config5;
					}
				}
				let needAttr = [];
				for (var j = 0; j < needConfig.attr.length; j++) {
					let attr = { type: needConfig.attr[j].type, value: needConfig.attr[j].value }
					needAttr.push(attr);
				}
				needConfigAttr = AttributeData.getAttr([needConfigAttr, needAttr])
			}
		}
		return needConfigAttr;
	}
	/**图鉴属性的最终结果 */
	public petNowAllShowAttr() {
		let illustratedConfig = GlobalConfig.ins("illustratedConfig")[this.petAllShowLv];
		let attr = AttributeData.getAttr([this.allResonanceAttr(), this.nowAllShowPetAttr(illustratedConfig.additionRatio * 0.01)])
		return attr;
	}


}
window["PetModel"] = PetModel