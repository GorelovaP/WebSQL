let db = openDatabase('db', '1.0', 'my first database', 2 * 1024 * 1024);
let Brand = document.getElementById("brand");
let FIO = document.getElementById("FIO");
let Registration = document.getElementById("number");
let Time = document.getElementById("time");


class carConstr {
    constructor(ID, Brand, FIO, Registration, Time) {
        {
            this.id = ID;
            this.brand = Brand;
            this.fio = FIO;
            this.registration = Registration;
            this.time = Time;

        }
    }
}

let car = new carConstr();
let carsMap = new Map();
initMap();

db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS t2 (id integer primary key autoincrement, brand, FIO,registration, time)');
});
alert('Таблица создана');
if (!db) {
    alert("Нет соединения с БД!")
}

// db.transaction(function (tx) {
//     tx.executeSql('DROP TABLE t2');
// });
// alert('Таблица удалена');

function initMap() {
    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM t2 ORDER BY ID", [], function (tx, result) {
            for (let i = 0; i < result.rows.length; i++) {
                let id = result.rows.item(i)['id'];
                let brand = result.rows.item(i)['brand'];
                let fio = result.rows.item(i)['FIO'];
                let registration = result.rows.item(i)['registration'];
                let time = result.rows.item(i)['time'];
                let address = result.rows.item(i)['address'];
                let tel = result.rows.item(i)['tel'];
                let telCom = result.rows.item(i)['telCom'];
                let tmpCar = new carConstr(id, brand, fio, registration, time);
                carsMap.set(id, tmpCar);
            }
        }, null)
    });
}

showId();
findMax();
findMin();

function clearForm() {
    Brand.value = '';
    FIO.value = '';
    Registration.value = '';
    Time.value = '';
    if (car.address !== undefined || car.tel !== undefined || car.telcom !== undefined) {
        newInput.value = '';
    }
}

let regExp = /^([А-ЯA-Z]|[А-ЯA-Z][\x27а-яa-z]{1,}|[А-ЯA-Z][\x27а-яa-z]{1,}\-([А-ЯA-Z][\x27а-яa-z]{1,}|(оглы)|(кызы)))\040[А-ЯA-Z][\x27а-яa-z]{1,}(\040[А-ЯA-Z][\x27а-яa-z]{1,})?$/;
let regTime = /^\d+$/;
let regBrand = /^[A-Za-z0-9]+$/;
let regReg = /^([0-9]{4}[A-Z]{2}[0-9]{1})?$/;

function InsertRow() {
    if ((Brand.value === '') || (FIO.value === '') || (Registration.value === '') || (Time.value === '')) {
        alert('Необходимо заполнить поля');
        return;
    } else {
        if (regBrand.test(Brand.value) == false) {
            alert('Ошибка в поле "Марка автомобиля"!');
            return;
        }
        if (regExp.test(FIO.value) == false) {
            alert('Ошибка в поле ФИО!');
            return;
        }
        if (regReg.test(Registration.value) == false) {
            alert('Ошибка в поле "Номер автомобиля"!');
            return;
        }
        if (regTime.test(Time.value) == false) {
            alert('Ошибка в поле "Время стоянки", допускаются только цифры!');
            return;

        }
    }

    car.brand = Brand.value;
    car.fio = FIO.value;
    car.registration = Registration.value;
    car.time = Time.value;

    if (car.address !== undefined) {
        car.address = newInput.value;
    }
    if (car.tel !== undefined) {
        car.tel = newInput.value;
    }
    if (car.telCom !== undefined) {
        car.telCom = newInput.value;
    }

    if (car.address !== undefined) {
        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO t2 (brand, FIO,registration, time, address) VALUES (?,?,?,?,?)', [car.brand, car.fio, car.registration, car.time, car.address]);
        });
    }
    if (car.tel !== undefined) {
        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO t2 (brand, FIO,registration, time,tel) VALUES (?,?,?,?,?)', [car.brand, car.fio, car.registration, car.time, car.tel]);
        });
    }
    if (car.telCom !== undefined) {
        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO t2 (brand, FIO,registration, time,tel) VALUES (?,?,?,?,?)', [car.brand, car.fio, car.registration, car.time, car.telCom]);
        });
    } else db.transaction(function (tx) {
        tx.executeSql('INSERT INTO t2 (brand, FIO,registration, time) VALUES (?,?,?,?)', [car.brand, car.fio, car.registration, car.time]);
    });

    alert('Строка добавлена');
    DoSelect();
    initMap();
    console.log(carsMap);
    showId();
    findMax();
    findMin();
}

