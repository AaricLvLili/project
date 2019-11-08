var __ref_field__: any = EquipPos

class ResDataPath {

	private static ROOT = Const.RES_URL + "resource/assets/"
	private static ROOT_MOVIE = ResDataPath.ROOT + "movie/"
	public static ROOT_MAP = ResDataPath.ROOT + "map/"

	public static EMPTY_STR = ""

	// 默认的衣服武器坐骑名称
	// public static DEFAULT_BODY_NAME = "body000"
	/**
	 * 0衣服1武器2坐骑
	 */
	public static GetDefaultBodyName(job: number, id: number) {
		let cfg = GlobalConfig.ins("roleAppearanceConfig")
		switch (id) {
			case 0:
				return cfg[job].initialBody
			case 1:
				return cfg[job].initialWeapon
			case 2:
				return cfg[job].initialMounts
		}
	}

	public static DEFAULT_QUALITY = "pf_black_01_png"

	// 矿工资源名
	public static MINER = ResDataPath.ROOT_MOVIE + "eff/" + "kuanggong"
	// 矿可掠夺
	public static MINE_ROB_EFFE = ResDataPath.ROOT_MOVIE + "eff/" + "kelveduo"

	public static GetMineNameByType(level: number) {
		return "comp_64_64_0" + (level + 4) + "_png"
	}

	public static GetDartCarNameByType(level: number) {
		return "comp_63_60_0" + level + "_png"
	}

	public static GetDartCarBodyByType(level: number) {
		return ResDataPath.ROOT_MOVIE + "eff/" + "chedui0" + level
	}

	public static GetCaiQuan(level: number) {
		return ResDataPath.ROOT_MOVIE + "eff/caiquan0" + level
	}

	public static GetMapThumbnailPath(name: string) {
		return Const.RES_URL + "resource/assets/map/" + name + "/small.jpg";//small
	}

	public static getMapIamge(name: string) {
		return Const.RES_URL + "resource/assets/mapTest/" + name + "-min.jpg";//small
	}

	public static GetMapPreviewPath(name: string) {
		return Const.RES_URL + "resource/assets/map/" + name + "/pk_preview.jpg";
	}

	// zz包相对路径
	public static GetMapData(name: string) {
		return "map/" + name + "/mdata.txt"
	}

	// 获取地图资源路径
	public static GetMapPath(name: string, x: number, y: number): string {
		return Const.RES_URL + "resource/assets/map/" + name + "/image/" + y + "_" + x + ".jpg";
	}

	// 获取身体资源名称
	public static GetBodyName01(appearance: string, sex: number) {
		return appearance + "_" + sex
	}

	public static GetWeaponName01(appearance: string, sex: number) {
		return appearance + "_" + sex;
	}

	// 获取物品的完整名称
	public static GetItemFullName(itemName: string) {
		if (itemName == null) {
			return ""
		}
		return itemName + "_png"
	}

	public static GetLvName(zsLevel: number, level: number) {
		return GameString.GetLvName(zsLevel, level)
	}

	static ITEM_BG_QUALITY = [
		"pf_black_01_png",		// 白
		"pf_green_01_png",		// 绿
		"pf_blue_01_png",		// 蓝
		"pf_purple_01_png",		// 紫
		"pf_orange_01_png",		// 橙
		"pf_red_01_png",		// 红
	]
	// 获取物品品质图片名称
	public static GetItemQualityName(quality: number) {
		return ResDataPath.ITEM_BG_QUALITY[quality]
		// return "Common_Quality_00" + quality
	}

	// 获取物品品质特效名称
	public static GetItemQualityEffeName(quality: number) {
		return 'quality_0' + quality
	}

	// 获取头像图片名称
	public static GetHeadMiniImgName(job: number, sex: number = null) {
		if (sex == null) {
			sex = job % 10
			job = Math.floor(job / 10)
		}
		return `role_01_${job || 1}_${sex || 0}_png`
	}

	public static GetElementImgName(type: ElementType) {
		if (!type) {
			// egret.log("取不到元素图片");
			return "";
		}
		return "element_" + type + "_png";
	}

	public static GetHeadMiniImgNameById(headId: number): string {
		return this.GetHeadMiniImgName(Math.floor((headId % 100) * 0.1), headId % 10)
	}

	public static GetHeadMiniImgName2(job: number, sex: number) {
		return `role_01_${job || 1}_${sex || 0}_png`
	}

