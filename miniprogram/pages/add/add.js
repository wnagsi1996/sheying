// pages/add/add.js
import {getUserInfo} from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList:[],  //存放上传的图片
    formList:{
      title:'',
      introduction:'',
      className:'',
      content:''
    },
    classList:[],
    show:false,
    columns:{},
    classInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(wx.getStorageSync('userInfo'))
   this.getClassList()
  },
  //获取分类
   getClassList(){
    wx.cloud.callFunction({
      name:'GetClassList',
      success:res=>{
        console.log(res.result)
        if(res.errMsg=='cloud.callFunction:ok'){
          const classList=res.result;
          let columns1=classList.map(n=>n.name)
          let columns2=classList[0].chilren.map(n=>n.name)
          let columns=[
            {
              values:columns1,
              className:'one'
            },
            {
              values:columns2,
              className:'two'
            }
          ]

          console.log(columns)
          this.setData({
            classList,
            columns
          })
        }
        
      },
      fail:err=>{
        console.log(err)
      }
    })
   },
  //图片上传
  afterRead(event) {
    const { file } = event.detail;
    console.log(file)
   let fileList= this.data.fileList
   file.forEach(n=>{
    fileList.push({
      url:n.url,
      name:n.size,
      deletable:true
    })
   })
    this.setData({
      fileList
    })
  },
  //图片删除
  _handDelImg(e){
    const index=e.detail.index;
    const list=this.data.fileList.filter((n,i)=>i!=index)
    this.setData({
      fileList:list
    })
  },
  //输入框输入变化
  onChange(e){
    const name=e.currentTarget.dataset.name;
    const val=e.detail;
    const formList=this.data.formList;
    formList[name]=val
    this.setData({
      formList
    })
  },
  //关闭弹框
  onClose(){
    this.setData({
      show:false
    })
  },
  //显示分类
  _handShowClass(){
    this.setData({
      show:true
    })
  },
  //选择分类
  classChange(event){
    const {index,value}=event.detail;
    if(index==0){
      let name=value[0];
      const classList=this.data.classList;
      let columns2=[];
      classList.forEach(n=>{
        if(n.name==name){
          columns2=n.chilren.map(m=>m.name)
        }
      })
      let columns=this.data.columns;
      columns[1].values=columns2
      this.setData({
        columns
      })
    }
  },
  //取消分类选择
  onCancel(){
    this.setData({
      show:false
    })
  },
  //确认分类
  onConfirm(e){
    console.log(e)
    const {value}=e.detail;
    let formList=this.data.formList;
    formList.className=`${value[0]} ${value[1]}`;
    const classList=this.data.classList;
    let classInfo={}
    classList.forEach(n=>{
      if(n.name==value[0]){
        classInfo=n.chilren.find(m=>m.name==value[1])
      }
    })
    this.setData({
      formList,
      classInfo,
      show:false
    })
  },
  //上传
  _handUpload(){
    const {title,introduction,content,className}=this.data.formList;
    const fileList=this.data.fileList
    
    if(title==''){
      wx.showToast({
        title: '标题不能为空',
        icon:'none'
      })
      return
    }
    
    if(introduction==''){
      wx.showToast({
        title: '简介不能为空',
        icon:'none'
      })
      return
    }
    if(className==''){
      wx.showToast({
        title: '分类不能为空',
        icon:'none'
      })
      return
    }
    if(content=='' && fileList.length==0){
      wx.showToast({
        title: '内容和图片不能都为空',
        icon:'none'
      })
      return
    }
    wx.showLoading({
      title: '提交中',
    })
    const len=fileList.length;
    let imgList='';
    
    fileList.forEach((n,i)=>{
      wx.cloud.uploadFile({
        cloudPath: `image/${ (new Date()).getTime()+Math.floor(9*Math.random())}.jpg`,
        filePath:n.url, // 文件路径
        success: res => {
          // get resource ID
          imgList+=`${res.fileID},`
          if(len==i+1){
            this.upload(imgList)
          }
        },
        fail: err => {
          // handle error
          wx.hideLoading();
          wx.showToast({
            title: '图片上传失败',
            icon:'none'
          })
        }
      })
    })
    
    
  },
  upload(imgList){
    const {title,introduction,content}=this.data.formList;
    const userInfo=wx.getStorageSync('userInfo')
    let listimg=imgList.substring(0,imgList.length-1)
    //图片，标题，简介，内容，上传者，分享次数，评论条数，收藏，对应列表Id
    wx.cloud.callFunction({
      name:'Article',
      data:{
        type:'add',
        imgList:listimg,
        title,
        introduction,
        content,
        userName:userInfo.nickName,
        userId:userInfo._id,
        subclassId:this.data.classInfo.id
      }
    }).then(res=>{
      console.log(res)
      wx.hideLoading();
      if(res.errMsg=='cloud.callFunction:ok'){
        if(res.result.errMsg=='collection.add:ok'){
          wx.showToast({
            title: '上传成功',
            icon:'none',
            duration:1000
          })
          getUserInfo()
          setTimeout(() => {
            wx.navigateBack();
          }, 1000);
         
        }
      }
     
    }).catch(err=>{
      console.log(err)
      wx.hideLoading();
      wx.showToast({
        title: '上传失败',
        icon:'none'
      })
    })
  }
})