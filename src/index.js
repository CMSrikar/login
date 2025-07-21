const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const collection = require('./config'); // Import the user model

const app = express();
//convert data into json
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

// use EJS as the view engine
// app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// stataic files (styles sheets)
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render("login");
});

app.get('/signup', (req, res) => {
    res.render("signup");
});

//Register user
app.post('/signup', async (req,res)=>{
    const data= {
        username : req.body.username,
        email : req.body.email,
        password : req.body.password
    }
    //chech if user already exists
    const existingUser = await collection.findOne({ username: data.username });
    // const existingEmail = await collection.findOne({ email: data.email });


    //if user already exists

    if (existingUser) {
        return res.status(400).send('User already exists');
    }//check if email already exists 
    // and if the email is valid
    //using regex to check if email is valid    
    else if (!data.email || !data.password) {
        return res.status(400).send('Please fill all the fields');
    }
    //check if email already exists
    const existingEmail = await collection.findOne({ email: data.email });
    if (existingEmail) {
        return res.status(400).send('Email already exists');
    }else if(!data.email.includes('@')) {
        return res.status(400).send('Please enter a valid email');
    }

    
    else{
        //hash the password
        const saltRounds = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password= hashedPassword;//update the password with hashed password
        const userdata = await collection.insertMany(data);
        console.log(userdata);
    }
});

//Login user
app.post('/login', async (req, res) => {
    try{
        const check = await collection.findOne({ username: req.body.username });
        if(!check) {
            res.send("User not found");
        }
         const checkemail  = await collection.findOne({ email: req.body.email });
        if (!checkemail) {
            return res.send("Email not found");
        }
        //compare the password
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (isPasswordMatch) {
            res.render("home");
        } else {
            res.send("Invalid password");
        }
    }catch{
        res.send("Worng details");
    }
});
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);

});