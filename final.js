const axios = require('axios');
var fs = require('fs');
limit = 300
countryCode = 'IN'
var arr = [];
let writeStream = fs.createWriteStream('output.txt');

//URL to GET supported cities in a country
url = `https://api.openaq.org/v1/cities?&limit=${limit}&country=${countryCode}`
axios.get(url).then(response => {

    x = response.data.results
    x.forEach(element => {
        arr.push(element)
    });
    var itr = 0;

    function update() {
        //URL to GET data from each station in a city
        url = `https://api.openaq.org/v1/latest?city=${arr[itr].city}`
        axios
            .get(url)
            .then(function (response) {
                var data = {
                    Location: "",
                    CO: "",
                    SO2: "",
                    O3: "",
                    NO2: "",
                    PM25: "",
                    PM10: ""
                }

                response.data.results.forEach(element => {
                    element.measurements.forEach(element => {
                        console.log(element.parameter)
                        if (element.parameter == 'co') { data.CO = element.value }
                        if (element.parameter == 'so2') { data.SO2 = element.value }
                        if (element.parameter == 'o3') { data.O3 = element.value }
                        if (element.parameter == 'no2') { data.NO2 = element.value }
                        if (element.parameter == 'pm25') { data.PM25 = element.value }
                        if (element.parameter == 'pm10') { data.PM10 = element.value }

                    });
                    data.Location = element.location;



                    var jsonData = JSON.stringify(data)
                    writeStream.write(jsonData + ',\n');
                });


            })
            .catch(function (error) {
                console.log(error);
            })
        itr++;
    }


    var i = 0, howManyTimes = arr.length;
    function loop() {
        update()
        i++;
        if (i < howManyTimes) {
            setTimeout(loop, 10);
        }
    }


    loop();
}).catch(function (error) {
    console.log(error);
});