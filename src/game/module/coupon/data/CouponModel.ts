class CouponModel {
	private static s_instance: CouponModel;
	public static get getInstance(): CouponModel {
		if (!CouponModel.s_instance) {
			CouponModel.s_instance = new CouponModel();
		}
		return CouponModel.s_instance;
	}
	public treasureRoleList = [];
	public lucknum: number = 400;
	public luckIndex: number = 10;
	private _luckMaxNum: number = 0;
	/**探索结果 */
	public treasureResult = [];

	public shopDic = new Dictionary<number>();

	public setTreasureRoleList(treasureRoleList: Sproto.treasure_record[]) {
		if (!treasureRoleList) {
			return;
		}
		let datas = [];
		for (var i = 0; i < treasureRoleList.length; i++) {
			let data = [];
			data.push(treasureRoleList[i].name);
			data.push(treasureRoleList[i].itemid);
			datas.push(data)
		}
		let oldData = this.treasureRoleList;
		this.treasureRoleList = datas.concat(oldData);
	}

	public getLuckShowItem() {
		let tiConfig = GlobalConfig.ins("ticketPoolTotalrewardsConfig");
		let luckIndex = this.luckIndex;
		if (this.luckIndex == this.luckMaxNum) {
			luckIndex -= 1;
		}
		let showListNum = Math.floor(luckIndex / 5);
		let itemList = [];
		for (var i = 1; i <= 5; i++) {
			let num = showListNum * 5 + i
			let configData = tiConfig[num];
			let itemData = configData.box[0]
			let data = { type: itemData.type, id: itemData.id, count: itemData.count }
			itemList.push(data);
		}
		return itemList;
	}

	public get luckMaxNum() {
		if (!this._luckMaxNum) {
			let tiConfig = GlobalConfig.ins("ticketPoolTotalrewardsConfig");
			for (let key in tiConfig) {
				this._luckMaxNum++;
			}
		}
		return this._luckMaxNum;
	}

	public setTreasureResultData(item: Sproto.treasure_item[]) {
		let datas = [];
		for (var i = 0; i < item.length; i++) {
			let type = 1;
			if (item[i].id < 100) {
				type = 0;
			} else {
				type = 1;
			}
			let data = { type: type, id: item[i].id, count: item[i].count };
			datas.push(data);
		}
		this.treasureResult = datas;
	}

	public checkAllRedPoint() {
		return this.checkBagRedPoint() || this.chenkLuckRedPoint();
	}

	public checkBagRedPoint() {
		if (UserBag.ins().getHuntGoodsBySort(UserBag.BAG_TYPE_VIPTREASUREHUNT).length > 0) {
			return true
		}
		return false;
	}

	public chenkLuckRedPoint() {
		let tiConfig = GlobalConfig.ins("ticketPoolTotalrewardsConfig")[this.luckIndex + 1];
		if (!tiConfig) {
			return false;
		}
		let pro = this.lucknum / tiConfig.time;
		if (pro >= 1) {
			return true;
		}
		return false;
	}


}
window["CouponModel"] = CouponModel