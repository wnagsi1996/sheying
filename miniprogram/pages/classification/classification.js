// pages/classification/classification.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    recommendList:[]
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
    this.getClassList()
  },
  getClassList(){
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      name:'Article',
      data:{
        action:'GetSubClass'
      }
    }).then(res=>{
      wx.hideLoading()
      if(res.errMsg=='cloud.callFunction:ok'){
        let rows=res.result.data;
        if(rows.length>0){
          let classlist=[]
          let recommendList=[]
          rows.forEach(n=>{
            if(!classlist.some(m=>n.classificationName==m.name)){
              let obj={
                name:n.classificationName,
                id:n.classificationID,
                children:[]
              }
              classlist.push(obj)
            }
            classlist.forEach(m=>{
              if(m.name==n.classificationName){
                m.children.push(n)
              }
            })
            //处理热门推荐
            if(n.recommend){
              recommendList.push(n)
            }
          })
          console.log(recommendList)
          this.setData({
            list:classlist,
            recommendList
          })
        }
      }
    }).catch(err=>{
      wx.hideLoading()
      console.log(err)
    })
  },
  _handSwiper(e){
    const id=e.currentTarget.dataset.id;
    const recommendList=this.data.recommendList;
    wx.navigateTo({
      url: `../list/list?id=${id}`
    })
  },
  _handList(e){
    const id=e.currentTarget.dataset.id;
    const name=e.currentTarget.dataset.name;
    wx.navigateTo({
      url: `../list/list?id=${id}`
    })
  },
  onShareAppMessage:function(e){
    const {_id}=wx.getStorageSync('userInfo');
    return{
      title: '分享生活中精美图片',
      path: '/page/classification/classification?id='+_id
    }
  }
})