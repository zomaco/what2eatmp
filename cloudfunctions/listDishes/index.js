// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  console.log('listDishes start----------------');
  var retList = new Array();
  // 食材id
  const id = event.id;
  const openid = event.openid;
  console.log('ingredientId:' + id + 'openid:' + openid);
  if (id != null && id != '' && openid != null && openid != '') {
    // 查询食材关联菜单id
    const db = cloud.database();
    const _ = db.command;
    const dishIdResult = await db.collection('recipe').where({
      ingredientId: id,
      openid: openid
    }).field({
      dishId: true
    }).get();

    // 菜单id
    const dishIds = dishIdResult.data;
    var dishIdList = new Array();
    for (var i = 0; i < dishIds.length; i++) {
      console.log('dishId' + i + dishIds[i].dishId);
      dishIdList[i] = dishIds[i].dishId;
    }

    // 查询食材关联菜单
    if (dishIds != null && dishIds != '') {
      const dishesResult = await db.collection('dish').where({
        _id: _.in(dishIdList)
      }).get();

      // 菜单
      const dishes = dishesResult.data;
      for (var i = 0; i < dishes.length; i++) {
        const date = new Date(dishes[i].lastDate);
        retList[i] = {
          id: dishes[i]._id,
          name: dishes[i].name,
          category: dishes[i].category,
          lastDate: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
          openid: dishes[i].openid
        };
      }
    }
  }
  console.log('listDishes  end ----------------');
  return {
    code: 200,
    message: 'OK',
    data: retList
  }
}