// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('listMyIngredients start----------------');
  const db = cloud.database();
  const ingredientResult = await db.collection('ingredient').get();
  const ingredients = ingredientResult.data;
  console.log('listMyIngredients ingredients.length=' + ingredients.length);
  var retList = new Array();
  for (var i = 0; i < ingredients.length; i++) {
    retList[i] = {
      name: ingredients[i].name,
      quantity: ingredients[i].quantity == null ? 0 : ingredients[i].quantity,
      id: ingredients[i]._id
    };
  }
  console.log('listMyIngredients end----------------');
  return {
    code: 200,
    message: 'OK',
    data: retList
  }
}