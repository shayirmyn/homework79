import express from 'express';
import {Category, CategoryWithoutId, existCategoryID} from "../types";
import mysqlDb from "../mysqlDb";
import {OkPacketParams} from "mysql2";

const categoriesRouter = express.Router();

categoriesRouter.get('', async (req, res) => {
    const connection = mysqlDb.getConnection();
    const result = await connection.query('SELECT id, name FROM categories');
    const categories = result[0] as Category[];

    res.send(categories);
});

categoriesRouter.get('/:id', async (req, res) => {
    const connection = mysqlDb.getConnection();
    const result = await connection.query(
        'SELECT * FROM categories WHERE id = ?',
        [req.params.id]
    );
    const categories = result[0] as Category[];
    const category = categories[0];

    if (!category) {
        return res.status(404).send({error: 'Not Found'});
    }

    res.send(category);
});

categoriesRouter.post('', async (req, res) => {
    if (!req.body.name) {
        return res.status(400).send({error: 'Поле сообщение отсутствует'});
    }

    const categoryData: CategoryWithoutId = {
        name: req.body.name,
        description: req.body.description,
    };

    const connection = mysqlDb.getConnection();

    const sql = connection.format(
        'INSERT INTO categories (name, description) VALUES (?, ?)',
        [categoryData.name, categoryData.description]
    );

    const result = await connection.query(sql);

    const info = result[0] as OkPacketParams;

    res.send({
        ...categoryData,
        id: info.insertId,
    });
});

categoriesRouter.delete('/:id', async (req, res) => {
    const connection = mysqlDb.getConnection();

    const resultCategoryIdsInItems = await connection.query('SELECT category_id FROM items');
    const categoryIdsInItems = resultCategoryIdsInItems[0] as existCategoryID[];
    for (const categoryIdInItems of categoryIdsInItems) {
        const everyID = categoryIdInItems.category_id;
        if (everyID === Number(req.params.id)) {
            res.send("Данную категорию нельзя удалить, так как она связана с ресурсом item");
            return
        }
    }

    await connection.query('DELETE FROM categories WHERE id = ?', req.params.id);

    res.send("Deleted");
});


export default categoriesRouter;