import mongoose from 'mongoose';
const { Schema } = mongoose;

// create door schema:
// >>>> door schema
const tourSchema = new Schema({
    createdAt: {
        type: Date,
        default: new Date(),
    },
});

// >>>> create door model
const Tour = mongoose.model('Tour', tourSchema);
export default Tour;
