/**
 * @openapi
 * components:
 *   securitySchemes:
 *     CookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: access_token
 *   schemas:
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
 *     ErrorResponse:
 *       type: object
 *       required:
 *         - message
 *       properties:
 *         message:
 *           type: string
 *           example: Something went wrong.
 */

/**
 * @openapi
 * /cars/:
 *   get:
 *     tags:
 *       - Cars
 *     summary: List all cars
 *     description: Returns all cars. Authentication is optional.
 *     security:
 *       - {}
 *       - CookieAuth: []
 *     responses:
 *       200:
 *         description: List of cars.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Car'
 *       404:
 *         description: No cars could be found.
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
 * /cars/insurances:
 *   get:
 *     tags:
 *       - Cars
 *     summary: List all available insurances
 *     description: Returns all available insurance options. Authentication is optional.
 *     security:
 *       - {}
 *       - CookieAuth: []
 *     responses:
 *       200:
 *         description: List of insurance entries.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Insurance'
 *       404:
 *         description: No insurances could be found.
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
 * /cars/{id}:
 *   get:
 *     tags:
 *       - Cars
 *     summary: Show the details of a car
 *     description: Returns the details of the car identified by its id. Authentication is optional.
 *     security:
 *       - {}
 *       - CookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Car identifier.
 *         schema:
 *           type: string
 *           example: car_001
 *     responses:
 *       200:
 *         description: Car details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       404:
 *         description: Car not found.
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
 * /cars/options:
 *   get:
 *     tags:
 *       - Cars
 *     summary: List all available booking options
 *     description: Returns all available booking options for cars. Authentication is optional.
 *     security:
 *       - {}
 *       - CookieAuth: []
 *     responses:
 *       200:
 *         description: List of booking option entries.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Option'
 *       404:
 *         description: No booking options could be found.
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
