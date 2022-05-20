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