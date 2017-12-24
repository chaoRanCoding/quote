//app.js
App({
  globalData:{
    openId:null,
    userId:null,
    userName:'',
    userImg: '',
    allList:[],
    baseUrl: 'https://wx.chongdian.club/quotationapp.php'
  },
  onLaunch:function(){
   var that = this;
   wx.login({
    success: function (res) {
      var appid = 'wxb23e25589f711f3a';
      var secret = '13948f85806505e20897cb6100dd7a57';
      wx.getUserInfo({
        success: function (res) {
          that.globalData.userName = res.userInfo.nickName,
            that.globalData.userImg = res.userInfo.avatarUrl
        }
      }), 
      wx.request({
        method: 'POST',
        url: that.globalData.baseUrl,
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data:{
          evUrl:'/quotation/getOpenId',
          evdata: '{"jsCode":"'+res.code+'"}'
        },
        success: function (res) { 
          var data = res.data;
          if(data.code==0) 
          {
            that.globalData.openId = data.data.openId;  
          wx.request({
            url: that.globalData.baseUrl,
            method: 'POST',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
              'evUrl': '/quotation/login',
              'evdata': '{"openId":"' + that.globalData.openId+'"}'
            },
            success: function (res) {
              var data = res.data;
              if(data.code==0)
              {
                that.globalData.userId = data.data.userId;
              }else{
               
              }
            },
            fail:function(res){
              wx.showToast({
                title: "登录失败",
                icon: 'loading',
                duration: 1500,
                mask: true

              })
            }
          })
          }else{
            wx.showToast({
              title: "登录失败",
              icon: 'loading',
              duration: 1500,
              mask: true

            })
          }
        }
      })
    }
   })
  //    wx.request({
  //      url: that.globalData.baseUrl,
  //      method: 'POST',
  //      header: {
  //        'Content-Type': 'application/x-www-form-urlencoded'
  //      },
  //      data:{
  //        'evUrl': '/quotation/getProductInfo',
  //        'evdata': ''
  //      },
  //      success: function (res) {
  //        var data = res.data;
  //        if (data.code == 0) {
  //        var list = data.data;
  //        list.forEach(function (v, i) {
  //          v["price"] = (v["price"]/100).toFixed(2);
  //          v["marketPrice"] = (v["marketPrice"] / 100).toFixed(2);    
  //        })
  //        that.globalData.allList = list;
  //      }else{
  //          wx.showToast({
  //            title: '无数据',
  //            icon: 'loading',
  //            duration: 1500
  //          })
  //      }
  //      },
  //      fail:function(){
  //        wx.showToast({
  //          title: '无数据',
  //          icon:'loading',
  //          duration:1500
  //        })
  //      }
  //    })
     

    
  }
})  