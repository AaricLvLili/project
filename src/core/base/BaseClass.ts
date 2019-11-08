class BaseClass {
    public static ins(...args: any[]): any {
        var cls: any = this;
        if (!cls._instance) {
            var argsLen = args.length;
            if (argsLen == 0) {
                cls._instance = new cls();
            } else if (argsLen == 1) {
                cls._instance = new cls(args[0]);
            } else if (argsLen == 2) {
                cls._instance = new cls(args[0], args[1]);
            } else if (argsLen == 3) {
                cls._instance = new cls(args[0], args[1], args[2]);
            } else if (argsLen == 4) {
                cls._instance = new cls(args[0], args[1], args[2], args[3]);
            } else if (argsLen == 5) {
                cls._instance = new cls(args[0], args[1], args[2], args[3], args[4]);
            } else if (argsLen == 6) {
                cls._instance = new cls(args[0], args[1], args[2], args[3], args[4], args[5]);
            }
        }
        return cls._instance;
    }
}
window["BaseClass"] = BaseClass