	public static GetHeadMiniImgName2ById(headId: number): string {
		return this.GetHeadMiniImgName2(Math.floor((headId % 100) * 0.1), headId % 10)
	}

	public static GetHeadImgName(job: number, sex: number) {
		return `role_03_${job}_${sex}_png`
	}

	public static getBossHeadImage(headid: string) {
		return `${ResDataPath.ROOT}ress/bossHead/${headid}.png`;
	}

	static _EquipDefaultIcon = {
		[EquipPos.WEAPON]: "propIcon_021_png",
		[EquipPos.HEAD]: "propIcon_019_png",
		[EquipPos.CLOTHES]: "propIcon_007_png",
		[EquipPos.NECKLACE]: "propIcon_009_png",
		[EquipPos.BRACELET1]: "propIcon_015_png",
		[EquipPos.BRACELET2]: "propIcon_017_png",
		[EquipPos.RING1]: "propIcon_011_png",
		[EquipPos.RING2]: "propIcon_013_png",
		// [EquipPos.DZI]: "",
	}

	public static GetEquipDefaultIcon(type: number) {
		return ResDataPath._EquipDefaultIcon[type]
	}

	static _EquipDefaultPIcon = {
		[EquipPos.WEAPON]: "propIcon_022_png",
		[EquipPos.HEAD]: "propIcon_020_png",
		[EquipPos.CLOTHES]: "propIcon_008_png",
		[EquipPos.NECKLACE]: "propIcon_010_png",
		[EquipPos.BRACELET1]: "propIcon_016_png",
		[EquipPos.BRACELET2]: "propIcon_018_png",
		[EquipPos.RING1]: "propIcon_012_png",
		[EquipPos.RING2]: "propIcon_014_png",
		// [EquipPos.DZI]: "",
	}

	public static GetEquipDefaultPIcon(type: number) {
		return ResDataPath._EquipDefaultPIcon[type]
	}

	////////////////////////////////////////////// 路径 ////////////////////////////////////////////////////////////
	public static GetAssets(name: string) {
		return ResDataPath.ROOT + name + ".png"
	}

	public static GetMoviePath(name: string, type: string): string {
		return ResDataPath.ROOT_MOVIE + type + "/" + name
	}

	public static GetMonsterBodyPath(name: string): string {
		return ResDataPath.ROOT_MOVIE + "monster/" + name
	}

	public static GetMountBodyPath(name: string): string {
		return ResDataPath.ROOT_MOVIE + "mounts/" + name
	}

	public static GetRoleBodyPath(name: string): string {
		return ResDataPath.ROOT_MOVIE + "body/" + name
	}

	public static GetSkillPathByID(id: string): string {
		if (!id || id == "undefined") {
			egret.log("技能id不存在:" + id);
		}
		let skill = ResDataPath.ROOT_MOVIE + "skillEff/skill" + id;
		if (SdkMgr.isWxGame()) {
			skill = ResDataPath.ROOT_MOVIE + "skillEff_wx/skill" + id;
		}
		return skill;
	}

	public static GetSkillPath(skillEffName: string): string {
		if (!skillEffName) {
			egret.log("技能特效名字不存在:" + skillEffName);
		}
		let skill = ResDataPath.ROOT_MOVIE + "skillEff/" + skillEffName;
		if (SdkMgr.isWxGame()) {
			skill = ResDataPath.ROOT_MOVIE + "skillEff_wx/" + skillEffName;
		}
		return skill;
	}

	public static GetUIEffePath(effeName: string): string {
		return ResDataPath.ROOT_MOVIE + "uiEffe/" + effeName
	}

	public static GetRoleWingPath(name: string): string {
		return ResDataPath.ROOT_MOVIE + "wing/" + name
	}

	public static GetPathBuyType(name: string, resAnimType: ResAnimType) {
		switch (resAnimType) {
			case ResAnimType.TYPE1:
				return this.GetUIEffePath(name);
			case ResAnimType.TYPE2:
				return this.GetMonsterBodyPath(name);
			case ResAnimType.TYPE3:
				return this.GetMountBodyPath(name);
		}

	}
}
enum ResAnimType {
	/**普通UI */
	TYPE1 = 1,
	/**怪物 */
	TYPE2 = 2,
	/**坐骑 */
	TYPE3 = 3,
	/**角色 */
	TYPE4 = 4,
}
window["ResAnimType"] = ResAnimType
window["ResDataPath"] = ResDataPath