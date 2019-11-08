class MountDanYaoUseWin extends BaseEuiPanel {
	public constructor() {
		super()
		this.skinName = "MountDanYaoUseWinSkin";
		this.m_ItemIcon.imgJob.visible = false;
	}

	public add: eui.Group;
	public m_MainNumLab: eui.TextInput;
	public m_CutBtn: eui.Image;
	public m_AddBtn: eui.Image;
	public m_MaxBtn: eui.Button;
	public m_MinBtn: eui.Button;
	public m_UseBtn: eui.Button;
	public m_AttrGroup: eui.Group;
	public m_ItemIcon: any;

	public m_NameLab: eui.Label;
	public m_CountLab: eui.Label;
	private nowNum: number = 1;
	private itemData: ItemData;
	private languageTxt: eui.Label;
	private languageTxt0: eui.Label;
	private itemType: number;
	initUI() {
		super.initUI();
		this.m_MaxBtn.label = GlobalConfig.jifengTiaoyueLg.st101113;
		this.m_MinBtn.label = GlobalConfig.jifengTiaoyueLg.st101114;
		this.m_UseBtn.label = GlobalConfig.jifengTiaoyueLg.st100683;
		this.languageTxt.text = GlobalConfig.jifengTiaoyueLg.st100684 + "：";
		this.languageTxt0.text = GlobalConfig.jifengTiaoyueLg.st100685 + "：";
	}
	open(...param: any[]) {
		let itemData: ItemData = param[0];
		let itemType: ItemType = param[1];
		this.itemType = itemType;
		this.itemData = itemData;
		if (itemType == ItemType.TYPE16) {
			this.languageTxt.text = GlobalConfig.jifengTiaoyueLg.st102043;
		} else {
			this.languageTxt.text = GlobalConfig.jifengTiaoyueLg.st100684 + "：";
		}
		this.addViewEvent();
		this.setData();
		this.add.visible = this.m_UseBtn.visible = !param[2]
	}
	close() {
		this.release();
	}
	public release() {
		this.removeViewEvent();
	}
	private addViewEvent() {
		this.m_MainNumLab.addEventListener(egret.Event.CHANGING, this.onChangeNum, this);
		this.AddClick(this.m_CutBtn, this.onClickCunBtn);
		this.AddClick(this.m_AddBtn, this.onClickAddBtn);
		this.AddClick(this.m_MaxBtn, this.onClickMaxBtn);
		this.AddClick(this.m_MinBtn, this.onClickMainBtn);
		this.AddClick(this.m_UseBtn, this.onClickUseBtn);
		this.observe(TheGunEvt.THEGUN_DANYAO_MSG, this.setData);
		this.observe(MountEvt.MOUNT_DANYAO_MSG, this.setData);
	}
	private removeViewEvent() {
		this.m_MainNumLab.removeEventListener(egret.Event.CHANGING, this.onChangeNum, this);
	}
	private setData() {
		this.m_NameLab.text = this.itemData.itemConfig.name;
		this.m_CountLab.text = this.itemData.count + "";
		this.m_MainNumLab.text = this.nowNum + "";
		let mountModel = MountModel.getInstance;
		AttributeData.setAttrGroup(this.itemData.itemConfig.useArg, this.m_AttrGroup);
		this.m_ItemIcon.setData(this.itemData.itemConfig);
	}


	private onClickClose() {
		ViewManager.ins().close(this);
	}
	private onClickCunBtn() {
		if (this.nowNum > 1) {
			this.nowNum -= 1;
		}
		this.setData();
	}

	private onClickAddBtn() {
		if (this.nowNum < this.itemData.count) {
			this.nowNum += 1;
		}
		this.setData();
	}

	private onClickMaxBtn() {
		if (this.nowNum == this.itemData.count) {
			return;
		}
		this.nowNum = this.itemData.count;
		this.setData();
	}

	private onClickMainBtn() {
		if (this.nowNum == 1) {
			return;
		}
		this.nowNum = 1;
		this.setData();
	}

	private onChangeNum() {
		this.nowNum = parseInt(this.m_MainNumLab.text);
		if (this.nowNum > this.itemData.count) {
			this.nowNum = this.itemData.count;
		}
		if (this.nowNum < 1) {
			this.nowNum = 1;
		}
		this.setData();
	}
	private onClickUseBtn() {
		if (this.nowNum > 0) {
			if (this.itemType == ItemType.TYPE16) {
				let theGunModel: TheGunModel = TheGunModel.getInstance;
				TheGunSproto.ins().sendTheGunEatDanYao(theGunModel.nowSelectRoldData.roleID, this.itemData.configID, this.nowNum);
			} else {
				let mountModel: MountModel = MountModel.getInstance;
				MountSproto.ins().sendGetMountEatDanYao(mountModel.nowDanYaoSelectRoleData.roleID, this.itemData.configID, this.nowNum);
			}
		}
	}
}

ViewManager.ins().reg(MountDanYaoUseWin, LayerManager.UI_Popup);
window["MountDanYaoUseWin"] = MountDanYaoUseWin