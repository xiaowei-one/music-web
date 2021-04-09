
import { tD } from './turnDate.js';
import { url as url_resources } from './url.js';

//歌曲部分数据渲染
//歌曲信息部分
let comment_head = document.querySelector('.comment_head');
let comment_head_img = comment_head.querySelector('img');
let comment_songs_name = comment_head.querySelector('.comment_songs_name');
let comment_songs_artist = comment_head.querySelector('.comment_songs_artist');
let comment_album = comment_head.querySelector('.comment_album');
let comment_publishTime = comment_head.querySelector('.comment_publishTime');
let comment_button = comment_head.querySelector('.comment_button');

let comment_type = localStorage.getItem('type');
//取出id
if (parseInt(comment_type) == 1) {
    let playlist_id = localStorage.getItem('id');
    axios.get(url_resources + '/playlist/detail?id=' + playlist_id).then(function (resp) {
        console.log(resp);
        comment_head_img.src = resp.data.playlist.coverImgUrl;
        comment_songs_name.innerHTML = resp.data.playlist.name;
        comment_songs_artist.innerHTML = '收藏：' + resp.data.playlist.creator.nickname;
        comment_album.innerHTML = '标签：' + resp.data.playlist.tags;
        if (parseInt(resp.data.playlist.updateTime) == 0) {
            comment_publishTime.innerHTML = '更新时间：' + resp.data.playlist.updateFrequency;
        } else {
            //时间格式转换
            let date = new Date(resp.data.playlist.updateTime).toLocaleDateString();
            let date_arr = date.split('/');
            date_arr[1].length == 1 && (date_arr[1] = '0' + date_arr[1]);
            date_arr[2].length == 1 && (date_arr[2] = '0' + date_arr[2]);
            comment_publishTime.innerHTML = '更新时间：' + date_arr[0] + '-' + date_arr[1] + '-' + date_arr[2];
        }

        let playlists_like = [];
        resp.data.playlist.trackIds.forEach((e, index) => {
            playlists_like[index] = e.id;
        });
        comment_part(2, playlist_id, 3, 0);
        comment_part(2, playlist_id, 2, 1);
        related(playlist_id, 'related');
        //播放全部
        comment_button.onclick = function () {
            localStorage.removeItem('id');
            localStorage.setItem('id', playlist_id);
            localStorage.setItem('type', 1);
            window.open('../play.html', 'music_play');
        }
        //通过id去获取所有歌曲的详情,获取ul动态数据渲染列表
        songs(playlists_like, 0);
    }, function (err) {
        console.log(err);
    });
} else if (parseInt(comment_type) == 0) {
    let song_id = localStorage.getItem('id');
    let songs_lists = document.querySelector(".songs_lists");
    comment_button.innerHTML = "播放";
    comment_button.style.width = "85px";
    comment_button.onclick = function () {
        localStorage.removeItem('id');
        localStorage.setItem('id', song_id);
        localStorage.setItem('type', 0);
        window.open('../play.html', 'music_play');
    }
    comment_part(0, song_id, 3, 0);
    comment_part(0, song_id, 2, 1);
    related(song_id, 'simi');
    songs(song_id, 1);
    lyric(song_id);
    songs_lists.style.height = "0px";
    songs_lists.innerHTML = "";
} else {
    let album_id = localStorage.getItem('id');
    axios.get(url_resources + '/album?id=' + album_id).then(function (resp) {
        console.log(resp);
        comment_head_img.src = resp.data.album.blurPicUrl;
        comment_songs_name.innerHTML = resp.data.album.name;
        comment_songs_artist.innerHTML = '歌手：' + resp.data.album.artist.name;
        comment_album.innerHTML = '发行公司：' + resp.data.album.company;
        // if (parseInt(resp.data.album.updateTime) == 0) {
        //     comment_publishTime.innerHTML = '更新时间：' + resp.data.playlist.updateFrequency;
        // } else {
        //时间格式转换
        let date = new Date(resp.data.album.publishTime).toLocaleDateString();
        let date_arr = date.split('/');
        date_arr[1].length == 1 && (date_arr[1] = '0' + date_arr[1]);
        date_arr[2].length == 1 && (date_arr[2] = '0' + date_arr[2]);
        comment_publishTime.innerHTML = '更新时间：' + date_arr[0] + '-' + date_arr[1] + '-' + date_arr[2];
        // }

        let playlists_like = [];
        console.log(resp.data.songs);
        resp.data.songs.forEach((e, index) => {
            console.log(e);
            playlists_like[index] = e.id;
        });
        comment_part(3, album_id, 3, 0);
        comment_part(3, album_id, 2, 1);
        related(album_id, 'related');
        //播放全部
        comment_button.onclick = function () {
            localStorage.removeItem('id');
            localStorage.setItem('id', album_id);
            localStorage.setItem('type', 2);
            window.open('../play.html', 'music_play');
        }
        //通过id去获取所有歌曲的详情,获取ul动态数据渲染列表
        songs(playlists_like, 0);
    }, function (err) {
        console.log(err);
    });
}

