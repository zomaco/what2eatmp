// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database();
  console.log('parameter start----------------');
  console.log(event.dishId);
  console.log(event.openid);
  console.log('parameter  end ----------------');

  const countResult = await db.collection('dish').where({
    _id: event.dishId,
    openid: event.openid
  }).count();
  console.log('countResult.total:' + countResult.total);
  if (countResult.total == 0) {
    return {
      code: 507,
      message: '只能删除自己的菜谱！'
    };
  }

  const deleteResult1 = await db.collection('dish').where({
    _id: event.dishId
  }).remove();
  console.log('delete stats1:', deleteResult1.stats)

  const deleteResult2 = await db.collection('recipe').where({
    dishId: event.dishId
  }).remove();
  console.log('delete stats2:', deleteResult2.stats)

  return {
    code: 200,
    message: 'OK'
  }
}