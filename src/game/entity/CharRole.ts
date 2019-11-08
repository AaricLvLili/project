class CharRole extends CharMonster {
	// isplayerjie: boolean;
	timeout: number;
	_weapon: MovieClip;


	_wing: MovieClip;

	_disOrder: any;

	_weaponFileName: string;
	_wingFileName: string;
	_mountsFileName: string;
	_playerShadow;
	_title;
	_titleMc: MovieClip
	timeID;
	warjie;
	_mounts: MovieClip;

	private m_LegendDragon: MovieClip;

	isCanRandomSkill: boolean = false;
	isPlayRandomSkill: boolean = false;
	playRandomType: SkillType = SkillType.TYPE1;


	public constructor() {
		super();
		this.touchChildren = this.touchEnabled = false;

		this.timeout = 0;
		this._weapon = new MovieClip;
		this._weapon.visible = false;
		this._bodyContainer.addChild(this._weapon);
		this._wing = new MovieClip;
		this._wing.visible = false;
		this.addChildAt(this._wing, 3);
		this._mounts = new MovieClip;
		this._mounts.visible = false;

		this.addChildAt(this._mounts, 0);
		this._disOrder = {}
		this._disOrder[CharMcOrder.SHOWDOW] = this._shadow;
		this._disOrder[CharMcOrder.BODY] = this._body;
		this._disOrder[CharMcOrder.WEAPON] = this._weapon;
		this._disOrder[CharMcOrder.WING] = this._wing;
		this.charMonsterBlood.currentState = "state1";
		this.charMonsterBlood.y = -75;
		egret.setTimeout(
			function () {
				if (this.infoModel && this.infoModel.roleID == 0) {
					this.charMonsterBlood.show();
				} else {
					this.charMonsterBlood.initData();
				}
			}, this, 300)
		this.setScale(1.3);
	}

	public setWeaponFileName(name) {
		this._weaponFileName = name;
		this.loadFile(this._weapon, "weapon", this._weaponFileName);
	};
	public setWingFileName(name) {
		this._wingFileName = name;
		this.loadFile(this._wing, "wing", this._wingFileName);
	};
	public setmountsFileName(name) {
		this._mountsFileName = name;
		this.loadFile(this._mounts, "mounts", this._mountsFileName);
	};
	public syncFrame(e) {
		if (e.currentTarget.movieClipData.frames && e.currentTarget.movieClipData.frames.length > 0)
			e.currentTarget.gotoAndPlay(this._body.currentFrame, this.atkOne && this.isAtkAction() ? 1 : -1);
		else
			e.currentTarget.play(-1);
	};

	public playBody(e: egret.Event) {
		super.playBody(e);
		this._wing.stop();
		this._weapon.stop();
		this._weapon.clearCache();
		this._wing.clearCache();
		this._mounts.stop();
		this._mounts.clearCache();
		if (this.infoModel && this.infoModel.bianShen > 0) {
			this._weapon.removeEventListener(egret.Event.CHANGE, this.syncFrame, this);
			this._wing.removeEventListener(egret.Event.CHANGE, this.syncFrame, this);
			return;
		}
		this._weapon.addEventListener(egret.Event.CHANGE, this.syncFrame, this);
		if (this._weaponFileName)
			this.loadFile(this._weapon, "weapon", this._weaponFileName);
		this._wing.addEventListener(egret.Event.CHANGE, this.syncFrame, this);
		if (this._wingFileName)
			this.loadFile(this._wing, "wing", this._wingFileName);
		this._mounts.addEventListener(egret.Event.CHANGE, this.syncFrame, this);
		if (this._mountsFileName)
			this.loadFile(this._mounts, "mounts", this._mountsFileName);

		let name: string = e.currentTarget._fileName;
		let dir = name.slice(name.length - 2, name.length - 1);
		var order = CharRole.FRAME_ODER[dir];
		let index = 0;
		for (let orderKey of order) { //先取消排序
			if (this._bodyContainer.getChildIndex(this._disOrder[orderKey]) != index) {
				this._bodyContainer.addChildAt(this._disOrder[orderKey], index);
			}
			++index
		}
		this.setScale(1.3);
	};
	public stopFrame(f) {
		//super.stopFrame(f);
		this._body.stop();
		this._wing.stop();
		this._weapon.stop();
		this._mounts.stop();
		this._body.gotoAndStop(f);
		if (this._wing.visible) {
			this._wing.gotoAndStop(f);
		}
		if (this._weapon.visible) {
			this._weapon.gotoAndStop(f);
		}
		if (this._mounts.visible) {
			this._mounts.gotoAndStop(f);
		}

	};
	public continuePlay() {
		// for (var i in this.buffEff) {
		// 	this.buffEff[i].play(-1);
		// }
		// if (this.atking)
		// 	return;
		// this._body.play(-1);
		// this._wing.play(-1);
		// this._weapon.play(-1);
		// this._mounts.play(-1);
	};
	public hram(value) {
		// if (this.infoModel.roleID == 0 && this.infoModel.team != Team.My) {
		// 	egret.log("1111敌方主角");
		// } else if (this.infoModel.team != Team.My) {
		// 	egret.log("1111敌方副角色：" + this.infoModel.roleID);
		// }
		this.charMonsterBlood.m_HpBlood.value = this.charMonsterBlood.m_HpBlood.value - value;
		if (this.infoModel.roleID == 0) {
			this.showBloodTime();
		} else {
			if (this.saveHp != this.charMonsterBlood.m_HpBlood.value) {
				this.saveHp = this.charMonsterBlood.m_HpBlood.value;
				this.showBloodTime();
				this.setBloodTime();
			}
		}
	};
	/**
	 * 更新数据显示
	 */
	public updateBlood(force: boolean = false) {
		if (!this.infoModel)
			return;
		this.charMonsterBlood.m_NeiGongBlood.maximum = this.infoModel.getAtt(AttributeType.atMaxShield);
		this.charMonsterBlood.m_NeiGongBlood.value = this.infoModel.getAtt(AttributeType.atShield);

		this.charMonsterBlood.m_MpBlood.maximum = this.infoModel.getAtt(AttributeType.atMaxMp);
		this.charMonsterBlood.m_MpBlood.value = this.infoModel.getAtt(AttributeType.atMp);
		super.updateBlood(force);
		// if (this.infoModel.roleID == 0 && this.infoModel.team != Team.My) {
		// 	egret.log("敌方主角");
		// } else if (this.infoModel.team != Team.My) {
		// 	egret.log("敌方副角色：" + this.infoModel.roleID);
		// }
		if (this.infoModel.roleID == 0) {
			this.showBloodTime();
		} else if (this.charMonsterBlood.m_HpBlood.maximum == this.charMonsterBlood.m_HpBlood.value) {
			this.hideBloodTime();
		} else {
			if (this.saveHp != this.charMonsterBlood.m_HpBlood.value) {
				this.saveHp = this.charMonsterBlood.m_HpBlood.value;
				this.showBloodTime();
				this.setBloodTime();
			}
		}
	};
	private preFileName: string;
	private preState: string;
	private preDir;
	public loadBody() {
		// this._body.addEventListener(egret.Event.CHANGE, this.playBody, this);
		this.loadFile(this._body, this.GetBodyAssetPath(), this._fileName);
	};

	private zhuangBanId: any;
	private EquipConfig: any;
	public updateModel() {
		var model = this.infoModel;
		var tempSex: number = model.sex;
		if (this.zhuangBanId == null) {
			this.zhuangBanId = GlobalConfig.ins("ZhuangBanId");
		}
		var tempObj;
		let	zhuanzhiLv = model.zhuanzhiLv;
		if (model.bianShen > 0) {
			this._weaponFileName = "";
			this._wingFileName = "";

			this._weapon.clearCache();
			this._wing.clearCache();
			this._body.clearCache();
			this._wing.visible = false;
			this._weapon.visible = false;
		}
		else {
			this._wing.visible = true;
			this._weapon.visible = true;
			this._mounts.visible = true;
			if (model.legendDress != null) {
				tempObj = GlobalConfig.ins("LegendSuitConfig")[model.legendDress + 1];
				if (tempObj)
					this.setWeaponFileName(ResDataPath.GetWeaponName01(tempObj.weapon, tempSex))//model.sex))
			} else {
				//武器
				var id = model.getEquipByIndex(0).item.configID;
				if (model.zhuangbei[4] > 0) {
					var res = this.zhuangBanId[model.zhuangbei[4]].res2;
					this.setWeaponFileName(ResDataPath.GetWeaponName01(res, tempSex))//model.sex))
				} else if (model.zhuangbei[1] > 0) {
					var res = this.zhuangBanId[model.zhuangbei[1]].res;
					this.setWeaponFileName(ResDataPath.GetWeaponName01(res, tempSex))//model.sex))
				} else if (zhuanzhiLv > 0) {
					let transferAppearanceConfig = GlobalConfig.ins("TransferAppearanceConfig")[model.job][zhuanzhiLv];
					if (transferAppearanceConfig) {
						let res = transferAppearanceConfig.weaponAppearance;
						this.setWeaponFileName(ResDataPath.GetWeaponName01(res, tempSex))//model.sex));
					}

				}
				else if (id > 0) {
					if (this.EquipConfig == null)
						this.EquipConfig = GlobalConfig.equipConfig;
					var fileName = this.EquipConfig[id].appearance;
					this.setWeaponFileName(ResDataPath.GetWeaponName01(fileName, tempSex))//model.sex));
				} else {
					this.setWeaponFileName(ResDataPath.GetWeaponName01(ResDataPath.GetDefaultBodyName(this.infoModel.job, 1), this.infoModel.sex))
				}
			}
			// 羽翼
			if (model.zhuangbei[2] > 0) {
				var i = this.zhuangBanId[model.zhuangbei[2]].res;
				this.setWingFileName(i)
			} else if (model.wingsData.openStatus) {
				// let config = GlobalConfig.wingLevelConfig[model.wingsData.lv]
				let config = GlobalConfig.wingLevelConfig[model.wingsData.showLv]
				if (config) {
					var appearance = config.appearance;
					var job = model.job;
					this.setWingFileName(appearance);
				}
			}
			if (model.zhuangbei[3] > 0) {
				let name = this.zhuangBanId[model.zhuangbei[3]].res;
				this.setmountsFileName(name)
			} else {
				let mountsLevelConfig = GlobalConfig.ins("MountsLevelConfig")[model.mountsShowLv];
				if (mountsLevelConfig) {
					this.setmountsFileName(mountsLevelConfig.appearance);
				}
			}

		}

		if (model.legendDress != null) {
			this.initBody(ResDataPath.GetBodyName01(GlobalConfig.ins("LegendSuitConfig")[model.legendDress + 1].body, model.sex))
			this.setScale(1.3);
		} else {
			//身体
			// if (model.bianShen > 0) {//如果存在变身，变身优先显示
			// 	newAI.ins().updateBianShen(model.handle, model.job);
			// 	this.initBody(ResDataPath.GetBodyName01(GlobalConfig.ins("ShapeShiftConfig")[model.bianShen].appearance, 0));//固定写死用男的
			// 	this.setScale(1);
			// }
			// else 
			if (model.zhuangbei[4] > 0) {
				var i = this.zhuangBanId[model.zhuangbei[4]].res;
				this.initBody(ResDataPath.GetBodyName01(i, model.sex))
			}
			else if (model.zhuangbei[0] > 0) {
				var i = this.zhuangBanId[model.zhuangbei[0]].res;
				this.initBody(ResDataPath.GetBodyName01(i, model.sex))
				this.setScale(1.3);
			}
			else if (zhuanzhiLv > 0) {
				let transferAppearanceConfig = GlobalConfig.ins("TransferAppearanceConfig")[model.job][zhuanzhiLv];
				if (transferAppearanceConfig) {
					let res = transferAppearanceConfig.bodyAppearance
					this.initBody(ResDataPath.GetBodyName01(res, model.sex))
					this.setScale(1.3);
				}
			} else {
				id = model.getEquipByIndex(2).item.configID;
				if (this.EquipConfig == null)
					this.EquipConfig = GlobalConfig.equipConfig;
				this.initBody(ResDataPath.GetBodyName01(id && id > 0 ? this.EquipConfig[id].appearance : ResDataPath.GetDefaultBodyName(this.infoModel.job, 0), model.sex))
				this.setScale(1.3);
			}
		}


		// 大于0阶
		if (model.legendDress) {
			if (this.m_LegendDragon == null) {
				this.m_LegendDragon = new MovieClip()
				this.m_LegendDragon.blendMode = egret.BlendMode.ADD
			}
			this.addChild(this.m_LegendDragon)
			let effConfig = GlobalConfig.ins("LegendSuitConfig")[model.legendDress + 1]
			if (effConfig) {
				this.m_LegendDragon.visible = true
				this.m_LegendDragon.loadUrl(ResDataPath.GetUIEffePath("eff_dragon/" + effConfig.body), true, -1)
			} else {
				this.m_LegendDragon.visible = false
			}
		} else {
			if (this.m_LegendDragon) {
				DisplayUtils.removeFromParent(this.m_LegendDragon)
				this.m_LegendDragon.visible = false
			}
		}
		//称号
		this.updateTitle();
	};

	private GetRingPoint(x: number): number {
		let l1 = 100
		let l2 = 50

		let y = Math.sqrt((1 - x * x / (l1 * l1)) * l2 * l2)
		return x
	}

	//	public get info(): RoleModel {
	//		return <RoleModel>this.info;
	//	} public set info(value: RoleModel) {
	//		this.info = value;
	//	}
	public destruct() {
		super.destruct();
		this._weaponFileName = '';
		this._wingFileName = '';
		this._mountsFileName = '';
		this._weapon.clearCache();
		this._wing.clearCache();
		this._mounts.clearCache();
		this._weapon.removeEventListener(egret.Event.CHANGE, this.syncFrame, this);
		this._wing.removeEventListener(egret.Event.CHANGE, this.syncFrame, this);
		this._mounts.removeEventListener(egret.Event.CHANGE, this.syncFrame, this);

		if (this._playerShadow)
			this._playerShadow.clearCache();
		if (this._title != null)
			this._title.source = '';
		egret.clearTimeout(this.timeID);
		// 清空handle
		if (this._infoModel && this.team == Team.My) {
			this._infoModel.handle = null
		}

	};
	private monstersConfig: any;
	public addBuff(buff) {
		super.addBuff(buff);
		if (this.monstersConfig == null)
			this.monstersConfig = GlobalConfig.monstersConfig;
		var config = buff.effConfig;
		if (GameMap.fubenID == 0) {
			switch (config.type) {
				//召唤
				case SkillEffType.SUMMON:
					let add = 0
					if (this.infoModel && this.infoModel.job == JobConst.DaoShi && this.infoModel.skillBreakData[4]) {
						let lv = this.infoModel.skillBreakData[4]
						let config = GlobalConfig.ins("SkillsBreakConf")[35000 + lv]
						if (config) {
							add = config.args[0].vals[2]
						}
					}
					buff.monsterList = [];
					var monsters = EntityManager.ins().randomGetMonster();
					if (config.args.a.length > 1) {
						for (var i: number = 0; i < config.args.a.length; i++) {
							var m = MonstersConfig.createModel(this.monstersConfig[config.args.a[i] + add]);

							if (i == 0) {
								m.x = monsters.x;
								m.y = monsters.y;
							}
							else if (i == 1) {
								m.x = monsters.x - 64;
								m.y = monsters.y + 64;
							}
							else if (i == 2) {
								m.x = monsters.x + 64;
								m.y = monsters.y + 64;
							}

							m.masterHandle = this.infoModel.handle;
							m.handle = config.args.a[i] + i;
							m.setAtt(AttributeType.atMoveSpeed, 0);
							GameLogic.ins().createEntityByModel(m, true);
							m.summonSkillId = config.args.e[i][0];
							buff.monsterList.push(m.handle);
						}
						egret.setTimeout(this.removeBuff, this, buff.endTime - buff.addTime, buff);
					}
					else {
						var m = MonstersConfig.createModel(this.monstersConfig[config.args.a + add]);
						m.x = this.x;
						m.y = this.y;
						m.masterHandle = this.infoModel.handle;
						GameLogic.ins().createEntityByModel(m, true);
					}
					break;
				case SkillEffType.SUDDEN_MOVE://闪现
					this.shanxianIdx = egret.setTimeout(this.buffShanxian, this, buff.effConfig.args.s, buff);
					break;
			}

		}
	};

	private shanxianIdx: number;
	private buffShanxian(buff): void {
		egret.clearTimeout(this.shanxianIdx);
		var size = GameMap.CELL_SIZE;
		var sx: number = this.x;
		var sy: number = this.y;
		var tx: number = Math.floor((sx - buff.effConfig.args.c) / size);
		var ty: number = Math.floor((sy - buff.effConfig.args.c) / size);
		var b: boolean = GameMap.checkWalkable(tx, ty);
		while (!b) {//如果到边缘的，随机一个坐标点
			tx = Math.floor((sx - MathUtils.limit(buff.effConfig.args.c, Math.abs(buff.effConfig.args.c))) / size);
			ty = Math.floor((sy - MathUtils.limit(buff.effConfig.args.c, Math.abs(buff.effConfig.args.c))) / size);
			b = GameMap.checkWalkable(tx, ty);
		}
		if (b) {
			this.x = tx * size;
			this.y = ty * size;
		}
	}


	/** 移除buff*/
	public removeBuff(buff) {
		super.removeBuff(buff);
		var config = buff.effConfig;
		switch (config.type) {
			case SkillEffType.SUMMON:
				if (buff.monsterList != null) {
					for (var i: number = 0; i < buff.monsterList.length; i++) {
						var rsp: Sproto.remove_entity_request = new Sproto.remove_entity_request;
						rsp.handle = buff.monsterList[i]
						GameLogic.ins().doRemoveEntity(rsp);
					}

					buff.monsterList = null;
				}
				break;
		}
	}
	/**
	 * 更新称号
	 */
	public updateTitle() {
		var title = this.infoModel.title;
		if (this._title) {
			this._title.source = ""
		}
		if (this._titleMc && this._titleMc.parent) {
			this.removeChild(this._titleMc)
		}
		if (title > 0) {
			let cfg = GlobalConfig.ins("TitleConf")[title]
			let titleResName = cfg ? cfg.img : ""
			if (Title.IsEffName(titleResName)) {
				if (this._titleMc == null) {
					this._titleMc = new MovieClip
					this._titleMc.x = 0
					this._titleMc.y = GameLogic.ins().actorModel.guildID ? -135 : -120
					this._titleMc.scaleX = this._titleMc.scaleY = .5
				}
				// if (cfg.Id == 7) {
				// 	this._titleMc.scaleX = this._titleMc.scaleY = 0.6
				// } else if (cfg.Id == 16) {
				// 	this._titleMc.scaleX = this._titleMc.scaleY = 0.8
				// } else {
				// 	this._titleMc.scaleX = this._titleMc.scaleY = 1
				// }
				this._titleMc.loadUrl(ResDataPath.GetUIEffePath(titleResName), true, -1)
				this.addChild(this._titleMc)
			} else {
				if (this._title == null) {
					this._title = new eui.Image;
					this._title.anchorOffsetX = 230 >> 1;
					this._title.anchorOffsetY = 215;
					this._title.y = 30;
					this.addChild(this._title);
				}
				this._title.source = GlobalConfig.ins("TitleConf")[title].img;
			}
		}
		// else if (this._title) {
		// 	this._title.source = '';
		//     if (this._titleMc) {
		// 		this.removeChild(this._titleMc)
		// 	}
		// }
	};

	get infoModel(): Role {
		return <Role>this._infoModel;
	}
	set infoModel(model: Role) {
		this._infoModel = model;
		if (model == null) return;
		if (this._infoModel.type != EntityType.Role)
			return;
		if (GameMap.fubenID == 0 && model.getAtt(AttributeType.atRegeneration))
			this.timeID = egret.setTimeout(this.autoAddBlood, this, 1000);
		if (model.team == Team.My) {
			// DisplayUtils.removeFromParent(this._shadow);
			// this._playerShadow = new MovieClip();
			// this._bodyContainer.addChild(this._playerShadow);
			// this._disOrder[CharMcOrder.SHOWDOW] = this._playerShadow;
			// var sex = SubRoles.ins().getSubRoleByIndex(0).sex;
			// this.loadFile(this._playerShadow, "");
		}
		this.charMonsterBlood.m_NeiGongBlood.maximum = model.getAtt(AttributeType.atMaxShield);
		this.charMonsterBlood.m_NeiGongBlood.value = model.getAtt(AttributeType.atShield);

		this.charMonsterBlood.m_MpBlood.maximum = model.getAtt(AttributeType.atMaxMp);
		this.charMonsterBlood.m_MpBlood.value = model.getAtt(AttributeType.atMp);
		//egret.log(model.getAtt(AttributeType.atMaxShield),model.getAtt(AttributeType.atShield));
	}
	public autoAddBlood() {
		if (this.action == EntityAction.DIE) {
			egret.clearTimeout(this.timeID);
			return;
		}
		egret.clearTimeout(this.timeID);
		if (this.getHP() < this._infoModel.getAtt(AttributeType.atMaxHp)) {
			var value = -this._infoModel.getAtt(AttributeType.atRegeneration);
			//显示对象血条扣血

			this.hram(value);
			this.infoModel.setAtt(AttributeType.atHp, this.infoModel.getAtt(AttributeType.atHp) - value);
			//飘血
			GameLogic.ins().postEntityHpChange(this, null, DamageTypes.HIT, value);
			this.timeID = egret.setTimeout(this.autoAddBlood, this, 1000);
		}
	};

	protected GetBodyAssetPath() {
		return "body"
	}

	/**不同方向的身体显示对象显示顺序 */
	public static FRAME_ODER = [
		[CharMcOrder.SHOWDOW, CharMcOrder.BODY, CharMcOrder.WEAPON, CharMcOrder.WING],
		[CharMcOrder.SHOWDOW, CharMcOrder.BODY, CharMcOrder.WEAPON, CharMcOrder.WING],
		[CharMcOrder.SHOWDOW, CharMcOrder.BODY, CharMcOrder.WING, CharMcOrder.WEAPON],
		[CharMcOrder.SHOWDOW, CharMcOrder.WING, CharMcOrder.BODY, CharMcOrder.WEAPON],/**3 5 方向翅膀改在衣服下面 */
		[CharMcOrder.SHOWDOW, CharMcOrder.WING, CharMcOrder.BODY, CharMcOrder.WEAPON],
		[CharMcOrder.SHOWDOW, CharMcOrder.WING, CharMcOrder.BODY, CharMcOrder.WEAPON],/**3 5 方向翅膀改在衣服下面 */
		[CharMcOrder.SHOWDOW, CharMcOrder.BODY, CharMcOrder.WING, CharMcOrder.WEAPON],
		[CharMcOrder.SHOWDOW, CharMcOrder.BODY, CharMcOrder.WEAPON, CharMcOrder.WING]
	];



	protected showBloodTime() {
		if (this.charMonsterBlood) {
			this.charMonsterBlood.m_HpBlood.visible = true;
			this.charMonsterBlood.m_ElemtImg.visible = true;
			if (this.infoModel && this.infoModel.roleID == 0) {
				this.charMonsterBlood.m_Name.visible = true;
			} else {
				if (this.infoModel && this.infoModel.team !== Team.PASSERBY)
					this.charMonsterBlood.m_Name.visible = false;
			}
			if (this.charMonsterBlood.m_MpBlood)
				// this.charMonsterBlood.m_MpBlood.visible = true;/**注释掉mp */
				if (this.charMonsterBlood.m_NeiGongBlood && this.charMonsterBlood.m_NeiGongBlood.value > 0)
					this.charMonsterBlood.m_NeiGongBlood.visible = true;
		}
	}
	protected hideBloodTime() {
		if (this.infoModel && this.infoModel.roleID != 0) {
			this.charMonsterBlood.m_HpBlood.visible = false;
			this.charMonsterBlood.m_ElemtImg.visible = false;
			if (this.infoModel.team !== Team.PASSERBY)
				this.charMonsterBlood.m_Name.visible = false;
			if (this.charMonsterBlood.m_MpBlood)
				this.charMonsterBlood.m_MpBlood.visible = false;
			if (this.charMonsterBlood.m_NeiGongBlood)
				this.charMonsterBlood.m_NeiGongBlood.visible = false;
		}
	}

	// private static EL_LIST = null
	// private static EL_LEN = 0

	// private static GetEllipseLine(): any[] {
	// 	if (this.EL_LIST == null) {
	// 		let width = 25
	// 		let part = 5
	// 		var func = function(x) {
	// 			let l2 = 17
	// 			let y = Math.sqrt((1 - x * x / (width * width)) * l2 * l2)
	// 			return y
	// 		}

	// 		let list = []
	// 		let list2 = []
	// 		let detal = width / part
	// 		for (let i = 0, len = part * 2; i <= len; ++i) {
	// 			let x = -1 * width + i * detal
	// 			let y = func(x)
	// 			list.push({x: x, y: y})
	// 			if (i != 0 && i != len) {
	// 				list2.push({x: x, y: -y})
	// 			}
	// 		}
	// 		let tempList = list.concat(list2.reverse()) 
	// 		tempList.push({x: -1 * width, y: func(-1 * width)})
	// 		this.EL_LIST = tempList
	// 		let preData = null
	// 		let dstLen = 0
	// 		for (let data of this.EL_LIST) {
	// 			if (preData) {
	// 				let x1 = data.x - preData.x
	// 				let y1 = data.y - preData.y
	// 				data.dst = Math.sqrt(x1 * x1 + y1 * y1)
	// 			} else {
	// 				data.dst = 0
	// 			}
	// 			preData = data
	// 			dstLen += data.dst
	// 		}
	// 		this.EL_LEN = dstLen
	// 	}
	// 	return this.EL_LIST
	// }

}
window["CharRole"] = CharRole