class WildBossJoinItem extends eui.ItemRenderer {
	public constructor() {
		super();
	}

	bg
	txt0
	txt1
	txt2

	dataChanged() {
		let data: WildBossJoinItemData = this.data
		this.bg.visible = this.itemIndex % 2 == 0;
		//显示时间		
		if (data.time) {
			this.txt0.text = DateUtils.GetFormatSecond(data.time, 6)
		} else {
			this.txt0.text = (this.itemIndex + 1) + "";
		}
		this.txt1.text = data.name
		CommonUtils.labelIsOverLenght(this.txt2, data.value)
	};
}

class WildBossJoinItemData {
	public time: number
	public name: string
	public value: number
}
window["WildBossJoinItem"]=WildBossJoinItem
window["WildBossJoinItemData"]=WildBossJoinItemData