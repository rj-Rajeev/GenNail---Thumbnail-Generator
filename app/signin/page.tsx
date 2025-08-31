// app/signin/page.tsx
"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <SignIn path="/signin" routing="path" signUpUrl="/signup" />
    </div>
  );
}
