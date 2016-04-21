module.exports = function() {
  return new Promise((resolve, reject) => {
    this.dispatch.get('/orders').then((res) => {
      resolve(res.data);
    }).catch(reject);
  });
};