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
    try {
      const res=await cloud.database().collection('userList').where({
        OPENID
      }).field({
        avatarUrl:true,
        nickName:true,
        scanNum:true,
        worksNum:true,
        articleNum:true
      }).get();
      const id=res.data[0]._id;
      const res1=await cloud.database().collection('articleLike').where({
        userID:id
      }).get();
      console.log(res1)
      res.data[0].likeNum=res1.data.length;
      resolve(res)
    } catch (error) {
      reject(error)
    }
  })
  
}