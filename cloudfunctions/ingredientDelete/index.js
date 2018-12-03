// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('ingredientDelete start----------------');
  console.log('ingredientDelete id：' + event._id);
  const id = event._id;
  if(id == null || id == ''){
    return {
      code: 507,
      message: '删除失败！'
    };
  }
  const db = cloud.database();
  const deleteResult = await db.collection('ingredient').doc({_id:event._id}).remove;
  console.log('[ingredien] [删除记录] 成功，记录 deleteResult: ', deleteResult)
  console.log('ingredientDelete end----------------');
  return {
    code: 200,
    message: 'OK',
    data: null
  }
}