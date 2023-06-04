import { useState } from "react";
import { facilities } from "./Facitities";

const FacilityBooking = () => {
  const [bookings, setBookings] = useState([]);

  const isSlotAvailable = (facility, startTime, endTime) => {
    for (const booking of bookings) {
      if (booking.facility === facility && startTime < booking.endTime && endTime > booking.startTime) {
        return false;
      }
    }
    return true;
  };

  const calculateBookingAmount = (facility, startTime, endTime) => {
    let bookingAmount = 0;
    const rates = facilities.find((f) => f.name === facility)?.rates;
    if (rates) {
      for (const rate of rates) {
        if (startTime < rate.endTime && endTime > rate.startTime) {
          const overlapStartTime = startTime > rate.startTime ? startTime : rate.startTime;
          const overlapEndTime = endTime < rate.endTime ? endTime : rate.endTime;
          const hours = Math.ceil((overlapEndTime - overlapStartTime) / 60);
          bookingAmount += hours * rate.rate;
        }
      }
    }
    return bookingAmount;
  };

  const bookFacility = (facility, date, startTime, endTime) => {
    const bookingAmount = calculateBookingAmount(facility, startTime, endTime);
    if (isSlotAvailable(facility, startTime, endTime)) {
      setBookings((prevBookings) => [
        ...prevBookings,
        {
          facility: facility,
          date: date,
          startTime: startTime,
          endTime: endTime,
          bookingAmount: bookingAmount
        }
      ]);
      return { status: "Booked", amount: bookingAmount };
    } else {
      return { status: "Booking Failed", reason: "Already Booked" };
    }
  };

  const handleBooking = (e) => {
    e.preventDefault();
    const facility = e.target.facility.value;
    const date = e.target.date.value;
    const startTime = e.target.startTime.value;
    const endTime = e.target.endTime.value;
    const result = bookFacility(facility, date, startTime, endTime);
    console.log(result);
  };

  return (
    <div>
      <h2>Facility Booking</h2>
      <div>
        <h3>Available Facilities</h3>
        <ul>
          {facilities.map((facility) => (
            <li key={facility.name}>
              {facility.name}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Book Facility</h3>
        <form onSubmit={handleBooking}>
          <label>
            Facility:
            <select name="facility">
              {facilities.map((facility) => (
                <option key={facility.name} value={facility.name}>
                  {facility.name}
                </option>
              ))}
            </select>
          </label>
          <br />
          <label>
            Date:
            <input type="date" name="date" />
          </label>
          <br />
          <label>
            Start Time:
            <input type="time" name="startTime" />
          </label>
          <br />
          <label>
            End Time:
            <input type="time" name="endTime" />
          </label>
          <br />
          <button type="submit">Book</button>
        </form>
      </div>
      <div>
        <h3>Bookings</h3>
        <ul>
          {bookings.map((booking, index) => (
            <li key={index}>
              Facility: {booking.facility} | Date: {booking.date} | Time: {booking.startTime} - {booking.endTime} | Amount: {booking.bookingAmount}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FacilityBooking;
