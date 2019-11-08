class Logger {
	public static trace (...args: any[]) {
        if (DebugUtils.isDebug) {
            args[0] = "[DebugLog] " + args[0];
            console.log.apply(console, args);
        }
    }

    public static Log(...args: any[]): void {
        console.log.apply(console, args);
    }

    public static Warn(...args: any[]): void {

        // var i = 0;  
        // var fun = arguments.callee;  
        // do {  
        //     fun = fun.arguments.callee.caller;  
        //     console.log(++i + ': ' + fun);  
        // } while (fun);  
        console.warn.apply(console, args);
    }

    public static Error(...args: any[]): void {
        console.error.apply(console, args);
    }
}

var _Log  = function(...args: any[]) {
    console.log.apply(console, args)
} 
window["Logger"]=Logger