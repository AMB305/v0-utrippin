import React, { useState } from 'react';
import { Users, Plus, Minus, ChevronDown, Bed } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface RoomConfig {
  adults: number;
  children: number[];
}

export interface MultiRoomConfig {
  rooms: RoomConfig[];
}

interface MultiRoomGuestSelectorProps {
  value: MultiRoomConfig;
  onChange: (config: MultiRoomConfig) => void;
  className?: string;
}

export function MultiRoomGuestSelector({ value, onChange, className }: MultiRoomGuestSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const addRoom = () => {
    const newRooms = [...value.rooms, { adults: 2, children: [] }];
    onChange({ rooms: newRooms });
  };

  const removeRoom = (roomIndex: number) => {
    if (value.rooms.length > 1) {
      const newRooms = value.rooms.filter((_, index) => index !== roomIndex);
      onChange({ rooms: newRooms });
    }
  };

  const updateRoomAdults = (roomIndex: number, increment: boolean) => {
    const newRooms = [...value.rooms];
    const currentAdults = newRooms[roomIndex].adults;
    newRooms[roomIndex].adults = increment 
      ? currentAdults + 1 
      : Math.max(1, currentAdults - 1);
    onChange({ rooms: newRooms });
  };

  const updateRoomChildren = (roomIndex: number, increment: boolean) => {
    const newRooms = [...value.rooms];
    if (increment) {
      newRooms[roomIndex].children.push(12); // Default age 12
    } else if (newRooms[roomIndex].children.length > 0) {
      newRooms[roomIndex].children.pop();
    }
    onChange({ rooms: newRooms });
  };

  const updateChildAge = (roomIndex: number, childIndex: number, age: number) => {
    const newRooms = [...value.rooms];
    newRooms[roomIndex].children[childIndex] = Math.max(0, Math.min(17, age));
    onChange({ rooms: newRooms });
  };

  const getTotalGuests = () => {
    const totalAdults = value.rooms.reduce((sum, room) => sum + room.adults, 0);
    const totalChildren = value.rooms.reduce((sum, room) => sum + room.children.length, 0);
    return { totalAdults, totalChildren };
  };

  const getDisplayText = () => {
    const { totalAdults, totalChildren } = getTotalGuests();
    const guestText = `${totalAdults} adult${totalAdults !== 1 ? 's' : ''}${
      totalChildren > 0 ? `, ${totalChildren} child${totalChildren !== 1 ? 'ren' : ''}` : ''
    }`;
    const roomText = `${value.rooms.length} room${value.rooms.length !== 1 ? 's' : ''}`;
    return `${guestText}, ${roomText}`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`justify-start text-left font-normal bg-muted/50 hover:bg-muted border-border ${className}`}
        >
          <Users className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="text-sm">{getDisplayText()}</span>
          <ChevronDown className="ml-auto h-4 w-4 flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4 max-h-96 overflow-y-auto" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Room Configuration</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={addRoom}
              disabled={value.rooms.length >= 4}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Room
            </Button>
          </div>

          {value.rooms.map((room, roomIndex) => (
            <Card key={roomIndex} className="border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center">
                    <Bed className="h-4 w-4 mr-2" />
                    Room {roomIndex + 1}
                  </CardTitle>
                  {value.rooms.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRoom(roomIndex)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {/* Adults for this room */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs font-medium">Adults</Label>
                    <p className="text-xs text-muted-foreground">Age 18+</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateRoomAdults(roomIndex, false)}
                      disabled={room.adults <= 1}
                      className="h-6 w-6 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-6 text-center text-sm">{room.adults}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateRoomAdults(roomIndex, true)}
                      disabled={room.adults >= 6}
                      className="h-6 w-6 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Children for this room */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs font-medium">Children</Label>
                    <p className="text-xs text-muted-foreground">Age 0-17</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateRoomChildren(roomIndex, false)}
                      disabled={room.children.length === 0}
                      className="h-6 w-6 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-6 text-center text-sm">{room.children.length}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateRoomChildren(roomIndex, true)}
                      disabled={room.children.length >= 3}
                      className="h-6 w-6 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Children Ages for this room */}
                {room.children.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Children's Ages</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {room.children.map((age, childIndex) => (
                        <div key={childIndex} className="flex items-center space-x-1">
                          <Label className="text-xs w-8">C{childIndex + 1}:</Label>
                          <Input
                            type="number"
                            min="0"
                            max="17"
                            value={age}
                            onChange={(e) => updateChildAge(roomIndex, childIndex, parseInt(e.target.value) || 0)}
                            className="h-6 text-xs flex-1"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          <Button
            onClick={() => setIsOpen(false)}
            className="w-full mt-4"
          >
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
