import express from 'express';
import {existPlaceID, Place, PlaceWithoutId} from "../types";
import mysqlDb from "../mysqlDb";
import {OkPacketParams} from "mysql2";

const placesRouter = express.Router();

placesRouter.get('', async (req, res) => {
    const connection = mysqlDb.getConnection();
    const result = await connection.query('SELECT id, name FROM places');
    const places = result[0] as Place[];

    res.send(places);
});

placesRouter.get('/:id', async (req, res) => {
    const connection = mysqlDb.getConnection();
    const result = await connection.query(
        'SELECT * FROM places WHERE id = ?',
        [req.params.id]
    );
    const places = result[0] as Place[];
    const place = places[0];

    if (!place) {
        return res.status(404).send({error: 'Not Found'});
    }

    res.send(place);
});

placesRouter.post('', async (req, res) => {
    if (!req.body.name) {
        return res.status(400).send({error: 'Поле сообщение отсутствует'});
    }

    const placeData: PlaceWithoutId = {
        name: req.body.name,
        description: req.body.description,
    };

    const connection = mysqlDb.getConnection();

    const sql = connection.format(
        'INSERT INTO places (name, description) VALUES (?, ?)',
        [placeData.name, placeData.description]
    );

    const result = await connection.query(sql);

    const info = result[0] as OkPacketParams;

    res.send({
        ...placeData,
        id: info.insertId,
    });
});

placesRouter.delete('/:id', async (req, res) => {
    const connection = mysqlDb.getConnection();

    const resultPlaceIdsInItems = await connection.query('SELECT place_id FROM items');
    const placeIdsInItems = resultPlaceIdsInItems[0] as existPlaceID[];
    for (const placeIdInItems of placeIdsInItems) {
        const everyID = placeIdInItems.place_id;
        if (everyID === Number(req.params.id)) {
            res.send("Данную категорию нельзя удалить, так как она связана с ресурсом item");
            return
        }
    }

    await connection.query('DELETE FROM places WHERE id = ?', req.params.id);

    res.send("Deleted");
});


export default placesRouter;