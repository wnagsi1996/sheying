// pages/myLike/myLike.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import {getUserInfo} from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:0,
    size:20,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
  },
  async getList(){
    wx.showLoading({
      title: '加载中...',
    })
    const {index,size}=this.data;
    const res= await wx.cloud.callFunction({
      name:'Article',
      data:{
        action:'GetMyLike',
        index,
        size,
        id:wx.getStorageSync('userInfo')._id
      }
    })
    wx.hideLoading()
    console.log(res)
    if(res.errMsg=='cloud.callFunction:ok'){
      if(res.result.code==1){
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
    }
  },
   //关闭
   onClose(event){
    const { position, instance } = event.detail;
    const {id}=event.currentTarget.dataset;
    switch (position) {
      case 'left':
      case 'cell':
        instance.close();
        break;
      case 'right':
        Dialog.confirm({
          message: '确定删除吗？',
        }).then(async () => {
          wx.showLoading({
            title: '删除中...',
          })
          const res= await wx.cloud.callFunction({
            name:'LikeArticle',
            data:{
              _id:id,
              type:'cancel',
              userId:wx.getStorageSync('userInfo')._id
             }
          })
          console.log(res)
          if(res.result.code=='1'){
            wx.showToast({
              title: '删除成功',
            })
            let list=this.data.list;
            list=list.filter(n=>n._id!=id)
            this.setData({
              list
            })
            getUserInfo()
          }else{
            wx.showToast({
              title: '删除失败',
              icon:'none'
            })
          }
          wx.hideLoading()
          instance.close();
        });
        break;
    }
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      index:0
    })
    this.getList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      index:this.data.index++
    })
    this.getList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})