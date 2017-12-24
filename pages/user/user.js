// user.js
var app = getApp();
Page({

  data: {
    userName:'',
    userImg:''
  },

  onLoad: function (options) {
    this.setData({
      userName: app.globalData.userName,
      userImg: app.globalData.userImg
    })
  },
  toHistory:function(){
    wx.navigateTo({
      url: '../history/history',
    })
  }
})
