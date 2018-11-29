// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  console.log('parameter start----------------');
  console.log('parameter  end ----------------');

  const db = cloud.database();
  const dishesResult = await db.collection('dish').get();
  const dishes = dishesResult.data;
  var retList = new Array();
  for (var i = 0; i < dishes.length; i++) {
    const date = new Date(dishes[i].lastDate);
    retList[i] = {
      name: dishes[i].name,
      category: dishes[i].category,
      lastDate: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    };
  }

  return {
    code: 200,
    message: 'OK',
    data: retList
  }
}