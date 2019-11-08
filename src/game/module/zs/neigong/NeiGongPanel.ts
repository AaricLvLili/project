/**内功*/
class NeiGongPanel extends BaseView implements ICommonWindowTitle, ICommonWindowRoleSelect {
	public constructor() {
		super();
		this.skinName = "NeiGongSkin";
	}
	/**背景选项卡 ICommonWindowTitle*/
	mWindowHelpId?: number
	/**传入角色 ICommonWindowRoleSelect*/
	m_RoleSelectPanel: RoleSelectPanel;
	/**内功Btn*/
	private btnUp: eui.Button;
	/**战力值*/
	private powerLabel: PowerLabel;
	/**当前内功*/
	private InternalWork: eui.Label;
	/**升级内功*/
	private InternalWorkValue: eui.Label;
	/**重值*/
	private heavy: eui.Label;
	/** 星星容器*/
	private startGroup: eui.Group;
	/**中间火球动画*/
	private fireBall: MovieClip;
	/** 遮罩*/
	private share: egret.Shape;
	/** 升级的百分比*/
	private percentTf: eui.Label;
	/*** 记录当前星数，和服务器做对比，来判断是否是升级*/
	private currStarNum: number = -1;
	/** 每一阶有多少级*/
	private levelPerStage: number;
	/** 等级上限*/
	private levelMax: number;
	/** 进度球的高度*/
	private readonly barH: number = 60;
	/**升阶动画成功*/
	successEff: MovieClip
	public m_NeedItemGroup: eui.Group;
	public m_NeedManGroup: eui.Group;

	public needItemId: number;
	public m_EffGroup: eui.Group;
	public getItem: eui.Image;
	public languageTxt: eui.Label;

	/**解锁条件*/
	static openCheck(...param: any[]) {
		return Deblocking.Check(DeblockingType.TYPE_47)
	};

	/**获取每个角色红点*/
	private updataRoleRed() {
		for (let i = 0; i < SubRoles.ins().subRolesLen; ++i) {
			let isRed = NeiGongControl.ins().checkRoleRed(i);
			this.m_RoleSelectPanel.showRedPoint(i, isRed);
		}
	}
	/**更换角色*/
	public UpdateContent() {
		NeiGongControl.ins().cs_neigong_info(this.m_RoleSelectPanel.curRole);//请求内功面板信息
		this.currStarNum = -1;
	}
	/**
     * 面板开启执行函数，用于子类继承
     * @param param 参数
     */
	public open(...param: any[]) {
		var fgg = GlobalConfig.ins("NeiGongConfigCommon");
		this.levelPerStage = fgg.levelPerStage;//请求获取每一阶多少级
		this.levelMax = fgg.levelMax;//请求登记上线
		// Sproto.SprotoReceiver.AddHandler(S2cProtocol.sc_neigong_info, this.sc_neigong_info, this);//返回内功面板信息	
		this.observe(MessageDef.NEIGONG_UPDATE, this.sc_neigong_info);
		this.observe(MessageDef.BAG_HAS_ITEM_CAN_USE, this.sc_neigong_info);
		NeiGongControl.ins().cs_neigong_info(this.m_RoleSelectPanel.curRole);//请求内功面板信息

		this.addTouchEvent(this, this.onCLick, this.btnUp);
		this.addTouchEvent(this, this.onTap, this.getItem)
		this.observe(MessageDef.REDPOINT_STATE, this.updataRoleRed);//监听事件
		this.updataRoleRed();
	}

	/**
	 * 面板关闭执行函数，用于子类继承
	 * @param param 参数
	 */
	public close(...param: any[]) {
		this.removeEvents();
		this.removeObserve();//结束监听事件
		this.currStarNum = -1;
	}

