const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

//require config
const config = require("./config/index");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const companyRouter = require("./routes/company");
const staffRouter = require("./routes/staff");
const shopRouter = require("./routes/shop");
const categoryRouter = require("./routes/category");
const productRouter = require("./routes/product");
const promotionRouter = require("./routes/promotion");
const promotionTypeRouter = require("./routes/promotionType");
const reviewRouter = require("./routes/review");

// middleware
const errorHandler = require("./middleware/errrorHandler");

const app = express();

app.use(cors());

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
app.set("trust proxy", 1);

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 15 minutes
  max: 150, // limit each IP to 100 requests per windowMs
});

//  apply to all requests
app.use(limiter);

app.use(helmet());

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: false, // Don't build indexes
});

app.use(logger("dev"));
app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// init passport
app.use(passport.initialize());
// Routes
app.use("/", indexRouter);
app.use("/user", usersRouter);
app.use("/company", companyRouter);
app.use("/staff", staffRouter);
app.use("/shop", shopRouter);
app.use("/category", categoryRouter);
app.use("/product", productRouter);
app.use("/promotion", promotionRouter);
app.use("/promotiontype", promotionTypeRouter);
app.use("/review", reviewRouter);

app.use(errorHandler);

module.exports = app;
