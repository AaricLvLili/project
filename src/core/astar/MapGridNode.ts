class MapGridNode {

	flags: number;
	/**
         * 遮挡标记。true-遮挡，false-不遮挡
         * @return
         *
         */
	public get hidden() {
		return (this.flags & (1 << 1)) > 0;
	}

	/** 移动标记。true-可移动，false-不可移动 */
	public get walkable() {
		return (this.flags & (1 << 0)) > 0;
	}
	///////////////////////////////
	//网格节点标识定义
	///////////////////////////////
    /**
     * 可移动标记位
     */
	public static FLAG_WALKABLE = 0x8000;
    /**
     * 遮挡标记位
     */
	public static FLAG_HIDDEN = 0x4000;
}

class MapGridNode2 {

	flags: number;
	/**
         * 遮挡标记。true-遮挡，false-不遮挡
         * @return
         *
         */
	public get hidden() {
		return (this.flags & (1 << 1)) > 0;
	}

	/** 移动标记。true-可移动，false-不可移动 */
	public get walkable() {

		

		return !((this.flags & (1 << 0)) > 0);
	}
	///////////////////////////////
	//网格节点标识定义
	///////////////////////////////
    /**
     * 可移动标记位
     */
	public static FLAG_WALKABLE = 0x8000;
    /**
     * 遮挡标记位
     */
	public static FLAG_HIDDEN = 0x4000;
}
window["MapGridNode"]=MapGridNode
window["MapGridNode2"]=MapGridNode2