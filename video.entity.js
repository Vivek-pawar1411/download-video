const { EntitySchema } = require("typeorm");
const { create } = require("youtube-dl-exec");

const VideoEntity = new EntitySchema({
    name: "Video",
    tableName: "videos",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        filename: {
            type: "varchar",
        },
        url: {
            type: "text",
        },
        createdAt: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        },
        
    },
});

module.exports = { VideoEntity };
