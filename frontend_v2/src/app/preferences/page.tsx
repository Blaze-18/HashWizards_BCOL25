"use client";

import PreferencesForm from "@/components/PreferencesForm"; // exact file name, case-sensitive

export default function PreferencesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex flex-col">
      <main className="flex-1 flex flex-col">
        <PreferencesForm />
      </main>
    </div>
  );
}