global.$ = $

const {
  dialog,
  clipboard
} = require('electron').remote
const clipboardWatcher = require('electron-clipboard-watcher')

var md5 = require('blueimp-md5')
var appKey = 'your app key'
var key = 'your secret key'
var notification
var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")

function requestYoudaoAPI(word) {
  // console.log('input-text==> ' + JSON.stringify(word))
  if (word == '' || word == null) {
    console.log(dialog.showErrorBox('提示', '查询内容不能为空' + word))
    var option = {
      title: word,
      body: "查询内容不能为空"
    }
    new Notification(word, option)
    return
  }
  if (word.length > 100) {
    console.log("超过长度限制")
    return
  }
  var salt = (new Date).getTime()
  // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
  var from = 'auto'
  var to = 'auto'
  var str1 = appKey + word + salt + key
  var sign = md5(str1)
  $.ajax({
    url: 'http://openapi.youdao.com/api',
    type: 'post',
    dataType: 'jsonp',
    data: {
      q: word,
      appKey: appKey,
      salt: salt,
      from: from,
      to: to,
      sign: sign
    },
    success: function (data) {
      var query_result = JSON.stringify(data, null, 4)
      var queryJobj = ''
      if (data != undefined) {
        if (data.basic != undefined && data.basic.hasOwnProperty('phonetic')) {
          queryJobj = JSON.stringify(data.basic.phonetic) + ' \nexplain:' + JSON.stringify(data.basic.explains)
        } else if (data.hasOwnProperty('basic')) {
          queryJobj = 'explain:' + JSON.stringify(data.basic.explains)
        } else if (data.translation != undefined) {
          queryJobj = 'translation:' + JSON.stringify(data.translation)
        } else {
          queryJobj = 'translation:' + JSON.stringify(data)
        }
      }
      var parse_result = queryJobj
      document.getElementById('txt-trans-result').textContent = query_result
      var option = {
        title: word,
        body: parse_result
      }
      new Notification(word, option)
    },
  })
}

function createWidget() {
  clipboardWatcher({
    // (optional) delay in ms between polls
    watchDelay: 10,

    // handler for when image data is copied into the clipboard
    onImageChange: function (nativeImage) {},

    // handler for when text data is copied into the clipboard
    onTextChange: function (text) {
      var stripped = text.replace(pattern, '')
      try {
        var cb = document.getElementById('copy-cb')
        if (cb.checked) {
          requestYoudaoAPI(stripped.toLowerCase().trim())
        }
      } catch (error) {
        requestYoudaoAPI(stripped.toLowerCase().trim())
      }
    }
  })
  document.getElementById('btn-query').onclick = function () {
    var word = document.getElementById('input-text').value
    requestYoudaoAPI(word)
  }
  document.getElementById('input-text').focus()
}

$(document).ready(function () {
  createWidget()
})