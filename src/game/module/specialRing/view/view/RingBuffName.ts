//戒语的名字
class RingBuffName extends eui.Component {

	public constructor() {
		super();
		this.skinName = "RingBuffNameSkin";
	}
    bg: eui.Image
    text: eui.Label
    imgSrc = ['comp_46_21_0_png','comp_46_21_02_png']

	setLabel(str:string){
        this.text.text = str
    }
    setImage(bool:boolean){
        if (bool){
            this.bg.source = this.imgSrc[1]
        }
        else{
            this.bg.source = this.imgSrc[0]
        }
        
    }
}
window["RingBuffName"]=RingBuffName