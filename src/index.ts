import "reflect-metadata";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import bodyParser from "body-parser";
import cors from "cors";
import xss from "xss-clean";
import hpp from "hpp";
import logger from "./utils/logger";


dotenv.config();

// Import routes
import userRoutes from "./routes/auth";
import productRoutes from "./routes/product";
import warehouseRoutes from "./routes/warehouse";
import stockRoutes from "./routes/stock";
import { syncDatabase } from "./models"; 


const app = express();

// Enable express to parse JSON data
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Security middleware
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:3000",
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
}));
app.use(hpp());
app.use(xss());

// Define a route for the root URL
app.get("/", (req: Request, res: Response): Response => {
  return res.json({ message: "Sequelize Example 🤟" });
});

// Register route files with specific paths
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/stocks", stockRoutes);

// Function to sanitize sensitive data
function sanitizeData(data: any): any {
  const sensitiveFields = [
    "password",
    "pin",
    "token",
    "authorization",
    "accessToken",
    "refreshToken",
    "fcm_token",
    "secret",
  ];

  if (typeof data !== "object" || data === null) {
    return data;
  }

  return Object.keys(data).reduce((acc, key) => {
    if (sensitiveFields.includes(key.toLowerCase())) {
      acc[key] = "[REDACTED]";
    } else if (typeof data[key] === "object" && data[key] !== null) {
      acc[key] = sanitizeData(data[key]);
    } else {
      acc[key] = data[key];
    }
    return acc;
  }, {});
}

// Custom Morgan tokens
morgan.token("body", (req: Request) => {
  const sanitizedBody = sanitizeData(req.body);
  return JSON.stringify(sanitizedBody);
});

morgan.token("headers", (req: Request) => {
  const relevantHeaders = {
    "content-type": req.headers["content-type"],
    "user-agent": req.headers["user-agent"],
  };
  const sanitizedHeaders = sanitizeData(relevantHeaders);
  return JSON.stringify(sanitizedHeaders);
});

morgan.token("query", (req: Request) => {
  const sanitizedQuery = sanitizeData(req.query);
  return JSON.stringify(sanitizedQuery);
});

morgan.token("params", (req: Request) => {
  const sanitizedParams = sanitizeData(req.params);
  return JSON.stringify(sanitizedParams);
});

morgan.token("userIp", (req: Request) => req.ip);

// Custom format string
const morganFormat =
  ":method :url :status :res[content-length] - :response-time ms :body :headers :query :params :userIp";

// Use Morgan with Winston
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message: string) =>
        logger.info(message.trim(), { context: "HTTP" }),
    },
  })
);

app.all("*", (req: Request, res: Response) => {
    res.status(404).json({
      errors: [
        {
          error: `Can't find ${req.originalUrl} on this server`,
        },
      ],
    });
  });

const start = async (): Promise<void> => {
  try {
    await syncDatabase(); 
    app.listen(3000, () => {
      logger.info("Server started on port 3000");
    });
  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
};


void start();
