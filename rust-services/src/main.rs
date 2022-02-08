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
    true
}
