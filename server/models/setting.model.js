const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
    const setting = sequelize.define('setting', {
        setting_id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        about: {
            type: DataTypes.TEXT,
        },
        privacy_policy: {
            type: DataTypes.TEXT,
        },
        terms_and_condition: {
            type: DataTypes.TEXT,
        },
        supplier_session_expiry: {
            type: DataTypes.STRING,
        },
        dropshipper_session_expiry: {
            type: DataTypes.STRING,
        },
        admin_session_expiry: {
            type: DataTypes.STRING,
        },
        android_version_id: {
            type: DataTypes.INTEGER,
        },
        android_version_update_message: {
            type: DataTypes.TEXT,
        },
        android_is_maintenance: {
            type: DataTypes.BOOLEAN,
        },
        android_maintenance_message: {
            type: DataTypes.TEXT,
        },
        ios_version_id: {
            type: DataTypes.INTEGER,
        },
        ios_version_update_message: {
            type: DataTypes.TEXT,
        },
        ios_is_maintenance: {
            type: DataTypes.BOOLEAN,
        },
        ios_maintenance_message: {
            type: DataTypes.TEXT,
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
        tableName: 'setting',
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
    setting.associate = () => {
        // associations can be defined here
    };
    return setting;
};
