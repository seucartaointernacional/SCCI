"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboardIcon,
  UsersIcon,
  LogOutIcon,
  MenuIcon,
} from "@/components/icons";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    fetch("/api/admin/stats")
      .then((res) => {
        if (res.status === 401) {
          router.push("/admin/login");
        } else {
          setAuthenticated(true);
        }
      })
      .catch(() => {
        router.push("/admin/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Carregando...</div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const navLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboardIcon },
    { href: "/admin/leads", label: "Leads", icon: UsersIcon },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="py-6 px-6">
          <span className="text-sm font-bold text-gray-900">
            Seu Cartão Internacional
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1 px-3">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            const IconComponent = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-6 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  active
                    ? "bg-brand-50 text-brand-700"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                <IconComponent size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="mt-auto border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-6 py-4 text-sm font-medium text-gray-400 hover:text-red-500 transition-colors"
          >
            <LogOutIcon size={18} />
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-100 h-14 flex items-center px-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <MenuIcon size={20} />
        </button>
        <span className="ml-3 text-sm font-bold text-gray-900">
          Seu Cartão Internacional
        </span>
      </div>

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen bg-gray-50 p-6 lg:p-8 pt-20 lg:pt-8">
        {children}
      </main>
    </div>
  );
}
