class DabiaoRankData {
	prase(e: Sproto.activity_dabiao_data, type: number) {

		// this.rankIndex = e.rankIndex
		// this.id = e.id
		this.name = e.name
		this.numType = e.value
		// this.level = e.level
		// this.zsLevel = e.zsLevel
		// this.monthCard = e.monthCard
		// this.vipLv = e.vipLv
		// this.numType = e.numType


		// this.rankIndex = e.readShort()
		// this.id = e.readInt()
		// this.name = e.readString()

		// if (type == RankDataType.TYPE_XIAOFEI) {
		// 	this.numType = e.readInt()
		// 	return
		// }

		// this.level = e.readShort()
		// this.zsLevel = e.readShort()
		// this.monthCard = e.readShort()
		// this.vipLv = e.readShort()

		// if (RankDataType.TYPE_LEVEL != type)
		// 	if (type == RankDataType.TYPE_BAOSHI || type == RankDataType.TYPE_LONGHUN) {
		// 		this.numType = e.readInt();
		// 	} else if (type == RankDataType.TYPE_ZHANLING) {
		// 		var i = e.readInt()
		// 		let	n = e.readInt()
		// 		this.numType = [i, n]
		// 	} else {
		// 		this.numType = e.readDouble()
		// 	}
	}

	rankIndex: number
	id: number
	name: string
	numType: number
	level: number
	zsLevel: number
	monthCard: number
	vipLv: number
}
window["DabiaoRankData"]=DabiaoRankData