function DeleteRow() {
    let sel = document.getElementById("dataSelect").options.selectedIndex;
    let txt = document.getElementById("dataSelect").options[sel].text;
    let n = parseInt(txt)
    db.transaction(function (tx) {
        if (txt !== '') {
            tx.executeSql('DELETE FROM t2 WHERE id=?;', [n]);
        }
    });
    alert('Строка удалена');
    DoSelect();
    showId();
    carsMap.delete(n);
    findMax();
    findMin();
    console.log(carsMap);
}

function OutRow(id, Brand, FIO, Registration, Time) {
    let row = document.createElement("tr");
    let idCell = document.createElement("td");
    let BrandCell = document.createElement("td");
    let FIOCell = document.createElement("td");
    let RegistrationСell = document.createElement("td");
    let TimeCell = document.createElement("td");
    idCell.textContent = id;
    BrandCell.textContent = Brand;
    FIOCell.textContent = FIO;
    RegistrationСell.textContent = Registration;
    TimeCell.textContent = Time;
    row.appendChild(idCell);
    row.appendChild(BrandCell);
    row.appendChild(FIOCell);
    row.appendChild(RegistrationСell);
    row.appendChild(TimeCell);
    document.getElementById("tabletable").appendChild(row);
}

function DoSelect() {
    document.getElementById("tabletable").innerHTML = '<th>Id</th> <th>Название авто</th> <th>ФИО</th><th>Номера авто</th><th>Время стоянки в часах</th>';
    db.transaction(function (tx) {
        tx.executeSql('SELECT * from t2', [], function (tx, result) {
            for (let i = 0; i < result.rows.length; i++) {
                let item = result.rows.item(i);
                OutRow(item.id, item.brand, item.FIO, item.registration, item.time);
            }
        });
    });
    initMap();
}

function ShowDoSelect() {
    DoSelect();
    let tabletable = document.querySelector(".inf");
    if (tabletable.classList.contains("active")) {
        tabletable.classList.replace("active", "passive")
    } else if (tabletable.classList.contains("passive")) {
        tabletable.classList.replace("passive", "active")
    }

}


function showId() {
    let select = document.getElementById("dataSelect");
    select.innerHTML = "";
    db.transaction(function (tx) {
        let tmp;
        let newOption;
        tx.executeSql("SELECT * FROM t2 ORDER BY ID", [], function (tx, result) {
            for (let i = 0; i < result.rows.length; i++) {
                tmp = result.rows.item(i)['id'];
                newOption = new Option(tmp, tmp);
                select.appendChild(newOption);
            }
        }, null)
    });
}

function findMax() {
    let max;
    db.transaction(function (tx) {
        let mass = [];
        let tmp;
        tx.executeSql("SELECT * FROM t2 WHERE time= (SELECT max(time) FROM t2) ORDER BY time", [], function (tx, result) {

            for (let i = 0; i < result.rows.length; i++) {
                tmp = result.rows.item(i)['brand'];
                mass.push(tmp);
                max = mass.join(",")
            }
            let textMax = document.querySelector(".max");
            textMax.innerHTML = max;
        }, null)
    });
}

function findMin() {
    let min;
    db.transaction(function (tx) {
        let mass = [];
        let tmp;
        tx.executeSql("SELECT * FROM t2 WHERE time=(SELECT MIN(time) FROM t2) ORDER BY ID", [], function (tx, result) {

            for (let i = 0; i < result.rows.length; i++) {
                tmp = result.rows.item(i)['brand'];
                mass.push(tmp);
                min = mass.join(",")
            }
            let textMin = document.querySelector(".min");
            textMin.innerHTML = min;
        }, null)
    });
}

function ShowMinMax() {
    let MinMax = document.querySelector(".MimMax");
    if (MinMax.classList.contains("active")) {
        MinMax.classList.replace("active", "passive")
    } else if (MinMax.classList.contains("passive")) {
        MinMax.classList.replace("passive", "active")
    }

}


function Input() {
    let inp_val = document.getElementById('newInput');
    document.getElementById('newInput').innerHTML = inp_val.options[inp_val.selectedIndex].text;
    let insLabel = document.getElementById('forInsert');
    let tmp = document.createElement('input');
    var parentDiv = insLabel.parentNode;	//возвращает родительский узел

    parentDiv.insertBefore(tmp, insLabel);
    newStructDb();
}

function newStructDb() {
    if (car.address !== undefined) {
        db.transaction(function (tx) {
            tx.executeSql("ALTER TABLE t2 ADD COLUMN address", [], function (tx, result) {
            });
        });
    }
    if (car.tel !== undefined) {
        db.transaction(function (tx) {
            tx.executeSql("ALTER TABLE t2 ADD COLUMN tel", [], function (tx, result) {
            });
        });
    }
    if (car.telCom !== undefined) {
        db.transaction(function (tx) {
            tx.executeSql("ALTER TABLE t2 ADD COLUMN telCom", [], function (tx, result) {
            });
        });
    }


}