class Guild extends BaseSystem {

	private guildTaskConfig: any;
	guildListInfos = []; //公会列表
	_guildMembers: GuildMemberInfo[] = []; //公会成员列表
	applyGuilds = []; //申请公会列表
	applyPlayers: GuildApplyInfo[] = []; //申请公会的玩家列表
	_guillRoleSkillInfo: GuildRoleSkillInfo[] = []; //公会技能数据
	// guildMessageInfo = []; //公会聊天记录包含公会公告
	/** 按历史贡献 排序，按当日贡献排序*/
	_memberSortType = 0;
	pageMax = 1;
	/**是否有玩家申请 */
	_hasApply = false;
	/**自动加入的限制战力 */
	attrLimit = 100000;
	_conCount = [];


	_buildingLevels: Array<any> = []
	guildID: number;
	guildName: string;
	money: number = 0 // 公会资金
	notice: string;
	guildLv: number
	guildTaskInfos: Array<GuildTaskInfo> = []
	myOffice: any;

	myCon: number = 0
	myTotalCon: number = 0

	records: Array<any> = []

	isAuto: number;

	public constructor() {
		super();


		this.sysId = PackageID.Guild;
		this.regNetMsg(S2cProtocol.sc_guild_info, this.postGuildInfo);
		this.regNetMsg(S2cProtocol.sc_guild_members, this.doGuildMembers);
		this.regNetMsg(S2cProtocol.sc_guild_list, this.postGuildList);
		this.regNetMsg(S2cProtocol.sc_guild_create_ret, this.doGuildCreate);
		this.regNetMsg(S2cProtocol.sc_guild_join_info, this.doJoinGuild);
		this.regNetMsg(S2cProtocol.sc_guild_apply, this.doApplyInfos);
		this.regNetMsg(S2cProtocol.sc_guild_notice_apply, this.doProcessJoin);
		this.regNetMsg(S2cProtocol.sc_guild_change_office_ret, this.doChangeOffice);
		this.regNetMsg(S2cProtocol.sc_guild_kick_ret, this.doQuitGuild);
		this.regNetMsg(S2cProtocol.sc_guild_fund, this.postGuildMoney);
		this.regNetMsg(S2cProtocol.sc_guild_change_notice_ret, this.postChangeNotice);
		this.regNetMsg(S2cProtocol.sc_guild_skillinfo, this.doGuildSkillInfo);
		this.regNetMsg(S2cProtocol.sc_guild_learnskill_ret, this.doLearnGuildSkill);
		this.regNetMsg(S2cProtocol.sc_guild_upbuilding_ret, this.postUpBuilding);
		this.regNetMsg(S2cProtocol.sc_guild_temperskill_ret, this.doPracticeGuildSkill);
		this.regNetMsg(S2cProtocol.sc_guild_taskinfo, this.doGuildTaskInfos);
		this.regNetMsg(S2cProtocol.sc_guild_onetask, this.doGuildTaskUpdate);
		this.regNetMsg(S2cProtocol.sc_guild_history, this.postManageList);
		this.regNetMsg(S2cProtocol.sc_guild_addhistory, this.doManage);
		this.regNetMsg(S2cProtocol.sc_guild_concount, this.postConCount);
		this.regNetMsg(S2cProtocol.sc_guild_playerinfo, this.doMyGuildInfo);
		this.regNetMsg(S2cProtocol.sc_guild_broadcastchat, this.doGuildMessage);
		this.regNetMsg(S2cProtocol.sc_guild_allchat, this.postAllGuildMessage);
		this.regNetMsg(S2cProtocol.sc_guild_autoadd_ret, this.doAddGuildlimit);

		for (let i = 0; i < SubRoles.MAX_COUNT; ++i) {
			let roleSkillInfo = new GuildRoleSkillInfo
			for (let i = 0; i < 3; ++i) {
				let skillInfo = new GuildSkillInfo()
				skillInfo.level = 0
				roleSkillInfo.guildSkillInfo.push(skillInfo)
			}
			for (let i = 0; i < 2; ++i) {
				let skillInfo = new GuildSkillInfo()
				skillInfo.level = 0
				skillInfo.exp = 0
				roleSkillInfo.practiceSkillInfo.push(skillInfo)
			}
			this._guillRoleSkillInfo.push(roleSkillInfo)
		}

		for (let i = 0; i < GuildBuilding.MAX - 1; ++i) {
			this._buildingLevels[i] = 0
		}
	}

