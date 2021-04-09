export { downloadFile }
function downloadFile(url, fileName) {
    var x = new XMLHttpRequest()
    x.open('GET', url, true)
    x.responseType = 'blob'
    x.onload = function (e) {
        //会创建一个 DOMString，其中包含一个表示参数中给出的对象的URL。这个 URL 的生命周期和创建它的窗口中的 document 绑定。这个新的URL 对象表示指定的 File 对象或 Blob 对象。
        var url = window.URL.createObjectURL(x.response)
        var a = document.createElement('a')
        a.href = url
        a.download = fileName
        a.click()
    }
    x.send()
}
