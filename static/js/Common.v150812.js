var YgmJsCommon = {};
//Common.popups为弹框;
YgmJsCommon.popups = {};
//Common.domain = "yiguo.com";
YgmJsCommon.domain = "";
YgmJsCommon.CookieKey_Ygm_Cart = "ygm_cart";
YgmJsCommon.CookieKey_Ygm_City = "ygm_city";
/*
*    说明：获取页面间拼接的参数
*    参数：s：        document.location.href
*          k：        拼接的参数名
*/
YgmJsCommon.queryString = function (s, key) {
    var val = null;
    var hashes = s.slice(s.indexOf('?') + 1).split('&');
    var index;
    for (var i = 0; i < hashes.length; i++) {
        index = hashes[i].indexOf("=");
        if (index > 0) {
            if (hashes[i].substring(0, index) == key) {
                val = hashes[i].substring(index + 1, hashes[i].length);
                break;
            }
        }
    }
    return val;
}

//写cookie
YgmJsCommon.setCookie = function (cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    var path = "path=/;";
    if (YgmJsCommon.domain != null && YgmJsCommon.domain != "") {
        path += "domain=" + YgmJsCommon.domain;
    }
    document.cookie = cname + "=" + cvalue + "; " + expires + "; " + path;
}

//获取cookie
YgmJsCommon.getCookie = function (cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return decodeURIComponent(c.substring(name.length, c.length));
    }
    return "";
}

//清除cookie  
YgmJsCommon.clearCookie = function (cname) {
    YgmJsCommon.setCookie(cname, "", -1);
}

//清空购物车商品
YgmJsCommon.clearCartProducts = function () {
    var strYgmCart = YgmJsCommon.getCookie(YgmJsCommon.CookieKey_Ygm_Cart);
    var objYgmCart = $.parseJSON(strYgmCart);
    if (objYgmCart) {
        objYgmCart.Commoditys = [];
        YgmJsCommon.clearCookie(YgmJsCommon.CookieKey_Ygm_Cart);
        YgmJsCommon.setCookie(YgmJsCommon.CookieKey_Ygm_Cart, JSON.stringify(objYgmCart), 180);
    }
}

//获取购物车商品
YgmJsCommon.getCartProducts = function () {
//    var strYgmCart = YgmJsCommon.getCookie(YgmJsCommon.CookieKey_Ygm_Cart);
//    var objYgmCart = JSON.parse(strYgmCart);
//    if (objYgmCart) {
//        return objYgmCart.Commoditys;
//    }
//    return null;
}

//获取购物车商品总数量
YgmJsCommon.getCartProductsTotalCount = function () {
    var totalCount = 0;
    var commoditys = YgmJsCommon.getCartProducts();
    if (commoditys != null && commoditys != undefined && commoditys != "") {
        for (var i = 0; i < commoditys.length; i++) {
            var amount = commoditys[i].Amount;
            totalCount += amount;
        }
    }
    return totalCount;
}

//获取某个商品数量
YgmJsCommon.getCartProductAmountById = function (id) {
    var strYgmCart = YgmJsCommon.getCookie(YgmJsCommon.CookieKey_Ygm_Cart);
    var objYgmCart = JSON.parse(strYgmCart);
    if (objYgmCart) {
        var commoditys = objYgmCart.Commoditys;
        for (var i = 0; i < commoditys.length; i++) {
            if (commoditys[i].Id == id) {
                return commoditys[i].Amount;
            }
        }
    }
    return 0;
}

/*
*    说明：更新购物车商品(包括添加，修改)
*    参数：commodity：商品对象（var commodity = {};
                commodity.Id = '3';
                commodity.Code = '1qw';
                commodity.Amount = 5;
                commodity.GId = '1';）
                flag为“1”表示添加一个该商品，“2”表示减少一个该商品,“3”表示在原先数量上加上新的数量商品
*         
*/
YgmJsCommon.updateCartProcuct = function (commodity, flag) {
    var strYgmCart = YgmJsCommon.getCookie(YgmJsCommon.CookieKey_Ygm_Cart);
    var objYgmCart = JSON.parse(strYgmCart);
    if (objYgmCart) {
        var commoditys = objYgmCart.Commoditys;
        var index = -1;
        try {
            for (var i = 0; i < commoditys.length; i++) {
                if (commoditys[i].Id == commodity.Id) {
                    index = i;
                    break;
                }
            }

            if (index == -1) {
                if (commodity.Amount <= 0) {
                    commodity.Amount = 1;
                }
                commoditys.push(commodity);
            }
            else {
                if (flag == 1) {
                    commodity.Amount = commoditys[index].Amount + 1;
                }
                else if (flag == 2) {
                    commodity.Amount = commoditys[index].Amount - 1;
                }
                else if (flag == 3) {
                    commodity.Amount = commoditys[index].Amount + commodity.Amount;
                }
                commoditys.splice(index, 1, commodity);
            }
        }
        catch (e) {
            alert("添加购物车失败1:" + e.message);
            return false;
        }

        //验证商品对象是否有效合法
        if (commodity != undefined && commodity != null && commodity != "") {
            if (commodity.Id != null && commodity.Id != "" && commodity.Code != null && commodity.Code != "" && commodity.Amount > 0 && commodity.GId != undefined && commodity.GId != null) {
                objYgmCart.Commoditys = commoditys;
                YgmJsCommon.clearCookie(YgmJsCommon.CookieKey_Ygm_Cart);
                YgmJsCommon.setCookie(YgmJsCommon.CookieKey_Ygm_Cart, JSON.stringify(objYgmCart), 180);
            }
            else {
                alert("添加购物车失败2");
                return false;
            }
        }
        else {
            alert("添加购物车失败3");
            return false;
        }
        return true;
    }
}

