// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('parameter start----------------');
  console.log('dishId=' + event.dishId);
  console.log('openid=' + event.openid);
  console.log('openidOthers=' + event.openidOthers);
  console.log('parameter  end ----------------');

  var openid = event.openid;
  var openidOthers = event.openidOthers;
  const db = cloud.database();
  const dishResult = await db.collection('dish').where({
    _id: event.dishId
  }).get();
  const dish = dishResult.data;

  const recipesResult = await db.collection('recipe').where({
    dishId: event.dishId
  }).get();
  const recipes = recipesResult.data;
  console.log(recipes)
  // 自己所拥有的食材-jcm start
  var ingredientList = new Array();
  if (openid != openidOthers) {
    const ingredientListResult = await db.collection('ingredient').where({
      openid: openid
    }).get();
    ingredientList = ingredientListResult.data;
  }
  // 自己所拥有的食材-jcm end

  var retList = new Array();
  for (var i = 0; i < recipes.length; i++) {
    const ingredientResult = await db.collection('ingredient').where({
      _id: recipes[i].ingredientId
    }).get();
    const ingredient = ingredientResult.data;
    if (ingredient.length > 0) {
      // 匹配自己食材数量-jcm start
      var quantity = 0;
      if (openid != openidOthers) {
        for (var y = 0; y < ingredientList.length; y++) {
          if (recipes[i].ingredientId == ingredientList[y]._id) {
            quantity = ingredientList[y].quantity;
            console.log(quantity)
            break;
          }
        }
      } else {
        quantity = ingredient[0].quantity
      }
      // 匹配自己食材数量-jcm end
      retList[i] = {
        id: recipes[i].ingredientId,
        name: ingredient[0].name,
        // quantity: ingredient[0].quantity
        quantity: quantity
      };
    } else {
      retList[i] = {
        id: recipes[i].ingredientId,
        name: '未知食材',
        quantity: 0
      };
    }
  }

  return {
    code: 200,
    message: 'OK',
    data: {
      dishId: event.dishId,
      dishName: dish[0].name,
      howToCook: dish[0].howToCook,
      ingredients: retList
    }
  }
}