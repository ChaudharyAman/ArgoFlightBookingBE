import Trip from "../models/Trip.js";



const getDuration = (start, end) => {
  const [h1, m1] = start.split(":").map(Number);
  const [h2, m2] = end.split(":").map(Number);

  const t1 = h1 * 60 + m1;
  const t2 = h2 * 60 + m2;

  let diff = t2 - t1;
  if (diff < 0) diff += 24 * 60;

  const hours = Math.floor(diff / 60);
  const mins = diff % 60;

  return `${hours}h ${mins}m`;
};



export const getLocations = async (req, res) => {
  try {
    const trips = await Trip.find({}, "from to");

    const fromSet = new Set();
    const toSet = new Set();

    trips.forEach((t) => {
      if (t.from) fromSet.add(t.from);
      if (t.to) toSet.add(t.to);
    });

    return res.json({
      from: Array.from(fromSet),
      to: Array.from(toSet),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};



export const createTrip = async (req, res) => {
  try {
    const { from, to, date, departureTime, arrivalTime, price, totalSeats } =
      req.body;

    const trip = await Trip.create({
      from,
      to,
      date,
      departureTime,
      arrivalTime,
      price,
      totalSeats,
    });

    const tripObj = trip.toObject();
    tripObj.duration = getDuration(departureTime, arrivalTime);

    return res.status(201).json(tripObj);
  } catch (error) {
    return res.status(500).json({
      message: `Error creating trip: ${error.message}`,
    });
  }
};



export const getTrips = async (req, res) => {
  try {
    const { from, to, date } = req.query;

    const query = {};

    if (from) query.from = new RegExp(from, "i");
    if (to) query.to = new RegExp(to, "i");

    if (date) {
      const d = new Date(date);
      query.date = {
        $gte: new Date(d.setHours(0, 0, 0)),
        $lte: new Date(d.setHours(23, 59, 59)),
      };
    }

    const trips = await Trip.find(query).sort({ date: 1 });

    const tripsWithDuration = trips.map((t) => {
      const tripObj = t.toObject();
      tripObj.duration = getDuration(t.departureTime, t.arrivalTime);
      return tripObj;
    });

    return res.json(tripsWithDuration);
  } catch (error) {
    return res.status(500).json({
      message: `Error fetching trips: ${error.message}`,
    });
  }
};



export const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const tripObj = trip.toObject();
    tripObj.duration = getDuration(trip.departureTime, trip.arrivalTime);

    return res.json(tripObj);
  } catch (error) {
    return res.status(500).json({
      message: `Error: ${error.message}`,
    });
  }
};



export const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const tripObj = trip.toObject();

    if (trip.departureTime && trip.arrivalTime) {
      tripObj.duration = getDuration(trip.departureTime, trip.arrivalTime);
    }

    return res.json(tripObj);
  } catch (error) {
    return res.status(500).json({
      message: `Update error: ${error.message}`,
    });
  }
};




export const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    return res.json({ message: "Trip deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      message: `Delete error: ${error.message}`,
    });
  }
};
