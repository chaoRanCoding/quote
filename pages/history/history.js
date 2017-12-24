// history.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    });
    var that = this;
    wx.request({
      url: app.globalData.baseUrl,
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        'evUrl':'/quotation/getHistory',
        'evdata': '{"userId":"'+app.globalData.userId+'"}'
      },
      success: function (res) {
        var data = res.data;
        if (data.code == 0) {
          wx.hideLoading();
          var list = data.data;
          if(list.length==0){
            wx.showToast({
              title: '暂无历史',
              icon: "loading",
              duration: 1000
            })
          }else{
          list.forEach(function (v, i) {
            v["totalAmount"] = (v["totalAmount"] / 100).toFixed(2);
          })
          that.setData({
            list: list.reverse()
          })
          }
        } else {
          wx.showToast({
            title: '获取失败',
            icon: "loading",
            duration: 1000
          })
        }
      },
      fail:function(){
        wx.showToast({
          title: '请求超时',
          icon: "loading",
          duration: 1000
        })
      }
    }) 
  },
  touchS: function (e) {
    this.data.list.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      list: this.data.list
    });
  },
  touchM: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.list.forEach(function (v, i) {
      v.isTouchMove = false
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    that.setData({
      list: that.data.list
    })
  },
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  del: function (e) {
    console.log(e.currentTarget.dataset.index)
    this.data.list.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      list: this.data.list
    });
  },
  toList:function(e){
    var quotationCode = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../quotationDetail/quotationDetails?id=' + quotationCode,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})