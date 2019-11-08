/**

 * 场景切换特效类

 * by skave

 * (c) copyright 2018 - 2035

 * All Rights Reserved. 

//切换场景的特效

//1.卷帘特效

//2.左右切换移动

//3.直接翻

//4.旋转掉落

//5.随机一种

 */

module ScreenMovies {

    //当前舞台

    export function MovieStart(_txnums) {

        //创建一个截图Bitmap
        var taget = StageUtils.ins().getUIStage();
        var w = StageUtils.ins().getWidth();
        var h = StageUtils.ins().getHeight();

        //新建一个group
        var loadTxGrp = new eui.Group();
        loadTxGrp.width = w;
        loadTxGrp.height = h;
        taget.addChild(loadTxGrp)

        //循环创建多个截图bitmap 这里num自由设置
        var tx1Number = 40;
        //每个横着的数量
        var Xnumber = 5;
        //高数量自动计算
        var Ynumber = tx1Number / Xnumber;
        for (var i = 0; i < tx1Number; i++) {
            //计算每个的XY及宽高
            var _mcW = w / Xnumber;
            var _mcH = h / Ynumber;
            var _mcX = i % Xnumber * _mcW;
            var _mcY = Math.floor(i / Xnumber) * _mcH;

            var renderTexture: egret.RenderTexture = new egret.RenderTexture();
            var mypic = renderTexture.drawToTexture(taget, new egret.Rectangle(_mcX, _mcY, _mcW, _mcH));
            var bmp = new egret.Bitmap;
            bmp.texture = renderTexture;
            bmp.anchorOffsetX = _mcW / 2
            bmp.anchorOffsetY = _mcH / 2
            bmp.x = _mcX + _mcW / 2;
            bmp.y = _mcY + _mcH / 2;
            loadTxGrp.addChild(bmp);

            if (_txnums == 5) {
                _txnums = Math.ceil(Math.random() * 4)
            }

            //开始特效
            switch (_txnums) {
                case 1:
                    var tw = egret.Tween.get(bmp);
                    tw.to({ scaleX: 0, scaleY: 0, alpha: 0, rotation: 359 }, 800, egret.Ease.circIn).call(onComplete, this, [bmp]);
                    break;
                case 2:
                    var my_x = -w
                    if (!(i % 2)) {
                        my_x = w * 2;
                    }
                    var tw = egret.Tween.get(bmp);
                    tw.to({ x: my_x, alpha: 0 }, 800, egret.Ease.circIn).call(onComplete, this, [bmp]);
                    break;
                case 3:
                    var tw = egret.Tween.get(bmp);
                    tw.to({ scaleX: 0.2, scaleY: 1, alpha: 0, blurFliter: 0 }, 800, egret.Ease.backInOut).call(onComplete, this, [bmp]);
                    break;
                case 4:
                    var tw = egret.Tween.get(bmp);
                    tw.to({ alpha: 0 }, 900, egret.Ease.circIn).call(onComplete, this, [bmp]);
                    break;
                default:
                    var tw = egret.Tween.get(bmp);
                    tw.to({ scaleX: 1, scaleY: 0, alpha: 0 }, 800, egret.Ease.circIn).call(onComplete, this, [bmp]);
            }
        }

        var upNumber = 0;
        function onComplete(evt: egret.Bitmap) {
            egret.Tween.removeTweens(evt);
            upNumber++
            if (upNumber == tx1Number) {
                taget.removeChild(loadTxGrp);

                while (loadTxGrp.$children.length) {
                    bmp = <egret.Bitmap>loadTxGrp.$children.pop();//[loadTxGrp.$children.length - 1];
                    bmp.texture.dispose();
                    bmp.texture = null;
                    bmp = null;
                }
            }
        }

    }

