// pages/desc/desc.js
import {getUserInfo,login,authorize} from '../../utils/util'
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
        name:'Article',
        data:{
          action:'getDesc',
          id
        }
      }).then(res=>{
        console.log(res)
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
        name:'Article',
        data:{
          action:'isLike',
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
    const action=like?'cancelLike':'like'
    wx.cloud.callFunction({
      name:'Article',
      data:{
       _id,
       action,
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
           like:!this.data.like
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
  //长按保存图片
  async _handSaveImg(e){
    let {url} = e.currentTarget.dataset;
    const authres=await authorize('scope.writePhotosAlbum');
    if(!authres){
      wx.showModal({
        title: '提示',
        content:'需要授权才能保存图片到相册',
        success:(res)=>{
          if (res.confirm) {
            wx.openSetting({
              success:(res)=>{
                if(res.authSetting['scope.writePhotosAlbum']){
                  this.saveImg(url)
                }
              }
            })
          }else if (res.cancel) {
            console.log('用户点击取消')
          }
        },
        fail:(err)=>{}
      })
    }else{
      this.saveImg(url)
    }
  },
  //保存图片
  async saveImg(url){
    const resImg=await wx.getImageInfo({
      src: url
    });
    const path=resImg.path;
    wx.saveImageToPhotosAlbum({
      filePath: path,
      success:(res)=>{
        wx.showToast({
          title: '保存成功',
        })
      },
      fail:(err=>{
        wx.showToast({
          title: '保存失败',
          icon:'none'
        })
      })
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
  async onShareAppMessage(e) {
    const {goodsDesc}=this.data;
    const res=await wx.cloud.callFunction({
      name:'Article',
      data:{
        action:'shareAdd',
        _id:goodsDesc._id
      }
    })
    if(res.result){
      let {shareNum}=goodsDesc;
      shareNum++
      Object.assign(goodsDesc,{shareNum})
      this.setData({
        goodsDesc
      })
    }


    
    const {_id}=wx.getStorageSync('userInfo');
    return {
      title: goodsDesc.title,
      path: '/page/desc/desc?id='+_id,
      success:()=>{
        wx.showToast({
          title: '分享成功',
        })
      },
      fail:()=>{
        wx.showToast({
          title: '分享失败',
        })
      }
    }
  }
})