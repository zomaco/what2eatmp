// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database();
  console.log('parameter start----------------');
  console.log(event.dishId);
  console.log(event.ingredientName);
  console.log('parameter  end ----------------');

  const ingredientResult = await db.collection('ingredient').where({
    name: event.ingredientName
  }).get();
  const ingredient = ingredientResult.data;
  var ingredientId;
  if (ingredient != null && ingredient.length > 0) {
    ingredientId = ingredient[0]._id;
  } else {
    const addResult = await db.collection('ingredient').add({
      data: {
        name: event.ingredientName,
        quantity: 0
      }
    });
    console.log('[ingredient] [新增记录] 成功，记录 _id: ', addResult._id)
    ingredientId = addResult._id;
  }

  const newRecipe = await db.collection('recipe').add({
    data: {
      dishId: event.dishId,
      ingredientId: ingredientId
    }
  });
  console.log('[recipe] [新增记录] 成功，记录 _id: ', newRecipe._id)

  return {
    code: 200,
    message: 'OK'
  }
}