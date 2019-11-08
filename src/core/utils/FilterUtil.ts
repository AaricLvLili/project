class FilterUtil {
	/**
     * 正常滤镜
     */
	public static setNormalFilter(obj: egret.DisplayObject) {
		obj.filters = [FilterUtil.normalColorFilter];
	}

    /**
     * 灰色滤镜
     */
	public static setGayFilter(obj: egret.DisplayObject) {
		obj.filters = [FilterUtil.grayColorFilter];
	}

    /**
     * 灰色滤镜2
     */
	public static setGayFilter2(obj: egret.DisplayObject) {
		obj.filters = [FilterUtil.grayColorFilter2];
	}

	/**高光滤镜 */
	public static setHighLightFilter(obj: egret.DisplayObject) {
		obj.filters = [FilterUtil.highLightColorFilter];
	}

	/**黑色透明滤镜 */
	public static setBlackFilter(obj: egret.DisplayObject) {
		obj.filters = [FilterUtil.blackLightFilter];
	}

	/**
	 * 正常滤镜矩阵
	 */
	public static normalColorFilter = new egret.ColorMatrixFilter([
		1, 0, 0, 0, 0,
		0, 1, 0, 0, 0,
		0, 0, 1, 0, 0,
		0, 0, 0, 1, 0
	]);

	/**
	 * 灰色滤镜矩阵
	 */
	public static grayColorFilter = new egret.ColorMatrixFilter([
		0.3, 0.6, 0, 0, 0,
		0.3, 0.6, 0, 0, 0,
		0.3, 0.6, 0, 0, 0,
		0, 0, 0, 1, 0
	]);

	/**
	 * 灰色滤镜矩阵2
	 */
	public static grayColorFilter2 = new egret.ColorMatrixFilter([
		0.3, 0.6, 0, 0, 30,
		0.3, 0.6, 0, 0, 30,
		0.3, 0.6, 0, 0, 30,
		0, 0, 0, 1, 0
	]);

	/**
	 * 发光滤镜矩阵
	 */
	public static highLightColorFilter = new egret.ColorMatrixFilter([
		1, 0, 0, 0, 0,
		0, 1, 0, 0, 0,
		0, 0, 1, 0, 0,
		0, 0, 0, 1, 0
	]);

	/**
	 * 黑色透明滤镜矩阵
	 */
	public static blackLightFilter = new egret.ColorMatrixFilter([
		0.3, 0, 0, 0, 0,
		0, 0.3, 0, 0, 0,
		0, 0, 0.3, 0, 0,
		0, 0, 0, 1, 0
	]);
}
window["FilterUtil"]=FilterUtil