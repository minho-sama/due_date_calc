/* eslint-disable semi */
/* eslint-disable no-undef */
//invalid time format összes lehetőséget tesztelni
//time is 02:12 instead of 12
//dayindex < 0
//not working hours
//idiot format 13:12AM or 4:12PM
//turnaround === 0
//negative turnaround
//deal with non integer turnaround
//AM, PM, csomo datet kiprobalni
    //pdf-ben példa
    //kiindulni ngyon egyszerűből pl 9:00AM 0 passed és ezt variálni
    //csak 2 óra telik el de átcsúszik másik napra
    //csak 2 óra telik el de átcsúszik másik hétre (péntek-hétfő)
    //marad aznap
    //soksok héten keresztül megy a turnaround
    //pl "2:12PM Tuesday", 5003 és "2:12PM Tuesday", 5000
    //perc 0, perc 00
    //csak pár perc teljen el (turnaround 0.1)

const calculateDueDate = require("./dueDateCalculator")

//test for validating input date/time and turnaround time
const invalidDateInputMessage = "Invalid date format. The correct format is 2:12PM or AM"

test("hour input is not a number, shows invalid date format message", () => {
    expect(calculateDueDate("x9:12PM Monday", 12)).toBe(invalidDateInputMessage)
})

test("hour input is too long, shows invalid date format message", () => {
    expect(calculateDueDate("110:12PM Monday", 12)).toBe(invalidDateInputMessage)
})

test("minute input is not a number, shows invalid date format message", () => {
    expect(calculateDueDate("10:ggAM Monday", 12)).toBe(invalidDateInputMessage)
})

test("minute input is more than 59, shows invalid date format message", () => {
    expect(calculateDueDate("10:78AM Monday", 12)).toBe(invalidDateInputMessage)
})

test("minute input is less than 0, shows invalid date format message", () => {
    expect(calculateDueDate("10:-1AM Monday", 12)).toBe(invalidDateInputMessage)
})

test("meridiem is missing, shows invalid date format message", () => {
    expect(calculateDueDate("10:12 Monday", 12)).toBe(invalidDateInputMessage)
})

test("meridiem is not AM nor PM, shows invalid date format message", () => {
    expect(calculateDueDate("10:12GG Monday", 12)).toBe(invalidDateInputMessage)
})

test("non-working day input returns no-working day message", () => {
    const saturday = "Saturday"
    const sunday = "sunday"

    expect(calculateDueDate(`01:12PM ${saturday}`)).toBe(`${saturday} is not a working day`)
    expect(calculateDueDate(`01:12PM ${sunday}`)).toBe(`${sunday} is not a working day`)
    expect(calculateDueDate(`01:12PM`)).toBe(`undefined is not a working day`)
})

test("reporting problem during non-working hours returns error message", () => {

    expect(calculateDueDate(`8:12PM monday`)).toBe("You can only report a problem during working hours")
    expect(calculateDueDate(`00:12PM Monday`)).toBe("You can only report a problem during working hours")
    expect(calculateDueDate(`5:12PM monday`)).toBe("You can only report a problem during working hours")
    expect(calculateDueDate(`11:12PM Monday`)).toBe("You can only report a problem during working hours")
})

test("invalid turnaround time message", () => {
    expect(calculateDueDate("12:37AM Thursday", -13)).toBe("Turnaround time must be at least 0")
})

test("no upper limit for turnaround time", () => {
    expect(calculateDueDate("12:37AM Thursday", 999999999999)).not.toBe("Turnaround time must be at least 0")
})

test("lowercase and capital meridiem should both work", () => {
    expect(calculateDueDate("10:12AM Wednesday", 13.5)).toBe("3:42PM Thursday")
    expect(calculateDueDate("10:12am Wednesday", 13.5)).toBe("3:42PM Thursday")
    expect(calculateDueDate("4:12pM Tuesday", 13.5)).toBe("1:42PM Thursday")
    expect(calculateDueDate("4:12PM Tuesday", 13.5)).toBe("1:42PM Thursday")
})

test("lowercase and capital working days should both work", () => {
    expect(calculateDueDate("10:12AM wednesday", 13.5)).toBe("3:42PM Thursday")
    expect(calculateDueDate("10:12am WEDNESDAY", 13.5)).toBe("3:42PM Thursday")
    expect(calculateDueDate("4:12pM Tuesday", 13.5)).toBe("1:42PM Thursday")
    expect(calculateDueDate("4:12PM tUESDAY", 13.5)).toBe("1:42PM Thursday")
})


//tests for the correct due date
test("correctly owerflows to next week from Thursday to Monday", () => {
    expect(calculateDueDate("12:37AM Thursday", 13.5)).toBe("10:07AM Monday")
})

