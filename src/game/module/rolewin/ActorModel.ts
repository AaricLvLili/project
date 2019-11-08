class ActorModel {

	/** 战斗力 */
	private _power = 0;
	handle: number = 0;

	actorID: number = 0;
	soul: number = 0;
	private _guildID: number = 0;
	private _guildName: string = '';
	private _name: string = "";
	private _level: number = 0;
	private _exp: number = 0;
	private _gold: number = 0;
	private _yb: number = 0;
	private _redName: number = 0;
	private _feats: number = 0
	private _prestige: number = 0
	private _prestige_level: number = 0
	private _coupon: number = 0;
	public honor: number = 0;
	/**真气值*/
	private _zhenqi: number = 0;
	/***分享币*/
	private _sharecoin = 0;
	// public guildContrib: number
	// public guildFund: number
	private _petCredit: number = 0//宠物积分
	private _rideCredit: number = 0//坐骑积分
	private _crossCredit: number = 0//跨服积分
	private _artifactCredit: number = 0//跨服积分

	public mFuncOpen: number = 0;
	public mSaveData: number = 0;
	private bagBaseConfig: any;

	public maxCoupon: number = 0;
	public static IsGM(): boolean {
		if (Main.isDebug) {
			return true
		}
		return StartGetUserInfo.gmLevel == 100
	}

	public get vipLv(): number {
		return UserVip.ins().lv
	}

	public get zsLv(): number {
		return UserZs.ins().lv
	}

	public constructor() {
	}


    /**
     *
     * @param bytes
     */
	public parser(data: Sproto.scActorBase_request) {
		this.handle = data.handle;
		this.actorID = data.actorid;
		//GameServer.serverID = data.serverid; 不在重新赋值
		//一般使用readString接口读取
		//这里需要靠长度读取，有疑问看协议编辑器
		this._name = data.actorname;
		this._level = data.level;
		this._exp = data.exp;
		this._power = data.power;
		this._gold = data.gold;
		this._yb = data.yuanbao;
		this._redName = data.redName;
		this.coupon = data.ticket;
		this.maxCoupon = data.ticketTotal;
		UserVip.ins().lv = data.vip;
		this.soul = data.soul;

		if (this.bagBaseConfig == null)
			this.bagBaseConfig = GlobalConfig.ins("BagBaseConfig");
		var BagBaseConfig = this.bagBaseConfig;
		UserBag.ins().bagNum = data.bagnum * BagBaseConfig.rowSize + BagBaseConfig.baseSize;
		this._feats = data.feats;
		this._prestige = data.prestige;
		this._prestige_level = data.prestige_level;
		this.mFuncOpen = data.gongnengYugao
		this.mSaveData = data.clientvalue
		this.honor = data.crossTiantiGlory;
		this._zhenqi = data.zhenqi;
		if (data.sharecoin) this._sharecoin = data.sharecoin;
		// this.prestige = data.prestige
	};
	get name() {
		return this._name;
	}
	set name(value) {
		if (this._name != value) {
			this._name = value;
			// MessageCenter.ins().dispatch(MessagerEvent.NAME_CHANGE);
			GameLogic.ins().postNameChange();
		}
	}
	get gold() {
		return this._gold;
	}
	set gold(value) {
		if (this._gold != value) {
			// if (this._gold > 0) {
			var addGold = value - this._gold;
			if (addGold > 0) {
				var str = "";
				str = "|C:" + Color.OrangeTips + "&T:" + GlobalConfig.jifengTiaoyueLg.st100018 + "  +" + addGold + "|";
				UserTips.ins().showTips(str);
			}
			// }
			this._gold = value;
		}
	}
	get yb() {
		return this._yb;
	}
	set yb(value) {
		if (this._yb != value) {
			// if (this._yb > 0) {
			var addYB = value - this._yb;
			if (addYB > 0) {
				var str = "";
				str = "|C:0xffb02d&T:" + GlobalConfig.jifengTiaoyueLg.st100050 + "  +" + addYB + "|";
				UserTips.ins().showTips(str);
			}
			// }
			this._yb = value;
		}
	}
	get coupon() {
		return this._coupon;
	}
	set coupon(value) {
		if (this._coupon != value) {
			var addYB = value - this._coupon;
			if (addYB > 0) {
				var str = "";
				str = "|C:0xffb02d&T:" + GlobalConfig.jifengTiaoyueLg.st102102 + "  +" + addYB + "|";
				UserTips.ins().showTips(str);
			}
			this._coupon = value;
		}
	}

	get sharecoin() {
		return this._sharecoin
	}
	set sharecoin(value: number) {
		if (this._sharecoin != value) {
			var add = value - this._sharecoin;
			if (add > 0) {
				var str = "";
				str = "|C:0xffb02d&T:" + GlobalConfig.jifengTiaoyueLg.st101933 + "  +" + add + "|";
				UserTips.ins().showTips(str);
			}
			this._sharecoin = value
			GameGlobal.MessageCenter.dispatch(ShareEvt.WX_SHARECOIN);
		}
	}

	get zhenqi() {
		return this._zhenqi;
	}
	set zhenqi(value) {
		if (this._zhenqi != value) {
			var addZhenQi = value - this._zhenqi;
			if (addZhenQi > 0) {
				var str = "";
				str = "|C:0xffb02d&T:" + GlobalConfig.jifengTiaoyueLg.st101934 + "  +" + addZhenQi + "|";
				UserTips.ins().showTips(str);
			}
			this._zhenqi = value;
		}
	}

	get redName() {
		return this._redName;
	}
	set redName(value) {
		if (this._redName != value) {
			// if (this._redName > 0) {
			var change = value - this._redName;
			if (change != -1) {
				var str = "";
				if (change > 0) {
					str = "|C:0xffb02d&T:" + GlobalConfig.jifengTiaoyueLg.st101935 + "  " + change + "|";
				} else {
					str = "|C:0xffb02d&T:" + GlobalConfig.jifengTiaoyueLg.st101935 + "  " + change + "|";
				}
				UserTips.ins().showTips(str);
			}
			// }
			this._redName = value;
		}
	}
	get level() {
		return this._level;
	}
	set level(value) {
		if (this._level != value) {
			this._level = value
			ActivityModel.SendLevelInfo()
			MessageCenter.ins().dispatch(MessageDef.LEVEL_CHANGE)
			GameLogic.ins().postLevelChange()
			// SoundManager.ins().playEffect(GlobalConfig.soundConfig[5].soundResource + "_mp3");
			let isPlay = SoundSetPanel.getSoundLocalData("btnSoundEff");
			if (isPlay) {
				SoundUtils.getInstance().playSound(GlobalConfig.soundConfig[5].id);
			}
		}
	}
	get exp() {
		return this._exp;
	}
	set exp(value) {
		if (this._exp != value) {
			this._exp = value;
		}
		if (value) MessageCenter.ins().dispatch(MessageDef.EXP_CHANGE);
	}

	get power() {
		return this._power;
	}
	set power(value) {
		if (this._power != value) {
			if (this._power < value && this._power > 0) {
				MessageCenter.ins().dispatch(MessageDef.POWER_BOOST, value, this._power);
				//待改
				// UserTips.ins().showBoostPower(value, this._power);
			}
			this._power = value;

			// GameLogic.ins().postPowerChange();
		}
		if (value != null) {
			MessageCenter.ins().dispatch(MessageDef.POWER_CHANGE);
		}
	}
	// public static postPowerBoost(newValue:number,oldValue:number):any
	// {
	// 	return [newValue , oldValue];
	// }
	public setGuild(id, name) {
		if (this._guildID != id) {
			this._guildID = id;
			this._guildName = name;
			if (this._guildID != 0) {
				if (ViewManager.ins().isShow(GuildApplyWin)) {
					if (ViewManager.ins().isShow(GuildCreateWin)) {
						ViewManager.ins().close(GuildCreateWin)
					}
					ViewManager.ins().close(GuildApplyWin);
					ViewManager.ins().open(GuildMap);
				}
			}
		}
	};
	get guildID() {
		return this._guildID;
	}

	public HasGuild(): boolean {
		return this._guildID != 0
	}

	get guildName() {
		return this._guildName;
	}

	get feats(): number {
		return this._feats
	}

	set feats(value: number) {
		if (this._feats != value) {
			// if (this._feats >= 0) {
			let t = value - this._feats
			if (t > 0) {
				UserTips.ins().showTips("|C:0xffb02d&T:" + GlobalConfig.jifengTiaoyueLg.st100077 + "  +" + t + "|")
			}
			// }
			this._feats = value

		}
	}

	get prestige(): number {
		return this._prestige
	}
	set prestige(value: number) {
		if (this._prestige != value) {
			let t = value - this._prestige
			if (t > 0) {
				UserTips.ins().showTips("|C:0xffb02d&T:" + GlobalConfig.jifengTiaoyueLg.st101246 + "  +" + t + "|")
			}
			this._prestige = value
		}
	}

	get prestige_level(): number {
		return this._prestige_level
	}
	set prestige_level(value: number) {
		this._prestige_level = value
	}

	get petCredit(): number {
		return this._petCredit
	}

	set petCredit(value: number) {
		if (this._petCredit != value) {
			let t = value - this._petCredit
			if (t > 0) {
				UserTips.ins().showTips("|C:0xffb02d&T:" + GlobalConfig.jifengTiaoyueLg.st101936 + "  +" + t + "|")
			}
			this._petCredit = value
		}
	}
	get rideCredit(): number {
		return this._rideCredit
	}

	set rideCredit(value: number) {
		if (this._rideCredit != value) {
			let t = value - this._rideCredit
			if (t > 0) {
				UserTips.ins().showTips("|C:0xffb02d&T:" + GlobalConfig.jifengTiaoyueLg.st101937 + "  +" + t + "|")
			}
			this._rideCredit = value
		}
	}
	get crossCredit(): number {
		return this._crossCredit
	}

	set crossCredit(value: number) {
		if (this._crossCredit != value) {
			let t = value - this._crossCredit
			if (t > 0) {
				UserTips.ins().showTips("|C:0xffb02d&T:" + GlobalConfig.jifengTiaoyueLg.st101938 + "  +" + t + "|")
			}
			this._crossCredit = value
		}
	}
	get artifactCredit(): number {
		return this._artifactCredit
	}

	set artifactCredit(value: number) {
		if (this._artifactCredit != value) {
			let t = value - this._artifactCredit
			if (t > 0) {
				UserTips.ins().showTips("|C:0xffb02d&T:" + GlobalConfig.jifengTiaoyueLg.st101939 + "  +" + t + "|")
			}
			this._artifactCredit = value
		}
	}

}
window["ActorModel"] = ActorModel