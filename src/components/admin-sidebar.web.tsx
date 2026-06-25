import { useState } from "react";
import {
  Modal,
  Pressable,
  Text,
  useWindowDimensions,
  View
} from "react-native";
 
const BREAKPOINT = 768;

type nav_item = {
  label: string;
  route: string;
};
 
const NAV_ITEMS: nav_item[] = [
  { label: "Dashboard", route: "/dashboard" },
  { label: "Routes",     route: "/routes"     },
  { label: "Operators",   route: "/operators"   }
];

type SidebarProps = {
  activeRoute: string;
  onNavigate: (route: string) => void;
};
 
function SidebarContent({ activeRoute, onNavigate }: SidebarProps) {
  return (
    <View className="flex-1">
      {NAV_ITEMS.map((item) => {
        const isActive = activeRoute === item.route;
        return (
          <Pressable
            key={item.route}
            onPress={() => onNavigate(item.route)}
            className={`px-4 py-4 mb-1 ${
              isActive ? "bg-[#21AAE5]" : ""
            }`}
          >
            <Text
              className={`font-bold ${
                isActive ? "text-white" : "text-[#233329]"

              }`}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

type HamburgerProps = {
  onPress: () => void;
};
 
function HamburgerButton({ onPress }: HamburgerProps) {
  return (
    <Pressable onPress={onPress} className="p-2 active:opacity-60">
      <View className="w-6 h-0.5 bg-gray-800 mb-1.5" />
      <View className="w-6 h-0.5 bg-gray-800 mb-1.5" />
      <View className="w-6 h-0.5 bg-gray-800" />
    </Pressable>
  );
}
 
// ─── Main layout ──────────────────────────────────────────────────────────────
 
export default function SidebarLayout() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= BREAKPOINT;
 
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState("/dashboard");
 
  function handleNavigate(route: string) {
    setActiveRoute(route);
    setDrawerOpen(false);
  }
 
  return (
    <View className="w-auto flex-row bg-white border border-[#DAD0D0]">
 
      {/* ── Desktop: permanent sidebar ── */}
      {isDesktop && (
        <View className="w-64 self-stretch">
          <SidebarContent
            activeRoute={activeRoute}
            onNavigate={handleNavigate}
          />
        </View>
      )}
 
      {/* ── Mobile: modal drawer ── */}
      {!isDesktop && (
        <Modal
          visible={drawerOpen}
          transparent
          animationType="slide"
          onRequestClose={() => setDrawerOpen(false)}
        >
          <View className="flex-1 flex-row">
            {/* Drawer panel */}
            <View className="w-100 flex-1">
              <SidebarContent
                activeRoute={activeRoute}
                onNavigate={handleNavigate}
              />
            </View>
 
            {/* Tap outside to close */}
            <Pressable
              className="flex-1 bg-black/40"
              onPress={() => setDrawerOpen(false)}
            />
          </View>
        </Modal>
      )}
    </View>
  );
}

