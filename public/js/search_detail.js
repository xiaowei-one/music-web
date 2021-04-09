import { tD } from "./turnDate.js";
import { url as url_resources } from "./url.js";

function search(word, callback) {
    axios.get(url_resources + "/cloudsearch?keywords=" + word).then(function (resp) {
        callback && callback(resp);
    }, function (err) { console.log(err); });
}

//从url拿到搜索关键字
let url = new URL(window.location.href);
let key_word = decodeURI(url.search.substr(1).split("=")[1]);
let footer = document.querySelector("footer");
let list = document.querySelector(".list");

//热词搜索数据渲染
let hot_words = document.querySelectorAll(".hot_words span");
axios.get(url_resources + "/search/hot").then(function (resp) {
    for (let i = 0; i < 5; i++) {
        hot_words[i].innerHTML = resp.data.result.hots[i].first;
        hot_words[i].onclick = function () {
            footer.style.display = "none";
            list.style.display = "none";
            search_bar_input.value = this.innerHTML;
            createElements(1);
            list_title[0].click();
        }
    }
}, function (err) { console.log(err); });

//搜索
let search_bar_input = document.querySelector(".search_bar input");
let search_bar_icon = document.querySelector(".search_bar span");

search_bar_input.value = key_word;

//回车搜索
search_bar_input.onkeydown = function (e) {
    if (e.key == 'Enter') {
        search_bar_icon.click();
    }
};

//标签选择title
let list_title = document.querySelectorAll(".list_title span");
// 点击搜索
search_bar_icon.onclick = function () {
    list.style.display = "none";
    footer.style.display = "none";
    list_title[0].click();
}

//类型的号码
let type_arr = [1, 10, 100, 1000, 1002, 1004];
//播放按键

list_title.forEach((e, index) => {
    e.addEventListener("mouseover", function () {
        this.style.color = "#19BF75";
        e.addEventListener("mouseout", function () {
            this.style.color = '#000000';
        });
    });

    e.onclick = function () {
        clearTimeout(timer);
        var timer = setTimeout(() => {
            list.style.display = "block";
            footer.style.display = "flex";
        }, 100);
        list_title.forEach(element => {
            element.className = '';
        });
        this.className = "bgc_click";

        search(search_bar_input.value + "&type=" + type_arr[index], function (e) {
            console.log(e);
            let songs_id = [];
            if (type_arr[index] == 1) {

                createElements(1);
                e.data.result.songs.forEach((e, index) => {
                    createElements(0, e);
                });
            } else if (type_arr[index] == 10) {
                createElements_album(1);
                e.data.result.albums.forEach((e, index) => {
                    createElements_album(0, e);
                });
            } else if (type_arr[index] == 100) {
                createElements_artist(1);
                e.data.result.artists.forEach((e, index) => {
                    createElements_artist(0, e);
                });
            } else if (type_arr[index] == 1000) {
                createElements_playlists(1);
                e.data.result.playlists.forEach((e, index) => {
                    createElements_playlists(0, e);
                });
            } else if (type_arr[index] == 1002) {
                createElements_user(1);
                e.data.result.userprofiles.forEach((e, index) => {
                    createElements_user(0, e);
                });
            } else if (type_arr[index] == 1004) {
                createElements_MV(1);
                console.log(e.data.result.mvs);
                e.data.result.mvs.forEach((e, index) => {
                    createElements_MV(0, e);
                });
            }
        });
    }
});

search_bar_icon.click();

