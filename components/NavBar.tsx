"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar() {

const [user, setUser] = useState<any>(null);

useEffect(() => {
  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  };

  getUser();
}, []);

const handleLogout = async () => {
  await supabase.auth.signOut();
  window.location.href = "/";
};

return (

<nav className="border-b bg-white shadow-sm">

<div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

{/* Logo */}

<Link href="/" className="text-xl font-bold text-blue-900">
Anypart and Gear
</Link>

{/* Links */}

<div className="flex items-center gap-6">

<Link href="/browse" className="hover:text-blue-600">
Browse
</Link>

<Link href="/sell" className="hover:text-blue-600">
Sell
</Link>

{user && (
<>
<Link href="/messages" className="hover:text-blue-600">
Messages
</Link>

<Link href="/notifications" className="hover:text-blue-600">
Notifications
</Link>

<Link href={`/user/${user.id}`} className="hover:text-blue-600">
Profile
</Link>
</>
)}

{/* Login / Logout */}

{user ? (

<button
onClick={handleLogout}
className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-400"
>
Logout
</button>

) : (

<Link
href="/login"
className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500"
>
Login
</Link>

)}

</div>

</div>

</nav>

);

}
