class UserReadPlayer extends BaseClass {

    private m_ActorId
    private m_RoleId
    private _actorId

    public static ins(): UserReadPlayer {
        return super.ins()
    }

    public constructor() {
        super()
        GameGlobal.MessageCenter.addListener(MessageDef.SHOW_OTHER_ACTOR, this._DoResult, this)
    }

    private _DoResult(actorId: number) {
        if (actorId != this.m_ActorId) {
            return
        }
        this.m_ActorId = null
        let data = GameLogic.ins().GetShowOtherActor(actorId)
        if (data.roleList) {
            GameGlobal.MessageCenter.dispatch(MessageDef.SHOW_RANK_OTHER_ACTOR, actorId)
        }
    }

    public LookPlayer(actorId: number, roleId: number) {
        if (!actorId) {
            return
        }
        this.m_ActorId = actorId
        this.m_RoleId = roleId
        GameLogic.ins().SendGetOtherActorInfo(actorId, null)
        GameLogic.ins().SendGetOtherPlayerInfo(actorId, roleId)
    }
    public get actorId() {
        return this._actorId;
    }
    public set actorId(value) {
        this._actorId = value
    }
}
window["UserReadPlayer"] = UserReadPlayer