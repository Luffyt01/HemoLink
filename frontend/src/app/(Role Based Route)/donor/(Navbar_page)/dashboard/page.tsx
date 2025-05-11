import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";

export default function DonorDashboard() {
  // Mock data
  const donorStats = {
    totalDonations: 12450,
    lastDonation: 750,
    donationStreak: 18,
    monthlyGoal: 85,
    impact: 245,
    favoriteCause: "Education",
    donorLevel: "Gold",
    nextMilestone: 15000,
  };

  const recentDonations = [
    { id: 1, amount: 750, date: "2023-11-15", cause: "Clean Water Initiative" },
    { id: 2, amount: 500, date: "2023-10-28", cause: "Education Fund" },
    { id: 3, amount: 1000, date: "2023-10-10", cause: "Disaster Relief" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back, Alex!</h1>
          <p className="text-muted-foreground">Your generosity is changing lives every day</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Donations Card */}
          <Card className="bg-gradient-to-br from-blue-100 to-indigo-100 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Total Donations</CardTitle>
              <CardDescription>All-time contributions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">
                ${donorStats.totalDonations.toLocaleString()}
              </div>
              <div className="mt-2 text-sm text-blue-700">
                <span className="inline-flex items-center">
                  <Icons.trendingUp className="h-4 w-4 mr-1" />
                  12% increase from last year
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Last Donation Card */}
          <Card className="bg-gradient-to-br from-purple-100 to-pink-100 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-800">Last Donation</CardTitle>
              <CardDescription>Most recent contribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">
                ${donorStats.lastDonation.toLocaleString()}
              </div>
              <div className="mt-2 text-sm text-purple-700">
                Clean Water Initiative
              </div>
            </CardContent>
          </Card>

          {/* Donation Streak Card */}
          <Card className="bg-gradient-to-br from-green-100 to-teal-100 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">Donation Streak</CardTitle>
              <CardDescription>Consecutive months donating</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">
                {donorStats.donationStreak} months
              </div>
              <div className="mt-2 text-sm text-green-700">
                <span className="inline-flex items-center">
                  <Icons.flame className="h-4 w-4 mr-1 text-orange-500" />
                  Keep the streak going!
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Impact Card */}
          <Card className="bg-gradient-to-br from-amber-100 to-orange-100 border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-800">Lives Impacted</CardTitle>
              <CardDescription>Estimated people helped</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-900">
                {donorStats.impact}+
              </div>
              <div className="mt-2 text-sm text-amber-700">
                <span className="inline-flex items-center">
                  <Icons.heart className="h-4 w-4 mr-1 text-red-500" />
                  You're making a difference
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress and Recent Donations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Monthly Goal */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Monthly Goal</CardTitle>
              <CardDescription>Your progress this month</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={donorStats.monthlyGoal} className="h-3" />
              <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                <span>{donorStats.monthlyGoal}% of goal</span>
                <span>3 days left</span>
              </div>
              <Button variant="outline" className="mt-4 w-full">
                Make a Donation
              </Button>
            </CardContent>
          </Card>

          {/* Recent Donations */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Donations</CardTitle>
              <CardDescription>Your last 3 contributions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentDonations.map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="bg-blue-100 text-blue-600">
                        <Icons.donate className="h-5 w-5" />
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">
                          {donation.cause}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(donation.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="font-bold">${donation.amount.toLocaleString()}</div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="mt-4 w-full">
                View All Donations
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Donor Level */}
          <Card className="bg-gradient-to-br from-indigo-50 to-blue-50">
            <CardHeader>
              <CardTitle>Donor Level</CardTitle>
              <CardDescription>Your status in our community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Badge variant="premium" className="px-4 py-2 text-lg">
                  {donorStats.donorLevel}
                </Badge>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Next milestone at ${donorStats.nextMilestone.toLocaleString()}
                  </p>
                  <Progress 
                    value={(donorStats.totalDonations / donorStats.nextMilestone) * 100} 
                    className="h-2 mt-2" 
                  />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2 text-center text-sm">
                <div className="p-2 rounded bg-blue-100 text-blue-800">Bronze</div>
                <div className="p-2 rounded bg-blue-100 text-blue-800">Silver</div>
                <div className="p-2 rounded bg-amber-100 text-amber-800 font-bold">Gold</div>
                <div className="p-2 rounded bg-purple-100 text-purple-800">Platinum</div>
              </div>
            </CardContent>
          </Card>

          {/* Favorite Cause */}
          <Card className="bg-gradient-to-br from-green-50 to-teal-50">
            <CardHeader>
              <CardTitle>Favorite Cause</CardTitle>
              <CardDescription>You support this the most</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <Icons.book className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xl font-bold">{donorStats.favoriteCause}</p>
                  <p className="text-sm text-muted-foreground">
                    42% of your donations go here
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">Suggested Similar Causes</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Literacy Programs</Badge>
                  <Badge variant="secondary">School Supplies</Badge>
                  <Badge variant="secondary">Scholarships</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}