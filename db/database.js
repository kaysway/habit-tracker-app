'use strict';

const goals = [
    {
        '_id': '000000',
        'goal': 'Run a marathon',
        'description': 'In order to complete this goal, you will need to run 3 miles per day',
        'status': 'Not started'
    },
    {
        '_id': '000001',
        'goal': 'Learn a new language',
        'description': 'In order to complete this goal, you will need to study for 3 hours per day',
        'status': 'Not started'
    },
    {  '_id': '000002',
        'goal': 'Save up an emergency fund',
        'description': 'In order to complete this goal, you will need to save 10 dollars per day',
        'status': 'Not started'
    }
];

const logs = [
    {
        '_id': '111000',
        'datePosted': '05 10 2019',
        'userId': '1110001'
    },
    {
        '_id': '222000',
        'datePosted': '06 10 2019',
        'userId': '1110002'
    },
    {
        '_id': '333000',
        'datePosted': '07 10 2019',
        'userId': '1110003'
    }
];

const users = [
    {
        '_id': '000111000',
        'username': 'userkathy',
        'password': '12345test'
    },
    {
        '_id': '000222000',
        'username': 'userbob',
        'password': '123456test'
    },
    {
        '_id': '000333000',
        'username': 'useralan',
        'password': '1234567test'
    }
];

module.exports = { goals, logs, users };