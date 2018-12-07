// pages/showDishes/showDishes.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var ingredientId = options.ingredientId;
    console.log("ingredientId:" + ingredientId);
    if (ingredientId != null && ingredientId != '') {
      this.getDishesByIngredientId(ingredientId);
    } else {
      wx.cloud.callFunction({
        name: 'listMyDishes',
        data: {},
        success: res => {
          console.log(res.result);
          this.setData({
            list: res.result.data
          });
        },
        fail: err => {
          wx.showToast({
            title: 'fail'
          })
        }
      });
    }
    console.log(this.data);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  dishDeleteBtn: function(e) {
    wx.cloud.callFunction({
      name: 'dishDelete',
      data: {
        dishId: e.target.dataset.id
      },
      success: res => {
        wx.showToast({
          title: 'OK',
          duration: 3000,
          complete: () => {
            wx.redirectTo({
              url: '../showDishes/showDishes'
            });
          }
        });
      },
      fail: err => {
        wx.showToast({
          title: 'fail'
        })
      }
    });
  },

  iMadeBtn: function (e) {
    wx.cloud.callFunction({
      name: 'iMade',
      data: {
        dishId: e.target.dataset.id
      },
      success: res => {
        wx.showToast({
          title: 'OK',
          duration: 3000,
          complete: () => {
            wx.redirectTo({
              url: '../showDishes/showDishes'
            });
          }
        });
      },
      fail: err => {
        wx.showToast({
          title: 'fail'
        })
      }
    });
  },

  /**
   * 食材
   */
  getDishesByIngredientId: function (ingredientId) {
    wx.cloud.callFunction({
      name: 'listDishes',
      data: {
        id: ingredientId
      },
      success: res => {
        console.log(res.result);
        this.setData({
          list: res.result.data
        });
      },
      fail: err => {
        wx.showToast({
          title: 'fail'
        })
      }
    });
  }
})