//渲染单曲元素
function createElements(type, e) {
    let lists = document.querySelector(".list");
    let ul = document.createElement("ul");
    let li_name = document.createElement("li");
    let li_artist = document.createElement("li");
    let li_album = document.createElement("li");
    let li_time = document.createElement("li");
    let li_border_top = document.createElement("li");
    let li_border = document.createElement("li");
    ul.className = "song_all";
    if (type) {
        lists.innerHTML = "";
        li_name.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;歌曲";
        li_artist.innerHTML = "歌手";
        li_album.innerHTML = "专辑";
        li_time.innerHTML = "时长";
        li_border_top.className = "list_border_top";
        li_border.className = "list_border";
    } else {
        li_name.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + e.name;
        for (let i = 0; i < e.ar.length; i++) {
            li_artist.innerHTML += e.ar[i].name + '&nbsp;&nbsp;&nbsp;';
        }
        li_album.innerHTML = e.al.name;
        li_time.innerHTML = tD(e.dt / 1000)
        li_border_top.className = "list_border_top";
        li_border.className = "list_border";
        ul.onclick = function () {
            localStorage.removeItem("id");
            localStorage.setItem("id", e.id);
            localStorage.setItem("type", 0);
            window.open("play.html", "music_play");
        }
    }
    ul.append(li_name);
    ul.append(li_artist);
    ul.append(li_album);
    ul.append(li_time);
    type && ul.append(li_border_top);
    ul.append(li_border);
    lists.append(ul);
}
//渲染专辑元素
function createElements_album(type, e) {
    let lists = document.querySelector(".list");
    let album_all = document.createElement("div");
    let album = document.createElement("span");
    let album_img = document.createElement("img");
    let album_name = document.createElement("span");
    let album_artist = document.createElement("span");
    let album_time = document.createElement("span");

    if (type) {
        lists.innerHTML = "";
        album_all.className = "album_all_title";
        album.className = "album_title";
        album_artist.className = "album_artist_title";
        album_time.className = "album_time_title";
        album.innerHTML = "专辑";
        album_artist.innerHTML = "歌手";
        album_time.innerHTML = "发行时间";
    } else {
        album_all.className = "album_all";
        album.className = "album";
        album_name.className = "album_name";
        album_artist.className = "album_artist";
        album_time.className = "album_time";

        album_img.src = e.picUrl;
        album_name.innerHTML = e.name;
        for (let i = 0; i < e.artists.length; i++) {
            album_artist.innerHTML += e.artists[i].name + '&nbsp;&nbsp;&nbsp;';
        }
        //时间格式转换
        let date = new Date(e.publishTime).toLocaleDateString();
        let date_arr = date.split("/");
        date_arr[1].length == 1 && (date_arr[1] = "0" + date_arr[1]);
        date_arr[2].length == 1 && (date_arr[2] = "0" + date_arr[2]);
        album_time.innerHTML = date_arr[0] + "-" + date_arr[1] + "-" + date_arr[2];

        album.onclick = function () {
            localStorage.removeItem("id");
            localStorage.setItem("id", e.id);
            localStorage.setItem("type", 2);
            window.location.href = "comment.html";
            // window.open("comment.html", "comment");
        }

        album.appendChild(album_img);
        album.appendChild(album_name);
    };

    album_all.appendChild(album);
    album_all.appendChild(album_artist);
    album_all.appendChild(album_time);
    lists.appendChild(album_all);
}

//渲染歌手元素
function createElements_artist(type, e) {
    let lists = document.querySelector(".list");
    let artist_all = document.createElement("div");
    let artist = document.createElement("div");
    let artist_img = document.createElement("img");
    let artist_name = document.createElement("span");
    let artist_playlists = document.createElement("span");
    let artist_fans = document.createElement("span");
    if (type) {
        lists.innerHTML = "";
    } else {
        artist_all.className = "artist_all";
        artist.className = "artist";
        artist_name.className = "artist_name";
        artist_playlists.className = "artist_playlists";
        artist_fans.className = "artist_fans";
        artist_img.src = e.picUrl;
        artist_name.innerHTML = e.name;
        artist_playlists.innerHTML = "专辑：" + e.albumSize;
        artist_fans.innerHTML = "MV：" + e.mvSize;
    }
    artist_all.appendChild(artist);
    artist_all.appendChild(artist_playlists);
    artist_all.appendChild(artist_fans);
    artist.appendChild(artist_img);
    artist.appendChild(artist_name);
    lists.appendChild(artist_all);
}