/*
*    说明：删除购物车商品
*    参数：id：       商品id
*/
YgmJsCommon.delCartProcuct = function (id) {
    var strYgmCart = YgmJsCommon.getCookie(YgmJsCommon.CookieKey_Ygm_Cart);
    var objYgmCart = $.parseJSON(strYgmCart);
    if (objYgmCart) {
        var commoditys = objYgmCart.Commoditys;
        for (var i = 0; i < commoditys.length; i++) {
            if (commoditys[i].Id == id) {
                commoditys.splice(i, 1);
            }
        }
        objYgmCart.Commoditys = commoditys;
        YgmJsCommon.clearCookie(YgmJsCommon.CookieKey_Ygm_Cart);
        YgmJsCommon.setCookie(YgmJsCommon.CookieKey_Ygm_Cart, JSON.stringify(objYgmCart), 180);
    }
}

//提示框
YgmJsCommon.popups.alert = function (msg, okCallback) {
    layer.open({
        content: msg,
        style: 'text-align: center;',
        btn: ['确定'],
        shadeClose: true,
        yes: function () {
            if (okCallback != null && okCallback != "") {
                okCallback();
            }
            YgmJsCommon.popups.close();
        }
    });

}

//确认框
YgmJsCommon.popups.confirm = function (msg, okCallback) {
    layer.open({
        content: msg,
        style: 'text-align: center;',
        btn: ['确认', '取消'],
        shadeClose: false,
        yes: function () {
            if (okCallback != null) {
                okCallback();
            }
            YgmJsCommon.popups.close();
        }, no: function () {

        }
    });
}

//加载框
YgmJsCommon.popups.loading = function () {
    layer.open({
        type: 2,
        content: '加载中...',
        shadeClose: false
    });
}

//信息框
YgmJsCommon.popups.tag = function (msg, timer, callback) {
    var t = 2;
    if (timer != null || timer != undefined) {
        t = timer;
    }
    layer.open({
        content: msg,
        style: ' background-color: rgba(0,0,0,0.7); color:#fff; border:none;text-align: center;',
        time: t,
        shade: false,
    });
    setTimeout(function () {
        if (callback != null) {
            callback();
        }
    }, 1000);

}


//关闭弹框
YgmJsCommon.popups.close = function () {
    layer.closeAll();
}

YgmJsCommon.resizeImage = function (id, destWidth, destHeight) {//上传图片等比自动调整大小  参数(id, destWidth:目标宽度,   destHeight:目标高度)  注：必须在img标签的load事件中绑定该方法
    var imgD = $("#" + id);
    if (imgD.length == 0 || imgD.attr("src") == "")
        return;

    /*获取图片的大小*/
    var imgSize = { x: 0, y: 0 };
    var img = new Image();
    img.src = imgD.attr("src");
    if (img.complete) { // 如果图片已经存在于浏览器缓存, 直接回调  
        imgSize.x = img.width;
        imgSize.y = img.height;
    } else {
        img.onload = function () {
            if (!img.complete) return;
            imgSize.x = img.width;
            imgSize.y = img.height;
        }
    }

    /*等比调整图片大小*/
    //destWidth = destWidth == 0 ? 400 : destWidth;
    var ratio;
    var srcWidth = imgSize.x;
    var srcHeight = imgSize.y;
    var newWidth = 0;
    var newHeight = 0;

    if (destWidth >= srcWidth && destHeight >= srcHeight) {
        newWidth = srcWidth;
        newHeight = srcHeight;
    }
    else {
        if (srcWidth > srcHeight) {
            ratio = destWidth / srcWidth;
            newWidth = destWidth;
            newHeight = srcWidth * ratio;

            // 当缩略图不为正方形时
            if (newHeight > destHeight) {
                ratio = srcWidth / srcHeight;
                newHeight = destHeight;
                newWidth = destHeight * ratio;
            }
            if (newWidth > destWidth) {
                ratio = srcHeight / srcWidth;
                newWidth = destWidth;
                newHeight = destWidth * ratio;
            }
        }
        else {
            ratio = destHeight / srcHeight;
            newHeight = destHeight;
            newWidth = srcWidth * ratio;

            // 当缩略图不为正方形时
            if (newWidth > destWidth) {
                ratio = srcHeight / srcWidth;
                newWidth = destWidth;
                newHeight = destWidth * ratio;
            }
            if (newHeight > destHeight) {
                ratio = srcWidth / srcHeight;
                newHeight = destHeight;
                newWidth = destHeight * ratio;
            }
        }
    }

    imgD.width(newWidth); // 设定实际显示宽度
    imgD.height(newHeight);   // 设定实际显示高度
    return { width: newWidth, height: newHeight };
}


//获取本地存储的Cookie城市对象ygm_city
YgmJsCommon.getCityCookie = function () {
    var strYgmCity = YgmJsCommon.getCookie(YgmJsCommon.CookieKey_Ygm_City);
    if (strYgmCity != null && strYgmCity != "") {
        var objYgmCity = $.parseJSON(strYgmCity);
        if (objYgmCity && objYgmCity != null && objYgmCity != undefined) {
            return objYgmCity;
        }
    }
    return null;
}

//修改本地存储的Cookie城市对象ygm_city
YgmJsCommon.updateCityCookie = function (newYgmCity) {
    var objYgmCity = YgmJsCommon.getCityCookie();
    if (objYgmCity != null && newYgmCity != null && newYgmCity != undefined) {
        YgmJsCommon.clearCookie(YgmJsCommon.CookieKey_Ygm_City);
        YgmJsCommon.setCookie(YgmJsCommon.CookieKey_Ygm_City, JSON.stringify(newYgmCity), 180);
    }
}
