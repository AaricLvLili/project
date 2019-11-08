class GuildMessageInfo {
	type: number;
	content: string;
	roleId: number;
	name: string;
	job: number;
	sex: number;
	vipLevel: number;
	monthCard: number;
	superMonthCard: number;
	office: number;
	time:number

	public parserMessage(bytes: Sproto.guild_chat) {
		this.type = bytes.type
		this.content = bytes.content
		//公会聊天才有一下内容
		if (this.type == 1) {
			this.roleId = bytes.actorid
			this.name = bytes.name
			this.job = bytes.job
			this.sex = bytes.sex
			this.vipLevel = bytes.vip_level
			this.monthCard = bytes.monthcard
			this.superMonthCard = bytes.monthcard_super
			this.office = bytes.office
			this.time =bytes.time
		}
	};
}
window["GuildMessageInfo"]=GuildMessageInfo