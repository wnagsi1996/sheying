// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true
})

// 云函数入口函数
exports.main = async (event, context) => {
  return new Promise(async (reslove,reject)=>{
    const {_id,type,userId}=event;
    const wxContext = cloud.getWXContext()
    const {OPENID}=wxContext;
    
    if(!OPENID){
      reslove({code:'0',msg:'请登录'})
      return;
    }
    if(type=='add'){
      try {
          const res=await cloud.database().collection('articleLike').where({
            articleID:_id,
            userID:userId
          }).get();
          if(res.data.length==0){
            let myDate=new Date();
            myDate=myDate.toLocaleTimeString()+'-'+myDate.toLocaleDateString().substring(2)
            const res1=await cloud.database().collection('articleLike').add({
              data:{
                articleID:_id,
                userID:userId,
                time:myDate
              }
            })
            reslove({code:'1',msg:'收藏成功'})
          }else{
            reslove({code:'0',msg:'收藏失败'})
          }
       } catch (error) {
         reject(error)
       }
    }else if(type=='cancel'){
     try {
      const res=await cloud.database().collection('articleLike').where({
        articleID:_id,
        userID:userId
      }).get();
      if(res.data.length>0){
        const res1=await cloud.database().collection('articleLike').where({
          articleID:_id,
          userID:userId
        }).remove();
        reslove({code:'1',msg:'取消收藏成功'})
      }else{
        reslove({code:'0',msg:'取消收藏失败'})
      }
     } catch (error) {
       reject(error)
     }
    }
  })
  
}