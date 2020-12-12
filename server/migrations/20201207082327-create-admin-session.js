module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable('admin_session', {
        admin_session_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        admin_id: {
            type: Sequelize.INTEGER,
        },
        session: {
            type: Sequelize.STRING,
        },
        expire_value: {
            type: Sequelize.STRING,
        },
        expired_at: {
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
    down: (queryInterface, Sequelize) => queryInterface.dropTable('admin_session'),
};
