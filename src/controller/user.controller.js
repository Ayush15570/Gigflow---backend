import { User } from "../model/user.model.js";
import jwt from 'jsonwebtoken'


export const registerUser = async(req,res) => {
    try {
        const {name,email,password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({ message: "All fields required"})
        }

        const existingUser = await  User.findOne({email});

        if(existingUser){
            return res.status(400).json({message:"User already exists"})
        }

        const user = await User.create(
        { 
            name,
            email,
            password
        })

        res.status(201).json({
            message:"User registeed successfully"
        })

        

    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const loginUser = async(req,res) => {
    try {
        const {email,password} = req.body

        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({message: "Invalid credentials"})
        }

        const isMatch = await user.isPasswordCorrect(password);

        if(!isMatch){
            return res.status(400).json({message:"invalid credentials"})
        }

        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            {expiresIn : "7d"}
        )

        res.cookie("token",token,{
            httpOnly:true,
            secure:false,
            sameSite:"lax"
        })
        
        res.json({
            message: "Login successful",
            user: {
                _id: user._id,
                name:user.name,
                email: user.email
            }
        })

    
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}