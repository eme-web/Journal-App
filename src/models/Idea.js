import { model, Schema} from "mongoose";

const IdeaSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    user:{type: String, required:true}
});

export default model('Idea', IdeaSchema);