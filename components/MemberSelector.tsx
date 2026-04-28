"use client";

import api from "../lib/axios";
import { useEffect, useState } from "react";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Loader2, User } from "lucide-react";

interface Member {
  id: string;
  user_id: string;
  role: string;
  name?: string;
  email?: string;
}

interface MemberSelectorProps {
  project_id: string;
  value: string;
  onChange: (value: string) => void;
}

export default function MemberSelector({
  project_id,
  value,
  onChange,
}: MemberSelectorProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, [project_id]);

  const fetchMembers = async () => {
    try {
      const res = await api.get(`/project/${project_id}/members`);
      setMembers(res.data.members || []);
    } catch {
      // silently fail — members may not be loaded
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        Loading members...
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
        <User className="w-4 h-4 text-slate-400" />
        <p className="text-sm text-slate-400">
          No members yet — invite someone first
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <Label>
        Assign to{" "}
        <span className="text-slate-400 font-normal">(optional)</span>
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a member" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="unassigned">Unassigned</SelectItem>
          {members.map((m) => (
            <SelectItem key={m.user_id} value={m.user_id}>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-700">
                  {m.name?.[0]?.toUpperCase() || "?"}
                </div>
                <span>{m.name || m.email || m.user_id.slice(0, 8)}</span>
                <span className="text-xs text-slate-400 capitalize">
                  · {m.role}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}