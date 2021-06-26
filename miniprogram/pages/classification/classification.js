// pages/classification/classification.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
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
    wx.cloud.callFunction({
      name:'GetSubClass'
    }).then(res=>{
      console.log(res)
      if(res.errMsg=='cloud.callFunction:ok'){
        let rows=res.result.data;
        if(rows.length>0){
          let classlist=[]
          rows.forEach(n=>{
            if(!classlist.some(m=>n.classificationName!=m.name)){
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
          })
          this.setData({
            list:classlist
          })
        }
      }
    }).catch(err=>{
      console.log(err)
    })
  }
})