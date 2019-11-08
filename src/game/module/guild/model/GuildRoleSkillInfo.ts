class GuildRoleSkillInfo {
	guildSkillInfo: Array<GuildSkillInfo> = []
	practiceSkillInfo: Array<GuildSkillInfo> = []

	public GetSkillInfo(type: GuildSkillType): GuildSkillInfo[] {
		if (type == GuildSkillType.NORMAL) {
			return this.guildSkillInfo
		}
		return this.practiceSkillInfo
	}

	public GetSkillInfoByIndex(type: GuildSkillType, index: number): GuildSkillInfo {
		let data = this.GetSkillInfo(type)
		if (data) {
			return data[index]
		}
		return null
	}
}
window["GuildRoleSkillInfo"]=GuildRoleSkillInfo