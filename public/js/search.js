let search = document.querySelector("#search");
let search_input = search.querySelector("input");
let search_icon = search.querySelector("span");

//添加点击search_icon搜索界面

search_icon.onclick = function () {
    window.open("./search_detail.html?search=" + search_input.value, "search");
};

//添加回车时间触发点击搜索

search.addEventListener("keydown", function (e) {
    if (e.key == "Enter") {
        search_icon.onclick();
    }
});