//相关歌曲推荐数据
function related(playlists_id, related_type) {
    let related_lists = document.querySelector('.lists');
    let related_lists_img = related_lists.querySelectorAll('img');
    let related_lists_name = related_lists.querySelectorAll('.related_song_name');
    let related_lists_artist = related_lists.querySelectorAll('.related_song_artist');
    axios.get(url_resources + "/" + related_type + '/playlist?id=' + playlists_id).then(function (resp) {
        // console.log(resp);
        for (let i = 0; i < 2; i++) {
            related_lists_img[i].src = resp.data.playlists[i].coverImgUrl;
            related_lists_name[i].innerHTML = resp.data.playlists[i].name
            related_lists_artist[i].innerHTML = resp.data.playlists[i].creator.nickname;

            let id = resp.data.playlists[i].id;
            related_lists_img[i].onclick = function () {
                localStorage.removeItem('id');
                localStorage.setItem('id', id);
                localStorage.setItem('type', 1);
                window.open('../play.html', 'music_play');
            }

            related_lists_name[i].onclick = function () {
                localStorage.removeItem('id');
                localStorage.setItem('id', id);
                localStorage.setItem('type', 1);
                window.open('../play.html', 'music_play');
            }
        }

    }, function (err) {
        console.log(err);
    });
}

function lyric(songs_id) {
    let song_lyric = document.querySelector('.song_lyric');
    let div = document.createElement('h4');
    div.innerHTML = '「 歌词 」';
    song_lyric.appendChild(div);
    axios.get(url_resources + '/lyric?id=' + songs_id).then(function (resp) {
        // song_lyric.innerHTML = "";
        let lyric_arr = resp.data.lrc.lyric.split('\n');
        for (let i = 0; i < lyric_arr.length; i++) {
            let p = document.createElement('p');
            if (lyric_arr[i].slice(1).split(']')[1] != undefined) {
                p.innerHTML = lyric_arr[i].slice(1).split(']')[1];
            }

            if (i > 9) {
                p.className = 'hidden';
            }
            song_lyric.appendChild(p);

            if (i == 9) {
                let more = document.createElement('div');
                more.className = 'more_lyric';
                more.style.marginTop = '10px';
                more.innerHTML = '全部歌词';
                more.onclick = function () {
                    let ps = document.querySelectorAll('.song_lyric .hidden');
                    let m_lyric = document.querySelector('.song_lyric .m_lyric');
                    ps.forEach(e => {
                        e.style.display = 'block';
                    });
                    this.style.display = 'none';
                    m_lyric.style.display = 'block';
                }
                song_lyric.appendChild(more);
            }
            if (i == lyric_arr.length - 1) {
                let m_lyric = document.createElement('div');
                let more_lyric = document.querySelector('.song_lyric .more_lyric');
                m_lyric.className = 'm_lyric hidden';
                m_lyric.innerHTML = '收起';
                m_lyric.onclick = function () {
                    let ps = document.querySelectorAll('.song_lyric .hidden');
                    ps.forEach(e => {
                        e.style.display = 'none';
                    });
                    this.style.display = 'none';
                    more_lyric.style.display = 'block';
                    scrollTo(0, 250);
                }
                song_lyric.appendChild(m_lyric);
            }
        }
    }, function (err) {
        console.log(err);
    });
}

