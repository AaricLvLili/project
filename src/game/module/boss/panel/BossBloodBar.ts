class BossBloodBar extends eui.ProgressBar {
	public constructor() {
		super();
		this.skinName = "barRoSkin4";
	}
	public thumb0: eui.Image;
	public thumb1: eui.Image;
	public thumb: eui.Image;
	public m_Text: eui.Label;


	/**总血条数 */
	private maxBarNum = 100;
	/**当前血条数 */
	private nowBarNum = 0;
	/**总血量 */
	private maxBloodNum = 101.1;
	/**当前血量 */
	private nowBloodValue = 101.1;
	/**每条血的当前数量 */
	private nowBloodNum = 0;
	/**每条血的最大数量 */
	private maxNowBloodNum = 0;

	private oldBarNum = 0;
	public m_BloodBar: eui.ProgressBar;

	private bloodMaxList = [13, 12, 15, 16, 2];
	public createChildren() {
		super.createChildren();
		this.slideDuration = 200;
		this.m_BloodBar.slideDuration = 800;
	}

	public set changeMaxBarNum(value) {
		if (!value) {
			return;
		}
		if (this.maxBarNum != value) {
			this.maxBarNum = value;
		}
	}

	public set changeValue(value: number) {
		if (value == this.nowBloodValue) {
			return;
		}
		if (value < 0) {
			value = 0;
		}
		this.nowBloodValue = value;
		this.setShow(value);
		let showValue = this.maxBloodNum;
		if (value != this.maxBloodNum) {
			showValue = value - (this.maxNowBloodNum * Math.floor(value / this.maxNowBloodNum));
		}
		let barNum = Math.ceil(value / this.maxNowBloodNum)//当前血条数量
		if (this.value < showValue && this.oldBarNum > barNum) {
			this.m_BloodBar.value = this.maxBloodNum;
			this.m_BloodBar.value = showValue;
			this.value = this.maxBloodNum;
			this.value = showValue;

		} else {
			this.m_BloodBar.value = showValue;
			this.value = showValue;
		}
		this.oldBarNum = barNum;

	}
	public set changeMaximum(value: number) {
		if (value == this.maxBloodNum) {
			return;
		}
		this.maxBloodNum = value;
		this.maxNowBloodNum = value / this.maxBarNum;
		if (!this.maxNowBloodNum) {
			this.maxNowBloodNum = 0;
		}
		this.maximum = this.maxNowBloodNum;
		this.m_BloodBar.maximum = this.maxNowBloodNum;
		this.value = this.nowBloodValue;
	}

	private setShow(value: number) {
		if (value < 0) {
			value = 0;
		}
		let barNum = Math.ceil(value / this.maxNowBloodNum);//当前血条数量
		if (!barNum || !this.maxNowBloodNum) {
			barNum = 0;
		}
		if (barNum <= 1) {
			this.thumb1.visible = false;
		} else {
			this.thumb1.visible = true;
		}
		let index = barNum % this.bloodMaxList.length;
		let nextIndex = index - 1;
		if (index == 0) {
			nextIndex = this.bloodMaxList.length - 1;
		}
		this.thumb.source = "comp_21_12_" + this.bloodMaxList[index] + "_png";
		this.thumb1.source = "comp_21_12_" + this.bloodMaxList[nextIndex] + "_png";
		this.m_Text.text = "x" + barNum + "";
	}

	public getMaxHp(){
		return this.maxBloodNum;
	}
}
window["BossBloodBar"] = BossBloodBar