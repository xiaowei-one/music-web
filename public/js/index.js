import { tD } from "../js/turnDate.js";
import { url as url_resources } from "./url.js";

// 左右箭头隐藏效果函数
function arrow_hide(region, left_arrow, right_arrow) {
    region.addEventListener('mouseenter', function () {
        right_arrow.style.right = "0px";
        left_arrow.style.left = "0px";
        this.addEventListener('mouseleave', function () {
            right_arrow.style.right = "-79px";
            left_arrow.style.left = "-79px";
        })
    });
}

//推荐音乐部分 start
{
    // 获取推荐歌单
    //获取推荐歌单的左右箭头
    let list_song_rec_next = document.querySelector(".list_recommended .list_song_rec .swiper-button-next");
    let list_song_rec_prev = document.querySelector(".list_recommended .list_song_rec .swiper-button-prev");
    //获取推荐歌单轮播图
    let list_rec_img = document.querySelectorAll(".list_recommended .list_rec .swiper-img");
    //获取推荐歌单轮播图文字描述
    let list_rec_text = document.querySelectorAll(".list_recommended .list_rec .swiper-text");
    //获取推荐歌单全部轮播部分
    let list_recommended = document.querySelector(".list_recommended");
    let list_nav_lis = document.querySelectorAll(".list_recommended .list_nav li");

    //绑定播放事件函数
    function play(e, resp) {
        e.onclick = function () {
            let id = resp.id;
            {
                localStorage.removeItem("id");
                localStorage.setItem("id", id);
                localStorage.setItem("type", 1);
                window.location.href = "comment.html";
            }
        };
    }

    //调用左右箭头隐藏函数
    arrow_hide(list_recommended, list_song_rec_prev, list_song_rec_next);
    //绑定推荐音乐点击事件
    list_nav_lis[0].onclick = function () {
        list_nav_lis.forEach(element => {
            element.className = '';
        });
        this.className = "list_nav_rec list_nav_click";
        axios.get(url_resources + "/personalized?limit=20").then(function (resp) {
            list_rec_img.forEach((e, index) => {
                play(e, resp.data.result[index]);
                e.style.backgroundImage = `url(${resp.data.result[index].picUrl}?param=450y450)`
            });
            list_rec_text.forEach((e, index) => {
                play(e, resp.data.result[index]);
                e.innerHTML = resp.data.result[index].name + '</br>';
                let play_num = resp.data.result[index].playCount;
                play_num /= 10000;
                e.innerHTML += '<p class="swiper-num">播放量:' + Math.ceil(play_num * 10) / 10 + '万</div>';
            });
        }, function (err) {
            console.log(err);
        });
    };
    //页面记载默认加载为你推荐
    list_nav_lis[0].onclick();

    //绑定华语点击事件
    list_nav_lis[1].onclick = function () {
        list_nav_lis.forEach(element => {
            element.className = '';
        });
        this.className = "list_nav_che list_nav_click";
        axios.get(url_resources + "/top/playlist?limit=20&cat=华语").then(function (resp) {
            list_rec_img.forEach((e, index) => {
                play(e, resp.data.playlists[index]);
                e.style.backgroundImage = `url(${resp.data.playlists[index].coverImgUrl}?param=450y450)`
            });
            list_rec_text.forEach((e, index) => {
                play(e, resp.data.playlists[index]);
                e.innerHTML = resp.data.playlists[index].name + '</br>';
                let play_num = resp.data.playlists[index].playCount;
                play_num /= 10000;
                e.innerHTML += '<p class="swiper-num">播放量:' + Math.ceil(play_num * 10) / 10 + '万</div>';
            });
        }, function (err) {
            console.log(err);
        });
    };
    //绑定清晨点击事件
    list_nav_lis[2].onclick = function () {
        list_nav_lis.forEach(element => {
            element.className = '';
        });
        this.className = "list_nav_mor list_nav_click";
        axios.get(url_resources + "/top/playlist?limit=20&cat=清晨").then(function (resp) {
            list_rec_img.forEach((e, index) => {
                play(e, resp.data.playlists[index]);
                e.style.backgroundImage = `url(${resp.data.playlists[index].coverImgUrl}?param=450y450)`
            });
            list_rec_text.forEach((e, index) => {
                play(e, resp.data.playlists[index]);
                e.innerHTML = resp.data.playlists[index].name + '</br>';
                let play_num = resp.data.playlists[index].playCount;
                play_num /= 10000;
                e.innerHTML += '<p class="swiper-num">播放量:' + Math.ceil(play_num * 10) / 10 + '万</div>';
            });
        }, function (err) {
            console.log(err);
        });
    };
    //绑定欧美点击事件
    list_nav_lis[3].onclick = function () {
        list_nav_lis.forEach(element => {
            element.className = '';
        });
        this.className = "list_nav_wes list_nav_click";
        axios.get(url_resources + "/top/playlist?limit=20&cat=欧美").then(function (resp) {
            list_rec_img.forEach((e, index) => {
                play(e, resp.data.playlists[index]);
                e.style.backgroundImage = `url(${resp.data.playlists[index].coverImgUrl}?param=450y450)`
            });
            list_rec_text.forEach((e, index) => {
                play(e, resp.data.playlists[index]);
                e.innerHTML = resp.data.playlists[index].name + '</br>';
                let play_num = resp.data.playlists[index].playCount;
                play_num /= 10000;
                e.innerHTML += '<p class="swiper-num">播放量:' + Math.ceil(play_num * 10) / 10 + '万</div>';
            });
        }, function (err) {
            console.log(err);
        });
    };
    //绑定浪漫点击事件
    list_nav_lis[4].onclick = function () {
        list_nav_lis.forEach(element => {
            element.className = '';
        });
        this.className = "list_nav_rom list_nav_click";
        axios.get(url_resources + "/top/playlist?limit=20&cat=浪漫").then(function (resp) {
            list_rec_img.forEach((e, index) => {
                play(e, resp.data.playlists[index]);
                e.style.backgroundImage = `url(${resp.data.playlists[index].coverImgUrl}?param=450y450)`
            });
            list_rec_text.forEach((e, index) => {
                play(e, resp.data.playlists[index]);
                e.innerHTML = resp.data.playlists[index].name + '</br>';
                let play_num = resp.data.playlists[index].playCount;
                play_num /= 10000;
                e.innerHTML += '<p class="swiper-num">播放量:' + Math.ceil(play_num * 10) / 10 + '万</div>';
            });
        }, function (err) {
            console.log(err);
        });
    };
}
//推荐音乐部分 end
//新歌首发 start
{
    //获取整个新歌首发部分
    let new_song = document.querySelector(".new_song");
    //获取新歌首发切换项
    let new_song_type = document.querySelectorAll(".new_song .list_nav li");
    //type数组
    let type_arr = [0, 7, 96, 8, 16];
    //获取轮播全部部分
    let new_song_rotation = document.querySelector("#swiper-container3");
    //获取轮播图片部分
    let new_song_img = document.querySelectorAll(".new_song img");
    //获取轮播图歌手名字
    let new_song_artist = document.querySelectorAll(".new_song .artist");
    //获取轮播图歌曲名字
    let new_song_name = document.querySelectorAll(".new_song .song_name");
    //获取歌曲播放时间
    let new_song_time = document.querySelectorAll(".new_song .song_time");
    //获取左右箭头
    let new_song_prev = document.querySelector(".new_song .swiper-button-prev");
    let new_song_next = document.querySelector(".new_song .swiper-button-next");
    // 使用左右箭头隐藏效果函数
    arrow_hide(new_song, new_song_prev, new_song_next);
    //渲染数据
    function change_type(index, type) {
        index.onclick = function () {
            new_song_type.forEach(element => {
                element.className = '';
            });
            this.className = "list_nav_click";
            axios.get(url_resources + "/top/song?type=" + type).then(function (resp) {
                for (let i = 0; i < new_song_img.length; i++) {
                    new_song_img[i].onclick = function () {
                        let artist_name = [];
                        resp.data.data[i].artists.forEach((element, index) => {
                            artist_name[index] = element.name;
                        });
                        {
                            localStorage.removeItem("id");
                            localStorage.setItem("id", resp.data.data[i].id);
                            localStorage.setItem("type", 0);
                        }
                        window.open("play.html", "music_play");
                    };

                    new_song_img[i].src = resp.data.data[i].album.picUrl + "?param=200y200";
                    new_song_name[i].innerHTML = resp.data.data[i].name;
                    new_song_artist[i].innerHTML = resp.data.data[i].album.artists[0].name;
                    new_song_time[i].innerHTML = tD(resp.data.data[i].duration / 1000);
                }
            }, function (err) {
                console.log(err);
            })
        }
    }
    for (let i = 0; i < new_song_type.length; i++) {
        change_type(new_song_type[i], type_arr[i]);
    }
    new_song_type[0].onclick();
}
//新歌首发 end


