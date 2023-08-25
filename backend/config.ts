import path from "path";

const rootPath = __dirname;

const config = {
    rootPath,
    publicPath: path.join(rootPath, 'public'),
    db: {
        host:'localhost',
        user: 'root',
        password: 'Wot1ya1lox',
        database: 'homework79'
    }
};

export default config;