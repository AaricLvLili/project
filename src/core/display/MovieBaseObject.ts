class MovieBaseObject extends egret.MovieClip{

	private _mcFactory:egret.MovieClipDataFactory;

	private m_Url:string;

	private m_State:boolean;
	public constructor() {
		super();
		var t = this;
		if(t._mcFactory == null)
        	t._mcFactory = new egret.MovieClipDataFactory,
        t.m_State = !1,
        t.touchEnabled = !1,
        t.addEventListener(egret.Event.COMPLETE, t._PlayComp, t),t
	}
	private m_CompFunc:Function;
	private _playCount:number;
	private _autoPlay:boolean;
	private _fileName:string;
	private LoadByUrl(e:string, t:number, i:boolean, o:Function)
	{
		 if (void 0 === i && (i = !0),
        e == this.m_Url)
            return void (this.m_State && this.dispatchEventWith(egret.Event.CHANGE));
        if (this.ClearCache(),
        this.m_Url = e,
        !StringUtils.IsNullOrEmpty(e)) {
            this.Ref(),
            this.m_CompFunc = o;
            this._playCount = t || -1;
            this._autoPlay = i;
            var s = e.lastIndexOf("/");
            -1 != s ? this._fileName = e.substring(s + 1) : this._fileName = e;
            var n = this._Load(this.GetImgUrl(), RES.ResourceItem.TYPE_IMAGE)
              , r = this._Load(this.GetJsonUrl(), RES.ResourceItem.TYPE_JSON);
            n && r && this._OnCreateBody(r, n)
        }
	}

	private _Load(e, t)
	{
		var i = this._GetRes(e, t);
        return i ? i : (RES.getResByUrl(e, this._CreateBodyByUrl, this, t),
        null)
	}

	private _GetRes(e, t) {
        // var i = RES.getAnalyzer(t);
        // return i.getRes(e)
        return RES.getRes(e)
    }

	private Unref()
	{
		this.m_Url = null;
	}

	private _CreateBodyByUrl(e, t)
	{
		 t && this.GetJsonUrl() != t && this.GetImgUrl() != t || this._OnCreateBody(this._GetRes(this.GetJsonUrl(), RES.ResourceItem.TYPE_JSON), this._GetRes(this.GetImgUrl(), RES.ResourceItem.TYPE_IMAGE))
	}

	private _OnCreateBody(e, t)
	{
		e && t && (this.visible = !0,
        this._mcFactory.mcDataSet = e,
        this._mcFactory.texture = t,
        this.movieClipData = this._mcFactory.generateMovieClipData(this._fileName),
        this._autoPlay && this.gotoAndPlay(1, this._playCount),
        this.m_State = !0,
        this.dispatchEventWith(egret.Event.CHANGE))
	}
	public mNotRemove:boolean;
	private _PlayComp()
	{
		var e = this.m_CompFunc;
        !this.mNotRemove && this.parent && this.parent.removeChild(this),
        e && e()
	}

	private DoDispose()
	{
		this.ClearCache()
	}

	private Ref()
	{

	}

	private ClearCache()
	{
		this.Unref(),
        this.visible = !1,
        this.stop(),
        this.m_State = !1,
        this.m_CompFunc = null
	}

	private GetImgUrl()
	{
		return (this.m_Url || "") + ".png";
	}

	private GetJsonUrl()
	{
		return (this.m_Url || "") + ".json";
	}

	private _SetUrl(e)
	{
		 this.m_Url = e
	}

	private GetLoadUrl()
	{
		return this.m_Url;
	}

}
window["MovieBaseObject"]=MovieBaseObject