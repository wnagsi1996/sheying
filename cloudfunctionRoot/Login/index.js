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
          phone:'',
          scanNum:0,
          worksNum:0,
          articleNum:0
        }
      })
    }
    const res1=await cloudtable.where({
      OPENID
    }).field({
      avatarUrl:true,
      nickName:true,
      scanNum:true,
      worksNum:true,
      articleNum:true
    }).get();
      const id=res.data[0]._id;
      const res2=await cloud.database().collection('articleLike').where({
        userID:id
      }).get();
      res.data[0].likeNum=res2.data.length;
      resolve(res)
  })
  
}