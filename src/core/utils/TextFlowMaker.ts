class TextFlowMaker {
    private static EMPTY_TABLE = []
	/**
     * "你好|S:18&C:0xffff00&T:带颜色字号|S:50&T:大号字体|C:0x0000ff&T:带色字体";
     * @param sourceText
     * @returns {Array}
     */
    public static generateTextFlow  (sourceText: string,type:number = 0): egret.ITextElement[] {
        if (!sourceText) {
            return this.EMPTY_TABLE
        }
        var textArr = sourceText.split("|");
        var str = "";
        for (var i = 0, len = textArr.length; i < len; i++) {
            let text = textArr[i]
            if (!text || text.length == 0) {
                continue
            }
            str += this.getSingleTextFlow1(text,type);
        }
        return new egret.HtmlTextParser().parser(str);
    };
    public static generateTextFlow1  (sourceText) {
        var textArr = sourceText.split("|");
        var result = [];
        for (var i = 0, len = textArr.length; i < len; i++) {
            result.push(this.getSingleTextFlow(textArr[i]));
        }
        return result;
    };
    public static getSingleTextFlow1  (text,type:number = 0) {
        var str = "<font";
        var textArr = this.Match(text)
        var tempArr;
        var t;
        for (var i = 0, len = textArr.length; i < len; i++) {
            let type = textArr[i].type
            let value = textArr[i].value
            if (type == this.PROP_TEXT) {
                t = value;
            }
            else if (type == this.STYLE_SIZE) {
                str += " size=\"" + parseInt(value) + "\"";
            }
            else if (type == this.STYLE_COLOR) {
                str += " color=\"" + parseInt(value) + "\"";
            }
            else {
                t = value
            }
        }
        if(type == 1)
        {
            if(t.indexOf("/")!=-1)
            {
                 str += " color='#535557'>" + t + "</font>";
            }else{
                  str += ">" + t + "</font>";
            }
        }else{
            str += ">" + t + "</font>";
        } 
        return str;
    };
    public static getSingleTextFlow  (text) {
        let textArr = this.Match(text)
        var textFlow: any = { "style": {} };
        for (var i = 0, len = textArr.length; i < len; i++) {
            let type = textArr[i].type
            let value = textArr[i].value
            if (type == this.PROP_TEXT) {
                textFlow.text = value
            } else if (type == this.STYLE_SIZE) {
                textFlow.style.size = parseInt(value);
            } else if (type== this.STYLE_COLOR) {
                textFlow.style.textColor = parseInt(value);
            } else {
                textFlow.text = value
            }
        }
        return textFlow;
    };


    static _REG = new RegExp("&?[SCTU]:");

    static LIST = []

    private static Match(str: string) {
        if (str == null) {
            return
        }
        let preType = null
        let preStr = ""
        this.LIST.length = 0
        for (let i = 0; i < 99; ++i) {
            let data = str.match(this._REG)
            if (data == null || data.index == -1) {
                this.LIST.push({
                    type: preType,
                    value: str
                })
                break
            }
            if (preType != null) {
                this.LIST.push({
                    type: preType,
                    value: str.substr(0, data.index)
                })
            }
            preType = data[0].replace("&", "").replace(":", "")
            str = str.substr(data.index+ data[0].length)
        }
        return this.LIST

// console.log(reg.exec(s))
// console.log(reg.exec(s))
// console.log(reg.exec(s))
// console.log(s.match(reg))
    }


    public static getCStr(e) {
		return this.numberList[e] ? this.numberList[e] : ""
	}
    public static STYLE_COLOR = "C";
    public static STYLE_SIZE = "S";
    public static PROP_TEXT = "T";
    public static UNDERLINE_TEXT = "U"
    public static numberList = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "十三", "十四"]

    private static _htmlTextParser: egret.HtmlTextParser;

    public static getTextFlowByHtml(htmlText: string): egret.ITextElement[] {
            if (htmlText == null) {
                return null;
            }
            if (TextFlowMaker._htmlTextParser == null) {
                TextFlowMaker._htmlTextParser = new egret.HtmlTextParser();
            }
            return TextFlowMaker._htmlTextParser.parse(htmlText);
        }

}
window["TextFlowMaker"]=TextFlowMaker