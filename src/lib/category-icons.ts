import {
  Utensils,
  ShoppingBag,
  Car,
  Zap,
  Film,
  Home,
  Activity,
  Coins,
  HelpCircle,
  LucideIcon,
} from "lucide-react";

export const getCategoryIcon = (categoryName: string): LucideIcon => {
  const n = categoryName?.toLowerCase() || "";
  if (n.includes("groceries")) return ShoppingBag;
  if (n.includes("dining") || n.includes("restaurant")) return Utensils;
  if (n.includes("transportation")) return Car;
  if (n.includes("utilities")) return Zap;
  if (n.includes("entertainment")) return Film;
  if (n.includes("shopping")) return ShoppingBag;
  if (n.includes("housing") || n.includes("rent")) return Home;
  if (n.includes("healthcare")) return Activity;
  if (n.includes("travel")) return Car;
  if (n.includes("investments") || n.includes("income")) return Coins;
  return HelpCircle;
};
