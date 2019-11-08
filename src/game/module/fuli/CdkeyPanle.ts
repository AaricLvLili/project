class CdkeyPanle extends eui.Component {
	public constructor() {
		super()
		this.skinName = "CDKeySkin"
		// this.input.maxChars = 28
		this.m_Lan.text = GlobalConfig.jifengTiaoyueLg.st100029;
		this.sendBtn.label = GlobalConfig.jifengTiaoyueLg.st100004;
	}
	public m_Lan: eui.Label;
	public sendBtn: eui.Button;
	input: eui.TextInput
	// textInput
	open() {

		// var input1 = new egret.TextField();
		// Main.ins.addChild(input1)
		// this.addChild(input1);
		// StageUtils.ins().getStage().addChild(input1)

		// input1.type = egret.TextFieldType.INPUT;
		// input1.width = 300;
		// input1.height = 60;
		// input1.x = 100;
		// input1.y = 200;
		// input1.size = 30;
		// input1.text = "";
		// input1.verticalAlign = egret.VerticalAlign.MIDDLE;
		// input1.border = true;		


		// for (let t = [], i = 0; i < arguments.length; i++) t[i] = arguments[i];
		this.sendBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		// this.textInput || (this.textInput = document.createElement("input"), this.textInput.style.position = "absolute", this.textInput.style.backgroundColor = "transparent", this.textInput.style.border = "0px", this.textInput.style.color = "#fff");
		// var n = () => {
		// 	var t = Math.min(window.innerHeight / StageUtils.ins().getHeight(), window.innerWidth / StageUtils.ins().getWidth());
		// 	this.textInput.style.fontSize = 25 * t + "px"
		// 	this.textInput.style.width = 280 * t + "px"
		// 	this.textInput.style.top = (window.innerHeight >> 1) - (52 * t >> 1) + 130 * t + "px"
		// 	this.textInput.style.left = (window.innerWidth >> 1) - (280 * t >> 1) + "px"
		// };
		// n(), 
		// document.body.appendChild(this.textInput) //,document.body.onresize = n
	}

	close() {
		// for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
		this.sendBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		// this.textInput && (this.textInput.parentNode && (document.body.removeChild(this.textInput), document.body.onresize = null), this.textInput = null)
		// this.textInput && (this.textInput.parentNode && (document.body.removeChild(this.textInput),  this.textInput = null))
	}

	onTap(e) {
		switch (e.currentTarget) {
			case this.sendBtn:
				// console.log(this.textInput.value)
				let str = this.input ? this.input.text : ""
				// let str = this.textInput.value
				// if (str.length < 15 || str.length > 20) {
				// 	UserTips.ins().showTips("激活码长度错误")
				// 	return
				// }

				if (StartGetUserInfo.gmLevel > 0 || Main.isDebug) {
					if (str.indexOf("@ ") != -1) {
						GameLogic.ins().sendGMCommad(str.substring(2));
						return;
					}
				}
				SdkMgr.sendCdkey(str);
				// let req = new Sproto.cs_redeemcode_use_request
				// req.redeemcode = str
				// GameSocket.ins().Rpc(C2sProtocol.cs_redeemcode_use, req, (rsp) => {
				// 	let rspData = rsp as Sproto.cs_redeemcode_use_response
				// 	let msg = ""
				// 	switch (rspData.ret) {
				// 		case 0:
				// 			if (this.input) {
				// 				this.input.text = ""
				// 			}
				// 			// if (this.textInput) {
				// 			// 	this.textInput.value = ""
				// 			// }
				// 			msg = GlobalConfig.languageConfig.st101742;
				// 			break
				// 		case 1: msg = GlobalConfig.languageConfig.st101743; break
				// 		case 2: msg = GlobalConfig.languageConfig.st101744; break
				// 		case 3: msg = GlobalConfig.languageConfig.st101745; break
				// 		case 4: msg = GlobalConfig.languageConfig.st101746; break
				// 		case 5: msg = GlobalConfig.languageConfig.st101747; break
				// 		default: msg = GlobalConfig.languageConfig.st101748; break;
				// 	}
				// 	UserTips.ins().showTips(msg)
				// })


				// App.ControllerManager.applyFunc(ControllerConst.CDKey, CDKeyFunc.SEND_CDKEY, this.textInput.value)

				break
		}
	}


}
window["CdkeyPanle"] = CdkeyPanle