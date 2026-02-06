import express from "express";
import { db } from "./db.js";
import { cars } from "./schema.js";
import { eq } from "drizzle-orm";

const app = express();
const port = 3000;

const router = express.Router();

app.use(express.json());

app.use((req, res, next) => {
    const timestamp = new Date().toISOString();

    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});

// let cars = [
//     { id: 1, make: "Toyota", model: "Camry", year: 2022, price: 28000 },
//     { id: 2, make: "Tesla", model: "Model S", year: 2023, price: 25000 },
//     { id: 3, make: "Ford", model: "F-150", year: 2021, price: 35000 },
// ];

app.get("/", (req, res) => {
    res.send("Hello from the Cars API!");
});

router.get("/", async (req, res) => {
    const allCars = await db.select().from(cars);
    res.json(allCars);
});

router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const car = await db.select().from(cars).where(eq(cars.id, id));
    if (!car) return res.status(404).send("Car not found");

    res.json(car);
});

router.post("/", async (req, res) => {
    const { make, model, year, price } = req.body;

    if (!make || !model || !year || !price) {
        return res.status(400).json({ error: "Missing fields" });
    }

    const [newCar] = await db
        .insert(cars)
        .values({ make, model, year, price })
        .returning();

    res.status(201).json(newCar);
});

router.put("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { make, model, year, price } = req.body;

    const updatedCar = await db
        .update(cars)
        .set({ make, model, year, price })
        .where(eq(cars.id, id))
        .returning();
    res.json(updatedCar);
});

router.delete("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const deletedCar = await db.delete(cars).where(eq(cars.id, id)).returning();
    res.json({ message: "Car deleted", car: deletedCar });
});

app.use("/api/v1/cars", router);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