function songs(playlists_like, type) {
    let songs_lists = document.querySelector('.songs_lists');
    axios.get(url_resources + '/song/detail?ids=' + playlists_like.toString()).then(function (resp) {
        //列表数据渲染
        let mp3 = resp.data.songs;
        console.log(mp3);
        if (type) {
            comment_head_img.src = resp.data.songs[0].al.picUrl;

            comment_songs_name.innerHTML = resp.data.songs[0].name;
            if (resp.data.songs[0].mv != 0) {
                let span = document.createElement("span");
                span.innerHTML = "MV";
                span.onclick = function (e) {
                    e.stopPropagation();
                    localStorage.setItem("mv", resp.data.songs[0].mv);
                    window.open("mv_play.html", "mv_play");
                }
                comment_songs_name.appendChild(span);
            }

            comment_songs_artist.innerHTML = '歌手：' + resp.data.songs[0].ar[0].name;
            comment_album.innerHTML = '专辑：' + resp.data.songs[0].al.name;
            //时间格式转换
            if (parseInt(resp.data.songs[0].publishTime) == 0) {
                comment_publishTime.innerHTML = '';
            } else {
                let date = new Date(resp.data.songs[0].publishTime).toLocaleDateString();
                let date_arr = date.split('/');
                date_arr[1].length == 1 && (date_arr[1] = '0' + date_arr[1]);
                date_arr[2].length == 1 && (date_arr[2] = '0' + date_arr[2]);
                comment_publishTime.innerHTML = '发行时间：' + date_arr[0] + '-' + date_arr[1] + '-' + date_arr[2];
            }
        }
        type == 0 && mp3.forEach((element, index) => {
            let ul = document.createElement('ul');
            let li_name = document.createElement('li');
            let li_artist = document.createElement('li');
            let li_album = document.createElement('li');
            let li_time = document.createElement('li');

            ul.className = 'flex color_green cursor_pointer';
            li_name.className = 'flex4 margin_right25 padding15 overflow';
            li_artist.className = 'flex2 margin_right25 padding15 overflow';
            li_album.className = 'flex2 margin_right25 padding15 overflow';
            li_time.className = 'flex1 margin_right25 padding15 overflow color';

            li_name.innerHTML = index + 1 + ' &nbsp;&nbsp;&nbsp;' + element.name;
            if (element.mv != 0) {
                let span = document.createElement("span");
                span.innerHTML = "MV";
                span.onclick = function (e) {
                    e.stopPropagation();
                    localStorage.setItem("mv", element.mv);
                    window.open("mv_play.html", "mv_play");
                }
                li_name.appendChild(span);
            }

            for (let i = 0; i < element.ar.length; i++) {
                li_artist.innerHTML += element.ar[i].name + '&nbsp;&nbsp;&nbsp;';
            }
            li_album.innerHTML = element.al.name;
            li_time.innerHTML = tD(element.dt / 1000);
            ul.setAttribute('index', index);
            ul.appendChild(li_name);
            ul.appendChild(li_artist);
            ul.appendChild(li_album);
            ul.appendChild(li_time);
            songs_lists.appendChild(ul);

            ul.onclick = function () {
                localStorage.removeItem('id');
                localStorage.setItem('id', element.id);
                localStorage.setItem('type', 0);
                window.open('../play.html', 'music_play');
            }
        })
    }, function (err) {
        console.log(err)
    })
}

//评论头,剩余字数
let textarea = document.querySelector('.make_comment textarea');
let remain_word = document.querySelector('.make_comment p');
//发送评论按钮
let make_comment_button = document.querySelector(".make_comment_button");

textarea.oninput = function () {
    let r_words = 300 - textarea.value.length;
    if (r_words > 0) {
        remain_word.innerHTML = '剩余' + '<span>' + r_words + '</span>' + '字';
    } else {
        remain_word.innerHTML = '超过' + '<span>' + r_words + '</span>' + '字';
    }
}

