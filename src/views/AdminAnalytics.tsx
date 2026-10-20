import React, { useEffect, useState } from "react";
import { useAppContext } from "../controllers/AppContext";
import { Users, Eye, Save } from "lucide-react";
import { ApiService } from "../services/api";

export default function AdminAnalytics() {
  const { t } = useAppContext();
  const [visits, setVisits] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form states for CMS
  const [homeTitle, setHomeTitle] = useState("");
  const [homeSubtitle, setHomeSubtitle] = useState("");

  useEffect(() => {
    async function loadData() {
      // Load Analytics
      try {
        const today = new Date().toISOString().split("T")[0];
        const views = await ApiService.getAnalytics(today);
        setVisits(views);
      } catch (e) {
        console.error("Error loading stats", e);
      }
      
      // Load CMS data
      try {
        const cmsData = await ApiService.getCMSContent("home");
        if (cmsData) {
          setHomeTitle(cmsData.title || "");
          setHomeSubtitle(cmsData.subtitle || "");
        }
      } catch (e) {
        console.error("Error loading CMS", e);
      }
    }
    loadData();
  }, []);

  const handleSaveCMS = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await ApiService.updateCMSContent("home", {
        title: homeTitle,
        subtitle: homeSubtitle,
      });
      alert("Changes saved successfully!");
    } catch (error) {
      console.error("Save error", error);
      alert("Failed to save.");
    }
    setIsSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4" dir={document.documentElement.dir}>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid sm:grid-cols-2 gap-6 mb-12">
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm flex items-center gap-6">
          <div className="p-4 bg-green-50 text-green-600 rounded-full">
            <Eye className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Today's Visits</p>
            <p className="text-3xl font-bold">{visits.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Edit Home Content</h2>
      <form onSubmit={handleSaveCMS} className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Home Title</label>
          <input 
            type="text" 
            value={homeTitle}
            onChange={(e) => setHomeTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="e.g. Build with Concrete..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Home Subtitle</label>
          <textarea 
            value={homeSubtitle}
            onChange={(e) => setHomeSubtitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black h-32"
            placeholder="Main description..."
          />
        </div>
        <button 
          disabled={isSaving}
          type="submit" 
          className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
