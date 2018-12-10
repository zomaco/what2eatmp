// pages/showIngredients/showIngredients.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['只看有存货'],
    checkedValue: [],
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var stockOnly = false;
    if (this.data.checkedValue.length > 0) {
      stockOnly = true;
    }
    wx.cloud.callFunction({
      name: 'listMyIngredients',
      data: {
        stockOnly: stockOnly
      },
      success: res => {
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

  /**
   * 删除食材
   */
  ingredientDelete: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.cloud.callFunction({
      name: 'ingredientDelete',
      data: {
        id: id
      },
      success: res => {
        if (res.result.code == 200) {
          wx.showToast({
            title: 'OK',
            duration: 3000,
            complete: () => {
              wx.redirectTo({
                url: '../showIngredients/showIngredients'
              });
            }
          });
        } else {
          wx.showToast({
            title: res.result.message,
            icon: 'none'
          })
        }
      },
      fail: err => {
        wx.showToast({
          title: '调用失败',
          icon: 'none'
        })
      }
    });
  },

  /**
   * 更新食材数量
   */
  ingredientUpdate: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.cloud.callFunction({
      name: 'ingredientUpdate',
      data: {
        id: id
      },
      success: res => {
        if (res.result.code == 200) {
          wx.showToast({
            title: 'OK',
            duration: 3000,
            complete: () => {
              wx.redirectTo({
                url: '../showIngredients/showIngredients'
              });
            }
          });
        } else {
          wx.showToast({
            title: res.result.message,
            icon: 'none'
          })
        }
      },
      fail: err => {
        wx.showToast({
          title: '调用失败',
          icon: 'none'
        })
      }
    });
  },

  /**
   * 食材
   */
  getDishes: function(e) {
    var ingredientId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../showDishes/showDishes?ingredientId=' + ingredientId
    });
  },

  checkboxChange: function(e) {
    this.setData({
      checkedValue: e.detail.value
    });
    this.onLoad();
  }
})