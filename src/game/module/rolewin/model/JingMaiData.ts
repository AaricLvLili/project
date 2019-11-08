class JingMaiData {

	public level: number = 0
	public stage: number = 0

	public parser(rspData: Sproto.jingmai_data) {
		if (rspData == null) {
			return
		}
		this.level = rspData.level
		this.stage = rspData.stage
	}
}
window["JingMaiData"]=JingMaiData