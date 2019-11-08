class navigateToWxItem extends BaseView {

    gameIcon:eui.Image
    gameName:eui.Label
    redImage:eui.Image

    private _data;

    public constructor() {
        super()
        this.skinName = "navigateToItem"
        this.AddClick(this, this.onClick)
    }

    public init(data)
    {
        this._data = data;
        this.gameName.text = this._data.gameName;
        this.gameIcon.source =  this._data.img+"_png";
    }

    public updateState(showRed)
    {
        this.redImage.visible = showRed;
    }

    private onClick()
    {
        console.log(">>>>>>>>>>>>>>跳转到"+this._data.gameName+"//路径是："+this._data.gamePath);
        
        let req = new Sproto.cs_exten_id_request
		req.id = this._data.index;
        GameSocket.ins().Rpc(C2sProtocol.cs_exten_id, req, null, this);

        WxSdk.ins().navigateToMiniProgram(this._data.appid,this._data.gamePath)
    }

    public getData()
    {
        return this._data;
    }
}

window["navigateToWxItem"] = navigateToWxItem