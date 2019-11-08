class MyGuildRankInfo {
		public actorId: number; // tag 0
		public name: string; // tag 1
		public mapName: string; // tag 2
		public point: number; // tag 3
		public attr: number; // tag 4
		public office: number; // tag 5
		// public job: number; // tag 6
		// public sex: number; // tag 7
		public head: number

		public ToData(data: Sproto.gdwar_member_info) {
			this.actorId = data.dbid
			this.name = data.actorName
			this.point = data.integral
			this.mapName = GuildWar.GetMapName(data.position)
			this.attr = data.fightPow
			this.office = data.office
			this.head = data.headId
			// this.job = 1
			// this.sex = 0
		}
}
window["MyGuildRankInfo"]=MyGuildRankInfo