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
    ingredientInputHide: true,
    ownerId:"",
    openid:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    getApp().showLoading('加载中...', '');
    var openid = options.openid;
    var ownerId = getApp().globalData.openid;
    this.setData({
      ownerId: ownerId,
      openid: openid
    });
    console.log('ownerId:' + this.data.ownerId)
    console.log('openid:' + this.data.openid)
    wx.cloud.callFunction({
      name: 'dishDetail',
      data: {
        dishId: options.dishId,
        openid: ownerId,
        openidOthers: openid
      },
      success: res => {
        getApp().hideLoading(),
        this.setData({
          dishData: res.result.data
        });
      },
      fail: err => {
        getApp().hideLoading(),
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
    getApp().showLoading('删除食材中...', '');
    wx.cloud.callFunction({
      name: 'unbindRecipe',
      data: {
        dishId: e.target.dataset.dishId,
        ingredientId: e.target.dataset.ingredientId
      },
      success: res => {
        getApp().hideLoading(),
        wx.showToast({
          title: 'OK',
          duration: 3000,
          complete: () => {
            wx.redirectTo({
              url: '../dishDetail/dishDetail?dishId=' + e.target.dataset.dishId + '&openid=' + this.data.openid
            });
          }
        });
      },
      fail: err => {
        getApp().hideLoading(),
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
    getApp().showLoading('添加食材中...', '');
    wx.cloud.callFunction({
      name: 'bindRecipe',
      data: {
        dishId: e.target.dataset.dishId,
        ingredientName: this.data.bindRecipeName
      },
      success: res => {
        getApp().hideLoading(),
        wx.showToast({
          title: 'OK',
          duration: 3000,
          complete: () => {
            wx.redirectTo({
              url: '../dishDetail/dishDetail?dishId=' + e.target.dataset.dishId + '&openid=' + this.data.openid
            });
          }
        });
      },
      fail: err => {
        getApp().hideLoading(),
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
    getApp().showLoading('更新中...', '');
    wx.cloud.callFunction({
      name: 'dishUpdate',
      data: {
        dishId: e.target.dataset.dishId,
        howToCook: this.data.howToCook
      },
      success: res => {
        getApp().hideLoading(),
        wx.showToast({
          title: 'OK',
          duration: 2000,
          complete: () => {
            wx.redirectTo({
              url: '../dishDetail/dishDetail?dishId=' + e.target.dataset.dishId + '&openid=' + this.data.openid
            });
          }
        });
      },
      fail: err => {
        getApp().hideLoading(),
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