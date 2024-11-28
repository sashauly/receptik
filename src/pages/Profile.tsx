// import { useAuth0 } from "@auth0/auth0-react";
import { Avatar, Button } from "@mantine/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut } from "lucide-react";

export default function Profile() {
  // const { user, logout } = useAuth0();
  // TODO remove placeholder
  const user = {
    name: "Michael Scott",
    email: "michael.scott@mail.ru",
  };

  // if (!user) {
  //   return null;
  // }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar
              // src={user.picture}
              alt={user.name}
              variant="default"
              className="h-20 w-20"
            />
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            // onClick={() => logout()}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
