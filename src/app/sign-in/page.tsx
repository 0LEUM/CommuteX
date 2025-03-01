/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Changed from next/router
import { useAuth } from "@/context/AuthContext"; // Import custom authentication context

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MagicCard } from "@/components/magicui/magic-card";
import { useTheme } from "next-themes";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

export default function SignIn() {
  const { login } = useAuth(); // Use custom authentication
  const router = useRouter();
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    try {
      const success = login(email, password);
      if (success) {
        router.push("/dashboard"); // Navigate to Dashboard
      } else {
        alert("Invalid credentials"); // Show error message
      }
    } catch (err) {
      console.error("Error signing in:", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <MagicCard gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    value={email} 
                    type="email" 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    value={password} 
                    type="password"
                    onChange={(e) => setPassword(e.target.value)} />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <RainbowButton onClick={handleSignIn} className="w-full">Sign In</RainbowButton>
            <ShimmerButton className="w-full">Login</ShimmerButton>
          </CardFooter>
        </MagicCard>
      </Card>
    </div>
  );
}
