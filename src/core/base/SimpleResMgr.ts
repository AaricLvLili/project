class SimpleResMgr {
	public static Unload(obj: any): boolean {
		if (!obj) {
			return false
		}
		if (egret.is(obj, "IResObject")) {
			return (obj as IResObject).OnResUnload()
		}
		return false
	}

	public static DestroyRes(url): boolean {
		return RES.destroyRes(url)
	}
}
window["SimpleResMgr"]=SimpleResMgr