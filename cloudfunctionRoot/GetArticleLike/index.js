// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true
})

// 云函数入口函数
exports.main = async (event, context) => {
  return new Promise(async (resolve,reject)=>{
    const wxContext = cloud.getWXContext()
    const {OPENID}=wxContext;
    const {_id}=event;
    try {
      const res=await cloud.database().collection('userList').where({
        OPENID
      }).get()
      console.log(res)
      if(res.errMsg=='collection.get:ok'){
        if(res.data.length>0){
          const {LikeID}=res.data[0];
          if(LikeID==''){
            resolve('0')
          }
          const likeAttr=LikeID.split(",");
          likeAttr.includes(_id)?resolve('1'):resolve('0') 
        }
        resolve('0')
      }
      resolve('0')
    } catch (error) {
      reject(error)
    }
  })
}