const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dishController = require('./controllers/dishController');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/dishes-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Dishes API',
      version: '1.0.0',
      description: 'API for managing dishes',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ['./controllers/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
/**
 * @swagger
 * /api/dishes:
 *   get:
 *     summary: Get all dishes
 *     responses:
 *       200:
 *         description: List of all dishes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Dish'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/dishes/toggle/{id}:
 *   post:
 *     summary: Toggle dish publication status by dishId
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Dish ID
 *     responses:
 *       200:
 *         description: Updated dish object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dish'
 *       404:
 *         description: Dish not found
 *       500:
 *         description: Server error
 */
app.get('/api/dishes', dishController.getAllDishes);
app.post('/api/dishes/toggle/:id', dishController.toggleDishStatus);

// Dish Schema definition for Swagger
/**
 * @swagger
 * components:
 *   schemas:
 *     Dish:
 *       type: object
 *       required:
 *         - dishName
 *         - dishId
 *         - imageUrl
 *       properties:
 *         dishName:
 *           type: string
 *           description: The name of the dish
 *         dishId:
 *           type: string
 *           description: The ID of the dish
 *         imageUrl:
 *           type: string
 *           description: The image URL of the dish
 *         isPublished:
 *           type: boolean
 *           description: The publication status of the dish
 *       example:
 *         dishName: "Pasta"
 *         dishId: "12345"
 *         imageUrl: "http://example.com/pasta.jpg"
 *         isPublished: false
 */

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger API documentation is available at http://localhost:${PORT}/api-docs`);
});
