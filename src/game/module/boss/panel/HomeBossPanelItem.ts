class HomeBossPanelItem extends eui.Component {
	/**底图 */
	private m_Bg: eui.Image;
	/**层数图片 */
	private m_LayerNumImg: eui.Label;
	/**刷新时间文本 */
	private m_RefTiemLab: eui.Label;
	/**开启等级文本 */
	private m_OpenLvLab: eui.Label;
	/**下次刷新时间 */
	public m_NextRefTiemLab: eui.Label;
	/**道具 */
	private m_ItemList: eui.List;
	/**vip等级文本  */
	private m_VipLvLab: eui.Label;
	/**前往图片 */
	private m_KillBossImg: eui.Button;

	private listData: eui.ArrayCollection;

	private vipLv: number;

	private layerLv: HomeBossLayerType;
	private m_RedPoint: eui.Image;
	private m_pTouchGroup: eui.Group;
	public m_Lan1:eui.Label;
	public m_Lan2:eui.Label;


	public constructor() {
		super();

	}
	protected childrenCreated() {
		super.childrenCreated();
		this.m_RedPoint.visible = false;
		this.m_ItemList.itemRenderer = ItemBase;
		this.listData = new eui.ArrayCollection();
		this.m_ItemList.dataProvider = this.listData;
		this.m_pTouchGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickKillBoss, this);
		MessageCenter.ins().addListener(MessageDef.HOMEBOSS_BOSSMSG_UPDATE, this.refRedPoint, this);

		this.m_KillBossImg.label=GlobalConfig.jifengTiaoyueLg.st100510;
		this.m_Lan1.text=GlobalConfig.jifengTiaoyueLg.st100511;
		this.m_Lan2.text=GlobalConfig.jifengTiaoyueLg.st100467;
	}
	public initData(layer: HomeBossLayerType) {
		this.layerLv = layer;
		this.m_LayerNumImg.text = layer + GlobalConfig.jifengTiaoyueLg.st100383;
		this.m_Bg.source = "comp_289_231_0" + layer + "_png";
		let publicBossBaseConfig: any = GlobalConfig.ins("PublicBossBaseConfig");
		let publicBossConfig: any = GlobalConfig.ins("PublicBossConfig");
		if (publicBossBaseConfig) {
			let refTiem: string = publicBossBaseConfig.vipRefreshTime[layer - 1];
			if (refTiem) {
				this.m_RefTiemLab.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100508, [refTiem]);
			}
			let openLv: string = publicBossBaseConfig.vipOpenTips[layer - 1];
			if (openLv) {
				this.m_OpenLvLab.text = openLv;
			}
			let vipOpenlLimit = publicBossBaseConfig.vipOpenlLimit[layer - 1];
			if (vipOpenlLimit) {
				this.m_VipLvLab.text = `VIP${vipOpenlLimit}`+GlobalConfig.jifengTiaoyueLg.st100391;
				this.vipLv = parseInt(vipOpenlLimit);
			}
			if (publicBossConfig) {
				let vipAwardShow = publicBossBaseConfig.vipAwardShow[layer - 1];
				let bossData = publicBossConfig[vipAwardShow][0];
				this.listData.replaceAll(bossData.desc);
			}
		}
	}
	private onClickKillBoss() {
		let vipLv = UserVip.ins().lv;
		// var lv = GameLogic.ins().actorModel.level;
		// var zs = UserZs.ins() ? UserZs.ins().lv : 0;
		// this.lvTxt.text = (zs ? zs + "转" : "") + lv + "级";
		if (vipLv >= this.vipLv) {
			MessageCenter.ins().dispatch(MessageDef.HOMEBOSS_PANEL_CHANGE, this.layerLv);
		} else {
			UserTips.ins().showTips(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100509,[this.vipLv,this.layerLv]));
		}
	}


	public refRedPoint() {
		this.m_RedPoint.visible = HomeBossModel.getInstance.checkLayerRedPoint(this.layerLv);
	}
}
window["HomeBossPanelItem"] = HomeBossPanelItem