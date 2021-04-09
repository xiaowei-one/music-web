import { url as url_resources } from "./url.js";


let video = document.querySelector("video");
let mv_id = localStorage.getItem('mv');
axios.get(url_resources + `/mv/url?id=${mv_id}`).then(function (resp) {
    console.log(resp);
    video.src = resp.data.data.url;
    video.volume = 0.05;
}, function (err) { console.log(err); })


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

comment_part(1, mv_id, 2, 1);
comment_part(1, mv_id, 3, 0);

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
            console.log(resp);
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

//相关mv模块
let related_mvs = document.querySelector(".mvs");
let related_mvs_img = related_mvs.querySelectorAll("img");
let related_mvs_name = related_mvs.querySelectorAll(".related_mvs_name");
let related_mvs_artist = related_mvs.querySelectorAll(".related_mvs_artist");
axios.get(url_resources + "/simi/mv?mvid=" + mv_id).then(function (resp) {
    console.log(resp.data);
    for (let i = 0; i < 4; i++) {
        related_mvs_img[i].src = resp.data.mvs[i].cover;
        related_mvs_name[i].innerHTML = resp.data.mvs[i].name
        related_mvs_artist[i].innerHTML = resp.data.mvs[i].artistName;

        let id = resp.data.mvs[i].id;
        related_mvs_img[i].onclick = function () {
            localStorage.removeItem("mv");
            localStorage.setItem("mv", id);
            window.open("mv_play.html", "mv_play");
        }

        related_mvs_name[i].onclick = function () {
            localStorage.removeItem("mv");
            localStorage.setItem("mv", id);
            window.open("mv_play.html", "mv_play");
        }
    }
}, function (err) { console.log(err); });
