class DirUtil {
	/**
     * 通过2点，获取8方向值
     */
	public static get8DirBy2Point(p1, p2) {
		//计算方向
		var angle = MathUtils.getAngle(MathUtils.getRadian2(p1.x, p1.y, p2.x, p2.y));
		return this.angle2dir(angle);
	};

	/**
	 * 通关2点,获取4方向值
	 */
	public static get4DirBy2Point(p1: CharMonster, p2: CharMonster) {
		//计算方向
		let p1x = p1.x;
		let p1y = p1.y;
		let p2x = p2.x;
		let p2y = p2.y;
		let point1 = new egret.Point(p1x, p1y);
		let point2 = new egret.Point(p2x, p2y);
		var angle = this.getAngle(point1, point2);
		return this.angle2dirGet4Dir(angle);
	}

	/**计算角度 */
	public static getAngle(mouseMovePoint: egret.Point, mouseBeginPoint: egret.Point): number {
		let valueX = mouseMovePoint.x - mouseBeginPoint.x;
		let valueY = mouseMovePoint.y - mouseBeginPoint.y;
		//角度
		let degrees = 0;
		if (valueX == 0 && valueY == 0) {
			return;
		}
		else if (valueX >= 0 && valueY >= 0) {
			degrees = Math.atan(valueY / valueX) * 180 / Math.PI + 270;
		}
		else if (valueX <= 0 && valueY >= 0) {
			degrees = Math.atan(Math.abs(valueX) / valueY) * 180 / Math.PI;
		}
		else if (valueX <= 0 && valueY <= 0) {
			degrees = Math.atan(Math.abs(valueY) / Math.abs(valueX)) * 180 / Math.PI + 90;

		}
		else if (valueX >= 0 && valueY <= 0) {
			degrees = Math.atan(valueX / Math.abs(valueY)) * 180 / Math.PI + 180;
		}
		return degrees;
	}


	/** 方向转角度 */
	public static dir2angle(dir) {
		dir *= 45;
		dir -= 90;
		return dir;
	};
	/** 角度转方向 */
	public static angle2dir(angle) {
		if (angle < -90)
			angle += 360;
		return Math.round((angle + 90) / 45) % 8;
	};
	public static angle2dirGet4Dir(angle): number {
		if (angle >= 0 && angle < 90) {
			return 1;
		} else if (angle >= 90 && angle < 180) {
			return 3
		} else if (angle >= 180 && angle < 270) {
			return 5;
		} else if (angle >= 270 && angle < 360) {
			return 7;
		}
		return 0;
	}
	/** 反方向 */
	public static dirOpposit(dir) {
		// 7 == 3 右下 左上
		// 6 == 2 右 左
		// 5 == 1 右上 左下
		// 4 == 0 下 上
		return dir < 4 ? dir + 4 : dir - 4;
	};
	/** 8方向转5方向资源方向 */
	public static get5DirBy8Dir(dir8) {
		var td = 2 * (dir8 - 4);
		if (td < 0)
			td = 0;
		return dir8 - td;
	};
	/**两方向转向*/
	public static get2DirScaleX(dir8) {
		if (dir8 <= 4) return 1;
		return -1;
	}
	/**两方向*/
	public static get2Dir(dir8) {
		// return 2;
		switch (dir8) {
			case 0:
			case 1:
			// case 6:
			case 7:
				return 1;
			default:
				return 3;
		}
	}
	/** 获取方向格子坐标后几格的坐标 */
	public static getGridByDir(dir, pos: number = 1, p: any = null) {
		var angle = this.dir2angle(this.dirOpposit(dir));
		var tp = p || new egret.Point();
		MathUtils.getDirMove(angle, pos * GameMap.CELL_SIZE, tp);
		return tp;
	};
}
window["DirUtil"]=DirUtil