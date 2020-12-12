module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable('product', {
        product_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        brand_id: {
            type: Sequelize.BIGINT,
        },
        supplier_id: {
            type: Sequelize.BIGINT,
        },
        product_number: {
            type: Sequelize.STRING,
        },
        sku: {
            type: Sequelize.STRING,
        },
        name: {
            type: Sequelize.STRING,
        },
        supplier_price: {
            type: Sequelize.DOUBLE,
        },
        ppn_percentage: {
            type: Sequelize.DOUBLE,
        },
        markup_percentage: {
            type: Sequelize.DOUBLE,
        },
        final_price: {
            type: Sequelize.DOUBLE,
        },
        quantity: {
            type: Sequelize.INTEGER,
        },
        remaining_quantity: {
            type: Sequelize.INTEGER,
        },
        sizes: {
            type: Sequelize.ARRAY(Sequelize.STRING),
        },
        available_sizes: {
            type: Sequelize.ARRAY(Sequelize.STRING),
        },
        colors: {
            type: Sequelize.ARRAY(Sequelize.STRING),
        },
        available_colors: {
            type: Sequelize.ARRAY(Sequelize.STRING),
        },
        weight: {
            type: Sequelize.DOUBLE,
        },
        condition: {
            type: Sequelize.STRING,
        },
        minimum_order: {
            type: Sequelize.INTEGER,
        },
        is_discount: {
            type: Sequelize.BOOLEAN,
        },
        discount_percentage: {
            type: Sequelize.DOUBLE,
        },
        is_warranty: {
            type: Sequelize.BOOLEAN,
        },
        warranty_expired_at: {
            type: Sequelize.DATE,
        },
        description: {
            type: Sequelize.TEXT,
        },
        status: {
            type: Sequelize.STRING,
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
    down: (queryInterface, Sequelize) => queryInterface.dropTable('product'),
};
