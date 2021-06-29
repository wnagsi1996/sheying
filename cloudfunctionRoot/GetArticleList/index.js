// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true
})

// 云函数入口函数
exports.main = async (event, context) => {
  let {id,size,index}=event;
  return new Promise(async (resolve,reject)=>{
    try {
    const db=cloud.database()
      const subClass=await db.collection('subclass').where({_id:id}).field({
        name:true,
        _id:true
      }).get();
     
      const res =await db.collection('article').where({
        subclassId:id
      })
      .orderBy('time','desc')
      .limit(size)
      .skip(index*size)
      .field({
        imgList:true,
        title:true,
        introduction:true,
        comment:true
      })
      .get();
      let subName=[];
      if(subClass.errMsg=='collection.get:ok'){
        subName=subClass.data[0]
      }
      if(res.errMsg=='collection.get:ok'){
        res.name=subName
        resolve(res)
      }
    } catch (error) {
      reject(error)
    }
    
  })
}