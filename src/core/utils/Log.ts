class Log {
	public constructor() {
	}

	public static trace (...args: any[]) {
        if (DebugUtils.isDebug) {
            args[0] = "[DebugLog]" + args[0];
            console.log.apply(console, args);
        }
    };
}
window["Log"]=Log