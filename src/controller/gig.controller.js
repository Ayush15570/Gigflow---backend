import { Gig } from "../model/Gig.model.js";

export const createGig = async(req,res) => {
    try {
        const {title,description,budget} = req.body

        if(!title || !description || !budget){
            return res.status(400).json({message:"All fields required"})
        }
        
        const gig = await Gig.create({
            title,
            description,
            budget,
            ownerId: req.user._id
        })

        res.status(201).json(gig)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}


export const getOpenGigs = async(req,res) => {
    try {
        const {search} = req.query

        const query = {
            status: "open"
        }

        if(search){
            query.title = { $regex: search, $options: "i" }
        }
        const gigs = await Gig.find(query).populate("ownerId","name email").sort({createdAt:-1})

        res.json(gigs)

    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const getMyGigs = async(req,res) => {
    try {
        const gigs = await Gig.find({
            ownerId: req.user._id
        }).sort({createdAt:-1})

        res.json(gigs)
    } catch (error) {
        res.status(500).json({message : "Failed to fetch gigs"})
    }
}