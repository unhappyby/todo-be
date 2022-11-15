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
  priority: { type: Boolean, default: false },
  order: { type: Number, default: 1 }
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
  if (Math.random() > 0.7) {
    res.status(500).json({status: 500, message: "Something went wrong!!! Server will explode in few minutes for sure -_- "})
    return;
  }

  TaskModel.find({}, {__v: 0}, {sort: {priority: "desc", order: "asc"}}, function(error, data) {
    if(error) throw error

    response.json({tasks: data});
  });
});

app.post('/tasks', function(request, response) {
  console.log(request.body)

  if (request.body.name == null || request.body.name.trim() == "") {
    response.send('Task name cannot be empty!')
    return;
  }

  TaskModel(request.body).save(function(error, data) {
    if(error) throw error

    response.json(data);
  });
});

app.post('/tasks/:id', async function(request, response) {
  console.log(request.body)
  
  let update = {};

  if (request.body.name != null) {
    update['name'] = request.body.name;
  }
  if (request.body.status != null) {
    update['status'] = request.body.status;
  }
  if (request.body.priority != null) {
    update['priority'] = request.body.priority;
  }
  if (request.body.order != null) {
    update['order'] = request.body.order;
  }

  let task = await TaskModel.findOneAndUpdate({_id: request.params.id}, update, {
    returnOriginal: false,
    useFindAndModify: false
  });

  response.json(task);
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