    export function av(num: Number = -1): void {
        //创建一个截图Bitmap
        var taget = StageUtils.ins().getUIStage();
        var w = StageUtils.ins().getWidth();
        var h = StageUtils.ins().getHeight();

        //新建一个group
        var loadTxGrp = new eui.Group();
        loadTxGrp.width = w;
        loadTxGrp.height = h;
        taget.addChild(loadTxGrp)

        var renderTexture: egret.RenderTexture = new egret.RenderTexture();
        renderTexture.drawToTexture(taget, new egret.Rectangle(0, 0, w, h));
        var bmp = new egret.Bitmap;
        bmp.texture = renderTexture;
        loadTxGrp.addChild(bmp);

        let vertexSrc =
            "attribute vec2 aVertexPosition;\n" +
            "attribute vec2 aTextureCoord;\n" +
            "attribute vec2 aColor;\n" +

            "uniform vec2 projectionVector;\n" +

            "varying vec2 vTextureCoord;\n" +
            "varying vec4 vColor;\n" +

            "const vec2 center = vec2(-1.0, 1.0);\n" +

            "void main(void) {\n" +
            "   gl_Position = vec4( (aVertexPosition / projectionVector) + center , 0.0, 1.0);\n" +
            "   vTextureCoord = aTextureCoord;\n" +
            "   vColor = vec4(aColor.x, aColor.x, aColor.x, aColor.x);\n" +
            "}";
        let fragmentSrc1 =
            "precision lowp float;\n" +
            "varying vec2 vTextureCoord;\n" +
            "varying vec4 vColor;\n" +
            "uniform sampler2D uSampler;\n" +

            "uniform float customUniform;\n" +

            "void main(void) {\n" +
            "vec2 uvs = vTextureCoord.xy;\n" +
            "vec4 fg = texture2D(uSampler, vTextureCoord);\n" +
            "fg.rgb += sin(customUniform + uvs.x * 2. + uvs.y * 2.) * 0.2;\n" +
            "gl_FragColor = fg * vColor;\n" +
            "}";



        var fragmentSrc2 = [
            "precision lowp float;",

            "varying vec2 vTextureCoord;",
            // "varying vec4 vColor;",

            "uniform float time;",
            "uniform sampler2D uSampler;",

            "void main() {",
            "vec3 p = (vec3(vTextureCoord.xy,.0) - 0.5) * abs(sin(time/10.0)) * 50.0;",
            "float d = sin(length(p)+time), a = sin(mod(atan(p.y, p.x) + time + sin(d+time), 3.1416/3.)*3.), v = a + d, m = sin(length(p)*4.0-a+time);",
            "float _r = -v*sin(m*sin(-d)+time*.1);",
            "float _g = v*m*sin(tan(sin(-a))*sin(-a*3.)*3.+time*.5);",
            "float _b = mod(v,m);",
            "float _a = 1.0;",
            "if(_r < 0.1 && _g < 0.1 && _b < 0.1) {",
            "_a = 0.0;",
            "}",
            "gl_FragColor = vec4(_r * _a, _g * _a, _b * _a, _a);",
            "}"
        ].join("\n");

        let fragmentSrc3 = [
            "precision lowp float;\n" +
            "varying vec2 vTextureCoord;",
            "varying vec4 vColor;\n",
            "uniform sampler2D uSampler;",

            "uniform vec2 center;",
            "uniform vec3 params;", // 10.0, 0.8, 0.1"
            "uniform float time;",

            "void main()",
            "{",
            "vec2 uv = vTextureCoord.xy;",
            "vec2 texCoord = uv;",

            "float dist = distance(uv, center);",

            "if ( (dist <= (time + params.z)) && (dist >= (time - params.z)) )",
            "{",
            "float diff = (dist - time);",
            "float powDiff = 1.0 - pow(abs(diff*params.x), params.y);",

            "float diffTime = diff  * powDiff;",
            "vec2 diffUV = normalize(uv - center);",
            "texCoord = uv + (diffUV * diffTime);",
            "}",

            "gl_FragColor = texture2D(uSampler, texCoord);",
            "}"
        ].join("\n");

        let fragmentSrc4 = [
            "precision lowp float;\n" +
            "varying vec2 vTextureCoord;",
            "varying vec4 vColor;\n",
            "uniform sampler2D uSampler;",

            "uniform float lineWidth;",
            "uniform float offset;",

            "void main()",
            "{",
            "vec2 uv = vTextureCoord.xy;",
            "vec2 texCoord = uv;",

            "float modPart = mod(vTextureCoord.y, lineWidth);",
            "float solidPart = (1.0 - offset) * lineWidth;",

            "if(modPart > solidPart) {",
            "gl_FragColor = texture2D(uSampler, texCoord);",
            "} else {",
            "gl_FragColor = vec4(0., 0., 0., 0.);",
            "}",


            "}"
        ].join("\n");


        let customFilter1 = new egret.CustomFilter(
            vertexSrc,
            fragmentSrc1,
            {
                customUniform: 0
            }
        );

        let customFilter2 = new egret.CustomFilter(
            vertexSrc,
            fragmentSrc2,
            {
                time: 0
            }
        );

        let customFilter3 = new egret.CustomFilter(
            vertexSrc,
            fragmentSrc3,
            {
                center: { x: 0.5, y: 0.5 },
                params: { x: 10, y: 0.8, z: 0.1 },
                time: 0
            }
        );

        let customFilter4 = new egret.CustomFilter(
            vertexSrc,
            fragmentSrc4,
            {
                lineWidth: 0.1,
                offset: 0
            }
        );

        var arr: Array<egret.CustomFilter> = [null, customFilter1, customFilter2, customFilter3, customFilter4];

        var type: number;
        if (num == -1) {
            type = Math.ceil(Math.random() * 4);
        }
        bmp.filters = [arr[type]];
        bmp.addEventListener(egret.Event.ENTER_FRAME, bmpEnterFrame, this);

        function bmpEnterFrame(e: egret.Event): void {
            if (type == 1) {
                customFilter1.uniforms.customUniform += 0.1;
                if (customFilter1.uniforms.customUniform > Math.PI * 2) {
                    customFilter1.uniforms.customUniform = 0.0;
                    destroy(bmp, loadTxGrp);
                }
            }
            else if (type == 2) {
                customFilter2.uniforms.time += 0.008;
                if (customFilter2.uniforms.time > 1) {
                    customFilter2.uniforms.time = 0.0;
                    destroy(bmp, loadTxGrp);
                }
            }
            else if (type == 3) {
                customFilter3.uniforms.time += 0.01;
                if (customFilter3.uniforms.time > 1) {
                    customFilter3.uniforms.time = 0.0;
                    destroy(bmp, loadTxGrp);
                }
            }
            else if (type == 4) {
                customFilter4.uniforms.offset += 0.01;
                if (customFilter4.uniforms.offset > 1) {
                    customFilter4.uniforms.offset = 0.0;
                    destroy(bmp, loadTxGrp);
                }
            }
        }
        function destroy(bmp: egret.Bitmap, grp: eui.Group): void {
            bmp.removeEventListener(egret.Event.ENTER_FRAME, bmpEnterFrame, this);
            bmp.texture.dispose();
            if (bmp.parent) {
                bmp.parent.removeChild(bmp);
            }
            bmp = null;
            if (grp.parent)
                grp.parent.removeChild(grp);
            grp = null;
        }
    }
} 