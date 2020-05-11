/**
* 
*   易果移动网站 dplus 
*
*/
var YgmDplus = {};

//**********************************//
// YgmDplus 初始化
// 参数:
//      websitName   网站名称
//      groupName    功能组名
//      pageName     页面名称
//**********************************//
YgmDplus.init = function (websiteName, groupName, pageName) {

    if (pageName == null || (typeof (pageName) == "undefined") || pageName == "") {
        pageName = window.document.title;
    }

    // 注册超级属性
    dplus.register({ "ygm_website": websiteName });
    dplus.register({ "ygm_group": groupName });
    dplus.register({ "ygm_title": pageName });
    dplus.register({ "ygm_host": window.location.host });

    // PV
    dplus.track("PV");
}