const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose')
const x = require('./schema')

const app = express();
const port = 3010;
const URL = "mongodb+srv://db_assignment:vraj1204@cluster0.oz3ku.mongodb.net/"
app.use(express.json())
mongoose.connect(URL,{useNewUrlParser:true,useUnifiedTopology:true}).then(
  ()=>{
    console.log(`DB connected to atlas`)
  }
).catch((err)=>{
  console.error(`connection issue ${err}`)
})

app.post('/test',async(req,res)=>{
  try{
    const{name,description,price}  = req.body
    if(!name||!price){
      return res.status(400).json({
        success:false,
        message:`Name and price required`
      })
    }

    const menuItem= await x.create({
      name,
      description,
      price
    });

    res.status(201).json({
      success:true,
      data:menuItem,
      message:'created'
    })
  }catch(err){
  res.status(500).json({
    success:false,
    message:'error fetching',
    error:err.message
  })
  }
})


app.get('/test',async (req,res)=>{
  try{
    const xyz = await x.find()

    res.status(201).json({
      success:true,
      message:"Successfully fetched",
      data:xyz
    })

  }catch(err){

    res.status(500).json({
      success:false,
      message:`Error${err.message}`,
      
    })

  }
})



app.put('/test/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  try {
    const updatedItem = await x.findByIdAndUpdate(id, { name, description, price }, { new: true });
    if (!updatedItem) return res.status(404).json({ error: "Menu item not found" });

    res.status(200).json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/test/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedItem = await x.findByIdAndDelete(id);
    if (!deletedItem) return res.status(404).json({ error: "Menu item not found" });

    res.status(200).json({ message: "Menu item deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
