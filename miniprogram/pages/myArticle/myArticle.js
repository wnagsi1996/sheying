// pages/myArticle/myArticle.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:0,
    size:20
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userInfo=wx.getStorageSync('userInfo')
    this.setData({
      id:userInfo._id
    })
   this.getList()
  },
  getList(){
    wx.showLoading({
      title: '加载中...',
    })
    const {index,size,id}=this.data
    wx.cloud.callFunction({
      name:'GetMyArticleList',
      data:{
        index,
        size,
        id
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
        console.log(data)
        if(index==0){
          wx.setNavigationBarTitle({
            title: res.result.name.name
          })
        }
      }
    }).catch(err=>{
      wx.hideLoading()
    })
    
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