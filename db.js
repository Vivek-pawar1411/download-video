const { DataSource } = require('typeorm');
const {VideoEntity} = require('./video.entity'); // ✅ FIXED import statement

const AppDataSource = new DataSource({
    type: 'mysql', // ✅ FIXED typo
    host: 'localhost',
    port: 3306,
    username: 'xxxxxxxxx',
    password: 'xxxxxxxxxxxx',
    database: 'xxxxxxxxx',
    synchronize: false,
    entities: [VideoEntity],
});

AppDataSource.initialize()
    .then(() => {
        console.log("✅ Data Source has been initialized!");
    })
    .catch((err) => {
        console.error("❌ Error during Data Source initialization", err);
    });

module.exports = {AppDataSource};
