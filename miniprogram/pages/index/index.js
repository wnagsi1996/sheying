// index.js
// 获取应用实例
import {authorize} from '../../utils/util'
const app = getApp()

Page({
  data: {
    list:[]
  },
  onLoad() {
    this.getArticle();
  },
  getArticle(){
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      name:'Article',
      data:{
        action:'recommed'
      }
    }).then(res=>{
      wx.hideLoading()
      if(res.errMsg=='cloud.callFunction:ok'){
        let data=res.result.data;
        data.forEach(n=>{
          if(n.imgList.includes(',')){
           n.imgsrc=n.imgList.split(',')[0]
          }else{
           n.imgsrc=n.imgList
          }
        })
        this.setData({
          list:data
        })
      }
      console.log(res)
    }).catch(err=>{
      wx.hideLoading()
      console.log(err)
    })
  },
  _handSwiper(e){
    const id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../desc/desc?id=${id}`
    })
  },
  onShareAppMessage:function(e){
    const {_id}=wx.getStorageSync('userInfo');
    return{
      title: '分享生活中精美图片',
      path: '/page/index/index?id='+_id
    }
  }
})
