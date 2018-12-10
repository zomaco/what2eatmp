// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  console.log('parameter start----------------');
  console.log(event.id);
  console.log('parameter  end ----------------');
  const id = event.id;
  if (id == null || id == '') {
    return {
      code: 507,
      message: '更新失败！'
    };
  }

  const ingredientResult = await db.collection('ingredient').doc(id).get();
  const ingredient = ingredientResult.data;
  var updCnt = 0;
  if (ingredient.quantity == 0) {
    updCnt = 1;
  }
  console.log('updCnt', updCnt)

  const updateResult = await db.collection('ingredient').where({
    _id: id
  }).update({
    data: {
      quantity: updCnt
    }
  });
  console.log('update stats:', updateResult.stats)
  return {
    code: 200,
    message: 'OK'
  }
}