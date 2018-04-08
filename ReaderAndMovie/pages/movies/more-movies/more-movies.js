// pages/movies/more-movies/more-movies.js
var utils = require('../../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigateTitle: "",
    totalCount: 0,
    requestUrl: "",
    hasMoreMovie: true,
    movies: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.data.navigateTitle = options.category
    var url = "";
    switch (options.category) {
      case "正在热映":
        url = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        url = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;
      case "豆瓣Top250":
        url = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }
    that.setData({
      requestUrl: url
    })
    if (that.data.hasMoreMovie) {
      utils.sendHttpRequest(url, that.handleDoubanResponseData, 0, 21,"");
      wx.showNavigationBarLoading();
    }
  },

  //处理返回数据
  handleDoubanResponseData: function (moviesData) {
    console.log("callback", moviesData)
    var that = this
    var movies = [];
    for (var index in moviesData.subjects) {
      var subject = moviesData.subjects[index];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        title: title,
        average: subject.rating.average,
        coverImg: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }

    var movieList = [];
    var totalCount;
    var hasMoreMovies;
    if (movies.length > 0) {
      if (that.data.movies.length > 0) {
        movieList = that.data.movies.concat(movies);
      } else {
        movieList = movies;
      }
      totalCount = that.data.totalCount + 21;
      hasMoreMovies = true;
    } else {
      movieList = that.data.movies
      totalCount = that.data.totalCount
      hasMoreMovies = false
    }

    that.setData({
      hasMoreMovies: hasMoreMovies,
      totalCount: totalCount,
      movies: movieList
    })
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () {
    var that = this
    var requestUrl = that.data.requestUrl;
    if (that.data.hasMoreMovies) {
      utils.sendHttpRequest(requestUrl, that.handleDoubanResponseData, that.data.totalCount, 21,"");
      wx.showNavigationBarLoading();
    }
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,
    })

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
    console.log("监听用户下拉动作")
    this.setData({
      totalCount: 0,
      hasMoreMovie: true,
      movies: [],
    })
    utils.sendHttpRequest(this.data.requestUrl, this.handleDoubanResponseData, 0, 21,"");
    wx.showNavigationBarLoading();
  },



  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})