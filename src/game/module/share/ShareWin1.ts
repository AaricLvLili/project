/** 累计分享*/
class ShareWin1 extends BaseView implements ICommonWindowTitle {
	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st101206;
	iconList: eui.List
	shop: eui.Button
	t1: eui.Label
	bar: eui.ProgressBar
	public constructor() {
		super()
		this.skinName = "ShareWin1Skin"
		this.name = GlobalConfig.jifengTiaoyueLg.st101206;
		this.iconList.itemRenderer = ShareWin1Item
	}

	open(...param: any[]) {
		super.open(param);
		this.shop.addEventListener(egret.TouchEvent.TOUCH_TAP, ShareModel.onShop, ShareModel);
		MessageCenter.ins().addListener(ShareEvt.WX_SHARE, this.UpdateContent, this);
		this.UpdateContent
	}


	close() {
		super.close();
		MessageCenter.ins().removeAll(this)
	}


	UpdateContent() {
		var cfg = GlobalConfig.share3Config
		var cfgs = []
		for (var i in cfg) {
			cfgs.push(cfg[i])
		}
		this.iconList.dataProvider = new eui.ArrayCollection(cfgs);

		var count = ShareModel.ins().infos.dailyshare.count
		count = count > 5 ? 5 : count
		this.bar.value = count
		this.t1.textFlow = TextFlowMaker.generateTextFlow(GlobalConfig.jifengTiaoyueLg.st101207);
	}

	public CheckRedPoint(): boolean {
		return false
	}

} window["ShareWin1"] = ShareWin1

class ShareWin1Item extends eui.ItemRenderer {
	public constructor() {
		super()
		this.skinName = 'ShareItem1Skin';
		this.list.itemRenderer = ItemBase
		this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.click, this);
		this.btn.label=GlobalConfig.jifengTiaoyueLg.st101210;
		this.t2.text=GlobalConfig.jifengTiaoyueLg.st100680;
	}
	list: eui.List
	t1: eui.Label
	t2: eui.Label
	public t0: eui.Label;

	btn: eui.Button
	pic: eui.Image
	hasAward = 0;//# 0 不满足条件 1 未领取  2 已领取
	public dataChanged() {
		this.list.dataProvider = new eui.ArrayCollection(this.data.tbReward);
		var n1 = ShareModel.ins().infos.accumulateshare.count
		var n2 = this.data.ConditionNum
		this.t1.textFlow = TextFlowMaker.generateTextFlow(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101208, [n2]))
		this.t0.textFlow = TextFlowMaker.generateTextFlow(GlobalConfig.jifengTiaoyueLg.st101209 + n1 + '/' + n2);

		var rewards = ShareModel.ins().infos.accumulateshare.rewards as Sproto.sub_accumulatedata[];
		for (var i in rewards) {
			if (rewards[i].index == this.data.Index) this.hasAward = rewards[i].state ? rewards[i].state : 0;
		}
		this.t2.visible = (this.hasAward == 0) ? true : false
		this.btn.visible = (this.hasAward == 1) ? true : false
		this.pic.visible = (this.hasAward == 2) ? true : false
	}

	click() {
		if (this.hasAward == 2) UserTips.ErrorTip(GlobalConfig.jifengTiaoyueLg.st100981);
		else if (this.hasAward == 1) {
			let req = new Sproto.cs_operate_share_request;
			req.actId = 3  //累计分享
			req.subProto = "reward"
			req.subData = new Sproto.sub_proto_data
			req.subData.integer_data = [this.data.Index]
			GameSocket.ins().Rpc(C2sProtocol.cs_operate_share, req, null, this);//
		}
	}

}
window["ShareWin1Item"] = ShareWin1Item