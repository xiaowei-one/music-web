export { turn_date as tD };

function turn_date(date) {
    date = Math.round(date);
    let end_date = '';
    if (Math.floor(date / 3600)) {
        let y = (date - date % 3600) / 3600;
        y < 10 && (end_date += '0');
        end_date += y + ':';
    }
    if (Math.floor(date % 3600 / 60)) {
        let y = Math.floor(date % 3600 / 60);
        y < 10 && (end_date += '0');
        end_date += y + ":";
    } else {
        end_date += "00:";
    }
    if (date % 60) {
        let y = date % 3600 % 60;
        y < 10 && (end_date += '0');
        end_date += y;
    } else {
        end_date += "00";
    }
    return end_date;
}