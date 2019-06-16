const express = require('express');
const connectDB = require('./config/db');


const app = express();

// DB Connect 
 connectDB();

 // Middleware Init
 app.use(express.json({extended:true}))

 // Define Route
 app.use('/api/users', require('./routes/api/users'))
 app.use('/api/posts', require('./routes/api/post'))
 app.use('/api/profile', require('./routes/api/profile'))
 app.use('/api/auth', require('./routes/api/auth'))

app.get('/',(req,res)=>{
    res.send('API Running')
})

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=> console.log(`server is running on port ${PORT}`));