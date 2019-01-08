// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  console.log('parameter start----------------');
  console.log(event.dishName);
  console.log(event.dishCategory);
  console.log(event.ingredientNames);
  console.log(event.howToCook);
  console.log(event.openid);
  console.log('parameter  end ----------------');

  const db = cloud.database();
  // 1.检查dishName的唯一性
  const countResult = await db.collection('dish').where({
    name: event.dishName
  }).count();
  const total = countResult.total;
  if (total != 0) {
    return {
      code: 507,
      message: '这道菜已经保存过了哦'
    };
  }

  // 2.把ingredientNames转换成id，原来不存在的name要新建
  const ingredientsResult = await db.collection('ingredient').get();
  const ingredients = ingredientsResult.data;
  console.log('ingredients:', ingredients)
  var idFromNames = new Array();
  var cnt = 0;
  var openid = event.openid;
  const ingredientNames = event.ingredientNames.split(',');
  console.log('ingredientNames:', ingredientNames)
  for (var i = 0; i < ingredientNames.length; i++) {
    var found = false;
    for (var j = 0; j < ingredients.length; j++) {
      if (ingredients[j].name == ingredientNames[i]) {
        idFromNames[cnt++] = ingredients[j]._id;
        found = true;
        break;
      }
    }
    if (!found) {
      console.log('ingredient not found, adding')
      const addResult = await db.collection('ingredient').add({
        data: {
          name: ingredientNames[i],
          quantity: 0,
          openid: openid
        }
      });
      idFromNames[cnt++] = addResult._id;
      console.log('[ingredient] [新增记录] 成功，记录 _id: ', addResult._id)
    }
  }
  console.log('idFromNames:', idFromNames)

  // 3.插入数据
  const addResult2 = await db.collection('dish').add({
    data: {
      name: event.dishName,
      category: event.dishCategory,
      lastDate: 0,
      howToCook: event.howToCook,
      openid: openid
    }
  });
  console.log('[dish] [新增记录] 成功，记录 _id: ', addResult2._id)

  for (var i = 0; i < idFromNames.length; i++) {
    const addResult3 = await db.collection('recipe').add({
      data: {
        dishId: addResult2._id,
        ingredientId: idFromNames[i],
        openid: openid
      }
    });
    console.log('[recipe] [新增记录] 成功，记录 _id: ', addResult3._id)
  }

  return {
    code: 200,
    message: 'OK'
  }
}