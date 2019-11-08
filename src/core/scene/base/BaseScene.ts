class BaseScene {
	_layers = new Array();

	/**
     * 进入Scene调用
     */
    public onEnter () {
    };
    /**
     * 退出Scene调用
     */
    public onExit () {
        ViewManager.ins().closeAll();
        this.removeAllLayer();
    };
    /**
     * 添加一个Layer到舞台
     * @param layer
     */
    public addLayer (layer) {
        if (layer instanceof BaseSpriteLayer) {
            StageUtils.ins().getStage().addChild(layer);
            this._layers.push(layer);
        }
        else if (layer instanceof BaseEuiLayer) {
            StageUtils.ins().getUIStage().addChild(layer);
            this._layers.push(layer);
        }
    };
    /**
     * 添加一个Layer到舞台
     * @param layer
     */
    public addLayerAt (layer, index) {
        if (layer instanceof BaseSpriteLayer) {
            StageUtils.ins().getStage().addChildAt(layer, index);
            this._layers.push(layer);
        }
        else if (layer instanceof BaseEuiLayer) {
            StageUtils.ins().getUIStage().addChildAt(layer, index);
            this._layers.push(layer);
        }
    };
    /**
     * 在舞台移除一个Layer
     * @param layer
     */
    public removeLayer (layer) {
        if (layer instanceof BaseSpriteLayer) {
            StageUtils.ins().getStage().removeChild(layer);
            this._layers.splice(this._layers.indexOf(layer), 1);
        }
        else if (layer instanceof BaseEuiLayer) {
            StageUtils.ins().getUIStage().removeChild(layer);
            this._layers.splice(this._layers.indexOf(layer), 1);
        }
    };
    /**
     * Layer中移除所有
     * @param layer
     */
    public layerRemoveAllChild (layer) {
        if (layer instanceof BaseSpriteLayer) {
            layer.removeChildren();
        }
        else if (layer instanceof BaseEuiLayer) {
            layer.removeChildren();
        }
    };
    /**
     * 移除所有Layer
     */
    public removeAllLayer () {
        while (this._layers.length) {
            var layer = this._layers[0];
            this.layerRemoveAllChild(layer);
            this.removeLayer(layer);
        }
    };
}
window["BaseScene"]=BaseScene