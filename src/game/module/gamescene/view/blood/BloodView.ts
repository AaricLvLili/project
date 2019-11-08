class BloodView extends egret.DisplayObjectContainer {

	// bloodpPool: ObjectPool;
	private m_Cache: { [key: string]: BloodItem[] } = {};
	private static timeDic: Dictionary<number> = new Dictionary<number>();
	public static FONT = {
		["j1"]: "font_pz_zi_j1_fnt",
		["2"]: "font_pz_zi02_fnt",
		["j3"]: "font_pz_zi_j3_fnt",
		["j2"]: "font_pz_zi_j2_fnt",
		["6"]: "font_pz_zi02_fnt",
		["a"]: "font_pz_zi0a_fnt",
		["HJ"]: "font_pz_zi_j3_fnt",
	}

	public constructor() {
		super();
		if (BloodView.timeoutDic == null)
			BloodView.timeoutDic = new Array<number>();
		egret.setInterval(this.GC, this, 600000);
		MessageCenter.addListener(GameLogic.ins().postEntityHpChange, this.showBlood2, this);
	}

	private _GetBitmapLabel(type: string, isHeji: boolean) {
		type = isHeji ? "HJ" : type
		let label: BloodItem = null
		let cacheList = this.m_Cache[type]
		if (cacheList) {
			label = cacheList.pop()
		}
		if (!label) {
			label = new BloodItem(type)
		}
		label.visible = true
		this.addChild(label)
		return label
	}
	private _CacheBitmapLabel(bloodItem: BloodItem) {

		if (!bloodItem) {
			return
		}
		egret.Tween.removeTweens(bloodItem);
		let type = bloodItem.name
		let cacheList = this.m_Cache[type]
		if (!cacheList) {
			cacheList = this.m_Cache[type] = []
		}
		bloodItem.visible = false
		bloodItem.alpha = 1
		if (bloodItem.parent == this) {
			bloodItem.dispose();
			this.removeChild(bloodItem);
		}
		cacheList.push(bloodItem)
	}

	private _CacheLabel(lab: eui.Label) {
		if (lab.parent) {
			lab.parent.removeChild(lab);
		}
		ObjectPool.ins().push(lab);
	}

	public showBlood2(param) {
		if (param == null) return;
		if (BloodView.isGC) return;
		let target = param[0];
		let source = param[1];
		let type = param[2];
		let value = param[3];
		let hitCount: number = param[4];
		let elementRestrainType: ElementRestrainType = param[5][0];
		let isSkill: boolean = param[5][1] != SkillType.TYPE1;
		if (hitCount == NaN)
			hitCount = 1;

		let hitHart = value * 0.7 / hitCount;
		hitHart = Math.ceil(hitHart);

		let rndHart = value * 0.3;
		rndHart = Math.ceil(rndHart);

		let hitArr = [];
		let tempHit = rndHart;
		for (let j = 0; j < hitCount; j++) {
			if (j == (hitCount - 1)) {
				hitArr[j] = tempHit;
				break;
			}
			hitArr[j] = MathUtils.limitInteger(0, tempHit);
			tempHit = tempHit - hitArr[j];
		}
		for (let i = 0; i < hitCount; i++) {
			let t = egret.setTimeout(() => {
				this.showBlood([target, source, type, hitHart + hitArr[i], elementRestrainType, isSkill]);
			}, this, i * 200);
			BloodView.timeoutDic.push(t);
		}
	}
	private static timeoutDic: Array<number>;
	private static isGC: boolean = false;
	private GC() {
		// console.log("BloodView.timeoutDic len1 = "+BloodView.timeoutDic.length);
		BloodView.isGC = true;
		let temp = BloodView.timeoutDic;
		let len = temp.length;
		for (let i = 0; i < len; i++) {
			egret.clearTimeout(temp[i]);
		}
		BloodView.timeoutDic.length = 0;
		// console.log("BloodView.timeoutDic len2 = "+BloodView.timeoutDic.length);
		BloodView.isGC = false;
		// ObjectPool.clear();
		// MovieClip.resList.clear();
		// egret.log("手动回收对象池");
		// MapViewBg.mapImages.clear();
	}

	public showBlood(param) {
		try {

			var target = param[0];
			var source: CharRole = param[1];
			var type = param[2];
			var value = param[3];
			let elementRestrainType = param[4];
			let isSkill = param[5];
			if (target['team'] != Team.My && source != null && source['team'] != Team.My)
				return; //过滤非自己伤害
			if (target && source && target['team'] == Team.My) {
				return;
			}
			if (value == 0) {
				return;
			}
			else {
				var chartype = void 0;
				if (type == DamageTypes.CRIT || isSkill) {
					chartype = "j2";
				} else {
					chartype = "j3";
				}
				if (source == null) {
					chartype = "2";
				}
				let sv = value < 0 ? "+" + Math.abs(value) : (value >> 0) + "";
				let st = value < 0 ? "a" : chartype
				let blood: BloodItem = this._GetBitmapLabel(st, type == DamageTypes.HEJI)
				blood.valueType = type
				blood.text = sv
				blood.baoji(type, source)
				let txx = blood.m_MainGroup.width / 2;//弧形飘血测试调整
				let tyy = 0;
				blood.x = target.x;
				blood.y = target.y;//90;
				blood.setLab2(elementRestrainType);
				this.floatImg(blood, type, target, source, 0 > value, isSkill);
			}

		} catch (e) {

		}
	};


	public repositionNumPic(container: egret.DisplayObjectContainer) {
		var index = 1;
		var temp;
		for (index; index < container.numChildren; index++) {
			temp = container.getChildAt(index);
			temp.y = 20;
		}
	};
	/**抛物线飘字的参数 ***********/
	/**横移的总时间 */
	private hengYiTime = 800;
	/**横移的距离 */
	private hengYiJuLi = 80;
	/**上升的距离（原点0开始） */
	private hengYiShangSheng = 50;
	/**下降的距离（原点0开始） */
	private hengYiXiaJiang = 50;
	/**字体变小的最小值 */
	private hengYiSize = 0.6;
	/**暴击变大时的最大值 */
	private hengYiBaojiSize = 1.8;
	/**抛物线飘字的参数 *************/

	/**上升飘字的参数 *******/
	/**上移的总时间 */
	private shuYiTime = 1400;
	/**上移的距离 */
	private shuYiJuLi = 80;
	/**暴击放大的时间 */
	private baojiFangDaTime = 100;
	/**暴击放大后缩回原样的时间 */
	private baojiReTime = 100;
	/**暴击放大的大小 */
	private baojiFangDaSize = 2;
	/**暴击还原的大小 */
	private baojiReSize = 1;


	floatImg(floatTarger: BloodItem, type, target, source, isAddBlood, isSkill) {
		let group = floatTarger.m_MainGroup;
		egret.Tween.removeTweens(group);
		let tween = egret.Tween.get(group);
		let twee2 = egret.Tween.get(group);
		group.x = group.y = 0;
		group.scaleX = group.scaleY = 1;
		group.alpha = 1;
		if (type == DamageTypes.HEJI) {
			group.scaleX = group.scaleY = 1.8;
			group.alpha = 1;
			group.y = group.y + 40;
			tween.to({
				scaleX: 1,
				scaleY: 1
			}, 200).wait(400).to({
				alpha: 0,
			}, 200)
		}
		else if (null == source || target.team == Team.My) {
			if (type == DamageTypes.CRIT) {
				let distanceX: boolean = false;
				if (1 == target.dir || 2 == target.dir || 3 == target.dir) {
					distanceX = true;
				}
				let hengYi = this.hengYiJuLi;
				if (distanceX == true) {
					hengYi = -this.hengYiJuLi;
				}
				twee2.to({
					y: - this.hengYiShangSheng, scaleX: this.hengYiBaojiSize, scaleY: this.hengYiBaojiSize
				}, this.hengYiTime * 0.4, egret.Ease.backOut).to({
					y: this.hengYiXiaJiang, scaleX: this.hengYiSize, scaleY: this.hengYiSize
				}, this.hengYiTime * 0.6).call(() => { group.scaleX = group.scaleY = 1 });
				tween.to({
					x: hengYi,
				}, this.hengYiTime);
			}
			else {
				let distanceX: boolean = false;
				if (1 == target.dir || 2 == target.dir || 3 == target.dir) {
					distanceX = true;
				}
				let hengYi = this.hengYiJuLi;
				if (distanceX == true) {
					hengYi = -this.hengYiJuLi;
				}
				twee2.to({
					y: - this.hengYiShangSheng,
				}, this.hengYiTime * 0.4, egret.Ease.backOut).to({
					y: this.hengYiXiaJiang, scaleX: this.hengYiSize, scaleY: this.hengYiSize
				}, this.hengYiTime * 0.6);
				tween.to({
					x: hengYi,
				}, this.hengYiTime);
			}
		} else {
			if (isAddBlood) {
				let hengYi = -this.shuYiJuLi;
				tween.to({
					y: hengYi,
				}, this.shuYiTime);
				twee2.to({
					scaleX: this.baojiFangDaSize, scaleY: this.baojiFangDaSize
				}, this.baojiFangDaTime).to({
					scaleX: this.baojiReSize, scaleY: this.baojiReSize
				}, this.baojiReTime);
			} else if (isSkill) {
				if (type == DamageTypes.CRIT) {
					let hengYi = -this.shuYiJuLi;
					tween.to({
						y: hengYi,
					}, this.shuYiTime);
					twee2.to({
						scaleX: this.baojiFangDaSize, scaleY: this.baojiFangDaSize
					}, this.baojiFangDaTime).to({
						scaleX: this.baojiReSize, scaleY: this.baojiReSize
					}, this.baojiReTime);
				} else {
					let hengYi = -this.shuYiJuLi;
					tween.to({
						y: hengYi,
					}, this.shuYiTime);
				}
			}
			else {
				/***弧形飘血******** */
				let distanceX = source.x - target.x;
				let hengYi = this.hengYiJuLi;
				if (distanceX > 0) {
					hengYi = -this.hengYiJuLi
				}
				twee2.to({
					y: - this.hengYiShangSheng,
				}, this.hengYiTime * 0.4, egret.Ease.backOut).to({
					y: this.hengYiXiaJiang,
					scaleX: this.hengYiSize, scaleY: this.hengYiSize
				}, this.hengYiTime * 0.6);
				tween.to({
					x: hengYi,
				}, this.hengYiTime);
			}
			/***弧形飘血******** */
		}
		tween.call(this._CacheBitmapLabel, this, [floatTarger])
	}

	public static TweenType1(tween: egret.Tween, x: number, y: number) {
		tween.to({
			x: x,
			y: y,
			scaleX: BloodView.CRIT_SCALE_1,
			scaleY: BloodView.CRIT_SCALE_1
		}, BloodView.SPEED2, BloodView.EASE_FUNC2).to({
			x: x,
			y: y - 100,
			scaleX: BloodView.CRIT_SCALE_2,
			scaleY: BloodView.CRIT_SCALE_2
		}, BloodView.SPEED2, BloodView.EASE_FUNC2).wait(BloodView.WAIT2).to({
			y: y - 30
		}, 500).to({
			alpha: 0,
			y: y - 35
		}, 400)
	}

	static MAX_BLOOD_CNT = 30
	static EASE_FUNC1 = egret.Ease.circInOut
	static SPEED1 = 150
	static WAIT1 = 250
	static MINANGLE = 70
	static MAXANGLE = 125
	static DISTANCE = 40
	static EASE_FUNC2 = egret.Ease.circInOut
	static SPEED2 = 175
	static WAIT2 = 200
	static NORMAL_SCALE_1 = 1.1
	static NORMAL_SCALE_2 = .95
	static CRIT_SCALE_1 = 1.85
	static CRIT_SCALE_2 = 1.2
	static INTERVAL_Y = 0
}

