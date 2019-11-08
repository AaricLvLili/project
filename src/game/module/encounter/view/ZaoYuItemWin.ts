class ZaoYuItemWin extends BaseEuiPanel implements ICommonWindow {

	static LAYER_LEVEL = LayerManager.UI_Main

	public constructor() {
		super()
	}

	private commonWindowBg: CommonWindowBg
	initUI() {
		super.initUI()
		this.skinName = "MainWinSkin";
		this.commonWindowBg.AddChildStack(new ZaoYuItemPanel())
	}

	open(...param: any[]) {
		this.commonWindowBg.OnAdded(this, param && param[0])
	}

	close() {
		this.commonWindowBg.OnRemoved()
		if (!ViewManager.ins().isShow(LadderWin)) {
			!ViewManager.ins().open(LadderWin);
		}
	}

	public pkGetMiBaoMovieClip() {
		var item: ItemBase;
		item = ResultWin.item;
		if (item) {
			item.setItemBg("");
			item.isShowName(false);
			item.x = 190;
			item.y = 265;
			this.addChild(item);
			if (item) {
				egret.Tween.get(item).to({ x: 35, y: 620 }, 1200, egret.Ease.sineOut).call(() => {
					if (item) {
						egret.Tween.removeTweens(item)
						if (item.parent) {
							this.removeChild(item);
						}
					}
				});
			}
		}

	}
}
window["ZaoYuItemWin"] = ZaoYuItemWin