class GuildBossViewHelper {

    public static SetBossLv(comp: eui.Component, lv: number, zsLv: number) {
        let bitmapLabel = comp["lvLabel"] as eui.BitmapLabel
        if (lv < 80) {
            if (bitmapLabel) {
                bitmapLabel.text = lv + GlobalConfig.jifengTiaoyueLg.st100093;//"级"
            }
        }
        if (lv == 80 && zsLv == 0) {
            if (bitmapLabel) {
                bitmapLabel.text = lv + GlobalConfig.jifengTiaoyueLg.st100093;//"级"
            }
        }
        if (lv >= 80 && zsLv != 0) {
            if (bitmapLabel) {
                bitmapLabel.text = zsLv + GlobalConfig.jifengTiaoyueLg.st100067;//"转"
            }
        }
        comp["languageText"].text = GlobalConfig.jifengTiaoyueLg.st101805;
    }
    public static setph(upperlimit: number, lowerlimit: number) {
        if (upperlimit != lowerlimit) {
            return lowerlimit + "~" + upperlimit
        } else {
            return upperlimit
        }
    }

    public static SetRoleHead(comp: eui.Component, name: string, office: number, head: number) {
        if (comp["roleHead"]) {
            UIHelper.SetHeadByHeadId(comp["roleHead"], head)
        }
        if (comp["roleTItle"]) {
            comp["roleTItle"].text = GuildLanguage.guildOffice(office) || ""
        }
        if (comp["roleName"]) {
            comp["roleName"].text = name || GlobalConfig.jifengTiaoyueLg.st100378;//"暂无"
        }
    }
}
window["GuildBossViewHelper"] = GuildBossViewHelper