//分享Model
class ShareModel extends BaseSystem {
	public static ins(): ShareModel {
		return super.ins()
	}
	public constructor() {
		super();
		this.regNetMsg(S2cProtocol.sc_share_init_info, this.update)
		this.regNetMsg(S2cProtocol.sc_share_notify, this.updateItem)
		this.regNetMsg(S2cProtocol.sc_share_buffer, this.updateBuff)
		GameGlobal.MessageCenter.addListener(MessageDef.SOCKE_RENEECTED_SUCCESS, this.shareLinJoin, this);
	}

	private shareLinJoin() {
		if (!WxSdk.ins().shareLinJoin) return;

		WxSdk.ins().shareSend();
		WxSdk.ins().shareLinJoin = false;
	}

	updateBuff(bytes: Sproto.sc_share_buffer_request) {
		this.bufftime = bytes.lefttime
		this.bufftime2 = Math.floor(egret.getTimer() / 1000);
		if (this.bufftime > 0 && (Main.isDebug || SdkMgr.isWxGame())) ViewManager.ins().open(ShareBuffWin);
	}

	bufftime = 0;//分享buff剩余时间 秒
	bufftime2 = 0;
	infos = {
		firstshare: 2,//首次分享 #0为未分享、1为可领取、2为已领取，同时控制入口是否隐藏
		dailyshare: { count: 0, reward: 1, s: 0, cdtime: 0 },// 每日分享 #count分享次数  #reward分享0未领取1已领取
		accumulateshare: { count: 0, rewards: [] },// 累计分享 #count分享次数
		friendhelp: [],
		helpcount: 0,           // # 受邀玩家达到等级已完成领取阶段 默认认为o
		newplayer: 0,           //  # 新用户达到等级 0 不满足条件 1 未领取  2 已领取
		redpackets: []
		// shareCoin: 0, //分享币
	}
	update(bytes: Sproto.sc_share_init_info_request) {
		this.infos.firstshare = bytes.actinfos.act1.joinState
		this.infos.dailyshare.count = bytes.actinfos.act2.shareCount
		this.infos.dailyshare.reward = bytes.actinfos.act2.rewardState
		this.infos.dailyshare.cdtime = bytes.actinfos.act2.cdtime
		this.infos.dailyshare.s = Math.floor(egret.getTimer() / 1000);
		if (this.infos.dailyshare.count == 0) this.infos.dailyshare.reward = 1;
		this.infos.accumulateshare.count = bytes.actinfos.act3.shareCount
		this.infos.accumulateshare.rewards = bytes.actinfos.act3.reward
		if (bytes.actinfos.act4.frienddata) this.infos.friendhelp = bytes.actinfos.act4.frienddata;
		this.infos.helpcount = bytes.actinfos.act4.helpcount
		this.infos.newplayer = bytes.actinfos.act4.newplayer
		if (bytes.actinfos.act4.redpacket) this.infos.redpackets = bytes.actinfos.act4.redpacket;
		GameGlobal.MessageCenter.dispatch(ShareEvt.WX_SHARE)
	}
	updateItem(bytes: Sproto.sc_share_notify_request) {
		switch (bytes.actId) {
			case 1:
				this.infos.firstshare = bytes.param1
				break;
			case 2:
				if (this.infos.dailyshare.count != bytes.param1) {
					this.infos.dailyshare.count = bytes.param1
					this.infos.dailyshare.s = Math.floor(egret.getTimer() / 1000);
					this.infos.dailyshare.cdtime = -1;
				}
				this.infos.dailyshare.reward = bytes.param2
				if (this.infos.dailyshare.count == 0) this.infos.dailyshare.reward = 1;
				break;
			case 3:
				if (bytes.param1 == -1) {
					this.infos.accumulateshare.count = bytes.param2
				}
				else {
					var rewards = this.infos.accumulateshare.rewards as Sproto.sub_accumulatedata[];
					for (var i in rewards) {
						if (rewards[i].index == bytes.param1) rewards[i].state = bytes.param2;
					}
				}
				break;
			case 4:
				if (bytes.param1 == 3) { //好友信息
					var arr = this.infos.friendhelp
					var t = true
					for (var i in arr) {
						if (arr[i].dbid == bytes.friend.dbid) {
							t = false
							if (bytes.friend.level) arr[i].level = bytes.friend.level;
							if (bytes.friend.taghelp) arr[i].taghelp = bytes.friend.taghelp;
							if (bytes.friend.taglevelup) arr[i].taglevelup = bytes.friend.taglevelup;
						}
					}
					if (t) arr.push(bytes.friend);
				}
				if (bytes.param1 == 1) { //
					this.infos.helpcount = bytes.param2
				}
				if (bytes.param1 == 2) {
					this.infos.newplayer = bytes.param2
				}
				if (bytes.param1 == 4) { //返利红包
					var arr = this.infos.redpackets
					var t = true
					for (var i in arr) {
						if (arr[i].strid == bytes.redpacket.strid) {
							t = false
							arr[i] = bytes.redpacket
						}
					}
					if (t) arr.push(bytes.redpacket);
				}
				break;
			default:
				break;
		}
		GameGlobal.MessageCenter.dispatch(ShareEvt.WX_SHARE)
	}

	static onShop() {
		ViewManager.ins().open(ShopWin, 7)//分享商店
	}

	public getCd() {
		var tempCd = 0;
		var info = ShareModel.ins().infos.dailyshare
		var index = info.count + info.reward
		var cfgs = GlobalConfig.share2Config
		var max = Object.keys(cfgs).length;
		index = index > max ? max : index
		var time = 0
		if (info.cdtime > 0) time = info.cdtime;
		if (info.cdtime == -1) time = cfgs[index].cdTime;
		if (info.cdtime == 0) time = 0;
		tempCd = info.s + time - Math.floor(egret.getTimer() / 1000);
		tempCd = tempCd < 0 ? 0 : tempCd;
		return tempCd;
	}

} window["ShareModel"] = ShareModel 
