import book from "./book.js";
import category from "./category.js";
import club from "./club.js";
import clubuser from "./clubuser.js";
import language from "./language.js";
import location from "./location.js";
import transaction from "./transaction.js";
import user from "./user.js";

export function initialiseAssociations() {


    // User associations
    user.hasMany(clubuser, { foreignKey: 'userId' });
    user.belongsToMany(club, { through: clubuser, foreignKey: 'userId' });
    user.hasMany(book, { foreignKey: 'userId' });
    user.hasMany(transaction, { foreignKey: 'lenderId',  as: 'lentTransactions' });
    user.hasMany(transaction, { foreignKey: 'borrowerId', as: 'borrowedTransactions' });

    // Club associations
    club.hasMany(clubuser, { foreignKey: 'clubId'});
    club.belongsToMany(user, { through: clubuser, foreignKey: 'clubId' });
    club.hasMany(book, { foreignKey: 'clubId' });
    club.hasMany(transaction, { foreignKey: 'clubId' });
    club.hasMany(location, { foreignKey: 'clubId' });


    book.hasMany(transaction, { foreignKey: 'bookId' });
    book.belongsTo(location, { foreignKey: 'locationId', as: 'location' });

    // Book associations
    book.belongsTo(club, { foreignKey: 'clubId' });
    book.belongsTo(user, { foreignKey: 'userId' });
    book.belongsTo(language, { foreignKey: 'languageId' });
    book.belongsTo(category, { foreignKey: 'categoryId' });

    // Language associations
    language.hasMany(book, { foreignKey: 'languageId' });

    // Category associations
    category.hasMany(book, { foreignKey: 'categoryId' });

    // Clubuser associations
    clubuser.belongsTo(user, { foreignKey: 'userId' });
    clubuser.belongsTo(club, { foreignKey: 'clubId' });

    transaction.belongsTo(user, { foreignKey: 'lenderId', as: 'lender' });
    transaction.belongsTo(user, { foreignKey: 'borrowerId' , as: 'borrower' });
    transaction.belongsTo(book, { foreignKey: 'bookId', as: 'book' });
    transaction.belongsTo(club, { foreignKey: 'clubId', as: 'club' });

    location.belongsTo(club, { foreignKey: 'clubId' });
    location.hasMany(book, { foreignKey: 'locationId', as: 'books' });
}