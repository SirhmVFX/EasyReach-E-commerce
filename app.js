require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();
const connectDB = require("./config/connect");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const path = require("path");
const mongoSanitize = require("express-mongo-sanitize");

const authRouter = require("./routes/Auth");
const userRouter = require("./routes/User");
const productRouter = require("./routes/Product");
const categoryRouter = require("./routes/Category");
const reviewRouter = require("./routes/Review");
const orderRouter = require("./routes/Order");
const contactRouter = require("./routes/Contact");
const bannerRoutes = require('./routes/Banner');
const couponRoutes = require('./routes/Coupon');
const wishlistRoute = require('./routes/Wishlist');

const notFoundMiddleware = require("./middlewares/not-found");
const errorHandlerMiddleware = require("./middlewares/error-handler");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);

app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());
app.use(morgan("tiny"));
app.use(cookieParser(process.env.JWT_SECRET));

app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Swagger UI
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerJsDocs = YAML.load("./docs/documentation.yaml");

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/contact", contactRouter);
app.use('/api/v1/banners', bannerRoutes);
app.use('/api/v1/coupons', couponRoutes);
app.use('/api/v1/wishlist', wishlistRoute);

app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/', require('./routes/Root'))
app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if (req.accepts('json')) {
    res.json({ message: '404 Not Found' })
  } else {
    res.type('txt').send('404 Not Found')
  }
})

app.use('/', express.static(path.join(__dirname, 'public/images')))

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);
const PORT = process.env.PORT || 7000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server is currently listening  on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();