	public static ins(): Guild {
		return super.ins();
	};

	/**公会技能数据 */
	public getSkllInfoByIndex(index): GuildRoleSkillInfo {
		return this._guillRoleSkillInfo[index];
	};
	/**公会成员列表 */
	public getGuildMembersByIndex(index) {
		return this._guildMembers[index];
	};
	/**公会任务列表 */
	public getGuildTaskInfosByIndex(index) {
		return this.guildTaskInfos[index];
	};
	/**第一个元素就是公会等级 */
	public getBuildingLevels(index: number = -1) {
		return index == -1 ? this._buildingLevels : this._buildingLevels[index];
	};

	public GetBuildingLevel(type: number) {
		return this._buildingLevels[type] || 0
	}

	public SetBuildingLevel(type: number, level: number) {
		let oldLevel = this._buildingLevels[type]
		if (!oldLevel) {
			this._buildingLevels[type] = level
		} else {
			this._buildingLevels[type] = Math.max(oldLevel, level)
		}
	}
	// public getConCount(index = -1) {
	// 	return index == -1 ? this._conCount : this._conCount[index];
	// };
    /**
     * 请求公会信息
     * 37-1
     */
	public sendGuildInfo() {
		GameSocket.ins().Rpc(C2sProtocol.cs_guild_getinfo)

	};

	public postGuildInfo(bytes: Sproto.sc_guild_info_request) {
		// var _this = Guild.ins();
		// this._buildingLevels = [];
		//等于1已经加入公会了
		if (bytes.id != 0) {
			this.guildID = bytes.id;
			this.guildName = bytes.name;
			var len = bytes.variable.building.length;
			for (var index = 0; index < len; index++) {
				this._buildingLevels[index] = bytes.variable.building[index] || 0
				// this._buildingLevels.push(bytes.variable.building[index]);
			}
			this.money = bytes.variable.fund;
			this.notice = bytes.variable.notice;
			this.doAddGuildlimit(bytes.variable);
			this.guildLv = this._buildingLevels[0];
			Guild.ins().sendGuildMembers();
		}
	};
    /**
     * 获取公会成员列表
     * 37-2
     */
	public sendGuildMembers() {
		GameSocket.ins().Rpc(C2sProtocol.cs_guild_getmembers)
	};
	public doGuildMembers(bytes: Sproto.sc_guild_members_request) {
		var len = bytes.members.length;
		var info: GuildMemberInfo
		// var this = Guild.ins();
		this._guildMembers = [];
		for (var index = 0; index < len; index++) {
			info = new GuildMemberInfo;
			let member = bytes.members[index]
			info.roleID = member.actorid;
			info.name = member.actorname;
			info.office = member.office;
			info.job = member.job;
			info.sex = member.sex;
			info.vipLevel = member.vip_level;
			info.monthCard = member.monthcard;
			info.superMonthCard = member.monthcard_super
			info.contribution = member.contribute;
			info.curContribution = member.todayContri || 0;
			info.attack = member.power;
			info.downTime = member.logouttime;
			this._guildMembers.push(info);
		}
		this._guildMembers.sort(this.memberSortFunc);
		this.postGuildMembers();
	};
	public postGuildMembers() {
	};
    /**
     * 获取公会列表
     * 37-3
     */
	public sendGuildList() {
		GameSocket.ins().Rpc(C2sProtocol.cs_guild_getlist)
	};
	public postGuildList(bytes: Sproto.sc_guild_list_request) {
		// var _this = Guild.ins();
		this.guildListInfos = [];
		var len = bytes.guilds.length;
		var info: GuildListInfo
		for (var i = 0; i < len; i++) {
			info = new GuildListInfo;
			let guild = bytes.guilds[i]
			// info.guildRank = i + 1;
			info.guildID = guild.id;
			info.guildLevel = guild.level;
			info.guildMember = guild.actorcount;
			info.guildName = guild.name;
			info.guildPresident = guild.leadername;
			info.attr = guild.needPower;
			info.totalpower = guild.totalpower;
			this.guildListInfos.push(info);
		}
		this.guildListInfos.sort(function (lhs, rhs) {
			return rhs.totalpower - lhs.totalpower
		});
		for (let j = 0; j < this.guildListInfos.length; ++j) {
			this.guildListInfos[j].guildRank = j + 1
		}
	};
    /**
     * 创建公会
     * 37-4
     */
	public sendGuildCreate(id, name) {
		var cs_guild_create = new Sproto.cs_guild_create_request()
		cs_guild_create.id = id
		cs_guild_create.name = name
		GameSocket.ins().Rpc(C2sProtocol.cs_guild_create, cs_guild_create)
	};
    /**
     * 创建公会结果
     * 37-4
     */
	public doGuildCreate(bytes: Sproto.sc_guild_create_ret_request) {
		var result = bytes.result;
		if (result == 0) {
			var guildID = bytes.id;
			// ViewManager.ins().close(GuildCreateWin);
			// ViewManager.ins().close(GuildApplyWin);
			// ViewManager.ins().open(GuildMap);
			UserTips.ins().showTips("公会创建成功");
			this.sendGuildInfo();
		} else {
			let msg = ""
			if (result == 5) {
				msg = GlobalConfig.jifengTiaoyueLg.st101634;
			} else if (result == 2) {
				msg = GlobalConfig.jifengTiaoyueLg.st100913;
			} else if (result == 4) {
				msg = GlobalConfig.jifengTiaoyueLg.st100008;
			}
			if (msg != "") {
				UserTips.ErrorTip(msg)
			}
		}
		// 更新状态
		// GuildRobber.ins().isUpdateRobber = true
	};

