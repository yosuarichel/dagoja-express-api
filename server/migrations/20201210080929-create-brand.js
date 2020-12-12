module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable('brand', {
        brand_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING,
        },
        code: {
            type: Sequelize.STRING,
        },
        image_name: {
            type: Sequelize.STRING,
        },
        image_source: {
            type: Sequelize.STRING,
        },
        status: {
            type: Sequelize.STRING,
        },
        deleted_at: {
            allowNull: true,
            type: Sequelize.DATE,
        },
        created_at: {
            allowNull: false,
            type: Sequelize.DATE,
        },
        updated_at: {
            allowNull: false,
            type: Sequelize.DATE,
        },
    }),
    // eslint-disable-next-line no-unused-vars
    down: (queryInterface, Sequelize) => queryInterface.dropTable('brand'),
};
