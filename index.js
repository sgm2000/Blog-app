const express = require('express');
const path = require('path')
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser');
const { checkForAuthencationCookie } = require('./middlewares/authentication');
const Blog = require('./models/blog');




const app = express();
const PORT = 8000;

mongoose.connect('mongodb://localhost:27017/blog-app').then(() => console.log('connected to MongoDB'));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthencationCookie("token"));
app.use(express.static(path.resolve('./public')));

app.get('/', async (req, res) => {
    const allBlogs = await Blog.find({}).sort({ createdAt: -1 });

    res.render('home', {
        user: req.user,
        blogs: allBlogs,
    });
});

app.use('/user', userRoute);
app.use('/blog', blogRoute);

app.listen(PORT, () => console.log(`Server started at port: ${PORT}`))

