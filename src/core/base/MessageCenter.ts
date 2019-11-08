class MessageCenter extends BaseClass {

	flag: number = 0;
	type: number = 0;
	private dict: { [key: string]: any[] } = {};
	eVec: MessageVo[] = [];
	lastRunTime: number = 0;

	private m_TempDict: { [key: string]: boolean } = {}

	/**
	 * 构造函数
	 * @param type 0:使用分帧处理 1:及时执行
	 */
	public constructor(type) {
		super();
		this.type = type;
		if (this.type == 0) {
			TimerManager.ins().doFrame(1, 0, this.run, this);
			// TimerManager.ins().doTimer(300,0,this.run,this);
		}
	}

	public static ins(): MessageCenter {
		return super.ins(0)
	}

    /**
     * 清空处理
     */
	public clear() {
		this.dict = {};
		this.eVec.splice(0);
	};
    /**
     * 添加消息监听
     * @param type 消息唯一标识
     * @param listener 侦听函数
     * @param listenerObj 侦听函数所属对象
     *
     */
	public addListener(type: string, listener: Function, listenerObj: any) {
		var arr = this.dict[type];
		if (!arr) {
			this.dict[type] = arr = [];
		} else if (this.flag != 0) {
			this.dict[type] = arr = arr.concat();
		}
		//检测是否已经存在
		for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
			var item = arr_1[_i];
			if (item[0] == listener && item[1] == listenerObj) {
				return;
			}
		}
		arr.push([listener, listenerObj]);
	};
    /**
     * 移除消息监听
     * @param type 消息唯一标识
     * @param listener 侦听函数
     * @param listenerObj 侦听函数所属对象
     */
	public removeListener(type, listener, listenerObj) {
		var arr = this.dict[type];
		if (!arr) {
			return;
		}
		if (this.flag != 0) {
			this.dict[type] = arr = arr.concat();
		}
		var len = arr.length;
		for (var i = 0; i < len; i++) {
			if (arr[i][0] == listener && arr[i][1] == listenerObj) {
				arr.splice(i, 1);
				break;
			}
		}
		if (arr.length == 0) {
			this.dict[type] = null;
			delete this.dict[type];
		}
	};
    /**
     * 移除某一对象的所有监听
     * @param listenerObj 侦听函数所属对象
     */
	public removeAll(listenerObj) {
		var keys = Object.keys(this.dict);
		for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
			var type = keys_1[_i];
			var arr = this.dict[type];
			if (this.flag != 0) {
				this.dict[type] = arr = arr.concat();
			}
			for (var j = 0; j < arr.length; j++) {
				if (arr[j][1] == listenerObj) {
					arr.splice(j, 1);
					j--;
				}
			}
			if (arr.length == 0) {
				this.dict[type] = null;
				delete this.dict[type];
			}
		}
	};
    /**
     * 触发消息
     * @param type 消息唯一标识
     * @param param 消息参数
     *
     */
	public dispatch(type: string, ...param: any[]): void {
		if (param == null || param.length == 0) {
			if (this.m_TempDict[type]) {
				return
			}
			this.m_TempDict[type] = true
		}
		var vo: MessageVo = ObjectPool.ins().pop("MessageVo");
		vo.type = type;
		vo.param = param;
		if (this.type == 0) {
			this.eVec.push(vo);
		} else if (this.type == 1) {
			this.dealMsg(vo);
		} else {
			Logger.trace("MessageCenter未实现的类型");
		}
	};

	public dispatchImmediate(type: string, ...param: any[]): void {
		var vo: MessageVo = ObjectPool.ins().pop("MessageVo");
		vo.type = type;
		vo.param = param;
		this.dealMsg(vo);
	};

    /**
     * 运行
     *
     */
	public run() {
		var currTime = egret.getTimer();
		var inSleep = currTime - this.lastRunTime > 100;
		this.lastRunTime = currTime;
		if (inSleep) {
			while (this.eVec.length > 0) {
				this.dealMsg(this.eVec.shift());
			}
		}
		else {
			while (this.eVec.length > 0) {
				this.dealMsg(this.eVec.shift());
				if ((egret.getTimer() - currTime) > 5) {
					break;
				}
			}
		}
	};
    /**
     * 处理一条消息
     * @param msgVo
     */
	public dealMsg(msgVo) {
		if (this.m_TempDict[msgVo.type]) {
			delete this.m_TempDict[msgVo.type]
		}
		var listeners = this.dict[msgVo.type];
		if (!listeners) {
			return;
		}
		var len = listeners.length;
		if (len == 0)
			return;
		this.flag++;
		for (var _i = 0, listeners_1 = listeners; _i < listeners_1.length; _i++) {
			var listener = listeners_1[_i];
			listener[0].apply(listener[1], msgVo.param);
		}
		this.flag--;
		msgVo.dispose();
		ObjectPool.ins().push(msgVo);
	};
	public static setFunction(ins, obj, name, ex) {
		if (name.indexOf(ex) == 0 && typeof (obj[name]) == "function") {
			var msgname_1 = egret.getQualifiedClassName(obj) + MessageCenter.splite + name;
			var func_1 = obj[name];
			var newfunc = function () {
				var args = [];
				for (var _i = 0; _i < arguments.length; _i++) {
					args[_i - 0] = arguments[_i];
				}
				var argsLen = args.length;
				var data;
				if (argsLen == 0) {
					data = func_1();
				}
				else if (argsLen == 1) {
					if (ins)
						data = func_1.call(this, args[0]);
					else
						data = func_1(args[0]);
				}
				else if (argsLen == 2) {
					if (ins)
						data = func_1.call(this, args[0], args[1]);
					else
						data = func_1(args[0], args[1]);
				}
				else if (argsLen == 3) {
					if (ins)
						data = func_1.call(this, args[0], args[1], args[2]);
					else
						data = func_1(args[0], args[1], args[2]);
				}
				else if (argsLen == 4) {
					if (ins)
						data = func_1.call(this, args[0], args[1], args[2], args[3]);
					else
						data = func_1(args[0], args[1], args[2], args[3]);
				}
				else if (argsLen == 5) {
					if (ins)
						data = func_1.call(this, args[0], args[1], args[2], args[3], args[4]);
					else
						data = func_1(args[0], args[1], args[2], args[3], args[4]);
				}
				else if (argsLen == 6) {
					if (ins)
						data = func_1.call(this, args[0], args[1], args[2], args[3], args[4], args[5]);
					else
						data = func_1(args[0], args[1], args[2], args[3], args[4], args[5]);
				}
				if (typeof data == "boolean" && !data) {
					return data;
				}
				MessageCenter.ins().dispatch(msgname_1, data);
				return data;
			};
			newfunc["funcallname"] = msgname_1;
			obj[name] = newfunc;
			return true;
		}
		return false;
	};
    /**
     * 编译
     * */
	public static compile(thisobj, ex?: string) {
		if (ex === void 0) { ex = "post"; }
		for (var name_1 in thisobj) {
			MessageCenter.setFunction(false, thisobj, name_1, ex);
		}
		var p = thisobj.prototype;
		var keys = Object.keys(p);
		for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
			var name_2 = keys_2[_i];
			MessageCenter.setFunction(true, p, name_2, ex);
		}
	};
	public static addListener(func, listener, thisObj) {
		if (func.funcallname) {
			MessageCenter.ins().addListener(func.funcallname, listener, thisObj);
			return true;
		}
		else {
			console.log("MessageCenter.addListener error:" + egret.getQualifiedClassName(thisObj));
			return false;
		}
	};
	public static splite = ".";
}

class MessageVo {
	public constructor() {
	}
	type: string = null;
	param = null;
	dispose() {
		this.type = null;
		this.param = null;
	}
}
window["MessageCenter"]=MessageCenter
window["MessageVo"]=MessageVo