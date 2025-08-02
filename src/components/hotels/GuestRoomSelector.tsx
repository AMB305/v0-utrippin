import React, { useState } from 'react';
import { Users, Plus, Minus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GuestConfig {
  adults: number;
  children: number[];
  rooms: number;
}

interface RoomConfig {
  adults: number;
  children: number[];
}

interface MultiRoomConfig {
  rooms: RoomConfig[];
}

interface GuestRoomSelectorProps {
  value: GuestConfig;
  onChange: (config: GuestConfig) => void;
  onMultiRoomChange?: (config: MultiRoomConfig) => void;
  className?: string;
}

export function GuestRoomSelector({ value, onChange, onMultiRoomChange, className }: GuestRoomSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [multiRoomConfig, setMultiRoomConfig] = useState<MultiRoomConfig>({
    rooms: [{ adults: value.adults, children: value.children }]
  });

  // Sync multi-room config when value changes
  React.useEffect(() => {
    if (value.rooms === 1) {
      setMultiRoomConfig({
        rooms: [{ adults: value.adults, children: value.children }]
      });
    } else {
      // Initialize multi-room config with current data
      const rooms = Array.from({ length: value.rooms }, (_, i) => 
        i === 0 
          ? { adults: value.adults, children: value.children }
          : multiRoomConfig.rooms[i] || { adults: 2, children: [] }
      );
      setMultiRoomConfig({ rooms });
    }
  }, [value.rooms]);

  const updateAdults = (increment: boolean) => {
    const newAdults = increment ? value.adults + 1 : Math.max(1, value.adults - 1);
    onChange({ ...value, adults: newAdults });
  };

  const updateChildren = (increment: boolean) => {
    if (increment) {
      onChange({ ...value, children: [...value.children, 12] }); // Default age 12
    } else if (value.children.length > 0) {
      const newChildren = [...value.children];
      newChildren.pop();
      onChange({ ...value, children: newChildren });
    }
  };

  const updateChildAge = (index: number, age: number) => {
    const newChildren = [...value.children];
    newChildren[index] = Math.max(0, Math.min(17, age));
    onChange({ ...value, children: newChildren });
  };

  const updateRooms = (increment: boolean) => {
    const newRooms = increment ? value.rooms + 1 : Math.max(1, value.rooms - 1);
    onChange({ ...value, rooms: newRooms });
    
    // Update multi-room config
    if (newRooms > 1) {
      const rooms = Array.from({ length: newRooms }, (_, i) => 
        multiRoomConfig.rooms[i] || { adults: 2, children: [] }
      );
      const updatedConfig = { rooms };
      setMultiRoomConfig(updatedConfig);
      onMultiRoomChange?.(updatedConfig);
    }
  };

  const updateMultiRoomAdults = (roomIndex: number, increment: boolean) => {
    const rooms = [...multiRoomConfig.rooms];
    const currentAdults = rooms[roomIndex].adults;
    rooms[roomIndex] = {
      ...rooms[roomIndex],
      adults: increment ? currentAdults + 1 : Math.max(1, currentAdults - 1)
    };
    const updatedConfig = { rooms };
    setMultiRoomConfig(updatedConfig);
    onMultiRoomChange?.(updatedConfig);
    
    // Update main config with totals
    const totalAdults = rooms.reduce((sum, room) => sum + room.adults, 0);
    onChange({ ...value, adults: totalAdults });
  };

  const updateMultiRoomChildren = (roomIndex: number, increment: boolean) => {
    const rooms = [...multiRoomConfig.rooms];
    if (increment) {
      rooms[roomIndex] = {
        ...rooms[roomIndex],
        children: [...rooms[roomIndex].children, 12]
      };
    } else if (rooms[roomIndex].children.length > 0) {
      const newChildren = [...rooms[roomIndex].children];
      newChildren.pop();
      rooms[roomIndex] = {
        ...rooms[roomIndex],
        children: newChildren
      };
    }
    const updatedConfig = { rooms };
    setMultiRoomConfig(updatedConfig);
    onMultiRoomChange?.(updatedConfig);
  };

  const updateMultiRoomChildAge = (roomIndex: number, childIndex: number, age: number) => {
    const rooms = [...multiRoomConfig.rooms];
    rooms[roomIndex].children[childIndex] = Math.max(0, Math.min(17, age));
    const updatedConfig = { rooms };
    setMultiRoomConfig(updatedConfig);
    onMultiRoomChange?.(updatedConfig);
  };

  const getDisplayText = () => {
    const guestText = `${value.adults} adult${value.adults !== 1 ? 's' : ''}${
      value.children.length > 0 ? `, ${value.children.length} child${value.children.length !== 1 ? 'ren' : ''}` : ''
    }`;
    const roomText = `${value.rooms} room${value.rooms !== 1 ? 's' : ''}`;
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
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          {value.rooms === 1 ? (
            // Single Room Mode
            <>
              {/* Adults */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Adults</Label>
                  <p className="text-sm text-muted-foreground">Age 18+</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateAdults(false)}
                    disabled={value.adults <= 1}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{value.adults}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateAdults(true)}
                    disabled={value.adults >= 8}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Children</Label>
                  <p className="text-sm text-muted-foreground">Age 0-17</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateChildren(false)}
                    disabled={value.children.length === 0}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{value.children.length}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateChildren(true)}
                    disabled={value.children.length >= 4}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Children Ages */}
              {value.children.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Children's Ages</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {value.children.map((age, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Label className="text-xs w-12">Child {index + 1}:</Label>
                        <Input
                          type="number"
                          min="0"
                          max="17"
                          value={age}
                          onChange={(e) => updateChildAge(index, parseInt(e.target.value) || 0)}
                          className="h-8 text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            // Multi-Room Mode
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {multiRoomConfig.rooms.map((room, roomIndex) => (
                <div key={roomIndex} className="border rounded-lg p-3 space-y-3">
                  <Label className="font-medium text-sm">Room {roomIndex + 1}</Label>
                  
                  {/* Adults per room */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Adults</Label>
                      <p className="text-xs text-muted-foreground">Age 18+</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateMultiRoomAdults(roomIndex, false)}
                        disabled={room.adults <= 1}
                        className="h-7 w-7 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-sm">{room.adults}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateMultiRoomAdults(roomIndex, true)}
                        disabled={room.adults >= 8}
                        className="h-7 w-7 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Children per room */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Children</Label>
                      <p className="text-xs text-muted-foreground">Age 0-17</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateMultiRoomChildren(roomIndex, false)}
                        disabled={room.children.length === 0}
                        className="h-7 w-7 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-sm">{room.children.length}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateMultiRoomChildren(roomIndex, true)}
                        disabled={room.children.length >= 4}
                        className="h-7 w-7 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Children Ages per room */}
                  {room.children.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Children's Ages</Label>
                      <div className="grid grid-cols-2 gap-1">
                        {room.children.map((age, childIndex) => (
                          <div key={childIndex} className="flex items-center space-x-1">
                            <Label className="text-xs w-8">#{childIndex + 1}:</Label>
                            <Input
                              type="number"
                              min="0"
                              max="17"
                              value={age}
                              onChange={(e) => updateMultiRoomChildAge(roomIndex, childIndex, parseInt(e.target.value) || 0)}
                              className="h-6 text-xs"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Rooms */}
          <div className="flex items-center justify-between border-t pt-3">
            <div>
              <Label className="font-medium">Rooms</Label>
              <p className="text-sm text-muted-foreground">Separate rooms</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateRooms(false)}
                disabled={value.rooms <= 1}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{value.rooms}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateRooms(true)}
                disabled={value.rooms >= 4}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

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
