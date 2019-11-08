/**
 * 声音控制
 */
class SoundUtils {
    /**
     * 声音字典
     */
    private m_sounds: Dictionary<egret.Sound>;
    /**
     * 加载列表
     */
    private m_loadings: Dictionary<any>
    /**
     * 音频字典
     */
    private m_channels: Dictionary<egret.SoundChannel>;
    /**
     * 当前播放音效字典
     */
    private m_curEffect: Dictionary<egret.Sound>;
    /**
     * 当前播放背景音乐字典
     */
    private m_curBGM: Dictionary<egret.Sound>;
    /**
     * 回调字典
     */
    private m_callbacks: Dictionary<() => void>;
    /**
     * 播放通道 同一通道音乐覆盖
     */
    private m_playChannel: Dictionary<egret.Sound>;

    private m_BGMVolume: number = 1;

    private m_effectVolume: number = 1;
    /**
     * 音效开关
     */
    private m_effectEnable: boolean = true;
    /**
     * 音乐开关
     */
    private m_musicEnable: boolean = true;

    private static s_instance: SoundUtils;
    public static getInstance(): SoundUtils {
        if (SoundUtils.s_instance == null) {
            SoundUtils.s_instance = new SoundUtils();
        }
        return SoundUtils.s_instance;
    }

