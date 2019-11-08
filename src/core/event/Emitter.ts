/**  
 * 观察者  
 */  
class Observer {  
    /** 回调函数 */  
    private callback: Function = null;  
    /** 上下文 */  
    private context: any = null;  

	public remove: boolean;
  
    constructor(callback: Function, context: any) {  
        this.callback = callback;  
        this.context = context;  
    }  
  
    /**  
     * 发送通知  
     * @param args 不定参数  
     */  
    notify(...args: any[]): void {  
        this.callback.apply(this.context, args);  
    }  
  
    /**  
     * 上下文比较  
     * @param context 上下文  
     */  
    compar(context: any, func: Function): boolean {  
        return context == this.context && func == this.callback;  
    }  
}

class Emitter {

	/** 监听数组 */  
    private static listeners = {};  

	private static m_RemoveList: number[] = []

	private static m_IsFire: string = null 
  
    /**   
     * 注册事件  
     * @param name 事件名称  
     * @param callback 回调函数  
     * @param context 上下文  
     */  
    public static register(name: string, callback: Function, context: any) {  
        let observers: Observer[] = Emitter.listeners[name];  
        if (!observers) {  
			observers = []
            Emitter.listeners[name] = observers;  
        }  
        observers.push(new Observer(callback, context));  
    }  
  
    // 标记移除
	private static _RemoveByFlag(observers: Observer[], i: number) {
		let observer = observers[i]
		observer.remove = true
		Emitter.m_RemoveList.push(i)					
	}

	// 从列表移除
	private static _RemoveByList(observers: Observer[], i: number) {
		observers.splice(i, 1);  
	}

    /**  
     * 移除事件  
     * @param name 事件名称  
     * @param callback 回调函数  
     * @param context 上下文  
     */  
    public static remove(name: string, callback: Function, context: any) {  
        let observers: Observer[] = Emitter.listeners[name];  
        if (!observers) {
			return;  
		}
		let length = observers.length
		let removeFunc: Function = Emitter.m_IsFire == name ? Emitter._RemoveByFlag : Emitter._RemoveByList
		for (let i = 0; i < length; i++) {  
			let observer = observers[i];  
			if (observer.compar(context, callback)) {  
				--length;
				removeFunc(observers, i)
				break;  
			}  
		}
		if (length == 0) {  
			delete Emitter.listeners[name];  
		}  
    }  
  
    /**  
     * 发送事件  
     * @param name 事件名称  
     */  
    public static fire(name: string, ...args: any[]) {  
        let observers: Observer[] = Emitter.listeners[name];  
        if (!observers) {
			return;  
		}
		Emitter.m_IsFire = name
        for (let i = 0, length = observers.length; i < length; i++) {  
			let observer = observers[i]
			if (observer && !observer.remove) {
            	observer.notify(name, args);  
			}
        }  
		Emitter.m_IsFire = null
		let removeList = Emitter.m_RemoveList
		if (removeList.length > 0) {
			removeList.sort((lhs, rhs) => { return rhs - lhs })	
			for (let index of removeList) {
				observers.splice(index, 1);  
			}
			removeList.slice(0, removeList.length)
		}
    }  
}
window["Observer"]=Observer
window["Emitter"]=Emitter