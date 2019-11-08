class ChatInfoData {

	type;
	id;
	name;
	job;
	sex;
	vip;
	monthCard;
	superMonthCard
	ladderLevel;
	isFirst;
	pointId;
	str;
	isTeacher;//是否是指导员
	time;
	office;
	teamID: number;
	fbId: number;
	public constructor(bytes: Sproto.sc_chat_new_msg_request = null) {
		if (bytes) {
			let data = bytes.chatData
			this.type = data.type
			this.id = data.id
			this.name = data.name
			this.job = data.job
			this.sex = data.sex
			this.vip = data.vip
			this.monthCard = data.monthCard
			this.superMonthCard = data.monthcard_super
			this.ladderLevel = data.ladderLevel
			this.isFirst = data.isFirst
			this.pointId = data.pointId
			this.str = data.str;
			this.isTeacher = data.isTeacher;
			this.time = data.time
			this.teamID = data.teamid
			this.fbId = data.groupid
		}
	}
}

class ChatSystemData {
	type
	str
	time
	public constructor(e, t, i) {
		this.type = e, this.str = t, this.time = i
	}
};
window["ChatInfoData"] = ChatInfoData
window["ChatSystemData"] = ChatSystemData