    public constructor() {
        this.m_sounds = new Dictionary<egret.Sound>();
        this.m_loadings = new Dictionary<any>();
        this.m_channels = new Dictionary<egret.SoundChannel>();
        this.m_curBGM = new Dictionary<egret.Sound>();
        this.m_curEffect = new Dictionary<egret.Sound>();
        this.m_callbacks = new Dictionary<() => void>();
        this.m_playChannel = new Dictionary<egret.Sound>();
        let value: string = egret.localStorage.getItem('soundEffect');
        if (value) {
            this.m_effectVolume = parseInt(value);
        }
        value = egret.localStorage.getItem('soundBGM');
        if (value) {
            this.m_BGMVolume = parseInt(value);
        }
    }
    /**
     * 音乐播放完成
     * @param  {egret.Event} event
     */
    private onPlayComplete(event: egret.Event): void {
        let channel: egret.SoundChannel = event.currentTarget;
        let callback: () => void = this.m_callbacks.get(channel.hashCode);
        if (callback) {
            callback();
        }
        channel['count']++;
        if (channel['count'] >= channel['maxCount']) {
            this.stop(channel['owner']);
        }
    }
    /**
     * 停止音乐通道播放
     * @param  {number} coverChannel
     */
    private stopSound(coverChannel: number): void {
        let sound: egret.Sound = this.m_playChannel.get(coverChannel);
        if (sound) {
            this.stop(sound);
        }
    }
    /**
     * 停止播放音乐
     * @param  {egret.Sound} sound
     */
    private stop(sound: egret.Sound): void {
        let channel: egret.SoundChannel = this.m_channels.get(sound.hashCode);
        if (channel) {
            // egret.setTimeout(() => {
            if (channel) {
                channel.stop();
                if (channel.hasEventListener(egret.Event.SOUND_COMPLETE)) {
                    channel.removeEventListener(egret.Event.SOUND_COMPLETE, this.onPlayComplete, this);
                }
                this.m_callbacks.remove(channel.hashCode);
                this.m_channels.remove(sound.hashCode);
            }
            // }, this, 500);
        }
        this.m_playChannel.remove(sound['cover']);
        if (sound.type == egret.Sound.EFFECT) {
            this.m_curEffect.remove(this.m_sounds.getKeyByValue(sound));
        } else {
            this.m_curBGM.remove(this.m_sounds.getKeyByValue(sound));
        }
    }
    /**
     * 停止所有音乐
     */
    private stopAllMusic(): void {
        let sounds: egret.Sound[] = this.m_curBGM.values;
        for (let i: number = 0, iLen: number = sounds.length; i < iLen; i++) {
            let sound: egret.Sound = sounds[i];
            if (sound) {
                this.stop(sound);
            }
        }
    }
    /**
     * 停止所有音效
     */
    private stopAllEffect(): void {
        let sounds: egret.Sound[] = this.m_curEffect.values;
        for (let i: number = 0, iLen: number = sounds.length; i < iLen; i++) {
            let sound: egret.Sound = sounds[i];
            if (sound) {
                this.stop(sound);
            }
        }
    }
    /**
     * 播放音乐或音效
     * @param  {number} id  声音配置ID
     * @param  {number=1} loop 播放次数，默认值是 1，循环播放。 大于 0 为播放次数，如 1 为播放 1 次；小于等于 0，为循环播放。
     * @param  {()=>void} onPlayComplete?   播放完毕回调
     */
    public playSound(id: number, loop: number = 1, onPlayComplete?: () => void, isCheck: boolean = true): void {
        let config = GlobalConfig.ins("soundConfig")[id];
        if (config) {
            if (this.isSoundPlaying(id) && config.soundType == 1 && isCheck == true) {
                return;
            }
            this.stopSound(config.coverKey);
        } else {
            egret.warn(`ID为${id}的音效在SoundConfig中不存在`);
            return;
        }
        if ((config.soundType == 0 && !this.m_effectEnable) ||
            (config.soundType != 0 && !this.m_musicEnable)) {
            return;
        }
        let sound: egret.Sound = this.m_sounds.get(id);
        if (!sound) {
            sound = RES.getRes(config.soundResource + "_mp3");
            if (sound) {
                sound.type = config.soundType == 0 ? egret.Sound.EFFECT : egret.Sound.MUSIC;
                this.m_sounds.set(id, sound);
            } else {
                let data = {
                    config: config,
                    loop: loop,
                    callback: onPlayComplete
                }
                if (config.soundType >= 0) {
                    this.m_loadings.set(id, data);
                }
                RES.getResAsync(config.soundResource + "_mp3", () => {
                    // egret.log(`名称为${config.soundResource + "_mp3"}的音效资源加载完成`);
                    if (this.m_loadings.remove(id)) {
                        this.playSound(id, loop, onPlayComplete);
                    }
                }, this);
            }
        }
        if (sound) {
            if (sound.type == egret.Sound.EFFECT) {
                this.m_curEffect.set(id, sound);
            } else {
                this.m_curBGM.set(id, sound);
            }
            this.m_playChannel.set(config.coverKey, sound);
            sound['cover'] = config.coverKey;
            sound['cover'] = config.id;
            let channel: egret.SoundChannel = sound.play(0, loop);
            if (channel) {
                channel['owner'] = sound;
                channel['maxCount'] = loop > 0 ? loop : Number.MAX_VALUE;
                channel['count'] = 0;
                if (sound.type == egret.Sound.EFFECT) {
                    channel.volume = this.m_effectVolume;
                } else {
                    channel.volume = this.m_BGMVolume;
                }
                if (onPlayComplete) {
                    this.m_callbacks.set(channel.hashCode, onPlayComplete);
                }
                channel.addEventListener(egret.Event.SOUND_COMPLETE, this.onPlayComplete, this);
                this.m_channels.set(sound.hashCode, channel);
            }
        } else {
            // egret.warn(`名称为${config.soundResource + "_mp3"}的音效资源不存在`);
            return;
        }
    }
    /**
     * 停止播放音乐
     * @param id 声音ID
     */
    public stopSoundByID(id: number): void {
        let sound: egret.Sound = this.m_sounds.get(id);
        if (sound) {
            this.stop(sound);
            this.m_loadings.remove(id);
        }
    }
    /**
     * 停止播放所有音乐及音效
     */
    public stopAllSound(): void {
        //停止所有音效
        this.stopAllEffect();
        //停止所有音乐
        this.stopAllMusic();
        if (this.m_loadings) {
            this.m_loadings.clear();
        }
    }
    /**
     * 设置背景音乐音量
     * @param  {number} volume
     */
    public setBGMValume(volume: number): void {
        egret.localStorage.setItem('soundBGM', volume.toString());
        this.m_BGMVolume = volume;
        let sounds: egret.Sound[] = this.m_curBGM.values;
        for (let i: number = 0, iLen: number = sounds.length; i < iLen; i++) {
            let sound: egret.Sound = sounds[i];
            if (sound) {
                let channel: egret.SoundChannel = this.m_channels.get(sound.hashCode);
                if (channel) {
                    channel.volume = this.m_musicEnable ? volume : 0;
                }
            }
        }
    }
    /**
     * 得到背景音乐音量
     * @returns number
     */
    public getBGMValue(): number {
        return this.m_BGMVolume;
    }
    /**
     * 设置音效音量
     * @param  {number} volume
     */
    public setEffectValume(volume: number): void {
        egret.localStorage.setItem('soundEffect', volume.toString());
        this.m_effectVolume = volume;
        let sounds: egret.Sound[] = this.m_curEffect.values;
        for (let i: number = 0, iLen: number = sounds.length; i < iLen; i++) {
            let sound: egret.Sound = sounds[i];
            if (sound) {
                let channel: egret.SoundChannel = this.m_channels.get(sound.hashCode);
                if (channel) {
                    channel.volume = this.m_effectEnable ? volume : 0;
                }
            }
        }
    }

    /**
     * 得到音效音量
     * @returns number
     */
    public getEffectValue(): number {
        return this.m_effectVolume;
    }

    /**
     * 开关音效
     * @param  {boolean} bool
     */
    public setEffectEnable(bool: boolean): void {
        this.m_effectEnable = bool;
        this.setEffectValume(this.m_effectVolume);
    }
    /**
     * 开关音乐
     * @param  {boolean} bool
     */
    public setMusicEnable(bool: boolean): void {
        this.m_musicEnable = bool;
        this.setBGMValume(this.m_BGMVolume);
    }
    /**
     * 检测ID是否播放
     * @param  {number} id
     */
    public isSoundPlaying(id: number): boolean {
        let sound: egret.Sound = this.m_sounds.get(id);
        if (sound) {
            let channel: egret.SoundChannel = this.m_channels.get(sound.hashCode);
            if (channel) {
                return true;
            }
        }
        return false;
    }
}

window["SoundUtils"] = SoundUtils