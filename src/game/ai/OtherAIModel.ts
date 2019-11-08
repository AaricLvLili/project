class OtherAIModel {
	private static s_instance: OtherAIModel;
	public static get getInstance(): OtherAIModel {
		if (!OtherAIModel.s_instance) {
			OtherAIModel.s_instance = new OtherAIModel();
		}
		return OtherAIModel.s_instance;
	}
	/**是否开启虚假AI */
	private isSHowAi: boolean = true;
	private attr = [1, 2, 3];
	public constructor() {
		this.attr.sort(() => Math.random() - 0.5);
	}
	public aiRoleList: Dictionary<CharMonster> = new Dictionary<CharMonster>();
	public aiMonsterList: Dictionary<CharMonster> = new Dictionary<CharMonster>();
	public aiNum = 0;
	public isCanAiCreateMonsters = true;
	public createMonsters(model: EntityModel) {
		if (!this.isSHowAi) {
			return;
		}
		let roleDatas = this.aiRoleList.values;
		if (roleDatas.length <= 0) {
			return;
		} else {
			for (var i = 0; i < roleDatas.length; i++) {
				let roleData = roleDatas[i]
				if (roleData) {
					if (roleData.AI_STATE == AI_State.Die) {
						roleData.AI_STATE = AI_State.Stand;
						roleData.alpha = 1;
						roleData.visible = true;
					}
				}
			}
		}
		if (this.aiRoleList.values.length <= 0) {
			return;
		}
		if (!GameMap.IsNoramlLevel()) {
			return;
		}
		if (this.aiMonsterList.values.length > 6) {
			return;
		}
		if (!this.isCanAiCreateMonsters) {
			return;
		}

		model.type = EntityType.WillDummyMonster;
		// model.x = model.x + Math.random() * 30 + 10;
		// model.y = model.y + Math.random() * 30 + 10;
		let target = EntityManager.ins().createEntity(model);
		if (target) {
			target.infoModel.handle = target.hashCode;
			this.aiMonsterList.set(target.infoModel.handle, target);
			let gamescene = ViewManager.ins().getView(GameSceneView) as GameSceneView
			gamescene.map.addEntity(target);
		}
	}
	public creatorAIRole() {
		if (!this.isSHowAi) {
			return;
		}
		if (!GameMap.IsNoramlLevel()) {
			return;
		}
		if (this.aiNum == 0) {
			let aiBaseConfig = GlobalConfig.ins("AiBaseConfig");
			let num = Math.random() * 100;
			let addNum = 0
			for (let i = 0; i < aiBaseConfig.aiRefresh.length; i++) {
				addNum = addNum + aiBaseConfig.aiRefresh[i][1]
				if (num >= addNum) {
					continue;
				} else {
					this.aiNum = aiBaseConfig.aiRefresh[i][0]
					break;
				}
			}
			if (this.aiNum == 0) {
				this.aiNum = 3;
			}
		}
		let rolesModel = SubRoles.ins().rolesModel;
		for (var f = 0; f < this.aiNum; f++) {
			let oldRole = this.aiRoleList.values[f] as CharRole
			if (oldRole) {
				continue;
			}
			let role: Role = rolesModel[f];
			if (!role) {
				role = rolesModel[0];
			}
			var infoModel = new Role();
			let job = this.attr[f];
			let config = GlobalConfig.ins("AiRoleConfig")[job];
			let ram = Math.floor(Math.random() * 100);
			let addramNum = 0;
			let key = 0;
			for (let i = 0; i < config.length; i++) {
				addramNum = addramNum + config[i].rate
				if (ram >= addramNum) {
					continue;
				} else {
					key = i;
					break;
				}
			}
			let aiRoleConfig = config[key];
			infoModel.zhuangbei = aiRoleConfig.zhuangbei;
			let equipsData = [];
			for (let i = 0; i < role.equipsData.length; i++) {
				let equipData = new EquipsData();
				equipData.item.configID = aiRoleConfig.appearance[i];
				equipsData.push(equipData);
			}
			infoModel.equipsData = equipsData;
			let wingsData = new WingsData();
			wingsData.lv = aiRoleConfig.wing;
			wingsData.showLv = aiRoleConfig.wing;
			if (aiRoleConfig.wing <= 0) {
				wingsData.openStatus = false;
			} else {
				wingsData.openStatus = true;
			}
			infoModel.wingsData = wingsData;
			infoModel.mountsLevel = aiRoleConfig.mounts;
			infoModel.mountsShowLv = aiRoleConfig.mounts;
			infoModel.sex = aiRoleConfig.sex;
			infoModel.job = aiRoleConfig.job;
			infoModel.zhuanzhiLv = aiRoleConfig.transferLevel;
			infoModel.attrElementMianType = aiRoleConfig.element;
			infoModel.attrElementData = role.attrElementData;
			infoModel.parserAtt(role.getattributeData);
			infoModel.setAtt(AttributeType.atHp, infoModel.getAtt(AttributeType.atMaxHp))
			let rankData = Rank.ins().getRankModel(0);
			infoModel.name = "";
			let namekey = Math.floor(Math.random() * rankData._dataList.length);
			let rankRoleData = rankData._dataList[namekey];
			if (rankRoleData) {
				infoModel.name = rankRoleData.player;
			}
			infoModel.type = EntityType.WillDummy;
			infoModel.skillsData = aiRoleConfig.skillLevel;
			infoModel.skillsDataIndex = aiRoleConfig.skill;
			let chaptersConfig = GlobalConfig.ins("ChaptersConfig")[UserFb.ins().guanqiaID]
			if (chaptersConfig) {
				let scenesConfig = GlobalConfig.ins("ScenesConfig")[chaptersConfig.sid]
				infoModel.x = Const.PosToPixel(scenesConfig.aIEnterX);
				infoModel.y = Const.PosToPixel(scenesConfig.aIEnterY);
			} else {
				infoModel.x = role.x;
				infoModel.y = role.y;
			}
			infoModel.title = aiRoleConfig.title;
			infoModel.roleID = 0;
			let createRole = EntityManager.ins().createEntity(infoModel);
			if (createRole) {
				createRole.infoModel.handle = createRole.hashCode;
				this.aiRoleList.set(createRole.infoModel.handle, createRole);
				let gamescene = ViewManager.ins().getView(GameSceneView) as GameSceneView
				gamescene.map.addEntity(createRole);
				createRole.visible = true;
				createRole.alpha = 1;
				createRole.AI_STATE = AI_State.Stand;
			}


		}
	}

	public releaseRole(handle: number) {
		let role = this.aiRoleList.remove(handle);
		if (role) {
			role.alpha = 1;
			egret.Tween.removeTweens(role);
			DisplayUtils.dispose(role);
			role = null;
		}
	}
	/**这个是循环的时候用 */
	public releaseMonster(handle: number) {
		let monster = this.aiMonsterList.remove(handle);
		if (monster) {
			if (GameMap.IsNoramlLevel()) {
				if (this.aiMonsterList.values.length <= 2) {
					// monster.infoModel.x = monster.infoModel.x + Math.random() * 30 + 10;
					// monster.infoModel.y = monster.infoModel.y + Math.random() * 30 + 10;
					let hp = monster.infoModel.getAtt(AttributeType.atMaxHp)
					monster.infoModel.setAtt(AttributeType.atHp, hp);
					this.createMonsters(monster.infoModel);
				}
			}
			monster.alpha = 1;
			egret.Tween.removeTweens(monster);
			DisplayUtils.dispose(monster);
			monster = null;
		}
	}

	public releaseAllMonster(handle: number) {
		let monster = this.aiMonsterList.remove(handle);
		if (monster) {
			monster.alpha = 1;
			egret.Tween.removeTweens(monster);
			DisplayUtils.dispose(monster);
			monster = null;
		}
	}

	public releaseAll() {
		for (var i = 0; i < this.aiRoleList.keys.length; i++) {
			this.releaseRole(this.aiRoleList.keys[i]);
		}
		for (var i = 0; i < this.aiMonsterList.keys.length; i++) {
			this.releaseAllMonster(this.aiMonsterList.keys[i]);
		}
		this.attr.sort(() => Math.random() - 0.5);
		this.aiNum = 0;
	}

	public setName() {
		let charRoles = this.aiRoleList.values;
		for (var i = 0; i < charRoles.length; i++) {
			let charRole = charRoles[i]
			if (charRole) {
				if (!charRole.infoModel.name || charRole.infoModel.name == "") {
					let rankData = Rank.ins().getRankModel(0);
					let name = this.getName(rankData);
					charRole.infoModel.name = name;
					charRole.setCharName(name);
					charRole.showCharName(true);
				}
			}
		}
	}

	private getName(rankData) {
		if (rankData && rankData._dataList.length > 0) {
			let key = Math.floor(Math.random() * rankData._dataList.length);
			let data = rankData._dataList[key];
			if (data) {
				if (data.player != GameLogic.ins().actorModel.name) {
					return data.player;
				} else {
					return this.getName(rankData);
				}
			}

			return this.getName(rankData);
		}
		return ""
	}

	public setPoint() {
		let roles = this.aiRoleList.values;
		let chaptersConfig = GlobalConfig.ins("ChaptersConfig")[UserFb.ins().guanqiaID]
		if (chaptersConfig) {
			let scenesConfig = GlobalConfig.ins("ScenesConfig")[chaptersConfig.sid]
			for (var i = 0; i < roles.length; i++) {
				roles[i].x = Const.PosToPixel(scenesConfig.aIEnterX);
				roles[i].y = Const.PosToPixel(scenesConfig.aIEnterY);
			}
		}

	}

	public refreshAll() {
		this.isCanAiCreateMonsters = false;
		let charMonsters = this.aiMonsterList.values;
		for (var i = 0; i < charMonsters.length; i++) {
			let monster = charMonsters[i]
			if (monster) {
				monster.AI_STATE = AI_State.Die;
				monster.stopMove();
				egret.Tween.get(monster).to({ alpha: 0 }, 1000);
			}
		}
		let charRoles = this.aiRoleList.values;
		for (var i = 0; i < charRoles.length; i++) {
			let charRole = charRoles[i]
			if (charRole) {
				charRole.AI_STATE = AI_State.Die;
				charRole.stopMove();
				egret.Tween.get(charRole).to({ alpha: 0 }, 1000);
			}
		}
		egret.setTimeout(function () {
			this.releaseAll();
			this.creatorAIRole();
			this.isCanAiCreateMonsters = true;
		}, this, 4000)
	}
}
window["OtherAIModel"] = OtherAIModel;



