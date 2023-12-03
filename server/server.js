const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const axios = require("axios");
const fs = require("fs");

// Assuming you're working with a JSON file
const filePath = "./db.json"; // Replace with your file path

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom route for user authentication
server.post("/login", (req, res) => {
  const { email, password } = req.body;
  const users = router.db.get("users").value();
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    res.status(200).jsonp({
      message: "Login successful",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } else {
    res.status(401).jsonp({ message: "Invalid credentials" });
  }
});

// Custom route for user registration (sign-up)
server.post("/signup", (req, res) => {
  const newUser = req.body;
  const users = router.db.get("users").value();
  const existingUser = users.find((u) => u.email === newUser.email);

  if (existingUser) {
    res.status(400).jsonp({ message: "User already exists" });
  } else {
    newUser.id = users.length + 1;
    router.db.get("users").push(newUser).write();

    res.status(201).jsonp({
      message: "User created successfully",
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      },
    });
  }
});

server.post("/add-external-to-cart", async (req, res) => {
  const { userId, productId, number } = req.body;

  try {
    const externalProduct = await axios.get(
      `https://fakestoreapi.com/products/${productId}`
    );

    const product = externalProduct.data;

    if (!externalProduct.data || number <= 0) {
      return res
        .status(404)
        .json({ message: "Product not found or invalid order number" });
    }

    // Read the JSON file
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to read data file" });
      }

      let jsonData = JSON.parse(data); // Parse the JSON data

      // Find the user
      const userIndex = jsonData.users.findIndex((user) => user.id === userId);

      if (userIndex === -1) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the product already exists in the user's cart
      const cartItemIndex = jsonData.carts.findIndex(
        (item) => item.userId === userId && item.product.id === productId
      );

      if (cartItemIndex !== -1) {
        // If the product exists, increase the quantity
        jsonData.carts[cartItemIndex].number += number;
      } else {
        // If the product doesn't exist, add a new entry
        const productToAdd = {
          userId,
          product,
          number,
        };
        jsonData.carts.push(productToAdd);
      }

      // Write the updated data back to the file
      fs.writeFile(
        filePath,
        JSON.stringify(jsonData, null, 2),
        "utf8",
        (err) => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .json({ message: "Failed to update data file" });
          }

          return res
            .status(200)
            .json({ message: "Product added to cart successfully" });
        }
      );
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to add product to cart" });
  }
});

// Endpoint to fetch a user's cart
server.get("/user-orders/:userId", (req, res) => {
  const userId = parseInt(req.params.userId);
console.log(userId)
  // Read the JSON file
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to read data file" });
    }

    let jsonData = JSON.parse(data); // Parse the JSON data

    // Find the user's orders from the carts
    const userOrders = jsonData.carts.filter((item) => item.userId === userId);

    if (userOrders.length === 0) {
      return res.status(200).json({ message: "No orders found for this user" });
    } else {
      return res.status(200).json({ orders: userOrders });
    }
  });
});

server.get("/user-order-count/:userId", (req, res) => {
  const userId = parseInt(req.params.userId);

  // Read the JSON file containing orders
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to read orders file" });
    }

    let ordersData = JSON.parse(data); // Parse the JSON data

    // Count the occurrences of userId in the orders
    const userOrderCount = ordersData.carts.reduce((count, order) => {
      if (order.userId === userId) {
        count++;
      }
      return count;
    }, 0);

    return res.status(200).json({ userOrderCount });
  });
});


server.delete("/remove-from-cart/:userId/:productId", (req, res) => {
  const userId = parseInt(req.params.userId);
  const productId = parseInt(req.params.productId);

  // Read the JSON file
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to read data file" });
    }

    let jsonData = JSON.parse(data); // Parse the JSON data

    // Find the user
    const userIndex = jsonData.users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the index of the product in the user's cart
    const productIndex = jsonData.carts.findIndex(
      (item) => item.userId === userId && item.product.id === productId
    );

    if (productIndex === -1) {
      return res
        .status(404)
        .json({ message: "Product not found in the user's cart" });
    }

    // Remove the product from the user's cart
    jsonData.carts.splice(productIndex, 1);

    // Write the updated data back to the file
    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), "utf8", (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to update data file" });
      }

      return res
        .status(200)
        .json({ message: "Product removed from cart successfully" });
    });
  });
});


server.delete("/checkout-from-cart/:userId", (req, res) => {
  const userId = parseInt(req.params.userId);

  // Read the JSON file
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to read data file" });
    }

    let jsonData = JSON.parse(data); // Parse the JSON data

    // Find the user
    const userIndex = jsonData.users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filter out all products from the user's cart
    jsonData.carts = jsonData.carts.filter((item) => item.userId !== userId);

    // Write the updated data back to the file
    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), "utf8", (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to update data file" });
      }

      return res
        .status(200)
        .json({ message: "All products removed from user's cart successfully" });
    });
  });
});


// Start server
server.use(router);
const PORT = 9000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
