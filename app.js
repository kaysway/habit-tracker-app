//mock log posts for user
var mock_log_posts = {
 "logPosts": [
     {
        "id": "111111",
        "text": "Ran two miles",
        "publishedAt": 1470016976609
     },
     {
         "id": "222222",
         "text": "Drank 16oz of water",
         "publishedAt": 1470016976609
     },
     {
         "id": "333333",
         "text": "Biked 16 miles",
         "publishedAt": 1470016976609
     }
 ]   
};

//async callback function
function getRecentLogPosts(callbackFn) {
    setTimeout(function(){ callbackFn(mock_log_posts)}, 1);
}

//mock login data for user with username and password
var mock_user_login = {
    "userLogin": [
        {
            "id": "111111",
            "username": "test@gmail.com",
            "password": "test123"
        }
    ]
};

//permanent goal selection list
var goal_list = {
    "goalList": [
        {
            "name": "Run a marathon",
            "description": "Incremental steps from running 0 miles to running a full length 26 mile marathon",
            "time requirement": "Minimum 12 weeks"
        },
        {
            "name": "Save an emergency fund",
            "description": "Daily tasks and tips to help you create better saving habits to create a healthy emergency fund",
            "time requirement": "3 - 6 months minimum"
        }
    ]
};

//goal overview data with daily task information
var goal_overview = {
    "goalOverview": [
        {
            "name": "Run a marathon",
            "description": "Long description here",
            "daily tasks": "array of daily tasks"
        }
    ]
};

//goal progress data for in progress goals
var goal_progress = {
    "goalProgress": [

    ]
}