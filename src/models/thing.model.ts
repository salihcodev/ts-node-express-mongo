import mongoose from 'mongoose';
const { Schema } = mongoose;

// create door schema:
// >>>> door schema
const doorSchema = new Schema({
    createdAt: {
        type: Date,
        default: new Date(),
    },
});

// >>>> create door model
const Thing = mongoose.model('Thing', doorSchema);
export default Thing;
