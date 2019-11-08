class DateUtils {
	/**
		 * 把MiniDateTime转化为距离1970-01-01的毫秒数
		 * @param mdt 从2010年开始算起的秒数
		 * @return 从1970年开始算起的毫秒数
		 */
	public static formatMiniDateTime(mdt) {
		return DateUtils.MINI_DATE_TIME_BASE + (mdt & 0x7FFFFFFF) * DateUtils.MS_PER_SECOND;
	};
	/**转成服务器要用的时间***/
	public static formatServerTime(time) {
		return (time - DateUtils.MINI_DATE_TIME_BASE) / DateUtils.MS_PER_SECOND;
	};

	public static GetFormatSecond(time: number, type: number = 1): string {
		return DateUtils.getFormatBySecond(time, type)
	}
	
    /**
     * 根据秒数格式化字符串
     * @param  {number} second			秒数
     * @param  {number=1} type			时间格式类型（参考DateUtils.TIME_FORMAT_1, DateUtils.TIME_FORMAT_2...)
     * @param  {showLength}	showLength	显示长度（一个时间单位为一个长度，且仅在type为DateUtils.TIME_FORMAT_5的情况下有效）
     * @returns string
     */
	public static getFormatBySecond(second, type: number = 1, showLength: number = 2) {
		var str = "";
		var ms = second * 1000;
		switch (type) {
			case this.TIME_FORMAT_1:
				str = this.format_1(ms);
				break;
			case this.TIME_FORMAT_2:
				str = this.format_2(ms);
				break;
			case this.TIME_FORMAT_3:
				str = this.format_3(ms);
				break;
			case this.TIME_FORMAT_4:
				str = this.format_4(ms);
				break;
			case this.TIME_FORMAT_5:
				str = this.format_5(ms, showLength);
				break;
			case this.TIME_FORMAT_6:
				str = this.format_6(ms);
				break;
			case this.TIME_FORMAT_7:
				str = this.format_7(ms);
				break;
			case this.TIME_FORMAT_8:
				str = this.format_8(ms);
				break;
			case this.TIME_FORMAT_9:
				str = this.format_9(ms);
				break;
			case this.TIME_FORMAT_11:
				str = this.format_11(ms);
				break;	
			// case this.TIME_FORMAT_10:
			// 	str = this.format_10(ms);
			// 	break;
		}
		return str;
	};
    /**
     * 格式1  00:00:00
     * @param  {number} sec 毫秒数
     * @returns string
     */
	public static format_1(ms) {
		var n = 0;
		var result = "##:##:##";
		n = Math.floor(ms / DateUtils.MS_PER_HOUR);
		result = result.replace("##", DateUtils.formatTimeNum(n));
		if (n)
			ms -= n * DateUtils.MS_PER_HOUR;
		n = Math.floor(ms / DateUtils.MS_PER_MINUTE);
		result = result.replace("##", DateUtils.formatTimeNum(n));
		if (n)
			ms -= n * DateUtils.MS_PER_MINUTE;
		n = Math.floor(ms / 1000);
		result = result.replace("##", DateUtils.formatTimeNum(n));
		return result;
	};
    /**
     * 格式2  yyyy-mm-dd h:m:s
     * @param  {number} ms		毫秒数
     * @returns string			返回自1970年1月1号0点开始的对应的时间点
     */
	public static format_2(ms) {
		ms -= this.TIME_ZONE_OFFSET; //返回的是本地时间，中国位于东八区，要处理时区偏移
		var date = new Date(ms);
		var year = date.getFullYear();
		var month = date.getMonth() + 1; //返回的月份从0-11；
		var day = date.getDate();
		var hours = date.getHours();
		var minute = date.getMinutes();
		var second = date.getSeconds();
		return year + "-" + month + "-" + day + " " + hours + ":" + minute + ":" + second;
	};
    /**
     * 格式3  00:00
     * @param  {number} ms		毫秒数
     * @returns string			分:秒
     */
	public static format_3(ms) {
		var str = this.format_1(ms);
		var strArr = str.split(":");
		return strArr[1] + ":" + strArr[2];
	};
    /**
     * 格式4  xx天前，xx小时前，xx分钟前
     * @param  {number} ms		毫秒
     * @returns string
     */
	public static format_4(ms) {
		if (ms < this.MS_PER_HOUR) {
			return Math.floor(ms / this.MS_PER_MINUTE) + GlobalConfig.jifengTiaoyueLg.st101515;//"分钟前";
		}
		else if (ms < this.MS_PER_DAY) {
			return Math.floor(ms / this.MS_PER_HOUR) + GlobalConfig.jifengTiaoyueLg.st101516;//"小时前";
		}
		else {
			return Math.floor(ms / this.MS_PER_DAY) + GlobalConfig.jifengTiaoyueLg.st101517;//"天前";
		}
	};
    /**
     * 格式5 X天X小时X分X秒
     * @param  {number} ms				毫秒
     * @param  {number=2} showLength	显示长度（一个时间单位为一个长度）
     * @returns string
     */
	// public static format_5(ms, showLength = 2): string {
	// 	var result = "";
	// 	if (showLength >= 4) {
	// 		let d = Math.floor(ms / this.MS_PER_DAY);
	// 			ms -= d * this.MS_PER_DAY;
	// 			result += this.formatTimeNum(d) + "天"
	// 	}
	// 	if (showLength >= 3) {
	// 		let h = Math.floor(ms / this.MS_PER_HOUR);
	// 			ms -= h * this.MS_PER_HOUR;
	// 			result += this.formatTimeNum(h) + "小时"
	// 	}
	// 	if (showLength >= 2) {
	// 		let m = Math.floor(ms / this.MS_PER_MINUTE);
	// 			ms -= m * this.MS_PER_MINUTE;
	// 			result += this.formatTimeNum(m) + "分"
	// 	}
	// 	let s = Math.floor(ms / 1000);
	// 	result += this.formatTimeNum(s) + "秒"

	// 	return result;
	// };
	    /**
     * 格式5 X天X小时X分X秒
     * @param  {number} ms				毫秒
     * @param  {number=2} showLength	显示长度（一个时间单位为一个长度）
     * @returns string
     */
	public static format_5(ms, showLength = 2): string {
		var result = "";
		if (showLength >= 4) {
			let d = Math.floor(ms / this.MS_PER_DAY);
			if (d > 0) {
				ms -= d * this.MS_PER_DAY;
				result += (result.length > 0 ? this.formatTimeNum(d) : d) + GlobalConfig.jifengTiaoyueLg.st100006;//"天"
			}
		}
		if (showLength >= 3) {
			let h = Math.floor(ms / this.MS_PER_HOUR);
			if (h > 0) {
				ms -= h * this.MS_PER_HOUR;
				result += (result.length > 0 ? this.formatTimeNum(h) : h) + GlobalConfig.jifengTiaoyueLg.st101518;//"小时"
			}
		}
		if (showLength >= 2) {
			let m = Math.floor(ms / this.MS_PER_MINUTE);
			if (m > 0) {
				ms -= m * this.MS_PER_MINUTE;
				result += (result.length > 0 ? this.formatTimeNum(m) : m) + GlobalConfig.jifengTiaoyueLg.st101519;//"分"
			}
		}
		let s = Math.floor(ms / 1000);
		result += this.formatTimeNum(s) + GlobalConfig.jifengTiaoyueLg.st100141;//"秒"

		return result;
	};

	public static format_12(ms, showLength = 2): string {
		var result = "";
		if (showLength >= 4) {
			let d = Math.floor(ms / this.MS_PER_DAY);
			if (d > 0) {
				ms -= d * this.MS_PER_DAY;
				result += (result.length > 0 ? this.formatTimeNum(d) : d) + GlobalConfig.jifengTiaoyueLg.st100006;//"天"
			}
		}
		if (showLength >= 3) {
			let h = Math.floor(ms / this.MS_PER_HOUR);
			if (h > 0) {
				ms -= h * this.MS_PER_HOUR;
				result += (result.length > 0 ? this.formatTimeNum(h) : h) + GlobalConfig.jifengTiaoyueLg.st101518;//"小时"
			}
		}
		let m = Math.floor(ms / this.MS_PER_MINUTE);
		if (m > 0) {
			ms -= m * this.MS_PER_MINUTE;
			result += (result.length > 0 ? this.formatTimeNum(m) : m) + GlobalConfig.jifengTiaoyueLg.st101519;//"分"
		}
		return result;
	};

	// public static format_5(ms, showLength = 2): string {
	// 	var result = "";
	// 	var unitStr = ["天", "小时", "分", "秒"];
	// 	var arr = [];
	// 	var d = Math.floor(ms / this.MS_PER_DAY);
	// 	arr.push(d);
	// 	ms -= d * this.MS_PER_DAY;
	// 	var h = Math.floor(ms / this.MS_PER_HOUR);
	// 	arr.push(h);
	// 	ms -= h * this.MS_PER_HOUR;
	// 	var m = Math.floor(ms / this.MS_PER_MINUTE);
	// 	arr.push(m);
	// 	ms -= m * this.MS_PER_MINUTE;
	// 	var s = Math.floor(ms / 1000);
	// 	arr.push(s);
	// 	for (var k in arr) {
	// 		if (arr[k] > 0) {
	// 			result += this.formatTimeNum(arr[k]) + unitStr[k];
	// 			showLength--;
	// 			if (showLength <= 0)
	// 				break;
	// 		}
	// 	}
	// 	return result;
	// };
    /**
     * 格式6  h:m:s
     * @param  {number} ms		毫秒
     * @returns string			返回自1970年1月1号0点开始的对应的时间点（不包含年月日）
     */
	public static format_6(ms) {
		ms -= this.TIME_ZONE_OFFSET; //返回的是本地时间，中国位于东八区，要处理时区偏移
		var date = new Date(ms);
		var hours = date.getHours();
		var minute = date.getMinutes();
		var second = date.getSeconds();
		return this.formatTimeNum(hours) + ":" + this.formatTimeNum(minute) + ":" + this.formatTimeNum(second);
	};
    /**
     * 格式7  X天/X小时/<1小时
     * @param  {number} ms		毫秒
     * @returns string
     */
	public static format_7(ms) {
		if (ms < this.MS_PER_HOUR) {
			return GlobalConfig.jifengTiaoyueLg.st101520;//"1小时";
		}
		else if (ms < this.MS_PER_DAY) {
			return Math.floor(ms / this.MS_PER_HOUR) + GlobalConfig.jifengTiaoyueLg.st101518;//"小时";
		}
		else {
			return Math.floor(ms / this.MS_PER_DAY) + GlobalConfig.jifengTiaoyueLg.st100006;//"天";
		}
	};
    /**
     * 格式8  yyyy-mm-dd h:m
     * @param  {number} ms		毫秒
     * @returns string			返回自1970年1月1号0点开始的对应的时间点（不包含秒）
     */
	public static format_8(ms) {
		ms -= this.TIME_ZONE_OFFSET; //返回的是本地时间，中国位于东八区，要处理时区偏移
		var date = new Date(ms);
		var year = date.getFullYear();
		var month = date.getMonth() + 1; //返回的月份从0-11；
		var day = date.getDate();
		var hours = date.getHours();
		var minute = date.getMinutes();
		return year + "-" + month + "-" + day + " " + hours + ":" + minute;
	};
    /**
     * 格式9  x小时x分钟x秒
     * @param  {number} ms		毫秒
     * @returns string
     */
	public static format_9(ms) {
		var h = Math.floor(ms / this.MS_PER_HOUR);
		ms -= h * this.MS_PER_HOUR;
		var m = Math.floor(ms / this.MS_PER_MINUTE);
		ms -= m * this.MS_PER_MINUTE;
		var s = Math.floor(ms / 1000);
		return h + GlobalConfig.jifengTiaoyueLg.st101518 + m + GlobalConfig.jifengTiaoyueLg.st101074 + s + GlobalConfig.jifengTiaoyueLg.st100141;
	};

	public static isOpenDayPreWeek():boolean
	{
		var openDay:number = GameServer.serverOpenDay;//开服天数
		var curDate = new Date();//GameServer.serverTime
		var today:number = curDate.getDay();//今天周几

		//判断服务器是上周开的服
		var isToWeek:boolean = false;
		switch(today)
		{
			case 1://星期一
				if(openDay > 1)
					isToWeek = true;
				break;
			case 2://星期二
				if(openDay > 2)
					isToWeek = true;
				break;
			case 3://星期三
				if(openDay > 3)
					isToWeek = true;
				break;
			case 4://星期四
				if(openDay > 4)
					isToWeek = true;	
				break;
			case 5://星期五
				if(openDay > 5)
					isToWeek = true;
				break;
			case 6://星期六
				if(openDay > 6)
					isToWeek = true;
				break;
			case 7://星期日
				if(openDay > 7)
					isToWeek = true;		
				break;
		}

		return isToWeek;
	}


	//格式 h:m:s
	public static format_11(ms) {
			var h = Math.floor(ms / this.MS_PER_HOUR);
			ms -= h * this.MS_PER_HOUR;
			var m = Math.floor(ms / this.MS_PER_MINUTE);
			ms -= m * this.MS_PER_MINUTE;
			var s = Math.floor(ms / 1000);
			return h + ":" + m + ":" + s;
		};
    /**
     * 格式化时间数为两位数
     * @param  {number} t 时间数
     * @returns String
     */
	public static formatTimeNum(t) {
		return t >= 10 ? t.toString() : "0" + t;
	};
	/**时间格式1 00:00:00 */
	public static TIME_FORMAT_1 = 1;
	/**时间格式2 yyyy-mm-dd h:m:s */
	public static TIME_FORMAT_2 = 2;
	/**时间格式3 00:00 */
	public static TIME_FORMAT_3 = 3;
	/**时间格式4 xx天前/xx小时前/xx分钟前 */
	public static TIME_FORMAT_4 = 4;
	/**时间格式5 x天x小时x分x秒 */
	public static TIME_FORMAT_5 = 5;
	/**时间格式6 h:m:s */
	public static TIME_FORMAT_6 = 6;
	/**时间格式7 xx天/xx小时/<1小时 */
	public static TIME_FORMAT_7 = 7;
	/**时间格式8 yyyy-mm-dd h:m */
	public static TIME_FORMAT_8 = 8;
	/**时间格式9 x小时x分钟x秒 */
	public static TIME_FORMAT_9 = 9;
	/**时间格式11 x小时x分钟x秒 */
	public static TIME_FORMAT_11 = 11;
	// public static TIME_FORMAT_10 = 10;
	/**一周的天数 */
	public static DAYS_OF_WEEK = 7;
	/**一天的小时数 */
	public static HOURS_PER_DAY = 24;
	/**一小时的秒数 */
	public static SECONDS_PER_HOUR = 3600;
	/**一秒的毫秒数 */
	public static MS_PER_SECOND = 1000;
	/**一分钟的毫秒数 */
	public static MS_PER_MINUTE = 60 * 1000;
	/**一小时的毫秒数 */
	public static MS_PER_HOUR = 60 * 60 * 1000;
	/**一天的毫秒数 */
	public static MS_PER_DAY = 24 * 60 * 60 * 1000;
	/**一月的毫秒数 */
	public static MS_PER_MONTH = 30 * DateUtils.MS_PER_DAY;
	/**一年的毫秒数 */
	public static MS_PER_YEAR = 12 * DateUtils.MS_PER_MONTH;
	/** 本游戏中使用的MiniDateTime时间的起始日期相对于flash时间(1970-01-01)的时差（毫秒） */
	public static MINI_DATE_TIME_BASE = Date.UTC(2010, 0) + new Date().getTimezoneOffset() * DateUtils.MS_PER_MINUTE;
    /**
     * 时区偏移（毫秒数）<BR>
     * 目前中国采用东八区，即比世界协调时间（UTC）/格林尼治时间（GMT）快8小时的时区 */
	// public static TIME_ZONE_OFFSET = 8 * DateUtils.MS_PER_HOUR;
	public static TIME_ZONE_OFFSET = 0
}

window["DateUtils"]=DateUtils