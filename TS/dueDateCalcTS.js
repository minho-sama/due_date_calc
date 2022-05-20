/* eslint-disable indent */
/* eslint-disable semi */
/* eslint-disable no-console */
/* eslint-disable no-extra-parens */
/* eslint-disable newline-before-return */
function calculateDueDate(submitDate, turnaround) {
    var workingDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    var time = submitDate.split(" ")[0].slice(0, -2); //2:12
    var hour = Number(time.split(":")[0]); //2
    var minute = Number(time.split(":")[1]); //12
    var meridiem = submitDate.split(" ")[0].slice(-2); //AM or PM
    var submitDayIndex = workingDays.indexOf(submitDate.split(" ")[1]); //look up working day in array
    turnaround = Math.round(turnaround * 10) / 10; //integer or 1 decimal
    //validation for incorrect inputs
    if (isNaN(hour) ||
        isNaN(minute) ||
        hour.toString().length > 2 ||
        minute < 0 || minute > 59 ||
        (meridiem !== "AM" && meridiem !== "PM")) {
        return "Invalid date format. The correct format is 2:12PM or AM";
    }
    if (submitDayIndex < 0) {
        return submitDate.split(" ")[1] + "is not a working day";
    }
    if (meridiem === "AM" && (hour < 9 || 13 <= hour) || meridiem === "PM" && (hour < 1 || 5 <= hour)) {
        return "You can only report a problem during working hours";
    }
    if (turnaround < 0) {
        return "Turnaround time must be at least 0";
    }
    //calculating the resolve time (convert everything to minutes) example
    //workingDayInMins = 8*60 = 4802
    //2:12PM Tuesday-> convert to mins -> 5*60 + 12 = 312
    //turnaround 16h -> 16*60 = 960
    //312 + 960 = 1272 (minutes passed from submitting to resolving the issue)
    //1272 % 480 = 312 -> Math.floor(312 / 60) = 5, 312 % 60 = 12 => (2:12PM)
    //Math.floor(1272 / workingDayInMins) = 2 -> 2 days passed -> Thursday
    var workingDayInMins = 480;
    var hoursElapsedOnSubmitDay = 0;
    if (meridiem === "AM") {
        hoursElapsedOnSubmitDay = hour - 9;
    }
    else {
        hoursElapsedOnSubmitDay = 4 + (hour - 1);
    }
    var totalTimeElapsedInMins = hoursElapsedOnSubmitDay * 60 + minute + turnaround * 60; //time of submit + turnaround = time of resolve (in minutes)
    //handle days passing without moving to next week
    //if submitDay is Wednesday (index 2) and 2 days passed -> submitDayIndex + 2 = 4 => Friday
    //handle week "overflow"
    //if submitDay is Wednesday (index 2) and 12 days passed -> 12 % 5 = 2 -> 2 + 2 => Friday
    //if 1 day passed -> 1 % 5 = 1 -> 1 + 1 = Thursday
    //handle double week "overflow"
    //if submitDay is Thursday (index 3) and 8 days passed -> 8 % 5 = 3 -> (submitDayIndex + 3) % 5 = 1  => Tuesday
    //if submitDay is Friday (index 4) and 8 days passed -> 8 % 5 = 3 -> (submitDayIndex + 3) % 5 = 2  => wednesday
    //if 9 days passed -> (submitDayIndex + 4) % 5 = 3 => csütörtök
    var daysElapsed = Math.floor(totalTimeElapsedInMins / workingDayInMins); //how many days passed from submit to resolve
    var resolveDay = workingDays[(submitDayIndex + daysElapsed % 5) % 5]; //convert resolveDay to Mon-Fri format
    //it is not enough to add hours and mins together, as turnaround can be non-integer (e.g. 16.5)
    var resolveTimeInMins = totalTimeElapsedInMins % workingDayInMins; //0 <= resolveTimeInMins < 480 (0 to 8)
    function formatTimeInMins(resolveTime) {
        var resolveHour24format = 9 + Math.floor(resolveTime / 60);
        var resolveHour12format = ((resolveHour24format + 11) % 12 + 1); // resolveHour24format % 12 is not good for 12AM (results in 0)
        var suffix = resolveHour24format > 12 ? "PM" : "AM";
        var resolveMin = "0".concat(resolveTime % 60); //0 is needed, because 12:00AM input will have an output 12:0
        var formattedTime = "".concat(resolveHour12format, ":").concat(resolveMin.slice(-2)).concat(suffix);
        return formattedTime;
    }
    var resolveTimeFormatted = formatTimeInMins(resolveTimeInMins);
    return resolveTimeFormatted + " " + resolveDay; //adding weeks: Math.floor(totalTimeElapsedInMins / (workingDayInMins * 5))
}
//"what is the input submitDate";
console.log(calculateDueDate("12:37AM Thursday", 13.5)); //should return: 2:12PM Thursday
// module.exports = calculateDueDate
