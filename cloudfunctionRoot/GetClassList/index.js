// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true
})

// 云函数入口函数
exports.main =  (event, context) => {
  return new Promise(async (resolve,reject)=>{
    try {
      const res= await cloud.database().collection('classification').get();
      const resSub= await cloud.database().collection('subclass').get();
      let attr=[]
      let obj={}
      res.data.forEach(n=>{
        obj={}
        obj.name=n.name;
        obj.chilren=[]
        resSub.data.forEach(m=>{
          if(m.classificationID==n._id){
            obj.chilren.push({
              id:m._id,
              name:m.name
            })
          }
        })
        attr.push(obj)
      })
      resolve(attr)
    } catch (error) {
      reject(error)
    }
   
  })
}