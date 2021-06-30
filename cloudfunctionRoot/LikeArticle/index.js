// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true
})

// 云函数入口函数
exports.main = async (event, context) => {
  return new Promise(async (reslove,reject)=>{
    const {_id,type}=event;
    const wxContext = cloud.getWXContext()
    const {OPENID}=wxContext;
    
    if(!OPENID){
      reslove({code:'0',msg:'请登录'})
      return;
    }
    const res=await cloud.database().collection('userList').where({
      OPENID
    }).get();
    if(type=='add'){
      try {
        if(res.errMsg=='collection.get:ok'){
            let  {LikeNum,LikeID}=res.data[0];
            LikeNum++;
            LikeID==''?LikeID=_id:LikeID=`${LikeID},${_id}`
            console.log(LikeNum)
            const res2= await cloud.database().collection('userList').where({OPENID}).update({
              data:{
                LikeNum,
                LikeID
              }
            })
            const res3=await cloud.database().collection('article').where({_id}).get();
            let LikeNum1=res3.data[0].LikeNum
            LikeNum1++
            await cloud.database().collection('article').where({_id}).update({
              data:{
                LikeNum:LikeNum1
              }
            })
            reslove(res2)
        }else{
          reslove({code:'0',msg:'数据出错'})
          return
        }
       } catch (error) {
        console.log(3)
         reject(error)
       }
    }else if(type=='cancel'){
     try {
      if(res.errMsg=='collection.get:ok'){
        let  {LikeNum,LikeID}=res.data[0];
        LikeNum--;
        let likeAttr=LikeID.split(',');
        likeAttr=likeAttr.filter(n=>n!=_id);
        const res2= await cloud.database().collection('userList').where({OPENID}).update({
          data:{
            LikeNum,
            LikeID:likeAttr.toString()
          }
        })
        const res3=await cloud.database().collection('article').where({_id}).get();
        let LikeNum1=res3.data[0].LikeNum
        LikeNum1--
        await cloud.database().collection('article').where({_id}).update({
          data:{
            LikeNum:LikeNum1
          }
        })
        reslove(res2)
      }
     } catch (error) {
       reject(error)
     }
    }
   
  })
  
}