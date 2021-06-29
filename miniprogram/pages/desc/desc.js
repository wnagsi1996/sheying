// pages/desc/desc.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    goodsDesc:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {id}=options;
    this.setData({
      id
    })
    this.getDesc(id)
  },
  getDesc(id){
     wx.cloud.callFunction({
        name:'GetArticleDesc',
        data:{
          id
        }
      }).then(res=>{
        console.log(res)
        if(res.errMsg=='cloud.callFunction:ok'){
          wx.setNavigationBarTitle({
            title: res.result.title,
          })
          let imgList=res.result.imgList.split(',');
          console.log(imgList)
          this.setData({
            goodsDesc:res.result,
            imgList
          })
        }else{
          wx.navigateBack()
        }
      }).catch(err=>{
        console.log(err)
        wx.navigateBack()
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