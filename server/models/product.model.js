import moment from 'moment';

module.exports = (sequelize, DataTypes) => {
    const product = sequelize.define('product', {
        product_id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.BIGINT,
        },
        brand_id: {
            type: DataTypes.BIGINT,
        },
        supplier_id: {
            type: DataTypes.BIGINT,
        },
        product_number: {
            type: DataTypes.STRING,
        },
        sku: {
            type: DataTypes.STRING,
        },
        name: {
            type: DataTypes.STRING,
        },
        supplier_price: {
            type: DataTypes.DOUBLE,
        },
        ppn_percentage: {
            type: DataTypes.DOUBLE,
        },
        markup_percentage: {
            type: DataTypes.DOUBLE,
        },
        final_price: {
            type: DataTypes.DOUBLE,
        },
        quantity: {
            type: DataTypes.INTEGER,
        },
        remaining_quantity: {
            type: DataTypes.INTEGER,
        },
        sizes: {
            type: DataTypes.ARRAY(DataTypes.STRING),
        },
        available_sizes: {
            type: DataTypes.ARRAY(DataTypes.STRING),
        },
        colors: {
            type: DataTypes.ARRAY(DataTypes.STRING),
        },
        available_colors: {
            type: DataTypes.ARRAY(DataTypes.STRING),
        },
        weight: {
            type: DataTypes.DOUBLE,
        },
        condition: {
            type: DataTypes.STRING,
        },
        minimum_order: {
            type: DataTypes.INTEGER,
        },
        is_discount: {
            type: DataTypes.BOOLEAN,
        },
        discount_percentage: {
            type: DataTypes.DOUBLE,
        },
        is_warranty: {
            type: DataTypes.BOOLEAN,
        },
        warranty_expired_at: {
            allowNull: true,
            type: DataTypes.DATE,
            get() {
                if (this.getDataValue('warranty_expired_at')) {
                    const dateText = this.getDataValue('warranty_expired_at');
                    return moment(dateText).tz('Asia/Jakarta').format();
                }
                return null;
            },
        },
        description: {
            type: DataTypes.TEXT,
        },
        status: {
            type: DataTypes.STRING,
        },
        is_disable: {
            type: DataTypes.BOOLEAN,
        },
        is_coming_soon: {
            type: DataTypes.BOOLEAN,
        },
        os: {
            type: DataTypes.ARRAY(DataTypes.STRING),
        },
        deleted_at: {
            allowNull: true,
            type: DataTypes.DATE,
            get() {
                if (this.getDataValue('deleted_at')) {
                    const dateText = this.getDataValue('deleted_at');
                    return moment(dateText).tz('Asia/Jakarta').format();
                }
                return null;
            },
        },
        created_at: {
            allowNull: true,
            type: DataTypes.DATE,
            get() {
                if (this.getDataValue('created_at')) {
                    const dateText = this.getDataValue('created_at');
                    return moment(dateText).tz('Asia/Jakarta').format();
                }
                return null;
            },
        },
        updated_at: {
            allowNull: true,
            type: DataTypes.DATE,
            get() {
                if (this.getDataValue('updated_at')) {
                    const dateText = this.getDataValue('updated_at');
                    return moment(dateText).tz('Asia/Jakarta').format();
                }
                return null;
            },
        },
    }, {
        paranoid: true,
        underscored: true,
        freezeTableName: true,
        tableName: 'product',
        deletedAt: 'deleted_at',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        scopes: {
            ordering: (ordering) => ({
                order: [
                    [ordering.orderBy, ordering.orderType],
                ],
            }),
            pagination: (param, pagination) => (param !== 'false' ? {
                offset: pagination.page,
                limit: pagination.row,
            } : {}),
        },
    });
    product.associate = () => {
        // associations can be defined here
    };
    return product;
};