//渲染歌单元素
function createElements_playlists(type, e) {
    let list = document.querySelector(".list");
    if (type) {
        list.innerHTML = '';
        let playlists_title = document.createElement("div");
        let playlists_all = document.createElement("div");
        playlists_all.className = "playlists_all";
        playlists_title.className = "playlists_title";
        playlists_title.innerHTML = "搜索歌单";
        list.appendChild(playlists_title);
        list.appendChild(playlists_all);

    } else {
        //全部歌单数据渲染
        let playlists_all = document.querySelector(".playlists_all");
        let playlists = document.createElement("div");
        let playlists_img = document.createElement("img");
        let playlists_name = document.createElement("span");
        let playlists_artist = document.createElement("span");
        let playlists_num = document.createElement("span");
        playlists.className = "playlists flex flex_column";
        playlists_img.src = e.coverImgUrl;
        playlists_name.innerHTML = e.name;
        playlists_artist.innerHTML = e.creator.nickname;
        let play_num = e.playCount;
        play_num /= 10000;
        playlists_num.innerHTML += '播放量：' + Math.ceil(play_num * 10) / 10 + '万';
        playlists.appendChild(playlists_img);
        playlists.appendChild(playlists_name);
        playlists.appendChild(playlists_artist);
        playlists.appendChild(playlists_num);
        playlists_all.appendChild(playlists);

        playlists_all.onclick = function () {
            localStorage.removeItem("id");
            localStorage.setItem("id", e.id);
            localStorage.setItem("type", 1);
            window.location.href = "comment.html";
            // window.open("comment.html", "comment");
        }
    }
}

//渲染用户元素
function createElements_user(type, e) {
    let lists = document.querySelector(".list");
    let user_all = document.createElement("div");
    let user = document.createElement("div");
    let user_img = document.createElement("img");
    let user_name = document.createElement("span");
    let user_playlists = document.createElement("span");
    let user_fans = document.createElement("span");
    if (type) {
        lists.innerHTML = "";
        let user_title = document.createElement("div");
        user_title.className = "playlists_title";
        user_title.innerHTML = "搜索用户";
        lists.appendChild(user_title);

    } else {
        user_all.className = "user_all";
        user.className = "user";
        user_name.className = "user_name";
        user_playlists.className = "user_playlists";
        user_fans.className = "user_fans";
        user_img.src = e.avatarUrl;
        user_name.innerHTML = e.nickname;
        user_playlists.innerHTML = "歌单：" + e.playlistBeSubscribedCount;
        let fans = e.followeds;
        if (fans >= 10000) {
            fans /= 10000;
            user_fans.innerHTML += "粉丝：" + Math.ceil(fans * 10) / 10 + '万';
        } else {
            user_fans.innerHTML = "粉丝：" + fans;
        }
    }
    user_all.appendChild(user);
    user_all.appendChild(user_playlists);
    user_all.appendChild(user_fans);
    user.appendChild(user_img);
    user.appendChild(user_name);
    lists.appendChild(user_all);
}

//渲染MV元素
function createElements_MV(type, e) {
    let list = document.querySelector(".list");
    if (type) {
        list.innerHTML = '';
        let mv_search_title = document.createElement("div");
        let mv_search_all = document.createElement("div");
        mv_search_all.className = "mv_search_all";
        mv_search_title.className = "mv_search_title";
        mv_search_title.innerHTML = "搜索MV";
        list.appendChild(mv_search_title);
        list.appendChild(mv_search_all);

    } else {
        //全部歌单数据渲染
        let mv_search_all = document.querySelector(".mv_search_all");
        let mv_search = document.createElement("div");
        let mv_search_img = document.createElement("img");
        let mv_search_name = document.createElement("span");
        let mv_search_artist = document.createElement("span");
        let mv_search_num = document.createElement("span");
        mv_search.className = "mv_search flex flex_column";
        mv_search_img.src = e.cover;
        mv_search_name.innerHTML = e.name;
        mv_search_artist.innerHTML = e.artistName;
        let play_num = e.playCount;
        play_num /= 10000;
        mv_search_num.innerHTML += '&#xe63c; ' + Math.ceil(play_num * 10) / 10 + '万';
        mv_search.appendChild(mv_search_img);
        mv_search.appendChild(mv_search_name);
        mv_search.appendChild(mv_search_artist);
        mv_search.appendChild(mv_search_num);
        mv_search_all.appendChild(mv_search);

        mv_search_img.onclick = function () {
            localStorage.setItem("mv", e.id);
            window.open("mv_play.html", "mv_play");
        };
    }
}