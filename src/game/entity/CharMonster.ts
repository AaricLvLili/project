/**
 *  怪物类
 * @author
 */
class CharMonster extends egret.DisplayObjectContainer {

	AI_STATE = 0;
	/** 方向（默认向下） */
	_dir = 3;
	/** 状态（默认stand） */
	_state = EntityAction.STAND;
	publicCD = 0;
	/**攻击硬直时间(攻击间隔 攻速) */
	atkHardTime = 0;
	/**是否处于连击状态 */
	public atk2: boolean = false;
	/** 攻击动作是否只播一次 */
	atkOne = true;

	buffList = {};
	buffEff = {};
	damageOverTimeList = {};
	damageOverTimeValueList = {};
	effs = {};
	// _bodyContainer: egret.DisplayObjectContainer;
	protected _bodyContainer: egret.DisplayObjectContainer;
	_shadow: eui.Image;
	_body: MovieClip;
	protected charMonsterBlood: CharMonsterBlood;

	_infoModel: EntityModel;

	notRemove: boolean;
	atking: boolean;
	isHardStraight: boolean;
	_fileName: string;

	aa: egret.ColorMatrixFilter
	/** 记录延迟buff索引*/
	private buffDelay: number;
	moveTween: egret.Tween
	/** 记录瞬移前的坐标点*/
	public upPoin: egret.Point = new egret.Point();
	/** 这个状态内不能增加子弹buff，会导致一直播放子弹*/
	public isZidanClear: boolean;

	public changeFileName: string;
	/**是否触发随机技能>=0表示有触发 数值代表触发类型 */
	// public randomSkillType: number = -1;

	public saveHp: number = 123123;
	public substituteImg: eui.Image;
	public constructor() {
		super();

		this.touchEnabled = false;
		this.touchChildren = false;
		this._bodyContainer = new egret.DisplayObjectContainer();
		this.addChild(this._bodyContainer);
		// this._bodyContainer.touchEnabled = this.touchChildren = false;
		this._shadow = new eui.Image;
		this._shadow.source = ResDataPath.GetAssets("movie/yingzi");
		this._shadow.anchorOffsetX = 57 >> 1;
		this._shadow.anchorOffsetY = 37 >> 1;
		this._bodyContainer.addChild(this._shadow);
		this.substituteImg = new eui.Image();
		this.substituteImg.source = "comp_roleshadow_png";
		this.substituteImg.anchorOffsetX = 42 / 2;
		this.substituteImg.anchorOffsetY = 89 / 2;
		this._bodyContainer.addChild(this.substituteImg);
		this._body = new MovieClip();
		this._bodyContainer.addChild(this._body);
		// this._body.addEventListener(egret.Event.CHANGE, this.playBody, this);
		this.charMonsterBlood = new CharMonsterBlood();
		this.charMonsterBlood.currentState = "state2";
		this.charMonsterBlood.anchorOffsetX = this.charMonsterBlood.width / 2;
		this.charMonsterBlood.anchorOffsetY = this.charMonsterBlood.height / 2;
		this.charMonsterBlood.y = -52;
		this.charMonsterBlood.x = 0;
		this.charMonsterBlood.initData();
		this.addChild(this.charMonsterBlood);
		this.setScale(1);
		this.hideBloodTime();
		this._body.addEventListener(egret.Event.COMPLETE, this.playStandAction, this);
		this._body.addEventListener(egret.Event.CHANGE, this.playBody, this);

	}

	public get handle(): number {
		if (this._infoModel) {
			return this._infoModel.handle
		}
		return -99
	}

	public get infoModel() {
		return this._infoModel;
	}
	public set infoModel(model) {
		this._infoModel = model;
	}
	public setCharName(str) {
		// this.charMonsterBlood.m_Name.visible = true;
		this.charMonsterBlood.m_Name.textFlow = TextFlowMaker.generateTextFlow(str);
	};
	public showCharName(isShow) {
		this.charMonsterBlood.m_Name.visible = isShow;
	};
	public setElementImg(type: ElementType) {
		let name = ResDataPath.GetElementImgName(type);
		this.charMonsterBlood.m_ElemtImg.source = name;
	}
	public hideBlood(isShow: boolean = false) {
		this.charMonsterBlood.m_HpBlood.visible = isShow;
	};

