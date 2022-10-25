const express = require('express');
const router = express.Router();

const Post = require('../models/Post');

//GET ALL THE POSTS
router.get('/', async(req,res)=>{
    try {
        const posts = await Post.find();
        res.send(sendHtml(res,posts));
    } catch (error) {
        res.json({message:error})
    }
});

function sendHtml(res,posts){
    let html = `<form method="post">
    <input type="text" name="title" id="" value=""><br>
    <input type="text" name="description" id="" value=""><br>
    <input type="submit">
</form>`;
    posts.slice().reverse().forEach(element => {
        html += "<h1>"+element.title+"</h1>"+
        "<p>"+element.description+"</p>"
    });
    return html;
}

//GET SPECIFIC POST
router.get('/:postId',async(req,res)=>{
    try {
        const post = await Post.findById(req.params.postId);
        res.json(post);
        
    } catch (error) {
        res.json({message:error})
    }
})

//DELETE SPECIFIC POST
router.delete('/:postId',async(req,res)=>{
    try {
        const post = await Post.remove({_id:req.params.postId});
        res.json(post);
    } catch (error) {
        res.json({message:error})
    }
})

//Update a post
router.patch('/:postId',async(req,res)=>{
    try {
        const post = await Post.updateOne(
            {_id:req.params.postId},
            {$set: {title: req.body.title}}
            );
        res.json(post);
        
    } catch (error) {
        res.json({message:error})
    }
})


//SUBMIT A POST
router.post('/',(req,res)=>{
    let body = []
    let savedPost="";
    req.on('data',(chunk)=>{
        body.push(chunk)
    })
    req.on('end',async()=>{
        const bufferedBody = Buffer.concat(body).toString();
        body = bufferedBody.split('&');
        post  = new Post({
            title: body[0].split('=')[1],
            description: body[1].split('=')[1]
        })
        savedPost = await post.save();
        try {
            res.json(savedPost)
        } catch (error) {
            res.json({message:error})
        }
    })
});

// router.post('/',async (req,res)=>{
//     const post  = new Post({
//         title: req.body.title,
//         description: req.body.description
//     })
//     const savedPost = await post.save();
//     try {
//         res.json(savedPost)
//     } catch (error) {
//         res.json({message:error})
//     }
// });

module.exports = router;