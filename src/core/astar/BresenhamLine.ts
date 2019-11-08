class BresenhamLine {

	static throughCheckResult: Array<any>;
	static coords: Array<any>;
	/**
		 * 判断指定的两个点是否可以通过
		 * @param x1 起始格子x坐标
		 * @param y1 起始格子y坐标
		 * @param x2 目标格子x坐标
		 * @param y2 目标格子y坐标
		 * @param walkableCheck 直线经过格子是否可移动的检查函数，function(x:number, y:number):Boolean
		 * @return 检测结果数组，第一个元素表示是否可以通过，0-不可以，1-可以；第二表示通过格子的数量；第三和第四个表示最后一个通过的格子坐标
		 *
		 */
	public static isAbleToThrough(ox, oy, tx, ty, walkableCheck) {
		var x1 = 0, y1 = 0, x2 = 0, y2 = 0;
		var xstep = 0, ystep = 0, dx = 0, x = 0, y = 0, lastY = 0;
		var ny = 0, k = 0, b = 0, i = 0;
		if (!this.throughCheckResult) {
			this.throughCheckResult = new Array(4);
		}
		this.throughCheckResult[0] = 0;
		this.throughCheckResult[1] = 0;
		//计算斜率和直线的截距常量
		k = (ty - oy) / (tx - ox);
		b = ty - k * tx;
		//计算直线的坐标方向增量
		xstep = tx > ox ? 1 : -1;
		ystep = ty > oy ? 1 : -1;
		//对起点和终点坐标取整，并计算x方向的绝对距离
		x1 = ox >> 0, y1 = oy >> 0, x2 = tx >> 0, y2 = ty >> 0;
		dx = x2 - x1, dx = (dx ^ (dx >> 31)) - (dx >> 31);
		//记录起始格子
		x = x1, lastY = y1;
		this.throughCheckResult[2] = x, this.throughCheckResult[3] = lastY;
		//			trace(throughCheckResult[2], throughCheckResult[3]);
		//沿着起点到终点的x方向递增（减），计算经过的格子
		for (i = 0; i < dx; i++) {
			x += xstep;
			//这里必须注意，x往不同的方向与y相交的点不同
			ny = k * (xstep > 0 ? x : x + 1) + b;
			//交点y取整，得到经过格子的y坐标
			y = ny >> 0;
			//计算当前交点与上一个交点之间经过的格子
			while (lastY != y) {
				lastY += ystep;
				if (!walkableCheck(x - xstep, lastY))
					return this.throughCheckResult;
				this.throughCheckResult[2] = x - xstep, this.throughCheckResult[3] = lastY;
			}
			//押入当前计算得出的格子
			if (!walkableCheck(x, y))
				return this.throughCheckResult;
			this.throughCheckResult[2] = x, this.throughCheckResult[3] = y;
		}
		//计算最后一相交点与终点之间的格子
		while (lastY != y2) {
			lastY += ystep;
			if (!walkableCheck(x, lastY))
				return this.throughCheckResult;
			this.throughCheckResult[2] = x, this.throughCheckResult[3] = lastY;
		}
		this.throughCheckResult[0] = 1;
		return this.throughCheckResult;
	};
    /**
     * 计算指定两点间直线经过的格子
     * @param ox 起始格子x坐标
     * @param oy 起始格子y坐标
     * @param tx 目标格子x坐标
     * @param ty 目标格子y坐标
     * @return 经过格子的坐标列表，顺序为[x0, y0, x1, y1, ...]
     *
     */
	public static tileLine(ox, oy, tx, ty) {
		var x1 = 0, y1 = 0, x2 = 0, y2 = 0;
		var xstep = 0, ystep = 0, dx = 0, x = 0, y = 0, lastY = 0;
		var ny = 0, k = 0, b = 0, i = 0;
		//结果坐标列表
		if (!this.coords)
			this.coords = [];
		this.coords.length = 0;
		//计算斜率和直线的截距常量
		k = (ty - oy) / (tx - ox);
		b = ty - k * tx;
		//计算直线的坐标方向增量
		xstep = tx > ox ? 1 : -1;
		ystep = ty > oy ? 1 : -1;
		//对起点和终点坐标取整，并计算x方向的绝对距离
		x1 = ox >> 0, y1 = oy >> 0, x2 = tx >> 0, y2 = ty >> 0;
		dx = x2 - x1, dx = (dx ^ (dx >> 31)) - (dx >> 31);
		//押入起始格子
		this.coords[this.coords.length] = x1, this.coords[this.coords.length] = y1;
		x = x1, lastY = y1;
		//沿着起点到终点的x方向递增（减），计算经过的格子
		for (i = 0; i < dx; i++) {
			x += xstep;
			//这里必须注意，x往不同的方向与y相交的点不同
			ny = k * (xstep > 0 ? x : x + 1) + b;
			//交点y取整，得到经过格子的y坐标
			y = ny >> 0;
			//计算当前交点与上一个交点之间经过的格子
			while (lastY != y) {
				lastY += ystep;
				this.coords[this.coords.length] = x - xstep, this.coords[this.coords.length] = lastY;
			}
			//押入当前计算得出的格子
			this.coords[this.coords.length] = x, this.coords[this.coords.length] = y;
		}
		//计算最后一相交点与终点之间的格子
		while (lastY != y2) {
			lastY += ystep;
			this.coords[this.coords.length] = x, this.coords[this.coords.length] = lastY;
		}
		return this.coords;
	};
    /**
     * 获取指定直线上的点
     * @param ox 起始点x坐标
     * @param oy 起始点y坐标
     * @param tx 目标点x坐标
     * @param ty 目标点y坐标
     * @param ds 起始点和目标点构成的直线延伸的距离
     * @return 延伸ds后的点
     *
     */
	public static getPointOnLine(ox, oy, tx, ty, ds) {
		var os = 0, ts = 0, dx = 0, dy = 0;
		dx = tx - ox, dy = ty - oy;
		os = Math.sqrt(dx * dx + dy * dy);
		ts = os + ds;
		return [Math.round(ox + dx * ts / os), Math.round(oy + dy * ts / os)];
	};
    /**
     * 缩短路径
     * 该方法会直接修改path参数，不会创建新的path
     * @param ox 寻路起点x
     * @param oy 寻路起点y
     * @param path 路径
     * @param distance 缩短距离
     *
     */
	public static shortenPath(ox, oy, path, distance) {
		var sx = ox, sy = oy;
		var tx = path[path.length - 2], ty = path[path.length - 1];
		var dx = 0, dy = 0;
		var pt;
		// 获取最后路段的起点坐标
		if (path.length >= 4) {
			sx = path[path.length - 4], sy = path[path.length - 3];
		}
		// 计算最后路段两节点的坐标差
		dx = tx - sx, dy = ty - sy;
		// 如果最后路段长度大于要缩短的长度，则缩短距离，调整最后节点
		if (dx * dx + dy * dy > distance * distance) {
			pt = BresenhamLine.getPointOnLine(sx, sy, tx, ty, -distance);
			path[path.length - 2] = pt[0], path[path.length - 1] = pt[1];
		}
		else {
			path.length -= 2;
		}
	};
}
window["BresenhamLine"]=BresenhamLine