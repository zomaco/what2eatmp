// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database();
  console.log('parameter start----------------');
  console.log(event.dishId);
  console.log(event.ingredientId);
  console.log('parameter  end ----------------');

  const recipeResult = await db.collection('recipe').where({
    dishId: event.dishId,
    ingredientId: event.ingredientId
  }).get();
  const recipe = recipeResult.data;
  if (recipe == null || recipe.length == 0) {
    return {
      code: 507,
      message: '这个菜已经不需要这个食材了哦'
    }
  }

  const deleteResult = await db.collection('recipe').doc(recipe[0]._id).remove();
  console.log('[recipe] [删除记录] 成功，记录 _id: ', recipe[0]._id)

  return {
    code: 200,
    message: 'OK'
  }
}