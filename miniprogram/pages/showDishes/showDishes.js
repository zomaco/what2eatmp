// pages/showDishes/showDishes.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['十分常见', '一般常见', '较不常见', '极不常见'],
    checkedValue: [],
    searchKey: '',
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var ingredientId = options.ingredientId;
    if (ingredientId != null && ingredientId != '') {
      this.getDishesByIngredientId(ingredientId);
    } else {
      wx.cloud.callFunction({
        name: 'listMyDishes',
        data: {
          categories: this.data.checkedValue,
          keyword: this.data.searchKey
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
    }
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

  iMadeBtn: function(e) {
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
  getDishesByIngredientId: function(ingredientId) {
    wx.cloud.callFunction({
      name: 'listDishes',
      data: {
        id: ingredientId
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

  checkboxChange: function(e) {
    this.setData({
      checkedValue: e.detail.value
    });
    this.onLoad(e.target.dataset);
  },

  bindInputKey: function(e) {
    this.setData({
      searchKey: e.detail.value
    });
  }
})