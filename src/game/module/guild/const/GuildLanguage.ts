class GuildLanguage {
    public static guildOffice(office): string {
        let list = [
            GlobalConfig.jifengTiaoyueLg.st100934,//成员
            GlobalConfig.jifengTiaoyueLg.st101504,//精英
            GlobalConfig.jifengTiaoyueLg.st101505,//堂主
            GlobalConfig.jifengTiaoyueLg.st101506,//护法
            GlobalConfig.jifengTiaoyueLg.st101507,//长老
            GlobalConfig.jifengTiaoyueLg.st101508,//副会长
            GlobalConfig.jifengTiaoyueLg.st101036//会长
        ];
        return list[office];
    }
    public static guildOfficeColor(office): string {
        let list = ["d1c3a8", "00c832", "1694ec", "8e2abc", "f4b12a", "bf7d00", "bf7d00"];
        return list[office];
    }
}
window["GuildLanguage"] = GuildLanguage