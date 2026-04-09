"use client";
import { useState, useEffect, useCallback } from "react";

// --- Types ---------------------------------------------------------------

interface Settings {
  heroTagline: string;
  heroTitle1: string;
  heroTitle2: string;
  heroSubtitle: string;
  heroImageUrl: string;
  storyImageUrl: string;
  storyHeading: string;
  storyParagraph1: string;
  storyParagraph2: string;
  storyParagraph3: string;
  teamSectionLabel: string;
  teamSectionTitle: string;
  teamSectionSubtitle: string;
}

interface Service {
  id: string;
  name: string;
  order: number;
  active: boolean;
}

interface Value {
  id: string;
  iconKey: string;
  title: string;
  description: string;
  order: number;
  active: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  order: number;
  active: boolean;
}

// --- Icon key options -----------------------------------------------------

const ICON_OPTIONS = [
  { key: "sustainability", label: "Globe / Sustainability" },
  { key: "craftsmanship", label: "Star / Craftsmanship" },
  { key: "collaboration", label: "People / Collaboration" },
  { key: "innovation", label: "Lightbulb / Innovation" },
  { key: "heart", label: "Heart" },
  { key: "leaf", label: "Leaf" },
];

// --- Default/empty forms --------------------------------------------------

const EMPTY_SETTINGS: Settings = {
  heroTagline: "About Us",
  heroTitle1: "Rooted in Passion,",
  heroTitle2: "Grown with Purpose",
  heroSubtitle:
    "A sole-practitioner landscape and hardscape design studio serving residential properties throughout the Wasatch Front, Utah.",
  heroImageUrl:
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1920&q=80",
  storyImageUrl:
    "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80",
  storyHeading: "Where Every Landscape Tells a Story",
  storyParagraph1: "",
  storyParagraph2: "",
  storyParagraph3: "",
  teamSectionLabel: "The Designer",
  teamSectionTitle: "Meet the Designer",
  teamSectionSubtitle:
    "A solo practice — you work directly with me on every project.",
};

const EMPTY_SERVICE = { name: "", order: 0, active: true };
const EMPTY_VALUE = {
  iconKey: "sustainability",
  title: "",
  description: "",
  order: 0,
  active: true,
};
const EMPTY_MEMBER = {
  name: "",
  role: "",
  bio: "",
  imageUrl: "",
  order: 0,
  active: true,
};

// --- Tab types ------------------------------------------------------------

type Tab = "settings" | "services" | "values" | "team";

// =========================================================================

