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
      const {id,index,size}=event;
      const res =await cloud.database().collection('articleLike').where({
        userID:id
      })
      .limit(size)
      .skip(index*size)
      .get();
      if(res.data.length==0){
        resolve({code:'0',code:'没有数据'})
      }
      let list=[];
      for(let i=0;i<res.data.length;i++){
        const article= await  cloud.database().collection('article').where({
          _id:res.data[i].articleID
        }).get();
        list.push(article.data[0]);
      }
      console.log(list)
      resolve({code:'1',data:list})
    } catch (error) {
      reject(error)
    }
  })
}