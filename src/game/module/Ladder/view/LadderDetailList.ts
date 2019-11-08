class LadderDetailList extends eui.ItemRenderer {
	private bg: eui.Image;
	private recordType: eui.Image;
	private isWin: eui.Image;
	private recordTime: eui.Label;
	private laddername: eui.Label;
	private zhuansheng_lv: eui.Label;
	private power: eui.Label;
	private awardType: eui.Label;
	public m_Lan1: eui.Label;

	public constructor() {
		super();
		this.skinName="ListDetailItem"
		this.m_Lan1.text=GlobalConfig.jifengTiaoyueLg.st100809;
	}

	dataChanged() {
		this.data;

		// recordType				0 : integer 	# 记录类型（1：攻，2：守）
		// isWin					1 : integer		# 结果类型（1：胜利，2：失败）
		// recordTime				2 : integer		# 记录时间（时间戳）
		// name					3 : string		# 被挑战着名字
		// power					4 : integer		# 被挑战者战斗力
		// awardType				5 : integer		# 1为+1星，2为+2星 4为-1星
		// zhuansheng_lv  			6 : integer		# 转生等级
		// lv						7 : integer		# 等级

		if (this.data.recordType == 1) {
			this.recordType.source = "comp_18_18_02_png";
		} else {
			this.recordType.source = "comp_18_18_01_png";
		}

		if (this.data.isWin == 1) {
			this.isWin.source = "comp_66_66_01_png";
		}
		else {
			this.isWin.source = "comp_66_66_02_png";
		}

		this.laddername.text = this.data.name;
		this.power.text = this.data.power;
		this.zhuansheng_lv.text = this.data.zhuansheng_lv + GlobalConfig.jifengTiaoyueLg.st100067 + this.data.lv + GlobalConfig.jifengTiaoyueLg.st100093;
		// this.recordTime.text = this.data.recordTime;
		this.recordTime.text = DateUtils.format_2(this.data.recordTime * 1000);
		if (this.data.awardType == 1) {
			this.awardType.text = "+1"
		}
		else if (this.data.awardType == 2) {
			this.awardType.text = "+2"
		}
		else if (this.data.awardType > 2) {
			this.awardType.text = "-1";
			this.awardType.textColor = 0xf87372;
		}
		else {
			this.awardType.text = "0";
		}

	}

}

window["LadderDetailList"] = LadderDetailList