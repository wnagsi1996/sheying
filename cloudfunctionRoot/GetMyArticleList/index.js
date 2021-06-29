// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true
})

// 云函数入口函数
exports.main = async (event, context) => {
  return new Promise(async(resolve,reject)=>{
    try {
      const {id}=event;
      const res=await cloud.database().collection('article').where({
        userId:id
      }).get();
      resolve(res)
    } catch (error) {
      reject(error)
    }
  })
}