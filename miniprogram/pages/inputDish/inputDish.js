// miniprogram/pages/inputDish/inputDish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['十分常见', '一般常见', '较不常见', '极不常见'],
    index: 0,
    dishName: '',
    ingredientName: '',
    howToCook: '',
    dbgTxt: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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

  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
  },

  bindInputDishName: function(e) {
    this.setData({
      dishName: e.detail.value
    })
  },

  bindInputIngredientName: function(e) {
    const replaceComma = e.detail.value.replace('，', ',');
    this.setData({
      ingredientName: replaceComma
    })
  },

  bindInputHowToCook: function(e) {
    this.setData({
      howToCook: e.detail.value
    })
  },

  newDish: function(e) {
    if (this.data.dishName == '') {
      wx.showToast({
        title: '请输入菜名',
        icon: 'none'
      })
      return;
    }
    if (this.data.ingredientName == '') {
      wx.showToast({
        title: '请输入食材',
        icon: 'none'
      })
      return;
    }
    console.log(
      this.data.dishName + '||' +
      this.data.ingredientName + '||' +
      this.data.array[this.data.index] + '||' +
      this.data.howToCook);
    wx.cloud.callFunction({
      name: 'iCanMake',
      data: {
        dishName: this.data.dishName,
        dishCategory: this.data.array[this.data.index],
        ingredientNames: this.data.ingredientName,
        howToCook: this.data.howToCook
      },
      success: res => {
        console.log(res.result);
        if (res.result.code == 200) {
          wx.showToast({
            title: 'OK',
            duration: 3000,
            complete: () => {
              wx.redirectTo({
                url: '../index/index'
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
          title: err,
          icon: 'none'
        })
      }
    });
  }
})