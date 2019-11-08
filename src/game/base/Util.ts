class Util {
	public static GetClass(obj: any): any {
		if (!obj) {
			return null
		}
        let clsName = obj.__class__
		if (!clsName) {
			return null
		}
		return egret.getDefinitionByName(clsName)
	}
}
window["Util"]=Util