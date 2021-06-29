// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true
})

// 云函数入口函数
exports.main = (event, context) => {
  return new Promise(async (resolve,reject)=>{
    try {
      const {id}=event;
      const res = await cloud.database().collection('article').where({
        _id:id
      }).get();
      resolve(res.data[0])
    } catch (error) {
      reject(error)
    }
    
  })
 

}