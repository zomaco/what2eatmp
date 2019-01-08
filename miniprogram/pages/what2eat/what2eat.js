// miniprogram/pages/what2eat/what2eat.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    callTimes: 0,
    categories: '',
    list: [],
    nochiUrl: './no.jpg',
    loading:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.cloud.callFunction({
      name: 'whatToEat',
      data: {
        callTimes: this.data.callTimes,
        categories: this.data.categories,
        openid: getApp().globalData.openid
      },
      success: res => {
        getApp().hideLoading(),
        this.setData({
          callTimes: this.data.callTimes + 1,
          list: res.result.data,
          loading: true
        });
      },
      fail: err => {
        getApp().hideLoading(),
          this.setData({
            loading: true
          });
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

  roll: function(e) {
    this.onLoad();
  },

  iMadeBtn: function(e) {
    getApp().showLoading('加载中...', '');
    var dishId = e.target.dataset.id;
    wx.cloud.callFunction({
      name: 'iMade',
      data: {
        dishId: dishId,
        openid: getApp().globalData.openid
      },
      success: res => {
        wx.showToast({
          title: 'OK',
          duration: 3000,
          complete: () => {
            wx.redirectTo({
              url: '../dishDetail/dishDetail?dishId=' + dishId + '&openid=' + getApp().globalData.openid
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
  }
})