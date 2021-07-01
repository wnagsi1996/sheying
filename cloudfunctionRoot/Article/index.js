// 云函数入口文件
const cloud = require('wx-server-sdk')

const formatTime = (date=new Date()) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true
})
let db=cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  return new Promise(async (resolve,reject)=>{
    const wxContext = cloud.getWXContext()
    const {OPENID}=wxContext;
    if(event.action=='like'){
      //收藏商品
        if(!OPENID){
          resolve({code:'0',msg:'请登录'})
        }
        
        try {
          const {_id,userId}=event;
          
          const res=await db.collection('articleLike').where({
            articleID:_id,
            userID:userId
          }).get();
          if(res.data.length==0){
            const res1=await db.collection('articleLike').add({
              data:{
                articleID:_id,
                userID:userId,
                time:formatTime()
              }
            })
            resolve({code:'1',msg:'收藏成功'})
          }else{
            resolve({code:'0',msg:'收藏失败'})
          }
        } catch (error) {
          reject(error)
        }
      }else if(event.action=='cancelLike'){
      //取消收藏商品
        if(!OPENID){
          reslove({code:'0',msg:'请登录'})
          return;
        }
        try {
          const {_id,userId}=event;
          const res=await db.collection('articleLike').where({
            articleID:_id,
            userID:userId
          }).get();
          if(res.data.length>0){
            const res1=await db.collection('articleLike').where({
              articleID:_id,
              userID:userId
            }).remove();
            resolve({code:'1',msg:'取消收藏成功'})
          }else{
            resolve({code:'0',msg:'取消收藏失败'})
          }
         } catch (error) {
           reject(error)
         }
       }else if(event.action=='add'){
      //添加
        const {imgList,title,introduction,content,userName,userId,subclassId}=event;
        try {
          let res =await db.collection('article').add({
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
              time:formatTime()
            }
          })
           let reslist=await db.collection('userList').where({_id:userId}).get();
           let num=reslist.data[0].articleNum+1;
           let resupdate=await db.collection('userList').where({_id:userId}).update({
              data:{
                articleNum:num
              }
            })
            resolve(res)
        } catch (error) {
          reject(error)
        }
      }else if(event.action=='del'){
        //删除
        try {
          const {id}=event;
          const resImg=await cloud.database().collection('article').where({
            _id:id
          }).get();
          const {imgList,userId}=resImg.data[0];
          const imgAttr=imgList.split(",");
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
          resolve(res)
        } catch (error) {
          reject(error)
        }
      }else if(event.action=='isLike'){
        //是否关注
        const {_id,userId}=event;
        try {
          const res=await cloud.database().collection('articleLike').where({
            articleID:_id,
            userID:userId
          }).get()
          if(res.errMsg=='collection.get:ok'){
            if(res.data.length>0){
              resolve('1')
            }
            resolve('0')
          }
          resolve('0')
        } catch (error) {
          reject(error)
        }
      }else if(event.action=='getList'){
        //获取列表
        try {
            const {id,size,index}=event;
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
      }else if(event.action=='getDesc'){
        //获取文章详情
        try {
          const {id}=event;
          const res = await db.collection('article').where({
            _id:id
          }).get();
          const res1 = await db.collection('articleLike').where({
            articleID:id
          }).get();
          let len=res1.data.length;
          res.data[0].likeNum=len
          resolve(res.data[0])
        } catch (error) {
          reject(error)
        }
      }else if(event.action=='recommed'){
        //获取推荐
        try{
          const res=await db.collection('article').where({
            recommend:true
          })
          .field({
            imgList:true,
            title:true,
            introduction:true,
            _id:true
          })
          .get();
          resolve(res)
       } catch (error) {
         reject(error)
       }
      }else if(event.action=='GetClassList'){
        //获取分类
        try {
          const res= await db.collection('classification').get();
          const resSub= await db.collection('subclass').get();
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
      }else if(event.action=='GetSubClass'){
        //获取二级分类
        db.collection('subclass').get().then(res=>{
          resolve(res)
        }).catch(err=>{
          reject(err)
        })
      }else if(event.action=='GetMyLike'){
        try {
          const {id,index,size}=event;
          const res =await cloud.database().collection('articleLike').where({
            userID:id
          })
          .limit(size)
          .skip(index*size)
          .get();
          if(res.data.length==0){
            resolve({code:'0',msg:'没有数据'})
          }
          let list=[];
          for(let i=0;i<res.data.length;i++){
            const article= await cloud.database().collection('article').where({
              _id:res.data[i].articleID
            }).get();
            let articleObj=article.data[0];
            const likeRes= await cloud.database().collection('articleLike').where({
              articleID:articleObj._id
            }).count();
            articleObj.likeNum=likeRes.total
            list.push(articleObj);
          }
          resolve({code:'1',data:list})
        } catch (error) {
          reject(error)
        }
      }else if(event.action=='GetMyArticleList'){
        //我的作品
        try {
          const {id,index,size}=event;
          const res=await cloud.database().collection('article').where({
            userId:id
          })
          .skip(index*size)
          .limit(size)
          .get();
          if(res.data.length==0){
            resolve({code:'0',msg:'没有数据'})
          }
          let list=[];
          for(let i=0;i<res.data.length;i++){
            let articleObj=res.data[i];
            const likeRes= await cloud.database().collection('articleLike').where({
              articleID:articleObj._id
            }).count();
            articleObj.likeNum=likeRes.total
            list.push(articleObj);
          }
          resolve({code:'1',data:list})
        } catch (error) {
          reject(error)
        }
      }









   
  })
}