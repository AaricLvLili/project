class FbItem extends eui.ItemRenderer {
	public constructor() {
		super();
	}
	//public bg: eui.Image;
	public challengeBtn: eui.Button;
	public redPoint: eui.Image;
	price;
	item;
	public needLv: eui.Group;
	public completeImg: eui.Image;
	public levelRequire: eui.Label;
	public barbg: eui.Image;
	public bar: eui.ProgressBar;
	public count: eui.Label;
	public countBg: eui.Image;
	public lableReward: eui.Label;
	public lableRewardBg: eui.Image;
	public m_RewardsLab: eui.Label;
	public m_RewardsLabBg: eui.Image;
	public titleTxt:eui.Label;
	public priceTxt:eui.Label;

	starValue


	private dailyFubenConfig: any;


	createChildren() {
		super.createChildren()
		//this.item.isShowName(false);
		this.starValue = 0;
	};
	starSaoDang() {
		TimerManager.ins().doTimer(50, 20, this.refushBar, this, this.overPlay, this);
		this.bar.visible = true;
		//this.barbg.visible = true;
		this.bar.labelFunction = function () {
			return GlobalConfig.jifengTiaoyueLg.st100350;
		};
	};
	refushBar() {
		this.challengeBtn.enabled = false;
		this.starValue += 5;
		this.bar.value = this.starValue;
	};
	overPlay() {      /*发送数据*/
		if (this.starValue != 0) {
			this.bar.visible = false;
			this.barbg.visible = false;
			this.challengeBtn.enabled = true;
			this.starValue = 0;
			UserFb.ins().sendAddCount(this.data);
		}
	};
	dataChanged() {
		var t = parseInt(this.data) % 1e3 >> 0;
		
		//this.bg.source = `comp_145_38_${t}_png`;
		if (this.dailyFubenConfig == null)
			this.dailyFubenConfig = GlobalConfig.dailyFubenConfig;

		var config = this.dailyFubenConfig[this.data];
		this.item.data = config.showItem[0];
		this.titleTxt.text = config.name
		if (config.funcOpenId) {
			if (Deblocking.Check(config.funcOpenId, true)) {
				this.currentState = 'canChallenge';
			} else {
				this.currentState = 'noChallenge';
				if (Deblocking.funcOpenConfig == null)
					Deblocking.funcOpenConfig = GlobalConfig.ins("FuncOpenConfig");
				this.levelRequire.text = Deblocking.funcOpenConfig[config.funcOpenId].opencondition
			}
		}


		var fbInfos = UserFb.ins().getFbDataById(this.data);
		if (fbInfos == null) {
			console.error(`FB${this.data} data not found`)
			return
		}
		this.lableReward.textFlow = (new egret.HtmlTextParser()).parser(config.des + "<font color=\"" + "#40D016" + "\">" + fbInfos.getNextReward() + "</font>");


		var count = fbInfos.getCount();
		let type = 0	// 0、挑战  1、扫荡	2、额外扫荡
		if (count <= 0) {
			type = 2    /*额外扫荡*/
		}
		this.redPoint.visible = count > 0;
		let txt = type == 0 ? GlobalConfig.jifengTiaoyueLg.st100351 : (type == 1 ? GlobalConfig.jifengTiaoyueLg.st100352 : GlobalConfig.jifengTiaoyueLg.st100353);
		let leftcount = count

		if (type == 2) {
			leftcount = fbInfos.getSaoDangCount()
			this.m_RewardsLab.visible = true;
			this.m_RewardsLabBg.visible = true
			this.m_RewardsLab.textFlow = (new egret.HtmlTextParser()).parser(config.des2 + "<font color=\"" + "#40D016" + "\">" + config.desParam2 + "</font>");
		} else {
			this.m_RewardsLab.visible = false;
			this.m_RewardsLabBg.visible = false
		}
		if (this.currentState == "noChallenge") {
			this.m_RewardsLab.visible = false;
			this.m_RewardsLabBg.visible = false
		} else if (type == 2) {
			this.m_RewardsLab.visible = true;
			this.m_RewardsLabBg.visible = true
		}
		var color = leftcount > 0 ? "#40D016" : "#DFD1B5";
		let vipLv = UserVip.ins().lv;
		this.challengeBtn.enabled = true;
		this.count.textFlow = (new egret.HtmlTextParser()).parser(txt + GlobalConfig.jifengTiaoyueLg.st100356+"：<font color=\"" + color + "\">" + leftcount +GlobalConfig.jifengTiaoyueLg.st100024+"</font>");
		if (vipLv < config.vipxz && type == 2) {
			let text: string = "VIP" + config.vipxz;
			this.count.textFlow = (new egret.HtmlTextParser()).parser("<font color=\"" + "#e40202" + "\">" + text + "</font>"+GlobalConfig.jifengTiaoyueLg.st100357);
			this.challengeBtn.enabled = false;
		}
		this.price.visible = (type == 2 && this.currentState == "canChallenge");
		this.challengeBtn.label = type == 0 ? GlobalConfig.jifengTiaoyueLg.st100354 : GlobalConfig.jifengTiaoyueLg.st100355;    // 让其不在显示“挑战"全部显示"扫荡"
		this.challengeBtn.name = type == 0 ? "" : "add";

		this.lableReward.visible = (type == 0 || this.currentState == 'noChallenge') ? false : true;
		this.lableRewardBg.visible = (type == 0 || this.currentState == 'noChallenge') ? false : true
		// this.count.verticalCenter = -45;
		// this.count.left = 129;
		// this.count.top = 500;
		if (type == 2) {
			if (leftcount <= 0) {
				/*
				this.challengeBtn.enabled = false;
				this.count.text = "今日扫荡次数已经用ּ完";
				this.count.verticalCenter = 0;
				this.count.right = 50; 
				this.challengeBtn.visible = false;
				this.price.visible = false;
				*/
				// var resetCount = fbInfos.getResetCount();
				// if (resetCount <= 0) {
				var nextCount = fbInfos.getNextVip();
				switch (nextCount) {
					case -1:
						this.count.text = GlobalConfig.jifengTiaoyueLg.st100358;
						// this.count.verticalCenter = 0;
						// this.count.right = 50;
						this.challengeBtn.visible = false;
						this.price.visible = false;
						this.lableReward.visible = false;
						break;
					default:
						/*
						if (UserVip.ins().lv < nextCount) {
							this.count.textFlow = (new egret.HtmlTextParser()).parser(`<font color="#e40202">VIP${nextCount}</font>可额外扫荡1次`);
							this.challengeBtn.enabled = false;
						}
						else {
							this.count.text = `VIP${nextCount}可额外扫荡1次`;
							this.challengeBtn.enabled = true;
						}
						*/
						this.challengeBtn.enabled = true;
						var vipAddCount = fbInfos.getVipResetCount(nextCount)
						if (vipLv >= config.vipxz) {
							this.count.textFlow = (new egret.HtmlTextParser()).parser(`<font color="#e40202">VIP${nextCount}</font>`+GlobalConfig.jifengTiaoyueLg.st100359+`${vipAddCount}`+GlobalConfig.jifengTiaoyueLg.st100024);
						} else {
							this.count.textFlow = (new egret.HtmlTextParser()).parser(`<font color="#e40202">VIP4</font>`+GlobalConfig.jifengTiaoyueLg.st100357);
							this.challengeBtn.enabled = false;
						}
						this.price.visible = false;
						this.challengeBtn.label = GlobalConfig.jifengTiaoyueLg.st100360;
						this.challengeBtn.name = "vip";
						break;
				}
			}
		}
		//this.price.setPrice(config.buyPrice[fbInfos.vipBuyCount]);
		this.priceTxt.text = config.buyPrice[fbInfos.vipBuyCount] + ''
	};
}
window["FbItem"] = FbItem