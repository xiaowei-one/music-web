import { tD } from "./turnDate.js";
import { url as url_resources } from "./url.js";


//正文头像
let article_user_img = document.querySelector(".article .head .user_img img");
//名字
let user_name = document.querySelector(".user_name");
//关注的人的数目
let follow_num = document.querySelector(".follow_num");
//粉丝数目
let fans_num = document.querySelector(".fans_num");

let user_id = localStorage.getItem("userId");

axios.get(url_resources + "/user/detail?uid=" + user_id).then(function (resp) {
    console.log(resp);
    let user = resp.data.profile;
    //以上4个数据的渲染
    article_user_img.src = user.avatarUrl;
    user_name.innerHTML = user.nickname;
    follow_num.innerHTML = "关注：" + user.follows;
    fans_num.innerHTML = "粉丝：" + user.followeds;
}, function (err) { console.log(err); });


//title 列表部分,选取相应的type
let titles = document.querySelectorAll(".title span");
//我喜欢
let like = document.querySelector(".like");

//获取按键控制部分
let play_all = document.querySelector(".play_all");
let prev_page = document.querySelector(".prev_page");
let next_page = document.querySelector(".next_page");
let info_page = document.querySelector(".info_page");

//以上4个元素事件绑定和数据渲染
let lists = document.querySelector(".list_all .list");

function play_lists(type, resp) {
    //通过歌单id去获取全部歌曲的id,因为未登录拿不到全部歌曲
    axios.get(url_resources + "/playlist/detail?id=" + resp.data.playlist[type].id + "&time=" + (new Date().getTime())).then(function (resp) {
        let playlists_like = [];
        let playlists_like_ten = [];
        resp.data.playlist.trackIds.forEach((e, index) => {
            if ((index % 10 == 0 && index != 0) || resp.data.playlist.trackIds.length == index + 1) {
                playlists_like_ten.push(playlists_like);
                playlists_like = [];
            }
            playlists_like[index % 10] = e.id;
        });
        info_page.innerHTML = `1/${playlists_like_ten.length}`;
        //通过id去获取所有歌曲的详情,获取ul动态数据渲染列表
        function request_songs(i) {
            let info_page = document.querySelector(".info_page");
            info_page.innerHTML = i + `/${playlists_like_ten.length}`;
            axios.get(url_resources + "/song/detail?ids=" + playlists_like_ten[i - 1].toString()).then(function (resp) {
                lists.innerHTML = "";
                let ul = document.createElement("ul");
                let li_name = document.createElement("li");
                let li_artist = document.createElement("li");
                let li_album = document.createElement("li");
                let li_time = document.createElement("li");
                let li_border_top = document.createElement("li");
                let li_border = document.createElement("li");
                li_name.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;歌曲";
                li_artist.innerHTML = "歌手";
                li_album.innerHTML = "专辑";
                li_time.innerHTML = "时长";
                li_border_top.className = "list_border_top";
                li_border.className = "list_border";
                ul.append(li_name);
                ul.append(li_artist);
                ul.append(li_album);
                ul.append(li_time);
                ul.append(li_border_top);
                ul.append(li_border);
                lists.append(ul);

                //我喜欢列表数据渲染
                let mp3 = resp.data.songs;
                if (mp3.length >= 10) {
                    mp3.forEach((element, index) => {
                        let ul = document.createElement("ul");
                        let li_name = document.createElement("li");
                        let li_artist = document.createElement("li");
                        let li_album = document.createElement("li");
                        let li_time = document.createElement("li");
                        let li_border = document.createElement("li");

                        li_border.className = "list_border";
                        li_name.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;" + '&nbsp;&nbsp;&nbsp; ' + element.name;
                        for (let i = 0; i < element.ar.length; i++) {
                            li_artist.innerHTML += element.ar[i].name + '&nbsp;&nbsp;&nbsp;';
                        }
                        li_album.innerHTML = element.al.name;
                        li_time.innerHTML = tD(element.dt / 1000);
                        ul.appendChild(li_name);
                        ul.appendChild(li_artist);
                        ul.appendChild(li_album);
                        ul.appendChild(li_time);
                        ul.appendChild(li_border);
                        lists.appendChild(ul);
                    });
                } else {
                    for (let i = 0; i < mp3.length; i++) {
                        let ul = document.createElement("ul");
                        let li_name = document.createElement("li");
                        let li_artist = document.createElement("li");
                        let li_album = document.createElement("li");
                        let li_time = document.createElement("li");
                        let li_border = document.createElement("li");

                        li_border.className = "list_border";
                        li_name.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;" + '&nbsp;&nbsp;&nbsp; ' + mp3[i].name;
                        for (let j = 0; j < mp3[i].ar.length; j++) {
                            li_artist.innerHTML += mp3[i].ar[j].name + '&nbsp;&nbsp;&nbsp;';
                        }
                        li_album.innerHTML = mp3[i].al.name;
                        li_time.innerHTML = tD(mp3[i].dt / 1000);
                        ul.appendChild(li_name);
                        ul.appendChild(li_artist);
                        ul.appendChild(li_album);
                        ul.appendChild(li_time);
                        ul.appendChild(li_border);
                        lists.appendChild(ul);
                    }
                    for (let i = 0; i < (10 - mp3.length); i++) {
                        let ul = document.createElement("ul");
                        let li_name = document.createElement("li");
                        let li_artist = document.createElement("li");
                        let li_album = document.createElement("li");
                        let li_time = document.createElement("li");
                        let li_border = document.createElement("li");
                        li_border.className = "list_border";
                        ul.appendChild(li_name);
                        ul.appendChild(li_artist);
                        ul.appendChild(li_album);
                        ul.appendChild(li_time);
                        ul.appendChild(li_border);
                        lists.appendChild(ul);
                    }
                }

            }, function (err) { console.log(err); });
        }
        let i = 0;
        function lists_music() {
            this.className == "next_page" && i++;
            this.className == "prev_page" && i--;

            if (i == playlists_like_ten.length + 1) {
                i %= playlists_like_ten.length;
                console.log(i);
            }
            if (i == 0) {
                i = playlists_like_ten.length;
            }
            request_songs(i);
        }
        let page = document.querySelector(".page");
        function turn_page() {
            let info_page = document.querySelector(".info_page");
            let input = document.createElement('input');
            input.type = "text";
            input.placeholder = "max:" + playlists_like_ten.length;
            page.removeChild(info_page);
            page.insertBefore(input, next_page);
            input.focus();
            input.addEventListener("keydown", function (e) {
                if (e.key == "Enter") {
                    if (input.value <= playlists_like_ten.length && input.value >= 1) {
                        let span = document.createElement("span");
                        span.innerHTML = `${input.value}/${playlists_like_ten.length}`;
                        span.className = "info_page";
                        page.removeChild(input);
                        page.insertBefore(span, next_page);
                        span.ondblclick = turn_page;
                        i = input.value;
                        request_songs(i);
                    }

                }
            });
        };
        info_page.ondblclick = turn_page;
        next_page.onclick = lists_music;
        prev_page.onclick = lists_music;
        next_page.onclick();
    }, function (err) { console.log(err); });
}

