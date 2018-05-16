// pages/posts/posts.js
//引入数据，不能用绝对路径
var postData = require("../data/post-data.js");//绝对路径无效
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      post_content: postData.postList,
    })
  },
  //进入详情页面
  onPostTap: function (e) {
    //跳转子页面
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + e.currentTarget.dataset.postid,
    })
  },
  //点击轮播图跳转
  onSwiperTap:function(e){
    //target 和 currentTarget
    //target指的是image当前点击的组件, currentTarget指的是swiper事件捕获的组件
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + e.target.dataset.postid,
    })
  }
})