//评论模块 type:id类型(歌单或者歌曲)  id  sortType:实时还是热门  type_comment:评论类型
function comment_part(type, id, sortType, type_comment) {
    //实时评论需要该参数
    let cursor;
    //点击更多时该参数+1
    let pageNo = 1;
    let url;
    comment_page(pageNo);
    function comment_page(pageNo) {
        let all_comments = document.querySelector('.comment_article_head span');
        let comments;
        if (type_comment == 1) {
            url = url_resources + `/comment/new?type=${type}&id=${id}&sortType=${sortType}&pageNo=${pageNo}&pageSize=10&time=${new Date().getTime()}`;
            comments = document.querySelector('.wonderful_comments');
        } else {
            comments = document.querySelector('.new_comments');
            url = url_resources + `/comment/new?type=${type}&id=${id}&sortType=${sortType}&cursor=${cursor}&pageNo=${pageNo}&pageSize=10&time=${new Date().getTime()}`;
        }
        axios.get(url).then(function (resp) {
            cursor = resp.data.data.cursor;
            let respond = resp.data.data;
            all_comments.innerHTML = `共${respond.totalCount}条评论`;


            respond.comments.forEach((e, index) => {
                createElementComment(e, index, id, type, comments);
            });
            let div = document.createElement('div');
            let more = document.createElement('div');
            let span = document.createElement('span');
            let go_top = document.createElement('div');

            div.className = 'more_top';
            go_top.className = 'go_top';
            span.style.width = '40px';

            if (resp.data.data.comments.length == 0) {
                more.className = 'top_comment';
                more.innerHTML = '没有更多评论';
            } else {
                more.className = 'more_comment';
                more.innerHTML = '更多';
                more.onclick = function () {
                    pageNo++;
                    comments.removeChild(div);
                    comment_page(pageNo);
                }
            }
            go_top.innerHTML = 'top';

            go_top.onclick = function () {
                scrollTo(0, 0);
            }

            div.appendChild(more);
            div.appendChild(span);
            div.appendChild(go_top);
            comments.appendChild(div);

        },
            function (err) {
                console.log(err)
            })
    }

    function createElementComment(e, index, id, type, comments) {
        let ul = document.createElement('ul');
        let img = document.createElement('img');
        let profile_message = document.createElement('div');
        let message_name = document.createElement('div');
        let message_comment = document.createElement('div');
        let message_time = document.createElement('div');
        let comment_icon = document.createElement('div');
        let good = document.createElement('span');
        let good_num = document.createElement('span');
        let make_comment = document.createElement('span');

        img.src = e.user.avatarUrl;
        message_name.innerHTML = e.user.nickname;
        message_comment.innerHTML = e.content;
        //时间格式转换
        let date = new Date(e.time);
        let date_arr = date.toLocaleDateString().split('/');
        date_arr[1].length == 1 && (date_arr[1] = '0' + date_arr[1]);
        date_arr[2].length == 1 && (date_arr[2] = '0' + date_arr[2]);
        message_time.innerHTML = date_arr[0] + '年' + date_arr[1] + '月' + date_arr[2] + '日'
        ' ' +
            date.toTimeString().slice(0, 5)

        let good_type;
        let like_type;
        let likedCount = e.likedCount;
        let like_count = false;
        if (e.liked == true) {
            like_count = true;
            good_type = false;
            good.innerHTML = '&#xe504;';
            good.style.color = 'red';
        } else {
            good_type = true;
            good.innerHTML = '&#xe502;';
            good.style.color = 'black';
        }
        good_num.innerHTML = e.likedCount;
        make_comment.innerHTML = '&#xe65e;';
        if (index == 0) {
            ul.className = 'border_top';
        }
        good.style.cursor = "pointer";
        good.onclick = make_good;

        function make_good() {
            if (good_type) {
                like_count = false;
                good.innerHTML = '&#xe504;';
                good.style.color = 'red';
                good_num.innerHTML = likedCount + 1;
                likedCount++;

            } else {
                // if (like_count == true) {
                //     good_num.innerHTML = likedCount - 1;
                // } else {
                //     good_num.innerHTML = likedCount;
                // }
                good.innerHTML = '&#xe502;';
                good.style.color = 'black';
                good_num.innerHTML = likedCount - 1;
                likedCount--;
            }

            if (good_type) {
                like_type = 1;
            } else {
                like_type = 0;
            }

            axios.get(url_resources + `/comment/like?id=${id}&cid=${e.commentId}&t=${like_type}&type=${type}&time=${new Date().getTime()}`).then(function (resp) {
                console.log(resp)

            }, function (err) { console.log(err) },
            )
            good_type = !good_type;
            good.onclick = make_good;
        }

        // let new_title = document.querySelector(".new_title");
        make_comment_button.onclick = function () {
            do_comment(1, type, id, textarea.value);
        }

        function do_comment(t, type, id, content) {
            axios.get(url_resources + `/comment?t=${t}&type=${type}&id=${id}&content=` + content).then(function (resp) {
                console.log(resp);
                if (resp.data.code == 200) {
                    location.reload();
                    // setTimeout(() => {
                    //     scrollTo(0, new_title.offsetParent.offsetTop - 35);
                    // }, 10)
                }
            }, function (err) { console.log(err); })
        }

        profile_message.className = 'profile_message';
        message_name.className = 'message_name';
        message_comment.className = 'message_comment';
        message_time.className = 'message_time';
        comment_icon.className = 'comment_icon';
        profile_message.appendChild(message_name);
        profile_message.appendChild(message_comment);
        profile_message.appendChild(message_time);
        comment_icon.appendChild(good);
        comment_icon.appendChild(good_num);
        comment_icon.appendChild(make_comment);
        ul.appendChild(img);
        ul.appendChild(profile_message);
        ul.appendChild(comment_icon);
        comments.appendChild(ul);
    }
}
