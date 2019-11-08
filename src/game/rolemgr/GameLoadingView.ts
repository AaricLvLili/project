class GameLoadingView extends BaseEuiView {

	public constructor(call: Function) {
		super();
		this.skinName = "GameLoadingViewSkin";
		this.mResult = call;
		GameLoadingView.m_Instance = this

		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.creationComplete, this);
		StageUtils.ins().getUIStage().addChild(this);

		// this._initMc()
	}

	/** 版号信息*/
	public versionNumber: eui.Label;
	public m_IsClose = false
	public tip: eui.Label
	public bar: eui.ProgressBar
	public mResult: Function;
	public bg: eui.Image;
	public groupEff: eui.Group
	public mc: MovieClip
	public tip0: eui.Label;

	public static m_Instance: GameLoadingView
	public bar2: eui.ProgressBar;

	public childrenCreated(): void {
		super.childrenCreated();
		if (this.bg) {
			var source: string = "pic_bj_23_jpg";
			switch (LocationProperty.urlParam["tag"]) {
				case "wdws_lezhong_ios_wdws"://刀剑仙魔录-改成万道武神
					source = "wdws_lezhong_ios_djxml_loading_jpg";
					break;
				case "wdws_lezhong_android_wdws"://硬盒
				case "wdws_lezhong_ios_wdws_breakout"://越狱也算硬盒
					source = "yinghe_loading_jpg";
					break;
			}
			this.bg.source = source;

			if (SdkMgr.isWxGame()) {
				// this.bg.scaleX = 1.15;//闪图杠子那边缩小70%
				// this.bg.scaleY = 1.15;
				this.bg.width = 800 * Main.wxsystemInfo.screenWidth / StageUtils.ins().getWidth();
				this.bg.height = 1386 * Main.wxsystemInfo.screenHeight / StageUtils.ins().getHeight();
				this.bg.horizontalCenter = 0;
				this.bg.verticalCenter = 0;
				// console.log(">>>>>>>>>>>>>>>loadbg<<<<<" + this.bg.width + "//this.bg.height=" + this.bg.height);
				// console.log(">>>>>>>>>>>>>>>loadbg  parent<<<<<", this.bg.parent);
			}
			ResMgr.ins().saveLoadingRes(source);
			this.addTime();
		}

		if (SdkMgr.isWxGame()) {
			//删除登录图片
			Main.instance.removeBackBg();
		}
		this.tip0.text = "抵制不良游戏，拒绝盗版游戏，注意自我保护，谨防受骗上当。\n适度游戏益脑，沉迷游戏伤身，合理安排时间，享受健康生活。";
		if (SdkMgr.tag == "bsymx_baoyu_jfty_huawei") {
			this.versionNumber.text = "新广出审[2017]5723号    ISBN 978-7-7979-8966-4\n广州汉正信息科技有限公司   2017SR094425";
			this.versionNumber.textColor = 0xffffff;
		} else {
			this.versionNumber.text = "广州不思议网络科技有限公司";
		}
	}

	private creationComplete(): void {
		StatisticsUtils.setPhpLoading(2);
		StatisticsUtils.time = egret.getTimer();
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.creationComplete, this);
		this.mResult && this.mResult();
	}

	public ShowLoadProgress(progress: number, max: number, msg: string): void {
		if (Const.IsLoadType01) {
			if (this.bar) {
				this.bar.maximum = max;
				this.bar.value = progress
				this.groupEff.x = this.bar.x + this.bar.width * (progress / max) - 30
			}
			if (this.tip)
				GameLoadingView.m_Instance.tip.text = msg
		} else {
			console.log("GameLoadingView:ShowLoadProgress", progress, msg)
		}

	}
	private addTime() {
		this.removeTime();
		TimerManager.ins().doTimer(500, 0, this.setPro2, this);
	}
	public removeTime() {
		if (TimerManager.ins().isExists(this.setPro2, this)) {
			TimerManager.ins().remove(this.setPro2, this);
		}
	}
	private pronum = 0;
	private setPro2() {
		this.pronum += Math.ceil(Math.random() * 20) + 20;
		this.ShowLoadProgress2(this.pronum, 100);
		if (this.pronum >= 100) {
			this.pronum = 0;
		}
	}
	public ShowLoadProgress2(progress: number, max: number) {
		this.bar2.maximum = max;
		this.bar2.value = progress + 1;
	}
	public static CloseLoad() {
		if (!GameLoadingView.m_Instance || GameLoadingView.m_Instance.m_IsClose) {
			return
		}
		if (GameLoadingView.m_Instance.bg) {
			GameLoadingView.m_Instance.bg.visible = false;
			if (GameLoadingView.m_Instance.bg.parent)//额外移除一次，有时候会出现个移除不了背景的bug
				GameLoadingView.m_Instance.bg.parent.removeChild(GameLoadingView.m_Instance.bg);
		}
		DisplayUtils.disposeAll(GameLoadingView.m_Instance);
		GameLoadingView.m_Instance.removeTime();
		GameLoadingView.m_Instance.removeChildren();
		GameLoadingView.m_Instance.mc = null
		GameLoadingView.m_Instance = null
	}
	private _initMc(): void {
		this.mc = new MovieClip
		this.mc.x = this.groupEff.width / 2
		this.mc.y = this.groupEff.height / 2
		this.mc.loadUrl(ResDataPath.GetUIEffePath("ui_loading"), true)
		this.groupEff.addChild(this.mc)
		this.groupEff.x = this.bar.x + 33
	}

}
window["GameLoadingView"] = GameLoadingView