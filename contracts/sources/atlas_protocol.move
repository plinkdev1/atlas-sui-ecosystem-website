module atlas_protocol::payments {
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use sui::table::{Self, Table};
    use std::string::{Self, String};
    use std::vector;

    // ====== CONSTANTS ======
    const ATLAS_FEE_PERCENT: u64 = 20; // 20% goes to Atlas
    const PROVIDER_FEE_PERCENT: u64 = 80; // 80% goes to Provider
    const E_INVALID_AMOUNT: u64 = 1;
    const E_INVALID_TIER: u64 = 2;
    const E_UNAUTHORIZED: u64 = 3;
    const E_INSUFFICIENT_BALANCE: u64 = 4;

    // ====== EVENTS ======
    public struct PurchaseEvent has copy, drop {
        buyer: address,
        provider: address,
        tier: String,
        amount: u64,
        timestamp: u64,
    }

    public struct RefundEvent has copy, drop {
        buyer: address,
        amount: u64,
        reason: String,
        timestamp: u64,
    }

    public struct FeeSplitEvent has copy, drop {
        atlas_share: u64,
        provider_share: u64,
        timestamp: u64,
    }

    // ====== TIER DEFINITIONS ======
    public struct Tier has store, copy, drop {
        name: String,
        monthly_price: u64,
        requests_per_month: u64,
    }

    // ====== ENTITLEMENT NFT ======
    public struct Entitlement has key, store {
        id: UID,
        provider: address,
        buyer: address,
        tier_name: String,
        monthly_quota: u64,
        purchase_date: u64,
        expires_at: u64,
        active: bool,
    }

    // ====== TREASURY ======
    public struct Treasury has key {
        id: UID,
        owner: address,
        atlas_balance: Balance<sui::sui::SUI>,
        total_revenue: u64,
    }

    // ====== PROVIDER REGISTRY ======
    public struct ProviderRegistry has key {
        id: UID,
        providers: Table<address, ProviderInfo>,
    }

    public struct ProviderInfo has store {
        name: String,
        verified: bool,
        total_revenue: u64,
        entitlements_sold: u64,
    }

    // ====== INITIALIZATION ======
    fun init(ctx: &mut TxContext) {
        let treasury = Treasury {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            atlas_balance: balance::zero(),
            total_revenue: 0,
        };

        let registry = ProviderRegistry {
            id: object::new(ctx),
            providers: table::new(ctx),
        };

        transfer::share_object(treasury);
        transfer::share_object(registry);
    }

    // ====== TIER MANAGEMENT ======
    public fun get_starter_tier(): Tier {
        Tier {
            name: string::utf8(b"Starter"),
            monthly_price: 99_000_000_000, // 99 SUI in MIST
            requests_per_month: 1_000_000,
        }
    }

    public fun get_growth_tier(): Tier {
        Tier {
            name: string::utf8(b"Growth"),
            monthly_price: 299_000_000_000, // 299 SUI in MIST
            requests_per_month: 5_000_000,
        }
    }

    public fun get_pro_tier(): Tier {
        Tier {
            name: string::utf8(b"Pro"),
            monthly_price: 799_000_000_000, // 799 SUI in MIST
            requests_per_month: 10_000_000,
        }
    }

    // ====== PURCHASE FUNCTION ======
    public fun purchase_tier(
        tier: Tier,
        provider: address,
        payment: Coin<sui::sui::SUI>,
        registry: &mut ProviderRegistry,
        treasury: &mut Treasury,
        ctx: &mut TxContext,
    ): Entitlement {
        let amount = coin::value(&payment);
        assert!(amount == tier.monthly_price, E_INVALID_AMOUNT);
        assert!(table::contains(&registry.providers, provider), E_INVALID_TIER);

        let buyer = tx_context::sender(ctx);
        let timestamp = tx_context::epoch(ctx);
        
        // Calculate fee split
        let atlas_fee = (amount * ATLAS_FEE_PERCENT) / 100;
        let provider_fee = (amount * PROVIDER_FEE_PERCENT) / 100;

        // Split the coin
        let (atlas_coin, provider_coin) = coin::split<sui::sui::SUI>(
            &mut payment,
            atlas_fee,
            ctx
        );

        // Add atlas fee to treasury
        balance::join(&mut treasury.atlas_balance, coin::into_balance(atlas_coin));
        treasury.total_revenue = treasury.total_revenue + amount;

        // Send provider fee to provider
        transfer::public_transfer(provider_coin, provider);

        // Destroy remaining coin
        coin::burn_for_testing(payment);

        // Emit purchase event
        event::emit(PurchaseEvent {
            buyer,
            provider,
            tier: tier.name,
            amount,
            timestamp,
        });

        // Emit fee split event
        event::emit(FeeSplitEvent {
            atlas_share: atlas_fee,
            provider_share: provider_fee,
            timestamp,
        });

        // Create entitlement NFT
        let expires_at = timestamp + 30 * 24 * 60 * 60; // 30 days from now
        
        Entitlement {
            id: object::new(ctx),
            provider,
            buyer,
            tier_name: tier.name,
            monthly_quota: tier.requests_per_month,
            purchase_date: timestamp,
            expires_at,
            active: true,
        }
    }

    // ====== ENTITLEMENT MANAGEMENT ======
    public fun renew_entitlement(
        entitlement: &mut Entitlement,
        tier: Tier,
        payment: Coin<sui::sui::SUI>,
        registry: &mut ProviderRegistry,
        treasury: &mut Treasury,
        ctx: &mut TxContext,
    ) {
        let amount = coin::value(&payment);
        assert!(amount == tier.monthly_price, E_INVALID_AMOUNT);

        let timestamp = tx_context::epoch(ctx);

        // Calculate fee split
        let atlas_fee = (amount * ATLAS_FEE_PERCENT) / 100;
        let provider_fee = (amount * PROVIDER_FEE_PERCENT) / 100;

        // Split the coin
        let (atlas_coin, provider_coin) = coin::split<sui::sui::SUI>(
            &mut payment,
            atlas_fee,
            ctx
        );

        // Add to treasury
        balance::join(&mut treasury.atlas_balance, coin::into_balance(atlas_coin));
        treasury.total_revenue = treasury.total_revenue + amount;

        // Send to provider
        transfer::public_transfer(provider_coin, entitlement.provider);

        // Destroy remaining
        coin::burn_for_testing(payment);

        // Update entitlement
        entitlement.expires_at = timestamp + 30 * 24 * 60 * 60;
        entitlement.active = true;

        event::emit(PurchaseEvent {
            buyer: entitlement.buyer,
            provider: entitlement.provider,
            tier: tier.name,
            amount,
            timestamp,
        });
    }

    public fun cancel_entitlement(entitlement: &mut Entitlement) {
        entitlement.active = false;
    }

    public fun check_entitlement_active(entitlement: &Entitlement, current_epoch: u64): bool {
        entitlement.active && current_epoch < entitlement.expires_at
    }

    // ====== PROVIDER MANAGEMENT ======
    public fun register_provider(
        registry: &mut ProviderRegistry,
        name: String,
        ctx: &mut TxContext,
    ) {
        let provider_address = tx_context::sender(ctx);
        
        let provider_info = ProviderInfo {
            name,
            verified: false,
            total_revenue: 0,
            entitlements_sold: 0,
        };

        table::add(&mut registry.providers, provider_address, provider_info);
    }

    public fun verify_provider(
        registry: &mut ProviderRegistry,
        provider: address,
        treasury: &Treasury,
        ctx: &mut TxContext,
    ) {
        assert!(treasury.owner == tx_context::sender(ctx), E_UNAUTHORIZED);
        
        let provider_info = table::borrow_mut(&mut registry.providers, provider);
        provider_info.verified = true;
    }

    // ====== TREASURY FUNCTIONS ======
    public fun withdraw_atlas_fees(
        treasury: &mut Treasury,
        amount: u64,
        ctx: &mut TxContext,
    ): Coin<sui::sui::SUI> {
        assert!(treasury.owner == tx_context::sender(ctx), E_UNAUTHORIZED);
        assert!(balance::value(&treasury.atlas_balance) >= amount, E_INSUFFICIENT_BALANCE);

        let balance = balance::split(&mut treasury.atlas_balance, amount);
        coin::from_balance(balance, ctx)
    }

    public fun get_atlas_balance(treasury: &Treasury): u64 {
        balance::value(&treasury.atlas_balance)
    }

    public fun get_total_revenue(treasury: &Treasury): u64 {
        treasury.total_revenue
    }

    // ====== QUERY FUNCTIONS ======
    public fun get_entitlement_details(entitlement: &Entitlement): (address, address, String, u64, u64, bool) {
        (
            entitlement.provider,
            entitlement.buyer,
            entitlement.tier_name,
            entitlement.expires_at,
            entitlement.monthly_quota,
            entitlement.active,
        )
    }

    public fun get_provider_count(registry: &ProviderRegistry): u64 {
        table::length(&registry.providers)
    }
}
