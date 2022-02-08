use marine_rs_sdk::marine;
use marine_rs_sdk::module_manifest;
use marine_rs_sdk::WasmLoggerBuilder;

module_manifest!();

pub fn main() {
    WasmLoggerBuilder::new().build().unwrap();
}

#[marine]
pub fn store_private_key(private_key: String, password: String) -> bool {
    log::info!("put called with {} {}\n", private_key, password);
    // get the public key.
    // use public key as index.
    true
}

#[marine]
pub fn get_private_key(public_key: String, password: String) -> String {
    log::info!("get called with {} {}\n", public_key, password);
    // decode the private key.
    // return it to the caller.
    "".to_string()
}
