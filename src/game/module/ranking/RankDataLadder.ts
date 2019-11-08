class RankDataLadder extends RankDataBase {
	id
	player
	challgeLevel
	challgeId
	winNum
	job
	sex

	pos: number
	
	parser(bytes, items) {
		this.pos = bytes.pos;
		this.id = bytes.id;
		this.player = bytes.player;
		this.challgeLevel = bytes.challgeLevel;
		this.challgeId = bytes.challgeId;
		this.winNum = bytes.winNum;
		this.job = bytes.job;
		this.sex = bytes.sex;
	};
}
window["RankDataLadder"]=RankDataLadder