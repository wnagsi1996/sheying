// pages/user/user.js
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
  //获取用户信息
  _getUserInfo(e){
    wx.getUserProfile({
      desc: '完善资料',
      success:e=>{
        console.log(e)
        wx.cloud.callFunction({
          name:'Login',
          data:e.userInfo,
          success:res=>{
           console.log(res.result.data)
           if(res.errMsg=='cloud.callFunction:ok'){
             if(res.result.data.length>0){
               const userInfo=res.result.data[0];
               this.setData({
                userInfo,
                isLogin:true
               })
               wx.setStorageSync('userInfo', userInfo)
             }
           }
          },
          fail:err=>{
            console.log(err)
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