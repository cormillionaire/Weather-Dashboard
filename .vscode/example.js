// you need to make a form with an input
// button to submit

// Container for button after submission.

// when we click the search button or submit the form
    // event listener on the click or submit
        // grab the value from the input
        // save the result in local storage
        // display button in the button container !!!!!!!!!!!
        // clear the input
    // Middle part
        // fetch call to API
            // One fetch for lat/lon
            // Second fetch to https://openweathermap.org/api/one-call-api for other stuff
                // Display the information


                fetch(url)
                .then(function(response) {
                    return response.JSON()
                })
                .then(function(data){
                    // have information in data
                    // make another fetch, return fetch call of you want to chain
                })
                .then(function(response){
                    // chain from return fetch call in previous .then
                })