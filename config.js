'use strict';
    exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb+srv://kaysway:Password123>@habit-tracker-8wdez.mongodb.net/test?retryWrites=true&w=majority';
    exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb+srv://kaysway:Password123@test-habit-tracker-xhvvt.mongodb.net/test?retryWrites=true&w=majority';
    exports.PORT = process.env.PORT || 8080;

    exports.JWT_SECRET = process.env.JWT_SECRET || 'default',
    exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d'