import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
    seats: [Number],
    totalPrice: Number,
    paymentStatus: { type: String, default: "paid" },
    status: { type: String, default: "upcoming" },
    bookingDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
