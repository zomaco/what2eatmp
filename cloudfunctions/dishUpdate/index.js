// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database();
  console.log('parameter start----------------');
  console.log(event.dishId);
  console.log(event.howToCook);
  console.log('parameter  end ----------------');

  const updateResult = await db.collection('dish').where({
    _id: event.dishId
  }).update({
    data: {
      howToCook: event.howToCook
    }
  });
  console.log('update stats:', updateResult.stats)

  return {
    code: 200,
    message: 'OK'
  }
}