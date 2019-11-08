/***
 * 反馈意见界面
 * wjh 
 */
class OpinionPanel extends BaseEuiPanel {
	public constructor() {
		super();
		this.skinName = "OpinionPanelSkin";
	}
	/** 遮罩背景*/
	private maskBg: eui.Image;
	/** 关闭按钮*/
	//public dialogCloseBtn: eui.Button;
	/** 发送按钮*/
	public sendBtn: eui.Button;
	/** 1bug;2:建议3充值建议*/
	public check_1: eui.CheckBox;
	public check_2: eui.CheckBox;
	public check_3: eui.CheckBox;
	/** 输入内容文本*/
	public contentTxt: eui.EditableText;
	/** 输入联系方式文本*/
	public qqTxt: eui.EditableText;
	/** 类型 1bug;2:建议3充值建议*/
	private type: number = 1;
	private title: string = "";


	public initUI() {
		super.initUI();
		this.check_1.selected = true;
		
	}

	open() {
		this.m_bg.init(`OpinionPanel`,GlobalConfig.jifengTiaoyueLg.st101750)
		this.contentTxt.text = this.qqTxt.text = "";
		this.AddClick(this.maskBg, this.onClick);
		//this.AddClick(this.dialogCloseBtn, this.onClick);
		this.AddClick(this.sendBtn, this.onClick);
		this.AddClick(this.check_1, this.onClick);
		this.AddClick(this.check_2, this.onClick);
		this.AddClick(this.check_3, this.onClick);
		Sproto.SprotoReceiver.AddHandler(S2cProtocol.sc_faq_res, this.sc_faq_res_request, this);//返回提交信息
	}

	close() {
		this.removeChildren();
	}

	private onClick(e: egret.TouchEvent): void {
		if (e.currentTarget == this.maskBg ) {
			ViewManager.ins().close(OpinionPanel);
		}
		else if (e.currentTarget == this.sendBtn) {
			egret.log("发送");
			var rpcReq: Sproto.cs_faq_req_request = new Sproto.cs_faq_req_request;
			rpcReq.title = this.title;
			rpcReq.type = this.type;
			rpcReq.content = this.contentTxt.text;
			rpcReq.contact = this.qqTxt.text;
			GameSocket.ins().Rpc(C2sProtocol.cs_faq_req, rpcReq);
		}
		else if (e.currentTarget == this.check_1) {
			this.check_1.selected = true;
			this.check_2.selected = false;
			this.check_3.selected = false;
			this.type = 1;
			this.title = "bug";
		}
		else if (e.currentTarget == this.check_2) {
			this.check_1.selected = false;
			this.check_2.selected = true;
			this.check_3.selected = false;
			this.type = 2;
			this.title = GlobalConfig.jifengTiaoyueLg.st101750;
		} else if (e.currentTarget == this.check_3) {
			this.check_1.selected = false;
			this.check_2.selected = false;
			this.check_3.selected = true;
			this.type = 3;
			this.title = GlobalConfig.jifengTiaoyueLg.st101751;
		}
	}

	private sc_faq_res_request(byt: Sproto.sc_faq_res_request): void {
		egret.log(byt.ret);//0成功 1:提交失败 2:太频繁了
		if (byt.ret == 0) {
			UserTips.ins().showTips(GlobalConfig.jifengTiaoyueLg.st101752);
			ViewManager.ins().close(OpinionPanel);
		}
		else if (byt.ret == 1) {
			UserTips.ErrorTip(GlobalConfig.jifengTiaoyueLg.st101753);
		}
		else if (byt.ret == 2) {
			UserTips.ErrorTip(GlobalConfig.jifengTiaoyueLg.st101754);
		}
	}
}
ViewManager.ins().reg(OpinionPanel, LayerManager.UI_Popup);
window["OpinionPanel"]=OpinionPanel