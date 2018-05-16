// pages/movies/movies.js
var app=getApp();
var utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryTitle1:"正在热映",
    categoryTitle2: "即将上映",
    categoryTitle3: "豆瓣Top250",
    containerShow:true,
    hasMoreMovies: true,
    totalCount: 0,
    searchMovies: [],
    q:"",
    requestUrl:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //转发接口的页码无效....
    var inTheatersUrl = app.globalData.doubanBase +"/v2/movie/in_theaters?start=0&count=3";
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon?start=0&count=3";
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250?start=0&count=3";

    //异步加载顺序不确定
    this.sendRequest(inTheatersUrl,"inTheaters");
    this.sendRequest(comingSoonUrl,"comingSoon");
    this.sendRequest(top250Url,"top250");
  },

  //发送请求
  sendRequest: function (url, blockKey){
    var that=this
    wx.request({
      url: url,
      method: "GET",
      data: {},
      header: {
        "Content-Type": "json",
      },
      success: function (res) {
        //处理返回数据
        that.handleDoubanResponseData(res.data, blockKey);
      },
      fail: function (res) {
        //断网之类，请求不发送才会进入
        console.log("失败", res)
      },
      complete: function () { }
    })
  },

  //处理返回数据
  handleDoubanResponseData: function (moviesData, blockKey){
    console.log("moviesData", moviesData)
    var movies=[];
    for (var index in moviesData.subjects){
      var subject = moviesData.subjects[index];
      var title=subject.title;
      if(title.length>=6){
        title=title.substring(0,6)+"...";
      }
      var temp={
        title:title,
        average:subject.rating.average,
        coverImg:subject.images.large,
        movieId:subject.id
      }
      movies.push(temp)
    }
    if (blockKey =="inTheaters"){
      this.setData({
        inTheaters: movies
      })
    } else if (blockKey =="comingSoon"){
      this.setData({
        comingSoon: movies
      })
    }else{
      this.setData({
        top250: movies
      })
    }
  },

  onMoreTap:function(e){
    var category = e.currentTarget.dataset.category
    wx.navigateTo({
      url: 'more-movies/more-movies?category=' + category
    })
  },
  //电影详情
  onMovieDetail:function(e){
    var movieid = e.currentTarget.dataset.movieid
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + movieid
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

//点击搜索，获取光标
  onBindFocus:function(e){
    this.setData({
      containerShow:false
    })
  },
  //取消搜索
  onCancelSearch:function(){
    this.setData({
      containerShow: true,
      hasMoreMovies: true,
      totalCount: 0,
      searchMovies: [],
      q: "",
      requestUrl: ""
    })
  },
  //确认搜索
  onBandConfimTap:function(event){
    var url = app.globalData.doubanBase + "/v2/movie/search";
    this.setData({
      q: event.detail.value,
      requestUrl: url
    })
    var realUrl = url + "?start=0&count=18&q=" + event.detail.value;
    console.log("realUrl", realUrl)
    utils.sendHttpRequest(realUrl, this.handlSearchResultDatas);
    wx.showNavigationBarLoading();
  },

  //处理返回数据
  handlSearchResultDatas: function (moviesData) {
    console.log("moviesData", moviesData)
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
      if (that.data.searchMovies.length > 0) {
        movieList = that.data.searchMovies.concat(movies);
      } else {
        movieList = movies;
      }
      totalCount = that.data.totalCount + 18;
      hasMoreMovies = true;
    } else {
      movieList = that.data.searchMovies
      totalCount = that.data.totalCount
      hasMoreMovies = false
    }

    that.setData({
      hasMoreMovies: hasMoreMovies,
      totalCount: totalCount,
      searchMovies: movieList
    })
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    if (!that.data.containerShow) {
      var requestUrl = that.data.requestUrl;
      if (that.data.hasMoreMovies) {
        var realUrl = requestUrl + "?start=" + that.data.totalCount + "&count=18&q=" + that.data.q
        console.log("realUrlaaa", realUrl)
        utils.sendHttpRequest(realUrl, that.handlSearchResultDatas);
        wx.showNavigationBarLoading();
      }
    }
  },
})