import express from "express";
import dotenv from "dotenv"
import connectDB from "./config/db.js";
import { engine } from 'express-handlebars';
import bodyParser from "body-parser";
import passport  from "passport";
import methodOverride from 'method-override';
import flash from "connect-flash";
import session from "express-session";
import ideas from "./routes/ideas.js";
import users from "./routes/users.js"
import path from "path";
import { fileURLToPath } from "url";
import localPassport from "./config/passport.js";

dotenv.config({path: "./config/config.env"})

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

connectDB()
localPassport(passport)

// Handlebars Middleware
app.engine('handlebars', engine({
    defaultLayout: 'main',
    allowProtoPropertiesByDefault: true
}));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'handlebars')
// app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Method override middleware
app.use(methodOverride('_method'));

// Express session
app.use(session({
    key: 'user_id',
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
  }));

  // passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

app.use(flash());

// Global variables
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null;
    console.log("locals",req.user)
    next();
});

//use routes
app.use('/ideas', ideas);
app.use('/users', users)

// Index route
app.get('/', (req, res) =>{
    const title = "Welcome"
    res.render(__dirname + "/views/index", {
        title: title
    })
});

//About Route
app.get('/about', (req, res) =>{
    res.render("About")
});



const port = process.env.PORT;

app.listen(port, () =>{
    console.log(`Server started on port ${process.env.PORT}`)
});