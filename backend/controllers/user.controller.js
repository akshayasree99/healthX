import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import {User} from "../models/user.model.js";

const generateAcessAndReferenceTokens= async function(userId)
{
    try{
        const user=await User.findBy(userId);
        const accessToken=user.generateAcessTokens()
    }
    catch(error){

    }
}