// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true
})

// 云函数入口函数
exports.main = async (event, context) => {
  return new Promise(async (resolve,reject)=>{
    // const wxContext = cloud.getWXContext()
    // const {OPENID}=wxContext;
    const {_id,userId}=event;
    try {
      const res=await cloud.database().collection('articleLike').where({
        articleID:_id,
        userID:userId
      }).get()
      if(res.errMsg=='collection.get:ok'){
        if(res.data.length>0){
          resolve('1')
        }
        resolve('0')
      }
      resolve('0')
    } catch (error) {
      reject(error)
    }
  })
}