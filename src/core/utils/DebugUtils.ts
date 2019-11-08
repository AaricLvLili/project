class DebugUtils {
	public constructor() {
	}

	/**
     * 设置调试是否开启
     * @param flag
     *
     */
    public static isOpen (flag) {
        this._isOpen = flag;
    };

    public static get isDebug(): boolean {

            return true;//false;//this._isOpen;

	}

    /**
     * 开始
     * @param key 标识
     * @param minTime 最小时间
     *
     */
    public static start (key) {
        if (!this._isOpen) {
            return;
        }
        this._startTimes[key] = egret.getTimer();
    };
    /**
     * 停止
     *
     */
    public static stop (key) {
        if (!this._isOpen) {
            return 0;
        }
        if (!this._startTimes[key]) {
            return 0;
        }
        var cha = egret.getTimer() - this._startTimes[key];
        if (cha > this._threshold) {
            Logger.trace(key + ": " + cha);
        }
        return cha;
    };
    /**
     * 设置时间间隔阈值
     * @param value
     */
    public static setThreshold (value) {
        this._threshold = value;
    };
    public static _startTimes = {};
    public static _threshold = 3;

	private static _isOpen: boolean;
}
window["DebugUtils"]=DebugUtils