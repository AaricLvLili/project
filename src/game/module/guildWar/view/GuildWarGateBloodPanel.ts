class GuildWarGateBloodPanel extends BaseEuiView {

    public static LAYER_LEVEL = LayerManager.UI_HUD

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // GuildWarGateBloodPanelSkin.exml
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private hudunbloodBar: eui.ProgressBar
    private hudun: eui.Group
    private head: eui.Image
    private bloodBar: eui.ProgressBar
    private hpGroup: eui.Group
    private myTxt: eui.Label
    private lvTxt: eui.Label
    private nameTxt: eui.Label
    private dropDown: DropDown
	private languageTxt:eui.Label;
    ////////////////////////////////////////////////////////////////////////////////////////////////////

	public static Update(data: Sproto.sc_gdwar_wall_rank_request): void {
		let view = ViewManager.ins().getView(GuildWarGateBloodPanel)
		if (view && view.isShow) {
			(<GuildWarGateBloodPanel>view).UpdateContent(data)
		}
	}
	
	public constructor() {
		super()
		this.skinName = "GuildWarGateBloodPanelSkin"
		this.dropDown.setEnabled(false);
		this.hudun.visible = false;
		this.hudunbloodBar.labelFunction = function(value: number, maximum: number) {
			return Math.floor(value * 100.0/ maximum) + "%"
		}

		this.bloodBar.labelFunction = function(value: number, maximum: number) {
			return Math.floor(value * 100.0/ maximum) + "%"
		}

		this.InitData()
	}

	private monstersConfig:any;
	private guildBattleConst:any;

	private InitData(): void {
		if(this.monstersConfig == null) 
            this.monstersConfig = GlobalConfig.monstersConfig;

		if(GuildWar.ins().guildWarStartType == 1)
			this.guildBattleConst = GlobalConfig.ins("GuildBattleConst1");
		else if(GuildWar.ins().guildWarStartType == 2)
			this.guildBattleConst = GlobalConfig.ins("GuildBattleConst2");
		else
			this.guildBattleConst = GlobalConfig.ins("GuildBattleConst");	
		
		let config = this.guildBattleConst;
		this.hudunbloodBar.value = this.hudunbloodBar.maximum = config.shieldtime
		this.bloodBar.value = this.bloodBar.maximum = config.gatetime
		var monConfig = this.monstersConfig[config.gate.id];
		this.nameTxt.text = monConfig.name;
		this.head.source = ResDataPath.getBossHeadImage(monConfig.head);//monConfig.head + "_png";
		this.lvTxt.text = monConfig.level + "";
		this.myTxt.text = GlobalConfig.jifengTiaoyueLg.st101791 + ":0"
		this.hudun.visible = false
		this.languageTxt.text = GlobalConfig.jifengTiaoyueLg.st101382;
	}

	public UpdateContent(data: Sproto.sc_gdwar_wall_rank_request) {
		let dataArr = data.hurtRanks
		let len = dataArr ? dataArr.length : 0;
		if (len) {
			let list = []
			dataArr.sort(function(lhs, rhs) {
				return rhs.hurtValue - lhs.hurtValue
			})
			for (let i = 0; i < Math.min(len, 10); ++i) {
				let data = dataArr[i]
				let str = data.guildName + ":" + CommonUtils.overLength(data.hurtValue)
				let len = StringUtils.strByteLen(str);
				// str = StringUtils.complementByChar("", 27 - len) + str;
				list.push({ name: str })
			}
			this.dropDown.setData(new eui.ArrayCollection(list.slice(1, len)));
			this.dropDown.setLabel(list[0].name);
		}
		else {
			this.dropDown.setData(new eui.ArrayCollection([]));
			this.dropDown.setLabel('');
		}
		len = dataArr ? dataArr.length : 0;
		let id = GameLogic.ins().actorModel.guildID
		for (let i = 0; i < len; i++) {
			if (dataArr[i].guildId == id) {
				this.myTxt.text = GlobalConfig.jifengTiaoyueLg.st101791 + ":" + CommonUtils.overLength(dataArr[i].hurtValue);
				break;
			}
		}
		this.bloodBar.value = data.wallTime
		if (this.hudun.visible = data.shieldTime > 0) {
			this.hudunbloodBar.value = data.shieldTime
		}
	}
}

window["GuildWarGateBloodPanel"]=GuildWarGateBloodPanel