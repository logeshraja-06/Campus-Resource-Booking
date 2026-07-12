import Booking from "../models/Booking.js";

export const createBooking = async (req, res) => {
  try {

    const {
      resource,
      startDateTime,
      endDateTime,
      purpose
    } = req.body;
    // Required Fields Validation
if (
  !resource ||
  !startDateTime ||
  !endDateTime ||
  !purpose
) {
  return res.status(400).json({
    success: false,
    message: "All fields are required",
  });
}
// End Time Validation
if (new Date(startDateTime) >= new Date(endDateTime)) {

    return res.status(400).json({

        success:false,

        message:"End time must be after Start time"

    });

}
// Past Date Validation
if(new Date(startDateTime)<new Date()){

    return res.status(400).json({

        success:false,

        message:"Past booking is not allowed"

    });

}
// Maximum Duration Validation
const hours =
(
new Date(endDateTime)-new Date(startDateTime)
)
/(1000*60*60);

if(hours>8){

return res.status(400).json({

success:false,

message:"Maximum booking duration is 8 hours"

});

}

    // Check Conflict
    const conflict = await Booking.findOne({
      resource,

      status: {
        $in: ["Pending", "Approved"]
      },

      startDateTime: {
        $lt: endDateTime
      },

      endDateTime: {
        $gt: startDateTime
      }
    });

    if (conflict) {
      return res.status(400).json({
        success: false,
        message: "Time Slot Already Booked"
      });
    }

    const booking = await Booking.create({
      student: req.user.id,
      resource,
      startDateTime,
      endDateTime,
      purpose
    });

    res.status(201).json({
      success: true,
      message: "Booking Created Successfully",
      booking
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};
export const getMyBookings = async (req, res) => {
  try {

    const bookings = await Booking.find({
      student: req.user.id
    })
      .populate("resource")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};
// Get All Bookings (Admin)
export const getAllBookings = async (req, res) => {
  try {

    const bookings = await Booking.find()
      .populate("student", "name email department year")
      .populate("resource", "name category location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};
export const approveBooking = async (req, res) => {
  try {

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking Not Found"
      });
    }

    booking.status = "Approved";
    booking.approvedBy = req.user.id;

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking Approved Successfully",
      booking
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};
export const rejectBooking = async (req, res) => {
  try {

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking Not Found"
      });
    }

    booking.status = "Rejected";
    booking.rejectionReason = req.body.reason;

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking Rejected",
      booking
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};
// Admin Dashboard Statistics
export const getDashboardStats = async (req, res) => {
  try {

    const totalBookings = await Booking.countDocuments();

    const pendingBookings = await Booking.countDocuments({
      status: "Pending",
    });

    const approvedBookings = await Booking.countDocuments({
      status: "Approved",
    });

    const rejectedBookings = await Booking.countDocuments({
      status: "Rejected",
    });

    const totalResources = await Resource.countDocuments();

    const totalStudents = await User.countDocuments({
      role: "student",
    });

    res.status(200).json({
      success: true,
      stats: {
        totalResources,
        totalStudents,
        totalBookings,
        pendingBookings,
        approvedBookings,
        rejectedBookings,
      },
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};