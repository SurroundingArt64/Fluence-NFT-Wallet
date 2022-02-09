use marine_rs_sdk::marine;
use marine_rs_sdk::module_manifest;
use marine_rs_sdk::WasmLoggerBuilder;

use marine_sqlite_connector::Value;

module_manifest!();

pub fn main() {
    WasmLoggerBuilder::new().build().unwrap();
}

#[marine]
pub fn store_private_key(public_key: String, private_key: String, password: String) -> bool {
    log::info!("put called with {}\n", public_key);

    // Open DB in tmp storage
    let path = "/tmp/users2.sqlite";
    // Create connection
    let connection = marine_sqlite_connector::Connection::open(path).unwrap();

    // let mut cursor = connection
    //     .prepare(
    //         "CREATE TABLE IF NOT EXISTS keys (
    //         public_key TEXT PRIMARY KEY,
    //         private_key TEXT,
    //         password TEXT
    //     );
    //     INSERT INTO keys (public_key, private_key, password) VALUES (?, ?, ?);",
    //     )
    //     .unwrap()
    //     .cursor();

    // cursor
    //     .bind(&[
    //         Value::String(public_key),
    //         Value::String(private_key),
    //         Value::String(password),
    //     ])
    //     .unwrap();

    // cursor.next().unwrap();

    // Create table if needed and insert keys
    connection.execute(
        format!("
        CREATE TABLE IF NOT EXISTS keys (public_key TEXT PRIMARY KEY, private_key TEXT, password TEXT);
        INSERT INTO keys (public_key, private_key, password) VALUES ({}, {}, {});
        ", public_key, private_key, password).as_str(),
    ).unwrap();

    // // reconnect
    // connection = marine_sqlite_connector::Connection::open(path).unwrap();
    // // get stored keys
    // let cursor = connection.prepare("SELECT * FROM keys").unwrap().cursor();
    // // debug print count of keys
    // log::info!("table size is: {:?}", cursor.count());
    true
}

#[marine]
pub fn get_private_key(public_key: String, _password: String) -> String {
    log::info!("get called with {}\n", public_key);
    // Open DB in tmp storage
    let path = "/tmp/users2.sqlite";
    // Create connection
    let connection = marine_sqlite_connector::Connection::open(path).unwrap();
    // get stored keys
    let mut cursor = connection
        .prepare("SELECT * FROM keys WHERE public_key=?")
        .unwrap()
        .cursor();
    // bind public key to cursor
    cursor.bind(&[Value::String(public_key)]).unwrap();
    // result init
    let mut private_key: String = "Not Found".to_string();
    // get first row
    while let Some(row) = cursor.next().unwrap() {
        private_key = row[1].as_string().expect("error on row[0] parsing").into();
    }
    // return
    private_key
}

#[marine]
pub fn testing_key() -> bool {
    log::info!("CONNECTION");

    // Open DB in tmp storage
    let path = "/tmp/users2.sqlite";
    // Create connection
    let connection = marine_sqlite_connector::open(path).unwrap();
    // get stored keys
    let cursor = connection.prepare("SELECT * FROM keys").unwrap().cursor();
    // debug print count of keys
    log::info!("table size is: {:?}", cursor.count());

    true
}