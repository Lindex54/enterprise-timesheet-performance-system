"use client";

import { useEffect, useState } from "react";

function getGreeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function TimeBasedGreeting({ name }: { name: string }) {
  const [greeting, setGreeting] = useState("Good day");

  useEffect(() => {
    const updateGreeting = () => setGreeting(getGreeting(new Date().getHours()));

    updateGreeting();
    const intervalId = window.setInterval(updateGreeting, 60_000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <h1 className="mt-1 text-2xl font-bold text-slate-900 lg:text-3xl">
      {greeting}, {name}
    </h1>
  );
}
