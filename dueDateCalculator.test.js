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
const invalidDateInputMessage = "Invalid date format. The correct format is 2:12PM or AM"

test("hour input is invalid, shows invalid date format message", () => {
    expect(calculateDueDate("x9:12PM Monday", 12)).toBe(invalidDateInputMessage)
})

test("invalid turnaround time message", () => {
    expect(calculateDueDate("12:37AM Thursday", -13)).toBe("Turnaround time must be at least 0")
})

test("correctly owerflows to next week from Thursday to Monday", () => {
    expect(calculateDueDate("12:37AM Thursday", 13.5)).toBe("10:07AM Monday")
})

