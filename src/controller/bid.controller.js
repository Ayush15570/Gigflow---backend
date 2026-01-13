import mongoose from "mongoose";
import { Bid } from "../model/bid.model.js";
import { Gig } from "../model/Gig.model.js";
import { io } from "../index.js";
export const createBid = async(req,res) => {
    try {
        const{gigId,message,price} = req.body;

        if(!gigId || !message || !price){
            return res.status(400).json({message:"All fields req"})
        }

        const gig = await Gig.findById(gigId)

        if(!gig || gig.status!=="open"){
            return res.status(400).json({message : "Gig not available"})
        }

        if(gig.ownerId.toString() === req.user._id.toString()){
            return res
            .status(400)
            .json({message:"you cannot bid on your own gig"})
        }

        const existingBid = await Bid.findOne({
            gigId,
            freelancerId: req.user._id
        })

        if(existingBid){
            return res.status(400).json({message:"Already applied"})
        }

        const bid = Bid.create({
            gigId,
            freelancerId: req.user._id,
            message,
            price
        })

        res.status(201).json(bid)


    } catch (error) {
     res.status(500).json({message:error.message}) 
    }
}

export const getBidsString = async(req,res) => {
    try {
        const {gigId} = req.params

        const gig = await Gig.findById(gigId)
        if(!gig){
            return res.status(404).json({message:"Gig not found"})
        }

        if(gig.ownerId.toString() !== req.user._id.toString()){
            return res.status(403).json({message:"Access denied"})
        }

        const bids = await Bid.find({gigId})
        .populate("freelancerId","name email")
        .sort({createdAt: -1})

        res.json(bids)

    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const hireBid = async(req,res) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const {bidId} = req.params
        const bid = await Bid.findById(bidId).session(session)

    if(!bid){
        return res.status(400).json({message:"Bid not found"})
    }

    const gig = await Gig.findById(bid.gigId).session(session)

    if(gig.ownerId.toString() !== req.user._id.toString()){
        return res.status(403).json({message:"Not authorized"})
    }
    
    if(gig.status === "assigned"){
        return res.status(400).json({message : "Gig already assigned"})
    }

    bid.status = "hired"
    await bid.save({session})

    await Bid.updateMany(
        {gigId:gig._id , _id:{$ne:bidId}},
        {status:"rejected"},
        {session}
    )

    gig.status = "assigned"
    await gig.save({session})
    
    await session.commitTransaction()
       io.to(bid.freelancerId.toString()).emit("hired", {
       gigId: gig._id,
       message: "You have been hired!",
    });
    res.json({message:"Freelancer hired"})
    
    } catch (error) {
        await session.abortTransaction()
    }finally{
        session.endSession();
    }



}