	/** 返回内功信息*/
	public sc_neigong_info(): void {
		//刷新属性数据
		let neigGongData = NeiGongControl.ins().neiGongDic.get(this.m_RoleSelectPanel.curRole);
		if (!neigGongData) {
			return;
		}
		var flg: boolean = (neigGongData.starLv % this.levelPerStage == 0 && neigGongData.starLv != 0);//是否升阶
		var cfg: any = GlobalConfig.ins("NeiGongConfigLevel");
		var stepCfg: any = GlobalConfig.ins("NeiGongConfigGrade");
		var cfgLv: number = neigGongData.starLv + neigGongData.progress * this.levelPerStage;
		var xs = cfg[cfgLv];
		var costNew = cfg[cfgLv + 1] ? cfg[cfgLv + 1].cost : cfg[cfgLv].cost
		var stepXs: any = stepCfg[neigGongData.progress];

		/**当前阶级的内功参数*/
		if (neigGongData.starLv == 0 && xs == null) {
			UserBag.ins().setNeedItem([cfg[neigGongData.starLv + 1].cost], this.m_NeedItemGroup);
			this.InternalWork.text = GlobalConfig.jifengTiaoyueLg.st100292 + " " + 0
				+ "\n" + GlobalConfig.jifengTiaoyueLg.st100293 + " " + 0 + "\n" + GlobalConfig.jifengTiaoyueLg.st100294 + " " + 0;
		} else {
			UserBag.ins().setNeedItem([xs.cost], this.m_NeedItemGroup);
			if (stepXs) {
				this.InternalWork.text = GlobalConfig.jifengTiaoyueLg.st100292 + " " + (xs.Shield + stepXs.Shield)
					+ "\n" + GlobalConfig.jifengTiaoyueLg.st100293 + " " + (xs.Relief + stepXs.Relief) / 100 + "%" + "\n" + GlobalConfig.jifengTiaoyueLg.st100294 + " "
					+ (xs.ShieldRep + stepXs.ShieldRep);
			}
			else {
				this.InternalWork.text = GlobalConfig.jifengTiaoyueLg.st100292 + " " + xs.Shield
					+ "\n" + GlobalConfig.jifengTiaoyueLg.st100293 + " " + xs.Relief / 100 + "%"
					+ "\n" + GlobalConfig.jifengTiaoyueLg.st100294 + " " + xs.ShieldRep;
			}
		}
		this.percentTf.text = neigGongData.jindu + "%";//Math.floor(byt.jindu / xs.schedule * 100).toString();

		/**判断升阶和升级的金钱值显示*/
		stepXs = stepCfg[flg ? neigGongData.progress + 1 : neigGongData.progress];

		/**下一阶级的内功参数*/
		xs = cfg[flg ? cfgLv : cfgLv + 1];
		if (xs) {
			if (stepXs) {
				if (flg) {
					UserBag.ins().setNeedItem([stepXs.cost], this.m_NeedItemGroup);
				} else {
					UserBag.ins().setNeedItem([xs.cost], this.m_NeedItemGroup);
				}
				this.InternalWorkValue.text = (xs.Shield + stepXs.Shield) + "\n" + (xs.Relief + stepXs.Relief) / 100 + "%" + "\n" + (xs.ShieldRep + stepXs.ShieldRep);
			}
			else {
				this.InternalWorkValue.text = xs.Shield + "\n" + xs.Relief / 100 + "%" + "\n" + xs.ShieldRep;

			}
			this.btnUp.visible = true;
			this.m_NeedManGroup.visible = true;
		}
		else {
			this.InternalWorkValue.text = GlobalConfig.jifengTiaoyueLg.st100020;//"已满级";
			this.btnUp.visible = false;
			this.m_NeedManGroup.visible = false;
		}

		//刷新进度球
		this.share.y = this.fireBall.y - (this.barH >> 1) + this.barH - this.barH * neigGongData.jindu / 100 + 10;
		/**暂时屏蔽了 */
		this.fireBall.visible = false;
		this.update(neigGongData);

		/**判断是否够钱升级改变颜色*/
		let itemNum = UserBag.ins().getBagGoodsCountById(0, costNew.id)
		this.needItemId = costNew.id;
		if (itemNum >= costNew.count) {
			this.isaa = true;
		} else {
			this.isaa = false
		}
		this.updataRoleRed();
	}

