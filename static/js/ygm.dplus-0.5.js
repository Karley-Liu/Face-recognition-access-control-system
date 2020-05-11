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

//**********************************//
// YgmDplus 广告跟踪
//**********************************//
YgmDplus.getAdTrack = function () {

    var adTrack = {};
    adTrack.UtmSource = "";
    adTrack.UtmMedium = "";
    adTrack.UtmTerm = "";
    adTrack.UtmContent = "";
    adTrack.UtmCampaign = "";

    try {
        adTrack.UtmSource = YgmDplus.nullToEmpty(dplus.get_property("utm_source"));
        adTrack.UtmMedium = YgmDplus.nullToEmpty(dplus.get_property("utm_medium"));
        adTrack.UtmTerm = YgmDplus.nullToEmpty(dplus.get_property("utm_term"));
        adTrack.UtmContent = YgmDplus.nullToEmpty(dplus.get_property("utm_content"));
        adTrack.UtmCampaign = YgmDplus.nullToEmpty(dplus.get_property("utm_campaign"));
    }
    catch (e) {
        adTrack.UtmSource = "";
        adTrack.UtmMedium = "";
        adTrack.UtmTerm = "";
        adTrack.UtmContent = "";
        adTrack.UtmCampaign = "";
    }

    return adTrack;
}

//**********************************//
// YgmDplus 空对象转为空白字符串
//**********************************//
YgmDplus.nullToEmpty = function (s) {
    if (s == null || typeof (s) == "undefined") {
        return "";
    }
    return s;
}