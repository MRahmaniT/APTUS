import React, { useEffect, useState } from "react";
import { Save, UserCircle2 } from "lucide-react";
import { useAppContext } from "../controllers/AppContext";
import { ApiService } from "../services/api";

const inputClass = "w-full rounded-xl border border-[#ddd] bg-white px-4 py-3 text-sm outline-none focus:border-[#111] focus:ring-1 focus:ring-[#111]";

export default function AdminProfile() {
  const { user, role, refreshUserProfile } = useAppContext();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setName(user?.name || "");
    setPhone(user?.phone || "");
    setPhotoURL(user?.photoURL || "");
    setBio(user?.bio || "");
  }, [user]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user?.uid) return;
    if (!name.trim()) {
      setError("Display name is required.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");
    try {
      await ApiService.updateUserProfile(user.uid, { name: name.trim(), phone: phone.trim(), photoURL: photoURL.trim(), bio: bio.trim() });
      await refreshUserProfile();
      setMessage("Profile updated successfully.");
    } catch (err: any) {
      setError(err.message || "Could not update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-2 md:px-6">
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#999] mb-3">Admin / Profile</p>
        <h1 className="text-4xl font-semibold">Admin profile</h1>
        <p className="mt-3 text-[#666]">Manage the identity shown inside the admin experience. Your account email and role remain controlled by authentication and role management.</p>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6 items-start">
        <aside className="rounded-2xl border border-[#ddd] bg-white p-6 text-center">
          <div className="w-28 h-28 rounded-full bg-[#f0f0eb] overflow-hidden mx-auto flex items-center justify-center">
            {photoURL ? <img src={photoURL} alt={name || "Admin"} className="w-full h-full object-cover" /> : <UserCircle2 className="w-16 h-16 text-[#aaa]" />}
          </div>
          <h2 className="mt-4 text-xl font-semibold">{name || "Admin"}</h2>
          <p className="text-sm text-[#777] mt-1">{user?.email || ""}</p>
          <span className="inline-flex mt-4 rounded-full bg-[#111] text-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em]">{role}</span>
        </aside>

        <form onSubmit={save} className="rounded-2xl border border-[#ddd] bg-[#fafaf8] p-5 md:p-8 space-y-5">
          {(message || error) && <div className={`rounded-xl px-4 py-3 text-sm ${error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{error || message}</div>}

          <label className="block"><span className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#777] mb-2">Display name</span><input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} /></label>
          <div className="grid md:grid-cols-2 gap-5">
            <label className="block"><span className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#777] mb-2">Email</span><input value={user?.email || ""} disabled className={`${inputClass} bg-[#f1f1ed] text-[#777]`} dir="ltr" /></label>
            <label className="block"><span className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#777] mb-2">Phone</span><input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} dir="ltr" /></label>
          </div>
          <label className="block"><span className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#777] mb-2">Profile photo URL</span><input value={photoURL} onChange={(e) => setPhotoURL(e.target.value)} className={inputClass} dir="ltr" placeholder="https://…" /></label>
          <label className="block"><span className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#777] mb-2">Bio / admin note</span><textarea value={bio} onChange={(e) => setBio(e.target.value)} className={inputClass} rows={6} /></label>

          <div className="pt-3 flex justify-end">
            <button type="submit" disabled={saving || !user?.uid} className="inline-flex items-center gap-2 rounded-full bg-[#111] text-white px-6 py-3 text-sm font-medium disabled:opacity-50">
              <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
