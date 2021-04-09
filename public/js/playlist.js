import { url as url_resources } from "./url.js";


let tags_array = [];
// 标签数据渲染 start
axios.get(url_resources + "/playlist/catlist").then(function (resp) {
    console.log(resp.data);
    let category0 = [];
    let category1 = [];
    let category2 = [];
    let category3 = [];
    let category4 = [];
    let tags = document.querySelectorAll(".playlist_type span");
    resp.data.sub.forEach((element) => {
        if (element.category == 0) {
            category0.push(element.name);
        } else if (element.category == 1) {
            category1.push(element.name);
        } else if (element.category == 2) {
            category2.push(element.name);
        } else if (element.category == 3) {
            category3.push(element.name);
        } else if (element.category == 4) {
            category4.push(element.name);
        }
    });
    category0.forEach((e, index) => {
        tags_array[0] = "全部";
        if (index >= 0 && index < 5) {
            tags_array.push(e);
        }
    });
    category1.forEach((e, index) => {
        if (index >= 0 && index < 9) {
            tags_array.push(e);
        }
    });
    category2.forEach((e, index) => {
        if (index >= 0 && index < 9) {
            tags_array.push(e);
        }
    });
    category3.forEach((e, index) => {
        if (index >= 0 && index < 9) {
            tags_array.push(e);
        }
    });
    category4.forEach((e, index) => {
        if (index >= 0 && index < 9) {
            tags_array.push(e);
        }
    });
    // console.log(tags_array);
    tags.forEach((e, index) => {
        e.innerHTML = tags_array[index];
    });

    tags.forEach((element, index) => {
        element.onclick = function () {
            tags.forEach(element => {
                element.className = 'flex1';
            });
            this.className = "flex1 list_nav_click";
            let list_all = document.querySelector(".list_all");
            list_all.innerHTML = '';
            //全部歌单数据渲染
            axios.get(url_resources + "/top/playlist?limit=30&cat=" + this.innerHTML).then(function (resp) {
                resp.data.playlists.forEach((e, index) => {
                    let div = document.createElement("div");
                    let song_img = document.createElement("img");
                    let song_name = document.createElement("span");
                    let song_artist = document.createElement("span");
                    let song_num = document.createElement("span");
                    song_img.src = e.coverImgUrl;
                    song_img.onclick = function () {
                        let id = e.id;
                        localStorage.removeItem("id");
                        localStorage.setItem("id", id);
                        localStorage.setItem("type", 1);
                        window.open("play.html", "music_play");
                    };
                    song_name.innerHTML = e.name;
                    song_artist.innerHTML = e.creator.nickname;
                    let play_num = e.playCount;
                    play_num /= 10000;
                    song_num.innerHTML += '播放量：' + Math.ceil(play_num * 10) / 10 + '万';
                    div.className = "flex flex_column";
                    div.appendChild(song_img);
                    div.appendChild(song_name);
                    div.appendChild(song_artist);
                    div.appendChild(song_num);
                    list_all.appendChild(div);
                });
            }, function (err) { console.log(err); });
        };
    });
    tags[0].onclick();
}, function (err) { console.log(err); });
// 标签数据渲染 end