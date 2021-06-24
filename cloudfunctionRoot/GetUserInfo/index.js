// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true
})

// 云函数入口函数
exports.main =  (event, context) => {
  return new Promise(async (resolve,reject)=>{
    const wxContext = cloud.getWXContext()
    const {OPENID}=wxContext;
    const cloudtable=cloud.database().collection('userList')
    cloudtable.where({
      OPENID
    }).field({
      avatarUrl:true,
      nickName:true,
      LikeNum:true,
      scanNum:true,
      worksNum:true,
      articleNum:true
    }).get().then(res=>{
      resolve(res)
    }).catch(err=>{
      reject(err);
    })
  })
  
}