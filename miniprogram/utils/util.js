const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

//获取用户信息
const getUserInfo=()=>{
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:'GetUserInfo'
    }).then(res=>{
      if(res.errMsg=='cloud.callFunction:ok'){
        if(res.result.data.length>0){
          const userInfo=res.result.data[0];
          wx.removeStorageSync('userInfo');
          wx.setStorageSync('userInfo', userInfo)
          resolve(true)
        }
      }
      resolve(false)
    }).catch(err=>{
      reject(false)
    })
  })
}
//登录
const login=(userInfo)=>{
  return new Promise((resolve,reject)=>{
    wx.cloud.callFunction({
      name:'Login',
      data:userInfo,
      success:res=>{
       if(res.errMsg=='cloud.callFunction:ok'){
         if(res.result.data.length>0){
           const userInfo=res.result.data[0];
           wx.setStorageSync('userInfo', userInfo)
           resolve(true)
         }
         resolve(false)
       }
       resolve(false)
      },
      fail:err=>{
        console.log(err)
        resolve(false)
      }
  })
})
  
}

module.exports = {
  formatTime,
  getUserInfo,
  login
}
