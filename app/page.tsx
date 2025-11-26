"use client";
import { useState, useEffect } from "react";
import { useQuickAuth, useMiniKit } from "@coinbase/onchainkit/minikit";
import { useRouter } from "next/navigation";
import { minikitConfig } from "../minikit.config";
import styles from "./page.module.css";
import { LogOut, Wallet } from "lucide-react";

interface AuthResponse {
  success: boolean;
  user?: {
    fid: number; // FID is the unique identifier for the user
    issuedAt?: number;
    expiresAt?: number;
  };
  message?: string; // Error messages come as 'message' not 'error'
}


export default function Home() {
  const { isFrameReady, setFrameReady, context } = useMiniKit();
  const [error, setError] = useState("");
  const router = useRouter();

  // Initialize the  miniapp
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);



  // If you need to verify the user's identity, you can use the useQuickAuth hook.
  // This hook will verify the user's signature and return the user's FID. You can update
  // this to meet your needs. See the /app/api/auth/route.ts file for more details.
  // Note: If you don't need to verify the user's identity, you can get their FID and other user data
  // via `context.user.fid`.
  // const { data, isLoading, error } = useQuickAuth<{
  //   userFid: string;
  // }>("/api/auth");

  const { data: authData, isLoading: isAuthLoading, error: authError } = useQuickAuth<AuthResponse>(
    "/api/auth",
    { method: "GET" }
  );

  const handleLogout = () => {
    console.log("Logout");
  };

  const handleConnectWallet = () => {
    setError("");

    // Check authentication first
    // if (isAuthLoading) {
    //   setError("Please wait while we verify your identity...");
    //   return;
    // }

    // if (authError || !authData?.success) {
    //   setError("Please authenticate to join the waitlist");
    //   return;
    // }


    router.push("/onboard");
  };

  return (
    <div className={styles.container}>
      <div className="flex justify-end py-4 px-4">
        <div className="badge badge-outline badge-md flex text-center items-center gap-2">
          <Wallet className="w-4 h-4 text-green-500" />
          {context?.user?.displayName || "test"}
          <LogOut className="w-4 h-4 cursor-pointer" onClick={handleLogout} />
        </div>
      </div>
      <div className={styles.content}>
        <div className="card card-xl w-96 bg-base-100 shadow-sm">
          <div className="card-body items-center text-center">
            <h2 className="card-title">{minikitConfig.miniapp.name.toUpperCase()}</h2>
            <div className="badge badge-outline badge-md flex text-center items-center gap-2">
              <Wallet className="w-4 h-4 text-green-500" />
              {context?.user?.displayName || "test"}
            </div>
            <div className="text-center">
              여기에 설명 넣기
            </div>
            <div className="card-actions">
              <button
                type="button"
                onClick={handleConnectWallet}
                className="btn btn-primary mt-4">Connect Wallet</button>
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <p className={styles.error}>여기에 에러표시</p>
          </div>
        </div>
      </div>
    </div>
  );
}
