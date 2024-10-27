import React, { useState, useEffect } from 'react';
import authUtils from '../../../utils/jwtRollNumber';
import './billings.css';
const BillingPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [accbal, setAccbal] = useState(0);
    const [totalMeals, setTotalMeals] = useState(0);
    const [breakfastCount, setBreakfastCount] = useState(0);
    const [lunchCount, setLunchCount] = useState(0);
    const [dinnerCount, setDinnerCount] = useState(0);
    const [totalPaid, setTotalPaid] = useState(0);

    const fetchBookings = async () => {
        try {
            const isAuthenticated = authUtils.checkAuthentication();
            let rollnumber = '';
            if (isAuthenticated) {
                rollnumber = await authUtils.fetchRollNumber();
            } else {
                authUtils.redirectToLogin();
                return;
            }

            const response = await fetch(`https://digital-mess.vercel.app/api/main/book/history/${rollnumber}`);
            if (!response.ok) {
                throw new Error('Failed to fetch booking history');
            }

            const data = await response.json();
            setBookings(data.bookings);
            calculateBillingData(data.bookings);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching bookings:', error.message);
        }
    };

    const calculateBillingData = (bookingsData) => {
        let totalAmount = 0;
        let breakfast = 0;
        let lunch = 0;
        let dinner = 0;

        bookingsData.forEach(booking => {
            totalAmount += (booking.status === 'present' ? 75 : 10);
            if (booking.class.className === 'breakfast') {
                breakfast++;
            } else if (booking.class.className === 'lunch') {
                lunch++;
            } else if (booking.class.className === 'dinner') {
                dinner++;
            }
        });

        setAccbal(totalAmount);
        setTotalMeals(bookingsData.length);
        setBreakfastCount(breakfast);
        setLunchCount(lunch);
        setDinnerCount(dinner);
        setTotalPaid(totalAmount);
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const renderBillingData = () => {
        let currentDate = null;
        return bookings.map((booking, index) => {
            const bookingDate = new Date(booking.bookingDate).toLocaleDateString('en-GB');
            if (bookingDate !== currentDate) {
                currentDate = bookingDate;
                return (
                    <>
                        <div key={index} className="">
                            <div className="vertical-box mt-5">
                                <div className="box shadow">

                                    <div className="vertical-box" style={{ backgroundColor: 'white' }}>
                                        <div className="heading1">Date: {currentDate}</div>
                                        <div className="flex-container">
                                            <div className="flex-item">Meal Name</div>
                                            <div className="flex-item">Price per meal</div>
                                            <div className="flex-item">Amount per meal</div>
                                        </div>

                                        {bookings.map((b, i) => {
                                            if (new Date(b.bookingDate).toLocaleDateString('en-GB') === currentDate) {
                                                return (
                                                    <div key={index} className='flex-container'>
                                                        <div className='flex-item'>{b.class.className}</div>
                                                        <div className='flex-item'>75</div>
                                                        <div className='flex-item'>{b.status === 'present' ? +75 : `+10 fine`}</div>
                                                    </div>
                                                )
                                            }
                                            return null;
                                        })}

                                    </div>

                                </div>

                            </div>
                        </div>
                    </>
                );
            }
            return null;
        });
    };

    return (
        <div className="container1 container shadow" style={{ marginTop: 50 }}>
            <div className="left-pane">
                <div className="vertical-box">
                    {renderBillingData()}
                </div>
            </div>
            <div className="blue-box">
                <h2>Account Balance</h2>
                <p style={{ fontSize: 50 }}>Rs {accbal}</p>
                <p style={{ fontSize: 20, marginTop: 30 }}>Total meals taken: <span className="space"> </span>{totalMeals}</p>
                <div className="line"></div>
                <p style={{ fontSize: 20, marginTop: 30 }}>Breakfast Count: <span className="space"> </span>{breakfastCount}</p>
                <p style={{ fontSize: 20 }}>Lunch Count: <span className="space2"> </span>{lunchCount}</p>
                <p style={{ fontSize: 20 }}>Dinner Count: <span className="space3"> </span>{dinnerCount}</p>
            </div>
        </div>
    );
};

export default BillingPage;