	public hideHpComp(isShow: boolean = false) {
		this.charMonsterBlood.visible = isShow;
	}
    /**
     * 播放动作
     * @action	动作常量EntityAction.ts
     */
	public playAction(action) {
		if (action == null || action.length == 0) {
			return
		}
		if (this._state == action && !this.isAtkAction())
			return;
		this._state = action;
		this.loadBody();
	};

	private playStandAction() {
		this.playAction(EntityAction.STAND);
	}
	public stopMove() {
		//停止移动
		if (this.moveTween) {
			this.moveTween.pause()
			let tweens: egret.Tween[] = (egret.Tween as any)._tweens;
			for (let i = tweens.length - 1; i >= 0; i--) {
				let tween: any = tweens[i]
				if (tween._target == this && tween == this.moveTween) {
					tween.paused = true
					tweens.splice(i, 1);
					break
				}
			}
			this.moveTween = null
		}
	};
	public get dir() {
		return this._dir;
		// var r = DirUtil.get2Dir(this._dir);
		// return r;
	}
	public set dir(value) {
		// if(value == 0 || value == 4) return ;

		if (this._dir == value)
			return;
		this._dir = value;
		this.loadBody();
	}
	public get action() {
		return this._state;
	}
	/** 慎用（一般使用playAction） */
	public set action(value) {
		this._state = value;
	}
	public get moveSpeed() {
		if (!this.infoModel)
			return 0;
		return this.infoModel.getAtt(AttributeType.atMoveSpeed) / 1000 * GameMap.CELL_SIZE;
	}
	public hram(value) {
		this.charMonsterBlood.m_HpBlood.value = this.charMonsterBlood.m_HpBlood.value - value;

		if (this.infoModel.inRoleId == 0) {
			this.showBloodTime();
		} else {
			if (this.saveHp != this.charMonsterBlood.m_HpBlood.value) {
				this.saveHp = this.charMonsterBlood.m_HpBlood.value;
				this.showBloodTime();
				this.setBloodTime();
			}
		}

	};

	protected setBloodTime() {
		TimerManager.ins().remove(this.hideBloodTime, this);
		TimerManager.ins().doTimer(1000, 1, this.hideBloodTime, this);
	}
	protected showBloodTime() {
		this.charMonsterBlood.m_HpBlood.visible = true;
		this.charMonsterBlood.m_ElemtImg.visible = true;
		if (this.infoModel.inRoleId == 0) {
			this.charMonsterBlood.m_Name.visible = true;
		} else {
			this.charMonsterBlood.m_Name.visible = false;
		}
	}
	protected hideBloodTime() {
		if (this.infoModel && this.infoModel.inRoleId != 0) {
			this.charMonsterBlood.m_HpBlood.visible = false;
			this.charMonsterBlood.m_ElemtImg.visible = false;
			this.charMonsterBlood.m_Name.visible = false;
			this.charMonsterBlood.m_MpBlood.visible = false;
			this.charMonsterBlood.m_NeiGongBlood.visible = false;
		}
	}
	public getHP() {
		return this.infoModel.getAtt(AttributeType.atHp);
		// return this.charMonsterBlood.m_HpBlood.value;
	};
	public reset() {
		this.visible = true
		this.alpha = 1
		this._state = EntityAction.STAND;
		// this.initBody(this._fileName);
		this.dir = 4;
		this.charMonsterBlood.m_HpBlood.slideDuration = 500;
	};
	public destruct(isRemove: boolean = false) {
		this.m_LoadResFoce = true

		this._dir = 0;
		this.AI_STATE = AI_State.Stand;
		this.alpha = 1;
		this.charMonsterBlood.initData();
		this.isMy(false);
		this._body.stop();
		this._body.clearCache();

		// this.infoModel = null;
		this.stopMove();
		egret.Tween.removeTweens(this)
		this.removeHardStraight();
		for (var i in this.damageOverTimeList) {
			var element = this.damageOverTimeList[i];
			this.deleteDamageOverTimer(element);
		}
		this.removeAllBuff();
		this.notRemove = false;
		this._body.filters = [];
		this.charMonsterBlood.m_Name.visible = false;
		this.charMonsterBlood.m_ElemtImg.visible = false;
		this.atking = false;
		this.charMonsterBlood.m_ElemtImg.visible = false;
		// DisplayUtils.removeFromParent(this);

		TimerManager.ins().removeAll(this);

		this._bodyContainer.alpha = 1;
		this.deleteFootRingContainer()
		this._bodyContainer.scaleX = this._bodyContainer.scaleY = 1;
		ObjectPool.ins().push(this);
	};

