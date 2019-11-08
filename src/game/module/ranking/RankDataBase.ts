class RankDataBase {
	parser (bytes:Sproto.rank_data, items) {
        items.forEach((key) => {
            this[key] = bytes[key];
        });
    };
}
window["RankDataBase"]=RankDataBase