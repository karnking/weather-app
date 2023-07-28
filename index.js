const apiKey = "758401b9a8564c2fa7d9182ee5221032"
    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    };
    let success = (pos) => {
        const crd = pos.coords;
        let {latitude,longitude} = crd
        getData(`lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
    }

    let error = (err) => {
       console.warn(`ERROR(${err.code}): ${err.message}`);
       document.querySelector(".down").style.display = "block"
       let h1 = document.createElement("h1")
       h1.textContent = "Location not provided"
       document.querySelector(".down").append(h1)
    }

    window.onload = navigator.geolocation.getCurrentPosition(success,error,options)

    document.querySelector(".search").addEventListener("click", () => {
        let cityName = document.querySelector(".city-name").value
        getData(`q=${cityName}&appid=${apiKey}&units=metric`)
    })
    let getData = async (url) => {
        try {
            let response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?${url}`
                )
            let data = await response.json()
            let {coord:{lat,lon}} = data
            let response2 = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
                )
            let data2 = await response2.json()
            showData(data)
            showForecast(data2.list)
        } catch (error) {
            console.log(error)
            alert("Enter valid city name!")
            location.reload()
        }
    }
    
    let showData = (data) => {
        let {
            timezone,
            name,
            sys: {
                country,
                sunrise,
                sunset
            },
            main: {
                temp,
                feels_like,
                pressure,
                humidity,
                temp_min
            },
            weather: {
                0: {
                    icon,
                    description,
                }
            },
            wind: {
                speed,
                gust="-",
                deg
            },
            visibility
        } = data
        document.querySelector(".gmap_canvas").src =
            `https://maps.google.com/maps?q=${name}}&z=13&ie=UTF8&iwloc=&output=embed`
        
        document.querySelector(".root").style.display = "flex"
        
        let timeDiv = document.createElement("div")
        timeDiv.setAttribute("class", "time")
        timeDiv.textContent = getTimeByOffset(timezone)
        
        let cityName = document.createElement("h2")
        cityName.textContent = name + ", " + country
        
        let tempratureDiv = document.createElement("div")
        tempratureDiv.setAttribute("class", "temp-div")
        let cloud_img = document.createElement("img")
        cloud_img.src = `https://openweathermap.org/img/wn/${icon}@2x.png`
        let temprature = document.createElement("h2")
        temprature.innerHTML = temp.toFixed(1) + "&degC"
        tempratureDiv.append(cloud_img, temprature)
        
        let feels = document.createElement("h2")
        feels.setAttribute("class", "feels")
        feels.innerHTML = `<span>Feels like ${feels_like.toFixed(1)}&degC</span>. ${toTitleCase(description)}`
        
        let dataDiv = document.createElement("div")
        dataDiv.setAttribute("class","data-div")

        let leftDiv = document.createElement("div")
        leftDiv.setAttribute("class", "left-div")

        let directionDiv = document.createElement("div")
        directionDiv.setAttribute("class","direction-div")
        let directionImg = document.createElement("img")
        directionImg.src = "./images/"+getDirectionImg(deg)+".PNG"
        let speedP = document.createElement("p")
        speedP.textContent = `${speed}m/s ${getDirection(deg)}`
        directionDiv.append(directionImg,speedP)
        let humidityP = document.createElement("p")
        humidityP.textContent = `Humidity : ${humidity}%`
        let dewP = document.createElement("p")
        dewP.innerHTML = `Dew Point : ${temp_min}&degC`
        leftDiv.append(directionDiv,humidityP,dewP)

        let rightDiv = document.createElement("div")
        rightDiv.setAttribute("class", "right-div")
        
        let pressureDiv = document.createElement("div")
        pressureDiv.setAttribute("class","pressure-div")
        let compassImg = document.createElement("img")
        compassImg.src = "./images/compass.PNG"
        let pressureP = document.createElement("p")
        pressureP.textContent = `${pressure}hPA`
        
        pressureDiv.append(compassImg,pressureP)

        let uiP = document.createElement("p")
        uiP.textContent = "UV: "+Math.round(Math.random()*10)+1
        let visiblityP = document.createElement("p")
        visiblityP.textContent = `Visiblity: ${(visibility/1000).toFixed(1)} km`

        rightDiv.append(pressureDiv,uiP,visiblityP)
        dataDiv.append(leftDiv,rightDiv)
        
        document.querySelector(".data").innerHTML = ""
        document.querySelector(".data").append(timeDiv, cityName, tempratureDiv, feels, dataDiv)
        document.querySelector(".imperial").setAttribute("class","imperial");
        document.querySelector(".metric").setAttribute("class","metric checked");
    }
    let showForecast = (data) =>{
        document.querySelector(".down").innerHTML = ""
        document.querySelector(".down").style.display = "grid"
        data = data.filter((obj,i)=>{
            return i%5==0
        })
        for(obj of data){
            let {main:{feels_like,temp_min},weather:{0:{icon}},dt_txt} = obj
            let date = document.createElement("h2")
            date.textContent = getDateForecast(dt_txt)
            let img = document.createElement("img")
            img.src = `https://openweathermap.org/img/wn/${icon}@2x.png`
            let h1 = document.createElement("h2")
            h1.innerHTML = feels_like+"&deg"
            let h2 = document.createElement("h2")
            h2.innerHTML = temp_min+"&deg"
            let div = document.createElement("div")
            div.append(date,img,h1,h2)
            document.querySelector(".down").append(div)
        }
    }
    document.querySelector(".imperial").addEventListener("click",function(){
        document.querySelector(".imperial").setAttribute("class","imperial checked");
        document.querySelector(".metric").setAttribute("class","metric");
        let temp = document.querySelector(".temp-div>h2")
        temp.textContent = temp.textContent.substring(0,temp.textContent.length-1)+"F"
        let temp1 = document.querySelector(".feels>span")
        temp1.textContent = temp1.textContent.substring(0,temp1.textContent.length-1)+"F"
        let temp2 = document.querySelector(".left-div>p:last-child")
        temp2.textContent = temp2.textContent.substring(0,temp2.textContent.length-1)+"F"
        let temp3 = document.querySelector(".right-div>p:last-child")
        temp3.textContent = temp3.textContent.substring(0,temp3.textContent.length-2)+"miles"
    })
    document.querySelector(".metric").addEventListener("click",function(){
        document.querySelector(".metric").setAttribute("class","metric checked");
        document.querySelector(".imperial").setAttribute("class","imperial");
        let temp = document.querySelector(".temp-div>h2")
        temp.textContent = temp.textContent.substring(0,temp.textContent.length-1)+"C"
        let temp1 = document.querySelector(".feels>span")
        temp1.textContent = temp1.textContent.substring(0,temp1.textContent.length-1)+"C"
        let temp2 = document.querySelector(".left-div>p:last-child")
        temp2.textContent = temp2.textContent.substring(0,temp2.textContent.length-1)+"C"
        let temp3 = document.querySelector(".right-div>p:last-child")
        temp3.textContent = temp3.textContent.substring(0,temp3.textContent.length-5)+"km"
    })

    let getTimeByOffset = (offset) => {
        let now = new Date();
        let utcOffset = now.getTimezoneOffset() * 60000;
        let targetOffset = offset * 1000;
        let targetTime = now.getTime() + utcOffset + targetOffset;

        var targetDate = new Date(targetTime);
        return targetDate.toLocaleTimeString('default', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
    }

    let getDateForecast = (dt_txt) =>{
        let date = new Date(dt_txt)
        return date.toLocaleDateString("default",{weekday:'short'})
    }
    let toTitleCase = (str) => {
        let arr = str.split(" ")
        let newStr = ""
        for (x of arr) {
            newStr += x[0].toUpperCase() + x.substr(1) + " "
        }
        return newStr
    }
    let getDirection = (deg) => {
        let val = ((deg/22.5)+0.5).toFixed(0)
        let arr=["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
        return arr[(val % 16)]
    }
    let getDirectionImg = (deg) => {
        let val = ((deg/45)+0.5).toFixed(0)
        let arr=["N", "NE", "E", "SE", "S", "SW","W", "NW"];
        return arr[(val % 8)]
    }
