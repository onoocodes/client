const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const app = express();
dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

const port = process.env.PORT || 5000;
app.listen(port,()=> console.log(`server started at port ${port}`));

//connect database 
mongoose.connect(process.env.MONGO_DB,{useNewUrlParser : true, useUnifiedTopology : true})
.then(console.log('connected to db'))
.catch(err=>console.log(err));

//model
const todoSchema = mongoose.Schema({
    todo : {
        type : String
    },
    reason : {
        type : String
    }
})

const Todo = mongoose.model('todo',todoSchema);

app.post('/',async(req,res)=>{
    const todo = new Todo({
        todo : req.body.todo,
        reason : req.body.reason
    })
    try {
        const newTodo = await todo.save();
        res.send('uploaded');
        
    } catch (error) {

        res.send(error)
    }
})
app.get('/', async (req,res)=>{
    const todos = await Todo.find()
    res.send(todos);

})

app.delete('/:id',async(req,res)=>{
    const todo = await Todo.findById(req.params.id);
    try {
        const removedTodo = await todo.remove();
        res.send('removed')
    } catch (error) {
        
    }
})