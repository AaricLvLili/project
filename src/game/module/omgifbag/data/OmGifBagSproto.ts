class OmGifBagSproto extends BaseSystem {
	public constructor() {
		super();
		this.regNetMsg(S2cProtocol.sc_one_gift, this.omGifBagInfo);
		this.regNetMsg(S2cProtocol.sc_one_gift, this.omGifBagInfo);
	}
	static ins(): OmGifBagSproto {
		return super.ins();
	}
	private omGifBagInfo(bytes: Sproto.sc_one_gift_request) {
		OmGifBagModel.getInstance.list = bytes.list;
		let data = bytes.list[0]
		if (data) {
			if (data.statu == 2) {
				ViewManager.ins().close(OmGifBagWin);
			}
		}
		MessageCenter.ins().dispatch(OmgGifBagEvt.OMGGIFBAG_UPDATE);
	}
	public sendGetRewar(index: number) {
		let rsp = new Sproto.cs_one_gift_rewards_request;
		rsp.index = index;
		this.Rpc(C2sProtocol.cs_one_gift_rewards, rsp);
	}

	public sendText(index: number) {
		let rsp = new Sproto.cs_one_gift_buy_test_request;
		rsp.index = index;
		this.Rpc(C2sProtocol.cs_one_gift_buy_test, rsp);
	}
}
window["OmGifBagSproto"] = OmGifBagSproto