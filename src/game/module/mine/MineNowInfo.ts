class MineNowInfo {

	name = ""
	win: boolean

	parse (e: Sproto.robInfo) {
		this.name = e.name
		this.win = e.win
	}
}
window["MineNowInfo"]=MineNowInfo