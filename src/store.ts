/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuctionListing, UserProfile, Notification, UserRole, UserStatus, AuctionStatus, SystemSettings } from "./types";
import { auctionService, profileService, notificationService } from "./services/supabaseService";
import { MOCK_AUCTIONS } from "./constants";
import { supabase } from "./services/supabase";

// Initial state
const INITIAL_USER: UserProfile | null = null;

const INITIAL_SETTINGS: SystemSettings = {
  categories: ["Real Estate", "Vehicle", "Machinery", "Financial Asset", "Other"],
  currencies: ["NPR", "USD", "INR"],
  timeZones: ["Asia/Kathmandu", "UTC", "Asia/Kolkata"],
  notificationTemplates: {
    "outbid": "You have been outbid on {auctionTitle}. Current bid is {currency} {amount}.",
    "won": "Congratulations! You won the auction for {auctionTitle}.",
    "new_listing": "A new {assetType} has been listed: {auctionTitle}."
  }
};

const INITIAL_NOTIFICATIONS: Notification[] = [];

const INITIAL_USER_BIDS: Record<string, number> = {};

class Store {
  private auctions: AuctionListing[] = [];
  private user: UserProfile | null = null;
  private notifications: Notification[] = [];
  private userBids: Record<string, number> = {}; // auctionId -> maxBid
  private bidHistory: any[] = []; // Full bid history
  private auditLogs: { id: string; action: string; details: string; timestamp: string }[] = [];
  private users: UserProfile[] = [INITIAL_USER];
  private settings: SystemSettings = INITIAL_SETTINGS;

  constructor() {
    this.loadFromStorage();
    this.init();
    this.setupAuthListener();
  }

