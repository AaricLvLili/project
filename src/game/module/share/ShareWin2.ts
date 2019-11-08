/** 好友帮助*/
class ShareWin2 extends BaseView implements ICommonWindowTitle {
	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st101212;
	iconList: eui.List
	shop: eui.Button
	award: eui.Button
	t1: eui.Label
	t2: eui.Label
	t3: eui.Label
	bar: eui.ProgressBar
	public m_Lan1: eui.Label;
	public constructor() {
		super()
		this.skinName = "ShareWin2Skin"
		this.name = GlobalConfig.jifengTiaoyueLg.st101212;
		this.iconList.itemRenderer = ShareWin2Item
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st101215;
		this.award.label = GlobalConfig.jifengTiaoyueLg.st100004;
		this.t3.text = GlobalConfig.jifengTiaoyueLg.st101218;
	}

	open(...param: any[]) {
		super.open(param);
		this.shop.addEventListener(egret.TouchEvent.TOUCH_TAP, ShareModel.onShop, ShareModel);
		this.award.addEventListener(egret.TouchEvent.TOUCH_TAP, this.click, this);
		MessageCenter.ins().addListener(ShareEvt.WX_SHARE, this.UpdateContent, this);
		this.UpdateContent()
	}

	close() {
		super.close();
		MessageCenter.ins().removeAll(this)
	}

	click() {
		switch (this.award.label) {
			case GlobalConfig.jifengTiaoyueLg.st100680:
				UserTips.ErrorTip(GlobalConfig.jifengTiaoyueLg.st100680)
				break;
			case GlobalConfig.jifengTiaoyueLg.st100004:
				let req = new Sproto.cs_operate_share_request;
				req.actId = 4  //好友
				req.subProto = "reward"
				req.subData = new Sproto.sub_proto_data
				req.subData.integer_data = [1]
				GameSocket.ins().Rpc(C2sProtocol.cs_operate_share, req, null, this);//
				break;
			case GlobalConfig.jifengTiaoyueLg.st100981:
				UserTips.ErrorTip(GlobalConfig.jifengTiaoyueLg.st101211)
				break;
		}
	}

	UpdateContent() {
		var friend1 = ShareModel.ins().infos.helpcount
		var cfg = GlobalConfig.share4Config
		var state = false
		if (friend1 == cfg[1].length) {
			friend1 -= 1
			state = true
		}
		var cfg1 = cfg[1][friend1]
		var count = cfg1.tbReward[0].count
		var cfg1lv = cfg1.Param2
		var lv = cfg[2][0].Param1
		var award = cfg[2][0].tbReward[0].count
		this.t1.textFlow = TextFlowMaker.generateTextFlow(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101213, [cfg1.Param2]));

		this.t2.text = count + ''
		this.bar.maximum = cfg1.Param1
		var n = 0

		var arrays = [], arrays2 = [];
		var friendhelp = ShareModel.ins().infos.friendhelp as Sproto.friend_record[]
		this.t3.visible = friendhelp.length == 0;
		for (var i = 0; i < friendhelp.length; i++) {
			arrays.push({
				index: 2, level2: lv, award: award, level1: friendhelp[i].level, friendId: friendhelp[i].dbid,
				friendName:friendhelp[i].friendName,
				hasReward: friendhelp[i].taghelp, imgurl: friendhelp[i].imgurl,
			}) //index=2好友帮助-单人等级达标
			if (friendhelp[i].level >= cfg1lv) n++;
		}
		arrays.sort(function (a, b) {
			return b.level1 - a.level1;
		})
		for (var i = 0; i < arrays.length; i++) {
			if (arrays[i].level1 > arrays[i].level2) arrays2.push(arrays[i])
		}
		for (var i = 0; i < arrays.length; i++) {
			if (arrays[i].level1 == arrays[i].level2) arrays2.push(arrays[i])
		}
		for (var i = 0; i < arrays.length; i++) {
			if (arrays[i].level1 < arrays[i].level2) arrays2.push(arrays[i])
		}
		this.iconList.dataProvider = new eui.ArrayCollection(arrays2);

		if (n >= cfg1.Param1) {
			n = cfg1.Param1
			// this.award.visible = state ? false : true
			this.award.label = state ? GlobalConfig.jifengTiaoyueLg.st100981 : GlobalConfig.jifengTiaoyueLg.st100004
		}
		else {
			// this.award.visible = false
			this.award.label = GlobalConfig.jifengTiaoyueLg.st100680;
		}
		this.bar.value = n

	}

	public CheckRedPoint(): boolean {
		return false
	}

} window["ShareWin2"] = ShareWin2

class ShareWin2Item extends eui.ItemRenderer {
	public constructor() {
		super()
		this.skinName = 'ShareItem2Skin';
		this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.click, this);
		this.btn.label = GlobalConfig.jifengTiaoyueLg.st101210;
		this.t2.text = GlobalConfig.jifengTiaoyueLg.st100680;
	}
	static userInfo
	face: eui.Image
	pic: eui.Image
	t1: eui.Label
	t2: eui.Label
	t3: eui.Label
	friendName:eui.Label
	btn: eui.Button
	index: number //index=2好友帮助-单人等级达标 //index=3好友升级-单人等级达标
	hasReward = false //是否已领奖
	friendId

	public dataChanged() {
		this.t1.text = 'Lv：' + this.data.level1 + '/' + this.data.level2
		this.t3.text = GlobalConfig.jifengTiaoyueLg.st101214 + this.data.award
		this.index = this.data.index;
		this.friendId = this.data.friendId;
		this.hasReward = (this.data.hasReward == 2) ? true : false;
		if (SdkMgr.isWxGame() && this.data.imgurl && this.data.imgurl != '') {
			// this.face.source = WxSdk.imgURL;
			if (this.data.imgurl) this.face.source = this.data.imgurl
		}

		this.btn.visible = (this.data.level1 >= this.data.level2 && !this.hasReward) ? true : false
		this.pic.visible = (this.data.level1 >= this.data.level2 && this.hasReward) ? true : false
		this.t2.visible = this.data.level1 >= this.data.level2 ? false : true
		this.friendName.text = this.data.friendName;
	}

	click() {
		let req = new Sproto.cs_operate_share_request;
		req.actId = 4  //好友
		req.subProto = "reward"
		req.subData = new Sproto.sub_proto_data
		req.subData.integer_data = [this.index, this.friendId]
		GameSocket.ins().Rpc(C2sProtocol.cs_operate_share, req, null, this);//
	}

}
window["ShareWin2Item"] = ShareWin2Item