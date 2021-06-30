// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true
})

// 云函数入口函数
exports.main = async (event, context) => {
  return new Promise(async(reslove,reject)=>{
    try {
      const wxContext = cloud.getWXContext()
      const {OPENID}=wxContext;
      const {id}=event;

      const resImg=await cloud.database().collection('article').where({
        _id:id
      }).get();
      const {imgList,userId}=resImg.data[0];
      const imgAttr=imgList.split(",");console.log(imgAttr)
      const result = await cloud.deleteFile({
        fileList: imgAttr,
      })

      const resUser=await cloud.database().collection('userList').where({
        OPENID
      }).get();
      let {articleNum}=resUser.data[0];
      articleNum--;
      const resUser1=await cloud.database().collection('userList').where({
        OPENID
      }).update({
        data:{
          articleNum
        }
      })

      const res=await cloud.database().collection('article').where({
        _id:id
      }).remove()
      reslove(res)
    } catch (error) {
      reject(error)
    }
  })
}