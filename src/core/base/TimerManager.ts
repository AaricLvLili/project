class TimerManager extends BaseClass {

	_haveremove: boolean;
	_handlers: Array<any>;
	_currTime: number;
	_currFrame: number;
	_timeScale: number;
	_chackTime: number = 0;
	public constructor() {
		super();

		this._haveremove = false;
		this._handlers = new Array();
		this._currTime = egret.getTimer();
		this._currFrame = 0;
		this._timeScale = 1;
		// egret.Ticker.getInstance().register(this.onEnterFrame, this);
		egret.startTick(this.onEnterFrame, this);
	}

	public static ins(): TimerManager {
		return super.ins()
	}

	public getFrameId() {
		return this._currFrame;
	};
    /**
     * 设置时间参数
     * @param timeScale
     */
	public setTimeScale(timeScale) {
		this._timeScale = timeScale;
	};
    /**
     * 每帧执行函数
     * @param frameTime
     */
	public onEnterFrame(timeStamp) {
		
		this._currFrame++;
		if (DeviceUtils.IsPC) {
			let getTiem: number = egret.getTimer();
			if (this._chackTime > getTiem) {
				WarnWin.show("检测到加速外挂", ()=> { window.location.reload(); }, this, ()=> { window.location.reload(); }, this, "sure2");
			}
			this._chackTime = getTiem;
		}
		// this._currTime = egret.getTimer();
		this._currTime = timeStamp;
		if(this._currFrame % 2 == 0 && DeviceUtils.IsMobile) return ;
		DebugUtils.start("TimerManager:");
		var bt = egret.getTimer();
		for (var _i = 0, _a = this._handlers; _i < _a.length; _i++) {
			var handler = _a[_i];
			if (handler.remove) {
				this._haveremove = true;
				continue;
			}

			var t = handler.userFrame ? this._currFrame : this._currTime;
			if (t >= handler.exeTime) {
				DebugUtils.start(handler.method.toString());
				handler.method.call(handler.methodObj, (this._currTime - handler.dealTime) * this._timeScale);
				DebugUtils.stop(handler.method.toString());
				handler.dealTime = this._currTime;
				handler.exeTime += handler.delay;
				if (!handler.repeat) {
					if (handler.repeatCount > 1) {
						handler.repeatCount--;
					}
					else {
						if (handler.complateMethod) {
							handler.complateMethod.apply(handler.complateMethodObj);
						}
						handler.remove = true;
						this._haveremove = true;
					}

				}
			}

			var a = egret.getTimer() - bt 

			if(a> 60)
			{
				// egret.log("函数执行时间 = "+a+"  "+handler.method.toString());
				break;
			}
		}
		if (this._haveremove) {
			for (var i = this._handlers.length - 1; i >= 0; --i) {
				var handler = this._handlers[i];
				if (handler.remove) {
					handler.clear();
					this._handlers.splice(i, 1);
					ObjectPool.ins().push(handler);
				}
			}
		}
		this._haveremove = false;
		DebugUtils.stop("TimerManager:");
		return false;
	};
	public create(useFrame, delay, repeatCount, method, methodObj, complateMethod, complateMethodObj) {
		//参数监测
		if (delay < 0 || repeatCount < 0 || method == null) {
			return;
		}
		//先删除相同函数的计时
		this.remove(method, methodObj);
		//创建
		var handler = ObjectPool.ins().pop("TimerHandler");
		handler.userFrame = useFrame;
		handler.repeat = repeatCount == 0;
		handler.repeatCount = repeatCount;
		handler.delay = delay;
		handler.method = method;
		handler.methodObj = methodObj;
		handler.complateMethod = complateMethod;
		handler.complateMethodObj = complateMethodObj;
		handler.exeTime = delay + (useFrame ? this._currFrame : this._currTime);
		handler.dealTime = this._currTime;
		handler.remove = false;
		this._handlers.push(handler);
	};
    /**
     *
     * 定时执行
     * @param delay 执行间隔:毫秒
     * @param repeatCount 执行次数, 0为无限次
     * @param method 执行函数
     * @param methodObj 执行函数所属对象
     * @param complateMethod 完成执行函数
     * @param complateMethodObj 完成执行函数所属对象
     *
     */
	public doTimer(delay, repeatCount, method, methodObj, complateMethod = null, complateMethodObj = null) {
		this.create(false, delay, repeatCount, method, methodObj, complateMethod, complateMethodObj);
	};
    /**
     *
     * 定时执行
     * @param delay 执行间隔:帧频
     * @param repeatCount 执行次数, 0为无限次
     * @param method 执行函数
     * @param methodObj 执行函数所属对象
     * @param complateMethod 完成执行函数
     * @param complateMethodObj 完成执行函数所属对象
     *
     */
	public doFrame(delay, repeatCount, method, methodObj, complateMethod = null, complateMethodObj = null) {
		this.create(true, delay, repeatCount, method, methodObj, complateMethod, complateMethodObj);
	};
	// 下一帧执行，且只执行一次
	public doNext(mothod, methodObj) {
		this.create(true, 1, 1, mothod, methodObj, null, null);
	};
    /**
     * 清理
     * @param method 要移除的函数
     * @param methodObj 要移除的函数对应的对象
     */
	public remove(method, methodObj) {
		for (var _i = 0, _a = this._handlers; _i < _a.length; _i++) {
			var handler = _a[_i];
			if (!handler.remove && handler.method == method && handler.methodObj == methodObj) {
				handler.remove = true;
				this._haveremove = true;
			}
		}
	};
    /**
     * 清理
     * @param methodObj 要移除的函数对应的对象
     */
	public removeAll(methodObj) {
		for (var _i = 0, _a = this._handlers; _i < _a.length; _i++) {
			var handler = _a[_i];
			if (handler.methodObj == methodObj) {
				handler.remove = true;
				this._haveremove = true;
			}
		}
	};
    /**
     * 检测是否已经存在
     * @param method
     * @param methodObj
     *
     */
	public isExists(method, methodObj) {
		for (var _i = 0, _a = this._handlers; _i < _a.length; _i++) {
			var handler = _a[_i];
			if (!handler.remove && handler.method == method && handler.methodObj == methodObj) {
				return true;
			}
		}
		return false;
	};
}

class TimerHandler {

	/**执行间隔*/
	delay = 0;
	/**重复执行次数*/
	repeatCount = 0;
	/**执行时间*/
	exeTime = 0;
	/**上次的执行时间*/
	dealTime = 0;
	remove = false;

	method;
	methodObj;
	complateMethod;
	complateMethodObj;

	clear() {
		this.method = null;
		this.methodObj = null;
		this.complateMethod = null;
		this.complateMethodObj = null;
		this.remove = false;
	}
}
window["TimerManager"]=TimerManager
window["TimerHandler"]=TimerHandler