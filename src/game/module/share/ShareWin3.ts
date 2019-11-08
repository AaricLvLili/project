/** 好友升级*/
class ShareWin3 extends BaseView implements ICommonWindowTitle {
	windowTitleIconName: string = GlobalConfig.jifengTiaoyueLg.st101216;
	shop: eui.Button
	t1: eui.Label
	t3: eui.Label
	iconList: eui.List

	public constructor() {
		super()
		this.skinName = "ShareWin3Skin"
		this.name = GlobalConfig.jifengTiaoyueLg.st101216;
		this.iconList.itemRenderer = ShareWin2Item;
		this.t3.text=GlobalConfig.jifengTiaoyueLg.st101218;
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
		var cfg = GlobalConfig.share4Config[3][0]
		var lv = cfg.Param1
		var award = cfg.tbReward[0].count
		this.t1.textFlow = TextFlowMaker.generateTextFlow(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101217, [lv]));

		var arrays = [], arrays2 = [];
		var friendhelp = ShareModel.ins().infos.friendhelp as Sproto.friend_record[]
		this.t3.visible = friendhelp.length == 0;
		for (var i = 0; i < friendhelp.length; i++) {
			arrays.push({
				index: 3, level2: lv, award: award, level1: friendhelp[i].level, friendId: friendhelp[i].dbid,
				friendName:friendhelp[i].friendName,
				hasReward: friendhelp[i].taglevelup, imgurl: friendhelp[i].imgurl,
			}) //index=3好友升级-单人等级达标
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
	}

	public CheckRedPoint(): boolean {
		return false
	}

} window["ShareWin3"] = ShareWin3 
