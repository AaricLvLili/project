class WingsData {


	equipdata: Array<ItemData> = [];

	lv: number;
	star: number;
	exp: number;
	openStatus: boolean;

	public showLv: number = 1;
	/**通过索引获取羽翼装备 */
	public getEquipByIndex(index) {
		return this.equipdata[index];
	};
	public setEquipByIndex(index, itemData) {
		this.equipdata[index] = itemData
	}
	public get equipsLen() {
		return this.equipdata.length;
	}
	public parser(rspData: Sproto.wings_data) {
		if (rspData == null) {
			return
		}
		this.parserUpgrade(rspData);
		this.parserOpenStatus(rspData);
		if (rspData.equipDatas)
			this.parserWingEqupip(rspData.equipDatas);
	};
	public parserUpgrade(rspData) {
		this.lv = rspData.lv;
		this.showLv = rspData.lv;
		this.parserBoost(rspData);
	};
	public parserBoost(rspData) {
		this.star = rspData.star
		this.exp = rspData.exp;
	};
	public parserOpenStatus(rspData) {
		this.openStatus = rspData.openStatus
	};
	public parserWingEqupip(bytes) {
		this.equipdata = [];
		var equip;
		for (var i = 0; i < 4; i++) {
			equip = new ItemData();
			equip.parser(bytes[i]);
			this.equipdata.push(equip);
		}
	};
}
window["WingsData"] = WingsData