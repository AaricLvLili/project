class VitalityNewPanel extends BaseView implements ICommonWindowTitle {
	windowTitleIconName?: string;
	public constructor(data?: any) {
		super();
		this.name = GlobalConfig.jifengTiaoyueLg.st102096;
		this.windowTitleIconName = GlobalConfig.jifengTiaoyueLg.st102096;
		this.skinName = "VitalityNewPanelSkin";
		this.touchEnabled = false;
	}
	public m_Img: eui.Image;
	public totalPower: PowerLabel;
	public m_NowLv: eui.Label;
	public m_NextLv: eui.Label;
	public m_Lan1: eui.Label;
	public m_Lan2: eui.Label;
	public m_Lan3: eui.Label;
	public m_ScheduleLab: eui.Label;
	public m_AttrGroup1: eui.Group;
	public m_AttrGroup2: eui.Group;
	public m_RightArrImg: eui.Image;
	public m_Progress: eui.ProgressBar;
	public m_List1: eui.List;
	public m_List2: eui.List;
	public m_MainBtn: eui.Button;
	public m_Scroller: eui.Scroller;
	public list: eui.List;

	private listData: eui.ArrayCollection;
	private listData1: eui.ArrayCollection;
	private listData2: eui.ArrayCollection;

	private index: number = 0;
	public m_TipsLab: eui.Label;
	public m_StateImg: eui.Image;
	public m_LiLianImg: eui.Image;

	protected childrenCreated() {
		super.childrenCreated();
		this.listData = new eui.ArrayCollection;
		this.listData1 = new eui.ArrayCollection;
		this.listData2 = new eui.ArrayCollection;
		this.list.itemRenderer = VitalityListItem;
		this.list.dataProvider = this.listData;
		this.m_List1.dataProvider = this.listData1;
		this.m_List2.dataProvider = this.listData2;
		this.m_Lan1.text = GlobalConfig.jifengTiaoyueLg.st102092;
		this.m_Lan2.text = GlobalConfig.jifengTiaoyueLg.st102093;
		this.m_Lan3.text = GlobalConfig.jifengTiaoyueLg.st102094;
		this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st100004;
		UserTask.ins().getLordAward(1)
	};
	private addViewEvent() {
		this.observe(MessageDef.UPDATE_VITALITY, this.initData);
		this.observe(MessageDef.UPDATA_TASK, this.initData);
		this.AddClick(this.m_MainBtn, this.onClick);
	}
	private removeEvent() {
	}

	public open() {
		this.addViewEvent();
		this.initData();
	};
	public close() {
		this.removeEvent();
	};

	public release() {
	}

	private initData() {
		let task = UserTask.ins();
		let datas = task.GetTaskList()
		for (var i = 0; i < datas.length; i++) {
			datas[i].weight = 0;
			switch (datas[i].state) {
				case 0:
					datas[i].weight += 2000;
					break;
				case 1:
					datas[i].weight += 10000;
					break;
				case 2:
					datas[i].weight += 1000;
					break;
			}
			let configData01 = GlobalConfig.ins("DailyConfig")[datas[i].id]
			let open01 = configData01 ? Deblocking.Check(configData01.funcopenId, true) : false
			if (open01) {
				datas[i].weight += 100;
			}
			datas[i].weight += datas[i].id;
		}
		datas.sort((lhs, rhs) => {
			return rhs.weight - lhs.weight;
		})
		this.listData.removeAll();
		this.listData.replaceAll(datas);
		this.m_Progress.visible = true;
		this.m_LiLianImg.visible = true;
		this.m_Progress.value = task.exp;
		let lordLevelConfig = GlobalConfig.ins("LordLevelConfig")[task.lv];
		let nextLordLevelConfig = GlobalConfig.ins("LordLevelConfig")[task.lv + 1];
		if (lordLevelConfig) {
			this.m_NowLv.text = lordLevelConfig.levelTips + GlobalConfig.jifengTiaoyueLg.st102091;
			AttributeData.setAttrGroup(lordLevelConfig.attrs, this.m_AttrGroup1, 16, Color.FontColor, false);
			this.m_Img.source = lordLevelConfig.pich;
			this.totalPower.text = UserBag.getAttrPower(lordLevelConfig.attrs);
		}
		if (nextLordLevelConfig) {
			this.m_NextLv.text = nextLordLevelConfig.levelTips + GlobalConfig.jifengTiaoyueLg.st102091;
			AttributeData.setAttrGroup(nextLordLevelConfig.attrs, this.m_AttrGroup2, 16, Color.FontColor, false, Color.needOrange);
			this.m_NextLv.visible = true;
			this.m_AttrGroup2.visible = true;
			this.m_RightArrImg.visible = true;
			this.m_Progress.maximum = nextLordLevelConfig.growUpNeed;
			let award = task.getLordAward(task.lv + 1);
			this.listData1.removeAll();
			this.listData1.replaceAll(award);
			this.m_StateImg.visible = false;
		} else {
			this.m_NextLv.visible = false;
			this.m_AttrGroup2.visible = false;
			this.m_RightArrImg.visible = false;
			this.m_Progress.maximum = 0;
			this.m_Progress.value = 0;
			this.m_Progress.visible = false;
			this.m_LiLianImg.visible = false;
			let award = task.getLordAward(task.lv);
			this.listData1.removeAll();
			this.listData1.replaceAll(award);
			this.m_StateImg.visible = true;
		}
		// if (nowLayerLv == task.dic.values.length) {
		// 	let award = task.getLordAward(nowLayerLv);
		// 	this.listData1.removeAll();
		// 	this.listData1.replaceAll(award);
		// 	this.m_StateImg.visible = true;
		// } else {
		// 	let award = task.getLordAward(nowLayerLv + 1);
		// 	this.listData1.removeAll();
		// 	this.listData1.replaceAll(award);
		// 	this.m_StateImg.visible = false;
		// }
		this.setSchedule();

	}

	public setSchedule() {
		let value = UserTask.ins().vitality
		let state: number = 0;/**0未达成 1是可领取 2是已领取*/
		let dailyAwardConfig;
		let playerzs = UserZs.ins() ? UserZs.ins().lv : 0;
		for (let i = 1; i <= 4; ++i) {
			let isCanGet = UserTask.ins().IsCanGet(i - 1)
			dailyAwardConfig = GlobalConfig.ins("DailyAwardConfig")[i];
			this.index = i;
			if (dailyAwardConfig) {
				// this.m_ScheduleLab.text = value + "/" + dailyAwardConfig.valueLimit;
				ViewManager.ins().setLab(this.m_ScheduleLab, value, dailyAwardConfig.valueLimit)
				if (value < dailyAwardConfig.valueLimit || isCanGet || (value >= dailyAwardConfig.valueLimit && !isCanGet && i == 4)) {
					if (value >= dailyAwardConfig.valueLimit && !isCanGet) {
						state = 2;
					} else if (isCanGet) {
						state = 1;
					}
					break;
				}
			}
		}
		if (dailyAwardConfig) {
			this.listData2.removeAll();
			this.listData2.replaceAll(dailyAwardConfig["awardList" + playerzs]);
		}
		switch (state) {
			case 0:
				this.m_TipsLab.text = GlobalConfig.jifengTiaoyueLg.st100680;
				this.m_TipsLab.textColor = Color.Red;
				this.m_MainBtn.visible = false;
				this.m_TipsLab.visible = true;
				break;
			case 1:
				this.m_MainBtn.visible = true;
				this.m_TipsLab.visible = false;
				break;
			case 2:
				this.m_TipsLab.text = GlobalConfig.jifengTiaoyueLg.st100981;
				this.m_TipsLab.textColor = Color.Green;
				this.m_MainBtn.visible = false;
				this.m_TipsLab.visible = true;
				break;
		}

	}
	public onClick(e: egret.TouchEvent) {
		UserTask.ins().sendGetVitalityAwards(this.index);
	}

	UpdateContent() {

	}
	public CheckRedPoint() {
		let task = UserTask.ins();
		return task.CheckAllVitalityReward();
	}
}
window["VitalityNewPanel"] = VitalityNewPanel