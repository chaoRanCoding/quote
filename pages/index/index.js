//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    list:[],
    edit:false,
    checkedAll:false,
    checkList:[],
    checkedAllBtn:false
  },
  onLoad:function(){
    wx.showLoading({
      title: '加载中',
    })
    this.getList();
  },
  checkboxChange: function (event){
    this.setData({
      checkList: event.detail.value
    });
    this.toStorage(this.data.checkList);
    var length = this.data.checkList.length;
    var allLength = this.data.list.length;
    if (length<allLength){
      this.setData({
        checkedAllBtn: false
      })
    } else if (length = allLength){
      this.setData({
        checkedAllBtn: true
      })
    }
  },
  checkedALL: function (event) {
    var flag = event.detail.value[0];
    flag ? this.setData({
      checkedAll: true,
      checkedAllBtn: true
    }) : this.setData({
        checkedAll: false,
        checkedAllBtn: false
    })
    if (this.data.checkedAll){
      var list = [];
      for (var i in this.data.list)
      {
        list.push(this.data.list[i].productId);
      }
      this.setData({
        checkList: list
      })
    }else{
      this.setData({
        checkList: []
      })
    }
    this.toStorage(this.data.checkList);
  },
  priceList:function(){
    var list = this.data.checkList;
    if(list.length==0)
    {
      wx.showToast({
        title: '尚未选择产品',
        icon: "loading",
        duration: 1000
      })
    }else{
    var arr = [];
    for(var i = 0;i<list.length;i++)
    {
      var info = '{"productId":'+list[i]+'}';
      arr.push(info)
    }
    wx.request({
      url: app.globalData.baseUrl,
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data:{
        'evUrl': '/quotation/addTrolley',
        'evdata': '{"products":['+arr+'],"userId":"'+app.globalData.userId+'"}'
      },
      success: function (res) {
        var data = res.data;
        if(data.code==0)
        {
          wx.showToast({
            title: '加入成功',
            icon: "success",
            duration: 1000
          })
        }else{
          wx.showToast({
            title: '加入失败',
            icon: "loading",
            duration: 1000
          })
        }
      }
    })  
    }
  },
  toDetails: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/details?id=' + id,
    })
  },
  toStorage:function(data){
    try {
      wx.setStorageSync('checkList',data)
    } catch (e) {
    }
  },
  onPullDownRefresh: function () {
    var  that = this;
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      that.getList();
    }, 3000);
  },
  getList:function(e){
    var that = this;
    wx.request({
      url: app.globalData.baseUrl,
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        'evUrl': '/quotation/getProductInfo',
        'evdata': ""
      },
      success: function (res) {
        var data = res.data;
        if (data.code == 0) {
          wx.hideLoading();
          var list = res.data.data;
          list.forEach(function (v, i) {
            v["price"] = (v["price"] / 100+0.004).toFixed(2);
            v["marketPrice"] = (v["marketPrice"] / 100+0.004).toFixed(2);
          })
          that.setData({
            list: list
          });
          app.globalData.allList = list;
          wx.stopPullDownRefresh();
        } else {
          wx.showToast({
            title: '请求失败',
          });
          wx.stopPullDownRefresh();
        }
      }
    })
  }

})
