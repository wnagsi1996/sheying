// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    list:[]
  },
  onLoad() {
    this.getArticle()
  },
  getArticle(){
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      name:'GetArticleRecommed'
    }).then(res=>{
      wx.hideLoading()
      if(res.errMsg=='cloud.callFunction:ok'){
        this.setData({
          list:res.result.data
        })
      }
      console.log(res)
    }).catch(err=>{
      wx.hideLoading()
      console.log(err)
    })
  }
})
