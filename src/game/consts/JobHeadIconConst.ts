class JobItemIconConst {
} 

JobItemIconConst[0] = "";
JobItemIconConst[1] = "comp_21_22_01_png";
JobItemIconConst[2] = "comp_21_22_02_png";
JobItemIconConst[3] = "comp_21_22_03_png";

class JobHeadIconConst{
    static GetIcon(job, sex) {
        return ResDataPath.GetHeadMiniImgName(job, sex)
    }
}

window["JobItemIconConst"]=JobItemIconConst
window["JobHeadIconConst"]=JobHeadIconConst