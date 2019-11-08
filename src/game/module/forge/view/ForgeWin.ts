class ForgeWin extends BaseEuiPanel implements ICommonWindow {
	public constructor() {
		super();
		this.layerLevel = VIEW_LAYER_LEVEL.TOP;
	}

	private commonWindowBg: CommonWindowBg

	// viewStack: eui.ViewStack
	boostPanel: ForgeBoostPanel
	gemPanel: ForgeGemPanel
	zhulingPanel: ForgeZhulingPanel
	// tab
	/** 强化成功特效*/
	mc: MovieClip
	mc_succeed: MovieClip
	// roleSelect
	// closeBtn
	// closeBtn0

	private upGradeBtn: eui.Button
	private btnAutoUp: eui.Button
	// private cbAutoBuy: eui.CheckBox
	private powerLabel: PowerLabel
	protected consumeLabel: ConsumeLabel
	protected maxLvTF: eui.Label
	protected getItem
	private equip_upEffeX: number[] = [61, 61, 61, 61, 411, 411, 411, 411];
	private equip_upEffeY: number[] = [120, 234, 304, 374, 166, 234, 304, 374];
	private gem_upEffeX: number[] = [60, 415, 60, 415, 60, 415, 60, 415, 56, 422];
	private gem_upEffeY: number[] = [100, 100, 183, 183, 263, 263, 343, 343, 438, 438];
	private zhuling_upEffeX: number[] = [60, 415, 60, 415, 60, 415, 60, 415];
	private zhuling_upEffeY: number[] = [100, 100, 183, 183, 263, 263, 343, 343];
	private blessWin: BlessWin;
	public BOTTON_GROUP_FULL: eui.Group;
	public m_AutoBuy: eui.CheckBox;


	initUI() {
		super.initUI()
		this.skinName = "ForgeSkin";
		this.maxLvTF.text = GlobalConfig.jifengTiaoyueLg.st100234;
		this.btnAutoUp.label = GlobalConfig.jifengTiaoyueLg.st101179;
		this.m_AutoBuy.label = GlobalConfig.jifengTiaoyueLg.st101147;
		this.upGradeBtn.label = GlobalConfig.jifengTiaoyueLg.st101180;
		this.getItem.text = GlobalConfig.jifengTiaoyueLg.st100418;
		UIHelper.SetLinkStyleLabel(this.getItem)
		this.boostPanel = new ForgeBoostPanel;
		this.boostPanel.SetComp(this.powerLabel, this.consumeLabel, this.upGradeBtn, this.btnAutoUp, this.maxLvTF, this.getItem, this.BOTTON_GROUP_FULL,this.m_AutoBuy)
		this.commonWindowBg.AddChildStack(this.boostPanel);

		this.blessWin = new BlessWin();
		this.blessWin.name = GlobalConfig.jifengTiaoyueLg.st101178;
		this.blessWin.setComp(this.powerLabel, this.maxLvTF, this.BOTTON_GROUP_FULL);
		this.commonWindowBg.AddChildStack(this.blessWin);

		this.gemPanel = new ForgeGemPanel;
		this.gemPanel.SetComp(this.powerLabel, this.consumeLabel, this.upGradeBtn, this.btnAutoUp, this.maxLvTF, this.getItem, this.BOTTON_GROUP_FULL,this.m_AutoBuy)
		this.commonWindowBg.AddChildStack(this.gemPanel);

		this.zhulingPanel = new ForgeZhulingPanel;
		this.zhulingPanel.SetComp(this.powerLabel, this.consumeLabel, this.upGradeBtn, this.btnAutoUp, this.maxLvTF, this.getItem, this.BOTTON_GROUP_FULL,this.m_AutoBuy)
		this.commonWindowBg.AddChildStack(this.zhulingPanel);

		this.mc_succeed = new MovieClip;
		this.mc_succeed.x = 142;
		this.mc_succeed.y = -9;
	};
	destoryView() {
		super.destoryView()
	};
	open(...param: any[]) {
		this.commonWindowBg.OnAdded(this, param[0] ? param[0] : 0, param[1] ? param[1] : 0)
		MessageCenter.addListener(UserForge.ins().postForgeUpdate, this.onEvent, this);
		this.observe(MessageDef.DELETE_ITEM, this.redPoint)
		this.observe(MessageDef.ADD_ITEM, this.redPoint)
		this.observe(MessageDef.ITEM_COUNT_CHANGE, this.redPoint)
		this.redPoint();
	};
	close() {
		this.commonWindowBg.OnRemoved()
		//UIView2.CloseNav(UIView2.NAV_SMITH)
		MessageCenter.ins().removeAll(this);
		let uiview2 = <UIView2>ViewManager.ins().getView(UIView2);
		if (uiview2)
			uiview2.closeNav(UIView2.NAV_BAG);
	};

    /**
     * 提升后的回调
     */
	onEvent(packageID) {
		var index = 0;
		var lastIndex = 0;
		var forgeType: number = 0;
		var effX: number[] = [];
		var effY: number[] = [];
		let tipIndexView: ForgeBasePanel = null
		switch (packageID) {
			case PackageID.strongthen:
				tipIndexView = this.boostPanel
				forgeType = 0;
				effX = this.equip_upEffeX;
				effY = this.equip_upEffeY;
				// 处理强化面板拼图
				// this.playEffectPic(forgeType, tipIndexView);
				this.playEffect(forgeType, tipIndexView, effX, effY);
				break;
			case PackageID.Gem:
				tipIndexView = this.gemPanel
				forgeType = 1;
				effX = this.gem_upEffeX;
				effY = this.gem_upEffeY;
				this.playEffect(forgeType, tipIndexView, effX, effY);
				break;
			case PackageID.Zhuling:
				forgeType = 2;
				tipIndexView = this.zhulingPanel
				effX = this.zhuling_upEffeX;
				effY = this.zhuling_upEffeY;
				this.playEffect(forgeType, tipIndexView, effX, effY);
				break;
		}
	}

	private playEffect(forgeType: number, tipIndexView: ForgeBasePanel, effX: number[], effY: number[]) {
		if (this.canPlayEffect(tipIndexView)) return;
		var role = SubRoles.ins().getSubRoleByIndex(this.commonWindowBg.getCurRole());
		let pos = role.getMinEquipIndexByType(forgeType);
		pos = pos == 0 ? 7 : pos - 1;
		tipIndexView.UpdateContent();

		if (this.mc == null) {
			this.mc = new MovieClip();
		}
		this.mc.x = 240;
		this.mc.y = 340;
		this.mc.loadUrl(ResDataPath.GetUIEffePath("eff_success_strengthen"), true, 1, () => {
			DisplayUtils.dispose(this.mc);
			this.mc = null;
		});
		this.addChild(this.mc);
		// this.mc_succeed.x = effX[pos];
		// this.mc_succeed.y = effY[pos];
		// //()=>{this.removeChild(this.mc_succeed)}
		// if(forgeType != 0){
		// 	this.mc_succeed.loadUrl(ResDataPath.GetUIEffePath("eff_ui_qhui_002"), true, 1,()=>{this.removeChild(this.mc_succeed)});
		// 	this.addChild(this.mc_succeed);
		// }

		this.redPoint();
	}
	private playEffectPic(forgeType: number, tipIndexView: ForgeBasePanel) {
		if (this.canPlayEffect(tipIndexView)) return;
		tipIndexView.UpdateContent();
		this.redPoint();
	}
	private canPlayEffect(tipIndexView: ForgeBasePanel): boolean {
		let curShowView = this.commonWindowBg.GetCurViewStackElement();
		let flag: boolean = tipIndexView != curShowView;
		if (tipIndexView != curShowView)
			console.log(`ForgeWin:Event 当前事件 ${tipIndexView}, 当前显示界面 ${curShowView}`)
		return flag
	}

	redOpenState = [true, Deblocking.Check(DeblockingType.TYPE_76, true), Deblocking.Check(DeblockingType.TYPE_78, true)]
	redPoint() {
		let viewIndex = this.commonWindowBg.GetSelectedIndex()
		var len = SubRoles.ins().subRolesLen;
		this.commonWindowBg.clearRedPoint()
		this.commonWindowBg.ClearTalRedPoint()

		this.commonWindowBg.ShowTalRedPoint(1, Bless.ins().checkIsHaveUp());//器灵
		for (var roleIndex = 0; roleIndex < len; roleIndex++) {
			for (var i = 0; i < 4; i++) {
				if (i == 1) continue;//器灵
				var type = (i > 1) ? i - 1 : i;
				var role = SubRoles.ins().getSubRoleByIndex(roleIndex);
				var index = role.getMinEquipIndexByType(type);
				var lv = this.getForgeLv(type, role, index);
				var costNum = this.getForgeIdOrCount(type, lv, 0);
				if (costNum && this.redOpenState[type]) {
					var goodsNum = void 0;
					if (type == 2)
						goodsNum = GameLogic.ins().actorModel.soul;
					else
						goodsNum = UserBag.ins().getBagGoodsCountById(0, this.getForgeIdOrCount(type, lv, 1));
					if (goodsNum >= costNum) {
						if (viewIndex == i)
							this.commonWindowBg.showRedPoint(roleIndex, true);
						this.commonWindowBg.ShowTalRedPoint(i, true)
					}
				}
			}
		}
	}

	getForgeLv(type, role, index) {
		switch (type) {
			case 0:
				return role.getEquipByIndex(index).strengthen;
			case 1:
				return role.getEquipByIndex(index).gem;
			case 2:
				return role.getEquipByIndex(index).zhuling;
		}
	}

	getForgeIdOrCount(type, lv, idOCount) {
		switch (type) {
			case 0:
				var boostConfig = UserForge.ins().getEnhanceCostConfigByLv(lv + 1);
				if (boostConfig) {
					if (idOCount)
						return boostConfig.stoneId;
					else
						return boostConfig.stoneNum;
				}
			case 1:
				var gemConfig = UserForge.ins().getStoneLevelCostConfigByLv(lv + 1);
				if (gemConfig) {
					if (idOCount)
						return gemConfig.itemId;
					else
						return gemConfig.count;
				}
			case 2:
				var zhulingConfig = UserForge.ins().getZhulingCostConfigByLv(lv + 1);
				if (zhulingConfig)
					return zhulingConfig.soulNum;
			case 3:
				// var tupoConfig = UserForge.ins().getTupoCostConfigByLv(lv + 1);
				// if (tupoConfig) {
				// 	if (idOCount)
				// 		return tupoConfig.itemId;
				// 	else
				// 		return tupoConfig.count;
				// }
				return 0;
		}
		return 0;
	}

	OnBackClick(clickType: number): number {
		return 0
	}

	OnOpenIndex(openIndex: number): boolean {
		if (openIndex == 1) {
			return true;
		}
		else if (openIndex == 2) {
			return Deblocking.Check(DeblockingType.TYPE_76)
		}
		else if (openIndex == 3) {
			return Deblocking.Check(DeblockingType.TYPE_78)
		}
		return true
	}
}



ViewManager.ins().reg(ForgeWin, LayerManager.UI_Main);
window["ForgeWin"] = ForgeWin