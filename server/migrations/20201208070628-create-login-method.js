module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable('login_method', {
        login_method_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING,
        },
        icon_name: {
            type: Sequelize.STRING,
        },
        icon_source: {
            type: Sequelize.STRING,
        },
        status: {
            type: Sequelize.ENUM('active', 'inactive'),
        },
        is_disable: {
            type: Sequelize.BOOLEAN,
        },
        is_coming_soon: {
            type: Sequelize.BOOLEAN,
        },
        os: {
            type: Sequelize.ARRAY(Sequelize.STRING),
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
    down: (queryInterface, Sequelize) => queryInterface.dropTable('login_method'),
};