export default function AboutAdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("settings");

  // Settings state
  const [settings, setSettings] = useState<Settings>(EMPTY_SETTINGS);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Services state
  const [services, setServices] = useState<Service[]>([]);
  const [serviceForm, setServiceForm] = useState(EMPTY_SERVICE);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Values state
  const [values, setValues] = useState<Value[]>([]);
  const [valueForm, setValueForm] = useState(EMPTY_VALUE);
  const [editingValue, setEditingValue] = useState<Value | null>(null);

  // Team state
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [memberForm, setMemberForm] = useState(EMPTY_MEMBER);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // --- Fetchers -----------------------------------------------------------

  const fetchSettings = useCallback(async () => {
    const res = await fetch("/api/about/settings");
    const data = await res.json();
    if (data) setSettings({ ...EMPTY_SETTINGS, ...data });
  }, []);

  const fetchServices = useCallback(async () => {
    const res = await fetch("/api/about/services");
    setServices(await res.json());
  }, []);

  const fetchValues = useCallback(async () => {
    const res = await fetch("/api/about/values");
    setValues(await res.json());
  }, []);

  const fetchTeam = useCallback(async () => {
    const res = await fetch("/api/about/team");
    setTeam(await res.json());
  }, []);

  useEffect(() => {
    fetchSettings();
    fetchServices();
    fetchValues();
    fetchTeam();
  }, [fetchSettings, fetchServices, fetchValues, fetchTeam]);

  // --- Settings handlers --------------------------------------------------

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSettingsSaving(true);
    await fetch("/api/about/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSettingsSaving(false);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  }

  // --- Services handlers --------------------------------------------------

  async function submitService(e: React.FormEvent) {
    e.preventDefault();
    if (editingService) {
      await fetch(`/api/about/services/${editingService.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceForm),
      });
      setEditingService(null);
    } else {
      await fetch("/api/about/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceForm),
      });
    }
    setServiceForm(EMPTY_SERVICE);
    fetchServices();
  }

  async function toggleService(s: Service) {
    await fetch(`/api/about/services/${s.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !s.active }),
    });
    fetchServices();
  }

  async function deleteService(id: string) {
    if (!confirm("Delete this service?")) return;
    await fetch(`/api/about/services/${id}`, { method: "DELETE" });
    fetchServices();
  }

  function editService(s: Service) {
    setEditingService(s);
    setServiceForm({ name: s.name, order: s.order, active: s.active });
  }

  // --- Values handlers ----------------------------------------------------

  async function submitValue(e: React.FormEvent) {
    e.preventDefault();
    if (editingValue) {
      await fetch(`/api/about/values/${editingValue.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(valueForm),
      });
      setEditingValue(null);
    } else {
      await fetch("/api/about/values", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(valueForm),
      });
    }
    setValueForm(EMPTY_VALUE);
    fetchValues();
  }

  async function toggleValue(v: Value) {
    await fetch(`/api/about/values/${v.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !v.active }),
    });
    fetchValues();
  }

  async function deleteValue(id: string) {
    if (!confirm("Delete this value?")) return;
    await fetch(`/api/about/values/${id}`, { method: "DELETE" });
    fetchValues();
  }

  function editValue(v: Value) {
    setEditingValue(v);
    setValueForm({
      iconKey: v.iconKey,
      title: v.title,
      description: v.description,
      order: v.order,
      active: v.active,
    });
  }

  // --- Team handlers ------------------------------------------------------

  async function submitMember(e: React.FormEvent) {
    e.preventDefault();
    if (editingMember) {
      await fetch(`/api/about/team/${editingMember.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(memberForm),
      });
      setEditingMember(null);
    } else {
      await fetch("/api/about/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(memberForm),
      });
    }
    setMemberForm(EMPTY_MEMBER);
    fetchTeam();
  }

  async function toggleMember(m: TeamMember) {
    await fetch(`/api/about/team/${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !m.active }),
    });
    fetchTeam();
  }

  async function deleteMember(id: string) {
    if (!confirm("Delete this team member?")) return;
    await fetch(`/api/about/team/${id}`, { method: "DELETE" });
    fetchTeam();
  }

  function editMember(m: TeamMember) {
    setEditingMember(m);
    setMemberForm({
      name: m.name,
      role: m.role,
      bio: m.bio,
      imageUrl: m.imageUrl,
      order: m.order,
      active: m.active,
    });
  }

  // --- Render -------------------------------------------------------------

  const tabs: { id: Tab; label: string }[] = [
    { id: "settings", label: "Page Text & Images" },
    { id: "services", label: "Services" },
    { id: "values", label: "Values" },
    { id: "team", label: "Team" },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[#1a2316] mb-2">
        About Page
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        Edit all content displayed on the About page.
      </p>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b border-gray-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === t.id
                ? "bg-white border border-b-white border-gray-200 text-[#2d5a27] -mb-px"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ====== TAB: SETTINGS ====== */}
      {activeTab === "settings" && (
        <form onSubmit={saveSettings} className="space-y-8">
          {/* Hero section */}
          <fieldset className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <legend className="font-semibold text-[#1a2316] text-sm uppercase tracking-wide px-1 mb-2">
              Hero Section
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-medium text-gray-600 mb-1 block">
                  Tagline pill
                </span>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/30"
                  value={settings.heroTagline}
                  onChange={(e) =>
                    setSettings({ ...settings, heroTagline: e.target.value })
                  }
                />
              </label>
              <label className="block" />
              <label className="block">
                <span className="text-xs font-medium text-gray-600 mb-1 block">
                  Title — line 1
                </span>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/30"
                  value={settings.heroTitle1}
                  onChange={(e) =>
                    setSettings({ ...settings, heroTitle1: e.target.value })
                  }
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-gray-600 mb-1 block">
                  Title — line 2 (green)
                </span>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/30"
                  value={settings.heroTitle2}
                  onChange={(e) =>
                    setSettings({ ...settings, heroTitle2: e.target.value })
                  }
                />
              </label>
            </div>
            <label className="block">
              <span className="text-xs font-medium text-gray-600 mb-1 block">
                Subtitle
              </span>
              <textarea
                rows={2}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/30 resize-none"
                value={settings.heroSubtitle}
                onChange={(e) =>
                  setSettings({ ...settings, heroSubtitle: e.target.value })
                }
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-gray-600 mb-1 block">
                Background image URL
              </span>
              <input
                type="url"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/30"
                value={settings.heroImageUrl}
                onChange={(e) =>
                  setSettings({ ...settings, heroImageUrl: e.target.value })
                }
              />
            </label>
            {settings.heroImageUrl && (
              <div className="h-32 rounded-lg overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={settings.heroImageUrl}
                  alt="Hero preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </fieldset>

          {/* Story section */}
          <fieldset className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <legend className="font-semibold text-[#1a2316] text-sm uppercase tracking-wide px-1 mb-2">
              Story Section
            </legend>
            <label className="block">
              <span className="text-xs font-medium text-gray-600 mb-1 block">
                Story image URL
              </span>
              <input
                type="url"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/30"
                value={settings.storyImageUrl}
                onChange={(e) =>
                  setSettings({ ...settings, storyImageUrl: e.target.value })
                }
              />
            </label>
            {settings.storyImageUrl && (
              <div className="h-32 rounded-lg overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={settings.storyImageUrl}
                  alt="Story preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <label className="block">
              <span className="text-xs font-medium text-gray-600 mb-1 block">
                Heading
              </span>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/30"
                value={settings.storyHeading}
                onChange={(e) =>
                  setSettings({ ...settings, storyHeading: e.target.value })
                }
              />
            </label>
            {(
              ["storyParagraph1", "storyParagraph2", "storyParagraph3"] as const
            ).map((key, i) => (
              <label key={key} className="block">
                <span className="text-xs font-medium text-gray-600 mb-1 block">
                  Paragraph {i + 1}
                </span>
                <textarea
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/30 resize-none"
                  value={settings[key]}
                  onChange={(e) =>
                    setSettings({ ...settings, [key]: e.target.value })
                  }
                />
              </label>
            ))}
          </fieldset>

          {/* Team section */}
          <fieldset className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <legend className="font-semibold text-[#1a2316] text-sm uppercase tracking-wide px-1 mb-2">
              Team Section Headers
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="block">
                <span className="text-xs font-medium text-gray-600 mb-1 block">
                  Label (above heading)
                </span>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/30"
                  value={settings.teamSectionLabel}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      teamSectionLabel: e.target.value,
                    })
                  }
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-gray-600 mb-1 block">
                  Heading
                </span>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/30"
                  value={settings.teamSectionTitle}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      teamSectionTitle: e.target.value,
                    })
                  }
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-gray-600 mb-1 block">
                  Sub-heading
                </span>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/30"
                  value={settings.teamSectionSubtitle}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      teamSectionSubtitle: e.target.value,
                    })
                  }
                />
              </label>
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={settingsSaving}
            className="bg-[#2d5a27] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#234a1e] transition-colors disabled:opacity-50"
          >
            {settingsSaving
              ? "Saving…"
              : settingsSaved
                ? "Saved!"
                : "Save Changes"}
          </button>
        </form>
      )}

      {/* ====== TAB: SERVICES ====== */}
      {activeTab === "services" && (
        <div className="space-y-6">
          <form
            onSubmit={submitService}
            className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
          >
            <h2 className="font-semibold text-[#1a2316] mb-1">
              {editingService ? "Edit Service" : "Add Service"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="block sm:col-span-2">
                <span className="text-xs font-medium text-gray-600 mb-1 block">
                  Service name
                </span>
                <input
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/30"
                  placeholder="e.g. Landscape & Hardscape Design"
                  value={serviceForm.name}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, name: e.target.value })
                  }
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-gray-600 mb-1 block">
                  Order
                </span>
                <input
                  type="number"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/30"
                  value={serviceForm.order}
                  onChange={(e) =>
                    setServiceForm({
                      ...serviceForm,
                      order: Number(e.target.value),
                    })
                  }
                />
              </label>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-[#2d5a27] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#234a1e] transition-colors"
              >
                {editingService ? "Update" : "Add Service"}
              </button>
              {editingService && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingService(null);
                    setServiceForm(EMPTY_SERVICE);
                  }}
                  className="border border-gray-200 text-gray-600 px-5 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="space-y-2">
            {services.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-8">
                No services yet. Add one above.
              </p>
            )}
            {services.map((s) => (
              <div
                key={s.id}
                className={`flex items-center gap-3 bg-white rounded-xl border ${s.active ? "border-gray-100" : "border-gray-100 opacity-50"} px-5 py-3`}
              >
                <span className="flex-1 text-sm font-medium text-[#1a2316]">
                  {s.name}
                </span>
                <span className="text-xs text-gray-400">order: {s.order}</span>
                <button
                  onClick={() => editService(s)}
                  className="text-xs text-blue-600 hover:text-blue-800 px-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => toggleService(s)}
                  className="text-xs text-gray-500 hover:text-gray-800 px-2"
                >
                  {s.active ? "Hide" : "Show"}
                </button>
                <button
                  onClick={() => deleteService(s.id)}
                  className="text-xs text-red-500 hover:text-red-700 px-2"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====== TAB: VALUES ====== */}
      {activeTab === "values" && (
        <div className="space-y-6">
          <form
            onSubmit={submitValue}
            className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
          >
            <h2 className="font-semibold text-[#1a2316] mb-1">
              {editingValue ? "Edit Value" : "Add Value"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-medium text-gray-600 mb-1 block">
                  Icon
                </span>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/30"
                  value={valueForm.iconKey}
                  onChange={(e) =>
                    setValueForm({ ...valueForm, iconKey: e.target.value })
                  }
                >
                  {ICON_OPTIONS.map((o) => (
                    <option key={o.key} value={o.key}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-medium text-gray-600 mb-1 block">
                  Title
                </span>
                <input
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/30"
                  placeholder="e.g. Craftsmanship"
                  value={valueForm.title}
                  onChange={(e) =>
                    setValueForm({ ...valueForm, title: e.target.value })
                  }
                />
              </label>
            </div>
            <label className="block">
              <span className="text-xs font-medium text-gray-600 mb-1 block">
                Description
              </span>
              <textarea
                required
                rows={2}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/30 resize-none"
                value={valueForm.description}
                onChange={(e) =>
                  setValueForm({ ...valueForm, description: e.target.value })
                }
              />
            </label>
            <label className="block w-24">
              <span className="text-xs font-medium text-gray-600 mb-1 block">
                Order
              </span>
              <input
                type="number"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/30"
                value={valueForm.order}
                onChange={(e) =>
                  setValueForm({ ...valueForm, order: Number(e.target.value) })
                }
              />
            </label>
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-[#2d5a27] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#234a1e] transition-colors"
              >
                {editingValue ? "Update" : "Add Value"}
              </button>
              {editingValue && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingValue(null);
                    setValueForm(EMPTY_VALUE);
                  }}
                  className="border border-gray-200 text-gray-600 px-5 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="space-y-2">
            {values.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-8">
                No values yet. Add one above.
              </p>
            )}
            {values.map((v) => (
              <div
                key={v.id}
                className={`flex items-start gap-3 bg-white rounded-xl border ${v.active ? "border-gray-100" : "border-gray-100 opacity-50"} px-5 py-4`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-green-50 text-green-700 rounded px-1.5 py-0.5">
                      {v.iconKey}
                    </span>
                    <span className="font-medium text-sm text-[#1a2316]">
                      {v.title}
                    </span>
                    <span className="text-xs text-gray-400">
                      order: {v.order}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {v.description}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => editValue(v)}
                    className="text-xs text-blue-600 hover:text-blue-800 px-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggleValue(v)}
                    className="text-xs text-gray-500 hover:text-gray-800 px-2"
                  >
                    {v.active ? "Hide" : "Show"}
                  </button>
                  <button
                    onClick={() => deleteValue(v.id)}
                    className="text-xs text-red-500 hover:text-red-700 px-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====== TAB: TEAM ====== */}
      {activeTab === "team" && (
        <div className="space-y-6">
          <form
            onSubmit={submitMember}
            className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
          >
            <h2 className="font-semibold text-[#1a2316] mb-1">
              {editingMember ? "Edit Team Member" : "Add Team Member"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-medium text-gray-600 mb-1 block">
                  Name
                </span>
                <input
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/30"
                  value={memberForm.name}
                  onChange={(e) =>
                    setMemberForm({ ...memberForm, name: e.target.value })
                  }
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-gray-600 mb-1 block">
                  Role / Title
                </span>
                <input
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/30"
                  value={memberForm.role}
                  onChange={(e) =>
                    setMemberForm({ ...memberForm, role: e.target.value })
                  }
                />
              </label>
            </div>
            <label className="block">
              <span className="text-xs font-medium text-gray-600 mb-1 block">
                Bio
              </span>
              <textarea
                required
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/30 resize-none"
                value={memberForm.bio}
                onChange={(e) =>
                  setMemberForm({ ...memberForm, bio: e.target.value })
                }
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-gray-600 mb-1 block">
                Photo URL
              </span>
              <input
                required
                type="url"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/30"
                value={memberForm.imageUrl}
                onChange={(e) =>
                  setMemberForm({ ...memberForm, imageUrl: e.target.value })
                }
              />
            </label>
            {memberForm.imageUrl && (
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={memberForm.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <label className="block w-24">
              <span className="text-xs font-medium text-gray-600 mb-1 block">
                Order
              </span>
              <input
                type="number"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a27]/30"
                value={memberForm.order}
                onChange={(e) =>
                  setMemberForm({
                    ...memberForm,
                    order: Number(e.target.value),
                  })
                }
              />
            </label>
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-[#2d5a27] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#234a1e] transition-colors"
              >
                {editingMember ? "Update" : "Add Member"}
              </button>
              {editingMember && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingMember(null);
                    setMemberForm(EMPTY_MEMBER);
                  }}
                  className="border border-gray-200 text-gray-600 px-5 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="space-y-3">
            {team.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-8">
                No team members yet. Add one above.
              </p>
            )}
            {team.map((m) => (
              <div
                key={m.id}
                className={`flex items-center gap-4 bg-white rounded-xl border ${m.active ? "border-gray-100" : "border-gray-100 opacity-50"} px-5 py-4`}
              >
                {m.imageUrl && (
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.imageUrl}
                      alt={m.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-[#1a2316]">
                    {m.name}
                  </div>
                  <div className="text-xs text-[#2d5a27]">{m.role}</div>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                    {m.bio}
                  </p>
                </div>
                <span className="text-xs text-gray-400">order: {m.order}</span>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => editMember(m)}
                    className="text-xs text-blue-600 hover:text-blue-800 px-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggleMember(m)}
                    className="text-xs text-gray-500 hover:text-gray-800 px-2"
                  >
                    {m.active ? "Hide" : "Show"}
                  </button>
                  <button
                    onClick={() => deleteMember(m.id)}
                    className="text-xs text-red-500 hover:text-red-700 px-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
