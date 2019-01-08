// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  console.log('parameter start----------------');
  console.log(event.dishId);
  console.log('parameter  end ----------------');

  const db = cloud.database();
  const dishResult = await db.collection('dish').where({
    _id: event.dishId
  }).get();
  const dish = dishResult.data;

  const recipesResult = await db.collection('recipe').where({
    dishId: event.dishId
  }).get();
  const recipes = recipesResult.data;

  var retList = new Array();
  for (var i = 0; i < recipes.length; i++) {
    const ingredientResult = await db.collection('ingredient').where({
      _id: recipes[i].ingredientId
    }).get();
    const ingredient = ingredientResult.data;
    if (ingredient.length > 0) {
      retList[i] = {
        id: recipes[i].ingredientId,
        name: ingredient[0].name,
        quantity: ingredient[0].quantity
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