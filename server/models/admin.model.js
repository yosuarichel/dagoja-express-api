const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
    const admin = sequelize.define('admin', {
        admin_id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        admin_role_id: {
            type: DataTypes.INTEGER,
        },
        full_name: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING,
        },
        profile_image_name: {
            type: DataTypes.STRING,
        },
        profile_image_source: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
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
        tableName: 'admin',
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
            includeAdminRole: (param, adminRole) => (param ? {
                include: [{
                    model: adminRole,
                    as: 'admin_role',
                    where: {
                        admin_role_id: param,
                    },
                    attributes: {
                        exclude: ['created_at', 'updated_at', 'deleted_at'],
                    },
                }],
            } : {
                include: [{
                    model: adminRole,
                    as: 'admin_role',
                    attributes: {
                        exclude: ['created_at', 'updated_at', 'deleted_at'],
                    },
                }],
            }),
        },
    });
    admin.associate = (models) => {
        // associations can be defined here
        admin.belongsTo(models.admin_role, {
            foreignKey: 'admin_role_id',
            as: 'admin_role',
        });
    };
    return admin;
};
