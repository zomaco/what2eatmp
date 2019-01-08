// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database();
  const _ = db.command;
  console.log('parameter start----------------');
  console.log(event.callTimes);
  console.log(event.categories);
  console.log(event.openid);
  console.log(event.others);
  console.log('parameter  end ----------------');
  const IGNORE_DAYS = 2;

  // 所有关联用户
  var openIds = new Array();
  if (event.others = false) {
    const openIdRes = await cloud.callFunction({
      name: 'getOpenIds',
      data: {
        openid: event.openid
      }
    })
    openIds = openIdRes.result.openIds;
  } else {
    openIds[0] = event.openid;
  }
  console.log(openIds)

  // 1、食材信息
  const ingredientsStockResult = await db.collection('ingredient').where({
    quantity: _.neq(0),
    openid: _.in(openIds)
  }).get();

  const ingredientsStock = ingredientsStockResult.data;

  // 2、关联的菜谱信息
  var ingredientIds = new Array();
  for (var i = 0; i < ingredientsStock.length; i++) {
    ingredientIds[i] = ingredientsStock[i]._id;
  }
  const recipesResult = await db.collection('recipe').where({
    ingredientId: _.in(ingredientIds)
  }).get();
  const recipes = recipesResult.data;

  // 排除N（可配置）天以前做过的菜
  // 排除前端画面上没选择的种类
  // 排除没有食材做不了的菜
  // 按时间正序排序
  const dateRestriction = new Date().getTime() - IGNORE_DAYS * 24 * 3600 * 1000;
  var dishesFilteredTempResult;
  if (event.categories.replace(/,/g, '') == '') {
    dishesFilteredTempResult = await db.collection('dish').where({
      lastDate: _.lt(dateRestriction),
      openid: _.in(openIds)
    }).orderBy('lastDate', 'asc').get();
  } else {
    dishesFilteredTempResult = await db.collection('dish').where({
      lastDate: _.lt(dateRestriction),
      category: _.in(event.categories.split(',')),
      openid: _.in(openIds)
    }).orderBy('lastDate', 'asc').get();
  }
  const dishesFilteredTemp = dishesFilteredTempResult.data;
  console.log('dishesFilteredTemp size:', dishesFilteredTemp.length)

  var dishesFiltered = new Array();
  var cnt = 0;
  for (var i = 0; i < dishesFilteredTemp.length; i++) {
    // 循环1
    var allRecipeOk = true;
    for (var j = 0; j < recipes.length; j++) {
      // 循环2
      if (dishesFilteredTemp[i]._id == recipes[j].dishId) {
        // 处理循环1中的菜的菜谱
        const ingId = recipes[j].ingredientId;
        var hasStock = false;
        for (var k = 0; k < ingredientsStock.length; k++) {
          if (ingredientsStock[k]._id == ingId) {
            hasStock = true;
            break;
          }
        }
        // 如果有一个食材没有库存，这个菜做不了，下一道菜
        if (hasStock == false) {
          allRecipeOk = false;
          break;
        }
      }
    }
    if (allRecipeOk) {
      dishesFiltered[cnt++] = dishesFilteredTemp[i];
    }
  }
  console.log('dishesFiltered size:', dishesFiltered.length)

  // 按调用次数依次跳过四道菜
  var filteredSize = dishesFiltered.length;
  var windowSize = 4;
  var skipSize = 0;
  if (filteredSize > windowSize) {
    skipSize = event.callTimes * windowSize % filteredSize;
    // 防止出现只剩一道菜的情况
    if (skipSize == filteredSize - 1) {
      skipSize = filteredSize - windowSize;
    }
  }

  var res = new Array();
  var cnt2 = 0;
  for (var i = skipSize; i < skipSize + windowSize && i < dishesFiltered.length; i++) {
    res[cnt2++] = {
      dishId: dishesFiltered[i]._id,
      dishName: dishesFiltered[i].name
    };
  }

  // 从四道菜中随机选两个
  var ret = new Array();
  var cnt3 = 0;
  if (res.length > 1) {
    var randomA = Math.floor(Math.random() * res.length);
    var randomB;
    do {
      randomB = Math.floor(Math.random() * res.length);
    } while (randomB == randomA);
    ret[cnt3++] = res[randomA];
    ret[cnt3++] = res[randomB];
  } else {
    for (var i = 0; i < res.length; i++) {
      ret[cnt3++] = res[i];
    }
  }

  return {
    code: 200,
    message: 'OK',
    data: ret
  }
}