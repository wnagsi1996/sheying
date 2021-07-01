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
      const res1 = await cloud.database().collection('articleLike').where({
        articleID:id
      }).get();
      let len=res1.data.length;
      res.data[0].likeNum=len
      resolve(res.data[0])
    } catch (error) {
      reject(error)
    }
    
  })
 

}