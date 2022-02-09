use marine_rs_sdk::marine;
use marine_rs_sdk::module_manifest;
use marine_rs_sdk::WasmLoggerBuilder;

use marine_sqlite_connector::Value;

#[macro_use]
extern crate magic_crypt;
extern crate base64;

use std::io::Cursor;

use magic_crypt::generic_array::typenum::U256;
use magic_crypt::MagicCryptTrait;

module_manifest!();

pub fn main() {
    WasmLoggerBuilder::new().build().expect("Error init logger");
}

pub fn encrypt(plaintext: String, seed: String) -> String {
    let mc = new_magic_crypt!(seed, 256);

    let mut reader = Cursor::new(plaintext);
    let mut writer = Vec::new();

    mc.encrypt_reader_to_writer2::<U256>(&mut reader, &mut writer)
        .unwrap();

    let base64 = base64::encode(&writer);

    base64
}

pub fn decrypt(hashed: String, seed: String) -> String {
    let mc = new_magic_crypt!(seed, 256);

    mc.decrypt_base64_to_string(hashed)
        .unwrap_or_else(|_| "".to_string())
}

#[marine]
pub fn init_db(db_name: String) -> bool {
    // Open DB in tmp storage
    let path = format!("/tmp/{}.sqlite", db_name);
    let connection =
        marine_sqlite_connector::Connection::open(path).expect("Error opening database");
    connection.execute(
        "CREATE TABLE IF NOT EXISTS keys ('public_key' VARCHAR(255) PRIMARY KEY, 'private_key' VARCHAR(255));",
    ).expect("Error creating table");
    true
}

#[marine]
pub fn store_private_key(
    db_name: String,
    public_key: String,
    private_key: String,
    password: String,
) -> bool {
    log::info!("put called with {}\n", public_key);
    // Open DB in tmp storage
    let path = format!("/tmp/{}.sqlite", db_name);
    let connection =
        marine_sqlite_connector::Connection::open(path).expect("Error opening database");

    connection.execute(
        "CREATE TABLE IF NOT EXISTS keys ('public_key' VARCHAR(255) PRIMARY KEY,private_key 'VARCHAR'(255));",
    ).expect("Error creating table");
    // get stored keys
    let mut cursor = connection
        .prepare("SELECT * FROM keys WHERE public_key=?")
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
                    "INSERT INTO keys (public_key, private_key) VALUES ('{}', '{}');",
                    public_key,
                    encrypt(private_key, password)
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
pub fn get_private_key(db_name: String, public_key: String, password: String) -> String {
    log::info!("get called with {}\n", public_key);
    // Open DB in tmp storage
    let path = format!("/tmp/{}.sqlite", db_name);
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
    decrypt(private_key, password).to_string()
}

#[marine]
pub fn testing_key(db_name: String) -> bool {
    log::info!("CONNECTION");

    // Open DB in tmp storage
    let path = format!("/tmp/{}.sqlite", db_name);
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
