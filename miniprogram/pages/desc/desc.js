// pages/desc/desc.js
import {getUserInfo,login} from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    goodsDesc:{},
    like:false,  //是否关注
    loginShow:false  //显示登录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {id}=options;
    this.setData({
      id
    });
   
    this.getDesc(id)
  },
  //d登录
  _handLogin(){
    wx.getUserProfile({
      desc:'登录',
      success:(e)=>{
        login(e.userInfo).then(res=>{
          console.log(res)
          if(res){
            wx.showToast({
              title: '登录成功',
            })
            this._handLike()
          }else{
            wx.showToast({
              title: '登录失败',
              icon:'none'
            })
          }
          this.setData({
            loginShow:false
          })
        })
      },
      fail:(res)=>{
        wx.showToast({
          title: '取消登录',
          icon:'none'
        })
        this.setData({
          loginShow:false
        })
      }
    })
  },
  getDesc(id){
    wx.showLoading({
      title: '加载中...',
    })
     wx.cloud.callFunction({
        name:'GetArticleDesc',
        data:{
          id
        }
      }).then(res=>{
        wx.hideLoading()
        if(res.errMsg=='cloud.callFunction:ok'){
          wx.setNavigationBarTitle({
            title: res.result.title,
          })
          let imgList=res.result.imgList.split(',');
          this.setData({
            goodsDesc:res.result,
            imgList
          })
          this.getLike()
        }else{
          wx.navigateBack()
        }
      }).catch(err=>{
        wx.hideLoading()
        wx.navigateBack()
      })
  },
  getLike(){
    const userInfo=wx.getStorageSync('userInfo');
    const userId=userInfo._id;
    if(userInfo){
      const {_id}=this.data.goodsDesc
      wx.cloud.callFunction({
        name:'GetArticleLike',
        data:{
          _id,
          userId
        }
      }).then(res=>{
        console.log(res)
        if(res.errMsg=='cloud.callFunction:ok'){
          this.setData({
            like:res.result=="0"?false:true
          })
        }
      }).catch(err=>{
        console.log(err)
      })
    }
   
  },
 async _handLike(){
    const userInfo=wx.getStorageSync('userInfo');
    
   if(userInfo){
    this.submitLike()
   }else{
    const res=await getUserInfo();
    if(res){
      this.submitLike()
    }else{

    }
   }
  },
  submitLike(){
    const {_id}=this.data.goodsDesc
    wx.showLoading({
      title: '提交中...',
    })
    const like=this.data.like;
    const type=like?'cancel':'add'
    wx.cloud.callFunction({
      name:'LikeArticle',
      data:{
       _id,
       type,
       userId:wx.getStorageSync('userInfo')._id
      }
    }).then(res=>{
      console.log(res)
      wx.hideLoading()
      if(res.errMsg=='cloud.callFunction:ok'){
        if(res.result.code=='1'){
          wx.showToast({
            title: res.result.msg
          })
          this.setData({
           like:type?false:true
          })
         getUserInfo();
         this.getDesc(this.data.id)
        }else{
         wx.showToast({
           title: res.result.msg,
           icon:'none'
         })
        }
      }else{
       wx.showToast({
         title: res.result.msg,
         icon:'none'
       })
      }
    }).catch(err=>{
      wx.showToast({
       title: '操作失败',
       icon:'none'
     })
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