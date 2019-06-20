'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/habit-tracker-app';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-habit-tracker';
exports.PORT = process.env.PORT || 8080;