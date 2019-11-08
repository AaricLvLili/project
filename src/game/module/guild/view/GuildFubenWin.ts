class GuildFubenWin extends BaseView implements ICommonWindowTitle {

	tarValue = 0;

	list
	// list1
	challage
	sweepBtn: eui.Button;
	zhuwei
	zhuwei0
	// starValue
	redPoint0
	redPoint2
	/** 关卡波数*/
	private guanka: eui.Label;
	reward

	roleNum
	monstInfo
	recordka
	everydaySweep
	rolename
	tongguanrecord
	cheeringeffect
	// roleimage
	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st100980;
	private groupBoss: eui.Group
	private bossmc: MovieClip;
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;
	public m_Lan3: eui.Label;
	public m_Lan4: eui.Label;

	public constructor() {
		super();

		this.name = GlobalConfig.jifengTiaoyueLg.st100980;;
		this.skinName = "GuildFubenSkin";
		GuildFB.ins().sendGuildFBRankInfo();
		GuildFB.ins().sendGuildFBMaxGKInfo();
		this.list.itemRenderer = GuildFBRankItemRender;
		// this.list1.itemRenderer = GuildFBRewardItemRender;

		this.bossmc = new MovieClip;
		this.bossmc.x = this.groupBoss.width / 2;
		this.bossmc.y = this.groupBoss.height / 2;
		this.bossmc.scaleX = -1;
		this.bossmc.scaleY = 1;
		this.bossmc.touchEnabled = false;
		this.groupBoss.addChild(this.bossmc);

		this.challage.label = GlobalConfig.jifengTiaoyueLg.st100046;
		this.zhuwei.label = GlobalConfig.jifengTiaoyueLg.st101003;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101004;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st100380;
		this.m_Lan3.text = GlobalConfig.jifengTiaoyueLg.st100992;
		this.m_Lan4.text = GlobalConfig.jifengTiaoyueLg.st101004;
	}

	open() {
		var param = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			param[_i - 0] = arguments[_i];
		}
		this.challage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.sweepBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.zhuwei.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.zhuwei0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		MessageCenter.addListener(GuildFB.ins().postGuildFubenInfo, this.updateData, this);
		// MessageCenter.addListener(GuildFB.ins().postGuildFBSweepEnd, this.sweepClose, this);
		MessageCenter.addListener(GuildFB.ins().postGuildFBSweep, this._DoGuildFBSweep, this);

		this.updateData();
		GuildFB.ins().sendGuildFBRankInfo();
		GuildFB.ins().sendGuildFBMaxGKInfo();
	};
	close() {
		var param = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			param[_i - 0] = arguments[_i];
		}
		this.challage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.sweepBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.zhuwei.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.zhuwei0.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);


		MessageCenter.ins().removeAll(this)
		// this.sweepClose();
	};

	private _DoGuildFBSweep() {
		this.starSaoDang()
	}

	private _UpdateRedPoint0() {
		if (GuildFB.ins().sweep >= 1 || GuildFB.ins().fbNum == GuildFB.ins().sweepNum) {
			this.sweepBtn.enabled = false;
			this.redPoint0.visible = false;
			this.sweepBtn.label = GlobalConfig.jifengTiaoyueLg.st100352;
			return
		}
		this.sweepBtn.enabled = true
		if (GuildFB.ins().fbNum > 0)
			this.redPoint0.visible = true;
	}

	updateData() {
		this.redPoint0.visible = false;
		this.redPoint2.visible = false;
		if (GuildFB.ins().fbNum >= 300) {
			this.guanka.text = GlobalConfig.jifengTiaoyueLg.st100991;
			this.reward.visible = false;
		}
		else
			this.guanka.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100390, [GuildFB.ins().fbNum + 1]);
		this._UpdateRedPoint0()
		if (GuildFB.ins().tongguan >= 1) {
			this.zhuwei0.enabled = false;
			this.zhuwei0.label = GlobalConfig.jifengTiaoyueLg.st100981;
			this.redPoint2.visible = false;
		}
		else {
			this.zhuwei0.enabled = true;
			this.zhuwei0.label = GlobalConfig.jifengTiaoyueLg.st100982;
			if (GuildFB.ins().rewardNum != 0)
				this.redPoint2.visible = true;
		}
		if (GuildFB.ins().zuwei >= 1) {
			this.zhuwei.enabled = false;
		}
		this.roleNum.text = GlobalConfig.jifengTiaoyueLg.st100983 + GuildFB.ins().nextFb;
		var att = GuildFB.ins().nextFb * GlobalConfig.guildfbconfig.attrParam;
		var attInt = (att > GlobalConfig.guildfbconfig.maxAttr ? GlobalConfig.guildfbconfig.maxAttr : att) * 100;
		this.monstInfo.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100984, [attInt >> 0]);
		this.recordka.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100985, [GuildFB.ins().fbNum]);
		this.everydaySweep.text = LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100986, [GuildFB.ins().sweep]);

		var monster = '';
		if (GlobalConfig.ins("guildfbAwardConfig")[GuildFB.ins().fbNum + 2])
			monster = GlobalConfig.ins("guildfbAwardConfig")[GuildFB.ins().fbNum + 2].monid;
		if (monster != null && monster != "") {
			monster = GlobalConfig.monstersConfig[monster].avatar;
			this.bossmc.loadUrl(ResDataPath.GetMonsterBodyPath(monster + "_3s"), true, -1);
		}

		if (GuildFB.ins().isMaxGK == 0) {
			this.rolename.text = GlobalConfig.jifengTiaoyueLg.st100378;
			this.tongguanrecord.text = GlobalConfig.jifengTiaoyueLg.st100987;
			this.cheeringeffect.text = GlobalConfig.jifengTiaoyueLg.st100988;
		}
		else {
			this.rolename.text = GuildFB.ins().maxName;
			this.tongguanrecord.textFlow = (new egret.HtmlTextParser).parser(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100989, [GuildFB.ins().maxNum]));
			var cheer = GuildFB.ins().maxZhuwei * GlobalConfig.guildfbconfig.cheerParam;
			var cheerfen = (cheer > GlobalConfig.guildfbconfig.maxCheer ? GlobalConfig.guildfbconfig.maxCheer : cheer) * 100;
			this.cheeringeffect.textFlow = (new egret.HtmlTextParser).parser(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st100990, [cheerfen >> 0]));
			// this.roleimage.source = ResDataPath.GetHeadMiniImgName(GuildFB.ins().maxCareer, GuildFB.ins().maxSex)
		}
		this.list.dataProvider = new eui.ArrayCollection(GuildFB.ins().rankDatas);
		var rewardAry = [];
		for (var k in GlobalConfig.ins("guildfbDayAwardConfig")) {
			var obj = new Object();
			obj["id"] = k;
			obj["info"] = GlobalConfig.ins("guildfbDayAwardConfig")[k];
			rewardAry.push(obj);
		}
		// this.list1.dataProvider = new eui.ArrayCollection(rewardAry);
		var itemid;
		for (var m in GlobalConfig.ins("guildfbAwardConfig")) {
			if ((GuildFB.ins().fbNum + 1) == GlobalConfig.ins("guildfbAwardConfig")[m].id) {
				itemid = GlobalConfig.ins("guildfbAwardConfig")[m].waveAward;
			}
		}
		if (itemid != undefined) {
			this.reward.data = itemid;
			this.reward.isShowName(false);
		}
	};
	starSaoDang() {
		if (GuildFB.ins().fbNum - GuildFB.ins().sweepNum > 0 && UserBag.ins().getSurplusCount() > 0) {
			this.sweepBtn.label = GlobalConfig.jifengTiaoyueLg.st100350;
			GuildFB.ins().sendGuildFBSweep();
		}
		this._UpdateRedPoint0()
	};
	onTap(e) {
		switch (e.currentTarget) {
			case this.challage:
				if (GuildFB.ins().fbNum >= 300) {
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100993);
					return;
				}
				GuildFB.ins().sendGuildFBChallange();
				ViewManager.ins().close(GuildMap);
				ViewManager.ins().close(GuildWin);
				ViewManager.ins().close(GuildActivityWin);
				break;
			case this.sweepBtn:
				if (GuildFB.ins().fbNum == 0) {
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100994);
					return;
				}
				if (GuildFB.ins().sweep >= 1) {
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100995);
					return;
				}
				if (UserBag.ins().getSurplusCount() <= 0) {
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100051);
					return;
				}
				WarnWin.show(GlobalConfig.jifengTiaoyueLg.st101990, () => {
					this.starSaoDang();
				}, this);
				break;
			case this.zhuwei:
				if (GuildFB.ins().isMaxGK == 0) {
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100998);
					return;
				}
				if (GuildFB.ins().fbNum == 0) {
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100999);
					return;
				}
				if (GuildFB.ins().maxZhuwei * GlobalConfig.guildfbconfig.cheerParam > GlobalConfig.guildfbconfig.maxCheer) {
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101000);
					return;
				}
				GuildFB.ins().sendGuildFBZhuwei();
				break;
			case this.zhuwei0:
				if (GuildFB.ins().rewardNum == 0) {
					UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101001);
					return;
				}
				WarnWin.show(GlobalConfig.jifengTiaoyueLg.st101002, function () {
					GuildFB.ins().sendGuildFBReward();
				}, this);
				break;
		}
	};

	UpdateContent(): void {

	}
}
window["GuildFubenWin"] = GuildFubenWin