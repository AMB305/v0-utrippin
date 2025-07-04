import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Users, Share2, Calendar } from "lucide-react";

export default function SocialPlanning() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5" />
          Plan Together
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <Share2 className="mx-auto h-8 w-8 text-blue-600 mb-2" />
            <h4 className="font-semibold mb-2">Share Itineraries</h4>
            <p className="text-sm text-gray-600">Collaborate with friends and family on trip planning</p>
          </div>
          <div className="text-center">
            <Calendar className="mx-auto h-8 w-8 text-blue-600 mb-2" />
            <h4 className="font-semibold mb-2">Group Booking</h4>
            <p className="text-sm text-gray-600">Book together and save on group rates</p>
          </div>
          <div className="text-center">
            <Users className="mx-auto h-8 w-8 text-blue-600 mb-2" />
            <h4 className="font-semibold mb-2">Split Costs</h4>
            <p className="text-sm text-gray-600">Easily split expenses with your travel companions</p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Button>Start Planning Together</Button>
        </div>
      </CardContent>
    </Card>
  );
}