//我喜欢数据
function like_list() {
    titles.forEach(element => {
        element.className = '';
    });
    this.className = "list_nav_click";
    //通过用户id去获取用户歌单列表
    axios.get(url_resources + "/user/playlist?uid=" + user_id).then(function (resp) {
        play_all.onclick = function () {
            let id = resp.data.playlist[0].id;
            localStorage.removeItem("id");
            localStorage.setItem("id", id);
            localStorage.setItem("type", 1);
            window.open("play.html", "music_play");
        }
        let title = document.querySelector(".title");
        title.innerHTML = '';
        let span = document.createElement("span");
        span.onclick = like_list;
        span.className = "like list_nav_click";
        span.innerHTML = "我喜欢";
        title.appendChild(span);
        resp.data.playlist.forEach((e, index) => {
            if (index != 0 && index < 6) {
                let span = document.createElement("span");
                span.innerHTML = e.name;
                title.appendChild(span);
                span.onclick = function () {
                    play_all.onclick = function () {
                        let id = e.id;
                        localStorage.removeItem("id");
                        localStorage.setItem("id", id);
                        localStorage.setItem("type", 1);
                        window.open("play.html", "music_play");
                    }
                    let titles = document.querySelectorAll(".title span");
                    titles.forEach(element => {
                        element.className = '';
                    });
                    this.className = "list_nav_click";
                    //通过用户id去获取用户歌单列表
                    axios.get(url_resources + "/user/playlist?uid=" + user_id).then(function (resp) {
                        //通过歌单id去获取全部歌曲的id,因为未登录拿不到全部歌曲
                        play_lists(index, resp);
                    }, function (err) { console.log(err); });
                }
            }
        });
        play_lists(0, resp);
    }, function (err) { console.log(err); });
};
like.onclick = like_list;
like.click();