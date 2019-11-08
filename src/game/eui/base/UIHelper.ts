class UIHelper {
	
	public static SetHead(comp: eui.Component, job: number, sex: number) {
		if (comp == null) {
			return
		}
		let face = comp["face"] as eui.Image
		if (face == null) {
			console.log("UIHelper.SetHead face == null")
			return
		}
		face.source = ResDataPath.GetHeadMiniImgName(job, sex)
	}

	public static SetHeadByHeadId(comp: eui.Component, headId: number) {
		if (comp == null) {
			return
		}
		let face = comp["face"] as eui.Image
		if (face == null) {
			console.log("UIHelper.SetHeadByHeadId face == null")
			return
		}
		face.source = headId ? ResDataPath.GetHeadMiniImgNameById(headId) : ""
	}

	public static ShowRedPoint(comp: egret.DisplayObject, isShow): void {
		if (!comp) {
			return
		}
		let redPoint: eui.Component = comp["redPoint"]
		if (redPoint == null) {
			let group: eui.Group = comp as any
			if (group) {
				redPoint = group.getChildByName("redPoint") as any
			}
		}
		if (!redPoint) {
            console.log("没有设置提示图标"+comp.name, comp.name)
			return
		}
		if(redPoint)
			redPoint.visible = isShow
	}

	public static SetBtnNormalEffe(btn: eui.Button, isShow: boolean) {
		let x = 57;
		let y = 6;
		let scalex = 1;
		let scaley = 1;
		let effeName = "eff_btn_orange"
		let eff = <MovieClip> btn.getChildByName(effeName)
		if (eff) {
			if (isShow) {
				eff.loadUrl(ResDataPath.GetUIEffePath(effeName), true, -1)	
			} else {
				DisplayUtils.removeFromParent(eff);
			}
		} else {
			if (isShow) {
				eff =  new MovieClip;
				eff.name = effeName
				eff.x = x;
				eff.y = y;
				eff.scaleX = scalex
				eff.scaleY = scaley
				btn.addChildAt(eff,1)
				eff.loadUrl(ResDataPath.GetUIEffePath(effeName), true, -1)	
			}
		}
	}

	public static SetBtn1aSkinEffe(btn: eui.Button, isShow: boolean) {
		let x = 40;//60
		let y = 17;//28;
		let scalex = 1;
		let scaley = 1;
		let effeName = "eff_btn_white"
		let eff = <MovieClip> btn.getChildByName(effeName)
		if (eff) {
			if (isShow) {
				eff.loadUrl(ResDataPath.GetUIEffePath(effeName), true, -1)	
			} else {
				DisplayUtils.removeFromParent(eff);
			}
		} else {
			if (isShow) {
				eff =  new MovieClip;
				eff.name = effeName
				eff.x = x;
				eff.y = y;
				eff.scaleX = scalex
				eff.scaleY = scaley
				btn.addChild(eff)
				eff.loadUrl(ResDataPath.GetUIEffePath(effeName), true, -1)	
			}
		}
	}

	public static SetBtnNormalScaleEffe(btn: eui.Button, isShow: boolean,scalex=1.1,scaley=1,x=50,y=17) {
		let effeName = "normalbtn1"
		let eff = <MovieClip> btn.getChildByName(effeName)
		if (eff) {
			if (isShow) {
				eff.loadUrl(ResDataPath.GetUIEffePath(effeName), true, -1)	
			} else {
				DisplayUtils.removeFromParent(eff);
			}
		} else {
			if (isShow) {
				eff =  new MovieClip;
				eff.name = effeName
				eff.x = x;
				eff.y = y;
				eff.scaleX = scalex
				eff.scaleY = scaley
				btn.addChild(eff)
				eff.loadUrl(ResDataPath.GetUIEffePath(effeName), true, -1)	
			}
		}
	}

	public static SetBtnEffe(btn: eui.Button, effeName: string, isShow: boolean, scalex: number = null, scaley: number = null, posX: number = null, posY: number = null, idx = null) {
		let eff = <MovieClip>btn.getChildByName(effeName)
		if (eff) {
			if (isShow) {
				eff.loadUrl(ResDataPath.GetUIEffePath(effeName), true, -1)	
			} else {
				DisplayUtils.removeFromParent(eff);
			}
		} else {
			if (isShow) {
				eff =  new MovieClip;
				eff.name = effeName
				if (idx == null) {
					btn.addChild(eff)
				} else
					btn.addChildAt(eff, idx)

				eff.loadUrl(ResDataPath.GetUIEffePath(effeName), true, -1)	
			}
		}
		if (eff && eff.parent) {
			if (scalex || scaley) {
				eff.scaleX = scalex || scaley	
				eff.scaleY = scaley || scalex	
			}
			eff.x = posX || 0
			eff.y = posY || 0
		}

	}

	public static SetIconMovie(target: egret.DisplayObject, startY: number = null) {
		if (!target) {
			return
		}
		startY = startY != null ? startY : target.y
		egret.Tween.removeTweens(target)
		var tween = egret.Tween.get(target, {loop: true});
		target.y = startY
		var y1 = startY + 20;
		var y2 = startY
		tween.to({ "y": y1 }, 1500).to({ "y": y2 }, 1500).call(()=>{
			egret.Tween.removeTweens(target);
		});
	}

	public static RemoveIconMovie(target: egret.DisplayObject) {
		egret.Tween.removeTweens(target)
	}

	public static SetBtnJumpEffe(btn: eui.Button, isShow: boolean) {
		let x = 27;
		let y = 7;
		let effeName = "eff_btn_gain"
		let eff = <MovieClip> btn.getChildByName(effeName)
		if (eff) {
			if (isShow) {
				eff.loadUrl(ResDataPath.GetUIEffePath(effeName), true, -1)	
			} else {
				DisplayUtils.removeFromParent(eff);
			}
		} else {
			if (isShow) {
				eff =  new MovieClip;
				eff.name = effeName
				eff.x = x;
				eff.y = y;
				btn.addChild(eff)
				eff.loadUrl(ResDataPath.GetUIEffePath(effeName), true, -1)	
			}
		}
	}

	public static SetCircleEffe(target, isShow, x = 32, y = 35, scalex = 1, scaley = 1, idx = null) {
		UIHelper.SetBtnEffe(target, "eff_main_icon02", isShow, scalex, scaley, x, y, idx)
	}

	public static ScrollHIndex(list: eui.List, leftIndex: number, itemWidth: number, listWidth?: number) {
		if (listWidth == null) {
			listWidth = list.width
		}
		list.validateNow()
		let offsetWidth = list.numElements * itemWidth - listWidth
		list.scrollH = Math.min(leftIndex * itemWidth, offsetWidth)
	}

	public static ScrollHRight(list: eui.List, itemWidth: number, listWidth?: number) {
		if (listWidth == null) {
			listWidth = list.width
		}
		list.scrollH = Math.min(list.numElements * itemWidth - listWidth, list.scrollH + listWidth)
	}

	public static ScrollHLeft(list: eui.List, listWidth?: number) {
		if (listWidth == null) {
			listWidth = list.width
		}
		list.scrollH = Math.max(0, list.scrollH - listWidth)
	}

	public static ScrollVIndex(list: eui.List, leftIndex: number, itemHeight: number, listHeight?: number) {
		if (listHeight == null) {
			listHeight = list.height
		}
		list.validateNow()
		let offsetHeight = list.numElements * itemHeight - listHeight
		list.scrollV = Math.min(leftIndex * itemHeight, offsetHeight)
	}
	public static ShowItemListEff(list: eui.List): void {
		if (list == null) {
			return
		}
		list.validateNow()
		for (let i = 0; i < list.numChildren; ++i) {
			let item = list.getChildAt(i) as ItemBase
			if (item && item.showItemEffect) {
				item.showItemEffect()
			}
		}
	}

	/** 设置链接样式文本 */
	public static SetLinkStyleLabel(label: eui.Label, text: string = null): void {
		label.textFlow = (new egret.HtmlTextParser).parser("<a href=\"event:\"><u>" + (text == null ? label.text : text) + "</u></a>");
	}

	/** 设置怪物的动画对象 */
	public static SetMonsterMc(mc: MovieClip, bossId: number): void {
		if (mc == null) {
			return
		}
		mc.scaleX = -1;
		var boss = GlobalConfig.monstersConfig[bossId];
		if (boss == null) {
			return
		}
		mc.loadUrl(ResDataPath.GetMonsterBodyPath(boss.avatar + "_3s"), true, -1);
	}
}
window["UIHelper"]=UIHelper