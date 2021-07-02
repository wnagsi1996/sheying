// pages/user/user.js
import {login} from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin:false,
    loginShow:false
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
       isLogin:true,
       admin:userInfo._id=='b00064a760d1e14521de3a465933c6d4'?true:false
      })
    }else{
     this.setData({
       isLogin:false,
       admin:false
      })
    }
  },
  //获取用户信息-登录
  _getUserInfo(){
    this.setData({
      loginShow:false
    })
    wx.showLoading({
      title: '登录中...',
    })
    wx.getUserProfile({
      desc: '完善资料',
      success:e=>{
        login(e.userInfo).then(res=>{
          wx.hideLoading()
          if(res){
            this.setData({
              userInfo:wx.getStorageSync('userInfo'),
              isLogin:true
             })
          }
        })
    }, 
      fail:err=>{
        wx.hideLoading()
        wx.showToast({
          title:'用户点击取消',
          icon:'none'
        })
      }
    })
  },
  //导航跳转
  toUrl(e){
    if(this.data.isLogin){
      const url=e.currentTarget.dataset.url;
      wx.navigateTo({
        url
      })
    }else{
      wx.showModal({
        content: '请先登录',
        success:(res)=>{
          if (res.confirm) {
            this.setData({
              loginShow:true
            })
          }
        }
      })
    }
  },
  _handPhone(){
    wx.makePhoneCall({
      phoneNumber: '18350716162',
      success:()=>{},
      fail:()=>{}
    })
  },
})