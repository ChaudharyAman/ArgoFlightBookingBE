import Booking from "../models/Booking.js";
import Trip from "../models/Trip.js";




export const createBooking = async (req, res) => {
  try {
    const { tripId, seats } = req.body;

    if (!tripId || !Array.isArray(seats) || seats.length === 0)
      return res.status(400).json({ message: "Invalid booking data" });

    const trip = await Trip.findById(tripId);
    if (!trip)
      return res.status(404).json({ message: "Trip not found" });

    const conflict = seats.some((s) => trip.bookedSeats.includes(s));
    if (conflict)
      return res.status(400).json({
        message: "One or more seats already booked",
      });

    const booking = await Booking.create({
      user: req.user._id,
      trip: tripId,
      seats,
      totalPrice: seats.length * trip.price,
      paymentStatus: "paid",
      status: "upcoming",
    });

    trip.bookedSeats.push(...seats);
    await trip.save();

    return res.json(booking);
  } catch (err) {
    return res.status(500).json({
      message: "Booking error",
      error: err.message,
    });
  }
};


export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("trip");

    const now = new Date();
    const upcoming = [];
    const past = [];

    bookings.forEach((b) => {
      if (!b.trip) return;

      const tripDate = new Date(b.trip.date);

      if (tripDate >= now && b.status !== "cancelled") {
        upcoming.push(b);
      } else {
        past.push(b);
      }
    });

    return res.json({ upcoming, past });

  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch bookings",
      error: err.message,
    });
  }
};



export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("trip");

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    return res.json(booking);
  } catch (err) {
    return res.status(500).json({
      message: "Error fetching booking",
      error: err.message,
    });
  }
};




export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("trip");

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    if (!booking.trip)
      return res.status(404).json({ message: "Trip not found for this booking" });

    booking.status = "cancelled";
    await booking.save();

    booking.trip.bookedSeats = booking.trip.bookedSeats.filter(
      (seat) => !booking.seats.includes(seat)
    );
    await booking.trip.save();

    return res.json({ message: "Booking cancelled successfully" });

  } catch (err) {
    return res.status(500).json({
      message: "Cancel error",
      error: err.message,
    });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email avatar")
      .populate("trip");

    return res.json(bookings);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch all bookings",
      error: err.message,
    });
  }
};

