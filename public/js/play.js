import { tD } from "./turnDate.js";
import { downloadFile } from "./download.js";
import { url as url_resources } from "./url.js";

// 歌单列表
{
    //用户id
    let user_id = localStorage.getItem("userId");
    //获取正文全部
    let article = document.querySelector(".article");
    //获取数据渲染列表list部分
    let lists = article.querySelector(".list");
    let id = localStorage.getItem("id");

    //获取数据渲染列表lyrics部分
    let song_name = document.querySelector(".lyric .head .song_name");
    let song_artist = document.querySelector(".lyric .head .artist");
    let song_album = document.querySelector(".lyric .head .album");
    let lyric = document.querySelector(".lyric .foot div");

    //获取音频播放
    let myAudio = document.querySelector("audio");
    //获取音频控制控件
    let prev_song = document.querySelector(".prev_song");
    let start_song = document.querySelector(".start_song");
    let flag = 1;
    let next_song = document.querySelector(".next_song");
    let progress_part = document.querySelector(".progress_part");
    //进度条部分
    let progress_top = document.querySelector(".progress_part .progress_top");
    let progress_bottom = document.querySelector(".progress_part .progress_bottom");
    let date;
    let now;
    //进度条宽度
    let progress_width = progress_bottom.clientWidth;
    //进度条歌名部分
    let progress_song_name = progress_part.querySelector(".progress_part .song_name");
    //时间部分
    let now_time = progress_part.querySelector(".now_time");
    let duration_time = progress_part.querySelector(".duration_time");

    //喜欢
    let like_song = document.querySelector(".like_song");
    //评论
    let comment = document.querySelector(".comment");
    //下载
    let download_song = document.querySelector(".download_song");
    //音量
    let volume = document.querySelector(".volume");
    //播放列表
    let now_playlists = document.querySelector(".now_playlists");
    let online_list;

    //歌词
    let ps;
    let lyric_img = document.querySelector(".lyric .img");
    let time_arr = [];
    let lyric_index = 0;
    //有无音量参数
    let volume_type = true;
    //有无歌词参数
    let nolyric = false;

    let uri = "http://localhost:8844";
    // let uri = "http://meetxiaowei.com/8080/music";

    axios({
        method: 'get',
        url: uri + "/getList",
        params: {
            user_id: user_id,
            time: new Date().getTime(),
        }
    }).then(resp => {
        online_list = resp.data;
    }, err => console.log(err));


    let mask = document.querySelector(".mask");
    //音频播放部分
    myAudio.addEventListener('loadedmetadata', event => {
        date = myAudio.duration;
        duration_time.innerHTML = tD(date);
    });

    myAudio.addEventListener('timeupdate', event => {
        now = myAudio.currentTime;
        // if (nolyric != true) {
        if (time_arr[lyric_index] <= now) {

            lyric.scrollTop = ps[lyric_index].offsetTop - 100;

            if (lyric_index > 0) {
                // ps[lyric_index - 1].style.backgroundImage = "linear-gradient(#E1E1E1, #E1E1E1)";
                ps[lyric_index - 1].style.color = "#E1E1E1";
            }
            // ps[lyric_index].style.backgroundImage = "linear-gradient(#31C27C, #19BF75)";
            ps[lyric_index].style.color = "#19BF75";
            lyric_index++;
            // }
        }
        now_time.innerHTML = tD(myAudio.currentTime);
        progress_top.style.width = Math.round((now / date) * 100) + "%";
    });

    myAudio.addEventListener("play", function () {
        start_song.style.backgroundPosition = "-29px 0";
    });

    myAudio.addEventListener("pause", function () {
        start_song.style.backgroundPosition = "0px 0";
    });

    myAudio.addEventListener("ended", function () {
        myAudio.currentTime = 0;
        myAudio.play == true && myAudio.pause();
        myAudio.pause == true && myAudio.play();
        next_song.onclick();
    });

    progress_top.onclick = function (e) {
        myAudio.pause && myAudio.play();
        myAudio.currentTime = e.layerX / progress_width * date;
    }

    progress_bottom.onclick = function (e) {
        myAudio.pause && myAudio.play();
        myAudio.currentTime = e.layerX / (progress_width) * date;
    }

    start_song.addEventListener("click", function () {

        switch (flag) {
            case 1:
                myAudio.pause();
                flag = 0;
                this.style.backgroundPosition = "0 0";
                break;

            case 0:
                myAudio.play();
                flag = 1;
                this.style.backgroundPosition = "-29px 0";
                break;
            default:
                console.log("播放出错请刷新");
                break;
        }
    });

    let url;
    let play_type = localStorage.getItem("type");
    function play_lists(id) {
        if (play_type == "1") {
            url = url_resources + "/playlist/detail?id=" + id;
        } else if (play_type == "2") {
            url = url_resources + "/album?id=" + id;
        } else if (play_type == "9") {
            url = url_resources + "/login/status";
            let playlists = localStorage.getItem("id").split(",");
            playlists.pop();
            request_songs(playlists);
        }

        //通过id去获取所有歌曲的详情,获取ul动态数据渲染列表
        function request_songs(playlists_like) {
            axios.get(url_resources + "/song/detail?ids=" + playlists_like.toString()).then(function (resp) {
                //列表数据渲染
                let mp3 = resp.data.songs;
                mp3.forEach((element, index) => {
                    let ul = document.createElement("ul");
                    let li_name = document.createElement("li");
                    let li_artist = document.createElement("li");
                    let li_time = document.createElement("li");
                    let li_add = document.createElement("li");
                    let li_border = document.createElement("li");

                    let flag = null;

                    axios({
                        method: 'get',
                        url: uri + "/getList",
                        params: {
                            user_id: user_id,
                            time: new Date().getTime(),
                        }
                    }).then(resp => {
                        online_list = resp.data;
                        let bool = online_list.indexOf(element.id.toString());
                        li_add.className = "li_add";

                        if (bool == -1) {
                            li_add.innerHTML = "+";
                            flag = false;
                        } else {
                            li_add.innerHTML = "-";
                            li_add.style.borderRadius = "50%";
                            flag = true;
                        }
                    }, err => console.log(err));

                    li_add.onclick = function (e) {
                        // 取到歌曲id
                        let user_id = localStorage.getItem("userId");
                        axios({
                            method: 'get',
                            url: uri + "/getList",
                            params: {
                                user_id: user_id,
                                time: new Date().getTime(),
                            }
                        }).then(resp => {
                            online_list = resp.data;
                            if (flag) {
                                this.innerHTML = "+";
                                this.style.borderRadius = null;
                                axios({
                                    method: 'get',
                                    url: uri + '/userDel',
                                    params: {
                                        song_id: element.id,
                                        user_id: user_id,
                                    }
                                }).then(resp => {
                                    console.log(resp.data);
                                    if (resp.data == "删除成功") {
                                        flag = !flag;
                                    }
                                }, err => console.log(err));
                            } else {
                                this.innerHTML = "-";
                                this.style.borderRadius = "50%";
                                axios({
                                    method: 'get',
                                    url: uri + '/user',
                                    params: {
                                        song_id: element.id,
                                        song_name: element.name,
                                        user_id: user_id,
                                    }
                                }).then(resp => {
                                    console.log(resp.data);
                                    if (resp.data == "添加成功") {
                                        flag = !flag;
                                    }
                                }, err => console.log(err));
                            }
                        }, err => console.log(err));

                        e.stopPropagation();
                    }

                    li_border.className = "list_border";
                    li_name.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;" + '&nbsp;&nbsp;&nbsp; ' + element.name;
                    for (let i = 0; i < element.ar.length; i++) {
                        li_artist.innerHTML += element.ar[i].name + '&nbsp;&nbsp;&nbsp;';
                    }
                    li_time.innerHTML = tD(element.dt / 1000);

                    ul.setAttribute("index", index);
                    ul.appendChild(li_name);
                    ul.appendChild(li_artist);
                    ul.appendChild(li_time);
                    ul.appendChild(li_add);
                    ul.appendChild(li_border);
                    lists.appendChild(ul);
                    ul.onclick = function () {
                        let uls = document.querySelectorAll(".list_part .list ul");
                        //音量调整
                        volume_type && (myAudio.volume = 0.2);

                        play_part(element.id);

                        uls.forEach(element => {
                            element.className = '';
                        });
                        this.className = "list_nav_click";
                        axios.get(url_resources + "/song/url?id=" + element.id).then(function (resp) {
                            myAudio.src = resp.data.data[0].url;

                        }, function (err) {
                            console.log(err);
                        });
                        axios.get(url_resources + "/lyric?id=" + element.id).then(function (resp) {
                            lyric.innerHTML = "";
                            lyric.scrollTop = 0;
                            if (resp.data.nolyric) {
                                let p = document.createElement("p");
                                p.innerHTML = "纯音乐请欣赏"
                                lyric.appendChild(p);
                                nolyric = resp.data.nolyric;
                            } else {
                                let arr = resp.data.lrc.lyric.split('\n');
                                arr.forEach((e, index) => {
                                    let p = document.createElement("p");
                                    let num = e.slice(1).split(']')[0].split(":");
                                    time_arr[index] = parseInt(num[0]) * 60 + parseFloat(num[1]);
                                    if (e.slice(1).split(']')[1] != undefined) {
                                        p.innerHTML = e.slice(1).split(']')[1];
                                    }
                                    lyric.appendChild(p);
                                });
                            }

                            lyric_index = 0;
                            ps = lyric.querySelectorAll("p");
                        }, function (err) { console.log(err); });
                        lyric_img.style.backgroundImage = `url(${element.al.picUrl})`;
                        mask.style.backgroundImage = `url(${element.al.picUrl})`;
                        progress_song_name.innerHTML = element.name;
                        song_name.innerHTML = "歌曲名：" + element.name;
                        song_artist.innerHTML = "歌手名：";
                        for (let i = 0; i < element.ar.length; i++) {
                            song_artist.innerHTML += element.ar[i].name + '&nbsp;&nbsp;&nbsp;';
                        }
                        song_album.innerHTML = "专辑：" + element.al.name;
                    }
                    index == 0 && ul.onclick();
                });

                //上一曲
                let songs = document.querySelectorAll(".list_part .list ul");
                prev_song.onclick = function () {
                    let song = document.querySelector(".list_nav_click");
                    let num = song.getAttribute("index");
                    if (num == 0) {
                        num = songs.length - 1;
                    }
                    songs[num].onclick();
                    lists.scrollTop = (num - 5) * 50;
                };
                //下一曲
                next_song.onclick = function () {
                    let song = document.querySelector(".list_nav_click");
                    let num = song.getAttribute("index");
                    num = parseInt(num);
                    if (num == songs.length - 2) {
                        num = 1;
                    } else {
                        num = parseInt(num);
                        num += 2;
                    }
                    songs[num].onclick();
                    lists.scrollTop = (num - 5) * 50;
                };

            }, function (err) { console.log(err); });
        }
        //通过歌单id去获取全部歌曲的id,因为未登录拿不到全部歌曲
        axios.get(url + "&time=" + (new Date().getTime())).then(function (resp) {
            console.log(resp);
            let playlists_like = [];
            if (play_type == "1") {
                resp.data.playlist.trackIds.forEach((e, index) => {
                    playlists_like[index] = e.id;
                });
            } else if (play_type == "2") {
                resp.data.songs.forEach((e, index) => {
                    playlists_like[index] = e.id;
                });
            }
            //通过id去获取所有歌曲的详情,获取ul动态数据渲染列表
            request_songs(playlists_like);

        }, function (err) { console.log(err); });
    }

    // 取到歌单信息渲染
    function list_recommend() {
        play_lists(id);
    }

    function new_song() {
        // 取到歌单信息渲染
        let song_id = localStorage.getItem("id");
        let ul = document.createElement("ul");
        let li_name = document.createElement("li");
        let li_artist = document.createElement("li");
        let li_time = document.createElement("li");
        let li_add = document.createElement("li");

        let li_border = document.createElement("li");
        li_border.className = "list_border";

        axios.get(url_resources + "/song/detail?ids=" + song_id).then(function (resp) {
            console.log(resp);
            li_name.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;" + (+ 1) + '&nbsp;&nbsp;&nbsp; ' + resp.data.songs[0].name;
            for (let i = 0; i < resp.data.songs[0].ar.length; i++) {
                li_artist.innerHTML += resp.data.songs[0].ar[i].name + '&nbsp;&nbsp;&nbsp;';
            }

            li_time.innerHTML = tD(resp.data.songs[0].dt / 1000);
            li_add.innerHTML = "+";

            play_part(song_id);

            ul.onclick = function () {
                //歌曲MP3
                axios.get(url_resources + "/song/url?id=" + song_id).then(function (resp) {
                    myAudio.src = resp.data.data[0].url;
                    myAudio.volume = 0.05;
                }, function (err) {
                    console.log(err);
                });
                // 歌词
                axios.get(url_resources + "/lyric?id=" + song_id).then(function (resp) {
                    lyric.innerHTML = "";

                    if (resp.data.nolyric) {
                        let p = document.createElement("p");
                        p.innerHTML = "纯音乐请欣赏"
                        lyric.appendChild(p);
                        nolyric = resp.data.nolyric;
                    } else {
                        let arr = resp.data.lrc.lyric.split('\n');
                        arr.forEach((e, index) => {
                            let p = document.createElement("p");
                            let num = e.slice(1).split(']')[0].split(":");
                            time_arr[index] = parseInt(num[0]) * 60 + parseFloat(num[1]);
                            if (e.slice(1).split(']')[1] != undefined) {
                                p.innerHTML = e.slice(1).split(']')[1];
                            }
                            lyric.appendChild(p);
                        });
                    }

                    lyric_index = 0;
                    ps = lyric.querySelectorAll("p");
                }, function (err) { console.log(err); });
                //图片
                console.log(resp.data.songs[0].al.picUrl);
                lyric_img.style.backgroundImage = `url(${resp.data.songs[0].al.picUrl})`;
                mask.style.backgroundImage = `url(${resp.data.songs[0].al.picUrl})`;
                progress_song_name.innerHTML = resp.data.songs[0].name
                song_name.innerHTML = "歌曲名：" + resp.data.songs[0].name;
                song_artist.innerHTML = "歌手名：";
                for (let i = 0; i < resp.data.songs[0].ar.length; i++) {
                    song_artist.innerHTML += resp.data.songs[0].ar[i].name + '&nbsp;&nbsp;&nbsp;';
                }
                //专辑名
                song_album.innerHTML = "专辑：" + resp.data.songs[0].al.name;

            }
            ul.appendChild(li_name);
            ul.appendChild(li_artist);
            ul.appendChild(li_time);
            ul.appendChild(li_border);
            lists.appendChild(ul);
            ul.onclick();
        }, function (err) { console.log(err); });
        // 我喜欢
        like_song.onclick = function () {
            let song = document.querySelector(".list_nav_click");
            let num = song.getAttribute("index");
            console.log(resp.data.songs[num].name);
            axios.get(url_resources + "/like?like=true&id=" + resp.data.songs[num].id).then(function (resp) {
                console.log("1", resp);
                this.style.backgroundPosition = "-29px 0";
            }, function (err) { console.log(err) });

            axios.get(url_resources + "/likelist?uid=373848057").then(function (resp) {
                console.log("3", resp.data);
            }, function (err) { console.log(err) });
        }

    }

    function play_part(id) {
        volume.onclick = function () {
            volume_type = !volume_type;

            if (volume_type) {
                myAudio.volume = 0.2;
                volume.className = "volume";

            } else {
                myAudio.volume = volume_type;
                volume.className = "no_volume";
            }
        };

        // 我喜欢
        let like_index = false;
        axios.get(url_resources + "/likelist?uid=" + user_id + "&time=" + (new Date().getTime())).then(function (resp) {
            resp.data.ids.forEach(e => {
                if (e == id) {
                    like_index = true;
                }
                if (like_index) {
                    like_song.className = "like_song";
                } else {
                    like_song.className = "dislike_song";
                }
            });
        }, function (err) { console.log(err) });
        like_song.onclick = function () {
            if (!like_index) {
                like_song.className = "like_song";
                axios.get(url_resources + "/like?like=true&id=" + id + "&time=" + (new Date().getTime())).then(function (resp) {
                    like_index = !like_index;
                }, function (err) { console.log(err) });
            } else {
                like_song.className = "dislike_song";
                axios.get(url_resources + "/like?like=false&id=" + id + "&time=" + (new Date().getTime())).then(function (resp) {
                    like_index = !like_index;
                }, function (err) { console.log(err) });
            }
        }

        //评论模块
        let comment_div = document.querySelector(".comment div");
        axios.get(url_resources + "/comment/new?type=0&id=" + id + "&sortType=3&time=" + (new Date().getTime())).then(function (resp) {
            let comment_index = resp.data.data.totalCount;
            comment.style.backgroundImage = "url(../images/player.png)";
            if (comment_index > 1000) {
                comment_div.innerHTML = "999+";
                comment_div.style.right = "-17px";
            } else if (comment_index < 100) {
                comment_div.innerHTML = comment_index;
                comment_div.style.right = "-6px";
            } else if (comment_index > 100 && comment_index < 1000) {
                comment_div.innerHTML = comment_index;
                comment_div.style.right = "-8px";
            }

        }, function (err) { console.log(err) });

        comment.onclick = function () {
            localStorage.removeItem("id");
            localStorage.setItem("id", id);
            localStorage.setItem("type", 0);
            window.open("comment.html", "comment");
        }

        //下载
        download_song.onclick = function () {
            axios.get(url_resources + "/song/url?id=" + id).then(function (resp) {
                let url = resp.data.data[0].url;
                let url_music = new URL(url);
                let name_music = url_music.pathname.split("/");
                download_song.download = name_music[name_music.length - 1];
                downloadFile(url, name_music[name_music.length - 1]);
            }, function (err) { console.log(err) });
        }

        //播放列表
        now_playlists.onclick = function () {
            axios({
                method: 'get',
                url: uri + "/getList",
                params: {
                    user_id: user_id,
                }
            }).then(resp => {
                if (resp.data != "") {
                    localStorage.setItem('id', resp.data);
                    localStorage.setItem('type', 9);
                    window.open("play.html", "music_play");
                } else {
                    alert("播放列表为空");
                }
            }, err => console.log(err));
        }
    }

    if (play_type == 1) {
        list_recommend();
    } else if (play_type == 0) {
        new_song();
    } else {
        list_recommend();
    }
}