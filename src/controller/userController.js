const db = require("../../models/index");

const addUser = async (userData) => {
    let dataResponse = {};
    try {
        let checkUserExisted = await db.users.findOne({ where: { mainUserId: userData.id } });
        if (checkUserExisted) {
            checkUserExisted.changed('numberDevicesAllowOneTime', userData.number_devices)
            checkUserExisted.changed('username', userData.username)
            checkUserExisted.changed('password', userData.password)
            checkUserExisted.changed('email', userData.email)
            checkUserExisted.changed('active', userData.active)
            await checkUserExisted.save();
            dataResponse = {
                err: 0,
                message: 'Update thành công',
            }
        } else {
            db.users.create({
                name: userData.name,
                username: userData.username,
                password: userData.password,
                email: userData.email,
                mainUserId: userData.id,
                active: userData.active,
                numberDevicesAllowOneTime: userData.number_devices
            });
            dataResponse = {
                err: 0,
                message: 'Tạo mói thành công',
            }
        }

    } catch (e) {
        dataResponse = {
            err: 1,
            message: 'Đã có lỗi, vui lòng thử lại',
        }
        console.log('----> ERROR : ', e);
    }
    return dataResponse;
}

const updateUser = async (userData) => {
    let dataResponse = {};
    try {
        let checkUserExisted = await db.users.findOne({ where: { mainUserId: userData.id } });
        if (checkUserExisted) {
            checkUserExisted.update({
                name: userData.name,
                username: userData.username,
                password: userData.password,
                email: userData.email,
                active: userData.active,
                numberDevicesAllowOneTime: userData.number_devices

            })
            dataResponse = {
                err: 0,
                message: 'update thành công',
            }
        } else {
            db.users.create({
                name: userData.name,
                username: userData.username,
                password: userData.password,
                email: userData.email,
                active: userData.active,
                mainUserId: userData.id,
                numberDevicesAllowOneTime: userData.number_devices
            })
            dataResponse = {
                err: 0,
                message: 'đã thêm user mới',
            }
        }
        // db.users.update({
        //     name: userData.name,
        //     username: userData.username,
        //     password: userData.password,
        //     email: userData.email,
        //     active: userData.active,
        // }, {
        //     where: { mainUserId: userData.id }
        // });
        // dataResponse = {
        //     err: 0,
        //     message: 'update thành công',
        // }
    } catch (e) {
        dataResponse = {
            err: 1,
            message: 'Đã có lỗi, vui lòng thử lại',
        }
        console.log('----> ERROR : ', e);
    }
    return dataResponse;
}

module.exports = {
    addUser: addUser,
    updateUser: updateUser,
}