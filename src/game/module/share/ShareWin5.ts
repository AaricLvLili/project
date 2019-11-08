/** 分享返利*/
class ShareWin5 extends BaseView implements ICommonWindowTitle {
	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st101223;
	shop: eui.Button
	t1: eui.Label
	t3: eui.Label
	iconList: eui.List

	public constructor() {
		super()
		this.skinName = "ShareWin5Skin"
		this.name = GlobalConfig.jifengTiaoyueLg.st101223;
		this.iconList.itemRenderer = ShareWin5Item
		this.t3.text = GlobalConfig.jifengTiaoyueLg.st101218;
	}

	open(...param: any[]) {
		super.open(param);
		this.shop.addEventListener(egret.TouchEvent.TOUCH_TAP, ShareModel.onShop, ShareModel);
		MessageCenter.ins().addListener(ShareEvt.WX_SHARE, this.UpdateContent, this);
		this.UpdateContent()
	}


	close() {
		super.close();
		MessageCenter.ins().removeAll(this)
	}


	UpdateContent() {
		var cfg = GlobalConfig.share4Config[5][0]
		var n = cfg.Param1
		this.t1.textFlow = TextFlowMaker.generateTextFlow(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101224, [n]));

		var cfgs = []
		var model = ShareModel.ins().infos.redpackets
		this.t3.visible = model.length == 0;
		for (var i in model) {
			if (model[i].state == 1) cfgs.push(model[i]);
		}
		for (var i in model) {
			if (model[i].state == 2) cfgs.push(model[i]);
		}
		this.iconList.dataProvider = new eui.ArrayCollection(cfgs);
	}

	public CheckRedPoint(): boolean {
		return false
	}

} window["ShareWin5"] = ShareWin5
class ShareWin5Item extends eui.ItemRenderer {
	public constructor() {
		super()
		this.skinName = 'ShareItem5Skin';
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.click, this);
	}
	// redpacketId: number //单个红包id
	state: number //	# 领取状态 1待领取 2 已领取
	t1: eui.Label
	t2: eui.Image;

	public dataChanged() {
		this.state = this.data.state
		this.t1.text = this.data.sharecoin + ''
		if (this.state == 1) {
			this.t2.visible = false;
		}
		else {
			this.t2.visible = true;
		}
	}

	click() {
		if (this.state == 1) {
			
			let req = new Sproto.cs_operate_share_request;
			req.actId = 4  //好友
			req.subProto = "reward"
			req.subData = new Sproto.sub_proto_data
			req.subData.integer_data = [5]
			req.subData.string_data = this.data.strid
			GameSocket.ins().Rpc(C2sProtocol.cs_operate_share, req, null, this);//
		}
		else if (this.state == 2) UserTips.ErrorTip(GlobalConfig.jifengTiaoyueLg.st101225);
	}

}
window["ShareWin5Item"] = ShareWin5Item