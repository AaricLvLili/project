class RoleShowPanel extends eui.Component implements eui.UIComponent {

	private wingImg: eui.Image
	private bodyImg: eui.Image
	private weaponImg: eui.Image

	private wingDress: boolean
	private bodyDress: boolean
	private weaponDress: boolean

	private m_WingClip: MovieClip
	private m_BodyClip: MovieClip
	private m_WeaponClip: MovieClip

	private m_Weapon: string;
	private zhuangBanId: any;


	private EquipConfig: any;

	private m_Eff: MovieClip;
	public m_AnimGroup: eui.Group;
	private charRole: CharRole;

	public m_ElementImg: eui.Image;


	public createChildren() {
		super.createChildren();
		this.skinName = "RoleShowPanelSkin"
	}


	public SetWeapon(value: number | string, dress: boolean = false, mc = false): void {
		this.weaponDress = mc;
		if (this.zhuangBanId == null) {
			this.zhuangBanId = GlobalConfig.ins("ZhuangBanId");
		}
		if (value) {

			if (this.EquipConfig == null)
				this.EquipConfig = GlobalConfig.equipConfig;
			let config = dress ? this.zhuangBanId[value] : this.EquipConfig[value]
			if (config) {
				this.m_Weapon = dress ? config.res : config.appearance
			} else {
				this.m_Weapon = value as string
			}
		} else {
			this.m_Weapon = null
		}
		this._Update()
	}

	private m_Body: string


	public SetBody(value: number | string, sex: number = null, dress: boolean = false, mc = false): void {
		this.bodyDress = mc;
		if (this.zhuangBanId == null) {
			this.zhuangBanId = GlobalConfig.ins("ZhuangBanId");
		}
		if (value != null) {
			if (typeof (value) == "number") {
				if (this.EquipConfig == null)
					this.EquipConfig = GlobalConfig.equipConfig;
				let config = dress ? this.zhuangBanId[value] : this.EquipConfig[value]
				if (config) {
					this.m_Body = (dress ? config.res : config.appearance) + "_" + sex
				} else {
					this.m_Body = "body000" + "_" + sex
				}
			} else {
				this.m_Body = value as string + (sex != null ? "_" + sex : "")
			}
		} else {
			this.m_Body = null
		}
		this._Update()
	}

	private m_Wing: string

	public SetWing(value: number | string, dress: boolean = false, mc = false): void {
		this.wingDress = mc;
		if (this.zhuangBanId == null) {
			this.zhuangBanId = GlobalConfig.ins("ZhuangBanId");
		}
		if (value != null) {
			let config = dress ? this.zhuangBanId[value] : GlobalConfig.wingLevelConfig[value]
			if (config) {
				this.m_Wing = (dress ? config.res : config.appearance)
			} else {
				this.m_Wing = value as string
			}
		} else {
			this.m_Wing = null
		}
		this._Update()
	}

	private _AddChild(target) {
		target.x = this.width * 0.5
		target.y = this.height / 2 - 15
		this.addChild(target)

	}

	private _Update() {
		if (!this.$stage) {
			return
		}
		if (this.wingDress) {
			let clip = this.m_WingClip
			if (!clip) {
				clip = this.m_WingClip = new MovieClip
				this._AddChild(clip)
			}
			clip.loadUrl(this.m_Wing, true, -1)
		} else {
			this.wingImg.source = this.m_Wing ? this.m_Wing + "_png" : ""
		}

		if (this.bodyDress) {
			let clip = this.m_BodyClip
			if (!clip) {
				clip = this.m_BodyClip = new MovieClip
				this._AddChild(clip)
			}
			clip.loadUrl(this.m_Body, true, -1)
		} else {
			this.bodyImg.source = this.m_Body ? this.m_Body + "_c_png" : ""
		}

		if (this.weaponDress) {
			let clip = this.m_WeaponClip
			if (!clip) {
				clip = this.m_WeaponClip = new MovieClip
				this._AddChild(clip)
			}
			clip.loadUrl(this.m_Weapon, true, -1)
		} else {
			this.weaponImg.source = this.m_Weapon ? this.m_Weapon + "_c_png" : ""
		}
	}

	public Set(type: DressType, target: Role | SubRole) {
		let data: SubRole
		if (egret.is(target, "Role")) {
			data = (target as Role).GetSubRoleData()
		} else {
			data = target as any
		}

		if (type == DressType.ARM) {
			if (data == null) {
				this.SetWeapon(null)
				return
			}
			if (data.legendDress != null) {
				this.SetWeapon(GlobalConfig.ins("LegendSuitConfig")[data.legendDress + 1].weapon)
			} else {
				let resId = data.zhuangbei ? data.zhuangbei[1] : 0
				if (resId > 0) {
					this.SetWeapon(resId, true)
				} else {
					if (data.swordID != 0) {
						this.SetWeapon(data.swordID)
					} else {
						this.SetWeapon(null)
					}
				}
			}
		} else if (type == DressType.ROLE) {
			if (data == null) {
				this.SetBody(null)
				return
			}
			if (data.legendDress != null) {
				this.SetBody(GlobalConfig.ins("LegendSuitConfig")[data.legendDress + 1].body, data.sex)
			} else {
				let resId = data.zhuangbei ? data.zhuangbei[0] : 0
				if (resId > 0) {
					this.SetBody(resId, data.sex, true)
				} else {
					if (data.clothID != 0) {
						this.SetBody(data.clothID, data.sex)
					} else {
						this.SetBody(0, data.sex)
					}
				}
			}
		} else if (type == DressType.WING) {
			if (data == null) {
				this.SetWing(null)
				return
			}
			let id = data.zhuangbei ? data.zhuangbei[2] : 0
			if (id > 0) {
				this.SetWing(id, true)
			} else {
				if (data.wingLevel != null) {
					this.SetWing(data.wingLevel)
				} else {
					this.SetWing(null)
				}
			}
		} else {
			console.log("roleshowpanel not type " + type)
		}

	}

	public OffsetBody(offset: number): void {
		this.m_BodyClip.y += offset
	}

	public OffsetWeapon(offset: number): void {
		this.m_WeaponClip.y += offset
	}

	public OffsetWing(offsetX, offsetY: number): void {
		this.m_WingClip.y += offsetY
		this.m_WingClip.x += offsetX
	}

	public constructor() {
		super();
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}


	protected childrenCreated(): void {
		super.childrenCreated();
		this._Update()
	}

	public creatAnim(role: Role | SubRole) {
		/**特殊要求用动态图 */
		if (role instanceof Role) {
			this.initRoleData(role);
		} else {
			this.initSubRoleData(role);
		}
		this.addTime();
	}

	private initSubRoleData(role: SubRole) {
		this.release();
		this.wingImg.visible = false;
		this.bodyImg.visible = false;
		this.weaponImg.visible = false;
		var infoModel = new Role();
		infoModel.zhuangbei = role.zhuangbei;
		infoModel.wingsData = new WingsData();
		infoModel.wingsData.lv = role.wingLevel;
		infoModel.wingsData.showLv = role.wingShowLevel;
		infoModel.wingsData.openStatus = role.wingOpenStatus;
		infoModel.equipsData = new Array<EquipsData>();
		let equipsData = new EquipsData();
		infoModel.equipsData.push(equipsData);
		let equipsData2 = new EquipsData();
		infoModel.equipsData.push(null);
		infoModel.equipsData.push(equipsData2);
		equipsData.item.configID = role.swordID;
		equipsData2.item.configID = role.clothID;
		infoModel.mountsLevel = role.mountLv;
		infoModel.mountsShowLv = role.moubtShowLv;
		infoModel.sex = role.sex;
		infoModel.job = role.job;
		infoModel.zhuanzhiLv = role.zhuanzhiLv;
		this.m_ElementImg.source = ResDataPath.GetElementImgName(role.mainEle);
		if (!this.charRole) {
			this.charRole = ObjectPool.ins().pop("CharRole");
		}
		this.charRole.infoModel = infoModel;
		this.charRole.dir = 3;
		this.charRole.updateModel();
		this.charRole.playAction(EntityAction.ATTACK);
		if (this.charRole._state == EntityAction.ATTACK) {
			this.charRole._body.removeEventListener(egret.Event.COMPLETE, this.onChangeState, this);
			this.charRole._body.addEventListener(egret.Event.COMPLETE, this.onChangeState, this);
		}
		this.m_AnimGroup.addChild(this.charRole);
		this.charRole.x = this.m_AnimGroup.width / 2;
		this.charRole.y = this.m_AnimGroup.height / 2;
		this.charRole.hideHpComp();
		this.charRole._body.alpha = 1;
		this.charRole._body.visible = true;
		if (this.charRole._titleMc) {
			this.charRole._titleMc.visible = false;
		}
	}

	private initRoleData(role: Role) {
		this.release();
		this.charRole;
		this.wingImg.visible = false;
		this.bodyImg.visible = false;
		this.weaponImg.visible = false;
		var infoModel = new Role();
		let zhuangbeiData = [];
		infoModel.bianShen = role.bianShen;
		for (var i = 0; i < role.zhuangbei.length; i++) {
			zhuangbeiData.push(role.zhuangbei[i]);
		}
		infoModel.zhuangbei = zhuangbeiData;
		let equipsData = [];
		for (var i = 0; i < role.equipsData.length; i++) {
			let equipData = new EquipsData();
			equipData.item.configID = role.equipsData[i].item.configID;
			equipsData.push(equipData);
		}
		infoModel.equipsData = equipsData;
		let wingsData = new WingsData();
		wingsData.lv = role.wingsData.lv;
		wingsData.showLv = role.wingsData.showLv;
		wingsData.openStatus = role.wingsData.openStatus;
		infoModel.wingsData = wingsData;
		infoModel.mountsLevel = role.mountsLevel;
		infoModel.mountsShowLv = role.mountsShowLv;
		infoModel.sex = role.sex;
		infoModel.job = role.job;
		infoModel.attrElementMianType = role.attrElementMianType;
		infoModel.zhuanzhiLv = role.zhuanzhiLv;
		this.m_ElementImg.source = ResDataPath.GetElementImgName(infoModel.attrElementMianType);
		if (!this.charRole) {
			this.charRole = ObjectPool.ins().pop("CharRole");
		}
		this.charRole.infoModel = infoModel;
		this.charRole.dir = 3;
		this.charRole.updateModel();
		this.charRole.playAction(EntityAction.ATTACK);
		if (this.charRole._state == EntityAction.ATTACK) {
			this.charRole._body.removeEventListener(egret.Event.COMPLETE, this.onChangeState, this);
			this.charRole._body.addEventListener(egret.Event.COMPLETE, this.onChangeState, this);
		}
		this.m_AnimGroup.addChild(this.charRole);
		this.charRole.x = this.m_AnimGroup.width / 2;
		this.charRole.y = this.m_AnimGroup.height / 2;
		this.charRole.hideHpComp();
		this.charRole._body.alpha = 1;
		this.charRole._body.visible = true;
		if (this.charRole._titleMc) {
			this.charRole._titleMc.visible = false;
		}
	}

	private clearRole() {
		if (this.charRole) {
			if (this.charRole._titleMc) {
				this.charRole._titleMc.visible = true;
			}
			if (this.charRole._body) {
				this.charRole._body.removeEventListener(egret.Event.COMPLETE, this.onChangeState, this);
			}
			this.charRole.scaleX = 1;
			this.charRole.scaleY = 1;
			this.charRole.hideHpComp(true);
			DisplayUtils.dispose(this.charRole);
			this.charRole._infoModel = null;
			this.charRole = null;
		}
	}

	public setCharRoleWing(id: number, lv: number) {
		this.charRole.infoModel.zhuangbei[2] = id;
		this.charRole.infoModel.wingsData.lv = lv;
		this.charRole.infoModel.wingsData.showLv = lv;
		this.charRole.updateModel();
	}

	public setCharRoleBody(id: number, isBanShen: Boolean = false) {
		if (isBanShen == false) {
			this.charRole.infoModel.bianShen = 0;
		}
		this.charRole.infoModel.zhuangbei[0] = id;
		this.charRole.updateModel();
	}

	public setCharRoleWeapon(id: number) {
		this.charRole.infoModel.zhuangbei[1] = id;
		this.charRole.updateModel();
	}

	public setCharRoleMount(id: number) {
		this.charRole.infoModel.zhuangbei[3] = id;
		this.charRole.updateModel();
	}
	public setCharRoleMountLv(lv: number) {
		this.charRole.infoModel.mountsLevel = lv;
		this.charRole.infoModel.mountsShowLv = lv;
		this.charRole.updateModel();
	}

	public setCharRoleTao(id: number) {
		this.charRole.infoModel.zhuangbei[4] = id;
		this.charRole.updateModel();
	}

	public setCharRoleTitle(id: number) {
		this.charRole.infoModel.title = id
		this.charRole.updateModel();
		if (this.charRole._titleMc) {
			this.charRole._titleMc.y = -80;
			this.charRole._titleMc.x = -20;
		}
	}

	public setCharSexJob(sex, job, bodyId, weaponId, mountId, wingImg = null): void {
		this.charRole.infoModel.sex = sex
		this.charRole.infoModel.job = job
		this.charRole.initBody(ResDataPath.GetBodyName01(bodyId, sex))
		this.charRole.setWeaponFileName(ResDataPath.GetWeaponName01(weaponId, sex))
		this.charRole.setmountsFileName(mountId)
		if (wingImg) this.charRole.setWingFileName(wingImg)
		this.m_ElementImg.source = ''
	}
	private onChangeState() {
		this.charRole._body.removeEventListener(egret.Event.COMPLETE, this.onChangeState, this);
		this.charRole.playAction(EntityAction.STAND);
	}

	public addTime() {
		TimerManager.ins().removeAll(this);
		TimerManager.ins().doTimer(500, 10, function () {
			if (this.charRole && this.charRole._body && this.charRole._body.visible == false) {
				this.charRole._body.visible = true;
				this.charRole.playAction(EntityAction.STAND);
			}
		}, this)
	}



	public release() {
		TimerManager.ins().removeAll(this);
		this.clearRole();
	}




}
window["RoleShowPanel"] = RoleShowPanel