import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Sparkles } from "lucide-react";

export interface ManualSkill { name: string; level: "beginner" | "intermediate" | "advanced" | "expert"; yearsOfExperience: number; }
export interface ManualWork { company: string; title: string; startDate: string; endDate: string; description: string; }
export interface ManualEducation { institution: string; degree: string; field: string; startYear: number; endYear: number | null; }
export interface ManualProfile {
  name: string; email: string; phone: string; location: string; bio: string;
  experienceYears: number;
  skills: ManualSkill[];
  workExperience: ManualWork[];
  education: ManualEducation[];
  preferredRoles: string[];
  preferredStack: string[];
}

const empty: ManualProfile = {
  name: "", email: "", phone: "", location: "", bio: "",
  experienceYears: 0,
  skills: [{ name: "", level: "intermediate", yearsOfExperience: 1 }],
  workExperience: [{ company: "", title: "", startDate: "", endDate: "", description: "" }],
  education: [{ institution: "", degree: "", field: "", startYear: new Date().getFullYear() - 4, endYear: new Date().getFullYear() }],
  preferredRoles: [],
  preferredStack: [],
};

interface Props {
  loading?: boolean;
  onSubmit: (profile: ManualProfile) => void;
}

export function ManualProfileForm({ loading, onSubmit }: Props) {
  const [p, setP] = useState<ManualProfile>(empty);
  const [rolesInput, setRolesInput] = useState("");
  const [stackInput, setStackInput] = useState("");

  const update = <K extends keyof ManualProfile>(k: K, v: ManualProfile[K]) => setP((s) => ({ ...s, [k]: v }));

  const addSkill = () => update("skills", [...p.skills, { name: "", level: "intermediate", yearsOfExperience: 1 }]);
  const removeSkill = (i: number) => update("skills", p.skills.filter((_, idx) => idx !== i));
  const addWork = () => update("workExperience", [...p.workExperience, { company: "", title: "", startDate: "", endDate: "", description: "" }]);
  const removeWork = (i: number) => update("workExperience", p.workExperience.filter((_, idx) => idx !== i));
  const addEdu = () => update("education", [...p.education, { institution: "", degree: "", field: "", startYear: new Date().getFullYear(), endYear: null }]);
  const removeEdu = (i: number) => update("education", p.education.filter((_, idx) => idx !== i));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!p.name.trim()) return;
    onSubmit({
      ...p,
      preferredRoles: rolesInput.split(",").map((s) => s.trim()).filter(Boolean),
      preferredStack: stackInput.split(",").map((s) => s.trim()).filter(Boolean),
      skills: p.skills.filter((s) => s.name.trim()),
      workExperience: p.workExperience.filter((w) => w.company.trim() || w.title.trim()),
      education: p.education.filter((e) => e.institution.trim()),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="pt-6 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5"><Label>Full name *</Label><Input value={p.name} onChange={(e) => update("name", e.target.value)} required /></div>
          <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={p.email} onChange={(e) => update("email", e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Phone</Label><Input value={p.phone} onChange={(e) => update("phone", e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Location</Label><Input value={p.location} onChange={(e) => update("location", e.target.value)} placeholder="City, Country" /></div>
          <div className="space-y-1.5 sm:col-span-2"><Label>Short bio</Label><Textarea rows={3} value={p.bio} onChange={(e) => update("bio", e.target.value)} placeholder="2-3 sentence summary about yourself" /></div>
          <div className="space-y-1.5"><Label>Years of experience</Label><Input type="number" min={0} value={p.experienceYears} onChange={(e) => update("experienceYears", Number(e.target.value))} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-3">
          <div className="flex items-center justify-between"><Label className="text-base">Skills</Label><Button type="button" variant="outline" size="sm" onClick={addSkill}><Plus className="h-3.5 w-3.5 mr-1" />Add</Button></div>
          {p.skills.map((s, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-6 sm:col-span-5 space-y-1"><Label className="text-xs">Skill</Label><Input value={s.name} onChange={(e) => update("skills", p.skills.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x))} placeholder="React" /></div>
              <div className="col-span-3 space-y-1"><Label className="text-xs">Level</Label>
                <select className="w-full h-10 rounded-md border border-input bg-background px-2 text-sm" value={s.level} onChange={(e) => update("skills", p.skills.map((x, idx) => idx === i ? { ...x, level: e.target.value as ManualSkill["level"] } : x))}>
                  <option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option><option value="expert">Expert</option>
                </select>
              </div>
              <div className="col-span-2 space-y-1"><Label className="text-xs">Yrs</Label><Input type="number" min={0} value={s.yearsOfExperience} onChange={(e) => update("skills", p.skills.map((x, idx) => idx === i ? { ...x, yearsOfExperience: Number(e.target.value) } : x))} /></div>
              <div className="col-span-1"><Button type="button" variant="ghost" size="icon" onClick={() => removeSkill(i)}><Trash2 className="h-4 w-4" /></Button></div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between"><Label className="text-base">Work experience</Label><Button type="button" variant="outline" size="sm" onClick={addWork}><Plus className="h-3.5 w-3.5 mr-1" />Add</Button></div>
          {p.workExperience.map((w, i) => (
            <div key={i} className="space-y-2 border-t pt-3 first:border-t-0 first:pt-0">
              <div className="grid sm:grid-cols-2 gap-2">
                <Input placeholder="Job title" value={w.title} onChange={(e) => update("workExperience", p.workExperience.map((x, idx) => idx === i ? { ...x, title: e.target.value } : x))} />
                <Input placeholder="Company" value={w.company} onChange={(e) => update("workExperience", p.workExperience.map((x, idx) => idx === i ? { ...x, company: e.target.value } : x))} />
                <Input placeholder="Start (e.g. Jan 2022)" value={w.startDate} onChange={(e) => update("workExperience", p.workExperience.map((x, idx) => idx === i ? { ...x, startDate: e.target.value } : x))} />
                <Input placeholder="End (or Present)" value={w.endDate} onChange={(e) => update("workExperience", p.workExperience.map((x, idx) => idx === i ? { ...x, endDate: e.target.value } : x))} />
              </div>
              <Textarea rows={2} placeholder="Brief description of responsibilities" value={w.description} onChange={(e) => update("workExperience", p.workExperience.map((x, idx) => idx === i ? { ...x, description: e.target.value } : x))} />
              <Button type="button" variant="ghost" size="sm" onClick={() => removeWork(i)}><Trash2 className="h-3.5 w-3.5 mr-1" />Remove</Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between"><Label className="text-base">Education</Label><Button type="button" variant="outline" size="sm" onClick={addEdu}><Plus className="h-3.5 w-3.5 mr-1" />Add</Button></div>
          {p.education.map((ed, i) => (
            <div key={i} className="space-y-2 border-t pt-3 first:border-t-0 first:pt-0">
              <div className="grid sm:grid-cols-2 gap-2">
                <Input placeholder="Institution" value={ed.institution} onChange={(e) => update("education", p.education.map((x, idx) => idx === i ? { ...x, institution: e.target.value } : x))} />
                <Input placeholder="Degree (e.g. B.Sc.)" value={ed.degree} onChange={(e) => update("education", p.education.map((x, idx) => idx === i ? { ...x, degree: e.target.value } : x))} />
                <Input placeholder="Field of study" value={ed.field} onChange={(e) => update("education", p.education.map((x, idx) => idx === i ? { ...x, field: e.target.value } : x))} />
                <div className="grid grid-cols-2 gap-2">
                  <Input type="number" placeholder="Start year" value={ed.startYear || ""} onChange={(e) => update("education", p.education.map((x, idx) => idx === i ? { ...x, startYear: Number(e.target.value) } : x))} />
                  <Input type="number" placeholder="End year" value={ed.endYear ?? ""} onChange={(e) => update("education", p.education.map((x, idx) => idx === i ? { ...x, endYear: e.target.value ? Number(e.target.value) : null } : x))} />
                </div>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeEdu(i)}><Trash2 className="h-3.5 w-3.5 mr-1" />Remove</Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5"><Label>Preferred roles (comma-separated)</Label><Input value={rolesInput} onChange={(e) => setRolesInput(e.target.value)} placeholder="Frontend Engineer, Product Designer" /></div>
          <div className="space-y-1.5"><Label>Preferred stack (comma-separated)</Label><Input value={stackInput} onChange={(e) => setStackInput(e.target.value)} placeholder="React, TypeScript, Node" /></div>
        </CardContent>
      </Card>

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        <Sparkles className="h-4 w-4 mr-2" />
        {loading ? "Predicting…" : "Predict matching jobs"}
      </Button>
    </form>
  );
}