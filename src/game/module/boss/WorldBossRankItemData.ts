class WorldBossRankItemData {
	id: number;
	roleName: string;
	value: number;
	rank: number;
	

	parser(bytes: Sproto.public_boss_rank_item_data) {
		this.id = bytes.id;
		this.roleName = bytes.roleName;
		this.value = bytes.hurtValue;
	};
	parser1(bytes) {
		this.roleName = bytes.readString();
		this.value = bytes.readInt();
	};
	get name() {
		var str = this.roleName + ":" + CommonUtils.overLength(this.value);
		var len = StringUtils.strByteLen(str);
		// str = StringUtils.complementByChar("", 27 - len) + str;//暂时屏蔽不知道何用
		return str;
	}
}

window["WorldBossRankItemData"]=WorldBossRankItemData