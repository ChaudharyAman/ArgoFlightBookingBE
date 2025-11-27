import express from "express";



import { registerUser, loginUser, getMe } from "../controllers/authController.js";
import { createTrip, getTrips, getTripById, updateTrip, deleteTrip, getLocations } from "../controllers/tripController.js";
import { createBooking, getMyBookings, getBookingById, cancelBooking } from "../controllers/bookingController.js";


import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { updateAvatar, updateProfile } from "../controllers/userController.js";
import upload from "../middlewares/multerMiddleware.js";


const router = express.Router();


router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.get("/auth/me", protect, getMe);



router.get("/locations", getLocations);
router.get("/trips", getTrips);
router.get("/trips/:id", getTripById);
router.post("/admin/trips", protect, authorizeRoles("admin"), createTrip);
router.put("/admin/trips/:id", protect, authorizeRoles("admin"), updateTrip);
router.delete("/admin/trips/:id", protect, authorizeRoles("admin"), deleteTrip);


router.post("/bookings", protect, createBooking);
router.get("/bookings/me", protect, getMyBookings);
router.get("/bookings/:id", protect, getBookingById);
router.delete("/bookings/:id", protect, cancelBooking);



router.put("/auth/update-avatar", protect, upload.single("avatar"), updateAvatar);
router.put("/auth/update", protect, upload.single("avatar"), updateProfile);


export default router;
