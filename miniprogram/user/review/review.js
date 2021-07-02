// miniprogram/user/review/review.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    size:20,
    index:0,
    list:[],
    recommend:true
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
    const {index,size}=this.data
    const res=await wx.cloud.callFunction({
      name:'Article',
      data:{
        action:'review',
        recommend:this.data.recommend,
        size,
        index
      }
    })
    wx.hideLoading()
    if(res.result.code=='1'){
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
  },
  onClick(e){
    this.setData({
      recommend:e.detail.name==0?true:false,
      index:0
    })
    this.getList()
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
        const {recommend}=this.data;
          Dialog.confirm({
            message: recommend?'确定要取消推荐吗':'确定要推荐该文章吗',
          }).then(async () => {
            wx.showLoading({
              title: '取消中...',
            })
            const res= await wx.cloud.callFunction({
              name:'Article',
              data:{
                _id:id,
                action:'adminRecommend',
                userId:wx.getStorageSync('userInfo')._id
               }
            })
            if(res.result.code=='1'){
              wx.showToast({
                title: recommend?'取消成功':'推荐成功',
              })
              let list=this.data.list;
              list=list.filter(n=>n._id!=id)
              this.setData({
                list
              })
            }else{
              wx.showToast({
                title: recommend?'取消失败':'推荐失败',
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})