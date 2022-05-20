/* eslint-disable no-extra-parens */
/* eslint-disable semi */
/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars

const workingDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

function calculateDueDate(submitDate, turnaround) {

    const time = submitDate.split(" ")[0].slice(0, -2) //2:12
    const hour = Number(time.split(":")[0]) //2
    const minute = Number(time.split(":")[1]) //12
    const meridiem = submitDate.split(" ")[0].slice(-2) //AM or PM
    const submitDayIndex = workingDays.indexOf(submitDate.split(" ")[1]) //look up working day in array
    turnaround = Math.round(turnaround * 10) / 10 //integer or 1 decimal


    //validation for incorrect inputs

    if (isNaN(hour) ||
        isNaN(minute) ||
        hour.toString().length > 2 ||
        minute < 0 || minute > 59 ||
        (meridiem !== "AM" && meridiem !== "PM")
    ) {
        return "Invalid date format. The correct format is 2:12PM or AM"
    }

    if (submitDayIndex < 0){
        return submitDate.split(" ")[1] + "is not a working day"
    }

    if (meridiem === "AM" && (hour < 9 || 13 <= hour) || meridiem === "PM" && (hour < 1 || 5 <= hour)) {
        return "You can only report a problem during working hours"
    }

    if (turnaround < 0){
        return "Turnaround time must be at least 0"
    }

    //calculating the resolve time

    //workingDayInMins = 8*60 = 480
    //2:12PM Tuesday-> convert to mins -> 5*60 + 12 = 312
    //turnaround 16 -> 16*60 = 960
    //312 + 960 = 1272
    // 1272 % 480 = 312 (delutan 2:12) Math.floor(1272/480)=2 (2 days elapsed)

    const workingDayInMins = 480
    let hoursElapsedOnSubmitDay = 0

    if (meridiem === "AM"){
        hoursElapsedOnSubmitDay = hour - 9
    } else {
        hoursElapsedOnSubmitDay = 4 + (hour - 1)
    }

    const timeElapsedInMins = hoursElapsedOnSubmitDay * 60 + minute + turnaround * 60 //time of submit + turnaround = time of submit

    const daysElapsed = Math.floor(timeElapsedInMins / workingDayInMins) //how many days passed from submit to resolve
    const resolveDay = workingDays[(daysElapsed % 5 + submitDayIndex) % 5] //convert resolveDay to Mon-Fri format
    console.log(resolveDay)

    //handle week cycling with modulo operator:
    //pl ha submitday 2 és 12 nap telt el -> 12%5 = 2 -> 2+2 = péntek
    //ha csak 1 nap telt el akkor ugyanugy 1%5 = 1 -> 1+1 = csutortok

    //ha csütörtöktől elmúlt 13 nap: akkor (3 +submitDay(3)) % 5 = 1  -> kedd
    //ha péntektől elmúlt 13 nap: akkor (3 + submitDay(4)) % 5 = 2 -> szerda
    //és ha 14 nap: (4 + submitDay(4)) % 5 = 3 -> csütörtök
    //ezt leirni kommentbe!
    //2 eset:
    //ha kisebb 1 hétnél akkor ez csak rászámolni
    //ha nagyobb 1 hétnél 2 aleset: 
    //2a esetben csak annyi nap telik el, hogy ugyanazon a héten belül legyünk
    //2b esetben annyi nap telik el, hogy már kövi hétre csúszik (de természetesen nem tud 1 egesz hetet elcsúszni mert modulo) 
        //-> emiatt kell a 2. modulo
            //szerda + 4 már 7 lenne ami undefined, így inkább a szerdát is kiveszem, lesz 0, de cserébe hozzáadom a 4-hez, lesz 6 -> 6%5 = 1 ami kedd

    const resolveTimeInMins = timeElapsedInMins % workingDayInMins //convert to 2:12 format

    // console.log("time: " + time)
    // console.log("hour: " + hour)
    // console.log("minute: " + minute)
    // console.log("meridiem: " + meridiem)
    // console.log("dayIndex: " + dayIndex)
    // console.log("turnaround: " + turnaround)

    return "string";
}

//"what is the input submitDate";
console.log(calculateDueDate("2:12PM Tuesday", 5003)); //should return: 2:12PM Thursday
