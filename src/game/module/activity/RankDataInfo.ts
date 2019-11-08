class RankDataInfo extends RankDataBase {
	activityId: number
	name: string
	value: number
	idx: number
	serverId: number

	create(id: number, pos: number) {
		this.name = "";
		this.value = 0;
		this.activityId = id
		this.idx = pos
		this.serverId = 0
	}

	parser(bytes, items) {
		this.name = bytes.player;
		this.value = bytes.value;
		this.activityId = items;
		this.idx = bytes.pos;
		this.serverId = bytes.serverId;
	};
}

window["RankDataInfo"]=RankDataInfo