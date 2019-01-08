// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const db = cloud.database();
  const _ = db.command;
  console.log('parameter start----------------');
  console.log(event.categories);
  console.log(event.keyword);
  console.log(event.openid);
  console.log('parameter  end ----------------');
  var dishesFiltered = null;
  var dishesResult = null;
  var openid = event.openid;
  // 所有关联用户
  var openIds = new Array();
  const openIdRes = await cloud.callFunction({
    name: 'getOpenIds',
    data: {
      openid: openid
    }
  })
  openIds = openIdRes.result.openIds;
  console.log(openIds)
  if (openIds != null && openIds != '') {
    // 2.查询列表
    if (event.categories != null && event.categories.length > 0) {
      dishesResult = await db.collection('dish').where({
        category: _.in(event.categories),
        openid: _.in(openIds)
      }).get();
    } else {
      dishesResult = await db.collection('dish').where({
        openid: _.in(openIds)
      }).get();
    }
    var dishes = dishesResult.data;
    console.log(dishes)


    if (event.keyword != null && event.keyword != '') {
      const ingredientsResult = await db.collection('ingredient').where({
        openid: _.in(openIds)
      }).get();
      const ingredients = ingredientsResult.data;
      var ingredientIds = new Array();
      var cnt = 0;
      for (var i = 0; i < ingredients.length; i++) {
        if (ingredients[i].name.indexOf(event.keyword) != -1) {
          ingredientIds[cnt++] = ingredients[i]._id;
        }
      }

      const recipesResult = await db.collection('recipe').where({
        openid: _.in(openIds)
      }).get();
      const recipes = recipesResult.data;
      var dishIds = new Array();
      var cnt2 = 0;
      for (var j = 0; j < recipes.length; j++) {
        var found = false;
        for (var k = 0; k < ingredientIds.length; k++) {
          if (ingredientIds[k] == recipes[j].ingredientId) {
            found = true;
            break;
          }
        }
        if (found) {
          dishIds[cnt2++] = recipes[j].dishId;
        }
      }

      dishesFiltered = new Array();
      var cnt3 = 0;
      for (var m = 0; m < dishes.length; m++) {
        if (dishes[m].name.indexOf(event.keyword) != -1) {
          dishesFiltered[cnt3++] = dishes[m];
        } else {
          for (var n = 0; n < dishIds.length; n++) {
            if (dishIds[n] == dishes[m]._id) {
              dishesFiltered[cnt3++] = dishes[m];
              break;
            }
          }
        }
      }

    } else {
      dishesFiltered = new Array();
      for (var m = 0; m < dishes.length; m++) {
        dishesFiltered[m] = dishes[m];
      }
    }
  }
  console.log(dishesFiltered)

  var retList = new Array();
  var cnt = 0;
  for (var i = 0; i < dishesFiltered.length; i++) {
    const date = new Date(dishesFiltered[i].lastDate);
    retList[cnt++] = {
      id: dishesFiltered[i]._id,
      name: dishesFiltered[i].name,
      category: dishesFiltered[i].category,
      lastDate: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
      openid: dishesFiltered[i].openid
    };
  }

  return {
    code: 200,
    message: 'OK',
    data: retList
  }
}