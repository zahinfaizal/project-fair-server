const users = require('../Models/userSchema')
const jwt = require ('jsonwebtoken')

//  register
exports.register = async(req,res)=>{
    console.log('Inside register controller function');
    const {username,email,password} = req.body
    // console.log(`${username}, ${email}, ${password}`);

    try{const existinguser = await users.findOne({email})
    if(existinguser){
        res.status(406).json("Account Already exist!!! Please Login....")
    }else{
        const newUser = new users({
            username,email,password,github:"",linkedIn:"",profile:""
        })
        await newUser.save()
        res.status(200).json(newUser)
        }   
    }
    catch(err){
        res.status(401).json(`Register API Failed, Error: ${err}`)
    }
}

// login
exports.login = async (req,res)=>{
    const {email,password} = req.body
    try{
        const existingUser = await users.findOne({email,password})
        if(existingUser){
            const token = jwt.sign({userId:existingUser._id},"supersecretkey12345")
            res.status(200).json({
                existingUser,token
            })
        }else{
            res.status(404).json("email or password is incorrect")
        }
    }catch (err) {
        res.status(401).json(`Log API Failed:${err}`)
    }
}

// edituser
exports.editUser = async (req,res)=>{
    const userId = req.payload
    const {username,email,password,github,linkedIn,profile} = req.body
    const uploadImage = req.file?req.file.filename:profile
    try{
        const updateUser = await users.findByIdAndUpdate({_id:userId},{
            username,email,password,github,linkedIn,profile,uploadImage
        },{new:true})
        await updateUser.save()
        res.status(200).json(updateUser)
    }catch(err){
        res.status(401).json(err)
    }
}
