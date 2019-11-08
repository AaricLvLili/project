class HonorStoreData {
	exchangeCount

	public constructor(t: Sproto.feats_store_data[]) {
		this.exchangeCount = [];
		for (var i = 0; i < t.length; i++) { 
			this.exchangeCount[t[i].id] = t[i].count
		}
	}
}
window["HonorStoreData"]=HonorStoreData