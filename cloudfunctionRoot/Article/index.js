// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true
})

// 云函数入口函数
exports.main = async (event, context) => {
  return new Promise(async (resolve,reject)=>{
    const {type}=event;
    if(type=='add'){
      const {imgList,title,introduction,content,userName,userId,subclassId}=event;
      try {
        let res =await cloud.database().collection('article').add({
          data:{
            imgList,
            title,
            introduction,
            content,
            userName,
            userId,
            subclassId,
            shareNum:0,
            commentNum:0,
            LikeNum:0
          }
        })
         let reslist=await cloud.database().collection('userList').where({_id:userId}).get();
         console.log(reslist)
         let num=reslist.data[0].articleNum+1;
         let resupdate=await cloud.database().collection('userList').where({_id:userId}).update({
            data:{
              articleNum:num
            }
          })
          resolve(res)
      } catch (error) {
        reject(error)
      }

    }
  })
}