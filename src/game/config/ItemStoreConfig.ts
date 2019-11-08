class ItemStoreConfig {
	static getStoreByItemID(id: number) {
		var arr = GlobalConfig.ins("ItemStoreConfig");
		for (var i in arr) {
			var element = arr[i];
			if (element.itemId == id)
				return element;
		}
		return null;
	};
}
window["ItemStoreConfig"]=ItemStoreConfig