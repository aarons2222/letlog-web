"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { 
  ArrowLeft, Shield, Search, AlertTriangle, CheckCircle, 
  Clock, Upload, FileText, Home, Calendar, Plus,
  Flame, Zap, Bug, FileCheck, X, Loader2
} from "lucide-react";

// Compliance types with UK requirements
const complianceTypes = {
  gas_safety: { 
    label: "Gas Safety Certificate", 
    icon: Flame, 
    color: "orange",
    renewalPeriod: "12 months",
    required: "All properties with gas appliances"
  },
  eicr: { 
    label: "EICR (Electrical)", 
    icon: Zap, 
    color: "yellow",
    renewalPeriod: "5 years",
    required: "All rental properties"
  },
  epc: { 
    label: "EPC Certificate", 
    icon: FileCheck, 
    color: "green",
    renewalPeriod: "10 years",
    required: "Minimum rating E for rentals"
  },
  legionella: { 
    label: "Legionella Risk Assessment", 
    icon: Bug, 
    color: "blue",
    renewalPeriod: "2 years recommended",
    required: "All rental properties"
  },
  smoke_co: { 
    label: "Smoke & CO Alarms", 
    icon: Shield, 
    color: "red",
    renewalPeriod: "Annual check",
    required: "All rental properties"
  },
};

interface ComplianceRecord {
  id: string;
  property_id: string;
  compliance_type: string;
  certificate_number: string;
  issue_date: string;
  expiry_date: string;
  inspector_name: string;
  status: string;
  document_url: string | null;
  properties?: {
    address_line_1: string;
    city: string;
  };
}

