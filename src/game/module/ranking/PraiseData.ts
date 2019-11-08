class PraiseData {

	subRole: SubRole[] = []
	type
	praiseTime = 0
	id
	name
	ce
	level
	zhuan
	vipLevel
	guildName
	praiseCount = 0

	getLastMobaiNum() {
		var lv = UserZs.ins().lv > 0 ? 1e3 * UserZs.ins().lv : GameLogic.ins().actorModel.level
		//临时处理>12转按12转处理
		if (lv > 12000) {
			lv = 12000;
		}
		var cout = GlobalConfig.ins("MorshipConfig")[this.type][lv].count
		return cout - this.praiseTime
	}
	parser(bytes: Sproto.sc_rank_worship_data_request | Sproto.prestige_rank_data) {
		this.type = bytes["type"]
		this.praiseCount = bytes["count"];
		this.id = bytes.actorData.actorid
		if (this.id > 0) {
			this.name = bytes.actorData.name
			this.ce = bytes.actorData.power
			this.level = bytes.actorData.level
			this.zhuan = bytes.actorData.zhuan
			this.vipLevel = bytes.actorData.vip
			for (var e = bytes.subRole.length, i = 0; e > i; i++) {
				this.subRole[i] = new SubRole
				this.subRole[i].parser(bytes.subRole[i])
			}
			this.guildName = bytes.actorData.guildName
		}
	}
	getRoleByJob(job): SubRole {
		if (job > 0) {
			for (var e in this.subRole) {
				if (this.subRole[e].job == job) {
					return this.subRole[e]
				}
			}
		}
		return this.subRole[0]
	}
}

class SubRole {

	job
	sex
	clothID
	swordID
	wingLevel
	wingShowLevel;
	wingOpenStatus: boolean;
	zhuangbei: number[]
	legendDress = null
	mountLv;
	moubtShowLv;
	mainEle: number;
	zhuanzhiLv
	parser(bytes: Sproto.rank_subrole) {
		this.job = bytes.job
		this.sex = bytes.sex
		this.clothID = bytes.clothID
		this.swordID = bytes.swordID
		this.wingLevel = bytes.wingLevel
		this.wingShowLevel = bytes.wingshow
		!bytes.wingOpenStatus && (this.wingLevel = null)
		this.wingOpenStatus = bytes.wingOpenStatus;
		this.zhuangbei = bytes.zhuangbei
		this.legendDress = bytes.legendDress
		this.mountLv = bytes.ride;
		this.moubtShowLv = bytes.rideshow;
		this.mainEle = bytes.mainEle;
		this.zhuanzhiLv = bytes.zhuanzhiLv;
	}

	parserByRoleData(data: Sproto.role_data) {
		this.job = data.job || 0
		this.sex = data.sex || 0
		try {
			this.clothID = data.equipsData[EquipPos.CLOTHES].item.configID
		} catch (e) {
			this.clothID = 0
		}
		try {
			this.swordID = data.equipsData[EquipPos.WEAPON].item.configID
		} catch (e) {
			this.swordID = 0
		}
		this.wingLevel = data.wingsData.lv
		this.wingShowLevel = data.wingsData.showlv
		!data.wingsData.openStatus && (this.wingLevel = null)
		this.wingOpenStatus = data.wingsData.openStatus;
		this.zhuangbei = data.zhuangbei
		this.legendDress = data.legendDress
		this.mountLv = data.ride;
		this.moubtShowLv = data.rideshow;
		this.mainEle = data.mainEle;
		this.zhuanzhiLv = data.zhuanzhiLv;
	}
}
window["PraiseData"] = PraiseData
window["SubRole"] = SubRole