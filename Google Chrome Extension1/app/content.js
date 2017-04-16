var server = "http://localhost"



//解码
DATA = top.document.getElementsByTagName("body")[0].innerHTML.match(/var DATA.*\,/)[0].replace(/.*'(.*)'.*/, "$1");

function Base() {
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    this.decode = function(c) {
        var a = "",
            b, d, h, f, g, e = 0;
        for (c = c.replace(/[^A-Za-z0-9\+\/\=]/g, ""); e < c.length;) b = _keyStr.indexOf(c.charAt(e++)), d = _keyStr.indexOf(c.charAt(e++)), f = _keyStr.indexOf(c.charAt(e++)), g = _keyStr.indexOf(c.charAt(e++)), b = b << 2 | d >> 4, d = (d & 15) << 4 | f >> 2, h = (f & 3) << 6 | g, a += String.fromCharCode(b), 64 != f && (a += String.fromCharCode(d)), 64 != g && (a += String.fromCharCode(h));
        return a = _utf8_decode(a)
    };
    _utf8_decode = function(c) {
        for (var a = "", b = 0, d = c1 = c2 = 0; b < c.length;) d = c.charCodeAt(b), 128 > d ? (a += String.fromCharCode(d), b++) : 191 < d && 224 > d ? (c2 = c.charCodeAt(b + 1), a += String.fromCharCode((d & 31) << 6 | c2 & 63), b += 2) : (c2 = c.charCodeAt(b + 1), c3 = c.charCodeAt(b + 2), a += String.fromCharCode((d & 15) << 12 | (c2 & 63) << 6 | c3 & 63), b += 3);
        return a
    }
}
var B = new Base;
JsonText = B.decode(DATA.substring(1));
JSONS = eval("(" + JsonText + ")");


function Post(u, d) {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", u, true);
    //xmlhttp.open("GET",u,true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(d);
    //xmlhttp.send();
}

function Get(u, d = null, callback) {
    xmlhttp = new XMLHttpRequest();
    //xmlhttp.open("POST",u,true);
    if (d != null) {
        xmlhttp.open("GET", u + "?" + d, true);
    } else {
        xmlhttp.open("GET", u, true);
    }
    //xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    //xmlhttp.send(d);
    xmlhttp.onreadystatechange = callback;

    xmlhttp.send();
}


function Send(str) {
    //var data = "href=" + b64EncodeUnicode(window.location.href) + "&pass=" + document.getElementById("accessCode").value;
    //logPass(data);
    var data = "comic=" + b64EncodeUnicode(str);
    console.log(data);
    Post("http://localhost", data);
}


var mid = location.pathname.match(/\d+/)[0];
var cid = location.pathname.match(/\d+$/)[0];

//base64
//抄自https://developer.mozilla.org/zh-CN/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}

//贴吧盗链
//var bdCrackUrl = ""
var bdCrackUrl = "http://www.beihaiw.com/pic.php?url=";
//重画页面
function tCrack(datastr) {
    console.log(datastr);
    var data = datastr.match(/.{40}/g)
    //<html><head><title>Tx-Crack</title></head>
    var newHtml = "<body>";
    data.forEach(
        function(element) {
            var imgUrl = bdCrackUrl + "http://imgsrc.baidu.com/forum/pic/item/" + element + ".jpg";
            console.log(imgUrl);
            newHtml +=
                "<img class=\"pic\" width=100% src=\"" + imgUrl + "\"><\/img>";
        }
    )
    newHtml += "</body>";
    //</html>
    console.log(newHtml);
    document.getElementsByTagName("body")[0].innerHTML = newHtml;
}








/*
下面那行解析get参数的，(ctrl+c的时候就自带了版权声明...)
作者： 夏日星星
链接：http://www.imooc.com/article/3096
来源：慕课网
*/
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}


//判断是否需要破解或共享
console.log("mid=" + mid + ",cid=" + cid);
var gUrl = "https://raw.githubusercontent.com/ComicDatabase/ComicDatabase/master/" + mid + "/" + cid + ".list";
console.log(gUrl);
//alert(DATA.picture.length);

//if (DATA.picture.length <= 1)
if (JSONS.chapter.canRead !== true) {
    if (getQueryString("nocrack") != "1") {
        //需要购买
        console.log('need crack!');
        Get(gUrl, null,
            function() {
                if (xmlhttp.readyState == 4) {
                    var status = xmlhttp.status;
                    if (status >= 200 && status < 300) {
                        console.log("data is on github");
                        tCrack(xmlhttp.responseText);
                        //download comic
                    } else if (status == 404) {
                        console.log("data is not on github");
                        //没有，买吧
                        alert("我也没有，大佬买完给我一份吧");
                        //alert("暂未收录，共享功能开发中。")
                    } else {
                        console.log("github error");
                        //网络错误
                    }
                }
            }
        );
    } else {
        console.log('tx crack closed!');
    }
} else {
    //可以正常阅读
    console.log('comic load success!');
    Get(gUrl, null,
        function() {
            if (xmlhttp.readyState == 4) {
                var status = xmlhttp.status;
                if (status >= 200 && status < 300) {
                    console.log("data is on github");
                    //原服务器已有数据
                } else if (status == 404) {
                    console.log("data is not on github");
                    //没有这个漫画，大佬送给我一份
                    //Post(server,JsonText);
                    Send(JsonText);
                } else {
                    console.log("github error");
                    //网络错误
                }
            }
        }
    );
}




///////////////////////////////////////////////////////////////////
function goNext() {
    location.href = "http://ac.qq.com/ComicView/index/id/" + (DATA.comic.id) + "/cid/" + (DATA.chapter.nextCid) + "?fromPrev=1";
}

//自动翻页
if (!true) {
    if (JSONS.chapter.nextCid == 0) {
        alert("finish");
    } else {
        console.log('load next');
        //location.href="http://ac.qq.com/ComicView/index/id/"+(JSONS.comic.id)+"/cid/"+(JSONS.chapter.nextCid)+"?fromPrev=1";
        //window.open("http://ac.qq.com/ComicView/index/id/"+(JSONS.comic.id)+"/cid/"+(JSONS.chapter.nextCid)+"?fromPrev=1");
        //window.close();
        setTimeout(goNext, 2000);
    }
}
