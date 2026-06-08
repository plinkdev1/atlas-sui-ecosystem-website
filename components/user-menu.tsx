"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUnifiedWallet } from "@/lib/unified-wallet-context"
import { LayoutDashboard, LogOut, Settings, Wallet } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { WalletConnectionModal } from "./wallet-connection-modal"

export function UserMenu() {
    const { address, connected, isAuthenticated, disconnect, isAuthenticating, login } = useUnifiedWallet()
    const [showConnectModal, setShowConnectModal] = useState(false)
    const router = useRouter()

    if (!connected) {
        return (
            <>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowConnectModal(true)}
                    className="glass-button"
                >
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect
                </Button>
                <WalletConnectionModal isOpen={showConnectModal} onClose={() => setShowConnectModal(false)} />
            </>
        )
    }

    if (connected && !isAuthenticated) {
        return (
            <Button
                variant="default"
                size="sm"
                onClick={login}
                disabled={isAuthenticating}
                className="btn-brand-gradient"
            >
                {isAuthenticating ? "Verifying..." : "Sign to Verify"}
            </Button>
        )
    }

    const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9 border border-primary/20">
                        <AvatarImage src="" alt="User" />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {address?.slice(2, 4).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 glass-panel border-primary/20" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">My Wallet</p>
                        <p className="text-xs leading-none text-muted-foreground truncate">
                            {shortAddress}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-primary/10" />
                <DropdownMenuItem onClick={() => router.push("/settings")} className="cursor-pointer hover:bg-primary/10">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/provider-dashboard")} className="cursor-pointer hover:bg-primary/10">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Provider Dashboard</span>
                </DropdownMenuItem>
                {/* Admin only link could be added here if we had is_admin in context */}
                <DropdownMenuSeparator className="bg-primary/10" />
                <DropdownMenuItem onClick={disconnect} className="cursor-pointer text-destructive focus:text-destructive hover:bg-destructive/10">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Disconnect</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