class BloodItem extends eui.Component {
	public m_MainGroup: eui.Group;
	public m_Bg: eui.Image;
	public m_Lab: eui.BitmapLabel;
	public m_State: eui.Image;
	public m_HeJiImg: eui.Image;


	public constructor(type) {
		super()
		this.name = type;
		this.skinName = "BloodItemSkin";
		this.m_Lab.font = BloodView.FONT[type];
	}

	public createChildren() {
		super.createChildren();
	}

	public set text(value) {
		this.m_Lab.text = value
	}

	public set valueType(value) {
		if (value == DamageTypes.HEJI) {
			this.m_HeJiImg.source = "comp_36_21_01_png" // value == "b" ? ""
		} else {
			this.m_HeJiImg.source = null
		}
	}

	public baoji(value, source) {
		if (source && value == DamageTypes.CRIT) {
			this.m_Bg.visible = true;
			if (source.infoModel.job == JobConst.ZhanShi) {
				this.m_Bg.source = "comp_160_114_01_png";
			} else if (source.infoModel.job == JobConst.FaShi) {
				this.m_Bg.source = "comp_160_114_02_png";
			} else if (source.infoModel.job == JobConst.DaoShi) {
				this.m_Bg.source = "comp_160_114_03_png";
			}
		} else {
			this.m_Bg.visible = false;
		}
	}

	public dispose() {
		egret.Tween.removeTweens(this.m_MainGroup);
		this.m_HeJiImg.source = null;
		this.m_Lab.text = null;
		this.m_State.source = null;
		this.m_Bg.source = null;
	}

	public setLab2(type) {
		this.m_State.visible = true;
		if (type == ElementRestrainType.KTYPE) {
			this.m_State.source = "comp_36_21_02_png";
		} else if (type == ElementRestrainType.BKTYPE) {
			this.m_State.source = "comp_36_21_03_png";
		} else {
			this.m_State.visible = false;
		}
	}

	public GetWidth(): number {
		return this.width;
	}
}

window["BloodView"] = BloodView
window["BloodItem"] = BloodItem