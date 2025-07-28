import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Users, Bed } from 'lucide-react';
import { RoomConfig } from './MultiRoomGuestSelector';

interface RoomGuestData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  additionalGuests: {
    firstName: string;
    lastName: string;
    age?: number;
  }[];
}

interface MultiRoomBookingFormProps {
  hotel: any;
  prebookId: string;
  rooms: RoomConfig[];
  onBookingComplete: (booking: any) => void;
  onBack: () => void;
}

export function MultiRoomBookingForm({ 
  hotel, 
  prebookId,
  rooms,
  onBookingComplete, 
  onBack 
}: MultiRoomBookingFormProps) {
  const [roomsData, setRoomsData] = useState<RoomGuestData[]>(
    rooms.map(() => ({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      additionalGuests: []
    }))
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const updateRoomData = (roomIndex: number, field: string, value: string) => {
    const newRoomsData = [...roomsData];
    newRoomsData[roomIndex] = {
      ...newRoomsData[roomIndex],
      [field]: value
    };
    setRoomsData(newRoomsData);
  };

  const updateAdditionalGuest = (roomIndex: number, guestIndex: number, field: string, value: string | number) => {
    const newRoomsData = [...roomsData];
    const additionalGuests = [...newRoomsData[roomIndex].additionalGuests];
    
    // Ensure the guest exists
    while (additionalGuests.length <= guestIndex) {
      additionalGuests.push({ firstName: '', lastName: '' });
    }
    
    additionalGuests[guestIndex] = {
      ...additionalGuests[guestIndex],
      [field]: value
    };
    
    newRoomsData[roomIndex].additionalGuests = additionalGuests;
    setRoomsData(newRoomsData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('🔍 Starting multi-room booking with data:', roomsData);
      console.log('🔍 Prebook ID:', prebookId);
      
      if (!prebookId) {
        throw new Error('No prebook ID available. Please try the prebook step again.');
      }

      // Format the booking data for multi-room
      const bookingRooms = roomsData.map((roomData, index) => {
        const room = rooms[index];
        const guests = [
          {
            first_name: roomData.firstName,
            last_name: roomData.lastName
          }
        ];

        // Add additional adult guests
        for (let i = 1; i < room.adults; i++) {
          const additionalGuest = roomData.additionalGuests[i - 1];
          if (additionalGuest?.firstName && additionalGuest?.lastName) {
            guests.push({
              first_name: additionalGuest.firstName,
              last_name: additionalGuest.lastName
            });
          }
        }

        // Add children
        room.children.forEach((age, childIndex) => {
          const childGuest = roomData.additionalGuests[room.adults - 1 + childIndex];
          if (childGuest?.firstName && childGuest?.lastName) {
            guests.push({
              first_name: childGuest.firstName,
              last_name: childGuest.lastName,
              ...(age !== undefined && { age: age })
            });
          }
        });

        return { guests };
      });

      // Call Ratehawk booking API with multi-room data
      const { data, error } = await supabase.functions.invoke('ratehawk-hotel-book', {
        body: {
          book_hash: prebookId,
          user: {
            email: roomsData[0].email,
            phone: roomsData[0].phone,
            firstName: roomsData[0].firstName,
            lastName: roomsData[0].lastName
          },
          rooms: bookingRooms
        }
      });

      if (error) {
        console.error('❌ Multi-room booking error:', error);
        throw new Error(error.message);
      }

      console.log('✅ Multi-room booking successful:', data);
      toast({
        title: "Multi-Room Booking Successful!",
        description: `Your ${rooms.length} room reservation has been confirmed. Order ID: ${data.data?.order_id}`,
      });

      onBookingComplete(data);
    } catch (error) {
      console.error('❌ Multi-room booking submission error:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error processing your multi-room booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bed className="h-5 w-5 mr-2" />
            Complete Your Multi-Room Booking
          </CardTitle>
          <p className="text-muted-foreground">
            Booking: {hotel?.name} - {rooms.length} Rooms - {prebookId?.includes('test_hotel_do_not_book') ? 'TEST RESERVATION' : 'Live Booking'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {rooms.map((room, roomIndex) => (
              <Card key={roomIndex} className="border-border">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Room {roomIndex + 1} - {room.adults} Adults
                    {room.children.length > 0 && `, ${room.children.length} Children`}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Primary guest (required for all rooms) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/20 rounded-lg">
                    <div className="md:col-span-2">
                      <Label className="font-medium text-primary">Primary Guest</Label>
                      <p className="text-sm text-muted-foreground">Main contact for this room</p>
                    </div>
                    <div>
                      <Label htmlFor={`room${roomIndex}-firstName`}>First Name *</Label>
                      <Input
                        id={`room${roomIndex}-firstName`}
                        value={roomsData[roomIndex].firstName}
                        onChange={(e) => updateRoomData(roomIndex, 'firstName', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`room${roomIndex}-lastName`}>Last Name *</Label>
                      <Input
                        id={`room${roomIndex}-lastName`}
                        value={roomsData[roomIndex].lastName}
                        onChange={(e) => updateRoomData(roomIndex, 'lastName', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`room${roomIndex}-email`}>Email Address *</Label>
                      <Input
                        id={`room${roomIndex}-email`}
                        type="email"
                        value={roomsData[roomIndex].email}
                        onChange={(e) => updateRoomData(roomIndex, 'email', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`room${roomIndex}-phone`}>Phone Number</Label>
                      <Input
                        id={`room${roomIndex}-phone`}
                        type="tel"
                        value={roomsData[roomIndex].phone}
                        onChange={(e) => updateRoomData(roomIndex, 'phone', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Additional guests */}
                  {(room.adults > 1 || room.children.length > 0) && (
                    <div className="space-y-3">
                      <Label className="font-medium">Additional Guests</Label>
                      
                      {/* Additional adults */}
                      {room.adults > 1 && (
                        <div className="space-y-3">
                          {Array.from({ length: room.adults - 1 }, (_, i) => (
                            <div key={`adult-${i}`} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 border rounded-lg">
                              <div className="md:col-span-2">
                                <Label className="text-sm font-medium">Adult Guest {i + 2}</Label>
                              </div>
                              <div>
                                <Label htmlFor={`room${roomIndex}-adult${i}-firstName`}>First Name *</Label>
                                <Input
                                  id={`room${roomIndex}-adult${i}-firstName`}
                                  value={roomsData[roomIndex].additionalGuests[i]?.firstName || ''}
                                  onChange={(e) => updateAdditionalGuest(roomIndex, i, 'firstName', e.target.value)}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor={`room${roomIndex}-adult${i}-lastName`}>Last Name *</Label>
                                <Input
                                  id={`room${roomIndex}-adult${i}-lastName`}
                                  value={roomsData[roomIndex].additionalGuests[i]?.lastName || ''}
                                  onChange={(e) => updateAdditionalGuest(roomIndex, i, 'lastName', e.target.value)}
                                  required
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Children */}
                      {room.children.length > 0 && (
                        <div className="space-y-3">
                          {room.children.map((age, childIndex) => {
                            const guestIndex = room.adults - 1 + childIndex;
                            return (
                              <div key={`child-${childIndex}`} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 border rounded-lg">
                                <div className="md:col-span-3">
                                  <Label className="text-sm font-medium">Child {childIndex + 1} (Age {age})</Label>
                                </div>
                                <div>
                                  <Label htmlFor={`room${roomIndex}-child${childIndex}-firstName`}>First Name *</Label>
                                  <Input
                                    id={`room${roomIndex}-child${childIndex}-firstName`}
                                    value={roomsData[roomIndex].additionalGuests[guestIndex]?.firstName || ''}
                                    onChange={(e) => updateAdditionalGuest(roomIndex, guestIndex, 'firstName', e.target.value)}
                                    required
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`room${roomIndex}-child${childIndex}-lastName`}>Last Name *</Label>
                                  <Input
                                    id={`room${roomIndex}-child${childIndex}-lastName`}
                                    value={roomsData[roomIndex].additionalGuests[guestIndex]?.lastName || ''}
                                    onChange={(e) => updateAdditionalGuest(roomIndex, guestIndex, 'lastName', e.target.value)}
                                    required
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`room${roomIndex}-child${childIndex}-age`}>Age</Label>
                                  <Input
                                    id={`room${roomIndex}-child${childIndex}-age`}
                                    type="number"
                                    min="0"
                                    max="17"
                                    value={age}
                                    disabled
                                    className="bg-muted"
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {prebookId?.includes('test_hotel_do_not_book') && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 font-medium">🧪 Test Multi-Room Booking</p>
                <p className="text-yellow-700 text-sm mt-1">
                  This is a test booking for Ratehawk certification. All {rooms.length} rooms will be cancelled automatically.
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isLoading ? 'Booking...' : `Complete ${rooms.length} Room Booking`}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}