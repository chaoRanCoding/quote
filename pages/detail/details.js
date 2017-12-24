// pages/detail/details.js
var app = getApp()
Page({
  data: {
    allList:[],
    product:{},
    checkList:[],
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true
  },
  onLoad: function (options) {
    var that = this;
    this.setData({
      allList: app.globalData.allList
    })
    var id = options.id;  
    var data = this.selectProduct(id);
    this.getImg(id);
    this.setData({
      product: data
    });
  },
  selectProduct: function (id) {
    for (var j in this.data.allList) {
      if (id == this.data.allList[j].productId) {
        return this.data.allList[j];
      }
    }
  },
  getImg: function (id){
    var that = this;
    wx.request({
      url: app.globalData.baseUrl,
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        'evUrl': '/quotation/getProductPic',
        'evdata': '{"productId":"' + id + '"}'
      },
      success: function (res) {
        var data = res.data;
        if (data.code == 0) {
          that.setData({
            imgUrls: data.data.picUrls
          });
        } else {
          wx.showToast({
            title: '图片加载失败',
            icon: "loading",
            duration: 1000
          })
        }
      }
    })  
  },
  add:function(e){
    var productId = this.data.product.productId;
      var info = '{ "productId":'+productId+'}';
    wx.request({
      url: app.globalData.baseUrl,
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        'evUrl':'/quotation/addTrolley',
        'evdata': '{"userId":"' + app.globalData.userId + '","products":['+info+']}'
       
      },
      success: function (res) {
        var data = res.data;
        if (data.code == 0) {
          wx.showToast({
            title: '加入成功',
            icon: "success",
            duration: 1000
          })
        } else {
          wx.showToast({
            title: '加入失败',
            icon: "loading",
            duration: 1000
          })
        }
      }
    })  
      }

})