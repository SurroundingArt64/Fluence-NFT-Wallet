use marine_rs_sdk::marine;
use marine_rs_sdk::module_manifest;
use marine_rs_sdk::WasmLoggerBuilder;

use marine_sqlite_connector::Value;

module_manifest!();

pub fn main() {
    WasmLoggerBuilder::new().build().expect("Error init logger");
}

#[marine]
pub fn store_private_key(public_key: String, private_key: String, password: String) -> bool {
    log::info!("put called with {}\n", public_key);
    // Open DB in tmp storage
    let path = "/tmp/users2.sqlite";
    let mut connection =
        marine_sqlite_connector::Connection::open(path).expect("Error opening database");
    // get stored keys
    let mut cursor = connection
        .prepare("
            CREATE TABLE IF NOT EXISTS keys (public_key TEXT PRIMARY KEY, private_key TEXT, password TEXT);
            SELECT * FROM keys WHERE public_key=?;
        ")
        .expect("Error getting table")
        .cursor();
    // bind public key to cursor
    cursor
        .bind(&[Value::String(public_key.clone())])
        .expect("Error binding");
    // result init
    let mut pk: Option<String> = None;
    // get first row
    while let Some(row) = cursor.next().expect("Error executing query") {
        pk = Some(row[1].as_string().expect("error on row[1] parsing").into());
    }
    if pk.is_none() {
        // Create connection
        connection =
            marine_sqlite_connector::Connection::open(path).expect("Error opening database");
        // Create table if needed and insert keys
        connection
            .execute(
                format!(
                    "
        INSERT INTO keys (public_key, private_key, password) VALUES ({}, {}, {});
        ",
                    public_key, private_key, password
                )
                .as_str(),
            )
            .expect("Error inserting data");
        true
    } else {
        false
    }
}

#[marine]
pub fn get_private_key(public_key: String, _password: String) -> String {
    log::info!("get called with {}\n", public_key);
    // Open DB in tmp storage
    let path = "/tmp/users2.sqlite";
    // Create connection
    let connection =
        marine_sqlite_connector::Connection::open(path).expect("Error opening database");
    // get stored keys
    let mut cursor = connection
        .prepare("SELECT * FROM keys WHERE public_key=?")
        .expect("Error getting table")
        .cursor();
    // bind public key to cursor
    cursor
        .bind(&[Value::String(public_key)])
        .expect("Error binding");
    // result init
    let mut private_key: String = "Not Found".to_string();
    // get first row
    while let Some(row) = cursor.next().expect("Error executing query") {
        private_key = row[1].as_string().expect("error on row[1] parsing").into();
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
    let connection = marine_sqlite_connector::open(path).expect("Error opening database");
    // get stored keys
    let cursor = connection
        .prepare("SELECT * FROM keys")
        .expect("Error getting table")
        .cursor();
    // debug print count of keys
    log::info!("table size is: {:?}", cursor.count());
    true
}
