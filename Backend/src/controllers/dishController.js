const Dish = require('../models/dish');

// Get all dishes
exports.getAllDishes = async (req, res) => {
  try {
    const dishes = await Dish.find();
    res.json(dishes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Toggle dish publication status by dishId
exports.toggleDishStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const dish = await Dish.findOne({ dishId: id });

    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }

    dish.isPublished = !dish.isPublished;
    await dish.save();
    res.json(dish);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
