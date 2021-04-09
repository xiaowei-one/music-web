import { md5 } from "../js/md5.js";
import { url as url_resources } from "./url.js";

//登陆模块
let nav = document.querySelector('.nav');
let login_part = document.querySelector(".login");
let login_mask = document.querySelector(".login_mask");
let tel = document.querySelector(".tel input");
let pwd = document.querySelector(".pwd input");
let login_btn = document.querySelector(".login_btn");
let tip = login_part.querySelector("h2");

//导航点击部分背景切换
let as = nav.querySelectorAll("a");
let lis = nav.querySelectorAll("li");

as.forEach((e, index) => {
    if (lis[index].className.indexOf("nav_click") == -1 && index != 0) {
        e.addEventListener("mouseover", function () {
            this.style.color = "#19BF75";
            e.addEventListener("mouseout", function () {
                this.style.color = '#000000';
            });
        });
    }
});

axios.get(url_resources + "/login/status?time=" + new Date().getTime()).then(function (resp) {
    localStorage.setItem("userId", resp.data.profile.userId);
    let head_portrait = document.createElement("li");
    let head_img = document.createElement("img");
    let cancellation = document.createElement("a");
    head_portrait.className = "flex1";
    head_portrait.id = "cancellation";
    head_img.src = resp.data.profile.avatarUrl + "?param=150y150";
    cancellation.innerHTML = "注销";
    cancellation.href = "javascript:;";

    let profile = {
        user_id: resp.data.profile.userId,
        user_img: resp.data.profile.avatarUrl,
        user_nickname: resp.data.profile.nickname,
        user_fans: resp.data.profile.followeds,
        user_follow: resp.data.profile.follows,
        cookies: resp.data.cookie,

    }
    localStorage.setItem("user_profile", JSON.stringify(profile));
    cancellation.onclick = function () {
        axios.get(url_resources + "/logout").then(function (resp) {
            console.log(resp);
            if (resp.data.code == 200) {
                alert("注销成功");
                nav.removeChild(head_portrait);
                let login = document.createElement('li');
                let login_a = document.createElement('a');
                login.className = "flex1";
                login_a.href = "javascript:;";
                login_a.id = "login";
                login_a.innerHTML = "登陆";
                login_a.onclick = function () {
                    login_part.style.visibility = "visible";
                    login_mask.style.visibility = "visible";
                }
                login.onclick = function () {
                    login_part.style.visibility = "visible";
                    login_mask.style.visibility = "visible";
                };

                login_mask.onclick = function () {
                    login_part.style.visibility = "hidden";
                    login_mask.style.visibility = "hidden";
                };
                login.appendChild(login_a);
                nav.appendChild(login);
            } else {
                alert("服务器出错,请稍后再试!");
            }
        }, function (err) { console.log(err); });
    }

    head_portrait.style.borderRadius = "50%";
    head_portrait.onmouseenter = function () {
        cancellation.style.visibility = "visible";
        head_portrait.onmouseleave = function () {
            cancellation.style.visibility = "hidden";
        }
    };
    head_portrait.appendChild(head_img);
    head_portrait.appendChild(cancellation);
    nav.appendChild(head_portrait);
}, function (err) {
    let login = document.createElement('li');
    let login_a = document.createElement('a');
    login.className = "flex1";
    login_a.href = "javascript:;";
    login_a.id = "login";
    login_a.innerHTML = "登陆";
    login_a.onclick = function () {
        login_part.style.visibility = "visible";
        login_mask.style.visibility = "visible";
    }
    login.appendChild(login_a);
    nav.appendChild(login);
    console.log(err);
})

login_mask.onclick = function () {
    login_part.style.visibility = "hidden";
    login_mask.style.visibility = "hidden";
};

login_btn.onclick = function () {
    let rex = /^1[0-9]{10}$/;
    if (rex.test(tel.value)) {
        let hash = md5(pwd.value.toString());
        axios.get(url_resources + `/login/cellphone?phone=${tel.value}&md5_password=${hash}`)
            .then(function (resp) {
                console.log(resp);
                if (resp.data.code == 200) {
                    let login_id = document.querySelector("#login");
                    nav.removeChild(login_id.parentElement);
                    let head_portrait = document.createElement("li");
                    let head_img = document.createElement("img");
                    let cancellation = document.createElement("a");
                    head_portrait.className = "flex1";
                    head_portrait.id = "cancellation";
                    head_img.src = resp.data.profile.avatarUrl + "?param=150y150";
                    cancellation.innerHTML = "注销";
                    cancellation.href = "javascript:;";
                    login_mask.click();
                    let profile = {
                        user_id: resp.data.profile.userId,
                        user_img: resp.data.profile.avatarUrl,
                        user_nickname: resp.data.profile.nickname,
                        user_fans: resp.data.profile.followeds,
                        user_follow: resp.data.profile.follows,
                        cookies: resp.data.cookie,

                    }
                    localStorage.setItem("user_profile", JSON.stringify(profile));
                    cancellation.onclick = function () {
                        axios.get(url_resources + "/logout").then(function (resp) {
                            console.log(resp);
                            if (resp.data.code == 200) {
                                alert("注销成功");
                                nav.removeChild(head_portrait);
                                let login = document.createElement('li');
                                let login_a = document.createElement('a');
                                login.className = "flex1";
                                login_a.href = "javascript:;";
                                login_a.id = "login";
                                login_a.innerHTML = "登陆";
                                login_a.onclick = function () {
                                    login_part.style.visibility = "visible";
                                    login_mask.style.visibility = "visible";
                                }
                                login.onclick = function () {
                                    login_part.style.visibility = "visible";
                                    login_mask.style.visibility = "visible";
                                };

                                login_mask.onclick = function () {
                                    login_part.style.visibility = "hidden";
                                    login_mask.style.visibility = "hidden";
                                };
                                login.appendChild(login_a);
                                nav.appendChild(login);
                            } else {
                                alert("服务器出错,请稍后再试!");
                            }
                        }, function (err) { console.log(err); });
                    }
                    head_portrait.onmouseenter = function () {
                        cancellation.style.visibility = "visible";
                        head_portrait.onmouseleave = function () {
                            cancellation.style.visibility = "hidden";
                        }
                    };
                    head_portrait.appendChild(head_img);
                    head_portrait.appendChild(cancellation);
                    nav.appendChild(head_portrait);
                } else {
                    tip.innerHTML = '账号或密码错误';
                    tip.style.color = "#F94E46";
                }
                // localStorage.setItem("userId", resp.data.profile.userId);
                // location.reload();
            }, function (error) { console.log(error); });
    } else {
        tip.innerHTML = "手机账号格式错误";
        tip.style.color = "#F94E46";
    }
}

tel.addEventListener('keydown', function (e) {
    if (e.keyCode == 13) {
        login_btn.click();
    }
});
pwd.addEventListener('keydown', function (e) {
    if (e.keyCode == 13) {
        login_btn.onclick();
    }
});