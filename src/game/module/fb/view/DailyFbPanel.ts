class DailyFbPanel extends BaseView implements ICommonWindowTitle {


	fbDataList = [3003, 3002, 3007, 3008, 3004, 3006, 3011, 3005, 3009, 3010, 3001];
	fbList: eui.List;
	private dailyFubenConfig: any;
	public constructor(data?: any) {
		super();
		this.skinName = "DailyFbPanelSkin";
	}
	protected childrenCreated(): void {
		this.fbDataList = GlobalConfig.ins("UniversalConfig")["fbOrder"];
		this.fbList.itemRenderer = FbItem;
		this.fbList.dataProvider = new eui.ArrayCollection(this.fbDataList);
		this.fbList.useVirtualLayout = false
	}

	open(): void {
		this.observe(MessageDef.FB_COUNT_UPDATE, this.UpdateContent)
		this.fbList.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
	}

	close(): void {
		this.fbList.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
	}

	onTap(e) {
		switch (e.currentTarget) {
			default:
				if (e.target instanceof eui.Button) {
					var fbID_1 = e.target.parent.data;
					if (this.dailyFubenConfig == null)
						this.dailyFubenConfig = GlobalConfig.dailyFubenConfig;
					var fbConfig = this.dailyFubenConfig[fbID_1];
					if (e.target.name == 'add') {
						var vipLv = UserVip.ins().lv;
						var canBuyCount = fbConfig.vipBuyCount[vipLv];
						if (canBuyCount <= 0) {
							UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100347);
							return;
						}
						var buyPrice = fbConfig.buyPrice[UserFb.ins().getFbDataById(fbID_1).vipBuyCount];
						if (!(GameLogic.ins().actorModel.yb >= buyPrice)) {
							UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100008);
							return;
						}
						//WarnWin.show("是否消耗<font color='#FFB82A'>" + buyPrice + "钻石</font>扫荡1次\n【" + fbConfig.name + "】？<font color='#007BFF'>扫荡将直接获得副本奖励</font>", () => {
						var index = this.fbDataList.lastIndexOf(fbID_1);
						(<FbItem>this.fbList.getChildAt(index)).starSaoDang();
						//}, this);
					}
					else if (e.target.name == 'vip') {
						ViewManager.ins().open(VipWin);
					}
					else {
						var fbInfos = UserFb.ins().getFbDataById(fbID_1);
						if (fbInfos && fbInfos.getCount() <= 0) {
							UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100348);
						}
						else if (fbConfig.funcOpenId && !Deblocking.Check(fbConfig.funcOpenId)) {//fbConfig.levelLimit > GameLogic.ins().actorModel.level
							// UserTips.ins().showTips("|C:0xf87372&T:转生或等级不足|");
						}
						else {
							UserFb.ins().sendChallenge(fbID_1);
							ViewManager.ins().close(FbWin);
						}
					}
				}
		}
	};

	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st100349

	UpdateContent(): void {
		(<eui.ArrayCollection>this.fbList.dataProvider).replaceAll(this.fbDataList);
	}
}
window["DailyFbPanel"] = DailyFbPanel