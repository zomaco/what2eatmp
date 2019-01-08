// pages/showDishes/showDishes.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchBtnUrl: './search.png',
    array: ['十分常见', '一般常见', '较不常见', '极不常见'],
    checkedValue: [],
    searchKey: '',
    list: [],
    ownerId: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    getApp().showLoading('加载中...','');
    var ingredientId = options.ingredientId;
    const ingredientName = options.ingredientName;
    var openid = getApp().globalData.openid;
    this.setData({
      ownerId: openid
    });
    if (ingredientId != null && ingredientId != '') {
      this.getDishesByIngredientId(ingredientId, ingredientName);
    } else {
      wx.cloud.callFunction({
        name: 'listMyDishes',
        data: {
          categories: this.data.checkedValue,
          keyword: this.data.searchKey,
          openid: getApp().globalData.openid
        },
        success: res => {
          getApp().hideLoading(),
          this.setData({
            list: res.result.data
          });
        },
        fail: err => {
          getApp().hideLoading(),
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
    getApp().showLoading('删除中...', '');
    wx.cloud.callFunction({
      name: 'dishDelete',
      data: {
        dishId: e.target.dataset.id,
        openid: getApp().globalData.openid
      },
      success: res => {
        getApp().hideLoading();
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
        getApp().hideLoading();
        wx.showToast({
          title: 'fail'
        })
      }
    });
  },

  iMadeBtn: function(e) {
    getApp().showLoading('加载中...', '');
    wx.cloud.callFunction({
      name: 'iMade',
      data: {
        dishId: e.target.dataset.id,
        openid: getApp().globalData.openid
      },
      success: res => {
        getApp().hideLoading();
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
        getApp().hideLoading();
        wx.showToast({
          title: 'fail'
        })
      }
    });
  },

  /**
   * 食材
   */
  getDishesByIngredientId: function (ingredientId, ingredientName) {
    wx.cloud.callFunction({
      name: 'listDishes',
      data: {
        id: ingredientId,
        openid: getApp().globalData.openid
      },
      success: res => {
        getApp().hideLoading();
        this.setData({
          list: res.result.data,
          searchKey: ingredientName
        });
      },
      fail: err => {
        getApp().hideLoading();
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