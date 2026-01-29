'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createClient } from '@/lib/supabase/client';
import { ExportInventoryButton } from '@/components/ExportInventoryButton';
import { 
  ArrowLeft, Home, Bed, Bath, MapPin, User, Calendar,
  Camera, FileText, Wrench, Plus, Edit, Trash2, Image
} from 'lucide-react';

interface Room {
  id: string;
  name: string;
  condition: string;
  notes?: string;
  photos: {
    id: string;
    url: string;
    caption?: string;
    created_at: string;
  }[];
}

interface Tenancy {
  id: string;
  start_date: string;
  end_date?: string;
  status: string;
  rent_amount: number;
  profiles?: {
    full_name: string;
    email: string;
  };
}

interface Property {
  id: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  postcode: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  created_at: string;
  profiles?: {
    full_name: string;
  };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [tenancies, setTenancies] = useState<Tenancy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProperty() {
      const supabase = createClient();

      try {
        // Fetch property
        const { data: propertyData, error: propertyError } = await supabase
          .from('properties')
          .select(`
            *,
            profiles!properties_landlord_id_fkey (full_name)
          `)
          .eq('id', propertyId)
          .single();

        if (propertyError) throw propertyError;
        setProperty(propertyData);

        // Fetch rooms with photos
        const { data: roomsData } = await supabase
          .from('rooms')
          .select(`
            *,
            photos (id, url, caption, created_at)
          `)
          .eq('property_id', propertyId)
          .order('created_at', { ascending: true });

        setRooms(roomsData || []);

        // Fetch tenancies
        const { data: tenanciesData } = await supabase
          .from('tenancies')
          .select(`
            *,
            profiles!tenancies_tenant_id_fkey (full_name, email)
          `)
          .eq('property_id', propertyId)
          .order('start_date', { ascending: false });

        setTenancies(tenanciesData || []);
      } catch (err: any) {
        console.error('Error loading property:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (propertyId) {
      loadProperty();
    }
  }, [propertyId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="h-8 w-32 bg-slate-200 rounded animate-pulse" />
          <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
          <div className="h-48 bg-slate-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <Card className="p-6 text-center">
          <p className="text-red-500 mb-4">{error || 'Property not found'}</p>
          <Button onClick={() => router.push('/properties')}>Back to Properties</Button>
        </Card>
      </div>
    );
  }

  const fullAddress = [property.address_line_1, property.address_line_2, property.city]
    .filter(Boolean)
    .join(', ');

  const activeTenancy = tenancies.find(t => t.status === 'active');
  const totalPhotos = rooms.reduce((sum, room) => sum + (room.photos?.length || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-5xl mx-auto p-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-6"
        >
          {/* Back Button & Actions */}
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <Link href="/properties">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Properties
              </Button>
            </Link>
            <div className="flex gap-2">
              <ExportInventoryButton 
                propertyId={propertyId} 
                propertyAddress={fullAddress}
              />
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
          </motion.div>

          {/* Property Header */}
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur overflow-hidden">
              <div className="bg-gradient-to-r from-[#E8998D] to-[#F4A261] p-6 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">{property.address_line_1}</h1>
                    <div className="flex items-center gap-2 text-white/90">
                      <MapPin className="w-4 h-4" />
                      <span>{property.city}, {property.postcode}</span>
                    </div>
                  </div>
                  <Badge className="bg-white/20 text-white hover:bg-white/30">
                    {property.property_type || 'Residential'}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Bed className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Bedrooms</p>
                      <p className="font-semibold">{property.bedrooms}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
                      <Bath className="w-5 h-5 text-cyan-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Bathrooms</p>
                      <p className="font-semibold">{property.bathrooms}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                      <Home className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Rooms</p>
                      <p className="font-semibold">{rooms.length}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                      <Image className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Photos</p>
                      <p className="font-semibold">{totalPhotos}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tabs */}
          <motion.div variants={itemVariants}>
            <Tabs defaultValue="rooms" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="rooms">Rooms & Photos</TabsTrigger>
                <TabsTrigger value="tenancies">Tenancies</TabsTrigger>
                <TabsTrigger value="issues">Issues</TabsTrigger>
              </TabsList>

              <TabsContent value="rooms">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Rooms ({rooms.length})</h2>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Room
                    </Button>
                  </div>
                  
                  {rooms.length === 0 ? (
                    <Card className="p-8 text-center">
                      <Camera className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 mb-4">No rooms added yet</p>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Room
                      </Button>
                    </Card>
                  ) : (
                    <div className="grid gap-4">
                      {rooms.map((room) => (
                        <Card key={room.id} className="overflow-hidden">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{room.name}</CardTitle>
                              <Badge variant={
                                room.condition === 'excellent' ? 'default' :
                                room.condition === 'good' ? 'secondary' :
                                room.condition === 'fair' ? 'outline' : 'destructive'
                              }>
                                {room.condition}
                              </Badge>
                            </div>
                            {room.notes && (
                              <CardDescription>{room.notes}</CardDescription>
                            )}
                          </CardHeader>
                          <CardContent>
                            {room.photos && room.photos.length > 0 ? (
                              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                                {room.photos.map((photo) => (
                                  <div 
                                    key={photo.id} 
                                    className="aspect-square rounded-lg bg-slate-100 overflow-hidden"
                                  >
                                    <img 
                                      src={photo.url} 
                                      alt={photo.caption || room.name}
                                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                                    />
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-slate-400">
                                <Camera className="w-4 h-4" />
                                <span className="text-sm">No photos</span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="tenancies">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Tenancies ({tenancies.length})</h2>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Tenancy
                    </Button>
                  </div>
                  
                  {tenancies.length === 0 ? (
                    <Card className="p-8 text-center">
                      <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 mb-4">No tenancies yet</p>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Tenancy
                      </Button>
                    </Card>
                  ) : (
                    <div className="grid gap-4">
                      {tenancies.map((tenancy) => (
                        <Card key={tenancy.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                  <User className="w-5 h-5 text-slate-600" />
                                </div>
                                <div>
                                  <p className="font-medium">
                                    {tenancy.profiles?.full_name || 'Unknown Tenant'}
                                  </p>
                                  <p className="text-sm text-slate-500">
                                    {new Date(tenancy.start_date).toLocaleDateString('en-GB')}
                                    {tenancy.end_date && ` — ${new Date(tenancy.end_date).toLocaleDateString('en-GB')}`}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge variant={tenancy.status === 'active' ? 'default' : 'secondary'}>
                                  {tenancy.status}
                                </Badge>
                                <p className="text-sm text-slate-500 mt-1">
                                  £{tenancy.rent_amount}/month
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="issues">
                <Card className="p-8 text-center">
                  <Wrench className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 mb-4">No issues reported</p>
                  <Link href={`/issues/new?property=${propertyId}`}>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Report Issue
                    </Button>
                  </Link>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
