/*
    侧边栏
    修改之后要重启服务
*/

/* 第一种 */
// module.exports = "auto";

/* 第二种 */
// module.exports = [
//     "/",
//     "/about/",
//     // 如果你想要显示地指定链接的文字，使用一个格式为 [link, text] 的数组
//     ["/guide/", "显示地指定链接的文字"]
// ];

module.exports = {
	"/guide/": [
		"",     /* /guide/ */
		{
            title: "指南",
            collapsable: false,
            children: [
				"typescript-tooling-in-5-minutes",  /* /guide/typescript-tooling-in-5-minutes.html */
            ]
        }
	],
	"/get-started/": [
		"",
		{
            title: "基本类型",
            collapsable: false,
            children: [
				"reshape-type-thinking",
				"basic-type",
				"enums-type",
				"interface-type",
				"function-type",
				"class-type",
				"generic-type",
				"type-check-mechanism",
				"advance-type",
            ]
        }
	],
	"/framework/": [
		{
            title: "框架",
            collapsable: false,
            children: [
				"",
            ]
        },
		{
            title: "React",
            collapsable: false,
            children: [
                "React/setup-ts-with-react",
				"React/function-hooks",
				"React/class-component",
				"React/type-component-props",
            ]
        },
		{
            title: "Vue",
            collapsable: false,
            children: [
				"Vue/vue-typeScript",
            ]
        },
		{
            title: "小程序",
            collapsable: false,
            children: [
				"miniprogram/miniprogram-ts",
            ]
        }
    ],
    "/front-end/": [
		{
            title: "前端技术",
            collapsable: false,
            children: [
				"",
            ]
        },
        {
            title: "前端组件化方案",
            collapsable: false,
            children: [
				"web-components",
            ]
        }
	],
    "/advance/": [
        {
            title: "TS 高级篇",
            collapsable: false,
            children: [
				"utility-types",
            ]
        }
	],
    "/translate/": [
        {
            title: "翻译篇",
            collapsable: false,
            children: [
				"image-rendering",
            ]
        }
	]
};

/* 第三种，分组 */