var app = getApp()
Page({
  data:{
    list: [],
    total:0,
    totalAmount:0,
    startX: 0, //开始坐标
    startY: 0,
    disableFlag:false
  },
  onLoad:function(){
    this.getList();
  },
  onShow: function (options)
  { 
    this.getList();
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
    var that = this;
    wx.request({
      url: app.globalData.baseUrl,
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        'evUrl': '/quotation/deleteTrolley',
        'evdata':'{"trolleyId":'+e.currentTarget.dataset.trolley+'}'
       
      },
      success: function (res) {
        var data = res.data;
        if (data.code == 0) {
          that.getList();
        } else {
          wx.showToast({
            title: '操作失败',
            icon: "loading",
            duration: 1000
          })
        }
      }
    })
   },
   calculate:function(){
     var list = this.data.list;
     var total = 0;
     for(var i in list){
         total += list[i].startTotal * 1 * list[i].quotation; 
     }
     this.setData({
       total: total.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'),
       totalAmount:total
     })     
   },
   inputChange:function(e){
     var that = this,
       types = e.currentTarget.dataset.type,
       index = e.currentTarget.dataset.index,//当前索引
       value = e.detail.value,
       minValue = e.currentTarget.dataset.min;
        that.data.list.forEach(function (v, i) {
          if (i == index) {
            v[types]=value;
          }
        })
         var list = that.data.list;  
        var arr = [];
        // for (var i = 0; i < list.length; i++) {
        var info = '{ "trolleyId":' + list[index].trolleyId + ', "quotation": ' + list[index].quotation * 100 + ', "startTotal":' + list[index].startTotal + '}';
         arr.push(info)
        // }
        wx.request({
          url: app.globalData.baseUrl,
          method: 'POST',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: {
            'evUrl': '/quotation/putTrolley',
            'evdata': '{"upArray":[' + arr + ']}'
          },
          success: function (res) {
            var data = res.data;
            if (data.code == 0) {
              that.calculate();
            }
          },
          fail: function () {
            console.log("fail");
          }
        })
    },
    toTest:function(){
      var that = this;
      var list = this.data.list;
      if(list.length>0){
      var arr = [];
      for (var i = 0; i < list.length; i++) {
        var info = '{"trolleyId":'+list[i].trolleyId+',"count":'+list[i].startTotal+',"quotation":'+list[i].quotation*100+'}';
        arr.push(info);
      }
      wx.request({
        url: app.globalData.baseUrl,
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          evUrl:'/quotation/postQuotation',
          'evdata': '{"quotations":[' + arr + '],"userId":"' + app.globalData.userId + '","totalAmount":"' + that.data.totalAmount*100+'"}'
        },
        success: function (res) {
          var data = res.data;
          if (data.code == 0) {
            var quotationCode = data.data.quotationCode;
            wx.navigateTo({
              url: '../quotationDetail/quotationDetails?id=' + quotationCode
            })
          }else{
            wx.showToast({
              title: '生成失败',
              icon: "loading",
              duration: 2000
            })
          }
        },
        fail: function () {
          console.log("fail");
        }
      })
      }else{
        wx.showToast({
          title: '报价单为空',
          icon: "loading",
          duration: 2000
        })
      }
    },
    getList:function(){
      var that = this;
      wx.request({
        url: app.globalData.baseUrl,
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          'evUrl': '/quotation/getTrolley',
          'evdata':'{"userId": "'+app.globalData.userId+'"}'
        },
        success: function (res) {
          var data = res.data;
          if (data.code == 0) {
            var list = data.data;
            list.forEach(function (v, i) {
              v["quotation"] = (v["quotation"] / 100);
              v["marketPrice"] = (v["marketPrice"] / 100);
              v["productName"] = v["productName"] + that.selectProduct(v["productId"]);
            });
            that.setData({
              list: list
            })
          } else {
            wx.showToast({
              title: '获取失败',
              icon: "loading",
              duration: 2000
            })
          }
          that.calculate();
        },
        fail: function () {
          console.log("fail");
        }
      })
    },
    toDetails: function (e) {
      var id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '../detail/details?id=' + id,
      })
    },
    selectProduct: function (id) {
      var list = app.globalData.allList;
      var productVersion = "";
      var activePower = "";
      for (var j in list) {
        if (id == list[j].productId) {
          if (list[j].productVersion==null)
          {
            productVersion=""
          }else{
            productVersion = list[j].productVersion;
          }
          if (list[j].activePower == null) {
            activePower = ""
          } else {
            activePower = list[j].activePower+"KW";
          }
          return productVersion + activePower;

        }
      }
    }
    
})