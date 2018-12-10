// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  console.log('parameter start----------------');
  console.log(event.stockOnly);
  console.log('parameter  end ----------------');

  const ingredientResult = await db.collection('ingredient').get();
  const ingredients = ingredientResult.data;
  var retList = new Array();
  var cnt = 0;
  for (var i = 0; i < ingredients.length; i++) {
    if (event.stockOnly == false || ingredients[i].quantity > 0) {
      retList[cnt++] = {
        name: ingredients[i].name,
        quantity: ingredients[i].quantity,
        id: ingredients[i]._id
      };
    }
  }

  return {
    code: 200,
    message: 'OK',
    data: retList
  }
}