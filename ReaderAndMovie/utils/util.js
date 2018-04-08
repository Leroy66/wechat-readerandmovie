const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 发网络请求
function sendHttpRequest(url, callBack, start, count,q) {
  wx.request({
    url: url,
    method: "POST",
    data: {
      start: start,
      count: count,
      q:q,
    },
    header: {
      "Content-Type": "",
    },
    success: function (res) {
      callBack(res.data)
    },
    fail: function (res) {
      //断网之类，请求不发送才会进入
      console.log("失败", res)
    },
    complete: function () { }
  })
}

module.exports = {
  formatTime: formatTime,
  sendHttpRequest: sendHttpRequest
}
