var DbMove = require('./db-move');
var DbMerge = require('./db-merge');


var app = {
  isFinishMove: false,
  isFinishMerge: false,
  async done() {
    await DbMove.done();
    this.isFinishMove = true;
    await DbMerge.done();
    this.isFinishMerge = true;
  }
};
module.exports = app;
