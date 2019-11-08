class ActivityWinSummer extends ActivityWin {
	public static onPlace = ActivityModel.BTN_TYPE_02;
	public constructor() {
		super()
	}
	
	protected _UpdateTitleImg() {
	}

	protected _SetActWinType(value) {
		this.type = ActivityWinSummer.onPlace;
	}

	protected changeSkinByType(e) {
		this.skinName = "ActivityWinSkin";
	}
}
window["ActivityWinSummer"]=ActivityWinSummer