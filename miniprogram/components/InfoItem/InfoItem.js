// components/InfoItem/InfoItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    infoData:{
      type:Object,
      value:{}
    },
    iconShow:{
      type:Boolean,
      value:false
    }
  },
  
  /**
   * 组件的初始数据
   */
  data: {

  },
  lifetimes:{
    attached(){
      console.log(this.data.infoData)
    }
  },
  observers:{
    'infoData':function(val){
      console.log(val)
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    _handToUrl(e){
      console.log(e)
      const {id}=e.currentTarget.dataset;
      console.log(id)
      wx.navigateTo({
        url: '../../pages/desc/desc?id='+id,
      })
    },
  }
})
