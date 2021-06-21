/*
 * @Description: In User Settings Edit
 * @Author: LXW🥳
 * @Date: 2021-05-10 01:14:10
 * @LastEditors: LXW👻
 * @LastEditTime: 2021-06-21 17:12:01
 */
const sidebar = require("./config/sidebar");
module.exports = {
	base: "/learn-ts-vuepress/",
	// 嵌套的标题链接深度 1-2 默认1
	sidebarDepth: 2,
	title: "杉数科技",
	description: "Learn TypeScript",
	markdown: {
		lineNumbers: true, // 代码行号
	},
	themeConfig: {
		// 导航栏 Logo
		logo: "/assets/favicon.ico",
		// 导航栏
		nav: [
			{ text: "指南", link: "/guide/" },
			{ text: "入门", link: "/get-started/" },
			{ text: "高级", link: "/advance/" },
			{ text: "翻译", link: "/translate/" },
			{ text: "框架", link: "/framework/" },
			{ text: "前端技术", link: "/front-end/" },
			{ text: 'External', link: "https://github.com/condorheroblog/learn-ts-vuepress" },
		],
		// 侧边栏
		sidebar,
		// 最后更新时间
		lastUpdated: "上次更新",
		// 页面滚动
		smoothScroll: true,
	},
	// 添加自定义 icon
	head: [
		["link", { rel: "icon", href: "/assets/favicon.ico" }]
	],
	// 开启默认搜索
	search: true,
	// 搜索最多展示 10 条
    searchMaxSuggestions: 10
}