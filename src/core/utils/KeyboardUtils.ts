var __ref_field__: any = DeviceUtils

class KeyboardUtils extends BaseClass {

	key_ups: Array<any>;
	key_downs: Array<any>;

	public static ins(): KeyboardUtils {
		return super.ins()
	}
	
	public constructor() {
		super();

		this.key_ups = new Array();
		this.key_downs = new Array();
		if (DeviceUtils.IsHtml5) {
			var self_1 = this;
			document.addEventListener("keyup", function (e) {
				for (var i = 0, len = self_1.key_ups.length; i < len; i++) {
					var func = self_1.key_ups[i][0];
					var target = self_1.key_ups[i][1];
					if (target) {
						func.call(target, e["keyCode"]);
					}
					else {
						func(e["keyCode"]);
					}
				}
			});
			document.addEventListener("keydown", function (e) {
				for (var i = 0, len = self_1.key_downs.length; i < len; i++) {
					var func = self_1.key_downs[i][0];
					var target = self_1.key_downs[i][1];
					if (target) {
						func.call(target, e["keyCode"]);
					}
					else {
						func(e["keyCode"]);
					}
				}
			});
		}
	}


    /**
     * 添加KeyUp事件
     * @param callback 回调函数
     * @param target 回调函数对应的对象
     */
	public addKeyUp(callback, target) {
		this.key_ups.push([callback, target]);
	};
    /**
     * 添加KeyDown事件
     * @param callback 回调函数
     * @param target 回调函数对应的对象
     */
	public addKeyDown(callback, target) {
		this.key_downs.push([callback, target]);
	};
    /**
     * 移除KeyUp事件
     * @param callback 回调函数
     * @param target 回调函数对应的对象
     */
	public removeKeyUp(callback, target) {
		for (var i = 0; i < this.key_ups.length; i++) {
			if (this.key_ups[i][0] == callback && this.key_ups[i][1] == target) {
				this.key_ups.splice(i, 1);
				i--;
			}
		}
	};
    /**
     * 移除KeyDown事件
     * @param callback 回调函数
     * @param target 回调函数对应的对象
     */
	public removeKeyDown(callback, target) {
		for (var i = 0; i < this.key_downs.length; i++) {
			if (this.key_downs[i][0] == callback && this.key_downs[i][1] == target) {
				this.key_downs.splice(i, 1);
				i--;
			}
		}
	};
}
window["KeyboardUtils"]=KeyboardUtils