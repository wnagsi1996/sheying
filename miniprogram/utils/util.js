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
  wx.cloud.callFunction({
    name:'GetUserInfo'
  }).then(res=>{
    if(res.errMsg=='cloud.callFunction:ok'){
      if(res.result.data.length>0){
        const userInfo=res.result.data[0];
        wx.setStorageSync('userInfo', userInfo)
      }
    }

  })
}

module.exports = {
  formatTime,
  getUserInfo
}
