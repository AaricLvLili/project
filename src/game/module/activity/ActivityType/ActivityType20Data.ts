

class ActivityType20Data extends ActivityBaseData {
	public signInDay: number; // tag 1
	public mondCnt: number; // tag 3
	public siganInData: number[]; // tag 4
	public todaySigan: number; // tag 5
	public month: number; // tag 6
	public mondAllCnt: number; // tag 7
	update(e: Sproto.activity_type20) {
		this.signInDay = e.signInDay;
		this.mondCnt = e.mondCnt;
		this.siganInData = e.siganInData;
		this.todaySigan = e.todaySigan;
		this.month = e.month;
		this.mondAllCnt = e.mondAllCnt;
	}
	isOpenActivity() {
		return this.isOpenTime()
	}

}
window["ActivityType20Data"]=ActivityType20Data