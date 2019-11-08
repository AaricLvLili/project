/** 任务分享*/
class ShareMissionWin extends BaseEuiPanel {
    static LAYER_LEVEL = LayerManager.UI_Popup
    public constructor() {
        super();
    }
    public m_CloseBtn: eui.Button;
    public m_List: eui.List;
    public m_MainBtn: eui.Button;
    public m_AnimGroup: eui.Group;
    public roleShowPanel: RoleShowPanel;
    private listData: eui.ArrayCollection;
    public m_BoxImg: eui.Image;
    public m_Img: eui.Label;


    m_Eff: MovieClip

    private missionCompel: boolean = false;

    private oldId: number = 0;

    public initUI(): void {
        super.initUI();
        this.skinName = "ShareMissionWinSkin";
        this.listData = new eui.ArrayCollection;
        this.m_List.itemRenderer = ItemBase;
        this.m_List.dataProvider = this.listData;
        this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st101442;

    }

    /** 窗口打开基类调用*/
    public open(...param: any[]): void {
        super.open(param);
        let shareMissionModel = ShareMissionModel.getInstance;
        this.oldId = shareMissionModel.missionShareId;
        this.missionCompel = false;
        this.AddClick(this.m_CloseBtn, this.onTap);
        this.AddClick(this.m_MainBtn, this.onClickMainBtn);
        this.observe(ShareEvt.SHARE_MISSION_MSG, this.setData);
        this.setData();
    }
    /** 窗口关闭基类调用*/
    public close(): void {
        super.close();
    }
    setData() {
        let shareMissionModel = ShareMissionModel.getInstance;
        let id = this.oldId;
        let share8config = GlobalConfig.ins("Share8Config")[id];
        if (share8config) {
            this.listData.removeAll();
            this.listData.replaceAll(share8config.tbReward);
            this.listData.refresh();
            switch (share8config.movieShowType) {
                case 1:
                    let role = SubRoles.ins().getSubRoleByIndex(0);
                    this.roleShowPanel.creatAnim(role);
                    this.roleShowPanel.setCharSexJob(role.sex, role.job, share8config.movieBody, share8config.movieWeapon, share8config.movieMounts, share8config.movieWing)
                    this.roleShowPanel.visible = true;
                    this.m_AnimGroup.visible = false;
                    this.m_BoxImg.visible = false;
                    break;
                case 2:
                    this.roleShowPanel.visible = false;
                    this.m_AnimGroup.visible = true;
                    this.playEff(share8config.moviePet + "_3" + EntityAction.STAND);
                    this.m_BoxImg.visible = false;
                    break;
                case 3:
                    this.roleShowPanel.visible = false;
                    this.m_AnimGroup.visible = false;
                    this.m_BoxImg.visible = false;
                    break;
                case 4:
                    this.roleShowPanel.visible = false;
                    this.m_AnimGroup.visible = false;
                    this.m_BoxImg.visible = true;
                    this.m_BoxImg.source = share8config.phShow + "_png";
                    break;
            }
            this.m_Img.text = share8config.describe;
            let state = shareMissionModel.missionShareState;
            if (this.missionCompel == true) {
                state = 1;
            }
            switch (state) {
                case 0:
                    this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st101442;
                    this.m_MainBtn.enabled = true;
                    break;
                case 1:
                    this.m_MainBtn.label = GlobalConfig.jifengTiaoyueLg.st100981;
                    this.m_MainBtn.enabled = false;
                    break;
            }
        }

    }

    private playEff(name: string) {
        this.initEffData();
        this.m_Eff.loadUrl(ResDataPath.GetMonsterBodyPath(name), true, -1);
    }

    private initEffData() {
        if (!this.m_Eff) {
            this.m_Eff = new MovieClip();
            this.m_Eff.touchEnabled = false;
            this.m_AnimGroup.addChild(this.m_Eff);
            this.m_Eff.x = this.m_AnimGroup.width / 2;
            this.m_Eff.y = this.m_AnimGroup.height / 2;
        }
    }




    /** 触摸抬起事件调用*/
    private onTap(e: egret.TouchEvent): void {
        ViewManager.ins().close(this);
    }

    /** 领取奖励*/
    private onClickMainBtn(e: egret.TouchEvent): void {
        if (SdkMgr.isWxGame())
            WxSdk.ins().shareAppMessage();
        this.missionCompel = true;
        this.setData();
        ShareMissionSproto.ins().sendShareMission(ShareMissionModel.getInstance.missionShareId);
    }
}
window["ShareMissionWin"] = ShareMissionWin 
