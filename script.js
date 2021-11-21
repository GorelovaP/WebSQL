var db= openDatabase('db','1.0','my first database',2*1024*1024);

function CreateTable()
{
    var db= openDatabase('db','1.0','my first database',2*1024*1024);
    db.transaction(function (tx)
    {
        tx.executeSql('CREATE TABLE IF NOT EXISTS t1 (id integer primary key autoincrement, name, value)');
    });
    alert('Таблица создана');
}

function DeleteTable()
{
    var db= openDatabase('db','1.0','my first database',2*1024*1024);
    db.transaction(function (tx)
    {
        tx.executeSql('DROP TABLE t1');
    });
    alert('Таблица удалена');
}

function InsertRow()
{
    var thisname=document.getElementById("tx1").value;
    var thisvalue=document.getElementById("tx2").value;
    if ( (thisname=='')||(thisvalue=='') ) {alert('Необходимо заполнить поля ключ и значение');return;}

    var db= openDatabase('db','1.0','my first database',2*1024*1024);
    db.transaction(function (tx)
    {
        tx.executeSql('INSERT INTO t1 (name,value) VALUES (?,?)', [thisname,thisvalue]);
    });
    alert('Строка добавлена');
}

function InsertStandartRows()
{
    var names=["Zero","One","Two"];
    var values=["0","1","2"];
    var db= openDatabase('db','1.0','my first database',2*1024*1024);
    db.transaction(function (tx)
    {
        for (var i=0;i<names.length;i++)
        {tx.executeSql('INSERT INTO t1 (name,value) VALUES (?,?)', [names[i],values[i]]);}
    });
    alert('Стандартные строки добавлены');
}


function UpdateValue()
{
    var thisname=document.getElementById("tx1").value;
    var thisvalue=document.getElementById("tx2").value;
    if ( (thisname=='')||(thisvalue=='') ) {alert('Необходимо заполнить поля ключ и значение');return;}

    var db= openDatabase('db','1.0','my first database',2*1024*1024);
    db.transaction(function (tx)
    {
        tx.executeSql('UPDATE t1 SET value=? WHERE name=?;', [thisvalue,thisname]);
    });
    alert('Значения обновлены');
}

function DeleteRow()
{
    var thisname=document.getElementById("tx1").value;
    var thisvalue=document.getElementById("tx2").value;
    if ( (thisname=='')&&(thisvalue=='') ) {alert('Необходимо заполнить поля ключ или значение');return;}

    var db= openDatabase('db','1.0','my first database',2*1024*1024);
    db.transaction(function (tx)
    {
        if (thisname!='')
        {tx.executeSql('DELETE FROM t1 WHERE name=?;',[thisname]);}
    });

    db.transaction(function (tx)
    {
        if (thisvalue!='')
        {tx.executeSql('DELETE FROM t1 WHERE value=?;',[thisvalue]);}
    });
    alert('Строка удалена');
}

function OutRow(id,name,value)
{
    var row= document.createElement("tr");
    var idCell=document.createElement("td");
    var nameCell=document.createElement("td");
    var valueCell=document.createElement("td");
    idCell.textContent=id;
    nameCell.textContent=name;
    valueCell.textContent=value;
    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(valueCell);
    document.getElementById("tabletable").appendChild(row);
}

function DoSelect()
{
    var db= openDatabase('db','1.0','my first database',2*1024*1024);
    document.getElementById("tabletable").innerHTML = '<th>Id</th> <th>Name</th> <th>Value</th>';
    db.transaction(function (tx)
    {tx.executeSql('SELECT * from t1',[],function (tx,result)
    {for (var i=0;i<result.rows.length;i++)
    {
        var item=result.rows.item(i);
        OutRow(item.id,item.name,item.value);
    }
    });
    });
}

function ShowCount()
{
    var db= openDatabase('db','1.0','my first database',2*1024*1024);

    db.transaction(function (tx)
    {tx.executeSql('SELECT count(*) co from t1',[],function (tx,result)
    {
        var item=result.rows.item(0);
        alert(item.co);
    });
    });
}
