// pages/quotationDetail/quotationDetails.js
var app = getApp()
Page({
  data: {
    quotationCode:'',
    list:[],
    total:0
  },
  onLoad: function (options) {
    var that= this;
        wx.showLoading({
          title: '加载中',
        });
        var quotationCode = options.id;
        this.setData({
          quotationCode: quotationCode
        });
        wx.request({
          url: app.globalData.baseUrl,
          method: 'POST',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data:{
            'evUrl':'/quotation/queryQuotation',
            'evdata': '{"quotationCode":"' + quotationCode+'"}'
          },
          success: function (res) {
            var data = res.data;
            if (data.code == 0) {
              wx.hideLoading();
              var list = data.data.quotations;
              var total = data.data.totalAmount/100;
              total =total.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
              list.forEach(function (v, i) {
                v["marketPrice"] =( v["quotation"] / (v["marketPrice"] )).toFixed(2);
                v["quotation"] = (v["quotation"]/100);   
                v["productName"] = v["productName"] + that.selectProduct(v["productId"]);
              })
              that.setData({
                list: list,
                total: total
              })
            } else {
              wx.showToast({
                title: '请求失败',
                icon:"loading",
                duration:1500
              })
            }
          }
        })
  },
  selectProduct: function (id) {
    var list = app.globalData.allList;
    var productVersion = "";
    var activePower = "";
    for (var j in list) {
      if (id == list[j].productId) {
        if (list[j].productVersion == null) {
          productVersion = ""
        } else {
          productVersion = list[j].productVersion;
        }
        if (list[j].activePower == null) {
          activePower = ""
        } else {
          activePower = list[j].activePower + "KW";
        }
        return productVersion + activePower;

      }
    }
  },
  onShareAppMessage: function () {
      
  }
})