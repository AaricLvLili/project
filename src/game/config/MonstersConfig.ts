class MonstersConfig {
	public static createModel(config, rate = null): EntityModel {
		var model = new EntityModel;
		model.type = EntityType.Monster;
		model.configID = config.id;
		model.monstersType = config.type;
		let hp = rate ? Math.round(rate * config.hp) : config.hp
		model.setAtt(AttributeType.atHp, hp);
		model.setAtt(AttributeType.atMaxHp, hp);
		model.setAtt(AttributeType.atAttack, config.atk);
		model.setAtt(AttributeType.atDef, config.def);
		model.setAtt(AttributeType.atRes, config.res);
		model.setAtt(AttributeType.atCrit, config.crit);
		model.setAtt(AttributeType.atTough, config.tough);
		model.setAtt(AttributeType.atMoveSpeed, config.ms);
		model.setAtt(AttributeType.atAttackSpeed, config.as);
		return model;
	}
}
window["MonstersConfig"]=MonstersConfig