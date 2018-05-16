// pages/posts/post-detail/post-detail.js
var postData = require("../../data/post-data.js");//绝对路径无效
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlayingMusic: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var currentId = options.id;
    var that = this
    that.setData({
      currentId: currentId,
      postDetail: postData.postList[currentId]
    })

    //处理是否收藏
    var postCollected = wx.getStorageSync("posts_collected")
    if (postCollected) {
      var collected = postCollected[currentId]
      that.setData({
        collected: collected
      })
    } else {
      var collected = {}
      collected[currentId] = false;
      wx.setStorageSync("posts_collected", collected);
    }
    if (app.globalData.g_isPlayingMusic && (app.globalData.g_playingMusicId == currentId)){
      that.setData({
        isPlayingMusic: true
      })
    }   
    this.checkIsPlayingMusic();
  },

  //监听是否在播放音乐
  checkIsPlayingMusic:function(){
    var that=this
    //音乐播放
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayingMusic: true
      })
    })
    //音乐暂停
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_playingMusicId=null
    })
    //音乐停止
    wx.onBackgroundAudioStop(function(){
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_playingMusicId = null
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //收藏和取消收藏操作
  onCollectionTap: function () {
    var that = this
    var currentId = that.data.currentId
    var postsCollection = wx.getStorageSync("posts_collected");
    var collected = postsCollection[currentId];
    postsCollection[currentId] = !collected;
    //修改缓存
    wx.setStorageSync("posts_collected", postsCollection)
    //修改界面显示的图片
    that.setData({
      collected: !collected
    })
    //无需确认的弹窗
    wx.showToast({
      title: collected ? "取消成功" : "收藏成功",
      duration: 1000,
      icon: "success"
    })
  },

  //分享操作
  onShareTap: function () {
    var itemList = [
      "分享到微信朋友圈",
      "分享到微信好友",
      "分享到微博",
      "分享到豆瓣",
      "分享到QQ"
    ]
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f08",
      success(res) {
        console.log("确认分享", res.tapIndex)
      },
      fail(res) {
        console.log("取消分享", res)
      }
    })
  },

  //音乐播放和暂停
  onMusicTap: function () {
    var that = this
    if (that.data.isPlayingMusic) {
      //去暂停
      wx.pauseBackgroundAudio();
      that.setData({
        isPlayingMusic: false
      })
    } else {
      //去播放
      wx.playBackgroundAudio({
        dataUrl: that.data.postDetail.music.url,
        title: that.data.postDetail.music.title,
        coverImgUrl: that.data.postDetail.music.coverImg
      })
      that.setData({
        isPlayingMusic: true
      })
      app.globalData.g_isPlayingMusic = true
      app.globalData.g_playingMusicId = that.data.currentId
    }
  }

})