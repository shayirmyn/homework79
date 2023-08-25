import express from 'express';
import {Item, ItemWithoutId} from "../types";
import {imagesUpload} from "../multer";
import mysqlDb from "../mysqlDb";
import {OkPacketParams} from "mysql2";

const itemsRouter = express.Router();

itemsRouter.get('', async (req, res) => {
    const connection = mysqlDb.getConnection();
    const result = await connection.query('SELECT id, name, category_id, place_id FROM items');
    const items = result[0] as Item[];

    res.send(items);
});

itemsRouter.get('/:id', async (req, res) => {
    const connection = mysqlDb.getConnection();
    const result = await connection.query(
        'SELECT * FROM items WHERE id = ?',
        [req.params.id]
    );
    const items = result[0] as Item[];
    const item = items[0];

    if (!item) {
        return res.status(404).send({error: 'Not Found'});
    }

    res.send(item);
});


itemsRouter.post('', imagesUpload.single('photo'), async (req, res) => {
    if (!req.body.name || !req.body.category_id || !req.body.place_id) {
        return res.status(400).send({error: 'Поле сообщения отсутствует'});
    }

    const itemData: ItemWithoutId = {
        name: req.body.name,
        description: req.body.description,
        photo: req.file ? req.file.filename : null,
        category_id: req.body.category_id,
        place_id: req.body.place_id,
    };

    const connection = mysqlDb.getConnection();

    const sql = connection.format(
        'INSERT INTO items (name, description, photo, category_id, place_id) VALUES (?, ?, ?, ?, ?)',
        [itemData.name, itemData.description, itemData.photo, itemData.category_id, itemData.place_id]
    );

    const result = await connection.query(sql);

    const info = result[0] as OkPacketParams;

    res.send({
        ...itemData,
        id: info.insertId,
    });
});

itemsRouter.delete('/:id', async (req, res) => {
    const connection = mysqlDb.getConnection();
    await connection.query('DELETE FROM items WHERE id = ?', req.params.id);

    res.send("Deleted");
});

export default itemsRouter;