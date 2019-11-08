/** 好友助力*/
class ShareWin4 extends BaseView implements ICommonWindowTitle {
	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st101219;
	t1: eui.Label
	t2: eui.Label
	btn: eui.Button
	eff: eui.Group
	mc: MovieClip

	public constructor() {
		super()
		this.skinName = "ShareWin4Skin"
		this.name = GlobalConfig.jifengTiaoyueLg.st101219;
		this.btn.label = GlobalConfig.jifengTiaoyueLg.st100004;
	}

	open(...param: any[]) {
		super.open(param);
		MessageCenter.ins().addListener(ShareEvt.WX_SHARE, this.UpdateContent, this);
		this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
		this.UpdateContent()
	}

	close() {
		super.close();
		MessageCenter.ins().removeAll(this)
		DisplayUtils.dispose(this.mc);
		this.mc = null;
	}

	onTap() {
		var friendcount = ShareModel.ins().infos.newplayer
		if (friendcount == 2) UserTips.ErrorTip(GlobalConfig.jifengTiaoyueLg.st101220);
		else {
			let req = new Sproto.cs_operate_share_request;
			req.actId = 4  //好友
			req.subProto = "reward"
			req.subData = new Sproto.sub_proto_data
			req.subData.integer_data = [4] //好友助力-新人等级达标  
			GameSocket.ins().Rpc(C2sProtocol.cs_operate_share, req, null, this);//
		}
	}

	UpdateContent() {
		var friendcount = ShareModel.ins().infos.newplayer
		var cfg = GlobalConfig.share4Config[4][0]
		var lv = cfg.Param1
		// var n = friendcount >= 1 ? 1 : 0;
		var n = 0;
		var fs = ShareModel.ins().infos.friendhelp as Sproto.friend_record[]
		for (var i in fs) {
			if (fs[i].level >= cfg.Param1) n++;
		}
		this.t2.textFlow = TextFlowMaker.generateTextFlow(GlobalConfig.jifengTiaoyueLg.st101221 + '<font color=#008f22>' + n + '</font>')
		this.t1.textFlow = TextFlowMaker.generateTextFlow(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101222, [lv]))
		this.btn.visible = n > 0 ? true : false
		this.btn.label = friendcount == 2 ? GlobalConfig.jifengTiaoyueLg.st101220 : GlobalConfig.jifengTiaoyueLg.st100004;
		this.btn.enabled = friendcount == 2 ? false : true

		if (!this.mc) {
			this.mc = new MovieClip
			this.mc.loadUrl(ResDataPath.GetMonsterBodyPath("monster10013" + "_3" + EntityAction.STAND), true, -1)
			this.mc.scaleX = this.mc.scaleY = 0.8;
			this.eff.addChild(this.mc)
		}
	}

	public CheckRedPoint(): boolean {
		return false
	}

} window["ShareWin4"] = ShareWin4 
