class GameString {
	public static GetLvName(zsLevel: number, level: number) {
		if (zsLevel > 0) {
			return LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101443, [zsLevel, level]);
		}
		return LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101368, [level]);
	}

	public static GetThirdPerson(sex: number) {
		if (sex == 0) {
			return GlobalConfig.jifengTiaoyueLg.st101444;
		}
		return GlobalConfig.jifengTiaoyueLg.st101445;
	}
}
window["GameString"] = GameString