interface Property {
  id: string;
  address_line_1: string;
  city: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function CompliancePage() {
  const [records, setRecords] = useState<ComplianceRecord[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    property_id: "",
    compliance_type: "",
    certificate_number: "",
    issue_date: "",
    expiry_date: "",
    inspector_name: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const supabase = createClient();
    
    try {
      // Fetch compliance records
      const { data: complianceData, error: complianceError } = await supabase
        .from("compliance_items")
        .select(`
          *,
          properties (
            address_line_1,
            city
          )
        `)
        .order("expiry_date", { ascending: true });

      if (complianceError) throw complianceError;
      setRecords(complianceData || []);

      // Fetch properties for the add form
      const { data: propertiesData } = await supabase
        .from("properties")
        .select("id, address_line_1, city")
        .order("address_line_1");

      setProperties(propertiesData || []);
    } catch (error) {
      console.error("Error loading compliance data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddCompliance(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);

    const supabase = createClient();

    try {
      const { error } = await supabase.from("compliance_items").insert({
        property_id: formData.property_id,
        compliance_type: formData.compliance_type,
        certificate_number: formData.certificate_number,
        issue_date: formData.issue_date,
        expiry_date: formData.expiry_date,
        inspector_name: formData.inspector_name,
      });

      if (error) throw error;

      // Reset form and close dialog
      setFormData({
        property_id: "",
        compliance_type: "",
        certificate_number: "",
        issue_date: "",
        expiry_date: "",
        inspector_name: "",
      });
      setIsAddDialogOpen(false);
      
      // Reload data
      loadData();
    } catch (error: any) {
      console.error("Error adding compliance:", error);
      alert(error.message || "Failed to add compliance record");
    } finally {
      setIsSaving(false);
    }
  }

  const filteredRecords = records.filter(r => {
    const address = r.properties 
      ? `${r.properties.address_line_1}, ${r.properties.city}`
      : "";
    const matchesSearch = 
      address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.certificate_number || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = !filterType || r.compliance_type === filterType;
    const matchesStatus = !filterStatus || r.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: records.length,
    valid: records.filter(r => r.status === "valid").length,
    expiring: records.filter(r => r.status === "expiring_soon").length,
    expired: records.filter(r => r.status === "expired").length,
  };

  const expiringSoon = filteredRecords.filter(r => r.status === "expiring_soon");
  const expired = filteredRecords.filter(r => r.status === "expired");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50"
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-500" />
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">Compliance Tracker</h1>
            </div>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Certificate
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Compliance Certificate</DialogTitle>
                <DialogDescription>
                  Record a new compliance certificate for one of your properties.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddCompliance}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="property">Property</Label>
                    <Select
                      value={formData.property_id}
                      onValueChange={(v) => setFormData({ ...formData, property_id: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select property" />
                      </SelectTrigger>
                      <SelectContent>
                        {properties.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.address_line_1}, {p.city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="type">Certificate Type</Label>
                    <Select
                      value={formData.compliance_type}
                      onValueChange={(v) => setFormData({ ...formData, compliance_type: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(complianceTypes).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="certificate_number">Certificate Number</Label>
                    <Input
                      id="certificate_number"
                      value={formData.certificate_number}
                      onChange={(e) => setFormData({ ...formData, certificate_number: e.target.value })}
                      placeholder="e.g., GS-2026-12345"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="issue_date">Issue Date</Label>
                      <Input
                        id="issue_date"
                        type="date"
                        value={formData.issue_date}
                        onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="expiry_date">Expiry Date</Label>
                      <Input
                        id="expiry_date"
                        type="date"
                        value={formData.expiry_date}
                        onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="inspector_name">Inspector / Company</Label>
                    <Input
                      id="inspector_name"
                      value={formData.inspector_name}
                      onChange={(e) => setFormData({ ...formData, inspector_name: e.target.value })}
                      placeholder="e.g., British Gas"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Add Certificate"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-900/70 backdrop-blur">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-slate-800 dark:text-white">{stats.total}</p>
              <p className="text-sm text-slate-500">Total Certificates</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-900/70 backdrop-blur">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-green-600">{stats.valid}</p>
              <p className="text-sm text-slate-500">Valid</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-900/70 backdrop-blur">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-amber-600">{stats.expiring}</p>
              <p className="text-sm text-slate-500">Expiring Soon</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-900/70 backdrop-blur">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-red-600">{stats.expired}</p>
              <p className="text-sm text-slate-500">Expired</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Alerts */}
        {(expiringSoon.length > 0 || expired.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            {expired.length > 0 && (
              <Card className="border-0 shadow-lg bg-red-50 dark:bg-red-900/20 border-l-4 border-l-red-500 mb-4">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-700 dark:text-red-400">
                      {expired.length} Certificate{expired.length > 1 ? "s" : ""} Expired!
                    </h3>
                    <p className="text-sm text-red-600/80">
                      Immediate action required to remain compliant.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {expiringSoon.length > 0 && (
              <Card className="border-0 shadow-lg bg-amber-50 dark:bg-amber-900/20 border-l-4 border-l-amber-500">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-700 dark:text-amber-400">
                      {expiringSoon.length} Certificate{expiringSoon.length > 1 ? "s" : ""} Expiring Soon
                    </h3>
                    <p className="text-sm text-amber-600/80">
                      Schedule renewals to avoid compliance issues.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* Search & Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by property or certificate..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType || "all"} onValueChange={(v) => setFilterType(v === "all" ? null : v)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Object.entries(complianceTypes).map(([key, value]) => (
                <SelectItem key={key} value={key}>{value.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus || "all"} onValueChange={(v) => setFilterStatus(v === "all" ? null : v)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="valid">Valid</SelectItem>
              <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Compliance Records */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <AnimatePresence>
            {filteredRecords.map((record) => (
              <ComplianceCard key={record.id} record={record} />
            ))}
          </AnimatePresence>

          {filteredRecords.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Shield className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 mb-4">
                {records.length === 0 
                  ? "No compliance records yet" 
                  : "No records match your filters"
                }
              </p>
              {records.length === 0 && (
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Certificate
                </Button>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Compliance Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">UK Landlord Requirements</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(complianceTypes).map(([key, info]) => {
              const Icon = info.icon;
              const colorClasses: Record<string, string> = {
                orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-600",
                yellow: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600",
                green: "bg-green-100 dark:bg-green-900/30 text-green-600",
                blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600",
                red: "bg-red-100 dark:bg-red-900/30 text-red-600",
              };
              
              return (
                <Card key={key} className="border-0 shadow-lg bg-white/70 dark:bg-slate-900/70 backdrop-blur">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg ${colorClasses[info.color]} flex items-center justify-center`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-800 dark:text-white">{info.label}</h3>
                        <p className="text-xs text-slate-500 mt-1">Renewal: {info.renewalPeriod}</p>
                        <p className="text-xs text-slate-400 mt-1">{info.required}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function ComplianceCard({ record }: { record: ComplianceRecord }) {
  const typeInfo = complianceTypes[record.compliance_type as keyof typeof complianceTypes];
  const Icon = typeInfo?.icon || FileText;

  const statusConfig = {
    valid: { label: "Valid", color: "bg-green-100 text-green-700", icon: CheckCircle },
    expiring_soon: { label: "Expiring Soon", color: "bg-amber-100 text-amber-700", icon: Clock },
    expired: { label: "Expired", color: "bg-red-100 text-red-700", icon: AlertTriangle },
  };

  const status = statusConfig[record.status as keyof typeof statusConfig];
  const StatusIcon = status?.icon || CheckCircle;

  const expiryDate = new Date(record.expiry_date);
  const today = new Date();
  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const propertyAddress = record.properties 
    ? `${record.properties.address_line_1}, ${record.properties.city}`
    : "Unknown Property";

  const colorClasses: Record<string, string> = {
    orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-600",
    yellow: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600",
    green: "bg-green-100 dark:bg-green-900/30 text-green-600",
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600",
    red: "bg-red-100 dark:bg-red-900/30 text-red-600",
  };

  return (
    <motion.div
      variants={itemVariants}
      layout
      whileHover={{ y: -2 }}
    >
      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/70 dark:bg-slate-900/70 backdrop-blur">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${colorClasses[typeInfo?.color || "blue"]} flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-6 h-6" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-white">
                    {typeInfo?.label || record.compliance_type}
                  </h3>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <Home className="w-3 h-3" />
                    {propertyAddress}
                  </p>
                </div>
                <Badge className={status?.color}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {status?.label}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Expires: {new Date(record.expiry_date).toLocaleDateString("en-GB")}
                </span>
                <span>
                  {daysUntilExpiry > 0 
                    ? `${daysUntilExpiry} days remaining`
                    : `${Math.abs(daysUntilExpiry)} days overdue`
                  }
                </span>
                {record.certificate_number && (
                  <span className="text-slate-400">
                    #{record.certificate_number}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <Button variant="outline" size="sm" className="gap-1">
                <FileText className="w-4 h-4" />
                View
              </Button>
              {(record.status === "expiring_soon" || record.status === "expired") && (
                <Button size="sm" className="gap-1">
                  <Upload className="w-4 h-4" />
                  Renew
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
