class NewFunNotice extends BaseSystem {

	mainIndex = 0
	mainState = 0

	isHaveReward
	private FuncNoticeConfig:any;
	public constructor() {
		super()
		this.mainIndex = 0,
			this.mainState = 0,
			this.sysId = PackageID.NewFunNotice,
			this.regNetMsg(1, this.postFunNoticeInfo)
	}


	postFunNoticeInfo(t) {
		this.mainIndex = t.readInt(),
			this.mainState = t.readUnsignedByte(),
			this.isHaveReward = t.readBoolean(),
			console.log("this.mainIndex：" + this.mainIndex + "  this.mainState：\n		" + this.mainState + "  this.mainRewardState：" + this.isHaveReward)
	}
	sendRewardInfo() {
		this.sendBaseProto(1)
	}
	sendGetReward(t) {
		var e = this.getBytes(2);
		e.writeInt(t),
			this.sendToServer(e)
	}
	getFunConfByIndex(t) {
		if(this.FuncNoticeConfig == null)
			this.FuncNoticeConfig = GlobalConfig.ins("FuncNoticeConfig");
		var e = this.FuncNoticeConfig;
		if (Assert(e, "FuncNoticeConfig is null")) return null;
		for (var i in e) if (e[i].index == t) return e[i];
		return null
	}

	private funcOpenConfig:any;
	getFunOpenConfByIcon(t) {
		if(this.funcOpenConfig == null)
			this.funcOpenConfig = GlobalConfig.ins("FuncOpenConfig");

		if (Assert(this.funcOpenConfig, "FuncOpenConfig is null")) return null;
		for (var i in this.funcOpenConfig) 
			if (this.funcOpenConfig[i].mainicon == t) 
				return this.funcOpenConfig[i];
		return null
	}
	isOpenFunc(t) {
		var e = this.getFunOpenConfByIcon(t);
		if (Assert(e, "FuncOpenConfig data is null")) return !1;
		var i = 0;
		return e.openlv ? (i = GameLogic.ins().actorModel.level, i >= e.openlv) : e.openscene ? (i = UserFb.ins().guanqiaID, i >= e.openscene) : e.openzs ? (i = UserZs.ins().lv, i >= e.openzs) : !1
	}
}

MessageCenter.compile(NewFunNotice)
window["NewFunNotice"]=NewFunNotice