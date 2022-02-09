use marine_rs_sdk::marine;
use marine_rs_sdk::module_manifest;
use marine_rs_sdk::WasmLoggerBuilder;

use marine_sqlite_connector::Value;

const SQLITE_DB_PATH: &str = "./db.sqlite";
const SQLITE_TABLE_NAME: &str = "keys";

module_manifest!();

pub fn main() {
    WasmLoggerBuilder::new().build().expect("Error init logger");
}

#[marine]
pub fn init_db() -> bool {
    // Open DB in tmp storage
    let path = SQLITE_DB_PATH;
    // Connect
    let connection =
        marine_sqlite_connector::Connection::open(path).expect("Error opening database");
    // Create table
    connection.execute(
        format!("CREATE TABLE IF NOT EXISTS {} (public_key VARCHAR(255) PRIMARY KEY, private_key VARCHAR(255), password VARCHAR(255))", SQLITE_TABLE_NAME).as_str(),
    ).expect("Error creating table");
    true
}

#[marine]
pub fn store_private_key(public_key: String, private_key: String, password: String) -> bool {
    // Log
    log::info!("put called with {}\n", public_key);
    // Open DB in tmp storage
    let path = SQLITE_DB_PATH;
    let connection =
        marine_sqlite_connector::Connection::open(path).expect("Error opening database");
    // get stored keys
    let mut cursor = connection
        .prepare(format!("SELECT * FROM {} WHERE public_key=?", SQLITE_TABLE_NAME).as_str())
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
        // Create table if needed and insert keys
        connection
            .execute(
                format!(
                    "INSERT INTO {} (public_key, private_key, password) VALUES ('{}', '{}', '{}');",
                    SQLITE_TABLE_NAME, public_key, private_key, password
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
    let path = SQLITE_DB_PATH;
    // Create connection
    let connection =
        marine_sqlite_connector::Connection::open(path).expect("Error opening database");
    // get stored keys
    let mut cursor = connection
        .prepare(format!("SELECT * FROM {} WHERE public_key=?", SQLITE_TABLE_NAME).as_str())
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
    let path = SQLITE_DB_PATH;
    // Create connection
    let connection = marine_sqlite_connector::open(path).expect("Error opening database");
    // get stored keys
    let cursor = connection
        .prepare(format!("SELECT * FROM {}", SQLITE_TABLE_NAME).as_str())
        .expect("Error getting table")
        .cursor();
    // debug print count of keys
    log::info!("table size is: {:?}", cursor.count());
    true
}
