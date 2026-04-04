/**
 * @openapi
 * components:
 *   securitySchemes:
 *     CookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: access_token
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - user
 *       properties:
 *         user:
 *           type: object
 *           required:
 *             - email
 *             - password
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *               example: max.mustermann@example.com
 *             password:
 *               type: string
 *               format: password
 *               example: Secret123!
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - user
 *       properties:
 *         user:
 *           type: object
 *           required:
 *             - email
 *             - password
 *             - firstName
 *             - lastName
 *             - dateOfBirth
 *             - phone
 *             - address
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *               example: max.mustermann@example.com
 *             password:
 *               type: string
 *               format: password
 *               example: Secret123!
 *             firstName:
 *               type: string
 *               example: Max
 *             lastName:
 *               type: string
 *               example: Mustermann
 *             dateOfBirth:
 *               type: string
 *               format: date
 *               example: 1990-05-21
 *             phone:
 *               type: string
 *               example: "+49 171 1234567"
 *             address:
 *               type: object
 *               required:
 *                 - street
 *                 - houseNumber
 *                 - zipCode
 *                 - locality
 *               properties:
 *                 street:
 *                   type: string
 *                   example: Hauptstraße
 *                 houseNumber:
 *                   type: string
 *                   example: "12A"
 *                 zipCode:
 *                   type: string
 *                   example: "57319"
 *                 locality:
 *                   type: string
 *                   example: Bad Berleburg
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
 *         address:
 *           type: object
 *           required:
 *             - street
 *             - houseNumber
 *             - zipCode
 *             - locality
 *           properties:
 *             street:
 *               type: string
 *               example: Hauptstraße
 *             houseNumber:
 *               type: string
 *               example: "12A"
 *             zipCode:
 *               type: string
 *               example: "57319"
 *             locality:
 *               type: string
 *               example: Bad Berleburg
 *     ErrorResponse:
 *       type: object
 *       required:
 *         - message
 *       properties:
 *         message:
 *           type: string
 *           example: Email cannot be blank.
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     description: Creates a new account, sets an httpOnly access_token cookie, and returns the created user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User successfully registered.
 *         headers:
 *           Set-Cookie:
 *             description: httpOnly authentication cookie containing the access token.
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       422:
 *         description: Validation failed or the email address already exists.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error.
 */