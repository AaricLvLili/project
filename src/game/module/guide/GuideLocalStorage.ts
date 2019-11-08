class GuideLocalStorage {
	/**存入缓存的引导数据 */
	private static setGuideLocalData(value: number, keyLast: number) {
		let key = "Guide_" + keyLast;
		LocalStorageData.setItem(key, value + "");
	}
	/**获取缓存的引导数据 */
	private static getGuideLocalData(keyLast: number): number {
		let key = "Guide_" + keyLast;
		let str = LocalStorageData.getItem(key) || "0";
		return parseInt(str);
	}
	/**完成引导后根据id修改引导数据 */
	public static addCompeleId(id: number) {
		let keyLast = this.getLastKey(id);
		let newId = this.getNewId(id);
		let value = GuideLocalStorage.getGuideLocalData(keyLast) + (1 << newId);
		GuideLocalStorage.setGuideLocalData(value, keyLast);
	}
	/**判断引导是否完成 */
	public static checkIdIsCompele(id: number): boolean {
		let keyLast = this.getLastKey(id);
		let newId = this.getNewId(id);
		let re = GuideLocalStorage.getGuideLocalData(keyLast) & 1 << newId;
		if (re > 0) {
			return true;
		}
		return false;
	}

	private static getLastKey(id: number) {
		let keyLast = Math.ceil(id / 30);
		if (keyLast == 0) {
			keyLast = 1;
		}
		return keyLast;
	}

	private static getNewId(id: number) {
		let newId = 0;
		if (id != 0) {
			newId = id % 30
			if (newId == 0) {
				newId = id;
			}
		}
		return newId;
	}
	/**重置引导缓存 */
	public static reset() {
		for (var i = 0; i < 5; i++) {
			GuideLocalStorage.setGuideLocalData(0, i);
		}
	}
}
window["GuideLocalStorage"] = GuideLocalStorage