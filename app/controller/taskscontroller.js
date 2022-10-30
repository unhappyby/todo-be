var dbconfig = require('../config/db.config');
var mongoose = require('mongoose');

mongoose.connect(dbconfig.url);


const Status = Object.freeze({
  ACTIVE: 'ACTIVE',
  DONE: 'DONE'
});

var taskSchema = new mongoose.Schema({
  name: String,
  status: { type: String, default: Status.ACTIVE },
  priority: Boolean,
  order: Number
});

taskSchema.virtual('id').get(function(){
  console.log(this);
  return this._id.toHexString();
});

taskSchema.set('toJSON', {
  virtuals: true,
  versionKey:false,
  transform: function (doc, ret) {   delete ret._id  }
});

var TaskModel = mongoose.model("Task", taskSchema);

// controller
module.exports = function(app) {

app.get('/tasks', function(request, response) {
  TaskModel.find({}, {__v: 0},  {sort: {order: "asc"}}, function(error, data) {
    if(error) throw error

    response.json({tasks: data});
  });
});

app.post('/tasks', function(request, response) {
  console.log(request.body)

  TaskModel(request.body).save(function(error, data) {
    if(error) throw error

    response.json(data);
  });
});

app.delete('/tasks/:id', function(request, response) {
  TaskModel.find({_id: request.params.id}).remove(function(error, data) {
    if(error) throw error

    response.json(data);
  });
});

app.post('/tasks/change-order', async function(request, response) {
  console.log(request.body)

  const writeOperations = Object.entries(request.body).map(([id, order]) => {
    return {
      updateOne: {
        filter: { _id: id },
        update: { order: order }
      }
    };
  });

  await TaskModel.bulkWrite(writeOperations)

  response.json(request.body)
});
};