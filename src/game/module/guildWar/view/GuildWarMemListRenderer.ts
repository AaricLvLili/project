class GuildWarMemListRenderer extends eui.ItemRenderer {

	////////////////////////////////////////////////////////////////////////////////////////////////////
    // WarMemSkin.exml
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private conLab: eui.Label
    private attack: eui.Label
    private nameLab: eui.Label
    private nameLab0: eui.Label
    private headBG: eui.Image
    private face: eui.Image
    private onLine: eui.Label
    ////////////////////////////////////////////////////////////////////////////////////////////////////


	public constructor() {
		super()
		this.skinName = "WarMemSkin"
	}

	dataChanged () {
        let data = this.data as MyGuildRankInfo
        // this.face.source = ResDataPath.GetHeadMiniImgName(data.job, data.sex)
        this.face.source = ResDataPath.GetHeadMiniImgNameById(data.head)
        this.nameLab.text = "[" + GuildLanguage.guildOffice(data.office) + "]"
        this.nameLab0.text = data.name
        this.conLab.text = data.point + ""
        this.attack.text = data.attr + ""
        this.onLine.text = "" == data.mapName || data.mapName == null ? GlobalConfig.jifengTiaoyueLg.st101503 : data.mapName
	}
}
window["GuildWarMemListRenderer"]=GuildWarMemListRenderer