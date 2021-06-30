// pages/user/user.js
import {login} from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    const userInfo=wx.getStorageSync('userInfo');
   
    if(userInfo){
      this.setData({
       userInfo,
       isLogin:true
      })
    }else{
     this.setData({
       isLogin:false
      })
    }
  },
  //获取用户信息-登录
  _getUserInfo(e){
    wx.getUserProfile({
      desc: '完善资料',
      success:e=>{
        login(e.userInfo).then(res=>{
          if(res){
            this.setData({
              userInfo,
              isLogin:true
             })
          }
        })
    }, 
      fail:err=>{
        wx.showToast({
          title:'用户点击取消',
          icon:'none'
        })
      }
    })
  },
  //导航跳转
  toUrl(e){
    const url=e.currentTarget.dataset.url;
    wx.navigateTo({
      url
    })
  }
})