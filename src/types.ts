/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum AssetType {
  REAL_ESTATE = "Real Estate",
  VEHICLE = "Vehicle",
  MACHINERY = "Machinery",
  FINANCIAL_ASSET = "Financial Asset",
  OTHER = "Other",
}

export enum AuctionStatus {
  PENDING = "Pending",
  ACTIVE = "Active",
  CLOSED = "Closed",
  CANCELLED = "Cancelled",
}

export enum UserRole {
  BUYER = "Buyer",
  INSTITUTION = "Institution",
  ADMIN = "Admin",
}

export enum UserStatus {
  ACTIVE = "Active",
  SUSPENDED = "Suspended",
  PENDING = "Pending",
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: UserStatus;
  institutionName?: string;
  phoneNumber?: string;
  photoURL?: string;
  isVerified?: boolean;
  createdAt: string;
}

export interface AuctionListing {
  id: string;
  title: string;
  description: string;
  assetType: AssetType;
  basePrice: number;
  reservePrice: number;
  currentBid: number;
  bidCount: number;
  startTime: string;
  endTime: string;
  status: AuctionStatus;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  institutionId: string;
  institutionName: string;
  images: string[];
  documents: { name: string; url: string }[];
  likesCount?: number;
  sharesCount?: number;
  createdAt: string;
}

export interface Bid {
  id: string;
  auctionId: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "outbid" | "ending_soon" | "won" | "new_listing";
  auctionId?: string;
  read: boolean;
  createdAt: string;
}

export interface SystemSettings {
  categories: string[];
  currencies: string[];
  timeZones: string[];
  notificationTemplates: Record<string, string>;
}
