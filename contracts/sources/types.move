module atlas_protocol::types {
    use std::string::String;

    // Admin capability for authorization
    public struct AdminCap has key, store {
        id: sui::object::UID,
    }

    // Payment record for tracking
    public struct PaymentRecord has key, store {
        id: sui::object::UID,
        buyer: address,
        provider: address,
        amount: u64,
        timestamp: u64,
        tx_hash: String,
    }

    // Provider tier offering
    public struct ProviderTier has key, store {
        id: sui::object::UID,
        provider: address,
        name: String,
        price: u64,
        quota: u64,
        active: bool,
    }
}
