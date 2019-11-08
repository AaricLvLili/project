class Setting extends BaseSystem {

	static currPart
	static _currStep
	static setting
	public constructor() {
		super()

		this.sysId = PackageID.Default;
		this.regNetMsg(19, this.parser);
	}

	public static get currStep() {
		return this._currStep;
	}

	public static set currStep(value: number) {
		this._currStep = value;
	}

	parser(bytes) {
		Setting.currPart = bytes.readByte();
		Setting.currStep = bytes.readByte();
		Setting.setting = bytes.readInt();
	};
    /**
     * 保存游戏设置
     * 0-19
     */
	sendSaveGameSetting() {
		var bytes = this.getBytes(19);
		bytes.writeByte(Setting.currPart);
		bytes.writeByte(Setting.currStep);
		bytes.writeInt(Setting.setting);
		this.sendToServer(bytes);
	};
}

MessageCenter.compile(Setting);
window["Setting"]=Setting