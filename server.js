const express =require('express')
const DbConnection = require('./config/database')
const app = express()
const cors = require('cors');

const port = 3027 || process.env.PORT 
app.use(express.json())
app.use(cors())

//GET All Users with Posts And Comments

app.get("/load",async(req,res) => {
    let db = await DbConnection()
    try {
        const result = await db.collection("users").aggregate([
            {
                $lookup:{
                    from:'posts',
                    localField:"id",
                    foreignField:"userId",
                    as:"posts"
                },
            },
            {
                $lookup:{
                    from:'comments',
                    localField:"posts.id",
                    foreignField:"postId",
                    as:"comments"
                }
            },
        ]).toArray();

        res.status(200).json(result)
    } catch (error) {
        res.status(200).json({message:`Connection Error: ${error.message}`})
    }
})

//GET specific User with posts and comments

app.get("/users/:id",async(req,res) => {
    const userId = Number(req.params.id) 
    // console.log("userId:",userId)
    let db = await DbConnection()
    try {
        const checkUserId = await db.collection('users').findOne({id:userId})
        if(checkUserId === null){
            return res.status(404).send({message:"User ID Not Found"})
        }
        const result = await db.collection('users').aggregate([
            {$match:{id:userId}},
            {
                $lookup:{
                    from:'posts',
                    localField:"id",
                    foreignField:"userId",
                    as:"posts"
                },
            },
            {
                $lookup:{
                    from:'comments',
                    localField:"posts.id",
                    foreignField:"postId",
                    as:"comments"
                }
            },
        ]).toArray()
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({Error:`${error.message}`})
    }
})



//Delete Specific User 

app.delete("/users/:id",async(req,res) => {
    let db = await DbConnection()
    const userId = Number(req.params.id)
    console.log(userId)
    try {
        const result = await db.collection('users').deleteOne({id:userId})
        if(!result.deletedCount){
            return res.status(400).send({message:"User Id not found!!"})
        }else{
            res.status(200).json({message:"User Deleted Successfully!!"})
        }
        
    } catch (error) {
         res.status(400).json({message:`Error: ${error.message}`})
    }
})

//Delete All Users 

app.delete("/users",async(req,res) => {
    let db = await DbConnection()
    try {
        const allUsersDeleteQuery = await db.collection('users').deleteMany({})
        if(!allUsersDeleteQuery.deletedCount){
            res.status(204).json({message:"No Content to Show"})
        }else{
            res.status(200).json({message:"All Users delete Successfully!!"})
        }  
    } catch (error) {
         res.status(400).json({message:`Error: ${error.message}`})
    }
})

//Get All Posts

app.get("/posts",async(req,res) => {
    const db = await DbConnection()
    try {
        const result = await db.collection('posts').find().toArray()
        res.status(200).json({Posts:result})
    } catch (error) {
        res.status(400).json({Error:`${error.message}`})
    }
})

//Get All Comments

app.get("/comments",async(req,res) => {
    const db = await DbConnection()
    try {
        const result = await db.collection('comments').find().toArray()
        res.status(200).json({Comments:result})
    } catch (error) {
        res.status(400).json({Error:`${error.message}`})
    }
})

//Get Specific Post

app.get("/posts/:id",async(req,res) => {
    const db = await DbConnection()
    const postId = Number(req.params.id)
    try {
        const result = await db.collection('posts').findOne({id:postId})
        if(result === null){
            return res.status(404).send({message:"Invalid Post Id"})
        }
        res.status(200).json({Post:result})
    } catch (error) {
        res.status(400).json({Error:`${error.message}`})
    }
})

//Get Specific Comment

app.get("/comments/:id",async(req,res) => {
    const db = await DbConnection()
    const commentId = Number(req.params.id)
    try {
        const result = await db.collection('comments').findOne({id:commentId})
        if(result === null){
            return res.status(404).send({message:"Invalid Comment Id"})
        }
        res.status(200).json({Comment:result})
    } catch (error) {
        res.status(400).json({Error:`${error.message}`})
    }
})

//Update User Or Create User
app.put("/users/:id",async(req,res) => {
    let db = await DbConnection()
    const userDetails = req.body;
    const {name,username,email,address,phone,website,company} = userDetails
    const userId = Number(req.params.id)
    // console.log("userDetails:",userDetails)
    try {
        const checkUserId = await db.collection('users').findOne({id:userId})
        if(checkUserId === null){
            const createNewUser = await db.collection('users').insertOne({
                    "id":`${userId}`,
                    "name":"Rahul Attuluri",
                    "username":"rahul",
                    "email":"rahul@test.com",
                    "address":{
                        "street": "Panjagutta",
                        "suite": "Apt. 123",
                        "city": "Hyderabad",
                        "zipcode": "92998-3874",
                        "geo": {
                            "lat": "-37.3159",
                            "lng": "81.1496"
                        }
                    },
                    "phone": "9807654321",
                    "website": "rahulAttuluri.org",
                    "company": {
                    "name": "My_Brand_Own_Fashion",
                    "catchPhrase": "Multi-layered client-server neural-net",
                    "bs": "harness real-time e-markets"
                    }
            })
            res.status(201).json({message:`New User Created Successfully at:${userId}`})
        }else{
            await db.collection('users').updateOne({id:userId},{$set:{name:`${name}`,username:`${username}`,email:`${email}`,street:`${address.street}`,suite:`${address.suite}`,city:`${address.city}`,zipcode:`${address.zipcode}`,lat:`${address.geo.lat}`,lng:`${address.geo.lng}`,phone:`${phone}`,website:`${website}`,name:`${company.name}`,catchPhrase:`${company.catchPhrase}`,bs:`${company.bs}`}})
            res.status(409).json({message:"User updated Successfully!!"})
        }
        } catch (error) {
        res.status(400).json({Error:`${error.message}`})
        }
    })

//Specific Post Update 
app.put("/posts/:id",async(req,res) => {
    const postId = Number(req.params.id);
    const {userId,title,body} = req.body;
    console.log(userId,title,body)
    console.log("PostID:",postId)
    let db = await DbConnection()
    try {
        const checkPostId = await db.collection('posts').findOne({id:postId})
        if(checkPostId === null){
            return res.status(400).send({message:"Post ID Not Found"})
        }
        await db.collection('posts').updateOne({id:postId},{$set:{userId:`${userId}`,title:`'${title}'`,body:`'${body}'`}})
        res.status(200).json({message:"Post Updated Successfully!"})
    } catch (error) {
        res.status(400).json({Error:`${error.message}`})
    }
})


//Specific Comment Update 

app.put("/comments/:id",async(req,res) => {
    const commentId = Number(req.params.id);
    const {postId,name,email,body} = req.body;
    const commentDetails = req.body;
    console.log("commentDetails:",commentDetails)
    // console.log("CommentId:",commentId)
    let db = await DbConnection()
    try {
        const checkCommentId = await db.collection('comments').findOne({id:commentId})
        if(checkCommentId === null){
            return res.status(400).send({message:"Comment ID Not Found"})
        }
        await db.collection('comments').updateOne({id:commentId},{$set:{postId:`${postId}`,name:`'${name}'`,email:`'${email}'`,body:`'${body}'`}})
        res.status(200).json({message:"Comment Updated Successfully!"})
    } catch (error) {
        res.status(400).json({Error:`${error.message}`})
    }
})


app.listen(port,(async() => {
    console.log(`Server Running at:http://localhost:${port}/`)
}))

