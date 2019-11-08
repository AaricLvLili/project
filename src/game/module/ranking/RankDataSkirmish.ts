class RankDataSkirmish extends RankDataBase {

	pos
	reward
	money

	parser(bytes, items) {
		super.parser(bytes, items);
		for (var i in GlobalConfig.ins("PublicPkrednamerankConfig")) {
			var config = GlobalConfig.ins("PublicPkrednamerankConfig")[i];
			if (config.minRank <= this.pos && this.pos <= config.maxRank) {
				this.reward = config.rewards[0].count;
				this.money = config.rewards[1].count;
				return;
			}
		}
		;
		this.money = this.reward = 0;
	}
}
window["RankDataSkirmish"]=RankDataSkirmish