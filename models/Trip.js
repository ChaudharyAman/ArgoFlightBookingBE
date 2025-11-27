import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      required: true
    },
    to: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    departureTime: {
      type: String,
      required: true
    },
    arrivalTime: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    totalSeats: {
      type: Number,
      required: true
    },
    bookedSeats: {
      type: [Number],
      default: []
    }
  },
  { timestamps: true }
);

export default mongoose.model("Trip", tripSchema);