  private setupAuthListener() {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        try {
          // Get profile from our profiles table
          const profile = await profileService.getProfile(session.user.id);
          if (profile) {
            this.user = profile;
          } else {
            // Create profile if it doesn't exist (e.g. first time Google login)
            const newProfile: UserProfile = {
              uid: session.user.id,
              email: session.user.email || "",
              displayName: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || "User",
              photoURL: session.user.user_metadata.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`,
              role: UserRole.BUYER, // Default role
              status: UserStatus.ACTIVE,
              createdAt: new Date().toISOString(),
            };
            await profileService.upsertProfile(newProfile);
            this.user = newProfile;
          }
          this.saveUser();
          this.init(); // Refresh data for the logged in user
        } catch (error) {
          console.error("Error setting up user profile:", error);
        }
      } else if (event === 'SIGNED_OUT') {
        this.user = null;
        this.saveUser();
      }
      window.dispatchEvent(new CustomEvent('store-updated'));
    });
  }

  async init() {
    try {
      const auctions = await auctionService.getAllAuctions();
      this.auctions = auctions;
      this.saveAuctions();
      
      if (this.user) {
        const notifications = await notificationService.getNotifications(this.user.uid);
        this.notifications = notifications;
        this.saveNotifications();

        // Fetch user's bids
        const { data: bids, error: bidsError } = await supabase
          .from('bids')
          .select('auction_id, amount')
          .eq('bidder_id', this.user.uid);
        
        if (!bidsError && bids) {
          const userBids: Record<string, number> = {};
          bids.forEach(b => {
            // Only keep the highest bid for each auction
            if (!userBids[b.auction_id] || b.amount > userBids[b.auction_id]) {
              userBids[b.auction_id] = b.amount;
            }
          });
          this.userBids = userBids;
          this.saveUserBids();
        }

        // Fetch full bid history
        const history = await auctionService.getBidsByUserId(this.user.uid);
        this.bidHistory = history;
        this.saveBidHistory();
      }
      
      const users = await profileService.getAllProfiles();
      this.users = users;
      this.saveUsers();

      // Trigger a re-render if needed (using a simple event emitter or just relying on the fact that most components will call getAuctions)
      window.dispatchEvent(new CustomEvent('store-updated'));
    } catch (error) {
      console.error("Failed to initialize store from Supabase:", error);
    }
  }

  private loadFromStorage() {
    const savedAuctions = localStorage.getItem("bidzone_auctions");
    const savedUser = localStorage.getItem("bidzone_user");
    const savedNotifications = localStorage.getItem("bidzone_notifications");
    const savedUserBids = localStorage.getItem("bidzone_user_bids");
    const savedBidHistory = localStorage.getItem("bidzone_bid_history");

    this.auctions = savedAuctions ? JSON.parse(savedAuctions) : [];
    this.user = savedUser ? JSON.parse(savedUser) : null;
    this.notifications = savedNotifications ? JSON.parse(savedNotifications) : [];
    this.userBids = savedUserBids ? JSON.parse(savedUserBids) : {};
    this.bidHistory = savedBidHistory ? JSON.parse(savedBidHistory) : [];
    this.auditLogs = JSON.parse(localStorage.getItem("bidzone_audit_logs") || "[]");
    this.users = JSON.parse(localStorage.getItem("bidzone_users") || "[]");
    this.settings = JSON.parse(localStorage.getItem("bidzone_settings") || JSON.stringify(INITIAL_SETTINGS));
  }

  private saveAuctions() {
    localStorage.setItem("bidzone_auctions", JSON.stringify(this.auctions));
  }

  private saveUser() {
    localStorage.setItem("bidzone_user", JSON.stringify(this.user));
  }

  private saveNotifications() {
    localStorage.setItem("bidzone_notifications", JSON.stringify(this.notifications));
  }

  private saveUserBids() {
    localStorage.setItem("bidzone_user_bids", JSON.stringify(this.userBids));
  }

  private saveBidHistory() {
    localStorage.setItem("bidzone_bid_history", JSON.stringify(this.bidHistory));
  }

  private saveAuditLogs() {
    localStorage.setItem("bidzone_audit_logs", JSON.stringify(this.auditLogs));
  }

  private saveUsers() {
    localStorage.setItem("bidzone_users", JSON.stringify(this.users));
  }

  private saveSettings() {
    localStorage.setItem("bidzone_settings", JSON.stringify(this.settings));
  }

  // Auction Methods
  async getAuctions() {
    if (this.auctions.length === 0) {
      this.auctions = await auctionService.getAllAuctions();
      this.saveAuctions();
    }
    return this.auctions;
  }

  getAuctionById(id: string) {
    return this.auctions.find(a => a.id === id);
  }

  async placeBid(auctionId: string, amount: number) {
    if (!this.user) return { success: false, message: "Must be logged in to bid" };

    const auction = this.auctions.find(a => a.id === auctionId);
    if (!auction) return { success: false, message: "Auction not found" };
    
    if (amount <= auction.currentBid) {
      return { success: false, message: "Bid must be higher than current bid" };
    }

    try {
      await auctionService.placeBid(auctionId, this.user.uid, this.user.displayName, amount);
      
      // Update local state
      auction.currentBid = amount;
      auction.bidCount += 1;
      this.saveAuctions();

      // Update user bids
      this.userBids[auctionId] = amount;
      this.saveUserBids();

      // Add notification locally (Supabase could handle this via triggers too)
      this.addNotification({
        title: "Bid Placed Successfully",
        message: `Your bid of NPR ${amount.toLocaleString()} for "${auction.title}" has been placed.`,
        type: "won",
      });

      return { success: true };
    } catch (error) {
      console.error("Failed to place bid:", error);
      return { success: false, message: "Failed to place bid on server" };
    }
  }

  async createAuction(data: Omit<AuctionListing, "id" | "bidCount" | "currentBid" | "createdAt">) {
    try {
      const newAuction = await auctionService.createAuction(data);
      this.auctions = [newAuction, ...this.auctions];
      this.saveAuctions();
      this.addAuditLog("Auction Created", `New auction "${newAuction.title}" created by ${newAuction.institutionName}`);
      return newAuction;
    } catch (error) {
      console.error("Failed to create auction:", error);
      throw error;
    }
  }

  async moderateAuction(id: string, status: AuctionStatus) {
    const auction = this.auctions.find(a => a.id === id);
    if (auction) {
      try {
        await auctionService.updateAuctionStatus(id, status);
        auction.status = status;
        this.saveAuctions();
        this.addAuditLog("Auction Moderated", `Auction "${auction.title}" status updated to ${status}`);
        window.dispatchEvent(new CustomEvent('store-updated'));
      } catch (error) {
        console.error("Failed to moderate auction:", error);
      }
    }
  }

  // User Methods
  getUser() {
    return this.user;
  }

  async login(email: string, role: UserRole = UserRole.BUYER) {
    // In a real app, we'd use Supabase Auth
    // For this demo, we'll find or create a profile
    try {
      const profiles = await profileService.getAllProfiles();
      let profile = profiles.find(p => p.email === email);
      
      if (!profile) {
        // Create profile if not exists
        const { data, error } = await (supabase as any)
          .from('profiles')
          .insert([{
            email,
            display_name: email.split('@')[0],
            role,
            status: 'Active'
          }])
          .select()
          .single();
        
        if (error) throw error;
        profile = {
          uid: data.id,
          email: data.email,
          displayName: data.display_name,
          role: data.role as UserRole,
          status: data.status as UserStatus,
          createdAt: data.created_at
        };
      }
      
      this.user = profile;
      this.saveUser();
      window.dispatchEvent(new CustomEvent('store-updated'));
      return profile;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  signup(data: Partial<UserProfile>) {
    const user: UserProfile = {
      uid: Math.random().toString(36).substr(2, 9),
      displayName: data.displayName || "New User",
      email: data.email || "new@example.com",
      role: data.role || UserRole.BUYER,
      status: UserStatus.ACTIVE,
      createdAt: new Date().toISOString(),
      ...data,
    };
    this.user = user;
    this.saveUser();
    window.dispatchEvent(new CustomEvent('store-updated'));
    return user;
  }

  updateUser(data: Partial<UserProfile>) {
    if (this.user) {
      this.user = { ...this.user, ...data };
      this.saveUser();
      
      // Update in users list too
      const idx = this.users.findIndex(u => u.uid === this.user?.uid);
      if (idx !== -1) {
        this.users[idx] = { ...this.users[idx], ...data };
        this.saveUsers();
      }
    }
  }

  getUsers() {
    return this.users;
  }

  searchUsers(query: string) {
    const q = query.toLowerCase();
    return this.users.filter(u => 
      u.displayName.toLowerCase().includes(q) || 
      u.email.toLowerCase().includes(q) ||
      (u.institutionName && u.institutionName.toLowerCase().includes(q))
    );
  }

  async updateUserStatus(uid: string, status: UserStatus) {
    const user = this.users.find(u => u.uid === uid);
    if (user) {
      try {
        const oldStatus = user.status;
        await profileService.updateProfile(uid, { status });
        user.status = status;
        this.saveUsers();
        this.addAuditLog("User Status Updated", `User ${user.displayName} status changed from ${oldStatus} to ${status}`);
        
        // If it's the current user, update them too
        if (this.user?.uid === uid) {
          this.user.status = status;
          this.saveUser();
        }
        window.dispatchEvent(new CustomEvent('store-updated'));
      } catch (error) {
        console.error("Failed to update user status:", error);
      }
    }
  }

  getUserBids() {
    return this.userBids;
  }

  getBidHistory() {
    return this.bidHistory;
  }

  // Audit Logs
  getAuditLogs() {
    return this.auditLogs;
  }

  addAuditLog(action: string, details: string) {
    const log = {
      id: Math.random().toString(36).substr(2, 9),
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs = [log, ...this.auditLogs];
    this.saveAuditLogs();
  }

  // Notification Methods
  getNotifications() {
    return this.notifications;
  }

  addNotification(data: Omit<Notification, "id" | "createdAt" | "read" | "userId">) {
    const newNotification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId: this.user?.uid || "anon",
      createdAt: new Date().toISOString(),
      read: false,
      ...data,
    };
    this.notifications = [newNotification, ...this.notifications];
    this.saveNotifications();
    return newNotification;
  }

  markNotificationAsRead(id: string) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
    }
  }

  // Settings Methods
  getSettings() {
    return this.settings;
  }

  updateSettings(data: Partial<SystemSettings>) {
    this.settings = { ...this.settings, ...data };
    this.saveSettings();
    this.addAuditLog("Settings Updated", "System configuration modified");
  }

  // Stats
  getStats() {
    const activeBids = Object.keys(this.userBids).length;
    const wonAuctions = this.auctions.filter(a => 
      a.status === "Closed" && this.userBids[a.id] === a.currentBid
    ).length;
    const totalSpent = Object.values(this.userBids).reduce((acc, val) => acc + val, 0);

    return {
      activeBids,
      wonAuctions,
      totalSpent,
      notificationsCount: this.notifications.filter(n => !n.read).length,
    };
  }

  async logout() {
    await supabase.auth.signOut();
    this.user = null;
    this.saveUser();
    window.dispatchEvent(new CustomEvent('store-updated'));
  }

  async deleteAuction(id: string) {
    try {
      await auctionService.deleteAuction(id);
      this.auctions = this.auctions.filter(a => a.id !== id);
      this.saveAuctions();
      this.addAuditLog("Auction Deleted", `Auction ID ${id} deleted`);
      window.dispatchEvent(new CustomEvent('store-updated'));
    } catch (error) {
      console.error("Failed to delete auction:", error);
    }
  }

  async likeAuction(auctionId: string) {
    if (!this.user) return false;
    try {
      const isLiked = await auctionService.likeAuction(auctionId, this.user.uid);
      const auction = this.auctions.find(a => a.id === auctionId);
      if (auction) {
        auction.likesCount = (auction.likesCount || 0) + (isLiked ? 1 : -1);
        this.saveAuctions();
        window.dispatchEvent(new CustomEvent('store-updated'));
      }
      return isLiked;
    } catch (error) {
      console.error("Failed to like auction:", error);
      return false;
    }
  }

  async checkIfLiked(auctionId: string) {
    if (!this.user) return false;
    try {
      return await auctionService.checkIfLiked(auctionId, this.user.uid);
    } catch (error) {
      console.error("Failed to check if liked:", error);
      return false;
    }
  }

  async shareAuction(auctionId: string) {
    try {
      await auctionService.shareAuction(auctionId);
      const auction = this.auctions.find(a => a.id === auctionId);
      if (auction) {
        auction.sharesCount = (auction.sharesCount || 0) + 1;
        this.saveAuctions();
        window.dispatchEvent(new CustomEvent('store-updated'));
      }
    } catch (error) {
      console.error("Failed to share auction:", error);
    }
  }
}

export const store = new Store();
