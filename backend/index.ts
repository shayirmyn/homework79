import cors from 'cors';
import express from 'express';
import categoriesRouter from "./routers/categories";
import mysqlDb from "./mysqlDb";
import placesRouter from "./routers/places";
import itemsRouter from "./routers/items";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use('/categories', categoriesRouter);
app.use('/places', placesRouter);
app.use('/items', itemsRouter);

const run = async () => {
    await mysqlDb.init();

    app.listen(port, () => {
        console.log(`Server is running at ${port} port!`);
    });
};

run().catch(console.error);