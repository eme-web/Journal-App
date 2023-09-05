import express from "express"
import Idea from "../models/Idea.js";
import User from "../models/User.js"
import { validateUsers } from "../helpers/auth.js";

const router = express.Router();




// Idea Index Page
router.get('/', validateUsers, async(req, res) =>{
    const ideas = await Idea.find().lean()
    res.status(200, ideas)
    res.render('ideas/index', {
        ideas:ideas
    });  
});

// Add Idea Form
router.get('/add', validateUsers, (req, res) =>{
    res.render("ideas/add")
});

// Edit Idea Form
router.get('/edit/:id', validateUsers, async(req, res) =>{
      const { params: { id }} = req

     const idea = await Idea.findById({_id: id}).lean()
      res.status(200, idea)
    res.render("ideas/edit", {
        idea:idea
    }); 
});

// Process Form
router.post('/', validateUsers,  async(req, res) =>{
   let errors = [];

   if(!req.body.title){
    errors.push({text: 'Please add a title'});
   }
   if(!req.body.details){
    errors.push({text: 'Please add some details'});
   }

   if(errors.length > 0){
    res.render('/add',{
        errors: errors,
        title: req.body.title,
        details: req.body.details
    });
   } else {
    const newUser = {
        title: req.body.title,
        details: req.body.details,    
        
    }
     await new Idea(newUser).save();
     req.flash('success_msg', 'Video idea added.');
     res.redirect('/ideas');

   }
});

//Edit Form Processes
router.put('/:id', validateUsers, async(req, res) =>{
    const { params: { id }, body } = req
    
    const idea = await Idea.findByIdAndUpdate(
        {_id: id},
        {$set: {...body} },
        { new: true });
    res.status(res, 201, idea);
    req.flash('success_msg', 'Video idea updated.');
    res.redirect('/ideas');

});

//Delete Idea
router.delete('/:id', validateUsers, async(req, res) =>{
    const { params: { id } } = req
    
    const idea = await Idea.findByIdAndDelete({_id:id});

    req.flash('success_msg', 'Video idea removed');
    res.status(res, 200, idea);
    res.redirect('/ideas');
});



export default router;