//MV start
{
    //获取整个MV部分
    let mv = document.querySelector(".mv");
    //获取mv切换项
    let mv_type = document.querySelectorAll(".mv .list_nav li");
    //type数组
    let area_arr = ["全部", "内地", "港台", "欧美", "日本", "韩国"];
    //获取轮播全部部分
    let mv_rotation = document.querySelector("#swiper-container4");
    //获取轮播图片部分
    let mv_img = document.querySelectorAll(".mv img");
    //获取轮播图歌手名字
    let mv_artist = document.querySelectorAll(".mv .artist");
    //获取轮播图歌曲名字
    let mv_name = document.querySelectorAll(".mv .song_name");
    //获取歌曲播放时间
    let song_num = document.querySelectorAll(".mv .song_num");
    //获取左右箭头
    let mv_prev = document.querySelector(".mv .swiper-button-prev");
    let mv_next = document.querySelector(".mv .swiper-button-next");
    //渲染数据
    function change_type(index) {
        for (let i = 0; i < index.length; i++) {
            index[i].onclick = function () {
                index.forEach(element => {
                    element.className = '';
                });
                this.className = "list_nav_click";
                axios.get(url_resources + "/mv/all?limit=50&area=" + area_arr[i]).then(function (resp) {
                    console.log(resp.data.data);
                    for (let i = 0; i < mv_img.length; i++) {
                        mv_img[i].src = resp.data.data[i].cover + "?param=440y248";
                        mv_name[i].innerHTML = resp.data.data[i].name;
                        mv_artist[i].innerHTML = resp.data.data[i].artistName;
                        let play_num = resp.data.data[i].playCount;
                        play_num /= 10000;
                        song_num[i].innerHTML = "&#xe63c; " + Math.ceil(play_num * 10) / 10 + '万';
                        mv_img[i].onclick = function () {
                            localStorage.setItem("mv", resp.data.data[i].id);
                            window.open("mv_play.html", "mv_play");
                        }
                        mv_name[i].onclick = function () {
                            localStorage.setItem("mv", resp.data.data[i].id);
                            window.open("mv_play.html", "mv_play");
                        }
                    }
                }, function (err) {
                    console.log(err);
                })
            }
        }
    }
    change_type(mv_type);
    mv_type[0].onclick();
    arrow_hide(mv, mv_prev, mv_next);
}
//MV end