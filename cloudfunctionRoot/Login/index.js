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
    const {avatarUrl,city,country,nickName,province}=event;
    const {OPENID}=wxContext;
    const cloudtable=cloud.database().collection('userList')
    let res=await cloudtable.where({
      OPENID
    }).get();

    if(res.data.length==0){
      cloudtable.add({
        data:{
          avatarUrl,
          city,
          country,
          nickName,
          province,
          OPENID,
          LikeNum:0,
          phone:'',
          scanNum:0,
          worksNum:0,
          articleNum:0
        }
      })
    }
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