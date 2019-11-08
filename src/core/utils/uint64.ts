class uint64 {
    _lowUint = 0;
    _highUint = 0;
    // value :any;
    public constructor(v?) {
        this.value = v;
    }

    public isEqual(target) {
        if (!target)
            return false;
        return this._lowUint == target._lowUint && this._highUint == target._highUint;
    };
    public isGreaterThan(target) {
        if (target instanceof uint64)
            return this._highUint > target._highUint || (this._highUint == target._highUint && this._lowUint > target._lowUint);
        else {
            var u64 = new uint64();
            if (typeof target == 'string') {
                u64.value = target;
                return this.isGreaterThanOrEqual(u64);
            }
            if (typeof target == 'number') {
                u64.value = target.toString();
                return this.isGreaterThanOrEqual(u64);
            }
        }
    };
    public isGreaterThanOrEqual(target) {
        if (target instanceof uint64)
            return this._highUint > target._highUint || (this._highUint == target._highUint && this._lowUint >= target._lowUint);
        else {
            var u64 = new uint64();
            if (typeof target == 'string') {
                u64.value = target;
                return this.isGreaterThanOrEqual(u64);
            }
            if (typeof target == 'number') {
                u64.value = target.toString();
                return this.isGreaterThanOrEqual(u64);
            }
        }
    };
    public get isZero(): boolean {
        return this._lowUint == 0 && this._highUint == 0;
    }
    public get isGreaterThanZero(): boolean {
        /** 是否大于0 */
        return this._lowUint > 0 || this._highUint > 0;
    }
    public writeByte(b) {
        b.writeUnsignedInt(this._lowUint);
        b.writeUnsignedInt(this._highUint);
    };
    public setValue(lowerUint = 0, higherUint = 0) {
        this._lowUint = lowerUint;
        this._highUint = higherUint;
    };
    public set value(v) {
        if (v instanceof egret.ByteArray) {
            this._lowUint = v.readUnsignedInt();
            this._highUint = v.readUnsignedInt();
        }
        else if (typeof v == 'string') {
            uint64.stringToUint64(v, 10, this);
        }
    }
    public set valueByString(value) {
        var num = 0;
    }
    /**
     * 左移运算
     * @param num
     * @return
     */
    public leftMove(num, result = null) {
        result = result || this;
        var bitMask = uint64.LeftMoveMask[num];
        var lowUintMaskNum = bitMask & this._lowUint;
        lowUintMaskNum = lowUintMaskNum >>> (32 - num);
        result._lowUint = this._lowUint << num;
        result._highUint = this._highUint << num;
        result._highUint = result._highUint | lowUintMaskNum;
    };
    /**
     *加法
     * @param value
     * @param result
     */
    public add(value, result = null) {
        result = result || this;
        var num = this._lowUint + value._lowUint;
        result._highUint = this._highUint + value._highUint;
        if (num >= uint64.MaxLowUint) {
            result._highUint++;
            result._lowUint = num - uint64.MaxLowUint;
        }
        else {
            result._lowUint = num;
        }
    };
    /** 减法 */
    public subtraction(value, result) {
        if (result === void 0) { result = null; }
        result = result || this;
        var num = this._lowUint - value._lowUint;
        result._highUint = this._highUint - value._highUint;
        if (num < 0) {
            result._highUint--;
            result._lowUint = num + uint64.MaxLowUint;
        }
        else {
            result._lowUint = num;
        }
    };
    /**
     * @param value
     * 注意value值不可过大，否则会计算错误
     */
    public scale(value, result) {
        if (result === void 0) { result = null; }
        result = result || this;
        var num = this._lowUint * value;
        result._highUint = this._highUint * value;
        result._highUint += Math.floor(Math.abs(num / uint64.MaxLowUint));
        result._lowUint = num % uint64.MaxLowUint;
    };
    public toString(radix?: number) {
        if (radix === void 0) { radix = 10; }
        var result = "";
        var lowUint = this._lowUint;
        var highUint = this._highUint;
        var highRemain;
        var lowRemain;
        var tempNum;
        while (highUint != 0 || lowUint != 0) {
            highRemain = (highUint % radix);
            tempNum = highRemain * uint64.MaxLowUint + lowUint;
            lowRemain = tempNum % radix;
            result = lowRemain + result;
            highUint = (highUint - highRemain) / radix;
            lowUint = (tempNum - lowRemain) / radix;
        }
        return result.length ? result : "0";
    };
    /**
     *根据字符串导出成64位数据结构
     * @param value
     * @return
     */
    public static stringToUint64(value: string, radix?: number, result?: any) {
        if (radix === void 0) { radix = 10; }
        if (result === void 0) { result = null; }
        result = result || new uint64;
        var lowUint = 0;
        var highUint = 0;
        var tempNum;
        var len = value.length;
        var char;
        for (var i = 0; i < len; i++) {
            char = parseInt(value.charAt(i));
            tempNum = lowUint * radix + char;
            highUint = highUint * radix + Math.floor(tempNum / uint64.MaxLowUint);
            lowUint = tempNum % uint64.MaxLowUint;
        }
        result.setValue(lowUint, highUint);
        return result;
    };
    public static LeftMoveMask = [0,
        0x80000000, 0x40000000, 0x20000000, 0x10000000,
        0x08000000, 0x04000000, 0x02000000, 0x01000000,
        0x00800000, 0x00400000, 0x00200000, 0x00100000,
        0x00080000, 0x00040000, 0x00020000, 0x00010000,
        0x00008000, 0x00004000, 0x00002000, 0x00001000,
        0x00000800, 0x00000400, 0x00000200, 0x00000100,
        0x00000080, 0x00000040, 0x00000020, 0x00000010,
        0x00000008, 0x00000004, 0x00000002, 0x00000001,
    ];
    public static MaxLowUint = 0xffffffff + 1;
}
window["uint64"]=uint64