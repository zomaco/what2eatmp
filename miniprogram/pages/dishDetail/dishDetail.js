// miniprogram/pages/dishDetail/dishDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    unbindBtnUrl: './delete.png',
    addBtnUrl: './add.png',
    dishData: null,
    bindRecipeName: '',
    howToCook: '',
    ingredientInputHide: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.cloud.callFunction({
      name: 'dishDetail',
      data: {
        dishId: options.dishId
      },
      success: res => {
        this.setData({
          dishData: res.result.data
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

  unbindRecipeBtn: function(e) {
    wx.cloud.callFunction({
      name: 'unbindRecipe',
      data: {
        dishId: e.target.dataset.dishId,
        ingredientId: e.target.dataset.ingredientId
      },
      success: res => {
        wx.showToast({
          title: 'OK',
          duration: 3000,
          complete: () => {
            wx.redirectTo({
              url: '../dishDetail/dishDetail?dishId=' + e.target.dataset.dishId
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

  bindRecipeBtn: function(e) {
    if (this.data.bindRecipeName == '') {
      wx.showToast({
        title: '需要填写食材名',
        icon: 'none'
      })
      return;
    }
    wx.cloud.callFunction({
      name: 'bindRecipe',
      data: {
        dishId: e.target.dataset.dishId,
        ingredientName: this.data.bindRecipeName
      },
      success: res => {
        wx.showToast({
          title: 'OK',
          duration: 3000,
          complete: () => {
            wx.redirectTo({
              url: '../dishDetail/dishDetail?dishId=' + e.target.dataset.dishId
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

  bindInputBindRecipeName: function(e) {
    this.setData({
      bindRecipeName: e.detail.value
    });
  },

  updateHowToCookBtn: function(e) {
    wx.cloud.callFunction({
      name: 'dishUpdate',
      data: {
        dishId: e.target.dataset.dishId,
        howToCook: this.data.howToCook
      },
      success: res => {
        wx.showToast({
          title: 'OK',
          duration: 3000,
          complete: () => {
            wx.redirectTo({
              url: '../dishDetail/dishDetail?dishId=' + e.target.dataset.dishId
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

  bindInputHowToCook: function(e) {
    this.setData({
      howToCook: e.detail.value
    })
  },

  bindIngredientInputShow: function(e) {
    this.setData({
      ingredientInputHide: !this.data.ingredientInputHide
    });
  }
})