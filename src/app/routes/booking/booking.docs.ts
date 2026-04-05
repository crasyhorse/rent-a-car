/**
 * @openapi
 * components:
 *   securitySchemes:
 *     CookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: access_token
 *   schemas:
 *     Address:
 *       type: object
 *       required:
 *         - street
 *         - houseNumber
 *         - zipCode
 *         - locality
 *       properties:
 *         street:
 *           type: string
 *           example: Hauptstraße
 *         houseNumber:
 *           type: string
 *           example: 12A
 *         zipCode:
 *           type: string
 *           example: "57319"
 *         locality:
 *           type: string
 *           example: Bad Berleburg
 *
 *     DriverLicense:
 *       type: object
 *       required:
 *         - numberMasked
 *         - country
 *         - expiryDate
 *         - verified
 *       properties:
 *         numberMasked:
 *           type: string
 *           example: "****5678"
 *         country:
 *           type: string
 *           example: DE
 *         expiryDate:
 *           type: string
 *           format: date
 *           example: 2030-12-31
 *         verified:
 *           type: boolean
 *           example: true
 *
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - email
 *         - firstName
 *         - lastName
 *         - dateOfBirth
 *         - phone
 *         - address
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *         email:
 *           type: string
 *           format: email
 *           example: max.mustermann@example.com
 *         firstName:
 *           type: string
 *           example: Max
 *         lastName:
 *           type: string
 *           example: Mustermann
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           example: 1990-05-21
 *         phone:
 *           type: string
 *           example: "+49 171 1234567"
 *         driverLicense:
 *           $ref: '#/components/schemas/DriverLicense'
 *         address:
 *           $ref: '#/components/schemas/Address'
 *
 *     Car:
 *       type: object
 *       required:
 *         - id
 *         - brand
 *         - name
 *         - class
 *         - type
 *         - seats
 *         - automatic
 *         - dailyRate
 *         - imageURL
 *       properties:
 *         id:
 *           type: string
 *           example: car_001
 *         brand:
 *           type: string
 *           example: Volkswagen
 *         name:
 *           type: string
 *           example: Golf
 *         class:
 *           type: string
 *           example: compact
 *         type:
 *           type: string
 *           example: hatchback
 *         seats:
 *           type: integer
 *           example: 5
 *         automatic:
 *           type: boolean
 *           example: true
 *         dailyRate:
 *           type: number
 *           format: float
 *           example: 49.99
 *         imageURL:
 *           type: string
 *           format: uri
 *           example: https://example.com/images/cars/golf.jpg
 *
 *     Insurance:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - text
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           example: insurance_001
 *         name:
 *           type: string
 *           example: Fully comprehensive
 *         text:
 *           type: string
 *           example: Reduces liability in case of damage.
 *         price:
 *           type: number
 *           format: float
 *           example: 19.99
 *
 *     Option:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - text
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           example: option_001
 *         name:
 *           type: string
 *           example: Additional driver
 *         text:
 *           type: string
 *           example: Allows a second person to drive the car.
 *         price:
 *           type: number
 *           format: float
 *           example: 9.99
 *
 *     BookingInput:
 *       type: object
 *       required:
 *         - userId
 *         - carId
 *         - startDate
 *         - endDate
 *         - insuranceId
 *         - optionId
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *         carId:
 *           type: string
 *           example: car_001
 *         startDate:
 *           type: string
 *           format: date-time
 *           example: 2026-04-10T00:00:00.000Z
 *         endDate:
 *           type: string
 *           format: date-time
 *           example: 2026-04-15T00:00:00.000Z
 *         insuranceId:
 *           type: string
 *           example: insurance_001
 *         optionId:
 *           type: string
 *           example: option_001
 *
 *     BookingCreateRequest:
 *       type: object
 *       required:
 *         - data
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/BookingInput'
 *
 *     Booking:
 *       type: object
 *       required:
 *         - id
 *         - user
 *         - car
 *         - startDate
 *         - endDate
 *         - insurance
 *         - option
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 9af4fa7b-3ccf-4d37-9f5c-0d8b39fa8f16
 *         user:
 *           $ref: '#/components/schemas/User'
 *         car:
 *           $ref: '#/components/schemas/Car'
 *         startDate:
 *           type: string
 *           format: date-time
 *           example: 2026-04-10T00:00:00.000Z
 *         endDate:
 *           type: string
 *           format: date-time
 *           example: 2026-04-15T00:00:00.000Z
 *         insurance:
 *           $ref: '#/components/schemas/Insurance'
 *         option:
 *           $ref: '#/components/schemas/Option'
 *         price:
 *           type: string
 *           example: "279.94"
 *
 *     ErrorResponse:
 *       type: object
 *       required:
 *         - status
 *         - message
 *       properties:
 *         status:
 *           type: integer
 *           example: 422
 *         message:
 *           type: string
 *           example: Start date must be before end date.
 */

/**
 * @openapi
 * /bookings/{customerId}:
 *   post:
 *     tags:
 *       - Bookings
 *     summary: Create a booking
 *     description: Creates a booking for the authenticated customer.
 *     security:
 *       - CookieAuth: []
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         description: ID of the customer for whom the booking is created.
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookingCreateRequest'
 *     responses:
 *       201:
 *         description: Booking successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       401:
 *         description: Authentication required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden or booking already exists for the same user in the requested period.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: The car is already booked by another user in the requested period.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       422:
 *         description: Invalid request data, mismatching customer id, or referenced entities could not be found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /bookings/{customerId}/{bookingId}:
 *   delete:
 *     tags:
 *       - Bookings
 *     summary: Cancel a booking
 *     description: Cancels an existing booking of the authenticated customer.
 *     security:
 *       - CookieAuth: []
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         description: ID of the customer who owns the booking.
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *       - in: path
 *         name: bookingId
 *         required: true
 *         description: ID of the booking to cancel.
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 9af4fa7b-3ccf-4d37-9f5c-0d8b39fa8f16
 *     responses:
 *       204:
 *         description: Booking successfully cancelled.
 *       401:
 *         description: Authentication required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden. You can only cancel your own bookings.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Booking could not be found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export {};