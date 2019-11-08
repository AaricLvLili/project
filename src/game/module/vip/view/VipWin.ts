class VipWin extends BaseEuiPanel implements IResObject {

	public static LAYER_LEVEL = LayerManager.UI_Main

	public constructor() {
		super();
	}

	public static EFFE = [
		[""],
		[4, "comp_333_363_01_png"],
		[4, "comp_333_363_02_png"],
		[4, "comp_333_363_03_png"],
		[4, "comp_333_363_04_png"],
		[4, "comp_333_363_05_png"],
		[4, "comp_333_363_06_png"],
		[4, "comp_333_363_07_png"],
		[4, "comp_333_363_08_png"],
		[4, "comp_333_363_09_png"],
		[4, "comp_333_363_10_png"]
		// [4,"ui_vip_js_zi10_png"]
	]

	// public static GetVIPEff(lv: number) {
	// 	return ResDataPath.GetUIEffePath(VipWin.EFFE[lv])
	// }

	public static LoadVIPEff(lv: number | any): egret.DisplayObject {
		let values
		if (typeof (lv) == "number") {
			values = VipWin.EFFE[lv]
		} else {
			values = lv
		}
		if (!values) {
			return null
		}

		let type = values[0]
		if (type == 1) {
			let parent = new egret.DisplayObjectContainer
			parent.x = 240
			parent.y = 250

			let group = new egret.DisplayObjectContainer
			for (let i = 1; i < values.length; ++i) {
				let target: egret.DisplayObject
				let path = ResDataPath.GetUIEffePath(values[i] as string)
				if (i == values.length - 1) {
					let movieClip = new MovieClip
					movieClip.loadUrl(path, true, -1)
					target = movieClip
				} else {
					let image = new eui.Image
					image.blendMode = "add"
					image.source = path
					image.x = -256
					image.y = -256
					target = image
				}
				group.addChild(target)
			}
			UIHelper.SetIconMovie(group)
			parent.addChild(group)
			return parent

		} else if (type == 2) {
			let path = ResDataPath.GetUIEffePath(values[1] as string)
			let movieClip = new MovieClip
			movieClip.loadUrl(path, true, -1)
			movieClip.x = 240
			movieClip.y = 250
			return movieClip
			// parent.addChild(movieClip)
		} else if (type == 3) {
			let value = values[1]
			let names = []
			for (let i = 0; i < 8; i++) {
				names.push(value + "/0" + i)
			}
			let urls = []
			for (let name of names) {
				urls.push(ResDataPath.GetUIEffePath(name + ".png"))
			}

			let simpleMc = new SimpleMovieClip(urls)
			return simpleMc
			// parent.addChild(simpleMc)

			// parent.x = parent.y = 0
		} else if (type == 4) {
			let img = new eui.Image
			img.source = values[1] as string
			// img.horizontalCenter = 0
			return img
			// parent.addChild(img)
			// parent.x = 0
			// parent.y = 0
		}


		// return parent
	}

	private curVip: eui.BitmapLabel
	private nextVip: eui.BitmapLabel

	private titleVip: eui.Label
	list: eui.List
	// closeBtn
	closeBtn0
	topUpBtn:eui.Button
	leftBtn
	rightBtn
	suerBtn: eui.Button
	getState: eui.Image
	_curLv
	expBar
	//nextVipImg
	titleLabel: eui.Label
	//nameLabel: eui.Label
	// depictLabel
	// vipImg
	cost: eui.Label
	//lv: eui.Label
	effGroup: eui.Group
	// mc

	seeDetails: eui.Label

	private vipDesImg: eui.Image
	//private imgTest: eui.Image

	public OnResUnload(): boolean {
		if (!this.effGroup) {
			return false
		}
		for (let i = 0; i < this.effGroup.numChildren; ++i) {
			SimpleResMgr.Unload(this.effGroup.getChildAt(i))
		}
		this.effGroup.removeChildren()
		return true
	}

	initUI() {
		super.initUI()
		this.skinName = "VipSkin";
		this.list.itemRenderer = ItemBase;
		this.topUpBtn.label = GlobalConfig.jifengTiaoyueLg.st100784;
		this.seeDetails.text = GlobalConfig.jifengTiaoyueLg.st100785;
		this.suerBtn.label = GlobalConfig.jifengTiaoyueLg.st100004;
	};
	open(...param: any[]) {

		// this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.closeBtn0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.topUpBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.leftBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.rightBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.suerBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.seeDetails.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		GameGlobal.MessageCenter.addListener(MessageDef.UPDATA_VIP_EXP, this.changeExpBar, this);
		GameGlobal.MessageCenter.addListener(MessageDef.UPDATA_VIP_AWARDS, this.changeAwards, this);
		this.changeExpBar();
		let index = param[0]
		if (index) {
			let config = GlobalConfig.ins("VipConfig")[index]
			this.setAwards(config)
			this._curLv = index
			this.changeBtn();
		} else {
			this.changeAwards();
		}
		UIHelper.SetLinkStyleLabel(this.seeDetails);
		this.topUpBtn.visible = !WxSdk.ins().isHidePay();
	};
	close() {
		// this.closeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.closeBtn0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.topUpBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.leftBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.rightBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.suerBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.seeDetails.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		MessageCenter.ins().removeAll(this);

		SimpleResMgr.Unload(this)
	};
	onTap(e) {
		var config;
		switch (e.currentTarget) {
			// case this.closeBtn:
			case this.closeBtn0:
				ViewManager.ins().close(VipWin);
				break;
			case this.topUpBtn:
				ViewManager.ins().close(VipWin);
				ViewManager.ins().open(ChargeFirstWin);
				break;
			case this.leftBtn:
				config = GlobalConfig.ins("VipConfig")[--this._curLv];
				this.showVipInfo(config);
				break;
			case this.rightBtn:
				config = GlobalConfig.ins("VipConfig")[++this._curLv];
				this.showVipInfo(config);
				break;
			case this.suerBtn:
				config = GlobalConfig.ins("VipConfig")[this._curLv];
				var num = 0;
				var showIndex = SubRoles.ins().getSubRoleByIndex(0).job;
				var awards = config.awards[showIndex - 1];
				var len = awards.length;
				for (var i = 0; i < len; i++) {
					if (awards[i].type == 1 && awards[i].id < 200000)
						num++;
				}
				if (UserBag.ins().getSurplusCount() >= num)
					UserVip.ins().sendGetAwards(this._curLv);
				else
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100051);
				break;

			case this.seeDetails:
				//WarnWin.show(TextFlowMaker.generateTextFlow(GlobalConfig.ins("VipConfig")[this._curLv].description), function(){}, this)
				ViewManager.ins().open(ZsBossRuleSpeak, 0, GlobalConfig.jifengTiaoyueLg.st100779, GlobalConfig.ins("VipConfig")[this._curLv].description)
				break
		}
	};
	showVipInfo(config) {
		if (config) {
			this.setAwards(config);
		}
		else {
			this._curLv = UserVip.ins().lv;
		}
		this.changeBtn();
	};
	/**经验进度条改变 */
	changeExpBar() {
		var vipData = UserVip.ins();
		var config = GlobalConfig.ins("VipConfig")[vipData.lv];
		var curLv = 0;
		var curNeedYb = vipData.exp;
		if (config) {
			curLv = vipData.lv;
			// BitmapNumber.ins().changeNum(this.curVip, curLv, "5");
			this.curVip.text = "v" + curLv
		}
		var nextConfig = GlobalConfig.ins("VipConfig")[curLv + 1];
		var nextNeedYb = 0;
		var ybValue = 0;
		var str = "";
		if (nextConfig) {
			nextNeedYb = nextConfig.needYb - curNeedYb;
			// BitmapNumber.ins().changeNum(this.nextVip, vipData.lv + 1, "5");
			this.nextVip.text = "v" + (vipData.lv + 1)
			str = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100780,[nextNeedYb]) + (vipData.lv + 1);
			this.expBar.maximum = nextConfig.needYb;
			this.expBar.value = curNeedYb;
		}
		else {
			// this.nextVip.visible = false;
			//this.nextVip.visible = false;
			//this.nextVipImg.visible = false;
			str = GlobalConfig.jifengTiaoyueLg.st100781;//"会员等级已满";
			this.expBar.labelDisplay.visible = false;
			this.expBar.maximum = 1;
			this.expBar.value = 1;
			this.nextVip.text = GlobalConfig.jifengTiaoyueLg.st100020;//"已满级"
			//this.nameLabel.text = ""
		}
		
		//this.nameLabel.x = this.titleLabel.x + this.titleLabel.width + 5
	};
	/**奖励改变 */
	changeAwards() {
		var config;
		this._curLv = UserVip.ins().lv;
		if (this._curLv >= 0) {
			for (var i = 1; i <= this._curLv; i++) {
				if (!this.getRemindByIndex(i)) {
					config = GlobalConfig.ins("VipConfig")[i];
					this.setAwards((config) ? config : config = GlobalConfig.ins("VipConfig")[--this._curLv]);
					this._curLv = i;
					this.changeBtn();
					return;
				}
			}
			config = GlobalConfig.ins("VipConfig")[++this._curLv];
			this.setAwards((config) ? config : config = GlobalConfig.ins("VipConfig")[--this._curLv]);
			this.changeBtn();
		}
	};

	/**调整vip eff坐标*/
	static vipEffPos: Array<any> =
	[
		{ x: -15, y: 0 },// 作废
		{ x: -15, y: -90 },//从这里开始
		{ x: -15, y: -90 },
		{ x: -15, y: -90 },
		{ x: -15, y: -90 },
		{ x: -15, y: -90 },
		{ x: -15, y: -90 },
		{ x: -15, y: -90 },
		{ x: -15, y: -90 },
		{ x: -15, y: -90 },
		{ x: -15, y: -90 },
	];
	/**设置领取奖励按钮状态 */
	setAwards(config) {
		// BitmapNumber.ins().changeNum(this.titleVip, config.id, "5");
		this.titleVip.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100782,[config.id]);//"会员" + config.id + "特权";
		//this.nameLabel.text = "充值" + config.needYb + "钻石成为会员" + config.id;
		// this.depictLabel.textFlow = TextFlowMaker.generateTextFlow(config.description);
		// var showIndex = SubRoles.ins().getSubRoleByIndex(0).job;
		this.list.dataProvider = new eui.ArrayCollection(config.awards);
		this.list.validateNow()
		for (let i = 0; i < this.list.numChildren; ++i) {
			(this.list.getChildAt(i) as ItemBase).showItemEffect()
		}
		// this.vipImg.source = "vipimg_" + config.id;
		this.suerBtn.visible = false;
		this.suerBtn.enabled = false;
		this.getState.visible = false
		// if (this.mc) {
		// 	DisplayUtils.removeFromParent(this.mc);
		// }
		let imgName = "comp_252_121_0";
		if (config.id >= 10) {
			imgName = "comp_252_121_";
		}
		this.vipDesImg.source = imgName + config.id + "_png";
		// this.lv.text = config.id +　""
		this.cost.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100783,[config.showYuanBao,config.id]);//`价值${config.showYuanBao}钻石 会员${config.id}礼包`
		this.titleLabel.textFlow = TextFlowMaker.generateTextFlow(config.description);
		SimpleResMgr.Unload(this)
		// let eff = VipWin.LoadVIPEff(config.id)
		// if (eff) {
		// 	let pos = VipWin.vipEffPos[config.id];
		// 	eff.x = pos.x;
		// 	eff.y = pos.y;
		// 	this.effGroup.addChild(eff)
		// }
		//暂时使用图片
		// let imgName1 = "comp_333_363_0";
		// if (config.id >= 10) {
		// 	imgName1 = "comp_333_363_";
		// }
		//this.imgTest.source = imgName1 + config.id + "_png";

		UIHelper.SetBtnNormalEffe(this.suerBtn, false)
		if (this.getRemindByIndex(config.id)) {
			this.suerBtn.visible = false
			this.getState.visible = true

			// this.suerBtn.visible = true;
			// this.suerBtn.label = "已领取";
		}
		else {
			if (UserVip.ins().lv >= config.id) {
				this.suerBtn.visible = true;
				this.suerBtn.enabled = true;
				// this.suerBtn.label = "领取";
				UIHelper.SetBtnNormalEffe(this.suerBtn, true)
				// this.mc = this.mc || new MovieClip;
				// this.mc.x = 50;
				// this.mc.y = 19;
				// this.suerBtn.addChild(this.mc);
			}
		}
	};
	/**true已领取 false未领取 */
	getRemindByIndex(index: number): boolean {
		var uservip = UserVip.ins();
		var state = uservip.state;
		return ((state >> index) & 1) == 1;
	};
	changeBtn() {
		if (this._curLv > 1) {
			this.leftBtn.visible = true;
			this.rightBtn.visible = true;
			if (this._curLv >= CommonUtils.getObjectLength(GlobalConfig.ins("VipConfig")))
				this.rightBtn.visible = false;
		}
		else if (this._curLv <= 1) {
			this.leftBtn.visible = false;
			this.rightBtn.visible = true;
		}
	};
}
window["VipWin"]=VipWin