const Order = require("../models/Order");
const Product = require("../models/Product");

const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Order must contain at least one item",
      });
    }

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.pincode
    ) {
      return res.status(400).json({
        message: "Please provide complete shipping address",
      });
    }

    const phoneRegex = /^[6-9]\d{9}$/;
const pincodeRegex = /^[1-9][0-9]{5}$/;

if (!phoneRegex.test(shippingAddress.phone)) {
  return res.status(400).json({
    message: "Please provide a valid 10-digit Indian phone number",
  });
}

if (!pincodeRegex.test(shippingAddress.pincode)) {
  return res.status(400).json({
    message: "Please provide a valid 6-digit Indian pincode",
  });
}

if (shippingAddress.address.trim().length < 8) {
  return res.status(400).json({
    message: "Address must be at least 8 characters long",
  });
}

if (shippingAddress.city.trim().length < 2) {
  return res.status(400).json({
    message: "Please provide a valid city name",
  });
}

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          message: `Product not found: ${item.product}`,
        });
      }

      const quantity = Number(item.quantity) || 1;

      if (product.stock < quantity) {
        return res.status(400).json({
          message: `Only ${product.stock} units available for ${product.name}`,
        });
      }

      totalAmount += product.price * quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity,
      });

      product.stock -= quantity;
      await product.save();
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || "Cash on Delivery",
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Order creation failed",
      error: error.message,
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not fetch your orders",
      error: error.message,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not fetch all orders",
      error: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Order status update failed",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};