	/** 设置硬直时间 */
	public addHardStraight(time) {
		this.isHardStraight = true;
		TimerManager.ins().doTimer(time, 1, this.removeHardStraight, this);
	};
	public removeHardStraight() {
		this.isHardStraight = false;
	};

	public m_LoadResFoce = true

    /**
     * 设置主体动画
     * @param str 文件名
     */
	public initBody(fileName) {
		this._fileName = fileName;
		this.changeFileName = fileName;
		this.loadBody();

	};
	public loadBody() {
		// this._body.addEventListener(egret.Event.CHANGE, this.playBody, this);
		this.loadFile(this._body, this.GetBodyAssetPath(), this._fileName);
	};

	public loadFile(mc: MovieClip, typeString: string, fileName: string, state?: EntityAction) {
		// //计算超过5方向后的方向
		// var td = 2 * (this._dir - 4);
		// if (td < 0)
		// 	td = 0;
		// mc.scaleX = td ? -1 : 1;
		// var s = fileName + "_" + (this._dir - td) + (state ? state : this._state);
		// // if ((this.m_LoadResFoce || this.parent) && this._state != EntityAction.DIE && this._fileName)
		// // 	mc.loadUrl(ResDataPath.GetMoviePath(s, typeString));
		// if (this._state != EntityAction.DIE && this._fileName)
		// 	mc.loadUrl(ResDataPath.GetMoviePath(s, typeString));
		//资源2方向处理zy
		if (this._dir == 0 || this.dir == 4)
			mc.scaleX = this.recordScaleX;
		else if (this._dir > 4)
			mc.scaleX = -1;
		else
			mc.scaleX = 1;
		this.recordScaleX = mc.scaleX;

		let dirStr = this.dirArr[this._dir];
		var s = fileName + "_" + dirStr + (state ? state : this._state);
		// if (this._state != EntityAction.DIE && this._fileName)
		// 	mc.loadUrl(ResDataPath.GetMoviePath(s, typeString));
		if (this._state != EntityAction.DIE && this._fileName){
			var str: string = ResDataPath.GetMoviePath(s, typeString);
			mc.loadUrl(str);
			var sArr = fileName.split("_")
			if (str.indexOf("monster") >= 0) {
				ResMgr.ins().saveMonster(str, sArr[0]);
			}
			else{
				if(str.indexOf("body")>=0){
					ResMgr.ins().saveRole(str,sArr[0]);
				}
				else if(str.indexOf("wing")>=0){
					ResMgr.ins().saveWing(str,sArr[0]);
				}
				else if(str.indexOf("weapon")>=0){
					ResMgr.ins().saveWeapon(str,sArr[0]);
				}
			}
		}
			
	};
	private dirArr = [1, 1, 3, 3, 3, 3, 3, 1];
	private recordScaleX = 1;

	protected GetBodyAssetPath() {
		return "monster"
	}