    /**
     * 退出公会
     * 37-5
     */
	public sendQuitGuild() {
		GameSocket.ins().Rpc(C2sProtocol.cs_guild_quit)
	};
    /**
     * 申请加入公会
     * 37-6
     */
	public sendJoinGuild(guildID) {
		var cs_guild_join = new Sproto.cs_guild_join_request()
		cs_guild_join.id = guildID
		GameSocket.ins().Rpc(C2sProtocol.cs_guild_join, cs_guild_join)
	};
    /**
     * 通知有人申请加入公会
     * 37-6
     */
	public doJoinGuild(bytes) {
		if (this.myOffice >= GuildOffice.GUILD_FUBANGZHU) {
			this.hasApply = true;
			this.postGuildJoinResult();
			this.postGuildApplysInfos();
		}
	};
	public postGuildJoinResult() {
	};
	public postGuildApplysInfos() {
	};
    /**
     * 获取申请加入公会玩家信息
     * 37-7
     */
	public sendApplyInfos() {
		GameSocket.ins().Rpc(C2sProtocol.cs_guild_getapply)
	};
    /**
     * 发送申请加入公会玩家信息
     * 37-7
     */
	public doApplyInfos(bytes: Sproto.sc_guild_apply_request) {
		var len = bytes.applyinfo.length;
		this.applyPlayers = [];
		var info;
		for (var index = 0; index < len; index++) {
			info = new GuildApplyInfo;
			let apply = bytes.applyinfo[index]
			info.roleID = apply.actorid;
			info.vipLevel = apply.vip_level;
			info.job = apply.job;
			info.sex = apply.sex;
			info.attack = apply.power;
			info.name = apply.actorname;
			this.applyPlayers.push(info);
		}
		this._hasApply = len > 0;
		this.postGuildApplysInfos();
	};
    /**
     * 处理申请
     * 37-8
     */
	public sendProcessJoin(joinId, b) {
		var cs_guild_setapply = new Sproto.cs_guild_setapply_request()
		cs_guild_setapply.actorid = joinId
		cs_guild_setapply.result = b
		GameSocket.ins().Rpc(C2sProtocol.cs_guild_setapply, cs_guild_setapply)
	};
    /**
     * 通知申请的玩家申请结果
     * 37-8
     */
	public doProcessJoin(bytes: Sproto.sc_guild_notice_apply_request) {
		var guildID = bytes.id;
		var result = bytes.result;
		var applyGuilds = this.applyGuilds;
		var index = applyGuilds.indexOf(guildID);
		if (index != -1) {
			applyGuilds.splice(index, 1);
		}
		this.postGuildJoinResult();
	};
    /**
     * 升降职
     * 37-9
     * roleID 玩家id
     * guildOffice 职位id
     */
	public sendChangeOffice(roleID, guildOffice) {
		var cs_guild_change_office = new Sproto.cs_guild_change_office_request()
		cs_guild_change_office.actorid = roleID
		cs_guild_change_office.office = guildOffice
		GameSocket.ins().Rpc(C2sProtocol.cs_guild_change_office, cs_guild_change_office)
	};
    /**
     * 通知玩家职位变化
     * 37-9
     */
	public doChangeOffice(bytes: Sproto.sc_guild_change_office_ret_request) {
		var roleID = bytes.actorid;
		var newOffice = bytes.office;
		if (roleID == GameGlobal.actorModel.actorID) {
			this.myOffice = newOffice;
			this.postMyGuildInfo();
		}

		for (var index = 0; index < this._guildMembers.length; index++) {
			var element = this.getGuildMembersByIndex(index);
			if (element.roleID == roleID) {
				element.office = newOffice;
				this.postGuildMembers();
				return;
			}
		}
	};
    /**
     * 弹劾
     * 37-10
     */
	public sendDemise() {
		GameSocket.ins().Rpc(C2sProtocol.cs_guild_demise);
	};
    /**
     * 踢出
     * 37-11
     */
	public sendKick(roleID) {
		var cs_guild_kick = new Sproto.cs_guild_kick_request()
		cs_guild_kick.actorid = roleID
		GameSocket.ins().Rpc(C2sProtocol.cs_guild_kick, cs_guild_kick)
	};
    /**
     * 退出公会
     * 37-11
     */
	public doQuitGuild(bytes: Sproto.sc_guild_kick_ret_request) {
		var roleID = bytes.actorid;
		if (roleID == GameLogic.ins().actorModel.actorID) {
			this.clearGuildInfo();
			ViewManager.ins().close(GuildWin);
			ViewManager.ins().close(GuildMap);
		}
		else if (this.myOffice >= GuildOffice.GUILD_FUBANGZHU) {
			for (var index = 0; index < this._guildMembers.length; index++) {
				var element = this.getGuildMembersByIndex(index);
				if (element.roleID == roleID) {
					this._guildMembers.splice(index, 1);
					this.postGuildMembers();
					return;
				}
			}
		}
	};
    /**
     * 捐献
     * 37-13
     */
	public sendCon(type) {
		let req = new Sproto.cs_guild_contribute_request
		req.type = type
		this.Rpc(C2sProtocol.cs_guild_contribute, req)
	};
    /**
     * 公会资金
     * 37-13
     */
	public postGuildMoney(bytes: Sproto.sc_guild_fund_request) {
		// var _this = Guild.ins();
		var temp = this.money;
		this.money = bytes.fund
		temp = this.money - temp;
	};
    /**
     * 修改公告
     * 37-14
     */
	public sendChangeNotice(text) {
		var cs_guild_change_notice = new Sproto.cs_guild_change_notice_request()
		cs_guild_change_notice.text = text
		GameSocket.ins().Rpc(C2sProtocol.cs_guild_change_notice, cs_guild_change_notice)

	};
    /**
     * 修改公告
     * 37-14
     */
	public postChangeNotice(bytes: Sproto.sc_guild_change_notice_ret_request) {
		var result = bytes.result;
		if (result == 0) {
			Guild.ins().notice = bytes.text;
		}
	};
    /**
     * 获取公会技能信息
     * 37-15
     */
	public sendGuildSkillInfo() {
		this.Rpc(C2sProtocol.cs_guild_getskillinfo)
	};
    /**
     * 获取公会技能信息
     * 37-15
     */
	public doGuildSkillInfo(bytes: Sproto.sc_guild_skillinfo_request) {
		if (bytes.skills == null) {
			return
		}
		for (let i = 0, len = bytes.skills.length; i < len; ++i) {
			let info = bytes.skills[i]
			let roleSkillInfo = this._guillRoleSkillInfo[i]

			for (let j = 0; j < info.skill1.length; ++j) {
				let data = info.skill1[j]
				let skillInfo = roleSkillInfo.guildSkillInfo[j]
				skillInfo.level = data
			}

			for (let j = 0; j < info.skill2.length; ++j) {
				let data = info.skill2[j]
				let skillInfo = roleSkillInfo.practiceSkillInfo[j]
				skillInfo.level = data.level
				skillInfo.exp = data.exp
			}
		}
		this.postGuildSkillInfo();
	};
	public postGuildSkillInfo() {
	};
    /**
     * 学习公会技能
     * 37-16
     */
	public sendLearnGuildSkill(roleID, skillID) {
		let req = new Sproto.cs_guild_learnskill_request
		req.roleid = roleID
		req.skillid = skillID
		this.Rpc(C2sProtocol.cs_guild_learnskill, req)
	};
    /**
     * 学习公会技能
     * 37-16
     */
	public doLearnGuildSkill(bytes: Sproto.sc_guild_learnskill_ret_request) {
		var roleID = bytes.roleid
		var skillID = bytes.skillid
		this.getSkllInfoByIndex(roleID).guildSkillInfo[skillID - 1].level = bytes.level
		this.postGuildSkillInfo();
		UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st100638);
	};
    /**
     * 修炼公会技能
     * 37-18
     */
	public sendPracticeGuildSkill(roleID, skillID) {
		let req = new Sproto.cs_guild_temperskill_request
		req.roleid = roleID
		req.skillid = skillID
		this.Rpc(C2sProtocol.cs_guild_temperskill, req)
	};
    /**
     * 修炼公会技能
     * 37-18
     */
	public doPracticeGuildSkill(bytes: Sproto.sc_guild_temperskill_ret_request) {
		var roleID = bytes.roleid
		var skillID = bytes.skillid
		this.getSkllInfoByIndex(roleID).practiceSkillInfo[skillID - 1].level = bytes.level
		this.getSkllInfoByIndex(roleID).practiceSkillInfo[skillID - 1].exp = bytes.exp
		var add = bytes.addexp
		this.postGuildSkillInfo();
		UserTips.ins().showTips(LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101854, [add]));
	};
    /**
     * 升级建筑
     * 37-17
     */
	public sendUpBuilding(buildType) {
		let req = new Sproto.cs_guild_upbuilding_request
		req.buildtype = buildType
		this.Rpc(C2sProtocol.cs_guild_upbuilding, req)
	};
	public postUpBuilding(bytes: Sproto.sc_guild_upbuilding_ret_request) {
		var type = bytes.buildtype
		var level = bytes.level
		this._buildingLevels[type - 1] = level;
		this.guildLv = this._buildingLevels[0];
	};
    /**
     * 发送任务信息列表
     * 37-19
     */
	public doGuildTaskInfos(bytes: Sproto.sc_guild_taskinfo_request) {
		this.initTaskInfos();
		for (var index = 0, len = bytes.task.length; index < len; index++) {
			let data = bytes.task[index]
			var id = data.id
			for (var key in this.guildTaskInfos) {
				if (this.guildTaskInfos.hasOwnProperty(key)) {
					var element = this.guildTaskInfos[key];
					if (id == element.taskID) {
						element.param = data.value
						element.state = data.state
						continue;
					}
				}
			}
		}
		this.guildTaskInfos.sort(this.taskInfosSortFunc);
		this.postGuildTaskUpdate();
	};
	public postGuildTaskUpdate() {
	};
    /**
     * 通知任务信息改变
     * 37-20
     */
	public doGuildTaskUpdate(bytes: Sproto.sc_guild_onetask_request) {
		var id = bytes.task.id
		var param = bytes.task.value
		var state = bytes.task.state
		for (var key in this.guildTaskInfos) {
			if (this.guildTaskInfos.hasOwnProperty(key)) {
				var element = this.guildTaskInfos[key];
				if (element.taskID == id) {
					element.param = param;
					element.state = state;
					this.guildTaskInfos.sort(this.taskInfosSortFunc);
					this.postGuildTaskUpdate();
					return;
				}
			}
		}
	};
    /**
     * 领取任务奖励
     * 37-21
     */
	public sendGetTaskAward(taskID) {
		let req = new Sproto.cs_guild_gettaskaward_request
		req.taskid = taskID
		this.Rpc(C2sProtocol.cs_guild_gettaskaward, req)
	};
    /**
     * 获取公会事件记录
     * 37-22
     */
	public sendManageList() {
		this.Rpc(C2sProtocol.cs_guild_gethistory)
	};
	public postManageList(bytes: Sproto.sc_guild_history_request) {
		// var _this = Guild.ins();
		this.records = [];
		var count = bytes.historys.length
		for (var i = 0; i < count; i++) {
			this.parserManage(bytes.historys[i]);
		}
	};
	public doManage(bytes: Sproto.sc_guild_addhistory_request) {
		this.parserManage(bytes.history);
	};
    /**
     * 获取捐献次数
     * 37-24
     */
	public sendConCount() {
		this.Rpc(C2sProtocol.cs_guild_getconcount)
	};
	public postConCount(bytes: Sproto.sc_guild_concount_request) {
		var count = bytes.counts.length
		for (var i = 0; i < count; i++) {
			this._conCount[i] = bytes.counts[i]
		}
	};

	/**
	 * 获取剩余次数
	 * @param type 类型
	 */
	public GetSurplusConCount(type: number): number {
		let count = this._conCount[type]
		if (count == null) {
			return 0
		}
		return Math.max(this.GetMaxConCount(type) - count, 0)
	}

	/**
	 * 获取捐献次数
	 */
	public GetConCount(type: number): number {
		let count = this._conCount[type]
		if (count == null) {
			return this.GetMaxConCount(type)
		}
		return count
	}

	public GetMaxConCount(type: number): number {
		if (type == 0) {
			return GlobalConfig.ins("GuildDonateConfig")[1].dayCount[UserVip.ins().lv]
		} else if (type == 1) {
			return GlobalConfig.ins("GuildDonateConfig")[2].dayCount
		}
		return 0
	}

    /**
     * 获取玩家公会数据
     * 37-25
     */
	public sendMyGuildInfo() {
		GameSocket.ins().Rpc(C2sProtocol.cs_guild_getplayerinfo)
	};
    /**
     * 处理玩家公会数据
     * 37-25
     */
	public doMyGuildInfo(bytes: Sproto.sc_guild_playerinfo_request) {
		// var _this = Guild.ins();
		this.myCon = bytes.curcontribute;
		this.myTotalCon = bytes.contribute;
		this.myOffice = bytes.office;
		this.postMyGuildInfo();
	};

	public postMyGuildInfo() {
	}
    /**
     * 发送公会聊天消息
     * 37-26
     */
	public sendGuildMessage(str) {
		let req = new Sproto.cs_guild_sendchat_request
		req.str = str
		this.Rpc(C2sProtocol.cs_guild_sendchat, req)
	};
    /**
     * 广播公会聊天消息
     * 37-26
     */
	public doGuildMessage(t: Sproto.sc_guild_broadcastchat_request) {
		// if (this.guildMessageInfo.length > 50)
		// 	this.guildMessageInfo.shift();
		// var element = new GuildMessageInfo;
		// element.parserMessage(bytes);
		// this.guildMessageInfo.push(element);
		// this.postGetNewGuildMessage(element);
		// //伪造一个普通聊天的tip在场景上
		// if (element.type == 1) {
		// 	var msg = new ChatInfoData(null);
		// 	msg.name = element.name;
		// 	msg.type = 7;
		// 	msg.str = element.content;
		// 	Chat.ins().postNewChatMsg(msg);
		// }
		// //用于提示公会强盗信息
		// if (element.type == 2) {
		// 	this.postGuildBossHaveRelive(true, element.content);
		// 	Chat.ins().setMinichatData(element.content);
		// }
		var e = new GuildMessageInfo;
		e.parserMessage(t.chat)
		// if (-1 == Friends.ins().indexOfBlackList(e.roleId)) {
		// 	Chat.ins().setGuildchatData(e)
		// }
		if (void 0 != e.name) {
			var i = new ChatInfoData(null)
			i.name = e.name
			i.type = ChatType.Guild
			i.str = e.content
			i.vip = e.vipLevel
			i.monthCard = e.monthCard
			i.superMonthCard = e.superMonthCard
			i.office = e.office
			i.time = e.time

			Chat.ins().setGuildchatData(i)
			// Chat.ins().setMinichatData(i)
			if (1 == e.type || 2 == e.type) {
				this.postGuildBossHaveRelive(!0, e.content)
			}
		}
		//GameGlobal.MessageCenter.dispatch(MessageDef.CHAT_SEND_SUCCESS_UPDATE);
	};
	public postGetNewGuildMessage(ele) {
		return ele;
	};
	public postGuildBossHaveRelive(...params: any[]) {
		return params;
	};
    /**
     * 获取玩家公会聊天
     * 37-27
     */
	public sendAllGuildMessage() {
		this.Rpc(C2sProtocol.cs_guild_getallchat)
	};
    /**
     * 处理玩家公会数据
     * 37-27
     */
	public postAllGuildMessage(bytes: Sproto.sc_guild_allchat_request) {
		// var _this = Guild.ins();
		// this.guildMessageInfo = [];
		Chat.ins().guildchatList.removeAll()
		// var len = bytes.chats.length
		// for (var index = 0; index < len; index++) {
		// 	var element = new GuildMessageInfo;
		// 	element.parserMessage(bytes.chats[index]);
		// 	Chat.ins().setGuildchatData(element)
		// 	// this.guildMessageInfo.push(element);
		// }
		let list: Array<any> = bytes.chats
		for (let i = 0, len = list.length; i < len; i++) {
			let item = new ChatInfoData(null)

			if (list[i].type) {
				item.name = list[i].name
				item.type = ChatType.Guild
				item.vip = GameGlobal.actorModel.vipLv
				item.office = list[i].office
				item.monthCard = list[i].monthCard
				item.superMonthCard = list[i].superMonthCard
			} else {
				item.type = ChatType.GuildPublic
			}
			item.str = list[i].content
			item.time = list[i].time
			Chat.ins().setGuildchatData(item)
		}
	};
    /**
     * 玩家自动加入公会数据
     * 37-28
     */
	public sendAddGuildLimit(auto, attr) {
		var cs_guild_setautoadd = new Sproto.cs_guild_setautoadd_request()
		cs_guild_setautoadd.auto = auto
		cs_guild_setautoadd.power = attr
		GameSocket.ins().Rpc(C2sProtocol.cs_guild_setautoadd, cs_guild_setautoadd)
	};
    /**
     * 处理 自动加入公会的变化
     * 37-28
     */
	public doAddGuildlimit(bytes) {
		this.isAuto = bytes.autoJoin;
		this.attrLimit = bytes.needPower;
	};

	public parserManage(bytes: Sproto.guild_history) {
		if (!this.records)
			return;
		var str = "";
		//时间 unsigned int
		//事件类型 unsigned char 从1开始分别表示加入公会，离开公会，副会长任命，会长禅让，会长弹劾，公会副本进度首通，钻石/金币捐献，建筑升级
		//参数1 int
		//参数2 int
		//参数3 int
		//玩家名 string
		//玩家名2 string
		// var time = DateUtils.getFormatBySecond(DateUtils.formatMiniDateTime(bytes.time), 8);
		// time = StringUtils.complementByChar(time, 16);
		let time = StringUtils.complementByChar(DateUtils.getFormatBySecond(bytes.time, DateUtils.TIME_FORMAT_8), 16)
		var type = bytes.type
		var param1 = bytes.param1
		var param2 = bytes.param2
		var param3 = bytes.param3
		var name1 = bytes.name1
		var name2 = bytes.name2
		switch (type) {
			case 1:
				str = time + "  [" + name1 + "]" + GlobalConfig.jifengTiaoyueLg.st101523;
				break;
			case 2:
				str = time + "  [" + name1 + "]" + GlobalConfig.jifengTiaoyueLg.st101524;
				break;
			case 3:
				str = time + "  [" + name1 + "]" + GlobalConfig.jifengTiaoyueLg.st101525;
				break;
			case 4:
				str = time + "  [" + name1 + "]" + GlobalConfig.jifengTiaoyueLg.st101526;
				break;
			case 5:
				str = time + "  [" + name1 + "]" + GlobalConfig.jifengTiaoyueLg.st101527;
				break;
			case 6:
				str = time + "  [" + name1 + "]" + GlobalConfig.jifengTiaoyueLg.st101528;
				break;
			case 7:
				str = time + "  [" + name1 + "]" + GlobalConfig.jifengTiaoyueLg.st101529 + param2 + (param1 == 2 ? GlobalConfig.jifengTiaoyueLg.st100050 : GlobalConfig.jifengTiaoyueLg.st100018);
				break;
			case 8:
				str = time + "  [" + name1 + "]" + LanguageString.jifengTiaoyueCh(GlobalConfig.jifengTiaoyueLg.st101530, [GlobalConfig.ins("GuildConfig").buildingNames[param1 - 1], param2]);
				break;
			case 9:
				var config = GlobalConfig.itemConfig[param1];
				str = time + "  [" + name1 + "]" + GlobalConfig.jifengTiaoyueLg.st101531 + "<font color=" + ItemBase.QUALITY_COLOR[config.quality] + ">" + config.name + "</font>";
				break;
			case 10:
				str = time + "  <font color='#00ff00'>" + GlobalConfig.jifengTiaoyueLg.st101532 + "</font>";
				break;
		}
		this.records.unshift(str);
	};
	public set hasApply(b) {
		this._hasApply = b;
	}
	/**是否有玩家申请 */
	public hasApplys() {
		return this.myOffice >= GuildOffice.GUILD_FUBANGZHU && this._hasApply;
	};
	public clearGuildInfo() {
		this.guildID = 0;
		this.guildName = "";
		this.guildListInfos = [];
		this._guildMembers = [];
		this.applyGuilds = [];
		this.applyPlayers = [];
		this.pageMax = 1;
	};
	public initTaskInfos() {
		if (this.guildTaskInfos.length > 0) {
			return;
		}
		this.guildTaskInfos = [];
		if (this.guildTaskConfig == null)
			this.guildTaskConfig = GlobalConfig.ins("GuildTaskConfig");
		var dp = this.guildTaskConfig;
		for (var key in dp) {
			if (dp.hasOwnProperty(key)) {
				var gtc = dp[key];
				var element = new GuildTaskInfo;
				element.taskID = gtc.id;
				element.param = 0;
				element.state = 0;
				element.stdTask = gtc;
				this.guildTaskInfos.push(element);
			}
		}
	};
	public taskInfosSortFunc(aConfig, bConfig) {
		if (aConfig.state == bConfig.state) {
			if (aConfig.taskID < bConfig.taskID)
				return -1;
			if (aConfig.taskID > bConfig.taskID)
				return 1;
			return 0;
		}
		if (aConfig.state != RewardState.NotReached)
			return 1;
		if (bConfig.state != RewardState.NotReached)
			return -1;
		if (aConfig.state != 2 && bConfig.state != 2) {
			if (aConfig.taskID < bConfig.taskID)
				return -1;
			if (aConfig.taskID > bConfig.taskID)
				return 1;
		}
		return 0;
	};
	public getMemberNum() {
		return this._guildMembers.length;
	};
    /**
     * 获取成员列表
     * sortType 排序方式， 0不排序，1按历史贡献，2 按当日贡献
     */
	public getGuildMembers(sortType) {
		if (sortType == 0 || this._memberSortType == sortType)
			return this._guildMembers;
		if (sortType == 1)
			return this._guildMembers.sort(this.memberSortFunc);
		if (sortType == 2)
			return this._guildMembers.sort(this.memberSortFunc2);
		return this._guildMembers;
	};
	/**获取某个职的数量 */
	public getOfficeNum(office) {
		var len = this._guildMembers.length;
		var num = 0;
		for (var index = 0; index < len; index++) {
			var element = this._guildMembers[index];
			if (element.office == office)
				num++;
		}
		return num;
	};
	/**能否任命副会长 */
	public canAppointFHZ() {
		return this.getOfficeNum(GuildOffice.GUILD_FUBANGZHU) < GlobalConfig.ins("GuildConfig").posCounts[this.guildLv - 1][1];
	};
	public memberSortFunc(aInfo, bInfo) {
		if (aInfo.office > bInfo.office)
			return -1;
		if (aInfo.office < bInfo.office)
			return 1;
		if (aInfo.office == bInfo.office) {
			if (aInfo.contribution == bInfo.contribution)
				return 0;
			return aInfo.contribution > bInfo.contribution ? -1 : 1;
		}
		return 0;
	};
	public memberSortFunc2(aInfo, bInfo) {
		if (aInfo.curContribution == bInfo.curContribution)
			return 0;
		return aInfo.curContribution > bInfo.curContribution ? -1 : 1;
	};

	public GetMaxMember(): number {
		if (GameServer.serverMergeTime > 0)
			return GlobalConfig.ins("GuildConfig").maxHeFuMember[(this.guildLv || 1) - 1]
		else
			return GlobalConfig.ins("GuildConfig").maxMember[(this.guildLv || 1) - 1]
	}

	public IsRedPoint(): boolean {
		if (this.IsTaskRedPoint()) {
			return true
		}
		if (Guild.ins().myOffice >= GuildOffice.GUILD_FUBANGZHU && Guild.ins().hasApplys())
			return true
		if (GuildFB.ins().hasbtn())
			return true
		if ((GameLogic.ins().actorModel.guildID == undefined || GameLogic.ins().actorModel.guildID == 0) && GameLogic.ins().actorModel.level > 69)
			return true
		if (GuildRobber.ins().hasbtn())
			return true
		return false
	}

	public IsTaskRedPoint(): boolean {
		if (!GameGlobal.actorModel.guildID) {
			return false
		}
		for (var key in this.guildTaskInfos) {
			if (this.guildTaskInfos.hasOwnProperty(key)) {
				var element = this.guildTaskInfos[key];
				if (element.taskID == 2) {
					if (element.state == RewardState.NotReached) {
						return true
					}
					break
				}
			}
		}
		return false
	}

	checkIsInGuild(actorId: number): boolean {
		for (var key in this._guildMembers) {
			var data = this._guildMembers[key];
			if (data.roleID == actorId) {
				return true
			}
		}
		return false
	}
}

MessageCenter.compile(Guild);
window["Guild"] = Guild