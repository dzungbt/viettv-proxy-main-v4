module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.addColumn('copyrightWarnings', 'username', {
                    type: Sequelize.DataTypes.STRING
                }, { transaction: t }),
            ]);
        });
    },
    down: (queryInterface, Sequelize) => {
       
    }
};