	public get isPlaying() {
		return this._body.isPlaying;
	}
	public isAtkAction() {
		return this._state == EntityAction.ATTACK || this._state == EntityAction.CAST;
	};
    /* private resetStand():void {
     this.AI_STATE = AI_State.Stand;
     this.atking = false;
     this.stopFrame(1);
     }*/
	public stopFrame(f) {
		//this._body.gotoAndStop(f);
		if (this._state == EntityAction.STAND) return;
		this.loadFile(this._body, this.GetBodyAssetPath(), this._fileName, EntityAction.STAND);
	};
	public playBody(e) {
		// this._body.removeEventListener(egret.Event.CHANGE, this.playBody, this);
		this.substituteImg.visible = false;
		var firstFrame = 1; //(this instanceof CharRole) && this.isAtkAction() ? 2 : 1;
		if (this._body.movieClipData.frames && this._body.movieClipData.frames.length > 0)
			this._body.gotoAndPlay(firstFrame, this.atkOne && this.isAtkAction() ? 1 : -1);
		else
			this._body.play(-1);
	};
	public resetStand() {
		this.atking = false;
		this.playAction(EntityAction.STAND);
	};
    /**
     * 更新数据显示
     */
	public updateBlood(force: boolean = false) {
		if (!this.infoModel)
			return;
		this.charMonsterBlood.m_HpBlood.maximum = this.infoModel.getAtt(AttributeType.atMaxHp);
		//只有不再pk战的时候才可以更新当前血量
		if (force || !(EntityManager.ins().getTeamCount(Team.WillEntity) > 0 && GameMap.fubenID == 0))
			this.charMonsterBlood.m_HpBlood.value = this.infoModel.getAtt(AttributeType.atHp);
		if (this._infoModel.inRoleId == 0) {
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
	public get isCanAddBlood() {
		return this.charMonsterBlood.m_HpBlood.value / this.charMonsterBlood.m_HpBlood.maximum < 0.8;
	}
	/** 中毒处理 */
	public poisoning(skillEff, damage, colorMatrix) {
		var timer = this.damageOverTimeList[skillEff.group] || new egret.Timer(0, 0);
		timer.delay = skillEff.interval;
		timer.repeatCount = Math.floor(skillEff.duration / skillEff.interval);
		timer.stop();
		timer.reset();
		// console.log(`受到持续伤害，共伤害${timer.repeatCount}次，每次-${damage}`);`
		timer.addEventListener(egret.TimerEvent.TIMER, this.damageOverTime, this);
		timer.start();
		if (colorMatrix) {
			this.aa = this.aa || new egret.ColorMatrixFilter();
			this.aa.matrix = colorMatrix;
			this._body.filters = [this.aa];
		}
		this.damageOverTimeList[skillEff.group] = timer;
		this.damageOverTimeValueList[timer.hashCode] = damage;
		//this.damageOverTime(timer);
	};
	/** 持续伤害 */
	public damageOverTime(e) {
		var timer = e instanceof egret.Timer ? e : e.currentTarget;
		//AIUtil.ins().hram(this, this, DamageTypes.HIT, this.damageOverTimeValueList[timer.hashCode]);
		if (timer.currentCount == timer.repeatCount) {
			this.deleteDamageOverTimer(timer);
			this._body.filters = [];
		}
	};
	public deleteDamageOverTimer(timer) {
		for (var i in this.damageOverTimeList) {
			if (this.damageOverTimeList[i] == timer) {
				delete this.damageOverTimeList[i];
				timer.stop();
				timer.removeEventListener(egret.TimerEvent.TIMER, this.damageOverTime, this);
			}
		}
	};
	public isMy(value: boolean = true) {
		(<eui.Image>this.charMonsterBlood.m_HpBlood.thumb).source = value ? "boolGreen_png" : "boolRed_png";
	};

	public addEffect(effID: number) {
		var config = GlobalConfig.effectConfig[effID];
		if (!config)
			return;
		if (config.type == 0 || config.type == 1) {
			var image_1 = ObjectPool.ins().pop("eui.Image") as eui.Image
			image_1.scaleX = image_1.scaleY = 1
			image_1.x = image_1.y = 0
			image_1.alpha = 1
			image_1.source = config.fileName;
			this.addChild(image_1);
			egret.Tween.removeTweens(image_1)
			var t = egret.Tween.get(image_1);
			image_1.x = image_1.x - 23;
			if (config.type == 0) {
				t.to({ y: -100 }, 2000).call(() => {
					egret.Tween.removeTweens(image_1);
					DisplayUtils.removeFromParent(image_1);
				});
			} else {
				BloodView.TweenType1(t, 0, -50)
			}
			t.call(function () {
				egret.Tween.removeTweens(image_1);
				DisplayUtils.removeFromParent(image_1);
				ObjectPool.ins().push(image_1)
			})
			return;
		}
		var mc = this.effs[effID] || new MovieClip;
		mc.loadFile(config.fileName, true);
		this.addChild(mc);
		this.effs[effID] = mc;
	};
	public removeEffect(effID) {
		var config = GlobalConfig.effectConfig[effID];
		if (!config)
			return;
		if (config.type == 0)
			return;
		var mc = this.effs[effID];
		if (!mc)
			return;
		DisplayUtils.removeFromParent(mc);
		delete this.effs[effID];
	};
	public hasBuff(groupID) {
		return this.buffList[groupID] ? true : false;
	};

	private buffScale: number;
	public addBuff(buff: EntityBuff, time: number = 0) {
		var config = buff.effConfig;
		if (config == null || config == undefined) return;
		var groupID = config.group;
		if (groupID == Const.zidanBuff) {//身上有子弹buff，不能在添加，否则会导致时间重置

			if (this.buffList[groupID] || this.isZidanClear)
				return;
		}
		if (this.buffList[groupID])
			this.removeBuff(this.buffList[groupID]);
		this.buffList[groupID] = buff;
		//if (GameGlobal.mapModel.fubenID == 0) {
		//    switch (config.type) {
		//        //中毒
		//        case SkillEffType.AdditionalDamage:
		//            //颜色矩阵数组
		//            let colorMatrix = [
		//                1, 0, 0, 0, 0,
		//                0, 1, 0, 0, 100,
		//                0, 0, 1, 0, 0,
		//                0, 0, 0, 1, 0
		//            ];
		//            this.poisoning(config, buff.value, colorMatrix);
		//            break;
		//
		//        case SkillEffType.AddBlood:
		//            this.poisoning(config, buff.value);
		//            break;
		//    }
		//}

		var playNum: number = -1;//播放次数，针对type12，只播放一次
		////开头效果
		if (GameMap.IsNoramlLevel()) {
			this.addEffect(config.id);
		}
		if (config.effName) {
			var mc: MovieClip = this.buffEff[groupID] || new MovieClip;

			// mc.loadFile(config.effName, true);
			mc.loadUrl(ResDataPath.GetSkillPath(config.effName), true);
			if (!this.buffScale) {
				if (SdkMgr.isWxGame()) {
					this.buffScale = GlobalConfig.ins("UniversalConfig").buffRatewx;
				} else {
					this.buffScale = GlobalConfig.ins("UniversalConfig").buffRate;
				}
			}
			mc.scaleX = this.buffScale;
			mc.scaleY = this.buffScale;
			// if (config.effName == "skill302_0") {
			// 	mc.x = this.upPoin.x;
			// 	mc.y = this.upPoin.y;
			// 	if(this.parent) this.parent.addChild(mc);
			// } else
			if (this.parent) this.addChild(mc);
			this.buffEff[groupID] = mc;
		}
		if (config.type == SkillEffType.INVISIBLE) {
			this._bodyContainer.alpha = 0;
		}
		else if (config.type == SkillEffType.GHOST || config.type == SkillEffType.BULLETTIME) {
			// if (config.args.t > 0) {
			// 	this.buffDelay = egret.setTimeout(function () {
			// 		egret.clearTimeout(this.buffDelay);
			// 		var vo: GhostShadow = ObjectPool.pop("GhostShadow");
			// 		vo.start(this);
			// 	}, this, parseInt(config.args.t));
			// }
			// else {
			// 	var vo: GhostShadow = ObjectPool.pop("GhostShadow");
			// 	vo.start(this);
			// }
			if (!DeviceUtils.isIOS()) {
				// TimerManager.ins().doTimer(300, 0, this.startCanYing, this);关闭子弹时间特效
			}
		}
		if (buff.effConfig.id == 100001) {//新增的BOSS，无敌，写死。
			GameGlobal.MessageCenter.dispatch(MessageDef.BOSS_TIME_HUDUN, buff.effConfig.duration);
		}
		//if (config.duration > 0)
		////这里同类buff的话会启动多个计时器，需要在删除的时候判断下是否和之前的buff相同
		//    App.TimerManager.doTimer(time ? time : config.duration, 1, () => {
		//        this.removeBuff(buff)
		//    }, this);
	};

	/** 开启残影效果*/
	private startCanYing(): void {
		var vo: GhostShadow = ObjectPool.ins().pop("GhostShadow");
		vo.start(this);
	}

	public removeBuff(buff) {
		var config = buff.effConfig;
		var groupID = config.group;
		if (this.buffList[groupID] == buff) {
			if (buff.effConfig.type == SkillEffType.GHOST || buff.effConfig.type == SkillEffType.BULLETTIME) {
				TimerManager.ins().remove(this.startCanYing, this);
				if (buff.effConfig.type == SkillEffType.BULLETTIME) {
					this.isZidanClear = true;
					egret.setTimeout(() => {
						this.isZidanClear = false;
					}, this, 5000)
				}
			}

			this._bodyContainer.alpha = 1;
			this.buffList[groupID].source = null;
			ObjectPool.ins().push(this.buffList[groupID]);
			if (this.buffEff[groupID])
				DisplayUtils.dispose(this.buffEff[groupID]);
			this.buffEff[groupID] = null;
			delete this.buffEff[groupID];
			delete this.buffList[groupID];

		}
	};
	public removeAllBuff() {
		for (var i in this.buffList) {
			this.removeBuff(this.buffList[i]);
			this.buffList[i] = null;
		}
		this.buffList = {};
	};
	public get curPlayTime() {
		return this._body.playTime;
	}
	public get team(): Team {
		if (this._infoModel) {
			return this._infoModel.team;
		}
		return Team.NotAtk;
	}

	public get monsterType(): Team {
		if (this._infoModel) {
			return this._infoModel.configType;
		}
		return null;
	}

	public setScale(scale: number): void {
		// this._bodyContainer.scaleX = this._bodyContainer.scaleY = 1;//scale
		// this.scaleX = this.scaleY = .8;
	}

	public get getBodyCon(): egret.DisplayObjectContainer {
		return this._bodyContainer;
	}

	private footRingContainer: egret.DisplayObjectContainer

	getFootRingContainer() {
		return this.footRingContainer || (this.footRingContainer = new egret.DisplayObjectContainer, this.addChildAt(this.footRingContainer, 0)), this.footRingContainer
	}

	deleteFootRingContainer() {
		this.footRingContainer && (egret.Tween.removeTweens(this.footRingContainer), this.removeChild(this.footRingContainer), this.footRingContainer.removeChildren(), this.footRingContainer.visible = !1, this.footRingContainer = null)
	}

	setFootRing(type) {
		if (type == CharMonster.FOOT_RING_TYPE_LEVEL_BOSS) {
			var i = this.getFootRingContainer();
			i.removeChildren();
			var s = new eui.Image;
			i.addChild(s)
			s.y = -50
			// s.source = RES_DIR_SKILLEFF + "comp_203_104_1.png"
			s.source = ResDataPath.GetAssets("ress/component/comp_203_104_1")
			s.addEventListener(egret.Event.RESIZE, this.onRingResize, this), this.ringTween(this.footRingContainer)
		}
	}

	onRingResize(t) {
		if (t && t.currentTarget) {
			var e = t.currentTarget;
			e.removeEventListener(egret.Event.RESIZE, this.onRingResize, this), e.x = -e.width >> 1, e.y = -e.height >> 1
		}
	}

	ringTween(t) {
		egret.Tween.removeTweens(t);
		if (t) {
			var e = egret.Tween.get(t);
			e && e.to({
				scaleX: .8,
				scaleY: .8
			}, 1e3).to({
				scaleX: 1,
				scaleY: 1
			}, 1e3).call(this.ringTween, this, [t])
		}
	}

	static FOOT_RING_TYPE_NONE = 0
	static FOOT_RING_TYPE_LEVEL_BOSS = 1
}
window["CharMonster"] = CharMonster