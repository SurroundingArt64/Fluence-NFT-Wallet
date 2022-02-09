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
    let path = "/tmp/users.sqlite";
    // Create connection
    let mut connection = marine_sqlite_connector::Connection::open(path).unwrap();

    // Create table if needed and insert keys
    connection.execute(
        format!("
        CREATE TABLE IF NOT EXISTS keys (public_key TEXT PRIMARY KEY, private_key TEXT, password TEXT);
        INSERT INTO keys (public_key, private_key, password) VALUES ({}, {}, {});
        ", public_key, private_key, password).as_str(),
    ).unwrap();

    // reconnect
    connection = marine_sqlite_connector::Connection::open(path).unwrap();
    // get stored keys
    let cursor = connection.prepare("SELECT * FROM keys").unwrap().cursor();
    // debug print count of keys
    log::info!("table size is: {:?}", cursor.count());
    true
}

#[marine]
pub fn get_private_key(public_key: String, _password: String) -> String {
    log::info!("get called with {}\n", public_key);
    let path = "/tmp/users.sqlite";
    let connection = marine_sqlite_connector::Connection::open(path).unwrap();
    let mut cursor = connection
        .prepare("SELECT * FROM keys WHERE public_key=?")
        .unwrap()
        .cursor();
    cursor.bind(&[Value::String(public_key)]).unwrap();
    let mut private_key: String = "Not Found".to_string();
    while let Some(row) = cursor.next().unwrap() {
        private_key = row[1].as_string().expect("error on row[0] parsing").into();
    }
    private_key
}

#[marine]
pub fn testing_key() -> bool {
    log::info!("CONNECTION");

    let path = "/tmp/users.sqlite";
    let connection = marine_sqlite_connector::open(path).unwrap();
    let cursor = connection.prepare("SELECT * FROM keys").unwrap().cursor();
    log::info!("table size is: {:?}", cursor.count());

    true
}
