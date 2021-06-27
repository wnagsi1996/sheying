// pages/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    index:0,
    size:20
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id=options.id;
    this.setData({
      id
    })
    this.geArticletList()
  },
  geArticletList(){
    wx.cloud.callFunction({
      name:'GetArticleList',
      data:{
        index:this.data.index,
        size:this.data.size,
        id:this.data.id
      }
    }).then(res=>{
      console.log(res)
       if(res.errMsg=='cloud.callFunction:ok'){
         this.setData({
          list:res.result.data
         })
         console.log(res.result.name.name)
         if(this.data.index==0){
           wx.setNavigationBarTitle({
             title: res.result.name.name
           })
         }
       }
    }).catch(err=>{
      console.log(err)
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
    this.geArticletList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let index=this.data.index
    index++;
    this.setData({
      index
    })
    this.geArticletList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})