	private isaa: boolean;

	private update(byt: NeiGongData): void {
		this.powerLabel.text = byt.power;//显示战力
		this.heavy.text = byt.progress + GlobalConfig.jifengTiaoyueLg.st100295;//显示重
		let currStart: number = byt.starLv;//; % this.levelPerStage;
		let isUp: boolean = false;//是否是升级

		if (byt.starLv % this.levelPerStage == 0 && byt.starLv != 0) {
			(<eui.Label>(this.btnUp.labelDisplay)).text = GlobalConfig.jifengTiaoyueLg.st100214;//"升 阶";
			currStart = this.levelPerStage;

		} else {
			(<eui.Label>(this.btnUp.labelDisplay)).text = GlobalConfig.jifengTiaoyueLg.st100296;//"升 级";
		}

		if (this.currStarNum != -1 && byt.starLv > this.currStarNum) {//判断是否升级，是的话，后面循环播放特效
			isUp = true;
		}
		this.currStarNum = byt.starLv;

		/*升级变星*/
		var len: number = this.startGroup.numChildren;
		var mc: MovieClip;
		var img: eui.Image;
		for (var i: number = 0; i < len; i++) {
			img = <eui.Image>this.startGroup.getChildAt(i);
			img.source = currStart > i ? "comp_40_40_03_png" : "";
			if (currStart - 1 == i && isUp) {
				mc = ObjectPool.ins().pop("MovieClip");
				mc.loadUrl(ResDataPath.GetUIEffePath("eff_neigong_show"), true, 1, (obj) => {
					DisplayUtils.dispose(obj);
					ObjectPool.ins().push(obj);
				});
				mc.x = this.startGroup.x + img.x + 22;
				mc.y = this.startGroup.y + img.y + 21;
				this.addChild(mc);
			}
		}


	}

	/*请求数据*/
	private onCLick(e: egret.TouchEvent): void {
		if ((<eui.Label>(this.btnUp.labelDisplay)).text == GlobalConfig.jifengTiaoyueLg.st100214) {
			NeiGongControl.ins().cs_neigong_uppro(this.m_RoleSelectPanel.curRole);//请求内功升阶
			//升阶显示成功动画
			this.successEff = new MovieClip();
			this.successEff.loadUrl(ResDataPath.GetUIEffePath("eff_success"), true, 1, (obj) => {
				DisplayUtils.dispose(obj);
				ObjectPool.ins().push(obj);
			})
			this.m_EffGroup.addChild(this.successEff)
		}
		else if (this.isaa) {
			NeiGongControl.ins().cs_neigong_upstar(this.m_RoleSelectPanel.curRole);//请求内功升级
		} else {
			UserWarn.ins().setBuyGoodsWarn(this.needItemId);
		}
	}

	private onTap(e) {
		UserWarn.ins().setBuyGoodsWarn(this.needItemId);
	}

	protected childrenCreated(): void {
		super.childrenCreated();

		/**中间火球*/
		this.fireBall = ObjectPool.ins().pop("MovieClip");
		this.fireBall.x = 238;
		this.fireBall.y = 355;
		this.addChildAt(this.fireBall, 10);
		this.fireBall.loadUrl(ResDataPath.GetUIEffePath("eff_neigong_ball"), true, -1);


		/**中间遮罩*/
		this.share = new egret.Shape();
		this.share.graphics.beginFill(0x00ff00, 1);
		this.share.graphics.drawRect(0, 0, this.barH, this.barH * 2);
		this.share.graphics.endFill();
		this.share.x = 208;
		this.share.y = 130;
		this.addChild(this.share);

		this.fireBall.mask = this.share;
		/**暂时屏蔽掉 */
		this.fireBall.visible = false;
		this.percentTf.visible = false;
		this.languageTxt.text = GlobalConfig.jifengTiaoyueLg.st100297;
	}

}
window["NeiGongPanel"] = NeiGongPanel