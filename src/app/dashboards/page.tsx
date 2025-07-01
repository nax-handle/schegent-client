"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Info,
  Home,
  Zap,
  Clock,
  Headphones,
  Coffee,
  Users,
  Truck,
} from "lucide-react";

export default function Component() {
  return (
    <div className="p-6 bg-gray-50 dark:bg-primarydark ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-black dark:text-white">
        {/* My time breakdown */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              My time breakdown
            </CardTitle>
            <Info className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-32 h-32">
                <svg
                  className="w-32 h-32 transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#6366f1"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray="251.2"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Shallow work</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* My time breakdown trend */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              My time breakdown trend
            </CardTitle>
            <Info className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-end justify-between px-4">
              <div className="flex flex-col items-center gap-2">
                <div className="h-0 w-8 bg-indigo-500 rounded-t"></div>
                <div className="text-xs text-gray-500 text-center">
                  <div>May</div>
                  <div>15</div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="h-32 w-8 bg-indigo-500 rounded-t"></div>
                <div className="text-xs text-gray-500 text-center">
                  <div>Jun</div>
                  <div>2</div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="h-0 w-8 bg-indigo-500 rounded-t"></div>
                <div className="text-xs text-gray-500 text-center">
                  <div>Jun</div>
                  <div>9</div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="h-0 w-8 bg-indigo-500 rounded-t"></div>
                <div className="text-xs text-gray-500 text-center">
                  <div>Jun</div>
                  <div>16</div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="h-0 w-8 bg-indigo-500 rounded-t"></div>
                <div className="text-xs text-gray-500 text-center">
                  <div>Jun</div>
                  <div>23</div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Shallow work</span>
            </div>
            <div className="text-xs text-gray-400 mt-2">2.3 hrs</div>
          </CardContent>
        </Card>

        {/* Focus vs. Shallow Work */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              Focus vs. Shallow Work
            </CardTitle>
            <Info className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">
                Your most productive day was
              </p>
              <p className="font-semibold">Wednesday</p>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-4">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day, index) => (
                <div
                  key={day}
                  className={`text-xs text-center py-1 rounded ${
                    day === "We"
                      ? "bg-indigo-100 text-indigo-700 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-sm">Focus time</span>
                </div>
                <span className="text-2xl font-bold">0%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                  <span className="text-sm">Shallow work</span>
                </div>
                <span className="text-2xl font-bold">100%</span>
              </div>

              <div className="w-full bg-indigo-500 h-2 rounded-full"></div>
            </div>
          </CardContent>
        </Card>

        {/* Habits & Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              Habits & Tasks
            </CardTitle>
            <Info className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Button
                variant="default"
                size="sm"
                className="bg-indigo-500 hover:bg-indigo-600"
              >
                Work
              </Button>
              <Button variant="outline" size="sm">
                Personal
              </Button>
            </div>

            <div className="h-32 flex items-end justify-between px-2">
              <div className="flex flex-col items-center gap-2">
                <div className="h-0 w-6 bg-indigo-500 rounded-t"></div>
                <div className="text-xs text-gray-500 text-center">
                  <div>May</div>
                  <div>31</div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="h-24 w-6 bg-indigo-500 rounded-t"></div>
                <div className="text-xs text-gray-500 text-center">
                  <div>Jun</div>
                  <div>15</div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="h-0 w-6 bg-indigo-500 rounded-t"></div>
                <div className="text-xs text-gray-500 text-center">
                  <div>Jun</div>
                  <div>16</div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="h-0 w-6 bg-indigo-500 rounded-t"></div>
                <div className="text-xs text-gray-500 text-center">
                  <div>Jun</div>
                  <div>5</div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="h-0 w-6 bg-indigo-500 rounded-t"></div>
                <div className="text-xs text-gray-500 text-center">
                  <div>Jun</div>
                  <div>20</div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="h-0 w-6 bg-indigo-500 rounded-t"></div>
                <div className="text-xs text-gray-500 text-center">
                  <div>Jun</div>
                  <div>22</div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Tasks</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">2.3 hrs</div>
          </CardContent>
        </Card>

        {/* Meetings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Meetings</CardTitle>
            <Info className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-32">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Users className="h-6 w-6 text-gray-400" />
            </div>
            <p className="font-medium text-gray-900 mb-1">No meeting data</p>
            <p className="text-xs text-gray-500 text-center">
              This shows the average time spent in external, one-on-one, and
              team meetings.
            </p>
          </CardContent>
        </Card>

        {/* You met with 0 people */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              You met with 0 people
            </CardTitle>
            <Info className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">0</div>
              <p className="text-sm text-gray-500">People met with</p>
            </div>
          </CardContent>
        </Card>

        {/* Work-life balance */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              Work-life balance
            </CardTitle>
            <Info className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Home className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-gray-500">
                    Personal hours on average
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-gray-500">
                    Average hours of vacation
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-gray-500">
                    Hours worked outside normal hours
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom metrics row */}
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Headphones className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <div className="text-xl font-bold">0.07</div>
                  <div className="text-xs text-gray-500">
                    Hours reclaimed for Focus Time
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Coffee className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <div className="text-xl font-bold">0</div>
                  <div className="text-xs text-gray-500">
                    Hours of breaks between meetings
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <div className="text-xl font-bold">0</div>
                  <div className="text-xs text-gray-500">
                    Meetings scheduled for you by Reclaim
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Truck className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <div className="text-xl font-bold">0</div>
                  <div className="text-xs text-gray-500">
                    Hours of travel time blocked
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
