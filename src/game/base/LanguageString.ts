/**多语言国际化*/
class LanguageString {
	public static jifengTiaoyueCh(data: any, value: any[]): string {
		if (data != null) {
			let splitVal = data.split("}");
			let dataVal = "";
			for (let i = 0; i < splitVal.length - 1; i++) {
				splitVal[i] = splitVal[i].substring(0, splitVal[i].indexOf("{")) + [value[i]];
				dataVal += splitVal[i];
			}
			let lastVal = dataVal + data.split("}")[data.split("}").length - 1];
			return lastVal;
		}
	}
}
window["LanguageString"]=LanguageString