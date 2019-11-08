class ObjectPool extends BaseClass{

    public static ins(): ObjectPool {
        return super.ins();
    };

    public length(refKey:string):number{
        if(!this._content[refKey]){
            return 0;
        }
        return this._content[refKey].length;
    }
    /**
     * 取出一个对象
     * @param classZ Class
     * @return Object
     */
    public pop(refKey, ...args: any[]) {
        if (!this._content[refKey]) {
            this._content[refKey] = [];
        }
        var list = this._content[refKey];
        if (list.length) {
            var i = list.pop();
            return i;
        }
        else 
        {      
            var classZ = egret.getDefinitionByName(refKey);
            var argsLen = args.length;
            var obj = void 0;
            if (argsLen == 0) {
                obj = new classZ();
            }
            else if (argsLen == 1) {
                obj = new classZ(args[0]);
            }
            else if (argsLen == 2) {
                obj = new classZ(args[0], args[1]);
            }
            else if (argsLen == 3) {
                obj = new classZ(args[0], args[1], args[2]);
            }
            else if (argsLen == 4) {
                obj = new classZ(args[0], args[1], args[2], args[3]);
            }
            else if (argsLen == 5) {
                obj = new classZ(args[0], args[1], args[2], args[3], args[4]);
            }
            obj.ObjectPoolKey = refKey;
            return obj;
        }
    };
    /**
     * 放入一个对象
     * @param obj
    */
    private cx = 0;
    public push(obj) {
        if (obj == null) {
            return false;
        }
        var refKey = obj.ObjectPoolKey;
        //保证只有pop出来的对象可以放进来，或者是已经清除的无法放入
        if (!this._content[refKey] || this._content[refKey].indexOf(obj) > -1) {
            return false;
        }
        if(refKey == "CharRole")// || refKey == "CharMonster")
        {
            // egret.log("回收 : "+ refKey + " length=" + this._content[refKey].length)
        }
        this._content[refKey].push(obj);

        return true;
    };
    
    public create(){
        //在空闲时，让对象池保持有对象状态，避免在游戏运行中，出现大量创建
        //预设对象池数量
        var mcLen:number = 50;
        var imgLen:number = 10;
        var roleLen:number = 3;
        var monsterLen:number = 8;


        var i:number;
        for(i =0 ;i<mcLen;i++){
            this.push(new MovieClip());
        }
        for(i =0 ;i<imgLen;i++){
            this.push(new eui.Image());
        }

        for(i =0 ;i<roleLen;i++){
            this.push(new CharRole());
        }
        for(i =0 ;i<monsterLen;i++){
            this.push(new CharMonster());
        }
    }

    private _content = {};
}
window["ObjectPool"]=ObjectPool