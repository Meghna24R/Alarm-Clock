//accessing the elements in the webpage
const currTime = document.getElementById("curr-time");
const setHrs = document.getElementById("hours");
const setMin = document.getElementById("minutes");
const setSec = document.getElementById("seconds");
const setAmPm = document.getElementById("am-pm");
const msg = document.getElementById("msg");
const setAlarmBtn = document.getElementById("set-btn");
const alarmBlock = document.getElementById("alarm-block");

//adding event listeners
//code to fill the options in the select tag when the page loads
window.addEventListener("DOMContentLoaded", (event) => {
    console.log("entered");
    dropDownFill(1, 12, setHrs);
    dropDownFill(0, 59, setMin);
    dropDownFill(0, 59, setSec);
    setInterval(getCurrTime, 1000);
    fetchAlarm();
});

//eventlistener for when click action is performed on the button and getInput function is called
setAlarmBtn.addEventListener("click", getInput);

//function to fill the option in select tag using the start value, end value and element recieved as arguments
function dropDownFill(start, end, ele){
    for(let i=start; i<=end; i++){
        const dropDown = document.createElement("option");
        dropDown.value = i<10 ? "0"+i : i;
        dropDown.innerHTML = i<10 ? "0"+i : i;
        ele.appendChild(dropDown);
    }
}

//function to return the current time 
function getCurrTime(){
    let time = new Date();
    time = time.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
    });
    currTime.innerHTML = time;
    return time;
}

//function to fetch the set alarm time and call the function to set the alarm
function fetchAlarm(){
    const alarms = checkAlarm();
    alarms.forEach((time) => {
        setAlarm(time, true);
    });
}

//function to check and return the alarm time from the storage
function checkAlarm(){
    let alarms = [];
    const isPresent = localStorage.getItem("alarms");
    if(isPresent) alarms = JSON.parse(isPresent);
    return alarms;
}

//function to display the set alarm when it matches  current time
function setAlarm(time, fetching = false){
    //checking if the current time is equal to the set alarm
    const alarm = setInterval(() => {
        if(time[0] === getCurrTime()){
            if(time[1] === '') {
                alert("Alarm is ringing");
            } else {
                alert(time[1]);
            }
        }
    }, 500);

    addAlarm(time, alarm);
    if(!fetching){
        saveAlarm(time);
    }
}

//function to get the input from the webpage and pass the value to be set as alarm
function getInput(e){
    e.preventDefault();
    const hrValue = setHrs.value;
    const minValue = setMin.value;
    const secValue = setSec.value;
    const amPmValue = setAmPm.value;
    const alarmMsg = msg.value;
    const alarmTime = [convertTime(hrValue, minValue, secValue, amPmValue), alarmMsg];
    clearInput();
    setAlarm(alarmTime);
}

//function to clear the input fiedls and set the default value needed
function clearInput() {
    setHrs.value = '01';
    setMin.value = '00';
    setSec.value = '00';
    setAmPm.value = 'AM';
    msg.value = "";
}

//function to convert the time into integer
function convertTime(hr, min, sec, amPm){
    return `${parseInt(hr)}:${min}:${sec} ${amPm}`;
}

//function to create the element to be displayed of the set alarm
function addAlarm(time, intervalId){
    const alarm = document.createElement("div");
    alarm.classList.add("alarm");
    alarm.innerHTML = `
                    <div class="time">${time[0]}</div>
                    <p id="alarmMsg">${time[1]}</p>
                    <button class="btn dlt-alarm" data-id=${intervalId}>Delete</button>
                    `;
    const dltbtn = alarm.querySelector(".dlt-alarm");
    //adding event listener to the delete button when it is clicked 
    dltbtn.addEventListener("click", (e) => deleteAlarm(e, time, intervalId));
    alarmBlock.prepend(alarm);
}

//function to save the alarm time into storage
function saveAlarm(time){
    const alarms = checkAlarm();
    alarms.push(time);
    localStorage.setItem("alarms", JSON.stringify(alarms));
}

//function to remove the element from the webpage and the clear the interval
function deleteAlarm(event, time, intervalId){
    const self = event.target;
    clearInterval(intervalId);
    const alarm = self.parentElement;
    deleteAlarmFromLocal(time);
    alarm.remove();
}

//function to delete the alarm time from the storage
function deleteAlarmFromLocal(time){
    const alarms = checkAlarm();
    const index = alarms.indexOf(time);
    alarms.splice(index, 1);
    localStorage.setItem("alarms", JSON.stringify(alarms));
}