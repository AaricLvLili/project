class Color {
    /**白色*/
    public static readonly White = 0xFFFFFF
    public static readonly WhiteStroke = 0x1b1b1b;

    /**绿色*/
    public static readonly Green = 0x008f22
    public static readonly GreenTips = 0x008f22
    public static readonly GreenStroke = 0x004e06;
    /**蓝色*/
    public static readonly Blue = 0x4c78db
    // 4C78BD
    public static readonly BlueTips = 0x4c78db
    public static readonly BlueStroke = 0x0000a8;
    /**紫色*/
    public static readonly Purple = 0xb454eb
    public static readonly PurpleTips = 0xb454eb;
    public static readonly PurpleStroke = 0x2b0044;
    /**橙色*/
    public static readonly Orange = 0xac4d00
    public static readonly OrangeTips = 0xac4d00;
    public static readonly OrangeStroke = 0x7b0900;
    /**红色*/
    public static readonly Red = 0xf87372
    public static readonly RedTips = 0xf87372
    public static readonly RedStroke = 0x5d0000;
    /**黄色*/
    public static readonly Yellow = 0xbf7d00
    public static readonly YellowTips = 0xbf7d00
    public static readonly YellowStroke = 0xaa3800
    /**黑色*/
    public static readonly Black = 0x535557
    /**灰色*/
    public static readonly Gray = 0x787878
    /**通用基础文字色调 */
    public static readonly FontColor = 0x3b3b3b

    public static readonly needOrange = 0xCA8000
    public static ColorStr = [
        "16777215",
        "5372423",
        "3264255",
        "13855983",
        "16754432",
        "16714752",
        "16580379",
    ]

    public static ColorStroke = [
        Color.WhiteStroke,
        Color.GreenStroke,
        Color.BlueStroke,
        Color.PurpleStroke,
        Color.OrangeStroke,
        Color.RedStroke,
        Color.YellowStroke,
    ]
}

window["Color"] = Color