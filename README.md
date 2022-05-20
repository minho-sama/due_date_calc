# due_date_calc
In this task, I attempted to create a function that calculates the due date of a task given 2 inputs, date and turnaround time.

==calculateDueDate(submitDate, turnaround)== expects a *submitDate* based on the following format: *HH:MMmeridiem DAY*
where *HH* represents hours, *MM* represents minutes, *meridiem* can be AM or PM, and *DAY* can be any day from Monday to Friday. 

*turnaround time* represents the *HOURS* needed, with no upper limit. 

the solution is in dueDateCalculator.js

to run, clone repo then *npm install*
to test, *npm run test*








d = new Date()
e = d.setTime(d.getTime() + 5*60*60*1000)