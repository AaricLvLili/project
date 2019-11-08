/**
 * 平均数工具类
 */
class AverageUtils {
    nums = [];
        numsLen = 0;
        numSum = 0;
        maxNum = 0;
        
	public constructor($maxNum?: number) {
		if ($maxNum === void 0) { $maxNum = 10; }
        this.maxNum = $maxNum;
        
	}

    /**
     * 加入一个值
     * @param value
     */
    public push  (value) {
        if (this.numsLen > this.maxNum) {
            this.numsLen--;
            this.numSum -= this.nums.shift();
        }
        this.nums.push(value);
        this.numSum += value;
        this.numsLen++;
    };
    /**
     * 获取平均值
     * @returns {number}
     */
    public getValue () {
        return this.numSum / this.numsLen;
    };
    /**
     * 清空
     */
    public clear () {
        this.nums.splice(0);
        this.numsLen = 0;
        this.numSum = 0;
    };
}
window["AverageUtils"]=AverageUtils