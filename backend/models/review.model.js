import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const reviewSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        toDoctor: {
            type: Schema.Types.ObjectId,
            ref: "Doctor"
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "Patient"
        }
    },
    {
        timestamps: true
    }
)


reviewSchema.plugin(mongooseAggregatePaginate)

export const review = mongoose.model("review", reviewSchema)