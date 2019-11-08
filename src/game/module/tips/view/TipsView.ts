class TipsView extends BaseEuiView {

	private	labCount = 0
	private list = []
	private goodEquipList = []
	private equipTip1: TipsGoodEquip
	private equipTip2: TipsGoodEquip

	private isWait

	initUI() {
		super.initUI()
		this.touchChildren = false;
		this.touchEnabled = false;
		this.equipTip1 = new TipsGoodEquip();
		this.equipTip2 = new TipsGoodEquip();
	};
    /**
     * 显示tips
     * @param str
     */
	showTips(str: string): void {
		var tips: TipsItem = ObjectPool.ins().pop("TipsItem");
		tips.verticalCenter = 0;
		tips.horizontalCenter = 0;
		tips.labelText = str;
		this.addChild(tips);
		this.list.unshift(tips);
		tips.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeTip, this);
		for (var i = this.list.length - 1; i >= 0; i--) {
			egret.Tween.removeTweens(this.list[i]);
			var t = egret.Tween.get(this.list[i]);
			t.to({ "verticalCenter": i * -25 }, 500);
		}
	};
	removeTip(e) {
		var index = this.list.indexOf(e.currentTarget);
		this.list.splice(index, 1);
		egret.Tween.removeTweens(e.currentTarget);
		e.currentTarget.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeTip, this);
		ObjectPool.ins().push(e.currentTarget);
	};
	showGoodEquipTip(item) {
		this.goodEquipList.push(item);
		if (TimerManager.ins().isExists(this.goodEquipTimer, this)) {
		}
		else {
			TimerManager.ins().doTimer(16, 0, this.goodEquipTimer, this);
		}
	};
	goodEquipTimer() {
		if (this.goodEquipList.length == 0 || this.isWait) {
			return;
		}
		var equipTip = undefined;
		if (!this.equipTip1.isUsing) {
			equipTip = this.equipTip1;
		}
		if (!this.equipTip2.isUsing) {
			equipTip = this.equipTip2;
		}
		if (equipTip == undefined) {
			return;
		}
		equipTip.x = 50;
		equipTip.y = 700;
		equipTip.alpha = 1;
		// equipTip.visible = true;
		this.addChild(equipTip);
		equipTip.isUsing = true;
		this.isWait = true;
		var itemData = this.goodEquipList.pop();
		equipTip.data = itemData;
		var t = egret.Tween.get(equipTip);
		t.to({ "y": 550 }, 500).call(() => {
			this.isWait = false;
		}).wait(1000).to({ "alpha": 0 }, 1000).call(() => {
			// equipTip.visible = false;
			equipTip.isUsing = false;
			this.removeChild(equipTip);
		});
		var otherEquipTip;
		if (equipTip == this.equipTip1) {
			otherEquipTip = this.equipTip2;
		}
		else {
			otherEquipTip = this.equipTip1;
		}
		if (otherEquipTip.isUsing) {
			egret.Tween.removeTweens(otherEquipTip);
			var tt = egret.Tween.get(otherEquipTip);
			tt.to({ "y": 400, "alpha": 0 }, 1000).wait(300).call(() => {
				// otherEquipTip.visible = false;
				otherEquipTip.isUsing = false;
				this.removeChild(otherEquipTip);
			});
		}
	};
}


ViewManager.ins().reg(TipsView, LayerManager.UI_Tips);
window["TipsView"]=TipsView